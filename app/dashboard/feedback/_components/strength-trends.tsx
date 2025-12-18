/**
 * Strength Trends Visualization Component
 *
 * Muestra las tendencias de fortalezas a lo largo del tiempo
 * Identifica fortalezas estables vs. en evolución
 */

"use client";

import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { StrengthTrend } from "../_services/feedback-analysis.service";

interface StrengthTrendsProps {
	trends: StrengthTrend[];
}

/**
 * Mapea el tipo de tendencia a su configuración visual
 */
function getTrendConfig(trend: StrengthTrend["trend"]) {
	switch (trend) {
		case "improving":
			return {
				icon: TrendingUp,
				label: "Mejorando",
				color: "text-green-600",
				bgColor: "bg-green-100",
				description: "Tus compañeros perciben esta fortaleza cada vez más",
			};
		case "declining":
			return {
				icon: TrendingDown,
				label: "Declinando",
				color: "text-orange-600",
				bgColor: "bg-orange-100",
				description: "Esta fortaleza se percibe menos con el tiempo",
			};
		case "stable":
			return {
				icon: Minus,
				label: "Estable",
				color: "text-blue-600",
				bgColor: "bg-blue-100",
				description: "Consistente a lo largo del tiempo",
			};
		case "variable":
			return {
				icon: Activity,
				label: "Variable",
				color: "text-purple-600",
				bgColor: "bg-purple-100",
				description: "La percepción varía según el contexto",
			};
	}
}

/**
 * Formatea el score para mostrar como porcentaje
 */
function formatScore(score: number): string {
	return `${Math.round(score * 100)}%`;
}

export function StrengthTrends({ trends }: StrengthTrendsProps) {
	if (trends.length === 0) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">Sin tendencias aún</h3>
					<p className="text-muted-foreground">
						Necesitas más ciclos de feedback para ver tendencias.
					</p>
				</CardContent>
			</Card>
		);
	}

	// Separar por tipo de tendencia
	const stableStrengths = trends.filter((t) => t.trend === "stable");
	const evolvingStrengths = trends.filter((t) => t.trend !== "stable");

	return (
		<div className="space-y-6">
			{/* Fortalezas estables */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Minus className="h-5 w-5 text-blue-600" />
						Fortalezas Estables
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Estas fortalezas son consistentemente percibidas por tus compañeros
					</p>
				</CardHeader>
				<CardContent>
					{stableStrengths.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Aún no hay fortalezas identificadas como estables
						</p>
					) : (
						<div className="space-y-4">
							{stableStrengths.map((trend) => (
								<TrendItem key={trend.strengthKey} trend={trend} />
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Fortalezas en evolución */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<Activity className="h-5 w-5 text-purple-600" />
						Fortalezas en Evolución
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Estas fortalezas muestran cambios a lo largo del tiempo
					</p>
				</CardHeader>
				<CardContent>
					{evolvingStrengths.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No hay fortalezas con cambios significativos aún
						</p>
					) : (
						<div className="space-y-4">
							{evolvingStrengths.map((trend) => (
								<TrendItem key={trend.strengthKey} trend={trend} />
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * Item individual de tendencia
 */
function TrendItem({ trend }: { trend: StrengthTrend }) {
	const config = getTrendConfig(trend.trend);
	const Icon = config.icon;

	// Calcular el score actual (último punto de datos)
	const currentScore =
		trend.dataPoints.length > 0
			? trend.dataPoints[trend.dataPoints.length - 1].score
			: 0;

	// Calcular cambio desde el primer punto
	const firstScore = trend.dataPoints[0]?.score || 0;
	const change = currentScore - firstScore;

	return (
		<TooltipProvider>
			<div className="flex items-center gap-4">
				{/* Icono de tendencia */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={cn(
								"flex items-center justify-center w-10 h-10 rounded-full",
								config.bgColor,
							)}
						>
							<Icon className={cn("h-5 w-5", config.color)} />
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>{config.description}</p>
					</TooltipContent>
				</Tooltip>

				{/* Información de la fortaleza */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-medium truncate">{trend.strengthName}</span>
						<Badge variant="outline" className={cn("text-xs", config.color)}>
							{config.label}
						</Badge>
					</div>

					{/* Barra de progreso */}
					<div className="flex items-center gap-2">
						<Progress value={currentScore * 100} className="h-2 flex-1" />
						<span className="text-sm font-medium w-12 text-right">
							{formatScore(currentScore)}
						</span>
					</div>

					{/* Mini gráfico de puntos */}
					{trend.dataPoints.length > 1 && (
						<div className="flex items-center gap-1 mt-2">
							<span className="text-xs text-muted-foreground mr-1">
								{trend.dataPoints.length} mediciones:
							</span>
							{trend.dataPoints.map((point, index) => (
								<Tooltip key={point.cycleId}>
									<TooltipTrigger asChild>
										<div
											className={cn(
												"w-2 h-2 rounded-full",
												index === trend.dataPoints.length - 1
													? "bg-primary"
													: "bg-muted-foreground/40",
											)}
										/>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{formatScore(point.score)} -{" "}
											{new Intl.DateTimeFormat("es-ES", {
												day: "numeric",
												month: "short",
											}).format(point.date)}
										</p>
									</TooltipContent>
								</Tooltip>
							))}
						</div>
					)}
				</div>

				{/* Cambio */}
				{trend.dataPoints.length > 1 && (
					<div
						className={cn(
							"text-sm font-medium",
							change > 0
								? "text-green-600"
								: change < 0
									? "text-orange-600"
									: "text-muted-foreground",
						)}
					>
						{change > 0 ? "+" : ""}
						{formatScore(change)}
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
