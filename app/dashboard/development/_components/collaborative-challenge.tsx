"use client";

import { useState, useTransition } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Users,
	Clock,
	CheckCircle,
	Handshake,
	Sparkles,
	Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { confirmCollaborativeChallenge } from "../_actions";
import type { ChallengeCompletionResult } from "../_schemas";

/**
 * Pending collaborative challenge data
 */
interface PendingChallenge {
	id: string;
	challengeId: string;
	challengeTitle: string;
	moduleNameEs: string;
	initiatorName: string;
	initiatorImage: string | null;
	expiresAt: Date;
	xpReward: number;
}

interface CollaborativeChallengeListProps {
	/**
	 * List of pending collaborative challenges
	 */
	pendingChallenges: PendingChallenge[];
	/**
	 * Callback when a challenge is confirmed
	 */
	onChallengeConfirmed?: (result: ChallengeCompletionResult) => void;
	/**
	 * CSS class name
	 */
	className?: string;
}

/**
 * CollaborativeChallengeList Component
 *
 * Displays pending collaborative challenges that need user confirmation.
 * Shows who invited, challenge details, and expiration time.
 */
export function CollaborativeChallengeList({
	pendingChallenges,
	onChallengeConfirmed,
	className,
}: CollaborativeChallengeListProps) {
	if (pendingChallenges.length === 0) {
		return null;
	}

	return (
		<Card className={cn("border-2 border-amber-200 bg-amber-50/50", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Handshake className="h-5 w-5 text-amber-600" />
					Invitaciones Pendientes
					<Badge
						variant="secondary"
						className="ml-auto bg-amber-100 text-amber-700"
					>
						{pendingChallenges.length}
					</Badge>
				</CardTitle>
				<CardDescription>
					Otros usuarios te han invitado a completar desafíos colaborativos
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<AnimatePresence mode="popLayout">
					{pendingChallenges.map((challenge, index) => (
						<motion.div
							key={challenge.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ delay: index * 0.05 }}
						>
							<CollaborativeChallengeCard
								challenge={challenge}
								onConfirmed={onChallengeConfirmed}
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}

interface CollaborativeChallengeCardProps {
	challenge: PendingChallenge;
	onConfirmed?: (result: ChallengeCompletionResult) => void;
}

function CollaborativeChallengeCard({
	challenge,
	onConfirmed,
}: CollaborativeChallengeCardProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [reflection, setReflection] = useState("");
	const [isPending, startTransition] = useTransition();

	const timeLeft = formatDistanceToNow(new Date(challenge.expiresAt), {
		addSuffix: true,
		locale: es,
	});

	// Calculate expiring soon on mount only to avoid impure render
	const [isExpiringSoon] = useState(() => {
		const expiresAtMs = new Date(challenge.expiresAt).getTime();
		const nowMs = Date.now();
		return expiresAtMs - nowMs < 24 * 60 * 60 * 1000;
	});

	const handleConfirm = () => {
		startTransition(async () => {
			try {
				const result = await confirmCollaborativeChallenge(
					challenge.id,
					reflection || undefined,
				);

				toast.success(result.message, {
					icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
				});

				setIsDialogOpen(false);
				onConfirmed?.(result);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Error al confirmar el desafío",
				);
			}
		});
	};

	return (
		<div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
			{/* Initiator Avatar */}
			<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-amber-200 to-amber-400">
				{challenge.initiatorImage ? (
					<img
						src={challenge.initiatorImage}
						alt={challenge.initiatorName}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-lg font-bold text-amber-700">
						{challenge.initiatorName.charAt(0).toUpperCase()}
					</div>
				)}
			</div>

			{/* Challenge Info */}
			<div className="flex-1 min-w-0">
				<p className="font-medium">{challenge.challengeTitle}</p>
				<p className="text-sm text-muted-foreground">
					Invitación de{" "}
					<span className="font-medium">{challenge.initiatorName}</span>
				</p>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<Users className="h-3 w-3" />
						{challenge.moduleNameEs}
					</Badge>
					<Badge
						variant="outline"
						className={cn(
							"gap-1",
							isExpiringSoon
								? "border-red-200 bg-red-50 text-red-700"
								: "border-muted",
						)}
					>
						<Clock className="h-3 w-3" />
						Expira {timeLeft}
					</Badge>
					<Badge
						variant="outline"
						className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
					>
						<Sparkles className="h-3 w-3" />+{challenge.xpReward} XP
					</Badge>
				</div>
			</div>

			{/* Actions */}
			<div className="flex shrink-0 gap-2">
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button size="sm" className="gap-1">
							<CheckCircle className="h-4 w-4" />
							Confirmar
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<Handshake className="h-5 w-5 text-primary" />
								Confirmar Desafío Colaborativo
							</DialogTitle>
							<DialogDescription>
								Al confirmar, tú y {challenge.initiatorName} recibirán cada uno{" "}
								<span className="font-medium text-primary">
									+{challenge.xpReward} XP
								</span>
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<div className="rounded-lg bg-muted p-4">
								<p className="font-medium">{challenge.challengeTitle}</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{challenge.moduleNameEs}
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="reflection">Reflexión (opcional)</Label>
								<Textarea
									id="reflection"
									placeholder="¿Qué aprendiste de esta experiencia colaborativa?"
									value={reflection}
									onChange={(e) => setReflection(e.target.value)}
									rows={3}
									maxLength={2000}
								/>
							</div>
						</div>

						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								disabled={isPending}
							>
								Cancelar
							</Button>
							<Button onClick={handleConfirm} disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Confirmando...
									</>
								) : (
									<>
										<CheckCircle className="mr-2 h-4 w-4" />
										Confirmar y Ganar XP
									</>
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

interface CollaborativeChallengeStatusProps {
	/**
	 * Status of the collaborative challenge
	 */
	status: {
		initiatorName: string;
		partnerName: string;
		initiatorConfirmed: boolean;
		partnerConfirmed: boolean;
		isCompleted: boolean;
	};
	/**
	 * Whether current user is the initiator
	 */
	isInitiator: boolean;
	/**
	 * CSS class name
	 */
	className?: string;
}

/**
 * CollaborativeChallengeStatus Component
 *
 * Shows the status of a collaborative challenge in progress.
 */
export function CollaborativeChallengeStatus({
	status,
	isInitiator,
	className,
}: CollaborativeChallengeStatusProps) {
	const {
		initiatorName,
		partnerName,
		initiatorConfirmed,
		partnerConfirmed,
		isCompleted,
	} = status;

	if (isCompleted) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className={cn(
					"flex items-center gap-3 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4",
					className,
				)}
			>
				<CheckCircle className="h-8 w-8 text-emerald-600" />
				<div>
					<p className="font-medium text-emerald-800">
						¡Desafío Colaborativo Completado!
					</p>
					<p className="text-sm text-emerald-600">
						Tú y {isInitiator ? partnerName : initiatorName} han completado este
						desafío juntos
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<div
			className={cn(
				"rounded-lg border-2 border-amber-200 bg-amber-50 p-4",
				className,
			)}
		>
			<div className="flex items-center gap-2 mb-3">
				<Handshake className="h-5 w-5 text-amber-600" />
				<span className="font-medium text-amber-800">
					Esperando Confirmación
				</span>
			</div>

			<div className="space-y-2">
				<ConfirmationRow
					name={initiatorName}
					isConfirmed={initiatorConfirmed}
					isCurrentUser={isInitiator}
				/>
				<ConfirmationRow
					name={partnerName}
					isConfirmed={partnerConfirmed}
					isCurrentUser={!isInitiator}
				/>
			</div>
		</div>
	);
}

function ConfirmationRow({
	name,
	isConfirmed,
	isCurrentUser,
}: {
	name: string;
	isConfirmed: boolean;
	isCurrentUser: boolean;
}) {
	return (
		<div className="flex items-center gap-2">
			{isConfirmed ? (
				<CheckCircle className="h-4 w-4 text-emerald-600" />
			) : (
				<Clock className="h-4 w-4 text-amber-600 animate-pulse" />
			)}
			<span className={cn("text-sm", isConfirmed && "text-emerald-700")}>
				{name}
				{isCurrentUser && " (tú)"}
			</span>
			<Badge
				variant="outline"
				className={cn(
					"ml-auto text-xs",
					isConfirmed
						? "border-emerald-200 bg-emerald-100 text-emerald-700"
						: "border-amber-200 bg-amber-100 text-amber-700",
				)}
			>
				{isConfirmed ? "Confirmado" : "Pendiente"}
			</Badge>
		</div>
	);
}

function CollaborativeChallengeSkeleton() {
	return (
		<Card className="border-dashed">
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="h-5 w-5 rounded bg-muted animate-pulse" />
					<div className="h-5 w-40 rounded bg-muted animate-pulse" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-start gap-4 rounded-lg border p-4">
					<div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
					<div className="flex-1 space-y-2">
						<div className="h-4 w-48 rounded bg-muted animate-pulse" />
						<div className="h-3 w-32 rounded bg-muted animate-pulse" />
						<div className="flex gap-2">
							<div className="h-5 w-20 rounded bg-muted animate-pulse" />
							<div className="h-5 w-24 rounded bg-muted animate-pulse" />
						</div>
					</div>
					<div className="h-8 w-24 rounded bg-muted animate-pulse" />
				</div>
			</CardContent>
		</Card>
	);
}

export { CollaborativeChallengeSkeleton };
