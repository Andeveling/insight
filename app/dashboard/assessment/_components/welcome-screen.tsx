"use client";

/**
 * WelcomeScreen Component - CyberPunk Style
 * Shows assessment overview, estimated time, XP rewards, and start button
 */

import {
	CheckCircle2,
	Clock,
	Play,
	RotateCcw,
	Target,
	Zap,
} from "lucide-react";
import { CyberBadge, CyberButton, CyberCard } from "@/components/cyber-ui";
import XpRewardPreview from "./xp-reward-preview";

export interface WelcomeScreenProps {
	onStart: () => void;
	isLoading?: boolean;
	hasExistingSession?: boolean;
	onResume?: () => void;
	isRetake?: boolean;
	streakMultiplier?: number;
}

const FEATURES = [
	{
		icon: Target,
		title: "Descubre tus 5 fortalezas",
		description: "Identifica las habilidades únicas que definen tu potencial",
		color: "text-emerald-400",
	},
	{
		icon: Zap,
		title: "Evaluación adaptativa",
		description: "Las preguntas se ajustan según tus respuestas",
		color: "text-amber-400",
	},
	{
		icon: CheckCircle2,
		title: "Resultados detallados",
		description: "Obtén insights con puntajes de confianza",
		color: "text-indigo-400",
	},
];

const PHASES = [
	{
		number: 1,
		title: "Descubrimiento de dominios",
		questions: 20,
		description: "Identifica tus inclinaciones naturales en 4 dominios",
		color: "bg-blue-500",
	},
	{
		number: 2,
		title: "Refinamiento de fortalezas",
		questions: 30,
		description: "Profundiza en tus dominios más fuertes",
		color: "bg-amber-500",
	},
	{
		number: 3,
		title: "Ranking final",
		questions: 10,
		description: "Confirma y ordena tus principales fortalezas",
		color: "bg-emerald-500",
	},
];

export default function WelcomeScreen({
	onStart,
	isLoading = false,
	hasExistingSession = false,
	onResume,
	isRetake = false,
	streakMultiplier = 1,
}: WelcomeScreenProps) {
	return (
		<div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<h1 className="text-4xl font-bold tracking-tight text-white">
					Descubre tus <span className="text-emerald-400">fortalezas</span>
				</h1>
				<p className="text-zinc-400 text-lg max-w-xl mx-auto">
					Realiza nuestra evaluación para descubrir tus fortalezas únicas y
					desbloquear tu máximo potencial.
				</p>
			</div>

			{/* Time estimate */}
			<CyberCard variant="glow">
				<div className="flex items-center justify-center gap-3 py-2">
					<Clock className="text-emerald-400 h-5 w-5" />
					<span className="text-zinc-300">
						<strong className="text-white">15-20 minutos</strong> para completar
					</span>
				</div>
			</CyberCard>

			{/* XP Reward Preview */}
			<XpRewardPreview
				isRetake={isRetake}
				streakMultiplier={streakMultiplier}
				className="mx-auto max-w-md"
			/>

			{/* Features */}
			<div className="grid gap-4 md:grid-cols-3">
				{FEATURES.map((feature) => (
					<CyberCard key={feature.title} variant="default">
						<div className="flex flex-col items-center space-y-3 text-center py-2">
							<div className="p-3 border border-zinc-800 bg-zinc-900/50 rounded-lg">
								<feature.icon className={`h-6 w-6 ${feature.color}`} />
							</div>
							<h3 className="font-bold text-white">{feature.title}</h3>
							<p className="text-zinc-400 text-sm">{feature.description}</p>
						</div>
					</CyberCard>
				))}
			</div>

			{/* Assessment phases */}
			<CyberCard variant="default">
				<h3 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
					¿Cómo funciona?
				</h3>
				<p className="text-zinc-400 text-sm mb-6">
					La evaluación consta de 3 fases progresivas
				</p>

				<div className="space-y-4">
					{PHASES.map((phase) => (
						<div key={phase.number} className="flex items-start gap-4">
							<div
								className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold text-white ${phase.color}`}
								style={{
									clipPath:
										"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
								}}
							>
								{phase.number}
							</div>
							<div className="flex-1 space-y-1">
								<div className="flex items-center gap-2">
									<h4 className="font-bold text-zinc-200">{phase.title}</h4>
									<CyberBadge variant="zinc">
										{phase.questions} preguntas
									</CyberBadge>
								</div>
								<p className="text-sm text-zinc-500">{phase.description}</p>
							</div>
						</div>
					))}
				</div>
			</CyberCard>

			{/* Action buttons */}
			<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
				{hasExistingSession && onResume && (
					<CyberButton
						variant="secondary"
						size="lg"
						onClick={onResume}
						disabled={isLoading}
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Continuar Sesión
					</CyberButton>
				)}
				<CyberButton
					variant="primary"
					size="lg"
					onClick={onStart}
					disabled={isLoading}
				>
					<Play className="w-4 h-4 mr-2" />
					{hasExistingSession ? "Comenzar Nueva" : "Comenzar Evaluación"}
				</CyberButton>
			</div>
		</div>
	);
}
