"use server";

/**
 * Server Action: Get Next Question
 * Loads the next question in the current phase
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type { AssessmentQuestion } from "@/lib/types/assessment.types";

export interface GetNextQuestionResult {
	success: boolean;
	question?: AssessmentQuestion;
	currentStep: number;
	totalSteps: number;
	isLastInPhase: boolean;
	isLastOverall: boolean;
	phase: number;
	error?: string;
}

/**
 * Get the next unanswered question for the current session
 */
export async function getNextQuestion(
	sessionId: string,
): Promise<GetNextQuestionResult> {
	try {
		// Verify user authentication
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				isLastInPhase: false,
				isLastOverall: false,
				phase: 1,
				error: "User not authenticated",
			};
		}

		// Get assessment session
		const assessmentSession = await prisma.assessmentSession.findUnique({
			where: { id: sessionId },
			include: {
				answers: {
					select: { questionId: true },
				},
			},
		});

		if (!assessmentSession) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				isLastInPhase: false,
				isLastOverall: false,
				phase: 1,
				error: "Session not found",
			};
		}

		// Verify user owns this session
		if (assessmentSession.userId !== session.user.id) {
			return {
				success: false,
				currentStep: 0,
				totalSteps: 0,
				isLastInPhase: false,
				isLastOverall: false,
				phase: 1,
				error: "Access denied",
			};
		}

		// Check session status
		if (assessmentSession.status !== "IN_PROGRESS") {
			return {
				success: false,
				currentStep: assessmentSession.currentStep,
				totalSteps: assessmentSession.totalSteps,
				isLastInPhase: false,
				isLastOverall: false,
				phase: assessmentSession.phase,
				error: `Session is ${assessmentSession.status.toLowerCase()}`,
			};
		}

		// Get answered question IDs
		const answeredIds = new Set(
			assessmentSession.answers.map((a) => a.questionId),
		);

		// Build query based on phase
		const whereClause: { phase: number; strengthId?: { in: string[] } } = {
			phase: assessmentSession.phase,
		};

		// For Phase 4, filter by Top 5 strengths
		if (assessmentSession.phase === 4 && assessmentSession.results) {
			const results = JSON.parse(assessmentSession.results);
			if (results.rankedStrengths) {
				const topStrengthIds = results.rankedStrengths.map(
					(s: { strengthId: string }) => s.strengthId,
				);
				whereClause.strengthId = { in: topStrengthIds };
			}
		}

		// Get current phase questions
		const phaseQuestions = await prisma.assessmentQuestion.findMany({
			where: whereClause,
			orderBy: { order: "asc" },
			include: {
				domain: {
					select: { id: true, name: true },
				},
				strength: {
					select: { id: true, name: true },
				},
			},
		});

		// Find next unanswered question in current phase
		const nextQuestion = phaseQuestions.find((q) => !answeredIds.has(q.id));

		// Calculate phase boundaries
		const totalPhaseQuestions = phaseQuestions.length;
		const answeredInPhase = phaseQuestions.filter((q) =>
			answeredIds.has(q.id),
		).length;

		// Check if this is the last question
		const isLastInPhase = answeredInPhase === totalPhaseQuestions - 1;
		const isLastOverall =
			assessmentSession.phase === 3 &&
			answeredInPhase === totalPhaseQuestions - 1;

		if (!nextQuestion) {
			// All questions in phase answered - phase complete
			return {
				success: true,
				currentStep: assessmentSession.currentStep,
				totalSteps: assessmentSession.totalSteps,
				isLastInPhase: true,
				isLastOverall: assessmentSession.phase === 3,
				phase: assessmentSession.phase,
			};
		}

		// Transform question to client format
		const question: AssessmentQuestion = {
			id: nextQuestion.id,
			phase: nextQuestion.phase as 1 | 2 | 3 | 4,
			order: nextQuestion.order,
			text: nextQuestion.text,
			type: nextQuestion.type as "SCALE" | "CHOICE" | "RANKING" | "SCENARIO",
			options: nextQuestion.options
				? JSON.parse(nextQuestion.options)
				: undefined,
			scaleRange: nextQuestion.scaleRange
				? JSON.parse(nextQuestion.scaleRange)
				: undefined,
			domainId: nextQuestion.domainId,
			strengthId: nextQuestion.strengthId ?? undefined,
			weight: nextQuestion.weight,
		};

		return {
			success: true,
			question,
			currentStep: assessmentSession.currentStep,
			totalSteps: assessmentSession.totalSteps,
			isLastInPhase,
			isLastOverall,
			phase: assessmentSession.phase,
		};
	} catch (error) {
		console.error("[GetNextQuestion] Error:", error);
		return {
			success: false,
			currentStep: 0,
			totalSteps: 0,
			isLastInPhase: false,
			isLastOverall: false,
			phase: 1,
			error:
				error instanceof Error ? error.message : "Failed to get next question",
		};
	}
}

/**
 * Get a specific question by ID
 */
export async function getQuestionById(
	questionId: string,
): Promise<AssessmentQuestion | null> {
	try {
		const question = await prisma.assessmentQuestion.findUnique({
			where: { id: questionId },
			include: {
				domain: {
					select: { id: true, name: true },
				},
				strength: {
					select: { id: true, name: true },
				},
			},
		});

		if (!question) return null;

		return {
			id: question.id,
			phase: question.phase as 1 | 2 | 3,
			order: question.order,
			text: question.text,
			type: question.type as "SCALE" | "CHOICE" | "RANKING",
			options: question.options ? JSON.parse(question.options) : undefined,
			scaleRange: question.scaleRange
				? JSON.parse(question.scaleRange)
				: undefined,
			domainId: question.domainId,
			strengthId: question.strengthId ?? undefined,
			weight: question.weight,
		};
	} catch {
		return null;
	}
}
