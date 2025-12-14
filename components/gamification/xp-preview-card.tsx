"use client";

import { motion } from "motion/react";
import { Sparkles, Flame } from "lucide-react";
import { cn } from "@/lib/cn";

export interface XpPreviewCardProps {
  potentialXp: number;
  label?: string;
  streakMultiplier?: number;
  compact?: boolean;
  className?: string;
}

/**
 * XP Preview Card Component
 *
 * Shows potential XP that can be earned for completing an action.
 * Used in assessment welcome screens and feedback request views.
 */
export function XpPreviewCard({
  potentialXp,
  label = "Completa para ganar",
  streakMultiplier = 1,
  compact = false,
  className,
}: XpPreviewCardProps) {
  const hasStreakBonus = streakMultiplier > 1;
  const streakBonusPercent = Math.round((streakMultiplier - 1) * 100);
  const totalXp = Math.round(potentialXp * streakMultiplier);

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-amber-100 dark:bg-amber-900/30",
          "text-amber-700 dark:text-amber-400",
          "text-sm font-medium",
          className
        )}
      >
        <Sparkles className="h-4 w-4" />
        <span>+{totalXp} XP</span>
        {hasStreakBonus && (
          <span className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-500">
            <Flame className="h-3 w-3" />
            {streakBonusPercent}%
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-lg border",
        "bg-linear-to-br from-amber-50 to-orange-50",
        "dark:from-amber-950/30 dark:to-orange-950/30",
        "border-amber-200 dark:border-amber-800",
        "p-4",
        className
      )}
    >
      {/* Decorative sparkles */}
      <div className="absolute top-2 right-2 text-amber-300 dark:text-amber-600">
        <Sparkles className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-sm text-amber-700 dark:text-amber-400">{label}</p>

        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-3xl font-bold text-amber-600 dark:text-amber-400"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            +{totalXp}
          </motion.span>
          <span className="text-lg font-semibold text-amber-500 dark:text-amber-500">
            XP
          </span>
        </div>

        {/* Streak bonus indicator */}
        {hasStreakBonus && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400"
          >
            <Flame className="h-4 w-4" />
            <span>
              Bonus de racha: +{streakBonusPercent}% ({potentialXp} base)
            </span>
          </motion.div>
        )}
      </div>

      {/* Animated background pulse */}
      <motion.div
        className="absolute inset-0 bg-amber-400/10 dark:bg-amber-400/5"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
