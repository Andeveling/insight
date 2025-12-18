/**
 * useWhatIf Hook
 *
 * Custom hook for managing What-If simulation state.
 * Allows simulating member swaps without persisting changes.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_hooks/use-what-if
 */

"use client";

import { useCallback, useState, useTransition } from "react";

import type { MatchScoreResult, SubTeamMember } from "@/lib/types";

import { calculateMatchScore } from "../_actions/calculate-match-score";

/**
 * Simulation state
 */
export interface SimulationState {
	isActive: boolean;
	originalMembers: string[];
	simulatedMembers: string[];
	originalScore: number | null;
	simulatedResult: MatchScoreResult | null;
	pendingSwaps: MemberSwap[];
}

/**
 * A member swap operation
 */
export interface MemberSwap {
	removedMemberId: string;
	removedMemberName: string;
	addedMemberId: string;
	addedMemberName: string;
	scoreDelta: number;
}

interface UseWhatIfOptions {
	teamId: string;
	subTeamId: string;
	projectTypeProfileId: string;
	initialMembers: string[];
	initialScore: number | null;
	availableMembers: SubTeamMember[];
	onApply?: (newMembers: string[]) => Promise<void>;
}

interface UseWhatIfReturn {
	/** Current simulation state */
	state: SimulationState;
	/** Whether a calculation is in progress */
	isCalculating: boolean;
	/** Start a new simulation session */
	startSimulation: () => void;
	/** Cancel the simulation and revert to original */
	cancelSimulation: () => void;
	/** Swap a member in the simulation */
	swapMember: (removeId: string, addId: string) => Promise<void>;
	/** Remove a member from the simulation */
	removeMember: (memberId: string) => Promise<void>;
	/** Add a member to the simulation */
	addMember: (memberId: string) => Promise<void>;
	/** Undo the last swap */
	undoLastSwap: () => Promise<void>;
	/** Apply the simulation changes */
	applySimulation: () => Promise<void>;
	/** Get the score delta from original */
	getScoreDelta: () => number;
	/** Check if a member is in the simulated team */
	isMemberInSimulation: (memberId: string) => boolean;
	/** Get member name by ID */
	getMemberName: (memberId: string) => string;
}

/**
 * Hook for What-If simulation
 *
 * @example
 * ```tsx
 * const { state, startSimulation, swapMember, applySimulation } = useWhatIf({
 *   teamId: 'team-123',
 *   subTeamId: 'subteam-456',
 *   projectTypeProfileId: 'type-789',
 *   initialMembers: ['user-1', 'user-2'],
 *   initialScore: 75,
 *   availableMembers: [...],
 *   onApply: async (newMembers) => { await updateSubTeam(...) }
 * });
 * ```
 */
export function useWhatIf({
	teamId,
	projectTypeProfileId,
	initialMembers,
	initialScore,
	availableMembers,
	onApply,
}: UseWhatIfOptions): UseWhatIfReturn {
	const [state, setState] = useState<SimulationState>({
		isActive: false,
		originalMembers: initialMembers,
		simulatedMembers: initialMembers,
		originalScore: initialScore,
		simulatedResult: null,
		pendingSwaps: [],
	});

	const [isPending, startTransition] = useTransition();

	/**
	 * Get member name by ID
	 */
	const getMemberName = useCallback(
		(memberId: string): string => {
			const member = availableMembers.find((m) => m.id === memberId);
			return member?.name || "Desconocido";
		},
		[availableMembers],
	);

	/**
	 * Calculate score for current simulation
	 */
	const recalculateScore = useCallback(
		async (memberIds: string[]): Promise<MatchScoreResult | null> => {
			if (memberIds.length < 2) return null;

			const response = await calculateMatchScore({
				teamId,
				projectTypeProfileId,
				memberIds,
			});

			if (response.success) {
				return response.data;
			}
			return null;
		},
		[teamId, projectTypeProfileId],
	);

	/**
	 * Start a new simulation
	 */
	const startSimulation = useCallback(() => {
		setState((prev) => ({
			...prev,
			isActive: true,
			simulatedMembers: [...prev.originalMembers],
			simulatedResult: null,
			pendingSwaps: [],
		}));
	}, []);

	/**
	 * Cancel the simulation
	 */
	const cancelSimulation = useCallback(() => {
		setState((prev) => ({
			...prev,
			isActive: false,
			simulatedMembers: [...prev.originalMembers],
			simulatedResult: null,
			pendingSwaps: [],
		}));
	}, []);

	/**
	 * Swap a member
	 */
	const swapMember = useCallback(
		async (removeId: string, addId: string) => {
			if (!state.isActive) return;
			if (removeId === addId) return;

			const newMembers = state.simulatedMembers.filter((id) => id !== removeId);
			if (!newMembers.includes(addId)) {
				newMembers.push(addId);
			}

			startTransition(async () => {
				const result = await recalculateScore(newMembers);
				const previousScore =
					state.simulatedResult?.totalScore ?? state.originalScore ?? 0;
				const newScore = result?.totalScore ?? 0;

				setState((prev) => ({
					...prev,
					simulatedMembers: newMembers,
					simulatedResult: result,
					pendingSwaps: [
						...prev.pendingSwaps,
						{
							removedMemberId: removeId,
							removedMemberName: getMemberName(removeId),
							addedMemberId: addId,
							addedMemberName: getMemberName(addId),
							scoreDelta: newScore - previousScore,
						},
					],
				}));
			});
		},
		[
			state.isActive,
			state.simulatedMembers,
			state.simulatedResult,
			state.originalScore,
			recalculateScore,
			getMemberName,
		],
	);

	/**
	 * Remove a member
	 */
	const removeMember = useCallback(
		async (memberId: string) => {
			if (!state.isActive) return;

			const newMembers = state.simulatedMembers.filter((id) => id !== memberId);
			if (newMembers.length < 2) return; // Minimum 2 members

			startTransition(async () => {
				const result = await recalculateScore(newMembers);

				setState((prev) => ({
					...prev,
					simulatedMembers: newMembers,
					simulatedResult: result,
				}));
			});
		},
		[state.isActive, state.simulatedMembers, recalculateScore],
	);

	/**
	 * Add a member
	 */
	const addMember = useCallback(
		async (memberId: string) => {
			if (!state.isActive) return;
			if (state.simulatedMembers.includes(memberId)) return;
			if (state.simulatedMembers.length >= 10) return; // Maximum 10 members

			const newMembers = [...state.simulatedMembers, memberId];

			startTransition(async () => {
				const result = await recalculateScore(newMembers);

				setState((prev) => ({
					...prev,
					simulatedMembers: newMembers,
					simulatedResult: result,
				}));
			});
		},
		[state.isActive, state.simulatedMembers, recalculateScore],
	);

	/**
	 * Undo the last swap
	 */
	const undoLastSwap = useCallback(async () => {
		if (!state.isActive || state.pendingSwaps.length === 0) return;

		const lastSwap = state.pendingSwaps[state.pendingSwaps.length - 1];
		const newMembers = state.simulatedMembers
			.filter((id) => id !== lastSwap.addedMemberId)
			.concat(lastSwap.removedMemberId);

		startTransition(async () => {
			const result = await recalculateScore(newMembers);

			setState((prev) => ({
				...prev,
				simulatedMembers: newMembers,
				simulatedResult: result,
				pendingSwaps: prev.pendingSwaps.slice(0, -1),
			}));
		});
	}, [
		state.isActive,
		state.pendingSwaps,
		state.simulatedMembers,
		recalculateScore,
	]);

	/**
	 * Apply the simulation
	 */
	const applySimulation = useCallback(async () => {
		if (!state.isActive || !onApply) return;

		await onApply(state.simulatedMembers);

		setState((prev) => ({
			...prev,
			isActive: false,
			originalMembers: prev.simulatedMembers,
			originalScore: prev.simulatedResult?.totalScore ?? prev.originalScore,
			pendingSwaps: [],
		}));
	}, [state.isActive, state.simulatedMembers, onApply]);

	/**
	 * Get score delta
	 */
	const getScoreDelta = useCallback((): number => {
		const currentScore =
			state.simulatedResult?.totalScore ?? state.originalScore ?? 0;
		const originalScore = state.originalScore ?? 0;
		return currentScore - originalScore;
	}, [state.simulatedResult, state.originalScore]);

	/**
	 * Check if member is in simulation
	 */
	const isMemberInSimulation = useCallback(
		(memberId: string): boolean => {
			return state.simulatedMembers.includes(memberId);
		},
		[state.simulatedMembers],
	);

	return {
		state,
		isCalculating: isPending,
		startSimulation,
		cancelSimulation,
		swapMember,
		removeMember,
		addMember,
		undoLastSwap,
		applySimulation,
		getScoreDelta,
		isMemberInSimulation,
		getMemberName,
	};
}
