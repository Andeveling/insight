"use client";

/**
 * Assessment Main Page
 * Entry point for the strength assessment flow
 */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LevelBadge, XpGainToast } from "@/components/gamification";
import { Spinner } from "@/components/ui/spinner";
import { useGamificationProgress } from "@/lib/hooks/use-gamification-progress";
import type {
	AnswerValue,
	DomainScore,
	PhaseTransitionResult,
} from "@/lib/types/assessment.types";
import type { AwardXpResult } from "@/lib/types/gamification.types";
import DashboardContainer from "../_components/dashboard-container";
import {
	DomainAffinityChart,
	PhaseTransition,
	ProgressIndicator,
	QuestionCard,
	WelcomeScreen,
} from "./_components";
import { useAssessmentSession, useAssessmentXp } from "./_hooks";

type AssessmentView =
	| "loading"
	| "welcome"
	| "question"
	| "phase-transition"
	| "error";

export default function AssessmentPage() {
	const router = useRouter();
	const {
		session,
		isLoading,
		error,
		currentQuestion,
		currentStep,
		totalSteps,
		phase,
		startSession,
		resumeSession,
		submitAnswer,
		completeCurrentPhase,
		finishAssessment,
		isPhaseComplete,
		isAssessmentComplete,
	} = useAssessmentSession();

	// Gamification hook
	const {
		awardState,
		xpStatus,
		awardMilestoneXp,
		loadXpStatus,
		clearLastAward,
	} = useAssessmentXp();

	// Get current level for badge
	const { progress } = useGamificationProgress();

	const [transition, setTransition] = useState<PhaseTransitionResult | null>(
		null,
	);
	const [phaseXpResult, setPhaseXpResult] = useState<AwardXpResult | null>(
		null,
	);

	// Determine view based on session state (using useMemo to avoid setState in effect)
	const view = useMemo<AssessmentView>(() => {
		if (isLoading) return "loading";
		if (error) return "error";
		if (isPhaseComplete && transition) return "phase-transition";
		if (!session) return "welcome";
		if (currentQuestion) return "question";
		return "welcome";
	}, [isLoading, error, session, currentQuestion, isPhaseComplete, transition]);

	// Handle redirect to results when assessment complete
	useEffect(() => {
		if (isAssessmentComplete && session?.id) {
			router.push(`/dashboard/assessment/results/${session.id}`);
		}
	}, [isAssessmentComplete, session?.id, router]);

	// Load XP status when session is available
	useEffect(() => {
		if (session?.id) {
			loadXpStatus(session.id);
		}
	}, [session?.id, loadXpStatus]);

	// Handle start/resume
	const handleStart = async () => {
		await startSession();
	};

	const handleResume = async () => {
		await resumeSession();
	};

	// Handle answer submission
	const handleAnswer = async (answer: AnswerValue) => {
		await submitAnswer(answer);
	};

	// Handle phase completion
	const handlePhaseComplete = async () => {
		if (!session?.id) return;

		const result = await completeCurrentPhase();
		if (result?.transition) {
			setTransition(result.transition);

			// Award XP for completing this phase
			const milestone =
				result.transition.completedPhase === 1
					? "phase_1"
					: result.transition.completedPhase === 2
						? "phase_2"
						: "completion";

			const xpResult = await awardMilestoneXp(session.id, milestone);
			if (xpResult.success && xpResult.xpResult) {
				setPhaseXpResult(xpResult.xpResult);
			}
		}
	};

	// Handle continue after phase transition
	const handleContinue = async () => {
		if (transition?.completedPhase === 3) {
			await finishAssessment();
		} else {
			setTransition(null);
			setPhaseXpResult(null);
			// View will update automatically via useMemo since transition becomes null
		}
	};

	// Handle XP toast close
	const handleXpToastComplete = () => {
		clearLastAward();
	};

	// Render based on view
	if (view === "loading") {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Spinner className="h-8 w-8" />
			</div>
		);
	}

	if (view === "error") {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
				<p className="text-destructive text-lg font-medium">
					{error ?? "Ocurrió un error"}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="text-primary underline"
				>
					Intentar de nuevo
				</button>
			</div>
		);
	}

	if (view === "welcome") {
		return (
			<WelcomeScreen
				onStart={handleStart}
				onResume={session ? handleResume : undefined}
				hasExistingSession={!!session}
				isLoading={isLoading}
				isRetake={xpStatus?.isRetake}
			/>
		);
	}

	if (view === "phase-transition" && transition) {
		return (
			<>
				<PhaseTransition
					transition={transition}
					onContinue={handleContinue}
					isLoading={isLoading}
					xpResult={phaseXpResult ?? undefined}
					isRetake={xpStatus?.isRetake}
				/>
				{/* XP Toast for additional feedback */}
				{awardState.lastAward && (
					<XpGainToast
						xpAmount={awardState.lastAward.xpResult.xpAwarded}
						source={`Assessment ${
							awardState.lastAward.milestone === "phase_1"
								? "Fase 1"
								: awardState.lastAward.milestone === "phase_2"
									? "Fase 2"
									: "Completado"
						}`}
						streakBonus={
							awardState.lastAward.xpResult.streakMultiplier > 1
								? Math.round(
										(awardState.lastAward.xpResult.streakMultiplier - 1) * 100,
									)
								: undefined
						}
						leveledUp={awardState.lastAward.xpResult.leveledUp}
						newLevel={awardState.lastAward.xpResult.newLevel}
						onComplete={handleXpToastComplete}
					/>
				)}
			</>
		);
	}

	if (view === "question" && currentQuestion) {
		// Convert session domain scores to DomainScore format for chart
		const domainScoresForChart: Record<string, DomainScore> = {};
		if (session?.domainScores) {
			Object.entries(session.domainScores).forEach(([domainId, score]) => {
				domainScoresForChart[domainId] = {
					domainId,
					domainName: domainId, // Will be mapped in component
					score,
					questionCount: 0,
				};
			});
		}

		const showDomainChart =
			phase <= 2 && Object.keys(domainScoresForChart).length > 0;

		return (
			<DashboardContainer
				title="Evaluación de Fortalezas"
				description="Completa el test para saber que dice de ti"
				card={
					progress ? (
						<LevelBadge level={progress.currentLevel} size="lg" showIcon />
					) : null
				}
			>
				<div className="mx-auto max-w-4xl">
					{/* Progress indicator for phases */}
					<div className="mb-6">
						<ProgressIndicator
							currentStep={currentStep}
							totalSteps={totalSteps}
							phase={phase}
						/>
					</div>

					<div
						className={
							showDomainChart ? "grid gap-6 lg:grid-cols-[1fr_300px]" : ""
						}
					>
						{/* Main question card */}
						<QuestionCard
							question={currentQuestion}
							onAnswer={handleAnswer}
							currentStep={currentStep}
							totalSteps={totalSteps}
							phase={phase}
							isLoading={isLoading}
							sessionId={session?.id}
							enableAutoSave={true}
						/>

						{/* Domain affinity chart - shown during Phase 1 and 2 */}
						{showDomainChart && (
							<div className="hidden lg:block">
								<DomainAffinityChart
									domainScores={domainScoresForChart}
									compact={true}
									animate={true}
								/>
							</div>
						)}
					</div>

					{/* Check for phase completion when we reach the last question */}
					{currentStep === totalSteps - 1 && (
						<div className="mt-8 text-center">
							<button
								onClick={handlePhaseComplete}
								disabled={isLoading}
								className="text-primary underline"
							>
								Completar fase {phase}
							</button>
						</div>
					)}
				</div>
			</DashboardContainer>
		);
	}

	// Fallback
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<Spinner className="h-8 w-8" />
		</div>
	);
}
