"use server";

/**
 * XP History Server Actions
 *
 * Server actions for loading XP transaction history
 * Part of Feature 008: Feedback Gamification Integration
 */

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getXpSourceLabel } from "@/lib/services/gamification.service";

/**
 * XP Transaction with formatted data
 */
export interface XpTransactionItem {
	id: string;
	amount: number;
	source: string;
	sourceLabel: string;
	sourceId: string | null;
	streakBonus: number | null;
	createdAt: Date;
	metadata: Record<string, unknown> | null;
}

/**
 * XP History result
 */
export interface XpHistoryResult {
	success: boolean;
	data?: {
		transactions: XpTransactionItem[];
		totalXp: number;
		totalTransactions: number;
		feedbackXpTotal: number;
		feedbackTransactionCount: number;
	};
	error?: string;
}

/**
 * Filter options for XP history
 */
export interface XpHistoryFilter {
	/** Filter by source type: 'all' | 'feedback' | 'assessment' | 'development' */
	sourceType?: "all" | "feedback" | "assessment" | "development";
	/** Limit number of results */
	limit?: number;
	/** Offset for pagination */
	offset?: number;
}

/**
 * Feedback XP sources
 */
const FEEDBACK_SOURCES = [
	"feedback_given",
	"feedback_received",
	"feedback_insights",
	"feedback_applied",
];

/**
 * Assessment XP sources
 */
const ASSESSMENT_SOURCES = [
	"assessment_phase_1",
	"assessment_phase_2",
	"assessment_complete",
	"assessment_retake",
];

/**
 * Development XP sources
 */
const DEVELOPMENT_SOURCES = [
	"challenge_completed",
	"module_completed",
	"collaborative_bonus",
	"badge_reward",
	"streak_bonus",
];

/**
 * Get XP history for the current user
 */
export async function getXpHistoryAction(
	filter: XpHistoryFilter = {},
): Promise<XpHistoryResult> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "Usuario no autenticado" };
		}

		const userId = session.user.id;
		const { sourceType = "all", limit = 50, offset = 0 } = filter;

		// Build source filter
		let sourceFilter: string[] | undefined;
		if (sourceType === "feedback") {
			sourceFilter = FEEDBACK_SOURCES;
		} else if (sourceType === "assessment") {
			sourceFilter = ASSESSMENT_SOURCES;
		} else if (sourceType === "development") {
			sourceFilter = DEVELOPMENT_SOURCES;
		}

		// Query transactions
		const [transactions, totalCount, feedbackStats] = await Promise.all([
			prisma.xpTransaction.findMany({
				where: {
					userId,
					...(sourceFilter ? { source: { in: sourceFilter } } : {}),
				},
				orderBy: { createdAt: "desc" },
				take: limit,
				skip: offset,
			}),
			prisma.xpTransaction.count({
				where: {
					userId,
					...(sourceFilter ? { source: { in: sourceFilter } } : {}),
				},
			}),
			// Get feedback-specific stats
			prisma.xpTransaction.aggregate({
				where: {
					userId,
					source: { in: FEEDBACK_SOURCES },
				},
				_sum: { amount: true },
				_count: true,
			}),
		]);

		// Get total XP from gamification record
		const gamification = await prisma.userGamification.findUnique({
			where: { userId },
			select: { xpTotal: true },
		});

		// Format transactions
		const formattedTransactions: XpTransactionItem[] = transactions.map(
			(tx) => ({
				id: tx.id,
				amount: tx.amount,
				source: tx.source,
				sourceLabel: getXpSourceLabel(tx.source),
				sourceId: tx.sourceId,
				streakBonus: tx.streakBonus,
				createdAt: tx.createdAt,
				metadata: tx.metadata ? safeParseJson(tx.metadata) : null,
			}),
		);

		return {
			success: true,
			data: {
				transactions: formattedTransactions,
				totalXp: gamification?.xpTotal ?? 0,
				totalTransactions: totalCount,
				feedbackXpTotal: feedbackStats._sum.amount ?? 0,
				feedbackTransactionCount: feedbackStats._count,
			},
		};
	} catch (error) {
		console.error("[getXpHistoryAction] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Error al cargar historial",
		};
	}
}

/**
 * Safely parse JSON string
 */
function safeParseJson(jsonString: string): Record<string, unknown> | null {
	try {
		return JSON.parse(jsonString);
	} catch {
		return null;
	}
}

/**
 * Export XP history as CSV
 */
export async function exportXpHistoryAction(
	filter: XpHistoryFilter = {},
): Promise<{ success: boolean; csv?: string; error?: string }> {
	const result = await getXpHistoryAction({ ...filter, limit: 1000 });

	if (!result.success || !result.data) {
		return { success: false, error: result.error };
	}

	const headers = ["Fecha", "Fuente", "XP", "Bonus Racha", "ID"];
	const rows = result.data.transactions.map((tx) => [
		new Date(tx.createdAt).toISOString(),
		tx.sourceLabel,
		tx.amount.toString(),
		tx.streakBonus?.toString() ?? "",
		tx.sourceId ?? "",
	]);

	const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
		"\n",
	);

	return { success: true, csv };
}
