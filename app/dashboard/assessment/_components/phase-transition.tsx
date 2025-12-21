"use client";

/**
 * PhaseTransition Component
 * Shows phase completion summary, domain preview, XP earned, and transition animation
 */

import {
	ArrowRight,
	CheckCircle2,
	Sparkles,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

const DOMAIN_COLORS: Record<string, string> = {
	doing: "bg-chart-1 shadow-chart-1/20",
	thinking: "bg-chart-2 shadow-chart-2/20",
	feeling: "bg-rose-500 shadow-rose-500/20",
	motivating: "bg-chart-4 shadow-chart-4/20",
	default: "bg-muted shadow-muted/20",
};

export default function PhaseTransition({
	transition,
	onContinue,
	isLoading = false,
	xpResult,
	isRetake = false,
}: PhaseTransitionProps) {
	const phaseInfo = PHASE_INFO[transition.completedPhase];
	const isComplete = transition.completedPhase === 3;

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<div className="mx-auto max-w-2xl space-y-10 px-4 py-12">
			{/* Celebration header */}
			<div className="space-y-6 text-center">
				<div className="relative mx-auto h-24 w-24">
					<div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
					<div 
						className="relative flex h-full w-full items-center justify-center bg-background border border-primary/50 text-primary"
						style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
					>
						{isComplete ? (
							<Sparkles className="h-10 w-10" />
						) : (
							<CheckCircle2 className="h-10 w-10" />
						)}
					</div>
				</div>
				<div className="space-y-2">
					<h1 className="text-4xl font-black tracking-tighter text-foreground uppercase sm:text-5xl">
						{phaseInfo.title}
					</h1>
					<p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
						Sincronización de datos completada con éxito
					</p>
				</div>
			</div>

			{/* XP Earned Display */}
			{xpResult && (
				<div 
					className="p-px bg-linear-to-r from-primary/50 to-chart-1/50"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/90 backdrop-blur-md flex items-center justify-between gap-6 py-4 px-8"
						style={{ clipPath: clipPath16 }}
					>
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center bg-primary/10 border border-primary/20 text-primary">
								<Zap className="h-6 w-6" />
							</div>
							<div className="flex flex-col">
								<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recompensa Obtenida</span>
								<div className="flex items-baseline gap-2">
									<span className="text-3xl font-black text-primary tracking-tighter">
										+{xpResult.xpAwarded} XP
									</span>
									{xpResult.streakMultiplier > 1 && (
										<span className="text-[10px] font-black text-primary uppercase tracking-tighter px-1.5 py-0.5 border border-primary/30">
											×{xpResult.streakMultiplier.toFixed(1)} Racha
										</span>
									)}
								</div>
							</div>
						</div>
						
						{xpResult.leveledUp && (
							<div className="flex flex-col items-end">
								<span className="text-[10px] font-black uppercase text-chart-2 animate-pulse">Nivel Superado</span>
								<span className="text-xl font-black text-foreground">LVL {xpResult.newLevel}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Domain scores (Phase 1) */}
			{transition.completedPhase === 1 && transition.topDomains && (
				<div 
					className="p-px bg-border"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/90 p-8 space-y-8"
						style={{ clipPath: clipPath16 }}
					>
						<div className="flex items-center gap-3">
							<TrendingUp className="h-5 w-5 text-chart-2" />
							<h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
								Perfil de Dominio Identificado
							</h3>
						</div>

						<div className="space-y-6">
							{transition.topDomains.map((domain, index) => {
								const domainKey = domain.name.toLowerCase();
								const colorClass =
									DOMAIN_COLORS[domainKey] ?? DOMAIN_COLORS.default;

								return (
									<div key={domain.id} className="space-y-3 group">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<span className="h-8 w-8 flex items-center justify-center bg-muted border border-border text-sm group-hover:border-muted-foreground/30 transition-colors" aria-hidden="true">
													{getDomainIcon(domain.name)}
												</span>
												<span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
													{getDomainLabel(domain.name)}
												</span>
												{index === 0 && (
													<span className="bg-chart-2 text-primary-foreground px-1.5 py-0.5 text-[8px] font-black uppercase">
														Dominante
													</span>
												)}
											</div>
											<span className="text-muted-foreground text-[10px] font-black">
												{Math.round(domain.score)}% // PRECISION
											</span>
										</div>
										<div className="h-1 w-full bg-muted overflow-hidden relative border-[0.5px] border-border">
											<div
												className={cn(
													"h-full animate-bar-grow transition-all duration-700 relative",
													colorClass.split(' ')[0],
												)}
												style={{ width: `${domain.score}%` }}
											>
												<div className="absolute inset-y-0 right-0 w-4 bg-white/20 blur-sm" />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{/* Preliminary strengths (Phase 2) */}
			{transition.completedPhase === 2 && transition.preliminaryStrengths && (
				<div 
					className="p-px bg-border"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/90 p-8 space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Fortalezas Emergentes</h3>
						<div className="space-y-3">
							{transition.preliminaryStrengths
								.slice(0, 5)
								.map((strength, index) => (
									<div
										key={strength.id}
										className="flex items-center gap-4 border-[0.5px] border-border bg-muted/50 p-4 group hover:bg-muted transition-colors"
										style={{ clipPath: clipPath8 }}
									>
										<div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-black">
											{index + 1}
										</div>
										<p className="flex-1 text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{strength.name}</p>
										<div className="text-muted-foreground text-[10px] font-black">
											{Math.round(strength.score)}%
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
			)}

			{/* Next Mission Preview */}
			{!isComplete && transition.nextPhase && (
				<div 
					className="p-px bg-linear-to-r from-emerald-500/30 to-indigo-500/30"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/90 p-8 flex items-start gap-6"
						style={{ clipPath: clipPath16 }}
					>
						<ArrowRight className="text-chart-2 h-6 w-6 shrink-0 animate-pulse mt-1" />
						<div className="space-y-2">
							<h3 className="text-xs font-black uppercase tracking-[0.3em] text-foreground">
								Siguiente Objetivo: {phaseInfo.nextTitle}
							</h3>
							<p className="text-muted-foreground text-[11px] font-medium leading-relaxed uppercase tracking-tighter">
								{phaseInfo.nextDescription}
							</p>
							{transition.nextPhasePreview && (
								<div className="inline-block mt-2 px-2 py-1 bg-chart-2/10 border border-chart-2/20 text-chart-2 text-[9px] font-black uppercase tracking-tighter">
									{transition.nextPhasePreview}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Continue button */}
			<div className="flex justify-center pt-6">
				<button
					onClick={onContinue}
					disabled={isLoading}
					className="relative px-12 py-4 font-black uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-50 group overflow-hidden text-chart-2"
					style={{ clipPath: clipPath8 }}
				>
					<div className="absolute inset-0 bg-chart-2 opacity-10 group-hover:opacity-20 transition-opacity" />
					<div className="absolute inset-x-0 bottom-0 h-0.5 bg-chart-2 transition-all duration-300 group-hover:h-full group-hover:opacity-10" />
					<span className="relative z-10 flex items-center gap-3 text-xs">
						{isLoading ? "Procesando..." : (
							<>
								{isComplete ? "Analizar Resultados" : "Continuar Protocolo"}
								<ArrowRight className="w-4 h-4" />
							</>
						)}
					</span>
				</button>
			</div>
		</div>
	);
}
