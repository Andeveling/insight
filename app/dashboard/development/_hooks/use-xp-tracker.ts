"use client";

import { useState, useCallback, useMemo } from "react";
import { getLevelDetails } from "@/lib/services/level-calculator.service";
import { calculateXpUpdate, formatXp } from "@/lib/services/xp-calculator.service";

interface XpTrackerState {
  currentXp: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  formattedXp: string;
  totalXpGained: number;
}

interface LevelUpEvent {
  previousLevel: number;
  newLevel: number;
  xpGained: number;
}

/**
 * Custom hook for tracking XP state and level progression
 *
 * Provides real-time XP tracking with level-up detection
 * and formatted display values.
 *
 * @param initialXp - Starting XP value
 * @returns XP state and methods to add XP
 */
export function useXpTracker(initialXp: number = 0) {
  const [ state, setState ] = useState<XpTrackerState>(() => {
    const details = getLevelDetails(initialXp);

    return {
      currentXp: initialXp,
      level: details.level,
      xpForCurrentLevel: details.minXp,
      xpForNextLevel: details.maxXp,
      progressPercent: details.progressPercentage,
      formattedXp: formatXp(initialXp),
      totalXpGained: 0,
    };
  });

  const [ levelUpHistory, setLevelUpHistory ] = useState<LevelUpEvent[]>([]);
  const [ lastLevelUp, setLastLevelUp ] = useState<LevelUpEvent | null>(null);

  /**
   * Add XP and check for level up
   */
  const addXp = useCallback(
    (amount: number): { leveledUp: boolean; newLevel?: number } => {
      let leveledUp = false;
      let newLevel: number | undefined;

      setState((prev) => {
        const xpResult = calculateXpUpdate(prev.currentXp, amount);
        const details = getLevelDetails(xpResult.newXp);

        if (details.level > prev.level) {
          leveledUp = true;
          newLevel = details.level;

          const levelUpEvent: LevelUpEvent = {
            previousLevel: prev.level,
            newLevel: details.level,
            xpGained: amount,
          };

          setLastLevelUp(levelUpEvent);
          setLevelUpHistory((history) => [ ...history, levelUpEvent ]);
        }

        return {
          currentXp: xpResult.newXp,
          level: details.level,
          xpForCurrentLevel: details.minXp,
          xpForNextLevel: details.maxXp,
          progressPercent: details.progressPercentage,
          formattedXp: formatXp(xpResult.newXp),
          totalXpGained: prev.totalXpGained + amount,
        };
      });

      return { leveledUp, newLevel };
    },
    []
  );

  /**
   * Reset XP to a specific value
   */
  const resetXp = useCallback((newXp: number) => {
    const details = getLevelDetails(newXp);

    setState({
      currentXp: newXp,
      level: details.level,
      xpForCurrentLevel: details.minXp,
      xpForNextLevel: details.maxXp,
      progressPercent: details.progressPercentage,
      formattedXp: formatXp(newXp),
      totalXpGained: 0,
    });

    setLevelUpHistory([]);
    setLastLevelUp(null);
  }, []);

  /**
   * Clear the last level-up notification
   */
  const clearLastLevelUp = useCallback(() => {
    setLastLevelUp(null);
  }, []);

  /**
   * Memoized computed values
   */
  const xpToNextLevel = useMemo(() => {
    if (!state.xpForNextLevel) return 0;
    return state.xpForNextLevel - state.currentXp;
  }, [ state.currentXp, state.xpForNextLevel ]);

  return {
    // State
    ...state,
    xpToNextLevel,
    lastLevelUp,
    levelUpHistory,

    // Actions
    addXp,
    resetXp,
    clearLastLevelUp,
  };
}
