"use client";

/**
 * GamificationContextBadge Component
 * Shows user's level and XP progress in context areas
 * Part of Feature 005: Gamification Integration
 */

import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { useGamificationProgress } from "@/lib/hooks/use-gamification-progress";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface GamificationContextBadgeProps {
  /** Compact mode for smaller spaces */
  compact?: boolean;
  /** Show streak multiplier */
  showStreak?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading skeleton for the badge
 */
function BadgeSkeleton({ compact }: { compact?: boolean }) {
  if (compact) {
    return <Skeleton className="h-6 w-20 rounded-full" />;
  }
  return <Skeleton className="h-12 w-32 rounded-lg" />;
}

/**
 * Compact version showing just level number
 */
function CompactBadge({
  level,
  xpProgress,
  streakMultiplier,
  showStreak,
  className,
}: {
  level: number;
  xpProgress: number;
  streakMultiplier: number;
  showStreak?: boolean;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary",
              className
            )}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Nivel {level}</span>
            {showStreak && streakMultiplier > 1 && (
              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                <Zap className="h-3 w-3" />x{streakMultiplier.toFixed(1)}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p>Progreso: {xpProgress}%</p>
            {streakMultiplier > 1 && (
              <p>Racha activa: x{streakMultiplier.toFixed(1)} XP</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Full version with XP bar
 */
function FullBadge({
  level,
  currentXp,
  nextLevelXp,
  xpProgress,
  streakMultiplier,
  showStreak,
  className,
}: {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  xpProgress: number;
  streakMultiplier: number;
  showStreak?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card px-3 py-2",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold">Nivel {level}</span>
          {showStreak && streakMultiplier > 1 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-3 w-3" />x{streakMultiplier.toFixed(1)}
            </span>
          )}
        </div>

        <Progress value={xpProgress} className="h-1.5" />

        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">{currentXp} XP</span>
          <span className="text-xs text-muted-foreground">
            {nextLevelXp} XP
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GamificationContextBadge({
  compact = false,
  showStreak = true,
  className,
}: GamificationContextBadgeProps) {
  const { progress, isLoading, error } = useGamificationProgress();

  if (isLoading) {
    return <BadgeSkeleton compact={compact} />;
  }

  if (error || !progress) {
    return null; // Don't show anything if there's an error
  }

  const xpProgress = Math.min(
    100,
    Math.round((progress.currentLevelXp / progress.nextLevelXpRequired) * 100)
  );

  if (compact) {
    return (
      <CompactBadge
        level={progress.currentLevel}
        xpProgress={xpProgress}
        streakMultiplier={progress.streakMultiplier}
        showStreak={showStreak}
        className={className}
      />
    );
  }

  return (
    <FullBadge
      level={progress.currentLevel}
      currentXp={progress.currentLevelXp}
      nextLevelXp={progress.nextLevelXpRequired}
      xpProgress={xpProgress}
      streakMultiplier={progress.streakMultiplier}
      showStreak={showStreak}
      className={className}
    />
  );
}
