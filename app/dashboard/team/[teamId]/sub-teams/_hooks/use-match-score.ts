/**
 * useMatchScore Hook
 *
 * Custom hook for calculating match scores with debouncing and real-time updates.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_hooks/use-match-score
 */

'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import type { MatchScoreResult } from '@/lib/types';

import { calculateMatchScore } from '../_actions/calculate-match-score';

interface UseMatchScoreOptions {
  /** Team ID for authorization */
  teamId: string;
  /** Project type profile ID */
  projectTypeProfileId: string | null;
  /** Array of selected member IDs */
  memberIds: string[];
  /** Debounce delay in milliseconds (default: 500) */
  debounceMs?: number;
  /** Whether to automatically calculate on changes (default: true) */
  autoCalculate?: boolean;
}

interface UseMatchScoreReturn {
  /** Current match score result */
  result: MatchScoreResult | null;
  /** Whether calculation is in progress */
  isCalculating: boolean;
  /** Error message if calculation failed */
  error: string | null;
  /** Manually trigger calculation */
  calculate: () => Promise<void>;
  /** Clear the current result */
  clear: () => void;
}

/**
 * Hook for managing match score calculation
 *
 * Features:
 * - Debounced automatic calculation on input changes
 * - Loading state management
 * - Error handling
 * - Manual calculation trigger
 *
 * @example
 * ```tsx
 * const { result, isCalculating, error } = useMatchScore({
 *   teamId: 'team-123',
 *   projectTypeProfileId: 'type-456',
 *   memberIds: ['user-1', 'user-2', 'user-3'],
 * });
 *
 * if (isCalculating) return <Spinner />;
 * if (result) return <MatchScoreDisplay score={result.totalScore} />;
 * ```
 */
export function useMatchScore({
  teamId,
  projectTypeProfileId,
  memberIds,
  debounceMs = 500,
  autoCalculate = true,
}: UseMatchScoreOptions): UseMatchScoreReturn {
  const [ result, setResult ] = useState<MatchScoreResult | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isPending, startTransition ] = useTransition();

  // Track previous values to detect changes
  const prevMemberIdsRef = useRef<string[]>([]);
  const prevProjectTypeRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Calculate match score
   */
  const calculate = useCallback(async () => {
    // Validate inputs
    if (!projectTypeProfileId) {
      setResult(null);
      setError(null);
      return;
    }

    if (memberIds.length < 2) {
      setResult(null);
      setError(null);
      return;
    }

    startTransition(async () => {
      try {
        const response = await calculateMatchScore({
          teamId,
          projectTypeProfileId,
          memberIds,
        });

        if (response.success) {
          setResult(response.data);
          setError(null);
        } else {
          setError(response.error);
          // Keep previous result on error to avoid flashing
        }
      } catch (err) {
        console.error('Error calculating match score:', err);
        setError('Error al calcular el score');
      }
    });
  }, [ teamId, projectTypeProfileId, memberIds ]);

  /**
   * Clear the current result
   */
  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  /**
   * Debounced calculation on input changes
   */
  useEffect(() => {
    if (!autoCalculate) return;

    // Check if inputs have changed
    const memberIdsChanged =
      memberIds.length !== prevMemberIdsRef.current.length ||
      memberIds.some((id, i) => id !== prevMemberIdsRef.current[ i ]);
    const projectTypeChanged = projectTypeProfileId !== prevProjectTypeRef.current;

    // Update refs
    prevMemberIdsRef.current = memberIds;
    prevProjectTypeRef.current = projectTypeProfileId;

    // If no relevant changes, skip
    if (!memberIdsChanged && !projectTypeChanged) return;

    // Clear pending timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounced timer
    debounceTimerRef.current = setTimeout(() => {
      calculate();
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [ memberIds, projectTypeProfileId, autoCalculate, debounceMs, calculate ]);

  return {
    result,
    isCalculating: isPending,
    error,
    calculate,
    clear,
  };
}
