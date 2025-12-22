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
		color: "bg-chart-2",
		textColor: "text-chart-2",
	},
	{
		number: 2,
		title: "Refinamiento de fortalezas",
		questions: 30,
		description: "Profundiza en tus dominios más fuertes",
		color: "bg-primary",
		textColor: "text-primary",
	},
	{
		number: 3,
		title: "Ranking final",
		questions: 10,
		description: "Confirma y ordena tus principales fortalezas",
		color: "bg-chart-5",
		textColor: "text-chart-5",
	},
	{
		number: 4,
		title: "Calibración Heroica",
		questions: 5,
		description: "Determina la madurez de tus fortalezas",
		color: "bg-chart-4",
		textColor: "text-chart-4",
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
			<div className="space-y-6 text-center pt-8">
				<div className="space-y-2">
					<div className="inline-block px-3 py-1 bg-chart-2/10 border border-chart-2/20 text-chart-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm mb-4">
						Protocolo de Evaluación de Personalidad
					</div>
					<h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-7xl">
						DESCUBRE TUS{" "}
						<span className="bg-linear-to-r from-chart-2 to-chart-5 bg-clip-text text-transparent">
							FORTALEZAS
						</span>
					</h1>
				</div>
				<p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed">
					Iniciando escaneo de potencial humano. Nuestra IA analizará tus
					patrones de comportamiento para identificar tus ventajas competitivas.
				</p>
			</div>

			{/* Time estimate */}
			<div
				className="p-px bg-linear-to-r from-primary/20 via-primary/50 to-primary/20 group"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				<div
					className="bg-background/90 backdrop-blur-sm py-4 px-6 flex items-center justify-center gap-4"
					style={{
						clipPath:
							"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
					}}
				>
					<div className="flex items-center gap-3">
						<Clock className="text-primary h-5 w-5 animate-pulse" />
						<span className="text-muted-foreground uppercase tracking-widest text-[11px] font-black">
							Tiempo estimado de ejecución:{" "}
							<strong className="text-primary">15-20 MINUTOS</strong>
						</span>
					</div>
				</div>
			</div>

			{/* XP Reward Preview */}
			<XpRewardPreview
				isRetake={isRetake}
				streakMultiplier={streakMultiplier}
				className="mx-auto max-w-md"
			/>

			{/* Features */}
			<div className="grid gap-4 md:grid-cols-3">
				{FEATURES.map((feature) => (
					<div
						key={feature.title}
						className="p-px bg-border hover:bg-muted transition-colors duration-500"
						style={{
							clipPath:
								"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
						}}
					>
						<div
							className="bg-background/90 p-6 flex flex-col items-center space-y-4 text-center h-full"
							style={{
								clipPath:
									"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
							}}
						>
							<div className="p-4 bg-muted border border-border rounded-sm">
								<feature.icon className={`h-6 w-6 ${feature.color}`} />
							</div>
							<div className="space-y-2">
								<h3 className="font-black text-foreground uppercase text-xs tracking-wider">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Assessment phases */}
			<div
				className="p-px bg-border"
				style={{
					clipPath:
						"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
				}}
			>
				<div
					className="bg-background p-6 sm:p-8"
					style={{
						clipPath:
							"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
					}}
				>
					<div className="flex flex-col gap-1 mb-8">
						<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
							Estructura de la Misión
						</h3>
						<p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
							Procedimiento de evaluación secuencial
						</p>
					</div>

					<div className="space-y-6">
						{PHASES.map((phase) => (
							<div key={phase.number} className="flex items-start gap-6 group">
								<div
									className={`flex h-10 w-10 shrink-0 items-center justify-center text-xs font-black text-black ${phase.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
									style={{
										clipPath:
											"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
									}}
								>
									{phase.number}
								</div>
								<div className="flex-1 space-y-2">
									<div className="flex flex-wrap items-center gap-3">
										<h4 className="font-bold text-foreground uppercase text-sm tracking-wide">
											{phase.title}
										</h4>
										<div className="px-2 py-0.5 bg-muted border border-border text-muted-foreground text-[9px] font-black uppercase tracking-tighter">
											{phase.questions} MUESTRAS
										</div>
									</div>
									<p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
										{phase.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

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
