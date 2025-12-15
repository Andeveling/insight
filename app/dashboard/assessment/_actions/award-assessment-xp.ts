"use server";

/**
 * Server Action: Award Assessment XP
 * Awards XP for assessment milestones (phase completions and final completion)
 * Part of Feature 005: Gamification Integration
 */

import { prisma } from "@/lib/prisma.db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { awardXp, checkBadgeUnlocks } from "@/lib/services/gamification.service";
import { ASSESSMENT_XP_REWARDS } from "@/lib/constants/xp-rewards";
import {
  AwardAssessmentXpInputSchema,
  type AssessmentMilestone,
  type XpAwardedTracking,
} from "../_schemas/award-xp.schema";
import type { AwardXpResult, UnlockedBadge } from "@/lib/types/gamification.types";

export interface AwardAssessmentXpResult {
  success: boolean;
  xpResult?: AwardXpResult;
  unlockedBadges?: UnlockedBadge[];
  alreadyAwarded?: boolean;
  error?: string;
}

/**
 * Maps milestone to XP source type for tracking
 */
function getMilestoneXpSource(
  milestone: AssessmentMilestone,
  isRetake: boolean
): "assessment_phase_1" | "assessment_phase_2" | "assessment_complete" | "assessment_retake" {
  if (milestone === "completion" && isRetake) {
    return "assessment_retake";
  }

  const sourceMap = {
    phase_1: "assessment_phase_1",
    phase_2: "assessment_phase_2",
    completion: "assessment_complete",
  } as const;

  return sourceMap[ milestone ];
}

/**
 * Gets XP amount for milestone
 */
function getMilestoneXp(milestone: AssessmentMilestone, isRetake: boolean): number {
  if (milestone === "completion" && isRetake) {
    return ASSESSMENT_XP_REWARDS.ASSESSMENT_RETAKE;
  }

  const xpMap = {
    phase_1: ASSESSMENT_XP_REWARDS.PHASE_1_COMPLETE,
    phase_2: ASSESSMENT_XP_REWARDS.PHASE_2_COMPLETE,
    completion: ASSESSMENT_XP_REWARDS.ASSESSMENT_COMPLETE,
  };

  return xpMap[ milestone ];
}

/**
 * Maps milestone to tracking field in XpAwardedTracking
 */
function getMilestoneTrackingKey(
  milestone: AssessmentMilestone,
  isRetake: boolean
): keyof XpAwardedTracking {
  if (milestone === "completion" && isRetake) {
    return "retakeBonus";
  }

  const keyMap: Record<AssessmentMilestone, keyof XpAwardedTracking> = {
    phase_1: "phase1",
    phase_2: "phase2",
    completion: "completion",
  };

  return keyMap[ milestone ];
}

/**
 * Award XP for completing an assessment milestone
 */
export async function awardAssessmentXp(
  input: unknown
): Promise<AwardAssessmentXpResult> {
  try {
    // Validate input
    const validationResult = AwardAssessmentXpInputSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[ 0 ]?.message ?? "Entrada inválida",
      };
    }

    const { sessionId, milestone } = validationResult.data;

    // Verify user authentication
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const userId = userSession.user.id;

    // Get assessment session
    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        userId: true,
        status: true,
        phase: true,
        results: true,
        createdAt: true,
      },
    });

    if (!assessmentSession) {
      return { success: false, error: "Sesión no encontrada" };
    }

    if (assessmentSession.userId !== userId) {
      return { success: false, error: "Acceso denegado" };
    }

    // Parse existing XP tracking from results
    let resultsData: Record<string, unknown> = {};
    if (assessmentSession.results) {
      try {
        resultsData = JSON.parse(assessmentSession.results);
      } catch {
        resultsData = {};
      }
    }

    const xpAwarded: XpAwardedTracking = (resultsData.xpAwarded as XpAwardedTracking) ?? {};

    // Check if this is a retake (user has previous completed assessments)
    const previousCompletedCount = await prisma.assessmentSession.count({
      where: {
        userId,
        status: "COMPLETED",
        id: { not: sessionId },
        createdAt: { lt: assessmentSession.createdAt },
      },
    });

    const isRetake = previousCompletedCount > 0;
    const trackingKey = getMilestoneTrackingKey(milestone, isRetake);

    // Check if already awarded
    if (xpAwarded[ trackingKey ]) {
      return {
        success: true,
        alreadyAwarded: true,
      };
    }

    // Calculate XP amount
    const xpAmount = getMilestoneXp(milestone, isRetake);
    const xpSource = getMilestoneXpSource(milestone, isRetake);

    // Award XP
    const xpResult = await awardXp({
      userId,
      amount: xpAmount,
      source: xpSource,
      applyStreakBonus: true,
    });

    // Check for badge unlocks
    const unlockedBadges = await checkBadgeUnlocks(userId, {
      assessmentCompleted: milestone === "completion",
      isRetake,
    });

    // Update session with XP tracking
    const updatedXpAwarded: XpAwardedTracking = {
      ...xpAwarded,
      [ trackingKey ]: true,
    };

    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: {
        results: JSON.stringify({
          ...resultsData,
          xpAwarded: updatedXpAwarded,
        }),
      },
    });

    return {
      success: true,
      xpResult,
      unlockedBadges: unlockedBadges.length > 0 ? unlockedBadges : undefined,
    };
  } catch (error) {
    console.error("[awardAssessmentXp] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al otorgar XP",
    };
  }
}

/**
 * Get current XP status for an assessment session
 */
export async function getAssessmentXpStatus(
  sessionId: string
): Promise<{
  phase1Awarded: boolean;
  phase2Awarded: boolean;
  completionAwarded: boolean;
  isRetake: boolean;
} | null> {
  try {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession?.user?.id) {
      return null;
    }

    const assessmentSession = await prisma.assessmentSession.findUnique({
      where: { id: sessionId },
      select: {
        userId: true,
        results: true,
        createdAt: true,
      },
    });

    if (!assessmentSession || assessmentSession.userId !== userSession.user.id) {
      return null;
    }

    let xpAwarded: XpAwardedTracking = {};
    if (assessmentSession.results) {
      try {
        const results = JSON.parse(assessmentSession.results);
        xpAwarded = results.xpAwarded ?? {};
      } catch {
        xpAwarded = {};
      }
    }

    const previousCompletedCount = await prisma.assessmentSession.count({
      where: {
        userId: userSession.user.id,
        status: "COMPLETED",
        createdAt: { lt: assessmentSession.createdAt },
      },
    });

    return {
      phase1Awarded: xpAwarded.phase1 ?? false,
      phase2Awarded: xpAwarded.phase2 ?? false,
      completionAwarded: xpAwarded.completion ?? xpAwarded.retakeBonus ?? false,
      isRetake: previousCompletedCount > 0,
    };
  } catch (error) {
    console.error("[getAssessmentXpStatus] Error:", error);
    return null;
  }
}
