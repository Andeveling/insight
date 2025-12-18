"use client";

/**
 * WelcomeScreen Component
 * Shows assessment overview, estimated time, XP rewards, and start button
 */

import { CheckCircle2, Clock, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import XpRewardPreview from "./xp-reward-preview";

export interface WelcomeScreenProps {
	onStart: () => void;
	isLoading?: boolean;
	hasExistingSession?: boolean;
	onResume?: () => void;
	/** Whether this is a retake (user has previous completed assessment) */
	isRetake?: boolean;
	/** Current streak multiplier for XP bonus preview */
	streakMultiplier?: number;
}

const FEATURES = [
	{
		icon: Target,
		title: "Descubre tus 5 fortalezas principales",
		description: "Identifica las habilidades únicas que definen tu potencial",
	},
	{
		icon: Zap,
		title: "Evaluación adaptativa",
		description:
			"Las preguntas se ajustan según tus respuestas para mayor precisión",
	},
	{
		icon: CheckCircle2,
		title: "Resultados detallados",
		description:
			"Obtén insights con puntajes de confianza y consejos de desarrollo",
	},
];

const PHASES = [
	{
		number: 1,
		title: "Descubrimiento de dominios",
		questions: 20,
		description: "Identifica tus inclinaciones naturales en 4 dominios",
	},
	{
		number: 2,
		title: "Refinamiento de fortalezas",
		questions: 30,
		description: "Profundiza en tus dominios más fuertes",
	},
	{
		number: 3,
		title: "Ranking final",
		questions: 10,
		description: "Confirma y ordena tus principales fortalezas",
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
				<h1 className="text-4xl font-bold tracking-tight">
					Descubre tus fortalezas
				</h1>
				<p className="text-muted-foreground text-lg">
					Realiza nuestra evaluación integral para descubrir tus fortalezas
					únicas y desbloquear tu máximo potencial.
				</p>
			</div>

			{/* Time estimate */}
			<Card className="border-primary/20 bg-primary/5">
				<CardContent className="flex items-center justify-center gap-3 py-4">
					<Clock className="text-primary h-5 w-5" />
					<span className="text-muted-foreground">
						<strong className="text-foreground">15-20 minutos</strong> para
						completar
					</span>
				</CardContent>
			</Card>

			{/* XP Reward Preview */}
			<XpRewardPreview
				isRetake={isRetake}
				streakMultiplier={streakMultiplier}
				className="mx-auto max-w-md"
			/>

			{/* Features */}
			<div className="grid gap-4 md:grid-cols-3">
				{FEATURES.map((feature) => (
					<Card key={feature.title}>
						<CardContent className="pt-6">
							<div className="flex flex-col items-center space-y-3 text-center">
								<div className="bg-primary/10 rounded-full p-3">
									<feature.icon className="text-primary h-6 w-6" />
								</div>
								<h3 className="font-semibold">{feature.title}</h3>
								<p className="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Assessment phases */}
			<Card>
				<CardHeader>
					<CardTitle>¿Cómo funciona?</CardTitle>
					<CardDescription>
						La evaluación consta de 3 fases progresivas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{PHASES.map((phase, index) => (
							<div key={phase.number} className="flex items-start gap-4">
								<div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
									{phase.number}
								</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-center gap-2">
										<h4 className="font-medium">{phase.title}</h4>
										<span className="text-muted-foreground text-xs">
											({phase.questions} preguntas)
										</span>
									</div>
									<p className="text-muted-foreground text-sm">
										{phase.description}
									</p>
								</div>
								{index < PHASES.length - 1 && (
									<div className="bg-border absolute left-4 h-8 w-px translate-y-8" />
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Action buttons */}
			<div className="flex flex-col items-center gap-4">
				{hasExistingSession && onResume ? (
					<>
						<Button
							size="lg"
							onClick={onResume}
							disabled={isLoading}
							className="w-full max-w-xs"
						>
							Continuar evaluación
						</Button>
						<Button
							variant="outline"
							size="lg"
							onClick={onStart}
							disabled={isLoading}
							className="w-full max-w-xs"
						>
							Comenzar desde cero
						</Button>
					</>
				) : (
					<Button
						size="lg"
						onClick={onStart}
						disabled={isLoading}
						className="w-full max-w-xs"
					>
						{isLoading ? "Iniciando..." : "Comenzar evaluación"}
					</Button>
				)}

				<p className="text-muted-foreground text-center text-sm">
					Tu progreso se guarda automáticamente. Puedes pausar y continuar en
					cualquier momento.
				</p>
			</div>
		</div>
	);
}
