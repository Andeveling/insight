"use client";

/**
 * Assessment Main Page
 * Entry point for the strength assessment flow
 */

import { LucideIcon, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LevelBadge, XpGainToast } from "@/components/gamification";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
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
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="relative">
					<div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
					<Spinner className="h-12 w-12 text-primary relative z-10" />
				</div>
			</div>
		);
	}

	if (view === "error") {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
				<div className="h-16 w-16 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-500">
					<svg
						className="w-8 h-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<p className="text-destructive text-sm font-black uppercase tracking-[0.2em] text-center max-w-md">
					Error de Sistema: {error ?? "Falla en la sincronización de datos"}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-2 bg-muted border border-border text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors"
				>
					Reintentar Protocolo
				</button>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			{/* Technical Grid Background */}
			<div className="absolute inset-0 bg-grid-tech opacity-20 pointer-events-none" />
			<div className="absolute inset-0 bg-linear-to-b from-background via-background/20 to-background pointer-events-none" />

			<div className="relative z-10 container mx-auto px-4 py-8">
				<AnimatePresence mode="wait">
					<motion.div
						key={view}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{view === "welcome" && (
							<WelcomeScreen
								onStart={handleStart}
								onResume={session ? handleResume : undefined}
								hasExistingSession={!!session}
								isLoading={isLoading}
								isRetake={xpStatus?.isRetake}
							/>
						)}

						{view === "phase-transition" && transition && (
							<>
								<PhaseTransition
									transition={transition}
									onContinue={handleContinue}
									isLoading={isLoading}
									xpResult={phaseXpResult ?? undefined}
									isRetake={xpStatus?.isRetake}
								/>
								<AnimatePresence>
									{awardState.lastAward && (
										<XpGainToast
											xpAmount={awardState.lastAward.xpResult.xpAwarded}
											source={`Evaluación: Fase ${awardState.lastAward.milestone === "phase_1" ? "1" : awardState.lastAward.milestone === "phase_2" ? "2" : "Final"}`}
											streakBonus={
												awardState.lastAward.xpResult.streakMultiplier > 1
													? Math.round(
															(awardState.lastAward.xpResult.streakMultiplier -
																1) *
																100,
														)
													: undefined
											}
											leveledUp={awardState.lastAward.xpResult.leveledUp}
											newLevel={awardState.lastAward.xpResult.newLevel}
											onComplete={handleXpToastComplete}
										/>
									)}
								</AnimatePresence>
							</>
						)}

						{view === "question" &&
							currentQuestion &&
							(() => {
								// Convert session domain scores to DomainScore format for chart
								const domainScoresForChart: Record<string, DomainScore> = {};
								if (session?.domainScores) {
									Object.entries(session.domainScores).forEach(
										([domainId, score]) => {
											domainScoresForChart[domainId] = {
												domainId,
												domainName: domainId, // Will be mapped in component
												score,
												questionCount: 0,
											};
										},
									);
								}

								const showDomainChart =
									phase <= 2 && Object.keys(domainScoresForChart).length > 0;

								return (
									<div className="space-y-8">
										{/* Header */}
										<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
											<div className="space-y-1">
												<h1 className="text-2xl font-black uppercase tracking-tighter text-foreground sm:text-4xl">
													Protocolo de{" "}
													<span className="text-primary">Evaluación</span>
												</h1>
												<p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
													Insight v1.0 {"//"} Sincronización de Fortalezas en
													Proceso
												</p>
											</div>
											{progress && (
												<div className="flex items-center gap-4">
													<div className="text-right">
														<p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
															Nivel de Usuario
														</p>
														<p className="text-xl font-black text-foreground">
															LVL {progress.currentLevel}
														</p>
													</div>
													<LevelBadge
														level={progress.currentLevel}
														size="lg"
														showIcon
													/>
												</div>
											)}
										</div>

										<div className="mx-auto max-w-5xl">
											{/* Progress indicator */}
											<div className="mb-10">
												<ProgressIndicator
													currentStep={currentStep}
													totalSteps={totalSteps}
													phase={phase}
												/>
											</div>

											<div
												className={cn(
													"grid gap-10",
													showDomainChart
														? "lg:grid-cols-[1fr_350px]"
														: "max-w-3xl mx-auto",
												)}
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

												{/* Domain affinity chart */}
												{showDomainChart && (
													<motion.div
														initial={{ opacity: 0, scale: 0.95 }}
														animate={{ opacity: 1, scale: 1 }}
														className="hidden lg:block space-y-4"
													>
														<div
															className="p-px bg-border"
															style={{
																clipPath:
																	"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
															}}
														>
															<div
																className="bg-card/50 p-6"
																style={{
																	clipPath:
																		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
																}}
															>
																<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
																	Sincronización de Dominio
																</h3>
																<DomainAffinityChart
																	domainScores={domainScoresForChart}
																	compact={true}
																	animate={true}
																/>
															</div>
														</div>
													</motion.div>
												)}
											</div>

											{/* Phase completion helper */}
											{currentStep === totalSteps - 1 && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													className="mt-12 text-center"
												>
													<button
														onClick={handlePhaseComplete}
														disabled={isLoading}
														className="px-8 py-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs transition-transform hover:scale-105"
														style={{
															clipPath:
																"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
														}}
													>
														Finalizar Fase {phase}
													</button>
												</motion.div>
											)}
										</div>
									</div>
								);
							})()}
					</motion.div>
				</AnimatePresence>
			</div>
		</main>
	);
}
