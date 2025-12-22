/**
 * XP Calculator Service
 *
 * Handles all XP-related calculations for the strength maturity system.
 * Pure functions for calculating level progression, XP requirements, and level-up detection.
 */

import {
	LEVEL_METADATA,
	LEVEL_ORDER,
	XP_THRESHOLDS,
} from "@/lib/constants/strength-levels.constants";
import type { MaturityLevel } from "@/lib/types/strength-levels.types";

/**
 * Result of XP progress calculation
 */
export interface XpProgressResult {
	currentLevel: MaturityLevel;
	currentXp: number;
	xpInCurrentLevel: number;
	xpRequiredForNextLevel: number;
	progressPercentage: number;
	isMaxLevel: boolean;
	nextLevel: MaturityLevel | null;
}

/**
 * Result of level-up check
 */
export interface LevelUpCheckResult {
	shouldLevelUp: boolean;
	newLevel: MaturityLevel | null;
	levelsGained: number;
	xpOverflow: number;
}

/**
 * Get the level index in the progression order
 */
export function getLevelIndex(level: MaturityLevel): number {
	return LEVEL_ORDER.indexOf(level);
}

/**
 * Get the next level in progression (or null if at max)
 */
export function getNextLevel(
	currentLevel: MaturityLevel,
): MaturityLevel | null {
	const currentIndex = getLevelIndex(currentLevel);

	if (currentIndex === -1 || currentIndex >= LEVEL_ORDER.length - 1) {
		return null;
	}

	return LEVEL_ORDER[currentIndex + 1];
}

/**
 * Get the previous level in progression (or null if at min)
 */
export function getPreviousLevel(
	currentLevel: MaturityLevel,
): MaturityLevel | null {
	const currentIndex = getLevelIndex(currentLevel);

	if (currentIndex <= 0) {
		return null;
	}

	return LEVEL_ORDER[currentIndex - 1];
}

/**
 * Get the XP required to reach a specific level from 0
 */
export function getXpForLevel(level: MaturityLevel): number {
	return XP_THRESHOLDS[level].min;
}

/**
 * Get the XP required to advance from current level to next level
 */
export function getXpForNextLevel(currentLevel: MaturityLevel): number | null {
	const nextLevel = getNextLevel(currentLevel);

	if (!nextLevel) {
		return null; // Already at max level
	}

	return XP_THRESHOLDS[nextLevel].min;
}

/**
 * Get the total XP range for a level (max - min + 1, or Infinity for ALCHEMIST)
 */
export function getLevelXpRange(level: MaturityLevel): number {
	const { min, max } = XP_THRESHOLDS[level];

	if (max === null) {
		return Infinity; // ALCHEMIST has no cap
	}

	return max - min + 1;
}

/**
 * Determine the level for a given XP amount
 */
export function getLevelForXp(xp: number): MaturityLevel {
	// Iterate from highest to lowest level
	for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
		const level = LEVEL_ORDER[i];
		if (xp >= XP_THRESHOLDS[level].min) {
			return level;
		}
	}

	// Default to SPONGE if somehow negative XP
	return "SPONGE";
}

/**
 * Calculate detailed XP progress for UI display
 */
export function calculateProgress(
	currentXp: number,
	currentLevel: MaturityLevel,
): XpProgressResult {
	const actualLevel = getLevelForXp(currentXp);
	const nextLevel = getNextLevel(actualLevel);
	const isMaxLevel = nextLevel === null;

	const levelMinXp = XP_THRESHOLDS[actualLevel].min;
	const xpInCurrentLevel = currentXp - levelMinXp;

	let xpRequiredForNextLevel: number;
	let progressPercentage: number;

	if (isMaxLevel) {
		// At ALCHEMIST - show progress toward next milestone (every 1000 XP)
		const xpAboveMin = currentXp - levelMinXp;
		const milestone = 1000;
		xpRequiredForNextLevel = milestone;
		progressPercentage = Math.min(
			100,
			((xpAboveMin % milestone) / milestone) * 100,
		);
	} else {
		const nextLevelMinXp = XP_THRESHOLDS[nextLevel].min;
		xpRequiredForNextLevel = nextLevelMinXp - levelMinXp;
		progressPercentage = Math.min(
			100,
			(xpInCurrentLevel / xpRequiredForNextLevel) * 100,
		);
	}

	return {
		currentLevel: actualLevel,
		currentXp,
		xpInCurrentLevel,
		xpRequiredForNextLevel,
		progressPercentage,
		isMaxLevel,
		nextLevel,
	};
}

/**
 * Check if XP gain should trigger a level-up
 */
export function shouldLevelUp(
	currentXp: number,
	currentLevel: MaturityLevel,
	xpGain: number,
): LevelUpCheckResult {
	const newTotalXp = currentXp + xpGain;
	const newLevel = getLevelForXp(newTotalXp);

	const currentIndex = getLevelIndex(currentLevel);
	const newIndex = getLevelIndex(newLevel);

	const shouldLevelUpResult = newIndex > currentIndex;
	const levelsGained = shouldLevelUpResult ? newIndex - currentIndex : 0;

	// Calculate XP overflow (XP beyond the level threshold)
	const newLevelMinXp = XP_THRESHOLDS[newLevel].min;
	const xpOverflow = newTotalXp - newLevelMinXp;

	return {
		shouldLevelUp: shouldLevelUpResult,
		newLevel: shouldLevelUpResult ? newLevel : null,
		levelsGained,
		xpOverflow,
	};
}

/**
 * Calculate XP needed to reach next level from current state
 */
export function getXpToNextLevel(
	currentXp: number,
	currentLevel: MaturityLevel,
): number | null {
	const nextLevel = getNextLevel(currentLevel);

	if (!nextLevel) {
		return null; // Already at max level
	}

	const nextLevelMinXp = XP_THRESHOLDS[nextLevel].min;
	return Math.max(0, nextLevelMinXp - currentXp);
}

/**
 * Format XP for display with CyberPunk styling
 */
export function formatXpDisplay(xp: number): string {
	if (xp >= 10000) {
		return `${(xp / 1000).toFixed(1)}K`;
	}
	return xp.toLocaleString();
}

/**
 * Get level display info for UI
 */
export function getLevelDisplayInfo(level: MaturityLevel) {
	return {
		...LEVEL_METADATA[level],
		index: getLevelIndex(level),
		isMaxLevel: getNextLevel(level) === null,
	};
}

/**
 * Calculate mastery percentage across all levels
 * Useful for overall progress display
 */
export function calculateOverallMastery(currentXp: number): number {
	const maxNonInfiniteXp = XP_THRESHOLDS.ALCHEMIST.min; // 5000

	if (currentXp >= maxNonInfiniteXp) {
		return 100;
	}

	return Math.round((currentXp / maxNonInfiniteXp) * 100);
}
