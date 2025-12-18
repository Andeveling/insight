/**
 * XP Calculator Utility
 * Calculates pending XP for feedback requests
 * Part of Feature 008: Feedback Gamification Integration
 */

import { getStreakBonus } from "@/lib/constants/xp-levels";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";
import { prisma } from "@/lib/prisma.db";

export interface PendingFeedbackXp {
	requestId: string;
	baseXp: number;
	streakMultiplier: number;
	totalXp: number;
	expiresAt: Date;
	isUrgent: boolean; // < 2 days to expiration
}

export interface PendingXpSummary {
	totalPendingXp: number;
	pendingRequestsCount: number;
	requests: PendingFeedbackXp[];
}

/**
 * Calculate total pending XP for a user's pending feedback requests
 * Includes streak bonus if applicable
 *
 * @param userId - User ID to calculate pending XP for
 * @returns Summary of pending XP with breakdown per request
 */
export async function calculatePendingFeedbackXp(
	userId: string,
): Promise<PendingXpSummary> {
	// Get user's current streak
	const gamification = await prisma.userGamification.findUnique({
		where: { userId },
		select: { currentStreak: true },
	});

	const currentStreak = gamification?.currentStreak ?? 0;
	const streakMultiplier = getStreakBonus(currentStreak);

	// Get all pending feedback requests where user is respondent
	const pendingRequests = await prisma.feedbackRequest.findMany({
		where: {
			respondentId: userId,
			status: "PENDING",
		},
		select: {
			id: true,
			expiresAt: true,
		},
		orderBy: {
			expiresAt: "asc", // Urgent requests first
		},
	});

	// Check which requests already have XP awarded (shouldn't happen for PENDING, but safety check)
	const requestIds = pendingRequests.map((r) => r.id);
	const awardedTransactions = await prisma.xpTransaction.findMany({
		where: {
			userId,
			source: "feedback_given",
			sourceId: { in: requestIds },
		},
		select: { sourceId: true },
	});

	const awardedRequestIds = new Set(awardedTransactions.map((t) => t.sourceId));

	// Calculate XP for each pending request
	const now = new Date();
	const urgentThreshold = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

	const requests: PendingFeedbackXp[] = pendingRequests
		.filter((req) => !awardedRequestIds.has(req.id)) // Exclude already awarded
		.map((req) => {
			const baseXp = FEEDBACK_XP_REWARDS.FEEDBACK_GIVEN;
			const totalXp = Math.round(baseXp * streakMultiplier);
			const timeUntilExpiration = req.expiresAt.getTime() - now.getTime();
			const isUrgent =
				timeUntilExpiration < urgentThreshold && timeUntilExpiration > 0;

			return {
				requestId: req.id,
				baseXp,
				streakMultiplier,
				totalXp,
				expiresAt: req.expiresAt,
				isUrgent,
			};
		});

	const totalPendingXp = requests.reduce((sum, req) => sum + req.totalXp, 0);

	return {
		totalPendingXp,
		pendingRequestsCount: requests.length,
		requests,
	};
}
