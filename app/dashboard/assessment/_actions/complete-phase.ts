"use server";

/**
 * Server Action: Complete Phase
 * Calculates phase results, determines next phase questions
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type {
	AssessmentQuestion,
	PhaseTransitionResult,
} from "@/lib/types/assessment.types";
import {
	type QuestionData as AdaptiveQuestionData,
	getTopDomains,
	selectPhase2Questions,
} from "@/lib/utils/assessment/adaptive-logic";
import {
	type AnswerData,
	calculateDomainScores,
	calculateStrengthScores,
	type DomainInfo,
	type QuestionData as ScoreQuestionData,
	type StrengthInfo,
} from "@/lib/utils/assessment/score-calculator";

export interface CompletePhaseResult {
	success: boolean;
	transition?: PhaseTransitionResult;
	nextPhaseQuestions?: AssessmentQuestion[];
	error?: string;
}

/**
 * Complete the current phase and prepare for the next one
 */
export async function completePhase(
	sessionId: string,
): Promise<CompletePhaseResult> {
	try {
		// Verify user authentication
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return {
				success: false,
				error: "User not authenticated",
			};
		}

		const userId = session.user.id;

		// Get assessment session with answers
		const assessmentSession = await prisma.assessmentSession.findUnique({
			where: { id: sessionId },
			include: {
				answers: true,
			},
		});

		if (!assessmentSession) {
			return { success: false, error: "Session not found" };
		}

		if (assessmentSession.userId !== userId) {
			return { success: false, error: "Access denied" };
		}

		if (assessmentSession.status !== "IN_PROGRESS") {
			return { success: false, error: "Session is not in progress" };
		}

		const currentPhase = assessmentSession.phase;

		// Get all questions for current phase
		const phaseQuestions = await prisma.assessmentQuestion.findMany({
			where: { phase: currentPhase },
		});

		// Verify all phase questions are answered
		const answeredQuestionIds = new Set(
			assessmentSession.answers
				.filter((a) => phaseQuestions.some((q) => q.id === a.questionId))
				.map((a) => a.questionId),
		);

		const unansweredQuestions = phaseQuestions.filter(
			(q) => !answeredQuestionIds.has(q.id),
		);

		if (unansweredQuestions.length > 0) {
			return {
				success: false,
				error: `${unansweredQuestions.length} questions remain unanswered in Phase ${currentPhase}`,
			};
		}

		// Get all domains and strengths for scoring
		const [domains, strengths, allQuestions] = await Promise.all([
			prisma.domain.findMany({ select: { id: true, name: true } }),
			prisma.strength.findMany({
				select: { id: true, name: true, domainId: true },
			}),
			prisma.assessmentQuestion.findMany(),
		]);

		// Transform data for scoring functions
		const domainInfos: DomainInfo[] = domains.map((d) => ({
			id: d.id,
			name: d.name,
		}));

		const strengthInfos: StrengthInfo[] = strengths.map((s) => ({
			id: s.id,
			name: s.name,
			domainId: s.domainId,
		}));

		const questionData: AdaptiveQuestionData[] = allQuestions.map((q) => ({
			id: q.id,
			phase: q.phase,
			type: q.type as "SCALE" | "CHOICE" | "RANKING",
			weight: q.weight,
			domainId: q.domainId,
			strengthId: q.strengthId,
			order: q.order,
		}));

		// Create score-compatible question data (without order requirement)
		const scoreQuestionData: ScoreQuestionData[] = questionData.map((q) => ({
			id: q.id,
			phase: q.phase,
			type: q.type,
			weight: q.weight,
			domainId: q.domainId,
			strengthId: q.strengthId,
		}));

		const answerData: AnswerData[] = assessmentSession.answers.map((a) => ({
			questionId: a.questionId,
			answer: JSON.parse(a.answer),
		}));

		let transition: PhaseTransitionResult;
		let nextPhaseQuestions: AssessmentQuestion[] = [];

		if (currentPhase === 1) {
			// Calculate domain scores after Phase 1
			const domainScoresRecord = calculateDomainScores(
				answerData,
				scoreQuestionData,
				domainInfos,
			);

			const domainScoresMap: Record<string, number> = {};
			for (const [id, score] of Object.entries(domainScoresRecord)) {
				domainScoresMap[id] = score.score;
			}

			// Get top domains for preview
			const topDomains = getTopDomains(domainScoresRecord);

			// Select Phase 2 questions based on domain scores
			const phase2QuestionData = selectPhase2Questions(
				domainScoresRecord,
				questionData,
				strengthInfos,
			);

			// Update session with domain scores
			await prisma.assessmentSession.update({
				where: { id: sessionId },
				data: {
					phase: 2,
					domainScores: JSON.stringify(domainScoresMap),
					lastActivityAt: new Date(),
				},
			});

			// Load full Phase 2 questions
			const phase2Ids = phase2QuestionData.map((q) => q.id);
			const phase2Questions = await prisma.assessmentQuestion.findMany({
				where: { id: { in: phase2Ids } },
				orderBy: { order: "asc" },
				include: {
					domain: { select: { id: true, name: true } },
					strength: { select: { id: true, name: true } },
				},
			});

			nextPhaseQuestions = phase2Questions.map((q) => ({
				id: q.id,
				phase: q.phase as 1 | 2 | 3,
				order: q.order,
				text: q.text,
				type: q.type as "SCALE" | "CHOICE" | "RANKING",
				options: q.options ? JSON.parse(q.options) : undefined,
				scaleRange: q.scaleRange ? JSON.parse(q.scaleRange) : undefined,
				domainId: q.domainId,
				strengthId: q.strengthId ?? undefined,
				weight: q.weight,
			}));

			transition = {
				completedPhase: 1,
				domainScores: domainScoresMap,
				topDomains: topDomains.map((d) => ({
					id: d.domainId,
					name: d.domainName,
					score: d.score,
				})),
				nextPhase: 2,
				nextPhasePreview: `We'll explore your top ${topDomains.length} domains in more depth`,
			};
		} else if (currentPhase === 2) {
			// Calculate strength scores after Phase 2
			const strengthScoresRecord = calculateStrengthScores(
				answerData,
				scoreQuestionData,
				strengthInfos,
			);

			const strengthScoresMap: Record<string, number> = {};
			for (const [id, score] of Object.entries(strengthScoresRecord)) {
				strengthScoresMap[id] = score.score;
			}

			// Get preliminary top 5-7 strengths for Phase 3 ranking
			const sortedStrengths = Object.entries(strengthScoresRecord)
				.sort(([, a], [, b]) => b.score - a.score)
				.slice(0, 7);

			// Update session with strength scores
			await prisma.assessmentSession.update({
				where: { id: sessionId },
				data: {
					phase: 3,
					strengthScores: JSON.stringify(strengthScoresMap),
					lastActivityAt: new Date(),
				},
			});

			// Load Phase 3 questions
			const phase3Questions = await prisma.assessmentQuestion.findMany({
				where: { phase: 3 },
				orderBy: { order: "asc" },
				include: {
					domain: { select: { id: true, name: true } },
					strength: { select: { id: true, name: true } },
				},
			});

			nextPhaseQuestions = phase3Questions.map((q) => ({
				id: q.id,
				phase: q.phase as 1 | 2 | 3,
				order: q.order,
				text: q.text,
				type: q.type as "SCALE" | "CHOICE" | "RANKING",
				options: q.options ? JSON.parse(q.options) : undefined,
				scaleRange: q.scaleRange ? JSON.parse(q.scaleRange) : undefined,
				domainId: q.domainId,
				strengthId: q.strengthId ?? undefined,
				weight: q.weight,
			}));

			transition = {
				completedPhase: 2,
				preliminaryStrengths: sortedStrengths.map(([id, score]) => {
					const strength = strengthInfos.find((s) => s.id === id);
					return {
						id,
						name: strength?.name || "Unknown",
						score: score.score,
					};
				}),
				nextPhase: 3,
				nextPhasePreview:
					"Final step: rank your top strengths to confirm your profile",
			};
		} else {
			// Phase 3 complete - assessment finished
			transition = {
				completedPhase: 3,
			};

			// Mark session as requiring results calculation
			await prisma.assessmentSession.update({
				where: { id: sessionId },
				data: {
					lastActivityAt: new Date(),
				},
			});
		}

		return {
			success: true,
			transition,
			nextPhaseQuestions,
		};
	} catch (error) {
		console.error("[CompletePhase] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to complete phase",
		};
	}
}
