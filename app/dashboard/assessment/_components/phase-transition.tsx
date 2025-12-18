"use client";

/**
 * PhaseTransition Component
 * Shows phase completion summary, domain preview, XP earned, and transition animation
 */

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	CheckCircle2,
	ArrowRight,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { PhaseTransitionResult } from "@/lib/types/assessment.types";
import type { AwardXpResult } from "@/lib/types/gamification.types";
import XpRewardPreview from "./xp-reward-preview";

export interface PhaseTransitionProps {
	transition: PhaseTransitionResult;
	onContinue: () => void;
	isLoading?: boolean;
	/** XP earned for completing this phase */
	xpResult?: AwardXpResult;
	/** Whether this is a retake assessment */
	isRetake?: boolean;
}

const PHASE_INFO = {
	1: {
		title: "¡Descubrimiento de dominio completado!",
		description:
			"Hemos identificado tus inclinaciones naturales en 4 dominios clave.",
		nextTitle: "Refinamiento de fortalezas",
		nextDescription:
			"Ahora profundizaremos en tus áreas más fuertes para identificar fortalezas específicas.",
	},
	2: {
		title: "¡Refinamiento de fortalezas completado!",
		description: "Hemos reducido tus fortalezas más prominentes.",
		nextTitle: "Ranking final",
		nextDescription:
			"Ayúdanos a confirmar tus 5 fortalezas principales clasificándolas.",
	},
	3: {
		title: "¡Evaluación completada!",
		description: "¡Felicitaciones! Tu perfil de fortalezas está listo.",
		nextTitle: "Ver resultados",
		nextDescription:
			"Descubre tus 5 fortalezas principales únicas y obtén información personalizada.",
	},
};

const DOMAIN_COLORS: Record<string, string> = {
	doing: "bg-amber-500",
	thinking: "bg-blue-500",
	feeling: "bg-rose-500",
	motivating: "bg-emerald-500",
	// Fallback for unknown domains
	default: "bg-gray-500",
};

/**
 * Domain name translations
 */
const DOMAIN_LABELS: Record<string, string> = {
	doing: "Acción",
	thinking: "Pensamiento",
	feeling: "Sentimiento",
	motivating: "Motivación",
};

/**
 * Domain icons
 */
const DOMAIN_ICONS: Record<string, string> = {
	doing: "⚡",
	thinking: "💡",
	feeling: "❤️",
	motivating: "🚀",
};

/**
 * Get translated label for domain
 */
function getDomainLabel(domainName: string): string {
	const key = domainName.toLowerCase();
	return DOMAIN_LABELS[key] ?? domainName;
}

/**
 * Get icon for domain
 */
function getDomainIcon(domainName: string): string {
	const key = domainName.toLowerCase();
	return DOMAIN_ICONS[key] ?? "📊";
}

export default function PhaseTransition({
	transition,
	onContinue,
	isLoading = false,
	xpResult,
	isRetake = false,
}: PhaseTransitionProps) {
	const phaseInfo = PHASE_INFO[transition.completedPhase];
	const isComplete = transition.completedPhase === 3;

	return (
		<div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
			{/* Celebration header */}
			<div className="space-y-4 text-center">
				<div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
					{isComplete ? (
						<Sparkles className="text-primary h-8 w-8" />
					) : (
						<CheckCircle2 className="text-primary h-8 w-8" />
					)}
				</div>
				<h1 className="text-3xl font-bold">{phaseInfo.title}</h1>
				<p className="text-muted-foreground text-lg">{phaseInfo.description}</p>
			</div>

			{/* XP Earned Display */}
			{xpResult && (
				<Card className="border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-orange-950/30">
					<CardContent className="flex items-center justify-center gap-4 py-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
							<Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm text-muted-foreground">¡XP ganado!</span>
							<div className="flex items-baseline gap-2">
								<span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
									+{xpResult.xpAwarded} XP
								</span>
								{xpResult.streakMultiplier > 1 && (
									<span className="text-sm font-medium text-amber-600 dark:text-amber-400">
										(×{xpResult.streakMultiplier.toFixed(1)} racha)
									</span>
								)}
							</div>
							{xpResult.leveledUp && (
								<span className="text-sm font-semibold text-green-600 dark:text-green-400">
									¡Subiste al nivel {xpResult.newLevel}!
								</span>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Next phase XP preview (only if not complete and no xpResult shown) */}
			{!isComplete && transition.nextPhase && !xpResult && (
				<XpRewardPreview
					phase={transition.nextPhase}
					isRetake={isRetake}
					className="mx-auto max-w-md"
				/>
			)}

			{/* Domain scores (Phase 1) */}
			{transition.completedPhase === 1 && transition.topDomains && (
				<>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5 text-primary" />
								Tus afinidades de dominio
							</CardTitle>
							<CardDescription>
								Según tus respuestas, estos son tus dominios más fuertes
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{transition.topDomains.map((domain, index) => {
								const domainKey = domain.name.toLowerCase();
								const colorClass =
									DOMAIN_COLORS[domainKey] ?? DOMAIN_COLORS.default;

								return (
									<div key={domain.id} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-lg" aria-hidden="true">
													{getDomainIcon(domain.name)}
												</span>
												<span className="font-medium">
													{getDomainLabel(domain.name)}
												</span>
												{index === 0 && (
													<span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
														Principal
													</span>
												)}
											</div>
											<span className="text-muted-foreground text-sm">
												{Math.round(domain.score)}%
											</span>
										</div>
										<div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
											<div
												className={cn(
													"h-full rounded-full animate-bar-grow transition-all duration-500",
													colorClass,
												)}
												style={{ width: `${domain.score}%` }}
											/>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Phase 2 Preview - Which domains will be explored */}
					<Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-lg">
								<Target className="h-5 w-5 text-primary" />
								Lo que exploraremos a continuación
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-muted-foreground text-sm">
								En la siguiente fase, profundizaremos en tus dominios más
								fuertes para identificar tus fortalezas específicas:
							</p>
							<div className="flex flex-wrap gap-2">
								{transition.topDomains.slice(0, 3).map((domain) => {
									const domainKey = domain.name.toLowerCase();
									const colorClass =
										DOMAIN_COLORS[domainKey] ?? DOMAIN_COLORS.default;

									return (
										<div
											key={domain.id}
											className={cn(
												"flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white text-sm font-medium shadow-sm",
												colorClass,
											)}
										>
											<span aria-hidden="true">
												{getDomainIcon(domain.name)}
											</span>
											<span>{getDomainLabel(domain.name)}</span>
										</div>
									);
								})}
							</div>
							<p className="text-xs text-muted-foreground mt-2">
								Las preguntas serán personalizadas según tu perfil de dominio
							</p>
						</CardContent>
					</Card>
				</>
			)}

			{/* Preliminary strengths (Phase 2) */}
			{transition.completedPhase === 2 && transition.preliminaryStrengths && (
				<Card>
					<CardHeader>
						<CardTitle>Fortalezas emergentes</CardTitle>
						<CardDescription>
							Tus fortalezas principales preliminares antes del ranking final
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{transition.preliminaryStrengths
								.slice(0, 5)
								.map((strength, index) => (
									<div
										key={strength.id}
										className="flex items-center gap-3 rounded-lg border p-3"
									>
										<div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
											{index + 1}
										</div>
										<div className="flex-1">
											<p className="font-medium">{strength.name}</p>
										</div>
										<div className="text-muted-foreground text-sm">
											{Math.round(strength.score)}%
										</div>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Phase progress indicator */}
			<Card>
				<CardContent className="py-6">
					<div className="flex items-center justify-between gap-4">
						{[1, 2, 3].map((phase) => (
							<div
								key={phase}
								className="flex flex-1 flex-col items-center gap-2"
							>
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
										phase <= transition.completedPhase
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground",
									)}
								>
									{phase <= transition.completedPhase ? (
										<CheckCircle2 className="h-5 w-5" />
									) : (
										phase
									)}
								</div>
								<span
									className={cn(
										"text-xs",
										phase <= transition.completedPhase
											? "font-medium"
											: "text-muted-foreground",
									)}
								>
									Fase {phase}
								</span>
							</div>
						))}
					</div>
					<Progress
						value={(transition.completedPhase / 3) * 100}
						className="mt-4 h-2"
					/>
				</CardContent>
			</Card>

			{/* Next phase preview */}
			{!isComplete && transition.nextPhase && (
				<Card className="border-primary/20 bg-primary/5">
					<CardContent className="py-6">
						<div className="flex items-center gap-4">
							<ArrowRight className="text-primary h-6 w-6 shrink-0" />
							<div>
								<h3 className="font-semibold">
									Siguiente: {phaseInfo.nextTitle}
								</h3>
								<p className="text-muted-foreground text-sm">
									{phaseInfo.nextDescription}
								</p>
								{transition.nextPhasePreview && (
									<p className="text-primary mt-1 text-sm font-medium">
										{transition.nextPhasePreview}
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Continue button */}
			<div className="flex justify-center">
				<Button
					size="lg"
					onClick={onContinue}
					disabled={isLoading}
					className="min-w-[200px]"
				>
					{isLoading
						? "Cargando..."
						: isComplete
							? "Ver mis resultados"
							: `Continuar a la fase ${transition.nextPhase}`}
				</Button>
			</div>
		</div>
	);
}
