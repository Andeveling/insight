/**
 * Feedback Response Service
 *
 * Handles saving and managing peer feedback responses
 * Implements anonymization, partial progress saving, and status updates
 */

import { prisma } from "@/lib/prisma.db";
import {
	generateAnonymousHash,
	hasRespondentAlreadyResponded,
} from "../_utils/anonymization";

/**
 * Input for saving a single feedback response
 */
export interface SaveFeedbackResponseInput {
	requestId: string;
	questionId: string;
	respondentId: string;
	answer: string;
}

/**
 * Input for saving all responses at once
 */
export interface SubmitFeedbackInput {
	requestId: string;
	respondentId: string;
	answers: Array<{
		questionId: string;
		answer: string;
	}>;
}

/**
 * Result of saving feedback responses
 */
export interface SaveFeedbackResult {
	success: boolean;
	error?: string;
	savedCount?: number;
}

/**
 * Saves a single feedback response
 * Used for partial progress saving during questionnaire completion
 *
 * @param input - Response data
 * @returns Save result
 */
export async function saveFeedbackResponse(
	input: SaveFeedbackResponseInput,
): Promise<SaveFeedbackResult> {
	const { requestId, questionId, respondentId, answer } = input;

	// Validate request exists and is pending
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		select: {
			id: true,
			status: true,
			isAnonymous: true,
			respondentId: true,
		},
	});

	if (!request) {
		return { success: false, error: "Request not found" };
	}

	if (request.status !== "PENDING") {
		return { success: false, error: "Request is no longer pending" };
	}

	if (request.respondentId !== respondentId) {
		return {
			success: false,
			error: "Not authorized to respond to this request",
		};
	}

	// Generate anonymous hash if needed
	const anonymousHash = request.isAnonymous
		? generateAnonymousHash(respondentId, requestId)
		: null;

	try {
		// Upsert response (allows updating if user changes their answer)
		await prisma.feedbackResponse.upsert({
			where: {
				requestId_questionId: {
					requestId,
					questionId,
				},
			},
			update: {
				answer,
				anonymousHash,
			},
			create: {
				requestId,
				questionId,
				answer,
				anonymousHash,
			},
		});

		return { success: true, savedCount: 1 };
	} catch (error) {
		console.error("Failed to save feedback response:", error);
		return { success: false, error: "Failed to save response" };
	}
}

/**
 * Submits all feedback responses at once and marks request as completed
 *
 * @param input - All responses to submit
 * @returns Submit result
 */
export async function submitFeedback(
	input: SubmitFeedbackInput,
): Promise<SaveFeedbackResult> {
	const { requestId, respondentId, answers } = input;

	// Validate request
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		select: {
			id: true,
			status: true,
			isAnonymous: true,
			respondentId: true,
		},
	});

	if (!request) {
		return { success: false, error: "Request not found" };
	}

	if (request.status !== "PENDING") {
		return { success: false, error: "Request is no longer pending" };
	}

	if (request.respondentId !== respondentId) {
		return {
			success: false,
			error: "Not authorized to respond to this request",
		};
	}

	// Validate all 5 questions are answered
	if (answers.length !== 5) {
		return { success: false, error: "All 5 questions must be answered" };
	}

	const anonymousHash = request.isAnonymous
		? generateAnonymousHash(respondentId, requestId)
		: null;

	try {
		// Use transaction to ensure all responses are saved together
		await prisma.$transaction(async (tx) => {
			// Save all responses
			for (const { questionId, answer } of answers) {
				await tx.feedbackResponse.upsert({
					where: {
						requestId_questionId: {
							requestId,
							questionId,
						},
					},
					update: {
						answer,
						anonymousHash,
					},
					create: {
						requestId,
						questionId,
						answer,
						anonymousHash,
					},
				});
			}

			// Mark request as completed
			await tx.feedbackRequest.update({
				where: { id: requestId },
				data: { status: "COMPLETED" },
			});
		});

		return { success: true, savedCount: answers.length };
	} catch (error) {
		console.error("Failed to submit feedback:", error);
		return { success: false, error: "Failed to submit feedback" };
	}
}

/**
 * Declines a feedback request
 *
 * @param requestId - The request to decline
 * @param respondentId - The responding user (for authorization)
 * @returns Result of decline operation
 */
export async function declineFeedbackRequest(
	requestId: string,
	respondentId: string,
): Promise<{ success: boolean; error?: string }> {
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		select: { id: true, status: true, respondentId: true },
	});

	if (!request) {
		return { success: false, error: "Request not found" };
	}

	if (request.respondentId !== respondentId) {
		return { success: false, error: "Not authorized to decline this request" };
	}

	if (request.status !== "PENDING") {
		return { success: false, error: "Request is no longer pending" };
	}

	try {
		await prisma.feedbackRequest.update({
			where: { id: requestId },
			data: { status: "DECLINED" },
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to decline feedback request:", error);
		return { success: false, error: "Failed to decline request" };
	}
}

/**
 * Gets partial progress for a feedback request (answers already saved)
 *
 * @param requestId - The request ID
 * @param respondentId - The respondent ID (for authorization)
 * @returns Saved answers or null
 */
export async function getPartialProgress(
	requestId: string,
	respondentId: string,
): Promise<Array<{ questionId: string; answer: string }> | null> {
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		select: { respondentId: true, isAnonymous: true },
	});

	if (!request || request.respondentId !== respondentId) {
		return null;
	}

	const responses = await prisma.feedbackResponse.findMany({
		where: { requestId },
		select: { questionId: true, answer: true },
	});

	return responses;
}

/**
 * Gets all feedback questions in order
 *
 * @returns Array of feedback questions
 */
export async function getFeedbackQuestions() {
	return prisma.feedbackQuestion.findMany({
		orderBy: { order: "asc" },
	});
}

/**
 * Validates that all existing response hashes are unique (no duplicate responses)
 *
 * @param requestId - The request ID
 * @param respondentId - The potential respondent
 * @returns Boolean indicating if respondent can submit
 */
export async function canRespondToRequest(
	requestId: string,
	respondentId: string,
): Promise<{ canRespond: boolean; reason?: string }> {
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		include: { responses: true },
	});

	if (!request) {
		return { canRespond: false, reason: "Request not found" };
	}

	if (request.status !== "PENDING") {
		return { canRespond: false, reason: "Request is no longer pending" };
	}

	if (request.respondentId !== respondentId) {
		return { canRespond: false, reason: "Not authorized to respond" };
	}

	// Check if already responded (for anonymous requests)
	if (request.isAnonymous && request.responses.length > 0) {
		const existingHashes = request.responses
			.map((r) => r.anonymousHash)
			.filter((h): h is string => h !== null);

		if (
			hasRespondentAlreadyResponded(respondentId, requestId, existingHashes)
		) {
			return { canRespond: false, reason: "Already responded to this request" };
		}
	}

	// Check if expired
	if (request.expiresAt && new Date() > request.expiresAt) {
		return { canRespond: false, reason: "Request has expired" };
	}

	return { canRespond: true };
}
