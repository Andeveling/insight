"use client";

/**
 * Team Readiness Dashboard Component
 *
 * Main component that displays the team readiness status including:
 * - Overall team score
 * - Team requirements status
 * - Member breakdown with individual readiness
 * - Call-to-action for team leader
 *
 * @feature 009-contextual-reports
 */

import { RocketIcon, SparklesIcon, Users2Icon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";

import type { TeamReadiness } from "../_schemas/readiness.schema";
import { CircularProgress } from "./circular-progress";
import { ReadinessRequirement } from "./readiness-requirement";
import { TeamMemberReadiness } from "./team-member-readiness";

interface TeamReadinessDashboardProps {
	readiness: TeamReadiness;
	onGenerateReport?: () => void;
	isGenerating?: boolean;
	className?: string;
}

export function TeamReadinessDashboard({
	readiness,
	onGenerateReport,
	isGenerating = false,
	className,
}: TeamReadinessDashboardProps) {
	const { score, isReady, requirements, memberBreakdown, teamName } = readiness;

	// Count ready members
	const readyMemberCount = memberBreakdown.filter((m) => m.isReady).length;
	const totalMemberCount = memberBreakdown.length;

	// Sort members by score (ready first)
	const sortedMembers = [...memberBreakdown].sort(
		(a, b) => b.individualScore - a.individualScore,
	);

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Users2Icon className="size-5 text-primary" />
					Estado del Equipo: {teamName}
				</CardTitle>
				<CardDescription>
					Para generar un reporte de equipo, al menos el 60% de los miembros
					debe tener suficiente actividad de desarrollo.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Progress section */}
				<div className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
					{/* Circular progress */}
					<div className="flex flex-col items-center gap-2">
						<CircularProgress
							value={score}
							label={isReady ? "¡Listo!" : `${score}% miembros listos`}
							showCelebration={isReady}
						/>
					</div>

					{/* Stats and CTA */}
					<div className="flex flex-1 flex-col items-center gap-4 sm:items-end">
						{/* Members summary */}
						<div className="text-center sm:text-right">
							<p className="text-sm text-muted-foreground">Miembros listos</p>
							<p className="text-2xl font-bold">
								<span className={isReady ? "text-success" : "text-foreground"}>
									{readyMemberCount}
								</span>
								<span className="text-muted-foreground">
									{" "}
									/ {totalMemberCount}
								</span>
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
									{isGenerating ? "Generando..." : "Generar Reporte de Equipo"}
								</Button>
							</motion.div>
						)}

						{/* Not ready message */}
						{!isReady && (
							<p className="text-sm text-muted-foreground max-w-xs text-right">
								Invita a los miembros con bajo progreso a completar más módulos
								y desafíos.
							</p>
						)}
					</div>
				</div>

				{/* Team Requirements */}
				<div className="space-y-3">
					<h4 className="text-sm font-medium text-muted-foreground">
						Requisitos del Equipo
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

				<Separator />

				{/* Member Breakdown */}
				<div className="space-y-3">
					<h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
						<SparklesIcon className="size-4" />
						Progreso de Miembros
					</h4>
					<ScrollArea className="h-[280px] pr-4">
						<div className="space-y-1 divide-y divide-border/50">
							{sortedMembers.map((member) => (
								<TeamMemberReadiness key={member.userId} member={member} />
							))}
						</div>
					</ScrollArea>
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
							🎉 ¡El equipo está listo! Genera un reporte para descubrir las
							fortalezas colectivas y patrones de desarrollo.
						</p>
					</motion.div>
				)}
			</CardContent>
		</Card>
	);
}
