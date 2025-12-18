/**
 * History Content Component
 *
 * Componente cliente para el contenido interactivo del historial de feedback
 */

"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import {
	History,
	TrendingUp,
	GitCompare,
	CheckCircle,
	XCircle,
	Clock,
	Download,
	FileText,
	FileJson,
} from "lucide-react";
import { FeedbackTimeline } from "../_components/feedback-timeline";
import { StrengthTrends } from "../_components/strength-trends";
import { CycleComparison } from "../_components/cycle-comparison";
import { compareCyclesAction } from "../_actions/feedback-history.actions";
import { exportHistory, type ExportFormat } from "../_utils/history-export";
import type {
	FeedbackCycle,
	StrengthTrend,
} from "../_services/feedback-analysis.service";

interface HistoryContentProps {
	cycles: FeedbackCycle[];
	trends: StrengthTrend[];
	userName?: string;
	adjustmentHistory: Array<{
		id: string;
		strengthId: string;
		suggestedDelta: number;
		status: string;
		supportingData: string;
		createdAt: Date;
		processedAt: Date | null;
		strength: {
			id: string;
			name: string;
		};
	}>;
}

export function HistoryContent({
	cycles,
	trends,
	userName = "Usuario",
	adjustmentHistory,
}: HistoryContentProps) {
	const [selectedCycleId, setSelectedCycleId] = useState<string | undefined>(
		cycles[0]?.id,
	);
	const [comparisonResult, setComparisonResult] = useState<{
		cycle1: FeedbackCycle;
		cycle2: FeedbackCycle;
		changes: Array<{
			strengthKey: string;
			score1: number;
			score2: number;
			delta: number;
			trend: "up" | "down" | "stable";
		}>;
	} | null>(null);
	const [, startTransition] = useTransition();

	const handleCompare = (cycleId1: string, cycleId2: string) => {
		startTransition(async () => {
			const result = await compareCyclesAction(cycleId1, cycleId2);
			if (result.success && result.data) {
				setComparisonResult(result.data);
			}
		});
	};

	const handleExport = (format: ExportFormat) => {
		exportHistory(
			{
				cycles,
				trends,
				generatedAt: new Date(),
				userName,
			},
			format,
		);
	};

	return (
		<div className="space-y-6">
			{/* Export buttons */}
			<div className="flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							<Download className="h-4 w-4 mr-2" />
							Exportar
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleExport("csv")}>
							<FileText className="h-4 w-4 mr-2" />
							Exportar como CSV
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleExport("json")}>
							<FileJson className="h-4 w-4 mr-2" />
							Exportar como JSON
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Tabs defaultValue="timeline" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="timeline" className="flex items-center gap-2">
						<History className="h-4 w-4" />
						<span className="hidden sm:inline">Línea de Tiempo</span>
						<span className="sm:hidden">Tiempo</span>
					</TabsTrigger>
					<TabsTrigger value="trends" className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4" />
						<span className="hidden sm:inline">Tendencias</span>
						<span className="sm:hidden">Tendencias</span>
					</TabsTrigger>
					<TabsTrigger value="compare" className="flex items-center gap-2">
						<GitCompare className="h-4 w-4" />
						<span className="hidden sm:inline">Comparar</span>
						<span className="sm:hidden">Comparar</span>
					</TabsTrigger>
				</TabsList>

				{/* Línea de Tiempo */}
				<TabsContent value="timeline" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Timeline */}
						<div className="lg:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<History className="h-5 w-5" />
										Ciclos de Feedback
									</CardTitle>
								</CardHeader>
								<CardContent>
									<FeedbackTimeline
										cycles={cycles}
										selectedCycleId={selectedCycleId}
										onSelectCycle={setSelectedCycleId}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Historial de Ajustes */}
						<div>
							<Card>
								<CardHeader>
									<CardTitle className="text-base">
										Historial de Ajustes
									</CardTitle>
								</CardHeader>
								<CardContent>
									{adjustmentHistory.length === 0 ? (
										<p className="text-sm text-muted-foreground text-center py-4">
											Sin ajustes de perfil registrados
										</p>
									) : (
										<div className="space-y-3">
											{adjustmentHistory.slice(0, 10).map((adjustment) => (
												<div
													key={adjustment.id}
													className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
												>
													<div className="flex items-center gap-2">
														{adjustment.status === "ACCEPTED" ? (
															<CheckCircle className="h-4 w-4 text-green-600" />
														) : adjustment.status === "REJECTED" ? (
															<XCircle className="h-4 w-4 text-red-600" />
														) : (
															<Clock className="h-4 w-4 text-yellow-600" />
														)}
														<span className="text-sm font-medium">
															{adjustment.strength.name}
														</span>
													</div>
													<Badge
														variant="outline"
														className={cn(
															"text-xs",
															adjustment.suggestedDelta > 0
																? "text-green-600"
																: "text-orange-600",
														)}
													>
														{adjustment.suggestedDelta > 0 ? "+" : ""}
														{adjustment.suggestedDelta}%
													</Badge>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Resumen estadístico */}
							<Card className="mt-4">
								<CardHeader>
									<CardTitle className="text-base">Resumen</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4">
										<div className="text-center p-3 rounded-lg bg-primary/10">
											<div className="text-2xl font-bold text-primary">
												{cycles.length}
											</div>
											<div className="text-xs text-muted-foreground">
												Ciclos de feedback
											</div>
										</div>
										<div className="text-center p-3 rounded-lg bg-green-100">
											<div className="text-2xl font-bold text-green-700">
												{cycles.reduce((sum, c) => sum + c.totalResponses, 0)}
											</div>
											<div className="text-xs text-muted-foreground">
												Respuestas totales
											</div>
										</div>
										<div className="text-center p-3 rounded-lg bg-blue-100">
											<div className="text-2xl font-bold text-blue-700">
												{
													adjustmentHistory.filter(
														(a) => a.status === "ACCEPTED",
													).length
												}
											</div>
											<div className="text-xs text-muted-foreground">
												Ajustes aceptados
											</div>
										</div>
										<div className="text-center p-3 rounded-lg bg-purple-100">
											<div className="text-2xl font-bold text-purple-700">
												{trends.filter((t) => t.trend === "improving").length}
											</div>
											<div className="text-xs text-muted-foreground">
												Fortalezas mejorando
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</TabsContent>

				{/* Tendencias */}
				<TabsContent value="trends">
					<StrengthTrends trends={trends} />
				</TabsContent>

				{/* Comparación */}
				<TabsContent value="compare">
					<CycleComparison
						cycles={cycles}
						onCompare={handleCompare}
						comparisonResult={comparisonResult}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
