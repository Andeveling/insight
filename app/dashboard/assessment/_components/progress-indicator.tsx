"use client";

/**
 * ProgressIndicator Component
 * Shows current question number, total questions, percentage bar with animation
 * User Story 3: View Progress and Domain Affinity
 */

import { cn } from "@/lib/cn";

export interface ProgressIndicatorProps {
  /**
   * Current question index (0-based)
   */
  currentStep: number;
  /**
   * Total number of questions in current phase
   */
  totalSteps: number;
  /**
   * Current phase number (1, 2, or 3)
   */
  phase: 1 | 2 | 3;
  /**
   * Optional className for custom styling
   */
  className?: string;
  /**
   * Show phase label (default: true)
   */
  showPhaseLabel?: boolean;
  /**
   * Compact mode for inline display
   */
  compact?: boolean;
}

const PHASE_LABELS: Record<number, string> = {
  1: "Descubrimiento de Dominio",
  2: "Refinamiento de Fortalezas",
  3: "Ranking Final",
};

const PHASE_COLORS: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-amber-500",
  3: "bg-emerald-500",
};

/**
 * Displays assessment progress with animated progress bar
 */
export default function ProgressIndicator({
  currentStep,
  totalSteps,
  phase,
  className,
  showPhaseLabel = true,
  compact = false,
}: ProgressIndicatorProps) {
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const questionNumber = currentStep + 1;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-muted-foreground text-xs">
          {questionNumber}/{totalSteps}
        </span>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              PHASE_COLORS[phase]
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">
          {Math.round(progress)}%
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        {showPhaseLabel && (
          <div className="flex items-center gap-2">
            <div
              className={cn("h-2 w-2 rounded-full", PHASE_COLORS[phase])}
              aria-hidden="true"
            />
            <span className="text-muted-foreground text-sm">
              Fase {phase}: {PHASE_LABELS[phase]}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            Pregunta {questionNumber} de {totalSteps}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              "bg-primary/10 text-primary"
            )}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: ${Math.round(progress)}% completado`}
      >
        <div
          className={cn(
            "animate-progress-fill h-full rounded-full transition-all duration-500 ease-out",
            PHASE_COLORS[phase]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Phase milestones */}
      <div className="flex justify-between text-xs">
        {[1, 2, 3].map((p) => (
          <div
            key={p}
            className={cn(
              "flex items-center gap-1",
              p <= phase ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                p < phase
                  ? "bg-primary text-primary-foreground"
                  : p === phase
                  ? "border-2 border-primary text-primary"
                  : "border border-muted-foreground"
              )}
            >
              {p < phase ? "✓" : p}
            </div>
            <span className="hidden sm:inline">Fase {p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
