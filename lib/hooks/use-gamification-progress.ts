"use client";

/**
 * useGamificationProgress Hook
 * Fetches and manages user gamification progress state
 * Part of Feature 005: Gamification Integration
 */

import { useState, useEffect, useCallback, useTransition } from "react";

/**
 * Gamification progress data from server
 */
export interface GamificationProgress {
  userId: string;
  xpTotal: number;
  currentLevel: number;
  currentLevelXp: number;
  nextLevelXpRequired: number;
  currentStreak: number;
  streakMultiplier: number;
}

interface UseGamificationProgressReturn {
  /** Current gamification progress */
  progress: GamificationProgress | null;
  /** Whether data is being loaded */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Refresh the progress data */
  refresh: () => Promise<void>;
  /** Optimistically update XP (for animations before server confirms) */
  addOptimisticXp: (amount: number) => void;
}

/**
 * Fetch gamification progress from server
 */
async function fetchProgress(): Promise<GamificationProgress | null> {
  try {
    const response = await fetch("/api/gamification/progress");
    if (!response.ok) {
      throw new Error("Failed to fetch gamification progress");
    }
    const data = await response.json();
    return data.progress;
  } catch (error) {
    console.error("Error fetching gamification progress:", error);
    return null;
  }
}

/**
 * Hook for managing gamification progress
 */
export function useGamificationProgress(): UseGamificationProgressReturn {
  const [ progress, setProgress ] = useState<GamificationProgress | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ , startTransition ] = useTransition();

  /**
   * Load progress data
   */
  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProgress();
      if (data) {
        setProgress(data);
      } else {
        setError("No se pudo cargar el progreso");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh progress data
   */
  const refresh = useCallback(async () => {
    startTransition(async () => {
      await loadProgress();
    });
  }, [ loadProgress ]);

  /**
   * Optimistically add XP (for UI animations before server confirms)
   */
  const addOptimisticXp = useCallback((amount: number) => {
    setProgress((prev) => {
      if (!prev) return prev;

      const newXpTotal = prev.xpTotal + amount;
      const newCurrentLevelXp = prev.currentLevelXp + amount;

      // Simple level-up check (actual logic is on server)
      const leveledUp = newCurrentLevelXp >= prev.nextLevelXpRequired;

      return {
        ...prev,
        xpTotal: newXpTotal,
        currentLevelXp: leveledUp
          ? newCurrentLevelXp - prev.nextLevelXpRequired
          : newCurrentLevelXp,
        currentLevel: leveledUp ? prev.currentLevel + 1 : prev.currentLevel,
      };
    });
  }, []);

  // Load on mount
  useEffect(() => {
    loadProgress();
  }, [ loadProgress ]);

  return {
    progress,
    isLoading,
    error,
    refresh,
    addOptimisticXp,
  };
}
