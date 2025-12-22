"use server";

/**
 * Get Maturity Levels Server Action
 *
 * Retrieves maturity levels for a user's strengths with progress calculations.
 * Uses caching for optimal performance with React Server Components.
 */

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type {
	GetMaturityLevelsResult,
	StrengthMaturityProgress,
} from "@/specs/012-strength-levels/contracts/get-maturity-levels.schema";
import {
	getAllMaturityLevelsForUser,
	initializeMaturityLevel,
} from "../_services/maturity-level.service";

/**
 * Get all maturity levels for the current authenticated user
 * Automatically initializes maturity levels for strengths that don't have them yet
 */
export async function getMaturityLevels(
	strengthIds?: string[],
): Promise<GetMaturityLevelsResult> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				maturityLevels: [],
				error: "No autenticado",
			};
		}

		const userId = session.user.id;

		// First, ensure all user's strengths have maturity level entries
		await ensureMaturityLevelsExist(userId);

		// Get maturity levels with progress calculations
		const result = await getAllMaturityLevelsForUser(userId, strengthIds);

		return result;
	} catch (error) {
		console.error("[get-maturity-levels] Error:", error);
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
 * Get maturity level for a specific strength
 */
export async function getMaturityLevelForStrength(
	strengthId: string,
): Promise<{
	success: boolean;
	maturityLevel: StrengthMaturityProgress | null;
	error?: string;
}> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				maturityLevel: null,
				error: "No autenticado",
			};
		}

		const userId = session.user.id;

		// Initialize if doesn't exist
		const maturityLevel = await initializeMaturityLevel(userId, strengthId);

		return {
			success: true,
			maturityLevel,
		};
	} catch (error) {
		console.error("[get-maturity-level-for-strength] Error:", error);
		return {
			success: false,
			maturityLevel: null,
			error:
				error instanceof Error
					? error.message
					: "Error al obtener nivel de madurez",
		};
	}
}

/**
 * Ensure all user's strengths have corresponding maturity level entries
 * This is called automatically when fetching maturity levels
 */
async function ensureMaturityLevelsExist(userId: string): Promise<void> {
	// Defensive check for Prisma client
	if (!prisma) {
		console.error("[ensureMaturityLevelsExist] Prisma client is undefined");
		throw new Error("Database connection not available");
	}

	// Get user's strengths (from UserStrength relation)
	const userStrengths = await prisma.userStrength.findMany({
		where: { userId },
		select: { strengthId: true },
	});

	if (userStrengths.length === 0) {
		return; // User has no strengths yet
	}

	// Get existing maturity levels
	const existingLevels = await prisma.strengthMaturityLevel.findMany({
		where: { userId },
		select: { strengthId: true },
	});

	const existingStrengthIds = new Set(existingLevels.map((l) => l.strengthId));

	// Find strengths without maturity levels
	const missingStrengthIds = userStrengths
		.filter((us) => !existingStrengthIds.has(us.strengthId))
		.map((us) => us.strengthId);

	if (missingStrengthIds.length === 0) {
		return; // All strengths have maturity levels
	}

	// Create missing maturity levels individually (libSQL doesn't support skipDuplicates)
	// Use Promise.allSettled to handle potential race conditions gracefully
	await Promise.allSettled(
		missingStrengthIds.map((strengthId) =>
			prisma.strengthMaturityLevel
				.create({
					data: {
						userId,
						strengthId,
						currentLevel: "SPONGE",
						currentXp: 0,
						totalXpEarned: 0,
						lastLevelUp: new Date(),
					},
				})
				.catch(() => {
					// Ignore duplicate key errors (race condition)
				}),
		),
	);
}
