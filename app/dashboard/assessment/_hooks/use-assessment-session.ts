"use client";

/**
 * Hook: useAssessmentSession
 * Manages assessment session state, handles session lifecycle
 */

import { useState, useCallback, useEffect } from "react";
import type {
	AssessmentQuestion,
	AssessmentSession,
} from "@/lib/types/assessment.types";
import {
	createAssessmentSession,
	getActiveSession,
	saveAnswer as saveAnswerAction,
	completePhase as completePhaseAction,
	calculateResults as calculateResultsAction,
	saveResultsToProfile as saveResultsToProfileAction,
	type CompletePhaseResult,
} from "../_actions";

export interface UseAssessmentSessionResult {
	// Session state
	session: AssessmentSession | null;
	isLoading: boolean;
	error: string | null;

	// Current question
	currentQuestion: AssessmentQuestion | null;
	questions: AssessmentQuestion[];

	// Progress
	currentStep: number;
	totalSteps: number;
	progress: number;
	phase: 1 | 2 | 3;

	// Actions
	startSession: () => Promise<void>;
	resumeSession: () => Promise<void>;
	submitAnswer: (
		answer: number | string | string[],
		confidence?: number,
	) => Promise<void>;
	completeCurrentPhase: () => Promise<CompletePhaseResult | null>;
	finishAssessment: () => Promise<void>;
	saveToProfile: () => Promise<boolean>;

	// State helpers
	isPhaseComplete: boolean;
	isAssessmentComplete: boolean;
}

export function useAssessmentSession(): UseAssessmentSessionResult {
	// State
	const [session, setSession] = useState<AssessmentSession | null>(null);
	const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
	const [currentQuestion, setCurrentQuestion] =
		useState<AssessmentQuestion | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [totalSteps, setTotalSteps] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPhaseComplete, setIsPhaseComplete] = useState(false);
	const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);

	// Derived state
	const progress =
		totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
	const phase = session?.phase ?? 1;

	// Initialize: check for existing session
	useEffect(() => {
		const initSession = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await getActiveSession();

				if (result.success && result.hasActiveSession && result.session) {
					setSession(result.session);
					setCurrentStep(result.session.currentStep);
					setTotalSteps(result.session.totalSteps);

					if (result.questions && result.questions.length > 0) {
						setQuestions(result.questions);
						// Find next unanswered question
						const answeredIds = new Set(
							result.answers?.map((a) => a.questionId) ?? [],
						);
						const nextQ = result.questions.find((q) => !answeredIds.has(q.id));
						setCurrentQuestion(nextQ ?? null);
					}

					setIsPhaseComplete(false);
					setIsAssessmentComplete(result.session.status === "COMPLETED");
				}
			} catch (err) {
				console.error("[useAssessmentSession] Init error:", err);
				setError(err instanceof Error ? err.message : "Failed to load session");
			} finally {
				setIsLoading(false);
			}
		};

		initSession();
	}, []);

	// Start a new session
	const startSession = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await createAssessmentSession();

			if (!result.success || !result.sessionId) {
				throw new Error(result.error ?? "Failed to create session");
			}

			const sessionData: AssessmentSession = {
				id: result.sessionId,
				userId: "",
				status: "IN_PROGRESS",
				phase: 1,
				currentStep: 0,
				totalSteps: result.questions?.length ?? 60,
				startedAt: new Date(),
				lastActivityAt: new Date(),
			};

			setSession(sessionData);
			setQuestions(result.questions ?? []);
			setCurrentQuestion(result.questions?.[0] ?? null);
			setCurrentStep(0);
			setTotalSteps(result.questions?.length ?? 60);
			setIsPhaseComplete(false);
			setIsAssessmentComplete(false);
		} catch (err) {
			console.error("[useAssessmentSession] Start error:", err);
			setError(err instanceof Error ? err.message : "Failed to start session");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Resume existing session
	const resumeSession = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await getActiveSession();

			if (!result.success || !result.hasActiveSession || !result.session) {
				throw new Error(result.error ?? "No active session found");
			}

			setSession(result.session);
			setCurrentStep(result.session.currentStep);
			setTotalSteps(result.session.totalSteps);

			if (result.questions && result.questions.length > 0) {
				setQuestions(result.questions);
				const answeredIds = new Set(
					result.answers?.map((a) => a.questionId) ?? [],
				);
				const nextQ = result.questions.find((q) => !answeredIds.has(q.id));
				setCurrentQuestion(nextQ ?? null);
			}

			setIsPhaseComplete(false);
			setIsAssessmentComplete(result.session.status === "COMPLETED");
		} catch (err) {
			console.error("[useAssessmentSession] Resume error:", err);
			setError(err instanceof Error ? err.message : "Failed to resume session");
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Submit an answer
	const submitAnswer = useCallback(
		async (answer: number | string | string[], confidence?: number) => {
			if (!session || !currentQuestion) {
				setError("No active session or question");
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const result = await saveAnswerAction({
					sessionId: session.id,
					questionId: currentQuestion.id,
					answer,
					confidence,
				});

				if (!result.success) {
					throw new Error(result.error ?? "Failed to save answer");
				}

				setCurrentStep(result.currentStep);
				setTotalSteps(result.totalSteps);

				if (result.phaseComplete) {
					setIsPhaseComplete(true);
					setCurrentQuestion(null);
				} else if (result.assessmentComplete) {
					setIsAssessmentComplete(true);
					setCurrentQuestion(null);
				} else if (result.nextQuestion) {
					setCurrentQuestion(result.nextQuestion);
				}
			} catch (err) {
				console.error("[useAssessmentSession] Submit error:", err);
				setError(
					err instanceof Error ? err.message : "Failed to submit answer",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[session, currentQuestion],
	);

	// Complete current phase and transition
	const completeCurrentPhase = useCallback(async () => {
		if (!session) {
			setError("No active session");
			return null;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await completePhaseAction(session.id);

			if (!result.success || !result.transition) {
				throw new Error(result.error ?? "Failed to complete phase");
			}

			// Update session phase
			const newPhase = result.transition.nextPhase ?? session.phase;
			setSession({
				...session,
				phase: newPhase,
				domainScores: result.transition.domainScores,
			});

			// Set next phase questions
			if (result.nextPhaseQuestions && result.nextPhaseQuestions.length > 0) {
				setQuestions(result.nextPhaseQuestions);
				setCurrentQuestion(result.nextPhaseQuestions[0]);
				setCurrentStep(0);
				setTotalSteps(result.nextPhaseQuestions.length);
			}

			setIsPhaseComplete(false);

			// Check if assessment is complete (Phase 3 done)
			if (session.phase === 3) {
				setIsAssessmentComplete(true);
			}

			return result;
		} catch (err) {
			console.error("[useAssessmentSession] Complete phase error:", err);
			setError(err instanceof Error ? err.message : "Failed to complete phase");
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [session]);

	// Finish assessment and calculate results
	const finishAssessment = useCallback(async () => {
		if (!session) {
			setError("No active session");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await calculateResultsAction(session.id);

			if (!result.success) {
				throw new Error(result.error ?? "Failed to calculate results");
			}

			setSession({
				...session,
				status: "COMPLETED",
				results: result.results,
				completedAt: new Date(),
			});

			setIsAssessmentComplete(true);
		} catch (err) {
			console.error("[useAssessmentSession] Finish error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to finish assessment",
			);
		} finally {
			setIsLoading(false);
		}
	}, [session]);

	// Save results to user profile
	const saveToProfile = useCallback(async () => {
		if (!session) {
			setError("No active session");
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await saveResultsToProfileAction(session.id);

			if (!result.success) {
				throw new Error(result.error ?? "Failed to save to profile");
			}

			return true;
		} catch (err) {
			console.error("[useAssessmentSession] Save to profile error:", err);
			setError(
				err instanceof Error ? err.message : "Failed to save to profile",
			);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [session]);

	return {
		session,
		isLoading,
		error,
		currentQuestion,
		questions,
		currentStep,
		totalSteps,
		progress,
		phase,
		startSession,
		resumeSession,
		submitAnswer,
		completeCurrentPhase,
		finishAssessment,
		saveToProfile,
		isPhaseComplete,
		isAssessmentComplete,
	};
}
