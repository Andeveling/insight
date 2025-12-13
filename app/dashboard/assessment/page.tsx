"use client";

/**
 * Assessment Main Page
 * Entry point for the strength assessment flow
 */

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { WelcomeScreen, QuestionCard, PhaseTransition } from "./_components";
import { useAssessmentSession } from "./_hooks";
import type {
  PhaseTransitionResult,
  AnswerValue,
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
          {error ?? "An error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary underline"
        >
          Try again
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
    return (
      <div className="px-4 py-8">
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

        {/* Check for phase completion when we reach the last question */}
        {currentStep === totalSteps - 1 && (
          <div className="mt-8 text-center">
            <button
              onClick={handlePhaseComplete}
              disabled={isLoading}
              className="text-primary underline"
            >
              Complete Phase {phase}
            </button>
          </div>
        )}
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
