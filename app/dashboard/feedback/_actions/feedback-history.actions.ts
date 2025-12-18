"use server";

/**
 * Feedback History Server Actions
 *
 * Server-side actions for loading feedback history data
 */

import { getSession } from "@/lib/auth";
import {
	getFeedbackHistory,
	getFeedbackCycleDetails,
	compareFeedbackCycles,
	calculateStrengthTrends,
	getAdjustmentHistory,
	type FeedbackCycle,
	type StrengthTrend,
} from "../_services/feedback-analysis.service";

/**
 * Action result type
 */
export interface ActionResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Loads feedback history for the current user
 */
export async function loadFeedbackHistoryAction(): Promise<
	ActionResult<{
		cycles: FeedbackCycle[];
		trends: StrengthTrend[];
		adjustmentHistory: Awaited<ReturnType<typeof getAdjustmentHistory>>;
	}>
> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "No autenticado" };
		}

		const [cycles, trends, adjustmentHistory] = await Promise.all([
			getFeedbackHistory(session.user.id),
			calculateStrengthTrends(session.user.id),
			getAdjustmentHistory(session.user.id),
		]);

		return {
			success: true,
			data: {
				cycles,
				trends,
				adjustmentHistory,
			},
		};
	} catch (error) {
		console.error("Load feedback history action error:", error);
		return { success: false, error: "Error al cargar historial" };
	}
}

/**
 * Loads details for a specific feedback cycle
 */
export async function loadCycleDetailsAction(
	cycleId: string,
): Promise<ActionResult<FeedbackCycle>> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "No autenticado" };
		}

		const cycle = await getFeedbackCycleDetails(cycleId, session.user.id);

		if (!cycle) {
			return { success: false, error: "Ciclo no encontrado" };
		}

		return {
			success: true,
			data: cycle,
		};
	} catch (error) {
		console.error("Load cycle details action error:", error);
		return { success: false, error: "Error al cargar detalles del ciclo" };
	}
}

/**
 * Compares two feedback cycles
 */
export async function compareCyclesAction(
	cycleId1: string,
	cycleId2: string,
): Promise<
	ActionResult<{
		cycle1: FeedbackCycle;
		cycle2: FeedbackCycle;
		changes: Array<{
			strengthKey: string;
			score1: number;
			score2: number;
			delta: number;
			trend: "up" | "down" | "stable";
		}>;
	}>
> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "No autenticado" };
		}

		const result = await compareFeedbackCycles(
			cycleId1,
			cycleId2,
			session.user.id,
		);

		if (!result) {
			return { success: false, error: "No se pudieron comparar los ciclos" };
		}

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error("Compare cycles action error:", error);
		return { success: false, error: "Error al comparar ciclos" };
	}
}
