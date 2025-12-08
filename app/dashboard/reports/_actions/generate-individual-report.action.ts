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
  buildIndividualReportPrompt,
  INDIVIDUAL_REPORT_SYSTEM_PROMPT,
  type IndividualPromptContext,
} from "../_lib/ai-prompts";
import { IndividualReportSchema } from "../_schemas/individual-report.schema";

export interface GenerateIndividualReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
  fromCache?: boolean;
  canRegenerate?: boolean;
  regenerateMessage?: string;
}

export interface GenerateIndividualReportOptions {
  userId: string;
  forceRegenerate?: boolean;
}

/**
 * Generate an individual strength report for a user
 *
 * @description
 * - Checks if report already exists (returns cached if not regenerating)
 * - Enforces regeneration policy: 30 days minimum OR strength changes
 * - Gathers full user context (profile, strengths, team)
 * - Generates report using AI SDK with structured output
 * - Saves report to database with version tracking
 */
export async function generateIndividualReport(
  options: GenerateIndividualReportOptions,
): Promise<GenerateIndividualReportResult> {
  await connection();

  const { userId, forceRegenerate = false } = options;

  try {
    // Fetch full user context first (needed for both cache check and generation)
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        teamMembers: {
          include: {
            team: true,
          },
          take: 1, // Get primary team
        },
      },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    if (user.userStrengths.length === 0) {
      return { success: false, error: "No tienes fortalezas asignadas" };
    }

    // Calculate current strengths hash for change detection
    const currentStrengthsHash = generateStrengthsHash(
      user.userStrengths.map((us) => ({
        strengthId: us.strengthId,
        rank: us.rank,
      })),
    );

    // Check for existing report
    const existingReport = await prisma.report.findFirst({
      where: {
        userId,
        type: "INDIVIDUAL_FULL",
        status: "COMPLETED",
      },
      orderBy: { version: "desc" },
    });

    // Parse existing metadata to get last strengths hash
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
      // Calculate if regeneration would be allowed
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
        type_userId: {
          type: "INDIVIDUAL_FULL",
          userId: user.id,
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
        type: "INDIVIDUAL_FULL",
        status: "GENERATING",
        version: nextVersion,
        userId: user.id,
        modelUsed: getModelId(),
      },
    });

    try {
      // Build prompt context
      const promptContext: IndividualPromptContext = {
        user: {
          name: user.name,
          email: user.email,
          profile: user.profile
            ? {
              career: user.profile.career ?? undefined,
              age: user.profile.age ?? undefined,
              gender: user.profile.gender ?? undefined,
              description: user.profile.description ?? undefined,
              hobbies: user.profile.hobbies
                ? JSON.parse(user.profile.hobbies)
                : undefined,
            }
            : undefined,
          strengths: user.userStrengths.map((us) => ({
            rank: us.rank,
            name: us.strength.name,
            nameEs: us.strength.nameEs,
            domain: us.strength.domain.name,
            briefDefinition: us.strength.briefDefinition,
          })),
        },
        team: user.teamMembers[ 0 ]
          ? {
            name: user.teamMembers[ 0 ].team.name,
            role: user.teamMembers[ 0 ].role ?? undefined,
          }
          : undefined,
      };

      const startTime = Date.now();

      // Generate report using AI SDK
      const result = await generateObject({
        model: getModel("individual"),
        schema: IndividualReportSchema,
        system: INDIVIDUAL_REPORT_SYSTEM_PROMPT,
        prompt: buildIndividualReportPrompt(promptContext),
        maxOutputTokens: 16000, // Ensure enough tokens for complex schema
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
    console.error("[generateIndividualReport] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate report",
    };
  }
}

/**
 * Get an existing individual report
 */
export async function getIndividualReport(userId: string) {
  await connection();

  const report = await prisma.report.findFirst({
    where: {
      userId,
      type: "INDIVIDUAL_FULL",
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
