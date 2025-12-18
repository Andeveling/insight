"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	checkLevelUp,
	getLevelDetails,
	getLevelName,
} from "@/lib/services/level-calculator.service";

/**
 * Level-up check result
 */
interface LevelUpCheckResult {
	leveledUp: boolean;
	previousLevel: number;
	newLevel: number;
	newLevelName: string;
	xpGained: number;
	message: string;
}

/**
 * Check if user has leveled up based on XP gain
 *
 * This is typically called after XP is awarded to determine
 * if a level-up notification should be shown.
 *
 * @param previousXp - XP before the action
 * @param newXp - XP after the action
 */
export async function checkLevelUpAction(
	previousXp: number,
	newXp: number,
): Promise<LevelUpCheckResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const xpGained = newXp - previousXp;
	const levelUpResult = checkLevelUp(previousXp, xpGained);
	const previousLevelDetails = getLevelDetails(previousXp);
	const newLevelDetails = getLevelDetails(newXp);

	if (
		levelUpResult.totalLevelsUp > 0 &&
		levelUpResult.levelsGained.length > 0
	) {
		const newLevel =
			levelUpResult.levelsGained[levelUpResult.levelsGained.length - 1].level;
		const newLevelName = getLevelName(newLevel);

		// Update stored level in gamification record
		await prisma.userGamification.update({
			where: { userId: session.user.id },
			data: { currentLevel: newLevel },
		});

		return {
			leveledUp: true,
			previousLevel: previousLevelDetails.level,
			newLevel,
			newLevelName,
			xpGained,
			message: `¡Felicidades! Has subido al nivel ${newLevel}: ${newLevelName}`,
		};
	}

	return {
		leveledUp: false,
		previousLevel: previousLevelDetails.level,
		newLevel: newLevelDetails.level,
		newLevelName: getLevelName(newLevelDetails.level),
		xpGained,
		message: `Has ganado ${xpGained} XP`,
	};
}

/**
 * Get user's current level info
 *
 * Returns level, XP progress, and distance to next level.
 */
export async function getCurrentLevel() {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("Usuario no autenticado");
	}

	const gamification = await prisma.userGamification.findUnique({
		where: { userId: session.user.id },
		select: {
			xpTotal: true,
			currentLevel: true,
		},
	});

	if (!gamification) {
		return {
			level: 1,
			levelName: getLevelName(1),
			xpTotal: 0,
		};
	}

	// Recalculate level from XP (source of truth)
	const calculatedLevel = getLevelDetails(gamification.xpTotal).level;

	return {
		level: calculatedLevel,
		levelName: getLevelName(calculatedLevel),
		xpTotal: gamification.xpTotal,
	};
}
