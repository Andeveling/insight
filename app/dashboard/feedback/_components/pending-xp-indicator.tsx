"use client";

/**
 * PendingXpIndicator Component
 * Shows potential XP from pending feedback requests
 * Part of Feature 005: Gamification Integration
 */

import { Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";

export interface PendingXpIndicatorProps {
  /** Number of pending feedback requests */
  pendingCount: number;
  /** Compact mode for inline display */
  compact?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Calculate potential XP from pending requests
 */
function calculatePotentialXp(pendingCount: number): number {
  return pendingCount * FEEDBACK_XP_REWARDS.FEEDBACK_RECEIVED;
}

export default function PendingXpIndicator({
  pendingCount,
  compact = false,
  className,
}: PendingXpIndicatorProps) {
  if (pendingCount === 0) return null;

  const potentialXp = calculatePotentialXp(pendingCount);

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 text-sm text-muted-foreground",
          className
        )}
      >
        <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
        <span>hasta +{potentialXp} XP</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30",
        className
      )}
    >
      <Zap
        className="h-4 w-4 text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      />
      <span className="text-amber-800 dark:text-amber-200">
        {pendingCount} pendientes = hasta{" "}
        <span className="font-semibold">+{potentialXp} XP</span>
      </span>
    </div>
  );
}
