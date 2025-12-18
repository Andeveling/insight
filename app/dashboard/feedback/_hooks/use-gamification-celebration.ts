/**
 * useGamificationCelebration Hook
 *
 * Manages XP celebration sequence for feedback completion
 * Coordinates toast, level-up, and badge unlock animations
 * Part of Feature 008: Feedback Gamification Integration
 */

import { useState, useCallback } from "react";
import type {
	AwardXpResult,
	UnlockedBadge,
} from "@/lib/types/gamification.types";

export interface CelebrationState {
	showXpToast: boolean;
	showLevelUpModal: boolean;
	showBadgeModal: boolean;
	xpData?: AwardXpResult;
	currentBadge?: UnlockedBadge;
	remainingBadges: UnlockedBadge[];
}

export interface CelebrationSequence {
	xpResult: AwardXpResult;
	unlockedBadges?: UnlockedBadge[];
}

export function useGamificationCelebration() {
	const [state, setState] = useState<CelebrationState>({
		showXpToast: false,
		showLevelUpModal: false,
		showBadgeModal: false,
		remainingBadges: [],
	});

	/**
	 * Start celebration sequence
	 * Order: XP Toast → Level Up Modal → Badge Modals (if any)
	 */
	const startCelebration = useCallback((sequence: CelebrationSequence) => {
		const { xpResult, unlockedBadges = [] } = sequence;

		// Step 1: Show XP toast immediately
		setState({
			showXpToast: true,
			showLevelUpModal: false,
			showBadgeModal: false,
			xpData: xpResult,
			remainingBadges: unlockedBadges,
		});

		// Step 2: After 2s, check if level up
		setTimeout(() => {
			if (xpResult.leveledUp) {
				setState((prev) => ({
					...prev,
					showXpToast: false,
					showLevelUpModal: true,
				}));
			} else if (unlockedBadges.length > 0) {
				// Skip to badges if no level up
				setState((prev) => ({
					...prev,
					showXpToast: false,
					showBadgeModal: true,
					currentBadge: unlockedBadges[0],
					remainingBadges: unlockedBadges.slice(1),
				}));
			} else {
				// No level up, no badges - finish
				setState((prev) => ({ ...prev, showXpToast: false }));
			}
		}, 2000);
	}, []);

	/**
	 * Called when level up modal closes
	 * Proceeds to badge sequence if any badges unlocked
	 */
	const handleLevelUpComplete = useCallback(() => {
		setState((prev) => {
			if (prev.remainingBadges.length > 0) {
				return {
					...prev,
					showLevelUpModal: false,
					showBadgeModal: true,
					currentBadge: prev.remainingBadges[0],
					remainingBadges: prev.remainingBadges.slice(1),
				};
			}
			return {
				...prev,
				showLevelUpModal: false,
			};
		});
	}, []);

	/**
	 * Called when badge modal closes
	 * Shows next badge if any, otherwise finishes sequence
	 */
	const handleBadgeComplete = useCallback(() => {
		setState((prev) => {
			if (prev.remainingBadges.length > 0) {
				return {
					...prev,
					currentBadge: prev.remainingBadges[0],
					remainingBadges: prev.remainingBadges.slice(1),
				};
			}
			return {
				...prev,
				showBadgeModal: false,
				currentBadge: undefined,
			};
		});
	}, []);

	/**
	 * Reset celebration state (for cleanup)
	 */
	const reset = useCallback(() => {
		setState({
			showXpToast: false,
			showLevelUpModal: false,
			showBadgeModal: false,
			remainingBadges: [],
		});
	}, []);

	return {
		state,
		startCelebration,
		handleLevelUpComplete,
		handleBadgeComplete,
		reset,
	};
}
