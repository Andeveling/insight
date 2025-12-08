"use server";

import { generateObject } from "ai";
import { connection } from "next/server";
import {
  canRegenerate,
  generateStrengthsHash,
  getModel,
  getModelId,
} from "@/lib/ai";
import { prisma } from "@/lib/prisma.db";
import {
  buildTeamReportPrompt,
  TEAM_REPORT_SYSTEM_PROMPT,
  type TeamPromptContext,
} from "../_lib/ai-prompts";
import { TeamReportSchema } from "../_schemas/team-report.schema";

export interface GenerateTeamReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
  fromCache?: boolean;
  canRegenerate?: boolean;
  regenerateMessage?: string;
}

export interface GenerateTeamReportOptions {
  teamId: string;
  forceRegenerate?: boolean;
}

/**
 * Generate a team assessment report
 *
 * @description
 * - Checks if report already exists (returns cached if not regenerating)
 * - Gathers all team members with their strengths and profiles
 * - Generates report using AI SDK with structured output (uses powerful model)
 * - Saves report to database with version tracking
 */
export async function generateTeamReport(
  options: GenerateTeamReportOptions,
): Promise<GenerateTeamReportResult> {
  await connection();

  const { teamId, forceRegenerate = false } = options;

  try {
    // Fetch team with all members and their strengths first
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true,
                userStrengths: {
                  include: {
                    strength: {
                      include: {
                        domain: true,
                      },
                    },
                  },
                  orderBy: { rank: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return { success: false, error: "Equipo no encontrado" };
    }

    if (team.members.length === 0) {
      return { success: false, error: "El equipo no tiene miembros" };
    }

    // Check if members have strengths
    const membersWithStrengths = team.members.filter(
      (m) => m.user.userStrengths.length > 0,
    );

    if (membersWithStrengths.length === 0) {
      return {
        success: false,
        error: "Ningún miembro del equipo tiene fortalezas asignadas",
      };
    }

    // Calculate team strengths hash (combination of all member strengths)
    const allTeamStrengths = membersWithStrengths.flatMap((m) =>
      m.user.userStrengths.map((us) => ({
        strengthId: `${m.userId}-${us.strengthId}`,
        rank: us.rank,
      })),
    );
    const currentStrengthsHash = generateStrengthsHash(allTeamStrengths);

    // Check for existing report
    const existingReport = await prisma.report.findFirst({
      where: {
        teamId,
        type: "TEAM_FULL",
        status: "COMPLETED",
      },
      orderBy: { version: "desc" },
    });

    // Parse existing metadata
    const existingMetadata = existingReport?.metadata
      ? (JSON.parse(existingReport.metadata) as {
        strengthsHash?: string;
        generatedAt?: string;
      })
      : null;

    // Check regeneration policy
    if (existingReport && forceRegenerate) {
      const regenerationCheck = canRegenerate({
        lastGeneratedAt: existingReport.updatedAt,
        lastStrengthsHash: existingMetadata?.strengthsHash ?? null,
        currentStrengthsHash,
      });

      if (!regenerationCheck.allowed) {
        return {
          success: true,
          reportId: existingReport.id,
          fromCache: true,
          canRegenerate: false,
          regenerateMessage: regenerationCheck.reason,
        };
      }
    }

    // Return cached report if exists and not forcing regeneration
    if (existingReport && !forceRegenerate) {
      const regenerationCheck = canRegenerate({
        lastGeneratedAt: existingReport.updatedAt,
        lastStrengthsHash: existingMetadata?.strengthsHash ?? null,
        currentStrengthsHash,
      });

      return {
        success: true,
        reportId: existingReport.id,
        fromCache: true,
        canRegenerate: regenerationCheck.allowed,
        regenerateMessage: regenerationCheck.reason,
      };
    }

    // Calculate next version
    const nextVersion = existingReport ? existingReport.version + 1 : 1;

    // Upsert report record (create or update if exists)
    const pendingReport = await prisma.report.upsert({
      where: {
        type_teamId: {
          type: "TEAM_FULL",
          teamId: team.id,
        },
      },
      update: {
        status: "GENERATING",
        version: nextVersion,
        modelUsed: getModelId(),
        content: null,
        metadata: null,
      },
      create: {
        type: "TEAM_FULL",
        status: "GENERATING",
        version: nextVersion,
        teamId: team.id,
        modelUsed: getModelId(),
      },
    });

    try {
      // Build prompt context
      const promptContext: TeamPromptContext = {
        team: {
          name: team.name,
          description: team.description ?? undefined,
        },
        members: membersWithStrengths.map((member) => ({
          name: member.user.name,
          role: member.role ?? undefined,
          career: member.user.profile?.career ?? undefined,
          strengths: member.user.userStrengths.map((us) => ({
            rank: us.rank,
            name: us.strength.name,
            domain: us.strength.domain.name,
          })),
        })),
      };

      const startTime = Date.now();

      // Generate report using AI SDK with powerful model for team analysis
      const result = await generateObject({
        model: getModel("team"),
        schema: TeamReportSchema,
        system: TEAM_REPORT_SYSTEM_PROMPT,
        prompt: buildTeamReportPrompt(promptContext),
        maxOutputTokens: 16000, // Ensure enough tokens for complex team schema
      });

      const duration = Date.now() - startTime;

      // Update report with generated content (include strengthsHash for regeneration policy)
      await prisma.report.update({
        where: { id: pendingReport.id },
        data: {
          status: "COMPLETED",
          content: JSON.stringify(result.object),
          metadata: JSON.stringify({
            generatedAt: new Date().toISOString(),
            durationMs: duration,
            usage: result.usage,
            strengthsHash: currentStrengthsHash,
            memberCount: membersWithStrengths.length,
          }),
        },
      });

      // Delete old report if regenerating
      if (existingReport && forceRegenerate) {
        await prisma.report.delete({ where: { id: existingReport.id } });
      }

      return {
        success: true,
        reportId: pendingReport.id,
        fromCache: false,
      };
    } catch (aiError) {
      // Mark report as failed
      await prisma.report.update({
        where: { id: pendingReport.id },
        data: {
          status: "FAILED",
          error: aiError instanceof Error ? aiError.message : "Unknown error",
        },
      });

      throw aiError;
    }
  } catch (error) {
    console.error("[generateTeamReport] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate report",
    };
  }
}

/**
 * Get an existing team report
 */
export async function getTeamReport(teamId: string) {
  await connection();

  const report = await prisma.report.findFirst({
    where: {
      teamId,
      type: "TEAM_FULL",
      status: "COMPLETED",
    },
    orderBy: { version: "desc" },
  });

  if (!report || !report.content) {
    return null;
  }

  return {
    id: report.id,
    version: report.version,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    modelUsed: report.modelUsed,
    metadata: report.metadata ? JSON.parse(report.metadata) : null,
    content: JSON.parse(report.content),
  };
}

/**
 * Get all reports for a team
 */
export async function getTeamReports(teamId: string) {
  await connection();

  const reports = await prisma.report.findMany({
    where: {
      teamId,
      status: "COMPLETED",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      version: true,
      createdAt: true,
      modelUsed: true,
    },
  });

  return reports;
}
