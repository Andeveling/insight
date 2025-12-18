"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import {
	CheckCircle2,
	Circle,
	MessageSquare,
	Lightbulb,
	Users,
	Trophy,
	Loader2,
	UserPlus,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { completeChallenge } from "../_actions/complete-challenge";
import { initiateCollaborativeChallenge } from "../_actions/complete-collaborative";
import { XpGainToast } from "./xp-gain-toast";
import type { ChallengeCard as ChallengeCardType } from "../_schemas";
import type { PeerLearner } from "../_actions";

interface ChallengeCardProps {
	challenge: ChallengeCardType;
	index?: number;
	/**
	 * Available peers for collaborative challenges
	 */
	availablePeers?: PeerLearner[];
	onComplete?: (result: {
		xpGained: number;
		leveledUp: boolean;
		newLevel?: number;
		moduleCompleted: boolean;
	}) => void;
}

/**
 * Interactive Challenge Card Component
 *
 * Allows users to complete challenges with optional reflection input.
 * Shows XP gain animation on completion.
 * For collaboration type, shows peer selection dialog.
 */
export function ChallengeCard({
	challenge,
	index = 0,
	availablePeers = [],
	onComplete,
}: ChallengeCardProps) {
	const [isPending, startTransition] = useTransition();
	const [isCompleted, setIsCompleted] = useState(challenge.isCompleted);
	const [showReflectionDialog, setShowReflectionDialog] = useState(false);
	const [showCollaborativeDialog, setShowCollaborativeDialog] = useState(false);
	const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
	const [reflection, setReflection] = useState("");
	const [showXpToast, setShowXpToast] = useState(false);
	const [xpGained, setXpGained] = useState(0);

	const typeConfig = {
		reflection: {
			icon: MessageSquare,
			label: "Reflexión",
			color: "text-blue-500",
			bgColor: "bg-blue-100 dark:bg-blue-900/30",
			requiresReflection: true,
		},
		action: {
			icon: Lightbulb,
			label: "Acción",
			color: "text-amber-500",
			bgColor: "bg-amber-100 dark:bg-amber-900/30",
			requiresReflection: false,
		},
		collaboration: {
			icon: Users,
			label: "Colaboración",
			color: "text-green-500",
			bgColor: "bg-green-100 dark:bg-green-900/30",
			requiresReflection: false,
		},
	};

	const config = typeConfig[challenge.type];
	const TypeIcon = config.icon;

	const handleComplete = () => {
		if (isCompleted || isPending) return;

		if (config.requiresReflection) {
			setShowReflectionDialog(true);
		} else if (challenge.type === "collaboration") {
			setShowCollaborativeDialog(true);
		} else {
			submitCompletion();
		}
	};

	const submitCompletion = (reflectionText?: string) => {
		startTransition(async () => {
			try {
				const result = await completeChallenge({
					challengeId: challenge.id,
					reflection: reflectionText,
				});

				if (result.success && result.xpGained > 0) {
					setIsCompleted(true);
					setXpGained(result.xpGained);
					setShowXpToast(true);
					setShowReflectionDialog(false);

					onComplete?.({
						xpGained: result.xpGained,
						leveledUp: result.leveledUp,
						newLevel: result.newLevel,
						moduleCompleted: result.moduleCompleted,
					});
				}
			} catch (error) {
				console.error("Error completing challenge:", error);
				toast.error("Error al completar el desafío");
			}
		});
	};

	const submitCollaborative = (partnerId: string) => {
		startTransition(async () => {
			try {
				const result = await initiateCollaborativeChallenge({
					challengeId: challenge.id,
					partnerId,
				});

				if (result.success) {
					toast.success(result.message);
					setShowCollaborativeDialog(false);
				}
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Error al iniciar desafío colaborativo",
				);
			}
		});
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: index * 0.05 }}
				className={cn(
					"group relative flex items-start gap-3 rounded-lg border p-4 transition-all",
					isCompleted
						? "bg-muted/50 border-muted"
						: "hover:border-primary/50 hover:shadow-sm",
				)}
			>
				{/* Completion Button */}
				<button
					onClick={handleComplete}
					disabled={isCompleted || isPending}
					aria-label={
						isPending
							? "Completando desafío..."
							: isCompleted
								? `Desafío completado: ${challenge.titleEs}`
								: `Marcar como completado: ${challenge.titleEs}`
					}
					className={cn(
						"shrink-0 pt-0.5 transition-colors",
						!isCompleted && !isPending && "hover:text-primary cursor-pointer",
					)}
				>
					{isPending ? (
						<Loader2 className="h-5 w-5 animate-spin text-primary" />
					) : isCompleted ? (
						<CheckCircle2 className="h-5 w-5 text-green-500" />
					) : (
						<Circle
							className={cn(
								"h-5 w-5 text-muted-foreground/50",
								"group-hover:text-primary transition-colors",
							)}
						/>
					)}
				</button>

				{/* Content */}
				<div className="flex-1 min-w-0 space-y-2">
					<div className="flex items-start justify-between gap-2">
						<h4
							className={cn(
								"font-medium text-sm",
								isCompleted && "line-through text-muted-foreground",
							)}
						>
							{challenge.titleEs}
						</h4>
						<Badge variant="outline" className={cn("shrink-0", config.bgColor)}>
							<TypeIcon className={cn("h-3 w-3 mr-1", config.color)} />
							{config.label}
						</Badge>
					</div>

					<p
						className={cn(
							"text-sm text-muted-foreground",
							isCompleted && "line-through",
						)}
					>
						{challenge.descriptionEs}
					</p>

					{/* XP Reward */}
					<div className="flex items-center gap-2 text-xs">
						<span
							className={cn(
								"flex items-center gap-1",
								isCompleted
									? "text-green-600 dark:text-green-400"
									: "text-muted-foreground",
							)}
						>
							<Trophy className="h-3 w-3" />
							{isCompleted ? "+" : ""}
							{challenge.xpReward} XP
						</span>
						{challenge.completedAt && (
							<span className="text-muted-foreground">
								• Completado el{" "}
								{new Date(challenge.completedAt).toLocaleDateString("es-ES", {
									day: "numeric",
									month: "short",
								})}
							</span>
						)}
					</div>

					{/* Complete Button (for not started) */}
					{!isCompleted && (
						<Button
							size="sm"
							variant="outline"
							onClick={handleComplete}
							disabled={isPending}
							className="mt-2"
						>
							{isPending ? (
								<>
									<Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
									Completando...
								</>
							) : (
								"Marcar como completado"
							)}
						</Button>
					)}
				</div>
			</motion.div>

			{/* Reflection Dialog */}
			<Dialog
				open={showReflectionDialog}
				onOpenChange={setShowReflectionDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Reflexión</DialogTitle>
						<DialogDescription>
							Comparte tu reflexión sobre este desafío. ¿Qué aprendiste?
						</DialogDescription>
					</DialogHeader>

					<Textarea
						value={reflection}
						onChange={(e) => setReflection(e.target.value)}
						placeholder="Escribe tu reflexión aquí..."
						rows={4}
						className="resize-none"
					/>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowReflectionDialog(false)}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => submitCompletion(reflection)}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Guardando...
								</>
							) : (
								"Completar Desafío"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Collaborative Challenge Dialog */}
			<Dialog
				open={showCollaborativeDialog}
				onOpenChange={setShowCollaborativeDialog}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Users className="h-5 w-5 text-green-500" />
							Desafío Colaborativo
						</DialogTitle>
						<DialogDescription>
							Selecciona un compañero para completar este desafío juntos. Ambos
							recibirán +50% XP bonus.
						</DialogDescription>
					</DialogHeader>

					<div className="max-h-64 space-y-2 overflow-y-auto py-2">
						{availablePeers.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<Users className="mx-auto h-12 w-12 opacity-30" />
								<p className="mt-2">No hay compañeros disponibles</p>
								<p className="text-sm">
									Otros usuarios deben estar trabajando en este módulo
								</p>
							</div>
						) : (
							availablePeers.map((peer) => (
								<button
									key={peer.id}
									onClick={() => setSelectedPeerId(peer.id)}
									className={cn(
										"w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
										selectedPeerId === peer.id
											? "border-primary bg-primary/5"
											: "hover:border-primary/50",
									)}
								>
									<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-primary/20 to-primary/40">
										{peer.image ? (
											<img
												src={peer.image}
												alt={peer.name}
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
												{peer.name.charAt(0)}
											</span>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">{peer.name}</p>
										<p className="text-xs text-muted-foreground">
											{peer.progressPercent}% progreso
										</p>
									</div>
									{selectedPeerId === peer.id && (
										<CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
									)}
								</button>
							))
						)}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setShowCollaborativeDialog(false);
								setSelectedPeerId(null);
							}}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button
							onClick={() =>
								selectedPeerId && submitCollaborative(selectedPeerId)
							}
							disabled={isPending || !selectedPeerId}
						>
							{isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Enviando...
								</>
							) : (
								<>
									<UserPlus className="h-4 w-4 mr-2" />
									Invitar
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* XP Gain Toast */}
			{showXpToast && (
				<XpGainToast
					xpAmount={xpGained}
					onClose={() => setShowXpToast(false)}
				/>
			)}
		</>
	);
}
