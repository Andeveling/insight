"use client";

/**
 * Hook: useAssessmentXp
 * Manages XP awards during assessment flow
 * Part of Feature 005: Gamification Integration
 */

import { useState, useCallback, useTransition } from "react";
import { awardAssessmentXp, getAssessmentXpStatus } from "../_actions";
import type { AssessmentMilestone } from "../_schemas/award-xp.schema";
import type { AwardXpResult, UnlockedBadge } from "@/lib/types/gamification.types";

export interface XpAwardState {
  isAwarding: boolean;
  lastAward: {
    xpResult: AwardXpResult;
    unlockedBadges?: UnlockedBadge[];
    milestone: AssessmentMilestone;
  } | null;
  error: string | null;
}

export interface XpStatusState {
  phase1Awarded: boolean;
  phase2Awarded: boolean;
  completionAwarded: boolean;
  isRetake: boolean;
}

export interface UseAssessmentXpResult {
  /**
   * Award state for the last operation
   */
  awardState: XpAwardState;

  /**
   * Current XP status for the session
   */
  xpStatus: XpStatusState | null;

  /**
   * Whether an XP operation is pending
   */
  isPending: boolean;

  /**
   * Award XP for a milestone
   */
  awardMilestoneXp: (
    sessionId: string,
    milestone: AssessmentMilestone
  ) => Promise<{
    success: boolean;
    xpResult?: AwardXpResult;
    unlockedBadges?: UnlockedBadge[];
    alreadyAwarded?: boolean;
  }>;

  /**
   * Load XP status for a session
   */
  loadXpStatus: (sessionId: string) => Promise<void>;

  /**
   * Clear the last award state (after showing toast)
   */
  clearLastAward: () => void;
}

export function useAssessmentXp(): UseAssessmentXpResult {
  const [ isPending, startTransition ] = useTransition();

  const [ awardState, setAwardState ] = useState<XpAwardState>({
    isAwarding: false,
    lastAward: null,
    error: null,
  });

  const [ xpStatus, setXpStatus ] = useState<XpStatusState | null>(null);

  /**
   * Award XP for completing a milestone
   */
  const awardMilestoneXp = useCallback(
    async (sessionId: string, milestone: AssessmentMilestone) => {
      setAwardState((prev) => ({
        ...prev,
        isAwarding: true,
        error: null,
      }));

      try {
        const result = await awardAssessmentXp({ sessionId, milestone });

        if (result.success) {
          if (result.xpResult && !result.alreadyAwarded) {
            setAwardState({
              isAwarding: false,
              lastAward: {
                xpResult: result.xpResult,
                unlockedBadges: result.unlockedBadges,
                milestone,
              },
              error: null,
            });

            // Update local status
            setXpStatus((prev) => {
              if (!prev) return prev;
              const statusKey =
                milestone === "phase_1"
                  ? "phase1Awarded"
                  : milestone === "phase_2"
                    ? "phase2Awarded"
                    : "completionAwarded";
              return { ...prev, [ statusKey ]: true };
            });
          } else {
            setAwardState((prev) => ({
              ...prev,
              isAwarding: false,
            }));
          }

          return {
            success: true,
            xpResult: result.xpResult,
            unlockedBadges: result.unlockedBadges,
            alreadyAwarded: result.alreadyAwarded,
          };
        } else {
          setAwardState({
            isAwarding: false,
            lastAward: null,
            error: result.error ?? "Error desconocido",
          });
          return { success: false };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al otorgar XP";
        setAwardState({
          isAwarding: false,
          lastAward: null,
          error: errorMessage,
        });
        return { success: false };
      }
    },
    []
  );

  /**
   * Load XP status for a session
   */
  const loadXpStatus = useCallback(async (sessionId: string) => {
    startTransition(async () => {
      const status = await getAssessmentXpStatus(sessionId);
      if (status) {
        setXpStatus(status);
      }
    });
  }, []);

  /**
   * Clear the last award (after toast animation completes)
   */
  const clearLastAward = useCallback(() => {
    setAwardState((prev) => ({
      ...prev,
      lastAward: null,
    }));
  }, []);

  return {
    awardState,
    xpStatus,
    isPending,
    awardMilestoneXp,
    loadXpStatus,
    clearLastAward,
  };
}
