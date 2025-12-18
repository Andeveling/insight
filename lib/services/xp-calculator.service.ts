/**
 * XP Calculator Service
 *
 * Handles XP calculations, level determination, and XP updates.
 */

import {
	COLLABORATION_BONUS,
	getLevelByXp,
	getStreakBonus,
	wouldLevelUp,
} from "@/lib/constants/xp-levels";
import type { XpUpdateResult } from "@/lib/types/gamification.types";

/**
 * Calculate XP to award for a challenge completion
 */
export function calculateChallengeXp(
	baseXp: number,
	options?: {
		isCollaborative?: boolean;
		currentStreak?: number;
	},
): number {
	let xp = baseXp;

	// Apply streak bonus
	if (options?.currentStreak && options.currentStreak > 0) {
		const streakMultiplier = getStreakBonus(options.currentStreak);
		xp = Math.round(xp * streakMultiplier);
	}

	// Apply collaboration bonus
	if (options?.isCollaborative) {
		xp = Math.round(xp * (1 + COLLABORATION_BONUS));
	}

	return xp;
}

/**
 * Calculate XP to award for completing a module
 */
export function calculateModuleXp(
	baseXp: number,
	options?: {
		currentStreak?: number;
		completionBonus?: boolean;
	},
): number {
	let xp = baseXp;

	// Apply streak bonus
	if (options?.currentStreak && options.currentStreak > 0) {
		const streakMultiplier = getStreakBonus(options.currentStreak);
		xp = Math.round(xp * streakMultiplier);
	}

	// Apply completion bonus (10% extra for completing entire module)
	if (options?.completionBonus) {
		xp = Math.round(xp * 1.1);
	}

	return xp;
}

/**
 * Calculate the result of adding XP to a user
 */
export function calculateXpUpdate(
	currentXp: number,
	xpToAdd: number,
): Pick<
	XpUpdateResult,
	| "previousXp"
	| "newXp"
	| "xpGained"
	| "previousLevel"
	| "newLevel"
	| "leveledUp"
> {
	const previousLevel = getLevelByXp(currentXp).level;
	const newXp = currentXp + xpToAdd;
	const newLevel = getLevelByXp(newXp).level;
	const leveledUp = wouldLevelUp(currentXp, xpToAdd);

	return {
		previousXp: currentXp,
		newXp,
		xpGained: xpToAdd,
		previousLevel,
		newLevel,
		leveledUp,
	};
}

/**
 * Calculate XP progress within current level
 */
export function calculateLevelProgress(xpTotal: number): {
	currentLevelXp: number;
	nextLevelXpRequired: number;
	progressPercentage: number;
} {
	const levelInfo = getLevelByXp(xpTotal);
	const currentLevelXp = xpTotal - levelInfo.minXp;
	const nextLevelXpRequired = levelInfo.maxXp - levelInfo.minXp;
	const progressPercentage =
		nextLevelXpRequired > 0
			? Math.round((currentLevelXp / nextLevelXpRequired) * 100)
			: 100;

	return {
		currentLevelXp,
		nextLevelXpRequired,
		progressPercentage,
	};
}

/**
 * Format XP for display
 */
export function formatXp(xp: number): string {
	if (xp >= 1000000) {
		return `${(xp / 1000000).toFixed(1)}M`;
	}
	if (xp >= 1000) {
		return `${(xp / 1000).toFixed(1)}K`;
	}
	return xp.toString();
}

/**
 * Calculate daily XP goal based on level
 */
export function calculateDailyXpGoal(level: number): number {
	// Higher levels need more XP to progress
	const baseGoal = 50;
	const levelMultiplier = 1 + level * 0.1;
	return Math.round(baseGoal * levelMultiplier);
}

/**
 * Calculate estimated time to next level
 */
export function estimateTimeToNextLevel(
	currentXp: number,
	averageDailyXp: number,
): number {
	const levelInfo = getLevelByXp(currentXp);
	const xpNeeded = levelInfo.maxXp - currentXp;

	if (averageDailyXp <= 0) return Infinity;

	return Math.ceil(xpNeeded / averageDailyXp);
}
