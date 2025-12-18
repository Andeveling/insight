/**
 * Feedback Request Service
 *
 * Handles creating, validating, and managing peer feedback requests
 * Implements business rules for team membership, cooldown periods, and expiration
 */

import { prisma } from "@/lib/prisma.db";
import type { FeedbackRequestStatus } from "@/generated/prisma/client";

/**
 * Input for creating a new feedback request
 */
export interface CreateFeedbackRequestInput {
	requesterId: string;
	respondentIds: string[];
	isAnonymous: boolean;
}

/**
 * Result of creating feedback requests
 */
export interface CreateFeedbackRequestResult {
	success: boolean;
	createdRequests: string[];
	errors: Array<{
		respondentId: string;
		reason: string;
	}>;
}

/**
 * Feedback request with respondent details for dashboard display
 */
export interface FeedbackRequestWithDetails {
	id: string;
	status: FeedbackRequestStatus;
	isAnonymous: boolean;
	sentAt: Date;
	expiresAt: Date | null;
	respondent: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	responseCount: number;
}

/**
 * Cooldown period in days between feedback requests to the same person
 */
const COOLDOWN_PERIOD_DAYS = 30;

/**
 * Expiration period in days for feedback requests
 */
const EXPIRATION_PERIOD_DAYS = 14;

/**
 * Creates feedback requests for multiple respondents
 * Validates team membership, cooldown periods, and prevents self-requests
 *
 * @param input - Request creation input
 * @returns Result with created requests and any errors
 */
export async function createFeedbackRequests(
	input: CreateFeedbackRequestInput,
): Promise<CreateFeedbackRequestResult> {
	const { requesterId, respondentIds, isAnonymous } = input;
	const createdRequests: string[] = [];
	const errors: Array<{ respondentId: string; reason: string }> = [];

	// Validate respondent count
	if (respondentIds.length < 3 || respondentIds.length > 5) {
		return {
			success: false,
			createdRequests: [],
			errors: [
				{ respondentId: "", reason: "Must select between 3 and 5 teammates" },
			],
		};
	}

	// Check for self-request
	if (respondentIds.includes(requesterId)) {
		return {
			success: false,
			createdRequests: [],
			errors: [
				{
					respondentId: requesterId,
					reason: "Cannot request feedback from yourself",
				},
			],
		};
	}

	// Check for duplicates in respondent list
	const uniqueRespondents = new Set(respondentIds);
	if (uniqueRespondents.size !== respondentIds.length) {
		return {
			success: false,
			createdRequests: [],
			errors: [
				{ respondentId: "", reason: "Duplicate respondents in request" },
			],
		};
	}

	// Calculate expiration date
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + EXPIRATION_PERIOD_DAYS);

	for (const respondentId of respondentIds) {
		// Check cooldown period
		const cooldownError = await checkCooldownPeriod(requesterId, respondentId);
		if (cooldownError) {
			errors.push({ respondentId, reason: cooldownError });
			continue;
		}

		// Validate team membership
		const isMember = await validateTeamMembership(requesterId, respondentId);
		if (!isMember) {
			errors.push({ respondentId, reason: "Respondent is not a team member" });
			continue;
		}

		// Create the feedback request
		try {
			const request = await prisma.feedbackRequest.create({
				data: {
					requesterId,
					respondentId,
					isAnonymous,
					status: "PENDING",
					expiresAt,
				},
			});
			createdRequests.push(request.id);
		} catch (error) {
			console.error(
				`Failed to create feedback request for ${respondentId}:`,
				error,
			);
			errors.push({ respondentId, reason: "Failed to create request" });
		}
	}

	return {
		success: createdRequests.length > 0,
		createdRequests,
		errors,
	};
}

/**
 * Validates that two users are members of the same team
 *
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @returns Boolean indicating if they share a team
 */
export async function validateTeamMembership(
	userId1: string,
	userId2: string,
): Promise<boolean> {
	// Get teams for both users
	const user1Teams = await prisma.teamMember.findMany({
		where: { userId: userId1 },
		select: { teamId: true },
	});

	const user2Teams = await prisma.teamMember.findMany({
		where: { userId: userId2 },
		select: { teamId: true },
	});

	// Check for any common team
	const user1TeamIds = new Set(user1Teams.map((t) => t.teamId));
	return user2Teams.some((t) => user1TeamIds.has(t.teamId));
}

/**
 * Checks if a cooldown period is still active between requester and respondent
 *
 * @param requesterId - The requester user ID
 * @param respondentId - The respondent user ID
 * @returns Error message if cooldown active, null if okay
 */
export async function checkCooldownPeriod(
	requesterId: string,
	respondentId: string,
): Promise<string | null> {
	const cooldownDate = new Date();
	cooldownDate.setDate(cooldownDate.getDate() - COOLDOWN_PERIOD_DAYS);

	const recentRequest = await prisma.feedbackRequest.findFirst({
		where: {
			requesterId,
			respondentId,
			sentAt: { gte: cooldownDate },
		},
		orderBy: { sentAt: "desc" },
	});

	if (recentRequest) {
		const nextAvailable = new Date(recentRequest.sentAt);
		nextAvailable.setDate(nextAvailable.getDate() + COOLDOWN_PERIOD_DAYS);
		const daysRemaining = Math.ceil(
			(nextAvailable.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
		);
		return `Cooldown active. Can request again in ${daysRemaining} days.`;
	}

	return null;
}

/**
 * Marks expired requests as EXPIRED
 * Should be called periodically via cron job
 *
 * @returns Number of requests marked as expired
 */
export async function markExpiredRequests(): Promise<number> {
	const result = await prisma.feedbackRequest.updateMany({
		where: {
			status: "PENDING",
			expiresAt: { lt: new Date() },
		},
		data: {
			status: "EXPIRED",
		},
	});

	return result.count;
}

/**
 * Gets all feedback requests for a user (both sent and received)
 *
 * @param userId - The user ID
 * @param type - 'sent' for requests user created, 'received' for requests awaiting response
 * @returns Array of feedback requests with details
 */
export async function getFeedbackRequests(
	userId: string,
	type: "sent" | "received",
): Promise<FeedbackRequestWithDetails[]> {
	const whereClause =
		type === "sent" ? { requesterId: userId } : { respondentId: userId };

	const requests = await prisma.feedbackRequest.findMany({
		where: whereClause,
		include: {
			respondent: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
			responses: {
				select: { id: true },
			},
		},
		orderBy: { sentAt: "desc" },
	});

	return requests.map((request) => ({
		id: request.id,
		status: request.status,
		isAnonymous: request.isAnonymous,
		sentAt: request.sentAt,
		expiresAt: request.expiresAt,
		respondent: type === "sent" ? request.respondent : request.requester,
		responseCount: request.responses.length,
	}));
}

/**
 * Gets a single feedback request by ID with full details
 *
 * @param requestId - The request ID
 * @returns Feedback request or null if not found
 */
export async function getFeedbackRequestById(requestId: string) {
	return prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		include: {
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
			respondent: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
			responses: true,
		},
	});
}

/**
 * Gets teammates available for feedback request
 * Excludes self and users with active cooldown
 *
 * @param userId - The requesting user ID
 * @returns Array of available teammates
 */
export async function getAvailableTeammates(userId: string) {
	// Get user's teams
	const userTeams = await prisma.teamMember.findMany({
		where: { userId },
		select: { teamId: true },
	});

	if (userTeams.length === 0) {
		return [];
	}

	const teamIds = userTeams.map((t) => t.teamId);

	// Get all members of these teams (except self)
	const teammates = await prisma.teamMember.findMany({
		where: {
			teamId: { in: teamIds },
			userId: { not: userId },
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
		distinct: ["userId"],
	});

	// Check cooldown for each teammate
	const cooldownDate = new Date();
	cooldownDate.setDate(cooldownDate.getDate() - COOLDOWN_PERIOD_DAYS);

	const recentRequests = await prisma.feedbackRequest.findMany({
		where: {
			requesterId: userId,
			sentAt: { gte: cooldownDate },
		},
		select: { respondentId: true },
	});

	const inCooldown = new Set(recentRequests.map((r) => r.respondentId));

	return teammates.map((tm) => ({
		...tm.user,
		inCooldown: inCooldown.has(tm.user.id),
	}));
}
