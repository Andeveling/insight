/**
 * What-If Simulator Component
 *
 * UI component for simulating team member changes.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/what-if-simulator
 */

"use client";

import { useState } from "react";
import { ArrowLeftRight, Check, Undo2, X, Zap } from "lucide-react";

import { cn } from "@/lib/cn";
import type { SubTeamMember } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

import { MatchScoreDisplay } from "./match-score-display";
import {
	useWhatIf,
	type SimulationState,
	type MemberSwap,
} from "../_hooks/use-what-if";

interface WhatIfSimulatorProps {
	teamId: string;
	subTeamId: string;
	projectTypeProfileId: string;
	currentMembers: string[];
	currentScore: number | null;
	availableMembers: SubTeamMember[];
	onApply: (newMembers: string[]) => Promise<void>;
}

/**
 * What-If Simulator
 *
 * Allows users to:
 * - Start a simulation session
 * - Swap members and see projected score changes
 * - Apply or cancel changes
 */
export function WhatIfSimulator({
	teamId,
	subTeamId,
	projectTypeProfileId,
	currentMembers,
	currentScore,
	availableMembers,
	onApply,
}: WhatIfSimulatorProps) {
	const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
	const [selectedMemberToRemove, setSelectedMemberToRemove] = useState<
		string | null
	>(null);

	const {
		state,
		isCalculating,
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
	} = useWhatIf({
		teamId,
		subTeamId,
		projectTypeProfileId,
		initialMembers: currentMembers,
		initialScore: currentScore,
		availableMembers,
		onApply,
	});

	// Members not in the current simulation
	const nonSimulatedMembers = availableMembers.filter(
		(m) => !isMemberInSimulation(m.id),
	);

	// Handle swap member selection
	const handleSelectMemberToSwap = (memberId: string) => {
		setSelectedMemberToRemove(memberId);
		setIsSwapDialogOpen(true);
	};

	const handleConfirmSwap = async (addMemberId: string) => {
		if (selectedMemberToRemove) {
			await swapMember(selectedMemberToRemove, addMemberId);
		}
		setIsSwapDialogOpen(false);
		setSelectedMemberToRemove(null);
	};

	// If simulation is not active, show the start button
	if (!state.isActive) {
		return (
			<Button variant="outline" onClick={startSimulation} className="gap-2">
				<Zap className="h-4 w-4" />
				Simular Cambios
			</Button>
		);
	}

	const scoreDelta = getScoreDelta();

	return (
		<>
			{/* Simulation Mode Banner */}
			<Card className="border-amber-500/50 bg-amber-500/5">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
							<CardTitle className="text-base">Modo Simulación</CardTitle>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={cancelSimulation}
								className="text-muted-foreground"
							>
								<X className="h-4 w-4 mr-1" />
								Cancelar
							</Button>
							<Button
								size="sm"
								onClick={applySimulation}
								disabled={state.pendingSwaps.length === 0 || isCalculating}
							>
								<Check className="h-4 w-4 mr-1" />
								Aplicar Cambios
							</Button>
						</div>
					</div>
					<CardDescription>
						Prueba diferentes combinaciones de miembros sin guardar cambios
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Score Comparison */}
					<div className="grid grid-cols-2 gap-4">
						<div className="p-3 rounded-lg bg-muted/50">
							<p className="text-xs text-muted-foreground mb-1">
								Score Original
							</p>
							<MatchScoreDisplay
								score={state.originalScore}
								size="sm"
								showLabel={false}
							/>
						</div>
						<div className="p-3 rounded-lg bg-muted/50 relative">
							<p className="text-xs text-muted-foreground mb-1">
								Score Proyectado
							</p>
							<div className="flex items-center gap-2">
								{isCalculating ? (
									<Spinner className="h-5 w-5" />
								) : (
									<MatchScoreDisplay
										score={
											state.simulatedResult?.totalScore ?? state.originalScore
										}
										size="sm"
										showLabel={false}
									/>
								)}
								{!isCalculating && scoreDelta !== 0 && (
									<ScoreDeltaBadge delta={scoreDelta} />
								)}
							</div>
						</div>
					</div>

					{/* Current Simulated Members */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<p className="text-sm font-medium">
								Miembros Actuales ({state.simulatedMembers.length})
							</p>
							{state.pendingSwaps.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={undoLastSwap}
									disabled={isCalculating}
									className="h-7 text-xs"
								>
									<Undo2 className="h-3 w-3 mr-1" />
									Deshacer
								</Button>
							)}
						</div>
						<div className="flex flex-wrap gap-2">
							{state.simulatedMembers.map((memberId) => {
								const isOriginal = state.originalMembers.includes(memberId);
								return (
									<SimulatedMemberChip
										key={memberId}
										name={getMemberName(memberId)}
										isNew={!isOriginal}
										onSwap={() => handleSelectMemberToSwap(memberId)}
										onRemove={() => removeMember(memberId)}
										canRemove={state.simulatedMembers.length > 2}
										disabled={isCalculating}
									/>
								);
							})}
						</div>
					</div>

					{/* Add Member Section */}
					{nonSimulatedMembers.length > 0 &&
						state.simulatedMembers.length < 10 && (
							<div>
								<p className="text-sm font-medium mb-2">Agregar Miembro</p>
								<div className="flex flex-wrap gap-2">
									{nonSimulatedMembers.slice(0, 5).map((member) => (
										<Button
											key={member.id}
											variant="outline"
											size="sm"
											onClick={() => addMember(member.id)}
											disabled={isCalculating}
											className="h-7 text-xs"
										>
											+ {member.name}
										</Button>
									))}
									{nonSimulatedMembers.length > 5 && (
										<span className="text-xs text-muted-foreground self-center">
											+{nonSimulatedMembers.length - 5} más
										</span>
									)}
								</div>
							</div>
						)}

					{/* Pending Swaps List */}
					{state.pendingSwaps.length > 0 && (
						<div className="border-t pt-4">
							<p className="text-sm font-medium mb-2">Cambios Pendientes</p>
							<div className="space-y-2">
								{state.pendingSwaps.map((swap, index) => (
									<SwapItem key={index} swap={swap} />
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Swap Member Dialog */}
			<SwapMemberDialog
				isOpen={isSwapDialogOpen}
				onClose={() => {
					setIsSwapDialogOpen(false);
					setSelectedMemberToRemove(null);
				}}
				removingMemberName={
					selectedMemberToRemove ? getMemberName(selectedMemberToRemove) : ""
				}
				availableMembers={nonSimulatedMembers}
				onSelectMember={handleConfirmSwap}
			/>
		</>
	);
}

/**
 * Score delta badge
 */
function ScoreDeltaBadge({ delta }: { delta: number }) {
	const isPositive = delta > 0;

	return (
		<Badge
			className={cn(
				"text-xs font-semibold",
				isPositive
					? "bg-green-500/20 text-green-700 dark:text-green-300"
					: "bg-red-500/20 text-red-700 dark:text-red-300",
			)}
		>
			{isPositive ? "+" : ""}
			{delta}
		</Badge>
	);
}

/**
 * Simulated member chip
 */
interface SimulatedMemberChipProps {
	name: string;
	isNew: boolean;
	onSwap: () => void;
	onRemove: () => void;
	canRemove: boolean;
	disabled: boolean;
}

function SimulatedMemberChip({
	name,
	isNew,
	onSwap,
	onRemove,
	canRemove,
	disabled,
}: SimulatedMemberChipProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border",
				isNew
					? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300"
					: "bg-muted border-border",
			)}
		>
			<span className="font-medium">{name}</span>
			<div className="flex items-center gap-0.5 ml-1">
				<button
					onClick={onSwap}
					disabled={disabled}
					className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded disabled:opacity-50"
					title="Intercambiar"
				>
					<ArrowLeftRight className="h-3 w-3" />
				</button>
				{canRemove && (
					<button
						onClick={onRemove}
						disabled={disabled}
						className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded disabled:opacity-50"
						title="Quitar"
					>
						<X className="h-3 w-3" />
					</button>
				)}
			</div>
		</div>
	);
}

/**
 * Swap item display
 */
function SwapItem({ swap }: { swap: MemberSwap }) {
	return (
		<div className="flex items-center gap-2 text-xs p-2 rounded bg-muted/50">
			<span className="text-red-600 line-through">
				{swap.removedMemberName}
			</span>
			<ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
			<span className="text-green-600 font-medium">{swap.addedMemberName}</span>
			<ScoreDeltaBadge delta={swap.scoreDelta} />
		</div>
	);
}

/**
 * Swap member dialog
 */
interface SwapMemberDialogProps {
	isOpen: boolean;
	onClose: () => void;
	removingMemberName: string;
	availableMembers: SubTeamMember[];
	onSelectMember: (memberId: string) => void;
}

function SwapMemberDialog({
	isOpen,
	onClose,
	removingMemberName,
	availableMembers,
	onSelectMember,
}: SwapMemberDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Intercambiar Miembro</DialogTitle>
					<DialogDescription>
						Selecciona un miembro para reemplazar a{" "}
						<strong>{removingMemberName}</strong>
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[300px]">
					<div className="space-y-2 p-1">
						{availableMembers.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No hay miembros disponibles para intercambiar
							</p>
						) : (
							availableMembers.map((member) => (
								<button
									key={member.id}
									onClick={() => onSelectMember(member.id)}
									className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
								>
									<div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
										<span className="text-sm font-medium">
											{member.name?.charAt(0).toUpperCase() || "?"}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{member.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{member.strengths
												?.slice(0, 3)
												.map((s) => s.nameEs || s.name)
												.join(", ")}
										</p>
									</div>
								</button>
							))
						)}
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancelar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
