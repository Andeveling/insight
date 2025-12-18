"use client";

import { useCallback, useMemo, useState } from "react";

interface ChallengeProgress {
	id: string;
	isCompleted: boolean;
	xpGained?: number;
	completedAt?: Date;
}

interface ModuleProgressState {
	moduleId: string;
	isStarted: boolean;
	isCompleted: boolean;
	completedChallenges: Map<string, ChallengeProgress>;
	totalChallenges: number;
	totalXpGained: number;
	startedAt?: Date;
	completedAt?: Date;
}

interface ModuleProgressHook {
	// State
	isStarted: boolean;
	isCompleted: boolean;
	completedCount: number;
	totalCount: number;
	progressPercent: number;
	totalXpGained: number;

	// Challenge methods
	markChallengeComplete: (
		challengeId: string,
		xpGained: number,
	) => { isModuleComplete: boolean };
	isChallengeCompleted: (challengeId: string) => boolean;
	getChallengeProgress: (challengeId: string) => ChallengeProgress | undefined;

	// Module methods
	startModule: () => void;
	resetProgress: () => void;
}

interface InitialChallenge {
	id: string;
	isCompleted: boolean;
	completedAt?: Date | null;
}

/**
 * Custom hook for tracking module challenge completion progress
 *
 * Manages local state for challenge completion and calculates
 * overall module progress.
 *
 * @param moduleId - The module ID to track
 * @param initialChallenges - Array of challenge IDs with their initial state
 * @returns Module progress state and methods
 */
export function useModuleProgress(
	moduleId: string,
	initialChallenges: InitialChallenge[],
): ModuleProgressHook {
	const [state, setState] = useState<ModuleProgressState>(() => {
		const completedMap = new Map<string, ChallengeProgress>();

		initialChallenges.forEach((challenge) => {
			completedMap.set(challenge.id, {
				id: challenge.id,
				isCompleted: challenge.isCompleted,
				completedAt: challenge.completedAt ?? undefined,
			});
		});

		const hasCompleted = initialChallenges.some((c) => c.isCompleted);
		const allCompleted = initialChallenges.every((c) => c.isCompleted);

		return {
			moduleId,
			isStarted: hasCompleted,
			isCompleted: allCompleted,
			completedChallenges: completedMap,
			totalChallenges: initialChallenges.length,
			totalXpGained: 0,
		};
	});

	/**
	 * Mark a challenge as completed
	 */
	const markChallengeComplete = useCallback(
		(challengeId: string, xpGained: number): { isModuleComplete: boolean } => {
			let isModuleComplete = false;

			setState((prev) => {
				const newMap = new Map(prev.completedChallenges);
				newMap.set(challengeId, {
					id: challengeId,
					isCompleted: true,
					xpGained,
					completedAt: new Date(),
				});

				const completedCount = Array.from(newMap.values()).filter(
					(c) => c.isCompleted,
				).length;

				isModuleComplete = completedCount === prev.totalChallenges;

				return {
					...prev,
					isStarted: true,
					isCompleted: isModuleComplete,
					completedChallenges: newMap,
					totalXpGained: prev.totalXpGained + xpGained,
					completedAt: isModuleComplete ? new Date() : undefined,
				};
			});

			return { isModuleComplete };
		},
		[],
	);

	/**
	 * Check if a specific challenge is completed
	 */
	const isChallengeCompleted = useCallback(
		(challengeId: string): boolean => {
			return state.completedChallenges.get(challengeId)?.isCompleted ?? false;
		},
		[state.completedChallenges],
	);

	/**
	 * Get progress details for a specific challenge
	 */
	const getChallengeProgress = useCallback(
		(challengeId: string): ChallengeProgress | undefined => {
			return state.completedChallenges.get(challengeId);
		},
		[state.completedChallenges],
	);

	/**
	 * Mark the module as started
	 */
	const startModule = useCallback(() => {
		setState((prev) => ({
			...prev,
			isStarted: true,
			startedAt: new Date(),
		}));
	}, []);

	/**
	 * Reset all progress for this module
	 */
	const resetProgress = useCallback(() => {
		setState((prev) => {
			const resetMap = new Map<string, ChallengeProgress>();
			prev.completedChallenges.forEach((_, id) => {
				resetMap.set(id, { id, isCompleted: false });
			});

			return {
				...prev,
				isStarted: false,
				isCompleted: false,
				completedChallenges: resetMap,
				totalXpGained: 0,
				startedAt: undefined,
				completedAt: undefined,
			};
		});
	}, []);

	/**
	 * Computed values
	 */
	const completedCount = useMemo(() => {
		return Array.from(state.completedChallenges.values()).filter(
			(c) => c.isCompleted,
		).length;
	}, [state.completedChallenges]);

	const progressPercent = useMemo(() => {
		if (state.totalChallenges === 0) return 0;
		return Math.round((completedCount / state.totalChallenges) * 100);
	}, [completedCount, state.totalChallenges]);

	return {
		// State
		isStarted: state.isStarted,
		isCompleted: state.isCompleted,
		completedCount,
		totalCount: state.totalChallenges,
		progressPercent,
		totalXpGained: state.totalXpGained,

		// Methods
		markChallengeComplete,
		isChallengeCompleted,
		getChallengeProgress,
		startModule,
		resetProgress,
	};
}
