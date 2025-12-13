'use client';

import { useCallback, useRef, useEffect } from 'react';
import { autoSaveAnswerAction } from '../_actions';
import type { AnswerValue } from '@/lib/types/assessment.types';

interface UseAutoSaveOptions {
  /**
   * Debounce delay in milliseconds
   * @default 2000
   */
  debounceMs?: number;
  /**
   * Callback when auto-save succeeds
   */
  onSaveSuccess?: () => void;
  /**
   * Callback when auto-save fails
   */
  onSaveError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  /**
   * Trigger auto-save with debounce
   */
  triggerAutoSave: (sessionId: string, questionId: string, value: AnswerValue) => void;
  /**
   * Force immediate save (bypasses debounce)
   */
  saveNow: () => Promise<void>;
  /**
   * Cancel pending auto-save
   */
  cancelPendingSave: () => void;
  /**
   * Whether a save is currently in progress
   */
  isSaving: boolean;
}

/**
 * Hook for debounced auto-save functionality
 * Automatically saves answers after 2-second delay
 * Supports optimistic updates and error handling
 */
export function useAutoSave(options: UseAutoSaveOptions = {}): UseAutoSaveReturn {
  const { debounceMs = 2000, onSaveSuccess, onSaveError } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pendingSaveRef = useRef<{
    sessionId: string;
    questionId: string;
    value: AnswerValue;
  } | null>(null);

  /**
   * Cancel any pending auto-save timeout
   */
  const cancelPendingSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingSaveRef.current = null;
  }, []);

  /**
   * Execute the actual save operation
   */
  const executeSave = useCallback(async () => {
    const pending = pendingSaveRef.current;
    if (!pending || isSavingRef.current) return;

    isSavingRef.current = true;
    pendingSaveRef.current = null;

    try {
      const result = await autoSaveAnswerAction({
        sessionId: pending.sessionId,
        questionId: pending.questionId,
        value: pending.value,
      });

      if (result.success) {
        onSaveSuccess?.();
      } else {
        onSaveError?.(new Error(result.error || 'Auto-save failed'));
      }
    } catch (error) {
      onSaveError?.(error instanceof Error ? error : new Error('Auto-save failed'));
    } finally {
      isSavingRef.current = false;
    }
  }, [ onSaveSuccess, onSaveError ]);

  /**
   * Force immediate save (bypasses debounce)
   */
  const saveNow = useCallback(async () => {
    cancelPendingSave();
    await executeSave();
  }, [ cancelPendingSave, executeSave ]);

  /**
   * Trigger auto-save with debounce
   */
  const triggerAutoSave = useCallback(
    (sessionId: string, questionId: string, value: AnswerValue) => {
      // Cancel any existing timeout
      cancelPendingSave();

      // Store the pending save data
      pendingSaveRef.current = { sessionId, questionId, value };

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        executeSave();
      }, debounceMs);
    },
    [ cancelPendingSave, executeSave, debounceMs ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingSave();
    };
  }, [ cancelPendingSave ]);

  return {
    triggerAutoSave,
    saveNow,
    cancelPendingSave,
    isSaving: isSavingRef.current,
  };
}
