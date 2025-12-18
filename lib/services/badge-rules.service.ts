/**
 * Badge Rules Service
 *
 * Handles badge validation, unlocking logic, and badge-related queries.
 */

import {
	calculateBadgeProgress,
	getNewlyUnlockedBadges,
	parseBadgeCriteria,
	shouldUnlockBadge,
	sortBadges,
	type UserBadgeStats,
} from "@/lib/constants/badge-criteria";
import type {
	BadgeData,
	BadgeProgress,
	BadgeUnlockCriteria,
} from "@/lib/types/gamification.types";

/**
 * Check which badges a user qualifies for
 */
export function getEligibleBadges(
	allBadges: BadgeData[],
	unlockedBadgeIds: string[],
	userStats: UserBadgeStats,
): BadgeData[] {
	return allBadges.filter((badge) => {
		// Skip already unlocked
		if (unlockedBadgeIds.includes(badge.id)) {
			return false;
		}

		// Check if eligible
		return shouldUnlockBadge(badge.unlockCriteria, userStats);
	});
}

/**
 * Calculate progress for all badges
 */
export function calculateAllBadgeProgress(
	allBadges: BadgeData[],
	unlockedBadges: Array<{ badgeId: string; unlockedAt: Date }>,
	userStats: UserBadgeStats,
): BadgeProgress[] {
	const unlockedMap = new Map(
		unlockedBadges.map((b) => [b.badgeId, b.unlockedAt]),
	);

	return allBadges.map((badge) => {
		const isUnlocked = unlockedMap.has(badge.id);
		const unlockedAt = unlockedMap.get(badge.id);

		return {
			badge,
			currentValue: getCurrentValueForBadge(badge.unlockCriteria, userStats),
			targetValue: badge.unlockCriteria.threshold,
			progress: isUnlocked
				? 100
				: calculateBadgeProgress(badge.unlockCriteria, userStats),
			isUnlocked,
			unlockedAt: unlockedAt ?? null,
		};
	});
}

/**
 * Get current value for a badge criteria
 */
function getCurrentValueForBadge(
	criteria: BadgeUnlockCriteria,
	userStats: UserBadgeStats,
): number {
	switch (criteria.type) {
		case "xp":
			return userStats.xpTotal;
		case "modules":
			return userStats.modulesCompleted;
		case "challenges":
			return userStats.challengesCompleted;
		case "streak":
			return userStats.longestStreak;
		case "collaborative":
			return userStats.collaborativeChallenges;
		case "level":
			return userStats.currentLevel;
		default:
			return 0;
	}
}

/**
 * Get badges close to being unlocked (> 75% progress)
 */
export function getAlmostUnlockedBadges(
	allBadges: BadgeData[],
	unlockedBadgeIds: string[],
	userStats: UserBadgeStats,
	thresholdPercent: number = 75,
): Array<BadgeData & { progress: number }> {
	const almostUnlocked: Array<BadgeData & { progress: number }> = [];

	for (const badge of allBadges) {
		if (unlockedBadgeIds.includes(badge.id)) {
			continue;
		}

		const progress = calculateBadgeProgress(badge.unlockCriteria, userStats);

		if (progress >= thresholdPercent && progress < 100) {
			almostUnlocked.push({
				...badge,
				progress,
			});
		}
	}

	// Sort by progress descending
	return almostUnlocked.sort((a, b) => b.progress - a.progress);
}

/**
 * Find badges that would be unlocked after an action
 */
export function findNewBadgesAfterAction(
	allBadges: Array<{ key: string; unlockCriteria: string }>,
	currentUnlockedKeys: string[],
	statsBefore: UserBadgeStats,
	statsAfter: UserBadgeStats,
): string[] {
	// Get badges unlocked before
	const unlockedBefore = getNewlyUnlockedBadges(
		allBadges,
		currentUnlockedKeys,
		statsBefore,
	);

	// Get badges unlocked after
	const unlockedAfter = getNewlyUnlockedBadges(
		allBadges,
		currentUnlockedKeys,
		statsAfter,
	);

	// Return only the new ones
	return unlockedAfter.filter((key) => !unlockedBefore.includes(key));
}

/**
 * Group badges by tier
 */
export function groupBadgesByTier(
	badges: BadgeData[],
): Record<string, BadgeData[]> {
	const grouped: Record<string, BadgeData[]> = {
		bronze: [],
		silver: [],
		gold: [],
		platinum: [],
	};

	for (const badge of badges) {
		grouped[badge.tier].push(badge);
	}

	// Sort each tier by threshold
	for (const tier of Object.keys(grouped)) {
		grouped[tier] = sortBadges(grouped[tier]);
	}

	return grouped;
}

/**
 * Group badges by criteria type
 */
export function groupBadgesByCriteria(
	badges: BadgeData[],
): Record<string, BadgeData[]> {
	const grouped: Record<string, BadgeData[]> = {};

	for (const badge of badges) {
		const criteriaType = badge.unlockCriteria.type;

		if (!grouped[criteriaType]) {
			grouped[criteriaType] = [];
		}

		grouped[criteriaType].push(badge);
	}

	// Sort each group
	for (const type of Object.keys(grouped)) {
		grouped[type] = sortBadges(grouped[type]);
	}

	return grouped;
}

/**
 * Get badge unlock message
 */
export function getBadgeUnlockMessage(badge: BadgeData): {
	title: string;
	description: string;
} {
	return {
		title: `¡Insignia Desbloqueada!`,
		description: `Has obtenido "${badge.nameEs}" - ${badge.descriptionEs}. +${badge.xpReward} XP`,
	};
}

/**
 * Calculate total XP from badges
 */
export function calculateBadgeXpTotal(badges: BadgeData[]): number {
	return badges.reduce((total, badge) => total + badge.xpReward, 0);
}

/**
 * Get next badge to aim for based on current progress
 */
export function getNextBadgeGoal(
	allBadges: BadgeData[],
	unlockedBadgeIds: string[],
	userStats: UserBadgeStats,
): BadgeData | null {
	const almostUnlocked = getAlmostUnlockedBadges(
		allBadges,
		unlockedBadgeIds,
		userStats,
		50, // 50% threshold
	);

	if (almostUnlocked.length > 0) {
		return almostUnlocked[0];
	}

	// Find the badge with lowest remaining requirement
	const remaining = allBadges
		.filter((badge) => !unlockedBadgeIds.includes(badge.id))
		.map((badge) => ({
			badge,
			progress: calculateBadgeProgress(badge.unlockCriteria, userStats),
		}))
		.sort((a, b) => b.progress - a.progress);

	return remaining.length > 0 ? remaining[0].badge : null;
}

/**
 * Parse badge criteria from database record
 */
export function parseBadgeFromDb(dbBadge: {
	id: string;
	key: string;
	nameEs: string;
	descriptionEs: string;
	iconUrl: string;
	tier: string;
	unlockCriteria: string;
	xpReward: number;
	isActive: boolean;
}): BadgeData {
	return {
		id: dbBadge.id,
		key: dbBadge.key,
		nameEs: dbBadge.nameEs,
		descriptionEs: dbBadge.descriptionEs,
		iconUrl: dbBadge.iconUrl,
		tier: dbBadge.tier as BadgeData["tier"],
		unlockCriteria: parseBadgeCriteria(dbBadge.unlockCriteria),
		xpReward: dbBadge.xpReward,
		isActive: dbBadge.isActive,
	};
}
