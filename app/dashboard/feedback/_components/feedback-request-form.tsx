/**
 * Feedback Request Form Component
 *
 * Form for creating peer feedback requests
 * Allows selecting 3-5 teammates and anonymity preference
 */

"use client";

import { AlertCircle, Check, Lock, Unlock, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { createFeedbackRequestAction } from "../_actions/feedback-request.actions";

/**
 * Teammate available for selection
 */
interface Teammate {
	id: string;
	name: string;
	email: string;
	image: string | null;
	inCooldown: boolean;
}

interface FeedbackRequestFormProps {
	teammates: Teammate[];
}

export function FeedbackRequestForm({ teammates }: FeedbackRequestFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isAnonymous, setIsAnonymous] = useState(true);

	const availableTeammates = teammates.filter((t) => !t.inCooldown);
	const cooldownTeammates = teammates.filter((t) => t.inCooldown);

	const toggleSelection = (id: string) => {
		const newSelected = new Set(selectedIds);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else if (newSelected.size < 5) {
			newSelected.add(id);
		} else {
			toast.warning("Máximo 5 compañeros", {
				description:
					"Puedes seleccionar hasta 5 compañeros para solicitar feedback.",
			});
		}
		setSelectedIds(newSelected);
	};

	const handleSubmit = () => {
		if (selectedIds.size < 3) {
			toast.error("Selecciona al menos 3 compañeros", {
				description:
					"Necesitas un mínimo de 3 respuestas para obtener insights significativos.",
			});
			return;
		}

		startTransition(async () => {
			const formData = new FormData();
			selectedIds.forEach((id) => formData.append("respondentIds", id));
			formData.append("isAnonymous", String(isAnonymous));

			const result = await createFeedbackRequestAction(formData);

			if (result.success) {
				toast.success("¡Solicitudes enviadas!", {
					description: `Se enviaron ${result.data?.createdRequests.length} solicitudes de feedback.`,
				});
				router.push("/dashboard/feedback");
			} else {
				toast.error("Error al enviar solicitudes", {
					description: result.error || "Ocurrió un error inesperado.",
				});
			}
		});
	};

	return (
		<div className="space-y-6">
			{/* Anonymity Toggle */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{isAnonymous ? (
							<Lock className="h-5 w-5" />
						) : (
							<Unlock className="h-5 w-5" />
						)}
						Configuración de Privacidad
					</CardTitle>
					<CardDescription>
						Elige cómo quieres que tus compañeros respondan
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<Button
							type="button"
							variant={isAnonymous ? "default" : "outline"}
							className="flex-1"
							onClick={() => setIsAnonymous(true)}
						>
							<Lock className="h-4 w-4 mr-2" />
							Respuestas Anónimas
						</Button>
						<Button
							type="button"
							variant={!isAnonymous ? "default" : "outline"}
							className="flex-1"
							onClick={() => setIsAnonymous(false)}
						>
							<Unlock className="h-4 w-4 mr-2" />
							Respuestas Identificadas
						</Button>
					</div>
					<p className="text-sm text-muted-foreground mt-3">
						{isAnonymous
							? "Tus compañeros podrán responder sin que sepas quién dijo qué. Esto fomenta respuestas más honestas."
							: "Podrás ver quién envió cada respuesta. Útil para conversaciones de seguimiento."}
					</p>
				</CardContent>
			</Card>

			{/* Teammate Selection */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Selecciona Compañeros ({selectedIds.size}/5)
					</CardTitle>
					<CardDescription>
						Elige entre 3 y 5 compañeros para solicitar feedback
					</CardDescription>
				</CardHeader>
				<CardContent>
					{availableTeammates.length === 0 ? (
						<div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted rounded-lg">
							<AlertCircle className="h-5 w-5" />
							<p>
								No hay compañeros disponibles para solicitar feedback en este
								momento.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{availableTeammates.map((teammate) => (
								<TeammateCard
									key={teammate.id}
									teammate={teammate}
									selected={selectedIds.has(teammate.id)}
									onToggle={() => toggleSelection(teammate.id)}
								/>
							))}
						</div>
					)}

					{/* Cooldown teammates */}
					{cooldownTeammates.length > 0 && (
						<div className="mt-6">
							<p className="text-sm font-medium text-muted-foreground mb-3">
								En periodo de espera (30 días)
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								{cooldownTeammates.map((teammate) => (
									<TeammateCard
										key={teammate.id}
										teammate={teammate}
										selected={false}
										disabled
										onToggle={() => {}}
									/>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Selection Summary & Submit */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					{selectedIds.size < 3 ? (
						<span className="text-destructive">
							Selecciona {3 - selectedIds.size} compañero(s) más
						</span>
					) : (
						<span className="text-primary">
							✓ Listo para enviar ({selectedIds.size} seleccionados)
						</span>
					)}
				</div>
				<Button
					onClick={handleSubmit}
					disabled={selectedIds.size < 3 || isPending}
					size="lg"
				>
					{isPending ? "Enviando..." : "Enviar Solicitudes"}
				</Button>
			</div>
		</div>
	);
}

/**
 * Individual teammate selection card
 */
interface TeammateCardProps {
	teammate: Teammate;
	selected: boolean;
	disabled?: boolean;
	onToggle: () => void;
}

function TeammateCard({
	teammate,
	selected,
	disabled,
	onToggle,
}: TeammateCardProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			disabled={disabled}
			className={cn(
				"flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
				selected && "border-primary bg-primary/5",
				!selected && !disabled && "hover:border-primary/50 hover:bg-muted/50",
				disabled && "opacity-50 cursor-not-allowed",
			)}
		>
			{/* Avatar */}
			<div className="relative">
				<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
					{teammate.image ? (
						<Image
							src={teammate.image}
							alt={teammate.name}
							width={40}
							height={40}
							className="h-full w-full object-cover"
						/>
					) : (
						<span className="text-sm font-medium">
							{teammate.name?.charAt(0)?.toUpperCase() || "?"}
						</span>
					)}
				</div>
				{selected && (
					<div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
						<Check className="h-3 w-3 text-primary-foreground" />
					</div>
				)}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<p className="font-medium truncate">{teammate.name}</p>
				<p className="text-xs text-muted-foreground truncate">
					{teammate.email}
				</p>
			</div>
		</button>
	);
}
