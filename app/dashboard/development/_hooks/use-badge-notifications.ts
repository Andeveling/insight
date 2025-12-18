"use client";

import { useCallback, useState } from "react";
import type { BadgeTier } from "@/lib/types";

interface UnlockedBadge {
	id: string;
	key: string;
	nameEs: string;
	descriptionEs: string;
	iconUrl: string;
	tier: BadgeTier;
	xpReward: number;
}

interface UseBadgeNotificationsReturn {
	/** Current badge being shown (or null) */
	currentBadge: UnlockedBadge | null;

	/** Whether a badge modal is currently showing */
	isShowing: boolean;

	/** Queue of badges waiting to be shown */
	queue: UnlockedBadge[];

	/** Show a single badge */
	showBadge: (badge: UnlockedBadge) => void;

	/** Queue multiple badges to show in sequence */
	queueBadges: (badges: UnlockedBadge[]) => void;

	/** Dismiss current badge and show next in queue */
	dismissBadge: () => void;

	/** Clear all badges from queue */
	clearQueue: () => void;
}

/**
 * Hook for managing badge unlock notifications
 *
 * Maintains a queue of badges to display and handles
 * sequential showing of badge unlock modals.
 */
export function useBadgeNotifications(): UseBadgeNotificationsReturn {
	const [currentBadge, setCurrentBadge] = useState<UnlockedBadge | null>(null);
	const [queue, setQueue] = useState<UnlockedBadge[]>([]);
	const [isShowing, setIsShowing] = useState(false);

	/**
	 * Show the next badge from queue
	 */
	const showNextBadge = useCallback(() => {
		setQueue((prev) => {
			if (prev.length === 0) {
				setCurrentBadge(null);
				setIsShowing(false);
				return prev;
			}

			const [next, ...rest] = prev;
			setCurrentBadge(next);
			setIsShowing(true);
			return rest;
		});
	}, []);

	/**
	 * Show a single badge immediately
	 */
	const showBadge = useCallback((badge: UnlockedBadge) => {
		setCurrentBadge(badge);
		setIsShowing(true);
	}, []);

	/**
	 * Queue multiple badges to show in sequence
	 */
	const queueBadges = useCallback(
		(badges: UnlockedBadge[]) => {
			if (badges.length === 0) return;

			setQueue((prev) => [...prev, ...badges]);

			// If not currently showing, start the sequence
			if (!isShowing) {
				const [first] = badges;
				setCurrentBadge(first);
				setIsShowing(true);
				setQueue((prev) => prev.slice(1));
			}
		},
		[isShowing],
	);

	/**
	 * Dismiss current badge and show next
	 */
	const dismissBadge = useCallback(() => {
		if (queue.length > 0) {
			// Small delay before showing next badge
			setTimeout(() => {
				showNextBadge();
			}, 300);
		} else {
			setCurrentBadge(null);
			setIsShowing(false);
		}
	}, [queue.length, showNextBadge]);

	/**
	 * Clear all badges from queue
	 */
	const clearQueue = useCallback(() => {
		setQueue([]);
		setCurrentBadge(null);
		setIsShowing(false);
	}, []);

	return {
		currentBadge,
		isShowing,
		queue,
		showBadge,
		queueBadges,
		dismissBadge,
		clearQueue,
	};
}
