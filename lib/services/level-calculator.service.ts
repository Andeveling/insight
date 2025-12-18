/**
 * Level Calculator Service
 *
 * Handles level progression, level-up detection, and level-related calculations.
 */

import {
	getLevelByXp,
	getLevelInfo,
	getLevelsGained,
	MAX_LEVEL,
	XP_LEVELS,
} from "@/lib/constants/xp-levels";
import type { LevelInfo, LevelUpEvent } from "@/lib/types/gamification.types";

/**
 * Calculate the user's current level based on total XP
 */
export function calculateLevel(xpTotal: number): number {
	return getLevelByXp(xpTotal).level;
}

/**
 * Get complete level information for a given XP total
 */
export function getLevelDetails(xpTotal: number): LevelInfo & {
	xpInLevel: number;
	xpToNextLevel: number;
	progressPercentage: number;
	isMaxLevel: boolean;
} {
	const levelInfo = getLevelByXp(xpTotal);
	const xpInLevel = xpTotal - levelInfo.minXp;
	const xpToNextLevel = levelInfo.maxXp - xpTotal;
	const levelRange = levelInfo.maxXp - levelInfo.minXp;
	const progressPercentage =
		levelRange > 0 ? Math.round((xpInLevel / levelRange) * 100) : 100;

	return {
		...levelInfo,
		xpInLevel,
		xpToNextLevel: levelInfo.level >= MAX_LEVEL ? 0 : xpToNextLevel,
		progressPercentage,
		isMaxLevel: levelInfo.level >= MAX_LEVEL,
	};
}

/**
 * Check if XP gain would result in one or more level-ups
 */
export function checkLevelUp(
	currentXp: number,
	xpGained: number,
): {
	levelsGained: LevelInfo[];
	totalLevelsUp: number;
	events: LevelUpEvent[];
} {
	const levelsGained = getLevelsGained(currentXp, xpGained);
	const events: LevelUpEvent[] = [];

	if (levelsGained.length > 0) {
		const previousLevel = getLevelByXp(currentXp).level;

		for (let i = 0; i < levelsGained.length; i++) {
			events.push({
				previousLevel: previousLevel + i,
				newLevel: levelsGained[i].level,
				xpTotal: currentXp + xpGained,
				timestamp: new Date(),
			});
		}
	}

	return {
		levelsGained,
		totalLevelsUp: levelsGained.length,
		events,
	};
}

/**
 * Get the next level's information
 */
export function getNextLevelInfo(currentLevel: number): LevelInfo | null {
	if (currentLevel >= MAX_LEVEL) {
		return null;
	}
	return getLevelInfo(currentLevel + 1);
}

/**
 * Get all levels up to a certain point for display
 */
export function getLevelRoadmap(
	currentLevel: number,
	levelsToShow: number = 5,
): Array<LevelInfo & { isCurrent: boolean; isAchieved: boolean }> {
	const roadmap: Array<
		LevelInfo & { isCurrent: boolean; isAchieved: boolean }
	> = [];

	// Show levels around the current level
	const startLevel = Math.max(1, currentLevel - 1);
	const endLevel = Math.min(MAX_LEVEL, startLevel + levelsToShow - 1);

	for (let i = startLevel; i <= endLevel; i++) {
		roadmap.push({
			...getLevelInfo(i),
			isCurrent: i === currentLevel,
			isAchieved: i < currentLevel,
		});
	}

	return roadmap;
}

/**
 * Get level color for styling
 */
export function getLevelColor(level: number): string {
	const levelInfo = getLevelInfo(level);
	return levelInfo.color;
}

/**
 * Get level name in Spanish
 */
export function getLevelName(level: number): string {
	const levelInfo = getLevelInfo(level);
	return levelInfo.name;
}

/**
 * Calculate XP required for a specific level
 */
export function getXpRequiredForLevel(level: number): number {
	if (level <= 1) return 0;
	if (level > MAX_LEVEL) return Infinity;

	const levelInfo = getLevelInfo(level);
	return levelInfo.minXp;
}

/**
 * Get a summary of level progression
 */
export function getLevelProgressSummary(xpTotal: number): {
	currentLevel: number;
	currentLevelName: string;
	xpProgress: string;
	percentComplete: number;
	levelsRemaining: number;
} {
	const details = getLevelDetails(xpTotal);

	return {
		currentLevel: details.level,
		currentLevelName: details.name,
		xpProgress: `${details.xpInLevel} / ${details.maxXp - details.minXp}`,
		percentComplete: details.progressPercentage,
		levelsRemaining: MAX_LEVEL - details.level,
	};
}

/**
 * Get all available levels
 */
export function getAllLevels(): LevelInfo[] {
	return [...XP_LEVELS];
}

/**
 * Get level tier (for grouping levels visually)
 */
export function getLevelTier(
	level: number,
): "beginner" | "intermediate" | "advanced" | "master" | "legend" {
	if (level <= 4) return "beginner";
	if (level <= 8) return "intermediate";
	if (level <= 12) return "advanced";
	if (level <= 16) return "master";
	return "legend";
}
