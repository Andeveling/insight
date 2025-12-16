/**
 * useProfileOnboarding Hook
 *
 * Manages the state and logic for professional profile onboarding flow.
 * Handles checking profile status and triggering modal display.
 */

"use client";

import { useState, useCallback, useTransition } from "react";
import { getProfessionalProfile } from "../_actions/get-professional-profile";
import { saveProfessionalProfile } from "../_actions/save-professional-profile";
import type { SaveProfileInput } from "../_schemas/professional-profile.schema";

interface ProfileStatus {
  hasProfile: boolean;
  isComplete: boolean;
  isLoading: boolean;
}

interface UseProfileOnboardingReturn {
  /**
   * Current profile status
   */
  status: ProfileStatus;

  /**
   * Whether the onboarding modal should be shown
   */
  shouldShowModal: boolean;

  /**
   * Check profile status from server
   */
  checkStatus: () => Promise<void>;

  /**
   * Save profile and complete onboarding
   */
  saveProfile: (data: SaveProfileInput) => Promise<boolean>;

  /**
   * Skip onboarding with default values
   */
  skipOnboarding: () => Promise<boolean>;

  /**
   * Dismiss the modal (does not skip permanently)
   */
  dismissModal: () => void;

  /**
   * Whether a save/skip operation is pending
   */
  isPending: boolean;
}

/**
 * Hook for managing professional profile onboarding
 *
 * @example
 * ```tsx
 * const { shouldShowModal, saveProfile, skipOnboarding } = useProfileOnboarding();
 *
 * if (shouldShowModal) {
 *   return <ProfileOnboardingModal onSave={saveProfile} onSkip={skipOnboarding} />;
 * }
 * ```
 */
export function useProfileOnboarding(): UseProfileOnboardingReturn {
  const [ isPending, startTransition ] = useTransition();
  const [ status, setStatus ] = useState<ProfileStatus>({
    hasProfile: true, // Optimistic: assume they have a profile
    isComplete: true,
    isLoading: false,
  });
  const [ shouldShowModal, setShouldShowModal ] = useState(false);

  const checkStatus = useCallback(async () => {
    setStatus((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await getProfessionalProfile();
      const newStatus = {
        hasProfile: result.hasProfile,
        isComplete: result.isComplete,
        isLoading: false,
      };
      setStatus(newStatus);

      // Show modal if first-time user
      if (!result.hasProfile) {
        setShouldShowModal(true);
      }
    } catch {
      setStatus((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const saveProfile = useCallback(
    async (data: SaveProfileInput): Promise<boolean> => {
      return new Promise((resolve) => {
        startTransition(async () => {
          try {
            const result = await saveProfessionalProfile(data);
            if (result.success) {
              setStatus({
                hasProfile: true,
                isComplete: true,
                isLoading: false,
              });
              setShouldShowModal(false);
              resolve(true);
            } else {
              resolve(false);
            }
          } catch {
            resolve(false);
          }
        });
      });
    },
    []
  );

  const skipOnboarding = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const result = await saveProfessionalProfile({
            roleStatus: "neutral",
            skip: true,
          });
          if (result.success) {
            setStatus({
              hasProfile: true,
              isComplete: true,
              isLoading: false,
            });
            setShouldShowModal(false);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      });
    });
  }, []);

  const dismissModal = useCallback(() => {
    setShouldShowModal(false);
  }, []);

  return {
    status,
    shouldShowModal,
    checkStatus,
    saveProfile,
    skipOnboarding,
    dismissModal,
    isPending,
  };
}
