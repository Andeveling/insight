"use client";

/**
 * XpIncentiveBanner Component
 * Shows XP incentive for providing feedback
 * Part of Feature 005: Gamification Integration
 */

import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";

export interface XpIncentiveBannerProps {
  /** Type of action being incentivized */
  type: "give_feedback" | "complete_feedback";
  /** Optional: Current streak multiplier */
  streakMultiplier?: number;
  /** Compact mode for inline display */
  compact?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Get XP amount based on type
 */
function getXpAmount(type: XpIncentiveBannerProps["type"]): number {
  switch (type) {
    case "give_feedback":
    case "complete_feedback":
      return FEEDBACK_XP_REWARDS.FEEDBACK_GIVEN;
    default:
      return 0;
  }
}

/**
 * Get label based on type
 */
function getLabel(type: XpIncentiveBannerProps["type"]): string {
  switch (type) {
    case "give_feedback":
      return "Responde y gana";
    case "complete_feedback":
      return "Completa el feedback";
    default:
      return "Gana";
  }
}

export default function XpIncentiveBanner({
  type,
  streakMultiplier = 1,
  compact = false,
  className,
}: XpIncentiveBannerProps) {
  const baseXp = getXpAmount(type);
  const displayXp = Math.round(baseXp * streakMultiplier);
  const label = getLabel(type);
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
        <span>+{displayXp} XP</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-orange-950/30",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
        <Sparkles
          className="h-5 w-5 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
            +{displayXp} XP
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
