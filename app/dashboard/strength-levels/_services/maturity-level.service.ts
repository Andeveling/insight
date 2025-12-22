/**
 * Maturity Level Service
 *
 * Service for managing strength maturity levels and calculating progress.
 * Provides functions to get maturity levels with calculated progress percentages.
 */

import { type MaturityLevel } from "@/generated/prisma/enums";
import {
	LEVEL_ORDER,
	XP_THRESHOLDS,
} from "@/lib/constants/strength-levels.constants";
import { prisma } from "@/lib/prisma.db";
import {
	calculateProgress,
	shouldLevelUp,
} from "@/lib/services/strength-levels/xp-calculator";
import type { StrengthMaturityProgress } from "@/specs/012-strength-levels/contracts/get-maturity-levels.schema";

export interface MaturityLevelServiceResult {
	success: boolean;
	maturityLevels: StrengthMaturityProgress[];
	error?: string;
}

/**
 * Get maturity level with progress calculation for a specific strength-user combination
 */
export async function getMaturityLevelWithProgress(
	userId: string,
	strengthId: string,
): Promise<StrengthMaturityProgress | null> {
	// Defensive check for Prisma client
	if (!prisma) {
		console.error("[getMaturityLevelWithProgress] Prisma client is undefined");
		return null;
	}

	const maturityLevel = await prisma.strengthMaturityLevel.findUnique({
		where: {
			userId_strengthId: {
				userId,
				strengthId,
			},
		},
		include: {
			strength: {
				select: {
					id: true,
					name: true,
					nameEs: true,
				},
			},
		},
	});

	if (!maturityLevel) {
		return null;
	}

	return transformToProgress(maturityLevel);
}

/**
 * Get all maturity levels for a user with progress calculations
 */
export async function getAllMaturityLevelsForUser(
	userId: string,
	strengthIds?: string[],
): Promise<MaturityLevelServiceResult> {
	try {
		// Defensive check for Prisma client
		if (!prisma) {
			console.error("[getAllMaturityLevelsForUser] Prisma client is undefined");
			return {
				success: false,
				maturityLevels: [],
				error: "Database connection not available",
			};
		}

		const whereClause = strengthIds?.length
			? {
					userId,
					strengthId: { in: strengthIds },
				}
			: { userId };

		const maturityLevels = await prisma.strengthMaturityLevel.findMany({
			where: whereClause,
			include: {
				strength: {
					select: {
						id: true,
						name: true,
						nameEs: true,
					},
				},
			},
			orderBy: [{ totalXpEarned: "desc" }, { currentLevel: "desc" }],
		});

		const levelsWithProgress = maturityLevels.map(transformToProgress);

		return {
			success: true,
			maturityLevels: levelsWithProgress,
		};
	} catch (error) {
		console.error(
			"[maturity-level.service] Error fetching maturity levels:",
			error,
		);
		return {
			success: false,
			maturityLevels: [],
			error:
				error instanceof Error
					? error.message
					: "Error al obtener niveles de madurez",
		};
	}
}

/**
 * Initialize maturity level for a user-strength combination if it doesn't exist
 */
export async function initializeMaturityLevel(
	userId: string,
	strengthId: string,
): Promise<StrengthMaturityProgress> {
	// Defensive check for Prisma client
	if (!prisma) {
		console.error("[initializeMaturityLevel] Prisma client is undefined");
		throw new Error("Database connection not available");
	}

	const existing = await getMaturityLevelWithProgress(userId, strengthId);

	if (existing) {
		return existing;
	}

	const newLevel = await prisma.strengthMaturityLevel.create({
		data: {
			userId,
			strengthId,
			currentLevel: "SPONGE",
			currentXp: 0,
			totalXpEarned: 0,
			lastLevelUp: new Date(),
		},
		include: {
			strength: {
				select: {
					id: true,
					name: true,
					nameEs: true,
				},
			},
		},
	});

	return transformToProgress(newLevel);
}

/**
 * Update XP for a maturity level and handle level-up if needed
 * Returns the updated maturity level and whether a level-up occurred
 */
export async function addXpToMaturityLevel(
	userId: string,
	strengthId: string,
	xpAmount: number,
): Promise<{
	maturityLevel: StrengthMaturityProgress;
	leveledUp: boolean;
	newLevel: MaturityLevel | null;
	previousLevel: MaturityLevel;
}> {
	// Defensive check for Prisma client
	if (!prisma) {
		console.error("[addXpToMaturityLevel] Prisma client is undefined");
		throw new Error("Database connection not available");
	}

	const current = await prisma.strengthMaturityLevel.findUnique({
		where: {
			userId_strengthId: { userId, strengthId },
		},
		include: {
			strength: {
				select: {
					id: true,
					name: true,
					nameEs: true,
				},
			},
		},
	});

	if (!current) {
		throw new Error(
			`StrengthMaturityLevel not found for user ${userId} and strength ${strengthId}`,
		);
	}

	const previousLevel = current.currentLevel;

	// Check if we should level up
	const levelUpResult = shouldLevelUp(
		current.currentXp,
		previousLevel,
		xpAmount,
	);

	const updateData: {
		currentXp: number;
		totalXpEarned: number;
		lastXpGain: Date;
		currentLevel?: MaturityLevel;
		lastLevelUp?: Date;
	} = {
		currentXp: current.currentXp + xpAmount,
		totalXpEarned: current.totalXpEarned + xpAmount,
		lastXpGain: new Date(),
	};

	if (levelUpResult.shouldLevelUp && levelUpResult.newLevel) {
		updateData.currentLevel = levelUpResult.newLevel;
		updateData.lastLevelUp = new Date();
	}

	const updated = await prisma.strengthMaturityLevel.update({
		where: {
			userId_strengthId: { userId, strengthId },
		},
		data: updateData,
		include: {
			strength: {
				select: {
					id: true,
					name: true,
					nameEs: true,
				},
			},
		},
	});

	return {
		maturityLevel: transformToProgress(updated),
		leveledUp: levelUpResult.shouldLevelUp,
		newLevel: levelUpResult.newLevel,
		previousLevel,
	};
}

/**
 * Transform database model to StrengthMaturityProgress type
 */
function transformToProgress(maturityLevel: {
	id: string;
	currentXp: number;
	currentLevel: MaturityLevel;
	totalXpEarned: number;
	lastLevelUp: Date | null;
	strength: {
		id: string;
		name: string;
		nameEs: string | null;
	};
}): StrengthMaturityProgress {
	const level = maturityLevel.currentLevel;
	const progress = calculateProgress(maturityLevel.currentXp, level);
	const levelIndex = LEVEL_ORDER.indexOf(level);
	const isMaxLevel = levelIndex === LEVEL_ORDER.length - 1;

	// Calculate XP needed for next level
	let xpForNextLevel: number | null = null;
	if (!isMaxLevel) {
		const nextLevel = LEVEL_ORDER[levelIndex + 1];
		xpForNextLevel = XP_THRESHOLDS[nextLevel].min;
	}

	return {
		id: maturityLevel.id,
		strengthId: maturityLevel.strength.id,
		strengthName: maturityLevel.strength.name,
		strengthNameEs:
			maturityLevel.strength.nameEs ?? maturityLevel.strength.name,
		currentLevel: level,
		xpCurrent: maturityLevel.currentXp,
		xpTotal: maturityLevel.totalXpEarned,
		xpForNextLevel,
		progressPercent: progress.progressPercentage,
		isMaxLevel,
		levelReachedAt: maturityLevel.lastLevelUp,
	};
}
