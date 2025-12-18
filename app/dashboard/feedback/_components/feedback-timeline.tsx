/**
 * Feedback Timeline Component
 *
 * Muestra una línea de tiempo visual de los ciclos de feedback
 */

"use client";

import { Calendar, Eye, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { FeedbackCycle } from "../_services/feedback-analysis.service";

interface FeedbackTimelineProps {
	cycles: FeedbackCycle[];
	selectedCycleId?: string;
	onSelectCycle?: (cycleId: string) => void;
}

/**
 * Formatea una fecha para mostrar en la UI
 */
function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}

/**
 * Formatea fecha relativa
 */
function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diffDays = Math.floor(
		(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (diffDays === 0) {
		return "Hoy";
	} else if (diffDays === 1) {
		return "Ayer";
	} else if (diffDays < 7) {
		return `Hace ${diffDays} días`;
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
	} else {
		return formatDate(date);
	}
}

export function FeedbackTimeline({
	cycles,
	selectedCycleId,
	onSelectCycle,
}: FeedbackTimelineProps) {
	if (cycles.length === 0) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">Sin historial aún</h3>
					<p className="text-muted-foreground">
						Cuando recibas feedback de tus compañeros, verás tu historial aquí.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="relative">
			{/* Línea vertical de timeline */}
			<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

			<div className="space-y-6">
				{cycles.map((cycle, index) => {
					const isSelected = selectedCycleId === cycle.id;
					const date = cycle.lastResponseAt || cycle.createdAt;

					return (
						<div key={cycle.id} className="relative pl-14">
							{/* Punto del timeline */}
							<div
								className={cn(
									"absolute left-4 w-5 h-5 rounded-full border-2 -translate-x-1/2",
									isSelected
										? "bg-primary border-primary"
										: "bg-background border-primary",
								)}
							/>

							{/* Etiqueta "Más reciente" */}
							{index === 0 && (
								<Badge
									variant="secondary"
									className="absolute left-0 -top-2 -translate-x-full mr-2 text-xs"
								>
									Más reciente
								</Badge>
							)}

							<Card
								className={cn(
									"transition-all cursor-pointer hover:shadow-md",
									isSelected && "ring-2 ring-primary",
								)}
								onClick={() => onSelectCycle?.(cycle.id)}
							>
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<CardTitle className="text-base flex items-center gap-2">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											{formatDate(date)}
										</CardTitle>
										<span className="text-sm text-muted-foreground">
											{formatRelativeDate(date)}
										</span>
									</div>
								</CardHeader>
								<CardContent className="pt-2">
									<div className="flex items-center gap-4 text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<Users className="h-4 w-4" />
											<span>
												{cycle.totalResponses}{" "}
												{cycle.totalResponses === 1
													? "respuesta"
													: "respuestas"}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<TrendingUp className="h-4 w-4" />
											<span>
												{cycle.strengthScores.length} fortalezas identificadas
											</span>
										</div>
									</div>

									{cycle.insights && (
										<p className="mt-3 text-sm line-clamp-2 text-muted-foreground">
											{cycle.insights.substring(0, 150)}...
										</p>
									)}

									<div className="mt-4 flex justify-end">
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												onSelectCycle?.(cycle.id);
											}}
										>
											<Eye className="h-4 w-4 mr-2" />
											Ver detalles
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>
					);
				})}
			</div>
		</div>
	);
}
