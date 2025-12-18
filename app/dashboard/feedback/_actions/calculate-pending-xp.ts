"use server";

/**
 * Calculate Pending XP Server Action
 *
 * Calculates total pending XP from feedback requests
 * Part of Feature 008: Feedback Gamification Integration
 */

import { getSession } from "@/lib/auth";
import type { PendingXpSummary } from "../_utils/xp-calculator";
import { calculatePendingFeedbackXp } from "../_utils/xp-calculator";

export interface CalculatePendingXpResult {
	success: boolean;
	data?: PendingXpSummary;
	error?: string;
}

/**
 * Server action to calculate pending XP for authenticated user
 */
export async function calculatePendingXpAction(): Promise<CalculatePendingXpResult> {
	try {
		const session = await getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: "Usuario no autenticado",
			};
		}

		const summary = await calculatePendingFeedbackXp(session.user.id);

		return {
			success: true,
			data: summary,
		};
	} catch (error) {
		console.error("[calculatePendingXpAction] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al calcular XP pendiente",
		};
	}
}
