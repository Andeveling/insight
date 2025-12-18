"use client";

/**
 * Readiness Dashboard Component
 *
 * Main component that displays the complete readiness status including:
 * - Circular progress indicator with score
 * - List of requirements with progress
 * - Call-to-action when ready
 *
 * @feature 009-contextual-reports
 */

import { SparklesIcon, RocketIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

import type { IndividualReadiness } from "../_schemas/readiness.schema";
import { CircularProgress } from "./circular-progress";
import { ReadinessRequirement } from "./readiness-requirement";

interface ReadinessDashboardProps {
	readiness: IndividualReadiness;
	onGenerateReport?: () => void;
	isGenerating?: boolean;
	className?: string;
}

export function ReadinessDashboard({
	readiness,
	onGenerateReport,
	isGenerating = false,
	className,
}: ReadinessDashboardProps) {
	const { score, isReady, requirements, statusLabel, nextRecommendedAction } =
		readiness;

	// Count met and total requirements
	const metCount = requirements.filter((r) => r.met).length;
	const totalCount = requirements.length;

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2 text-xl">
					<SparklesIcon className="size-5 text-primary" />
					Estado de Preparación
				</CardTitle>
				<CardDescription>
					Completa los requisitos para generar tu reporte personalizado con
					insights basados en tu desarrollo real.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Progress section */}
				<div className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
					{/* Circular progress */}
					<div className="flex flex-col items-center gap-2">
						<CircularProgress
							value={score}
							label={statusLabel}
							showCelebration={isReady}
						/>
					</div>

					{/* Stats and CTA */}
					<div className="flex flex-1 flex-col items-center gap-4 sm:items-end">
						{/* Requirements summary */}
						<div className="text-center sm:text-right">
							<p className="text-sm text-muted-foreground">
								Requisitos completados
							</p>
							<p className="text-2xl font-bold">
								<span className={isReady ? "text-success" : "text-foreground"}>
									{metCount}
								</span>
								<span className="text-muted-foreground"> / {totalCount}</span>
							</p>
						</div>

						{/* Generate button (only when ready) */}
						{isReady && onGenerateReport && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.2 }}
							>
								<Button
									onClick={onGenerateReport}
									disabled={isGenerating}
									size="lg"
									className={cn(
										"gap-2 transition-all",
										!isGenerating && "animate-pulse hover:animate-none",
									)}
								>
									<RocketIcon className="size-5" />
									{isGenerating ? "Generando..." : "Generar Reporte"}
								</Button>
							</motion.div>
						)}

						{/* Next action hint (when not ready) */}
						{!isReady && nextRecommendedAction && (
							<p className="text-sm text-muted-foreground">
								<span className="font-medium text-primary">
									Siguiente paso:
								</span>{" "}
								{nextRecommendedAction.label}
							</p>
						)}
					</div>
				</div>

				{/* Requirements list */}
				<div className="space-y-3">
					<h4 className="text-sm font-medium text-muted-foreground">
						Requisitos
					</h4>
					<div className="space-y-2">
						{requirements.map((requirement) => (
							<ReadinessRequirement
								key={requirement.id}
								requirement={requirement}
							/>
						))}
					</div>
				</div>

				{/* Ready celebration message */}
				{isReady && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className="rounded-xl border border-success/30 bg-success/5 p-4 text-center"
					>
						<p className="font-medium text-success">
							🎉 ¡Felicidades! Tienes suficiente contexto para generar un
							reporte con insights significativos.
						</p>
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}
