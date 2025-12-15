/**
 * Gamification Service
 *
 * Unified API for gamification operations.
 * Handles XP awards, level-ups, and badge unlocks.
 * Consumed by assessment and feedback modules.
 */

import { prisma } from "@/lib/prisma.db";
import { getStreakBonus } from "@/lib/constants/xp-levels";
import { calculateXpUpdate } from "@/lib/services/xp-calculator.service";
import { checkLevelUp } from "@/lib/services/level-calculator.service";
import type {
  AwardXpParams,
  AwardXpResult,
  BadgeCheckContext,
  ExtendedUserBadgeStats,
  UnlockedBadge,
} from "@/lib/types/gamification.types";
import type { UserGamification } from "@/generated/prisma/client";

/**
 * Ensures a UserGamification record exists for the user.
 * Creates one with defaults if it doesn't exist.
 */
export async function ensureGamificationRecord(
  userId: string
): Promise<UserGamification> {
  const existing = await prisma.userGamification.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing;
  }

  return prisma.userGamification.create({
    data: {
      userId,
      xpTotal: 0,
      currentLevel: 1,
      longestStreak: 0,
      currentStreak: 0,
      modulesCompleted: 0,
      challengesCompleted: 0,
      collaborativeChallenges: 0,
    },
  });
}

/**
 * Calculate current streak days based on last activity
 */
function calculateCurrentStreak(
  currentStreak: number,
  lastActivityDate: Date | null
): { streakDays: number; streakMultiplier: number } {
  if (!lastActivityDate) {
    return { streakDays: 1, streakMultiplier: 1.0 };
  }

  const now = new Date();
  const lastActivity = new Date(lastActivityDate);
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // If within 48 hours, streak continues
  if (diffHours <= 48) {
    const newStreak = currentStreak + 1;
    const multiplier = getStreakBonus(newStreak);
    return { streakDays: newStreak, streakMultiplier: multiplier };
  }

  // Streak broken, start fresh
  return { streakDays: 1, streakMultiplier: 1.0 };
}

/**
 * Awards XP to a user with optional streak bonus.
 * Updates level if threshold crossed.
 */
export async function awardXp(params: AwardXpParams): Promise<AwardXpResult> {
  const { userId, amount, applyStreakBonus = true } = params;

  if (amount <= 0) {
    throw new Error("XP amount must be positive");
  }

  // Ensure record exists
  const gamification = await ensureGamificationRecord(userId);

  // Calculate streak bonus
  let streakMultiplier = 1.0;
  let newStreak = gamification.currentStreak;

  if (applyStreakBonus) {
    const streakInfo = calculateCurrentStreak(
      gamification.currentStreak,
      gamification.lastActivityDate
    );
    streakMultiplier = streakInfo.streakMultiplier;
    newStreak = streakInfo.streakDays;
  }

  // Apply streak multiplier
  const xpWithBonus = Math.round(amount * streakMultiplier);

  // Calculate level change
  const xpResult = calculateXpUpdate(gamification.xpTotal, xpWithBonus);
  const levelCheck = checkLevelUp(gamification.xpTotal, xpWithBonus);

  // Update database
  const newLongestStreak = Math.max(gamification.longestStreak, newStreak);

  await prisma.userGamification.update({
    where: { userId },
    data: {
      xpTotal: xpResult.newXp,
      currentLevel: xpResult.newLevel,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: new Date(),
    },
  });

  return {
    xpAwarded: xpWithBonus,
    baseXp: amount,
    streakMultiplier,
    totalXp: xpResult.newXp,
    previousLevel: xpResult.previousLevel,
    newLevel: xpResult.newLevel,
    leveledUp: levelCheck.totalLevelsUp > 0,
  };
}

/**
 * Get extended user stats for badge evaluation
 */
export async function getExtendedUserStats(
  userId: string
): Promise<ExtendedUserBadgeStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [ gamification, assessmentCount, feedbackGivenAll, feedbackGiven30Days, feedbackReceived, hasRetake ] = await Promise.all([
    prisma.userGamification.findUnique({
      where: { userId },
    }),
    // Count completed assessments
    prisma.assessmentSession.count({
      where: { userId, status: "COMPLETED" },
    }),
    // Count all feedbacks given
    prisma.feedbackResponse.count({
      where: { request: { respondentId: userId } },
    }),
    // Count feedbacks given in last 30 days
    prisma.feedbackResponse.count({
      where: {
        request: { respondentId: userId },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Count feedbacks received on own requests
    prisma.feedbackResponse.count({
      where: {
        request: { requesterId: userId },
      },
    }),
    // Check if user has done a retake after receiving feedback
    checkRetakeAfterFeedback(userId),
  ]);

  return {
    xpTotal: gamification?.xpTotal ?? 0,
    currentLevel: gamification?.currentLevel ?? 1,
    modulesCompleted: gamification?.modulesCompleted ?? 0,
    challengesCompleted: gamification?.challengesCompleted ?? 0,
    longestStreak: gamification?.longestStreak ?? 0,
    currentStreak: gamification?.currentStreak ?? 0,
    collaborativeChallenges: gamification?.collaborativeChallenges ?? 0,
    assessmentsCompleted: assessmentCount,
    feedbacksGiven: feedbackGivenAll,
    feedbacksGivenLast30Days: feedbackGiven30Days,
    feedbacksReceived: feedbackReceived,
    hasRetakeAfterFeedback: hasRetake,
  };
}

/**
 * Check if user has done a retake after receiving feedback
 */
async function checkRetakeAfterFeedback(userId: string): Promise<boolean> {
  // Get earliest feedback received date
  const firstFeedback = await prisma.feedbackResponse.findFirst({
    where: {
      request: { requesterId: userId },
    },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  if (!firstFeedback) {
    return false;
  }

  // Check if there's a completed assessment after that feedback
  const retake = await prisma.assessmentSession.findFirst({
    where: {
      userId,
      status: "COMPLETED",
      createdAt: { gt: firstFeedback.createdAt },
    },
  });

  // Also verify they had at least 2 feedbacks before the retake
  if (retake) {
    const feedbacksBeforeRetake = await prisma.feedbackResponse.count({
      where: {
        request: { requesterId: userId },
        createdAt: { lt: retake.createdAt },
      },
    });
    return feedbacksBeforeRetake >= 2;
  }

  return false;
}

/**
 * Check and unlock badges based on current context
 */
export async function checkBadgeUnlocks(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: BadgeCheckContext
): Promise<UnlockedBadge[]> {
  const stats = await getExtendedUserStats(userId);

  // Get all badges not yet unlocked
  const unlockedBadgeIds = await prisma.userBadge.findMany({
    where: {
      gamification: { userId },
    },
    select: { badgeId: true },
  });

  const unlockedIds = new Set(unlockedBadgeIds.map((b) => b.badgeId));

  // Get all badges
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
  });

  const newlyUnlocked: UnlockedBadge[] = [];

  for (const badge of allBadges) {
    if (unlockedIds.has(badge.id)) {
      continue;
    }

    const criteria = JSON.parse(badge.unlockCriteria) as {
      type: string;
      threshold: number;
      periodDays?: number;
      minFeedbacks?: number;
    };

    const shouldUnlock = evaluateBadgeCriteria(criteria, stats);

    if (shouldUnlock) {
      // Unlock the badge
      const gamification = await ensureGamificationRecord(userId);

      const userBadge = await prisma.userBadge.create({
        data: {
          gamificationId: gamification.id,
          badgeId: badge.id,
        },
      });

      // Award badge XP bonus
      if (badge.xpReward > 0) {
        await awardXp({
          userId,
          amount: badge.xpReward,
          source: "badge_reward",
          applyStreakBonus: false,
        });
      }

      newlyUnlocked.push({
        badge: {
          id: badge.id,
          slug: badge.key,
          name: badge.nameEs,
          description: badge.descriptionEs,
          tier: badge.tier as "bronze" | "silver" | "gold" | "platinum",
          xpReward: badge.xpReward,
          iconUrl: badge.iconUrl,
        },
        earnedAt: userBadge.unlockedAt,
      });
    }
  }

  return newlyUnlocked;
}

/**
 * Evaluate if badge criteria is met
 */
function evaluateBadgeCriteria(
  criteria: {
    type: string;
    threshold: number;
    periodDays?: number;
    minFeedbacks?: number;
  },
  stats: ExtendedUserBadgeStats
): boolean {
  switch (criteria.type) {
    // Original criteria types
    case "xp":
      return stats.xpTotal >= criteria.threshold;
    case "modules":
      return stats.modulesCompleted >= criteria.threshold;
    case "challenges":
      return stats.challengesCompleted >= criteria.threshold;
    case "streak":
      return stats.longestStreak >= criteria.threshold;
    case "collaborative":
      return stats.collaborativeChallenges >= criteria.threshold;
    case "level":
      return stats.currentLevel >= criteria.threshold;

    // Feature 005 criteria types
    case "assessment_completed":
      return stats.assessmentsCompleted >= criteria.threshold;

    case "feedbacks_given":
      // Check with period if specified
      if (criteria.periodDays) {
        return stats.feedbacksGivenLast30Days >= criteria.threshold;
      }
      return stats.feedbacksGiven >= criteria.threshold;

    case "feedbacks_received":
      return stats.feedbacksReceived >= criteria.threshold;

    case "retake_after_feedback":
      return stats.hasRetakeAfterFeedback;

    default:
      return false;
  }
}

/**
 * Get human-readable source label in Spanish
 */
export function getXpSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    assessment_phase_1: "Assessment Fase 1",
    assessment_phase_2: "Assessment Fase 2",
    assessment_complete: "Assessment Completado",
    assessment_retake: "Assessment Repetido",
    feedback_given: "Feedback Enviado",
    feedback_received: "Feedback Recibido",
    feedback_insights: "Insights Desbloqueados",
    feedback_applied: "Sugerencias Aplicadas",
    challenge_completed: "Desafío Completado",
    module_completed: "Módulo Completado",
    collaborative_bonus: "Bonus Colaborativo",
    badge_reward: "Recompensa de Badge",
    streak_bonus: "Bonus de Racha",
  };

  return labels[ source ] ?? source;
}
