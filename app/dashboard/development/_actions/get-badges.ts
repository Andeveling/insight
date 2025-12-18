"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
  calculateBadgeProgress,
  parseBadgeCriteria,
  type UserBadgeStats,
} from "@/lib/constants/badge-criteria";
import type { BadgeTier } from "@/lib/types";

/**
 * Badge with progress information
 */
interface BadgeWithProgress {
  id: string;
  key: string;
  nameEs: string;
  descriptionEs: string;
  iconUrl: string;
  tier: BadgeTier;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
  progress: number; // 0-100
  criteria: string | null;
}

/**
 * Badge gallery result
 */
interface BadgeGalleryResult {
  badges: BadgeWithProgress[];
  totalBadges: number;
  unlockedCount: number;
  byTier: {
    bronze: { total: number; unlocked: number };
    silver: { total: number; unlocked: number };
    gold: { total: number; unlocked: number };
    platinum: { total: number; unlocked: number };
  };
}

/**
 * Get all badges with user's progress and unlock status
 */
export async function getBadges(): Promise<BadgeGalleryResult> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const userId = session.user.id;

  // Fetch all badges
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [ { tier: "asc" }, { xpReward: "asc" } ],
  });

  // Get user's gamification record with badges
  const gamification = await prisma.userGamification.findUnique({
    where: { userId },
    include: {
      badges: {
        select: {
          badgeId: true,
          unlockedAt: true,
        },
      },
    },
  });

  const unlockedMap = new Map(
    (gamification?.badges ?? []).map((ub) => [ ub.badgeId, ub.unlockedAt ])
  );

  // Get user stats for progress calculation
  const [ modulesCompleted, challengesCompleted, collaborativeChallenges, assessmentsCompleted, feedbacksGiven, feedbacksReceived ] =
    await Promise.all([
      prisma.userModuleProgress.count({
        where: { userId, status: "completed" },
      }),
      prisma.userChallengeProgress.count({
        where: { userId, completed: true },
      }),
      prisma.userChallengeProgress.count({
        where: {
          userId,
          completed: true,
          challenge: { type: "collaboration" },
        },
      }),
      // Feature 005: Assessment stats
      prisma.assessmentSession.count({
        where: { userId, status: "COMPLETED" },
      }),
      // Feature 005: Feedback stats - given
      prisma.feedbackRequest.count({
        where: { respondentId: userId, status: "COMPLETED" },
      }),
      // Feature 005: Feedback stats - received
      prisma.feedbackRequest.count({
        where: { requesterId: userId, status: "COMPLETED" },
      }),
    ]);

  const userStats: UserBadgeStats = {
    xpTotal: gamification?.xpTotal ?? 0,
    currentLevel: gamification?.currentLevel ?? 1,
    currentStreak: gamification?.currentStreak ?? 0,
    longestStreak: gamification?.longestStreak ?? 0,
    modulesCompleted,
    challengesCompleted,
    collaborativeChallenges,
    // Feature 008: Assessment & Feedback stats
    assessmentsCompleted,
    feedbacksGiven,
    feedbacksReceived,
  };

  // Map badges with progress
  const badges: BadgeWithProgress[] = allBadges.map((badge) => {
    const isUnlocked = unlockedMap.has(badge.id);
    const unlockedAt = unlockedMap.get(badge.id) ?? null;
    const criteria = parseBadgeCriteria(badge.unlockCriteria);
    const progress = isUnlocked ? 100 : calculateBadgeProgress(criteria, userStats);

    return {
      id: badge.id,
      key: badge.key,
      nameEs: badge.nameEs,
      descriptionEs: badge.descriptionEs,
      iconUrl: badge.iconUrl,
      tier: badge.tier as BadgeTier,
      xpReward: badge.xpReward,
      isUnlocked,
      unlockedAt,
      progress,
      criteria: badge.unlockCriteria,
    };
  });

  // Calculate tier counts
  const tierCounts = {
    bronze: { total: 0, unlocked: 0 },
    silver: { total: 0, unlocked: 0 },
    gold: { total: 0, unlocked: 0 },
    platinum: { total: 0, unlocked: 0 },
  };

  for (const badge of badges) {
    const tier = badge.tier as keyof typeof tierCounts;
    if (tierCounts[ tier ]) {
      tierCounts[ tier ].total++;
      if (badge.isUnlocked) {
        tierCounts[ tier ].unlocked++;
      }
    }
  }

  return {
    badges,
    totalBadges: badges.length,
    unlockedCount: gamification?.badges.length ?? 0,
    byTier: tierCounts,
  };
}

/**
 * Get recently unlocked badges
 */
export async function getRecentBadges(limit: number = 3) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const gamification = await prisma.userGamification.findUnique({
    where: { userId: session.user.id },
    include: {
      badges: {
        orderBy: { unlockedAt: "desc" },
        take: limit,
        include: {
          badge: {
            select: {
              id: true,
              key: true,
              nameEs: true,
              descriptionEs: true,
              iconUrl: true,
              tier: true,
              xpReward: true,
            },
          },
        },
      },
    },
  });

  return (gamification?.badges ?? []).map((ub) => ({
    id: ub.badge.id,
    key: ub.badge.key,
    nameEs: ub.badge.nameEs,
    descriptionEs: ub.badge.descriptionEs,
    iconUrl: ub.badge.iconUrl,
    tier: ub.badge.tier as BadgeTier,
    xpReward: ub.badge.xpReward,
    unlockedAt: ub.unlockedAt,
  }));
}
