"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getEligibleBadges } from "@/lib/services/badge-rules.service";
import {
	parseBadgeCriteria,
	calculateBadgeProgress,
	type UserBadgeStats,
} from "@/lib/constants/badge-criteria";
import type { BadgeTier } from "@/lib/types";

/**
 * Unlocked badge result
 */
interface UnlockedBadge {
	id: string;
	key: string;
	nameEs: string;
	descriptionEs: string;
	iconUrl: string;
	tier: BadgeTier;
	xpReward: number;
}

/**
 * Badge unlock check result
 */
interface BadgeUnlockResult {
	newBadgesUnlocked: UnlockedBadge[];
	totalXpAwarded: number;
}

/**
 * Check and award newly unlocked badges
 *
 * This should be called after any action that could unlock a badge:
 * - Completing a challenge
 * - Completing a module
 * - Leveling up
 * - Reaching a streak milestone
 *
 * @returns List of newly unlocked badges and XP awarded
 */
export async function checkBadgeUnlock(): Promise<BadgeUnlockResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Get user's gamification record with badges
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
		include: {
			badges: {
				select: { badgeId: true },
			},
		},
	});

	if (!gamification) {
		return { newBadgesUnlocked: [], totalXpAwarded: 0 };
	}

	// Get counts in parallel
	const [modulesCompleted, challengesCompleted, collaborativeChallenges] =
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
		]);

	const userStats: UserBadgeStats = {
		xpTotal: gamification.xpTotal,
		currentLevel: gamification.currentLevel,
		currentStreak: gamification.currentStreak,
		modulesCompleted,
		challengesCompleted,
		longestStreak: gamification.longestStreak,
		collaborativeChallenges,
	};

	// Get all active badges
	const allBadges = await prisma.badge.findMany({
		where: { isActive: true },
	});

	const unlockedBadgeIds = gamification.badges.map((ub) => ub.badgeId);

	// Find eligible badges that aren't already unlocked
	const eligibleBadges = getEligibleBadges(
		allBadges.map((b) => ({
			id: b.id,
			key: b.key,
			nameEs: b.nameEs,
			descriptionEs: b.descriptionEs,
			iconUrl: b.iconUrl,
			tier: b.tier as BadgeTier,
			unlockCriteria: parseBadgeCriteria(b.unlockCriteria),
			xpReward: b.xpReward,
			isActive: b.isActive,
		})),
		unlockedBadgeIds,
		userStats,
	);

	if (eligibleBadges.length === 0) {
		return { newBadgesUnlocked: [], totalXpAwarded: 0 };
	}

	// Award new badges and XP
	const newBadgesUnlocked: UnlockedBadge[] = [];
	let totalXpAwarded = 0;

	for (const eligibleBadge of eligibleBadges) {
		const badge = allBadges.find((b) => b.id === eligibleBadge.id);
		if (!badge) continue;

		// Create user badge record via gamification relation
		await prisma.userBadge.create({
			data: {
				gamificationId: gamification.id,
				badgeId: badge.id,
			},
		});

		// Award XP for badge
		await prisma.userGamification.update({
			where: { id: gamification.id },
			data: {
				xpTotal: { increment: badge.xpReward },
			},
		});

		totalXpAwarded += badge.xpReward;

		newBadgesUnlocked.push({
			id: badge.id,
			key: badge.key,
			nameEs: badge.nameEs,
			descriptionEs: badge.descriptionEs,
			iconUrl: badge.iconUrl,
			tier: badge.tier as BadgeTier,
			xpReward: badge.xpReward,
		});
	}

	return {
		newBadgesUnlocked,
		totalXpAwarded,
	};
}

/**
 * Get next badges the user is closest to unlocking
 */
export async function getNextBadgesToUnlock(limit: number = 3) {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const userId = session.user.id;

	// Get user gamification with badges
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
		include: {
			badges: {
				select: { badgeId: true },
			},
		},
	});

	// Get counts in parallel
	const [modulesCompleted, challengesCompleted, collaborativeChallenges] =
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
		]);

	const userStats: UserBadgeStats = {
		xpTotal: gamification?.xpTotal ?? 0,
		currentLevel: gamification?.currentLevel ?? 1,
		currentStreak: gamification?.currentStreak ?? 0,
		modulesCompleted,
		challengesCompleted,
		longestStreak: gamification?.longestStreak ?? 0,
		collaborativeChallenges,
	};

	// Get all active badges
	const allBadges = await prisma.badge.findMany({
		where: { isActive: true },
		orderBy: { xpReward: "asc" },
	});

	const unlockedBadgeIds = new Set(
		gamification?.badges.map((ub) => ub.badgeId) ?? [],
	);

	// Calculate progress for locked badges
	const lockedBadgesWithProgress = allBadges
		.filter((b) => !unlockedBadgeIds.has(b.id))
		.map((badge) => {
			const criteria = parseBadgeCriteria(badge.unlockCriteria);
			const progress = calculateBadgeProgress(criteria, userStats);
			return {
				id: badge.id,
				key: badge.key,
				nameEs: badge.nameEs,
				descriptionEs: badge.descriptionEs,
				iconUrl: badge.iconUrl,
				tier: badge.tier as BadgeTier,
				xpReward: badge.xpReward,
				progress,
			};
		})
		.sort((a, b) => b.progress - a.progress)
		.slice(0, limit);

	return lockedBadgesWithProgress;
}
