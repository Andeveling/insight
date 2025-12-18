"use server";

/**
 * Get Individual Readiness Action
 *
 * Fetches user progress and calculates readiness for individual report generation.
 * Reuses getUserProgress() from development as the single source of truth.
 *
 * @feature 009-contextual-reports
 */

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getUserProgress } from "@/app/dashboard/development/_actions";

import {
	buildRequirements,
	calculateIndividualScore,
	getNextRecommendedAction,
	getReadinessStatusLabel,
	isIndividualReady,
	type IndividualProgressData,
} from "../_lib/readiness-calculator";
import type { IndividualReadiness } from "../_schemas/readiness.schema";

/**
 * Result type for individual readiness action
 */
export interface GetIndividualReadinessResult {
	success: boolean;
	data?: IndividualReadiness;
	error?: string;
}

/**
 * Get individual readiness status for report generation
 *
 * @returns Individual readiness data with score, requirements, and recommendations
 */
export async function getIndividualReadiness(): Promise<GetIndividualReadinessResult> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "Usuario no autenticado",
			};
		}

		const userId = session.user.id;

		// Check if user has strengths configured
		const userWithStrengths = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				userStrengths: {
					select: { id: true },
					take: 1,
				},
			},
		});

		const hasStrengths = (userWithStrengths?.userStrengths?.length ?? 0) > 0;

		// Get progress from development module (single source of truth)
		const progress = await getUserProgress();

		// Build individual progress data for calculator
		const progressData: IndividualProgressData = {
			modulesCompleted: progress.modulesCompleted,
			xpTotal: progress.xpTotal,
			challengesCompleted: progress.challengesCompleted,
			hasStrengths,
		};

		// Calculate readiness
		const score = calculateIndividualScore(progressData);
		const requirements = buildRequirements(progressData);
		const isReady = isIndividualReady(requirements);
		const statusLabel = getReadinessStatusLabel(score);
		const nextAction = getNextRecommendedAction(requirements);

		// Build result
		const readiness: IndividualReadiness = {
			type: "individual",
			score,
			isReady,
			requirements,
			statusLabel,
			nextRecommendedAction: nextAction ?? undefined,
			developmentContext: {
				modulesCompleted: progress.modulesCompleted,
				challengesCompleted: progress.challengesCompleted,
				xpTotal: progress.xpTotal,
				currentLevel: progress.level,
				badgesUnlocked: progress.badgesUnlocked,
				streakDays: progress.currentStreak,
				hasStrengths,
			},
		};

		return {
			success: true,
			data: readiness,
		};
	} catch (error) {
		console.error("[getIndividualReadiness] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}
