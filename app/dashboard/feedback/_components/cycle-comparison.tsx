/**
 * Cycle Comparison Component
 *
 * Permite comparar dos ciclos de feedback y ver los cambios
 */

"use client";

import {
	ArrowRight,
	GitCompare,
	Minus,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { FeedbackCycle } from "../_services/feedback-analysis.service";

interface CycleComparisonProps {
	cycles: FeedbackCycle[];
	onCompare?: (cycleId1: string, cycleId2: string) => void;
	comparisonResult?: {
		cycle1: FeedbackCycle;
		cycle2: FeedbackCycle;
		changes: Array<{
			strengthKey: string;
			score1: number;
			score2: number;
			delta: number;
			trend: "up" | "down" | "stable";
		}>;
	} | null;
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
 * Formatea el score para mostrar como porcentaje
 */
function formatScore(score: number): string {
	return `${Math.round(score * 100)}%`;
}

export function CycleComparison({
	cycles,
	onCompare,
	comparisonResult,
}: CycleComparisonProps) {
	const [selectedCycle1, setSelectedCycle1] = useState<string>(
		cycles[0]?.id || "",
	);
	const [selectedCycle2, setSelectedCycle2] = useState<string>(
		cycles[1]?.id || "",
	);

	if (cycles.length < 2) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<GitCompare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						Comparación no disponible
					</h3>
					<p className="text-muted-foreground">
						Necesitas al menos 2 ciclos de feedback para poder compararlos.
					</p>
				</CardContent>
			</Card>
		);
	}

	const handleCompare = () => {
		if (selectedCycle1 && selectedCycle2 && selectedCycle1 !== selectedCycle2) {
			onCompare?.(selectedCycle1, selectedCycle2);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<GitCompare className="h-5 w-5" />
					Comparar Períodos
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Selectores de ciclos */}
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<label className="text-sm font-medium mb-2 block">
							Período más antiguo
						</label>
						<Select value={selectedCycle2} onValueChange={setSelectedCycle2}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un período" />
							</SelectTrigger>
							<SelectContent>
								{cycles.map((cycle) => (
									<SelectItem
										key={cycle.id}
										value={cycle.id}
										disabled={cycle.id === selectedCycle1}
									>
										{formatDate(cycle.lastResponseAt || cycle.createdAt)} (
										{cycle.totalResponses} respuestas)
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />

					<div className="flex-1">
						<label className="text-sm font-medium mb-2 block">
							Período más reciente
						</label>
						<Select value={selectedCycle1} onValueChange={setSelectedCycle1}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un período" />
							</SelectTrigger>
							<SelectContent>
								{cycles.map((cycle) => (
									<SelectItem
										key={cycle.id}
										value={cycle.id}
										disabled={cycle.id === selectedCycle2}
									>
										{formatDate(cycle.lastResponseAt || cycle.createdAt)} (
										{cycle.totalResponses} respuestas)
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<Button
					onClick={handleCompare}
					disabled={
						!selectedCycle1 ||
						!selectedCycle2 ||
						selectedCycle1 === selectedCycle2
					}
					className="w-full"
				>
					<GitCompare className="h-4 w-4 mr-2" />
					Comparar Períodos
				</Button>

				{/* Resultados de la comparación */}
				{comparisonResult && (
					<div className="pt-4 border-t space-y-4">
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>
								Comparando:{" "}
								{formatDate(
									comparisonResult.cycle2.lastResponseAt ||
										comparisonResult.cycle2.createdAt,
								)}
							</span>
							<ArrowRight className="h-4 w-4" />
							<span>
								{formatDate(
									comparisonResult.cycle1.lastResponseAt ||
										comparisonResult.cycle1.createdAt,
								)}
							</span>
						</div>

						{/* Lista de cambios */}
						<div className="space-y-3">
							{comparisonResult.changes
								.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
								.map((change) => (
									<div
										key={change.strengthKey}
										className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
									>
										<div className="flex items-center gap-3">
											{change.trend === "up" && (
												<TrendingUp className="h-5 w-5 text-green-600" />
											)}
											{change.trend === "down" && (
												<TrendingDown className="h-5 w-5 text-orange-600" />
											)}
											{change.trend === "stable" && (
												<Minus className="h-5 w-5 text-muted-foreground" />
											)}
											<span className="font-medium">{change.strengthKey}</span>
										</div>

										<div className="flex items-center gap-4">
											<span className="text-sm text-muted-foreground">
												{formatScore(change.score2)}
											</span>
											<ArrowRight className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">
												{formatScore(change.score1)}
											</span>
											<Badge
												variant={
													change.trend === "stable"
														? "secondary"
														: change.trend === "up"
															? "default"
															: "destructive"
												}
												className={cn(
													"min-w-[60px] justify-center",
													change.trend === "up" &&
														"bg-green-100 text-green-700 hover:bg-green-100",
													change.trend === "down" &&
														"bg-orange-100 text-orange-700 hover:bg-orange-100",
												)}
											>
												{change.delta > 0 ? "+" : ""}
												{formatScore(change.delta)}
											</Badge>
										</div>
									</div>
								))}
						</div>

						{/* Resumen */}
						<div className="flex gap-4 pt-4 border-t">
							<div className="flex-1 text-center p-3 rounded-lg bg-green-50">
								<div className="text-2xl font-bold text-green-600">
									{
										comparisonResult.changes.filter((c) => c.trend === "up")
											.length
									}
								</div>
								<div className="text-sm text-green-700">Mejorando</div>
							</div>
							<div className="flex-1 text-center p-3 rounded-lg bg-blue-50">
								<div className="text-2xl font-bold text-blue-600">
									{
										comparisonResult.changes.filter((c) => c.trend === "stable")
											.length
									}
								</div>
								<div className="text-sm text-blue-700">Estables</div>
							</div>
							<div className="flex-1 text-center p-3 rounded-lg bg-orange-50">
								<div className="text-2xl font-bold text-orange-600">
									{
										comparisonResult.changes.filter((c) => c.trend === "down")
											.length
									}
								</div>
								<div className="text-sm text-orange-700">Declinando</div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
