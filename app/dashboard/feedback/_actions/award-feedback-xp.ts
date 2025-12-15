"use server";

/**
 * Server Actions: Award Feedback XP
 * Awards XP for feedback given/received
 * Part of Feature 005: Gamification Integration
 */

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";
import { awardXp, checkBadgeUnlocks } from "@/lib/services/gamification.service";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";
import {
  AwardFeedbackGivenXpInputSchema,
  AwardFeedbackReceivedXpInputSchema,
} from "../_schemas/award-xp.schema";
import type { AwardXpResult, UnlockedBadge } from "@/lib/types/gamification.types";

export interface AwardFeedbackXpResult {
  success: boolean;
  xpResult?: AwardXpResult;
  unlockedBadges?: UnlockedBadge[];
  alreadyAwarded?: boolean;
  insightsBonus?: boolean;
  insightsBonusXp?: number;
  error?: string;
}

/**
 * Award XP for providing feedback to a peer
 * 
 * Idempotency: This function should only be called once per request completion.
 * The calling code (submitFeedbackAction) is responsible for ensuring single invocation.
 * We verify the request is COMPLETED as an additional safety check.
 */
export async function awardFeedbackGivenXp(
  input: unknown
): Promise<AwardFeedbackXpResult> {
  try {
    // Validate input
    const validationResult = AwardFeedbackGivenXpInputSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[ 0 ]?.message ?? "Entrada inválida",
      };
    }

    const { requestId } = validationResult.data;

    // Verify user authentication
    const userSession = await getSession();
    if (!userSession?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const userId = userSession.user.id;

    // Get the request
    const request = await prisma.feedbackRequest.findUnique({
      where: { id: requestId },
      select: {
        respondentId: true,
        status: true,
        completedAt: true,
      },
    });

    if (!request) {
      return { success: false, error: "Solicitud no encontrada" };
    }

    // Verify this user is the respondent
    if (request.respondentId !== userId) {
      return { success: false, error: "Acceso denegado" };
    }

    // Verify request is completed
    if (request.status !== "COMPLETED") {
      return { success: false, error: "La solicitud no está completada" };
    }

    // Award XP
    const xpResult = await awardXp({
      userId,
      amount: FEEDBACK_XP_REWARDS.FEEDBACK_GIVEN,
      source: "feedback_given",
      applyStreakBonus: true,
    });

    // Check for badge unlocks (Espejo Generoso)
    const unlockedBadges = await checkBadgeUnlocks(userId, {
      feedbackGiven: true,
    });

    return {
      success: true,
      xpResult,
      unlockedBadges: unlockedBadges.length > 0 ? unlockedBadges : undefined,
    };
  } catch (error) {
    console.error("[awardFeedbackGivenXp] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al otorgar XP",
    };
  }
}

/**
 * Internal function to award XP to requester when feedback is received
 * Used internally by submitFeedbackAction - does not verify session
 */
export async function awardFeedbackReceivedXpInternal(
  requestId: string
): Promise<AwardFeedbackXpResult> {
  try {
    // Get the request
    const request = await prisma.feedbackRequest.findUnique({
      where: { id: requestId },
      select: {
        requesterId: true,
        status: true,
      },
    });

    if (!request) {
      return { success: false, error: "Solicitud no encontrada" };
    }

    const userId = request.requesterId;

    // Verify request is completed
    if (request.status !== "COMPLETED") {
      return { success: false, error: "La solicitud no está completada" };
    }

    // Award base XP for receiving feedback
    const xpResult = await awardXp({
      userId,
      amount: FEEDBACK_XP_REWARDS.FEEDBACK_RECEIVED,
      source: "feedback_received",
      applyStreakBonus: true,
    });

    let insightsBonus = false;
    let insightsBonusXp = 0;

    // Check if insights threshold reached (3+ completed requests = unlock insights)
    const completedRequests = await prisma.feedbackRequest.count({
      where: {
        requesterId: userId,
        status: "COMPLETED",
      },
    });

    if (completedRequests >= 3) {
      // Check if insights bonus already awarded (via FeedbackSummary)
      const summary = await prisma.feedbackSummary.findUnique({
        where: { userId },
        select: { insightsGeneratedAt: true },
      });

      // If insights not yet generated, this is first time reaching threshold
      if (!summary?.insightsGeneratedAt) {
        // Award insights bonus
        await awardXp({
          userId,
          amount: FEEDBACK_XP_REWARDS.INSIGHTS_UNLOCKED,
          source: "feedback_insights",
          applyStreakBonus: false, // No streak bonus for milestone rewards
        });

        insightsBonus = true;
        insightsBonusXp = FEEDBACK_XP_REWARDS.INSIGHTS_UNLOCKED;
      }
    }

    // Check for badge unlocks (Escucha Activa)
    const unlockedBadges = await checkBadgeUnlocks(userId, {
      feedbackReceived: true,
    });

    return {
      success: true,
      xpResult,
      insightsBonus,
      insightsBonusXp: insightsBonus ? insightsBonusXp : undefined,
      unlockedBadges: unlockedBadges.length > 0 ? unlockedBadges : undefined,
    };
  } catch (error) {
    console.error("[awardFeedbackReceivedXpInternal] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al otorgar XP",
    };
  }
}

/**
 * Award XP for receiving feedback from a peer
 * Called when a FeedbackRequest is completed (status = COMPLETED)
 * Awards XP to the requester (the person who requested feedback)
 * 
 * @deprecated Use awardFeedbackReceivedXpInternal for server-side calls
 */
export async function awardFeedbackReceivedXp(
  input: unknown
): Promise<AwardFeedbackXpResult> {
  try {
    // Validate input
    const validationResult = AwardFeedbackReceivedXpInputSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[ 0 ]?.message ?? "Entrada inválida",
      };
    }

    const { requestId } = validationResult.data;

    // Verify user authentication
    const userSession = await getSession();
    if (!userSession?.user?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const userId = userSession.user.id;

    // Get the request
    const request = await prisma.feedbackRequest.findUnique({
      where: { id: requestId },
      select: {
        requesterId: true,
        status: true,
      },
    });

    if (!request) {
      return { success: false, error: "Solicitud no encontrada" };
    }

    // Verify this user is the requester
    if (request.requesterId !== userId) {
      return { success: false, error: "Acceso denegado" };
    }

    // Delegate to internal function
    return awardFeedbackReceivedXpInternal(requestId);
  } catch (error) {
    console.error("[awardFeedbackReceivedXp] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al otorgar XP",
    };
  }
}
