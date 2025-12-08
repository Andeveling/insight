"use server";

import { generateObject } from "ai";
import { connection } from "next/server";
import { getModel, getModelId, type ModelProvider } from "@/lib/ai";
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
}

export interface GenerateIndividualReportOptions {
  userId: string;
  forceRegenerate?: boolean;
  provider?: ModelProvider;
}

/**
 * Generate an individual strength report for a user
 *
 * @description
 * - Checks if report already exists (returns cached if not regenerating)
 * - Gathers full user context (profile, strengths, team)
 * - Generates report using AI SDK with structured output
 * - Saves report to database with version tracking
 */
export async function generateIndividualReport(
  options: GenerateIndividualReportOptions,
): Promise<GenerateIndividualReportResult> {
  await connection();

  const { userId, forceRegenerate = false, provider = "openai" } = options;

  try {
    // Check for existing report
    const existingReport = await prisma.report.findFirst({
      where: {
        userId,
        type: "INDIVIDUAL_FULL",
        status: "COMPLETED",
      },
      orderBy: { version: "desc" },
    });

    // Return cached report if exists and not forcing regeneration
    if (existingReport && !forceRegenerate) {
      return {
        success: true,
        reportId: existingReport.id,
        fromCache: true,
      };
    }

    // Fetch full user context
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
      return { success: false, error: "User not found" };
    }

    if (user.userStrengths.length === 0) {
      return { success: false, error: "User has no strengths assigned" };
    }

    // Calculate next version
    const nextVersion = existingReport ? existingReport.version + 1 : 1;

    // Create pending report record
    const pendingReport = await prisma.report.create({
      data: {
        type: "INDIVIDUAL_FULL",
        status: "GENERATING",
        version: nextVersion,
        userId: user.id,
        modelUsed: getModelId("individual", provider),
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
        model: getModel("individual", provider),
        schema: IndividualReportSchema,
        system: INDIVIDUAL_REPORT_SYSTEM_PROMPT,
        prompt: buildIndividualReportPrompt(promptContext),
      });

      const duration = Date.now() - startTime;

      // Update report with generated content
      await prisma.report.update({
        where: { id: pendingReport.id },
        data: {
          status: "COMPLETED",
          content: JSON.stringify(result.object),
          metadata: JSON.stringify({
            generatedAt: new Date().toISOString(),
            durationMs: duration,
            usage: result.usage,
            provider,
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
