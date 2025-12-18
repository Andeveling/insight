"use client";

/**
 * useFeedbackXp Hook
 * Manages feedback XP awards and state on the client
 * Part of Feature 005: Gamification Integration
 */

import { useCallback, useState, useTransition } from "react";
import {
	type AwardFeedbackXpResult,
	awardFeedbackGivenXp,
} from "../_actions/award-feedback-xp";

interface FeedbackXpState {
	/** Whether XP has been awarded for this response */
	awarded: boolean;
	/** The result of the last XP award */
	lastAward: AwardFeedbackXpResult | null;
	/** Whether an award operation is in progress */
	isAwarding: boolean;
	/** Any error that occurred */
	error: string | null;
}

interface UseFeedbackXpReturn {
	/** Current state */
	state: FeedbackXpState;
	/** Award XP for giving feedback */
	awardForGivingFeedback: (
		requestId: string,
	) => Promise<AwardFeedbackXpResult | null>;
	/** Clear the last award (after showing notification) */
	clearLastAward: () => void;
}

/**
 * Hook for managing feedback XP awards
 */
export function useFeedbackXp(): UseFeedbackXpReturn {
	const [isPending, startTransition] = useTransition();
	const [state, setState] = useState<FeedbackXpState>({
		awarded: false,
		lastAward: null,
		isAwarding: false,
		error: null,
	});

	/**
	 * Award XP for giving feedback
	 */
	const awardForGivingFeedback = useCallback(
		async (requestId: string): Promise<AwardFeedbackXpResult | null> => {
			// Prevent duplicate awards
			if (state.awarded) {
				return state.lastAward;
			}

			return new Promise((resolve) => {
				startTransition(async () => {
					setState((prev) => ({ ...prev, isAwarding: true, error: null }));

					try {
						const result = await awardFeedbackGivenXp({ requestId });

						if (result.success) {
							setState({
								awarded: true,
								lastAward: result,
								isAwarding: false,
								error: null,
							});
							resolve(result);
						} else {
							setState((prev) => ({
								...prev,
								isAwarding: false,
								error: result.error || "Failed to award XP",
							}));
							resolve(null);
						}
					} catch (error) {
						const errorMessage =
							error instanceof Error ? error.message : "Unknown error";
						setState((prev) => ({
							...prev,
							isAwarding: false,
							error: errorMessage,
						}));
						resolve(null);
					}
				});
			});
		},
		[state.awarded, state.lastAward],
	);

	/**
	 * Clear the last award (after showing notification)
	 */
	const clearLastAward = useCallback(() => {
		setState((prev) => ({ ...prev, lastAward: null }));
	}, []);

	return {
		state: {
			...state,
			isAwarding: isPending || state.isAwarding,
		},
		awardForGivingFeedback,
		clearLastAward,
	};
}
