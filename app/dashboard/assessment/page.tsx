"use client";

/**
 * Assessment Main Page
 * Entry point for the strength assessment flow
 */

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  WelcomeScreen,
  QuestionCard,
  PhaseTransition,
  DomainAffinityChart,
  ProgressIndicator,
} from "./_components";
import { useAssessmentSession } from "./_hooks";
import type {
  PhaseTransitionResult,
  AnswerValue,
  DomainScore,
} from "@/lib/types/assessment.types";

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

  const [transition, setTransition] = useState<PhaseTransitionResult | null>(
    null
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
    const result = await completeCurrentPhase();
    if (result?.transition) {
      setTransition(result.transition);
    }
  };

  // Handle continue after phase transition
  const handleContinue = async () => {
    if (transition?.completedPhase === 3) {
      await finishAssessment();
    } else {
      setTransition(null);
      // View will update automatically via useMemo since transition becomes null
    }
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
      />
    );
  }

  if (view === "phase-transition" && transition) {
    return (
      <PhaseTransition
        transition={transition}
        onContinue={handleContinue}
        isLoading={isLoading}
      />
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
      <div className="px-4 py-8">
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
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
