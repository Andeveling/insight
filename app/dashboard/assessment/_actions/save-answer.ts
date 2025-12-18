"use server";

/**
 * Server Action: Save Answer
 * Validates and saves an answer to the database, updates session state
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type {
	AnswerValue,
	AssessmentQuestion,
} from "@/lib/types/assessment.types";
import { SaveAnswerInputSchema } from "../_schemas/answer.schema";

export interface SaveAnswerInput {
	sessionId: string;
	questionId: string;
	answer: AnswerValue;
	confidence?: number;
}

export interface SaveAnswerResult {
	success: boolean;
	nextQuestion?: AssessmentQuestion;
	currentStep: number;
	totalSteps: number;
	phaseComplete: boolean;
	assessmentComplete: boolean;
	error?: string;
}

/**
 * Save an answer and return the next question
 */
export async function saveAnswer(
	input: SaveAnswerInput,
): Promise<SaveAnswerResult> {
	try {
		// Validate input
		const validationResult = SaveAnswerInputSchema.safeParse(input);
		if (!validationResult.success) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				phaseComplete: false,
				assessmentComplete: false,
				error: validationResult.error.issues[0]?.message || "Invalid input",
			};
		}

		// Get current user
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				phaseComplete: false,
				assessmentComplete: false,
				error: "User not authenticated",
			};
		}

		const userId = session.user.id;
		const { sessionId, questionId, answer, confidence } = validationResult.data;

		// Get assessment session (select only needed fields)
		const assessmentSession = await prisma.assessmentSession.findUnique({
			where: { id: sessionId },
			select: {
				id: true,
				userId: true,
				status: true,
				phase: true,
				currentStep: true,
				totalSteps: true,
				domainScores: true,
				strengthScores: true,
			},
		});

		if (!assessmentSession) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				phaseComplete: false,
				assessmentComplete: false,
				error: "Session not found",
			};
		}

		// Verify user owns this session
		if (assessmentSession.userId !== userId) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				phaseComplete: false,
				assessmentComplete: false,
				error: "Access denied",
			};
		}

		// Verify session is in progress
		if (assessmentSession.status !== "IN_PROGRESS") {
			return {
				success: false,
				currentStep: assessmentSession.currentStep,
				totalSteps: assessmentSession.totalSteps,
				phaseComplete: false,
				assessmentComplete: false,
				error: "Session is not in progress",
			};
		}

		// Verify question exists (select only needed fields)
		const question = await prisma.assessmentQuestion.findUnique({
			where: { id: questionId },
			select: {
				id: true,
				phase: true,
				domainId: true,
				strengthId: true,
				weight: true,
			},
		});

		if (!question) {
			return {
				success: false,
				currentStep: assessmentSession.currentStep,
				totalSteps: assessmentSession.totalSteps,
				phaseComplete: false,
				assessmentComplete: false,
				error: "Question not found",
			};
		}

		// Upsert answer (allow updating existing answer)
		await prisma.userAssessmentAnswer.upsert({
			where: {
				sessionId_questionId: {
					sessionId,
					questionId,
				},
			},
			create: {
				userId,
				sessionId,
				questionId,
				answer: JSON.stringify(answer),
				confidence,
				answeredAt: new Date(),
			},
			update: {
				answer: JSON.stringify(answer),
				confidence,
				answeredAt: new Date(),
			},
		});

		// Get current phase questions and answers count
		const phaseQuestions = await prisma.assessmentQuestion.count({
			where: { phase: assessmentSession.phase },
		});

		const phaseAnswers = await prisma.userAssessmentAnswer.count({
			where: {
				sessionId,
				question: { phase: assessmentSession.phase },
			},
		});

		// Calculate new current step
		const totalAnswers = await prisma.userAssessmentAnswer.count({
			where: { sessionId },
		});

		const newCurrentStep = totalAnswers + 1;

		// Check if phase is complete
		const phaseComplete = phaseAnswers >= phaseQuestions;
		const assessmentComplete = phaseComplete && assessmentSession.phase === 3;

		// Update session state
		await prisma.assessmentSession.update({
			where: { id: sessionId },
			data: {
				currentStep:
					newCurrentStep > assessmentSession.totalSteps
						? assessmentSession.totalSteps
						: newCurrentStep,
				lastActivityAt: new Date(),
				...(assessmentComplete
					? {
							status: "COMPLETED",
							completedAt: new Date(),
						}
					: {}),
			},
		});

		// Get next question if phase not complete
		let nextQuestion: AssessmentQuestion | undefined;

		if (!phaseComplete) {
			const answeredIds = await prisma.userAssessmentAnswer.findMany({
				where: { sessionId },
				select: { questionId: true },
			});

			const answeredIdSet = new Set(answeredIds.map((a) => a.questionId));

			const nextQ = await prisma.assessmentQuestion.findFirst({
				where: {
					phase: assessmentSession.phase,
					id: { notIn: Array.from(answeredIdSet) },
				},
				orderBy: { order: "asc" },
				include: {
					domain: { select: { id: true, name: true } },
					strength: { select: { id: true, name: true } },
				},
			});

			if (nextQ) {
				nextQuestion = {
					id: nextQ.id,
					phase: nextQ.phase as 1 | 2 | 3,
					order: nextQ.order,
					text: nextQ.text,
					type: nextQ.type as "SCALE" | "CHOICE" | "RANKING",
					options: nextQ.options ? JSON.parse(nextQ.options) : undefined,
					scaleRange: nextQ.scaleRange
						? JSON.parse(nextQ.scaleRange)
						: undefined,
					domainId: nextQ.domainId,
					strengthId: nextQ.strengthId ?? undefined,
					weight: nextQ.weight,
				};
			}
		}

		return {
			success: true,
			nextQuestion,
			currentStep:
				newCurrentStep > assessmentSession.totalSteps
					? assessmentSession.totalSteps
					: newCurrentStep,
			totalSteps: assessmentSession.totalSteps,
			phaseComplete,
			assessmentComplete,
		};
	} catch (error) {
		console.error("[SaveAnswer] Error:", error);
		return {
			success: false,
			currentStep: 0,
			totalSteps: 0,
			phaseComplete: false,
			assessmentComplete: false,
			error: error instanceof Error ? error.message : "Failed to save answer",
		};
	}
}
