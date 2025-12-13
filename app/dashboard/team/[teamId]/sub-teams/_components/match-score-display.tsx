/**
 * Match Score Display Component
 *
 * Displays the match score with color coding and visual indicator.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/match-score-display
 */

"use client";

import { cn } from "@/lib/cn";

import {
  getScoreColor,
  getScoreLabel,
  SCORE_THRESHOLDS,
} from "../_utils/score-helpers";

interface MatchScoreDisplayProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showBar?: boolean;
  className?: string;
}

/**
 * Match Score Display
 *
 * Shows the match score with:
 * - Numeric score (0-100)
 * - Color coding (excellent/good/fair/poor)
 * - Optional label text
 * - Optional progress bar
 */
export function MatchScoreDisplay({
  score,
  size = "md",
  showLabel = true,
  showBar = false,
  className,
}: MatchScoreDisplayProps) {
  if (score === null) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="text-muted-foreground text-sm">Sin calcular</span>
      </div>
    );
  }

  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);

  const sizeClasses = {
    sm: {
      container: "gap-1",
      score: "text-lg font-semibold",
      label: "text-xs",
      bar: "h-1",
    },
    md: {
      container: "gap-2",
      score: "text-2xl font-bold",
      label: "text-sm",
      bar: "h-2",
    },
    lg: {
      container: "gap-3",
      score: "text-4xl font-bold",
      label: "text-base",
      bar: "h-3",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex flex-col", sizes.container, className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn(sizes.score, colorClass)}>{score}</span>
        <span className="text-muted-foreground text-sm">/100</span>
        {showLabel && (
          <span className={cn(sizes.label, colorClass)}>{label}</span>
        )}
      </div>

      {showBar && (
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              getScoreBackgroundColor(score)
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Compact Match Score Badge
 *
 * A smaller version for cards and list items
 */
interface MatchScoreBadgeProps {
  score: number | null;
  className?: string;
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
  if (score === null) {
    return (
      <span
        className={cn(
          "bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          className
        )}
      >
        --
      </span>
    );
  }

  const colorClass = getScoreColor(score);
  const bgClass = getScoreBadgeBackground(score);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        bgClass,
        colorClass,
        className
      )}
    >
      {score}
    </span>
  );
}

/**
 * Get background color class for progress bar
 */
function getScoreBackgroundColor(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "bg-green-500";
  if (score >= SCORE_THRESHOLDS.GOOD) return "bg-blue-500";
  if (score >= SCORE_THRESHOLDS.FAIR) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Get background color class for badge
 */
function getScoreBadgeBackground(score: number): string {
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "bg-green-500/10";
  if (score >= SCORE_THRESHOLDS.GOOD) return "bg-blue-500/10";
  if (score >= SCORE_THRESHOLDS.FAIR) return "bg-amber-500/10";
  return "bg-red-500/10";
}
