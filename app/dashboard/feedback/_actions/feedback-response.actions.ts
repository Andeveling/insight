"use server";

/**
 * Feedback Response Server Actions
 *
 * Server-side actions for submitting peer feedback responses
 */

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
	submitFeedback,
	declineFeedbackRequest,
	getPartialProgress,
	getFeedbackQuestions,
	canRespondToRequest,
	saveFeedbackResponse,
} from "../_services/feedback-response.service";
import { getFeedbackRequestById } from "../_services/feedback-request.service";
import {
	sendFeedbackCompletedNotification,
	sendDeclineNotification,
} from "../_utils/feedback-notification";
import {
	awardFeedbackGivenXp,
	awardFeedbackReceivedXpInternal,
	type AwardFeedbackXpResult,
} from "./award-feedback-xp";

/**
 * Action result type
 */
export interface ActionResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Extended result for submit feedback with XP data
 */
export interface SubmitFeedbackResult {
	xpResult?: AwardFeedbackXpResult;
}

/**
 * Submits completed feedback responses
 *
 * @param requestId - The feedback request ID
 * @param answers - Array of question answers
 */
export async function submitFeedbackAction(
	requestId: string,
	answers: Array<{ questionId: string; answer: string }>,
): Promise<ActionResult<SubmitFeedbackResult>> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		// Validate can respond
		const canRespond = await canRespondToRequest(requestId, session.user.id);
		if (!canRespond.canRespond) {
			return { success: false, error: canRespond.reason };
		}

		const result = await submitFeedback({
			requestId,
			respondentId: session.user.id,
			answers,
		});

		if (result.success) {
			// Award XP for giving feedback (to respondent)
			const xpResult = await awardFeedbackGivenXp({ requestId });

			// Award XP for receiving feedback (to requester) - non-blocking
			awardFeedbackReceivedXpInternal(requestId).catch((error) => {
				console.error("Failed to award feedback received XP:", error);
			});

			// Send notification to requester (non-blocking)
			sendFeedbackCompletedNotification(requestId, session.user.id).catch(
				(error) => {
					console.error(
						"Failed to send feedback completed notification:",
						error,
					);
				},
			);

			revalidatePath("/dashboard/feedback");

			return {
				success: true,
				data: { xpResult },
			};
		}

		return {
			success: result.success,
			error: result.error,
		};
	} catch (error) {
		console.error("Submit feedback action error:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

/**
 * Saves a single response for progress tracking
 *
 * @param requestId - The feedback request ID
 * @param questionId - The question ID
 * @param answer - The selected answer
 */
export async function saveProgressAction(
	requestId: string,
	questionId: string,
	answer: string,
): Promise<ActionResult> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		const result = await saveFeedbackResponse({
			requestId,
			questionId,
			respondentId: session.user.id,
			answer,
		});

		return {
			success: result.success,
			error: result.error,
		};
	} catch (error) {
		console.error("Save progress action error:", error);
		return { success: false, error: "Failed to save progress" };
	}
}

/**
 * Declines a feedback request
 *
 * @param requestId - The feedback request ID
 */
export async function declineFeedbackAction(
	requestId: string,
): Promise<ActionResult> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		const result = await declineFeedbackRequest(requestId, session.user.id);

		if (result.success) {
			// Send decline notification to requester (non-blocking)
			sendDeclineNotification(requestId).catch((error) => {
				console.error("Failed to send decline notification:", error);
			});

			revalidatePath("/dashboard/feedback");
		}

		return {
			success: result.success,
			error: result.error,
		};
	} catch (error) {
		console.error("Decline feedback action error:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

/**
 * Gets feedback questionnaire data for a request
 *
 * @param requestId - The feedback request ID
 */
export async function getFeedbackQuestionnaireAction(
	requestId: string,
): Promise<
	ActionResult<{
		request: Awaited<ReturnType<typeof getFeedbackRequestById>>;
		questions: Awaited<ReturnType<typeof getFeedbackQuestions>>;
		savedAnswers: Array<{ questionId: string; answer: string }>;
	}>
> {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { success: false, error: "Not authenticated" };
		}

		// Get request details
		const request = await getFeedbackRequestById(requestId);
		if (!request) {
			return { success: false, error: "Request not found" };
		}

		// Verify authorization
		if (request.respondentId !== session.user.id) {
			return { success: false, error: "Not authorized to view this request" };
		}

		// Get questions and any saved progress
		const [questions, savedAnswers] = await Promise.all([
			getFeedbackQuestions(),
			getPartialProgress(requestId, session.user.id),
		]);

		return {
			success: true,
			data: {
				request,
				questions,
				savedAnswers: savedAnswers || [],
			},
		};
	} catch (error) {
		console.error("Get feedback questionnaire action error:", error);
		return { success: false, error: "Failed to load questionnaire" };
	}
}
