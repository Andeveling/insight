"use client";

/**
 * XpRewardPreview Component
 * Shows potential XP to earn in the assessment flow
 * Part of Feature 005: Gamification Integration
 */

import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { ASSESSMENT_XP_REWARDS } from "@/lib/constants/xp-rewards";

export interface XpRewardPreviewProps {
  /** Optional: Show specific phase XP instead of total */
  phase?: 1 | 2 | 3;
  /** Whether this is a retake (shows reduced XP) */
  isRetake?: boolean;
  /** Optional: Current streak multiplier */
  streakMultiplier?: number;
  /** Compact mode for inline display */
  compact?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Calculate total XP for full assessment completion
 */
function getTotalXp(isRetake: boolean): number {
  if (isRetake) {
    return ASSESSMENT_XP_REWARDS.ASSESSMENT_RETAKE;
  }
  return (
    ASSESSMENT_XP_REWARDS.PHASE_1_COMPLETE +
    ASSESSMENT_XP_REWARDS.PHASE_2_COMPLETE +
    ASSESSMENT_XP_REWARDS.ASSESSMENT_COMPLETE
  );
}

/**
 * Get XP for a specific phase
 */
function getPhaseXp(phase: 1 | 2 | 3, isRetake: boolean): number {
  if (phase === 3) {
    return isRetake
      ? ASSESSMENT_XP_REWARDS.ASSESSMENT_RETAKE
      : ASSESSMENT_XP_REWARDS.ASSESSMENT_COMPLETE;
  }

  const phaseXp = {
    1: ASSESSMENT_XP_REWARDS.PHASE_1_COMPLETE,
    2: ASSESSMENT_XP_REWARDS.PHASE_2_COMPLETE,
  };

  return phaseXp[phase as 1 | 2];
}

/**
 * Get label for the XP preview
 */
function getLabel(phase: 1 | 2 | 3 | undefined, isRetake: boolean): string {
  if (!phase) {
    return isRetake ? "Gana XP por completar de nuevo" : "Gana hasta";
  }

  const phaseLabels = {
    1: "Completa la Fase 1",
    2: "Completa la Fase 2",
    3: isRetake ? "Completa el assessment" : "Finaliza y gana",
  };

  return phaseLabels[phase];
}

export default function XpRewardPreview({
  phase,
  isRetake = false,
  streakMultiplier = 1,
  compact = false,
  className,
}: XpRewardPreviewProps) {
  const baseXp = phase ? getPhaseXp(phase, isRetake) : getTotalXp(isRetake);
  const displayXp = Math.round(baseXp * streakMultiplier);
  const label = getLabel(phase, isRetake);
  const hasBonus = streakMultiplier > 1;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
          className
        )}
      >
        <Zap className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{displayXp} XP</span>
        {hasBonus && (
          <span className="text-xs opacity-75">
            (×{streakMultiplier.toFixed(1)})
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-orange-950/30",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
        <Sparkles
          className="h-5 w-5 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
            {displayXp} XP
          </span>
          {hasBonus && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              (+{Math.round((streakMultiplier - 1) * 100)}% racha)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
