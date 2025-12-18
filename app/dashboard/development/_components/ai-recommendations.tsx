"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
	Sparkles,
	RefreshCw,
	ArrowRight,
	BookOpen,
	Target,
	TrendingUp,
	Lightbulb,
	Clock,
	Zap,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { refreshAIRecommendations } from "../_actions/get-ai-recommendations";
import type { ModuleRecommendation } from "@/lib/types/ai-coach.types";

interface AIRecommendationsProps {
	recommendations: ModuleRecommendation[];
	cachedAt: Date | null;
	isCached: boolean;
	nextAction?: {
		type: string;
		title: string;
		description: string;
		actionUrl: string;
		actionLabel: string;
	};
}

const levelConfig: Record<
	string,
	{
		icon: typeof BookOpen;
		label: string;
		color: string;
		bgColor: string;
	}
> = {
	beginner: {
		icon: BookOpen,
		label: "Principiante",
		color: "text-blue-500",
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
	},
	intermediate: {
		icon: Target,
		label: "Intermedio",
		color: "text-amber-500",
		bgColor: "bg-amber-100 dark:bg-amber-900/30",
	},
	advanced: {
		icon: TrendingUp,
		label: "Avanzado",
		color: "text-green-500",
		bgColor: "bg-green-100 dark:bg-green-900/30",
	},
	expert: {
		icon: Lightbulb,
		label: "Experto",
		color: "text-purple-500",
		bgColor: "bg-purple-100 dark:bg-purple-900/30",
	},
};

/**
 * AI Recommendations Component
 *
 * Displays personalized module recommendations from the AI Coach.
 * Shows next action and allows refreshing recommendations.
 * Rate limited: 5-minute cooldown between refreshes.
 */
export function AIRecommendations({
	recommendations,
	cachedAt,
	isCached,
	nextAction,
}: AIRecommendationsProps) {
	const [currentRecommendations, setCurrentRecommendations] =
		useState(recommendations);
	const [isRefreshing, startRefresh] = useTransition();
	const [refreshError, setRefreshError] = useState(false);
	const [cooldownSeconds, setCooldownSeconds] = useState(0);

	// Countdown timer for cooldown
	useEffect(() => {
		if (cooldownSeconds <= 0) return;

		const timer = setInterval(() => {
			setCooldownSeconds((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [cooldownSeconds]);

	const formatCooldown = useCallback((seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
	}, []);

	const handleRefresh = () => {
		setRefreshError(false);
		startRefresh(async () => {
			try {
				const result = await refreshAIRecommendations();

				if (result.rateLimited && result.cooldownRemaining) {
					setCooldownSeconds(result.cooldownRemaining);
					toast.info("Límite de actualización", {
						description: `Espera ${formatCooldown(
							result.cooldownRemaining,
						)} antes de actualizar`,
					});
				} else {
					setCurrentRecommendations(result.recommendations);
					toast.success("Recomendaciones actualizadas");
				}
			} catch (error) {
				console.error("Error refreshing recommendations:", error);
				setRefreshError(true);
			}
		});
	};

	const isOnCooldown = cooldownSeconds > 0;

	return (
		<Card className="relative overflow-hidden">
			{/* Gradient Background */}
			<div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full" />

			<CardHeader className="relative">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-primary" />
						AI Coach
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleRefresh}
						disabled={isRefreshing || isOnCooldown}
						title={
							isOnCooldown
								? `Disponible en ${formatCooldown(cooldownSeconds)}`
								: "Actualizar recomendaciones"
						}
					>
						<RefreshCw
							className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")}
						/>
						{isRefreshing
							? "Actualizando..."
							: isOnCooldown
								? formatCooldown(cooldownSeconds)
								: "Actualizar"}
					</Button>
				</div>
				{isCached && cachedAt && (
					<p className="text-xs text-muted-foreground">
						Recomendaciones del{" "}
						{new Date(cachedAt).toLocaleDateString("es-ES", {
							day: "numeric",
							month: "short",
						})}
					</p>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Next Action Card */}
				{nextAction && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-4 rounded-lg bg-primary/5 border border-primary/20"
					>
						<p className="text-sm text-muted-foreground mb-1">
							Tu siguiente paso:
						</p>
						<h3 className="font-medium mb-2">{nextAction.title}</h3>
						<p className="text-sm text-muted-foreground mb-3">
							{nextAction.description}
						</p>
						<Link href={nextAction.actionUrl}>
							<Button size="sm">
								{nextAction.actionLabel}
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</Link>
					</motion.div>
				)}

				{/* Error Message */}
				{refreshError && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-2"
					>
						<AlertCircle className="h-4 w-4 shrink-0" />
						<p>
							No se pudieron cargar las recomendaciones. Por favor, intenta de
							nuevo.
						</p>
					</motion.div>
				)}

				{/* Recommendations List */}
				<div className="space-y-3">
					<h4 className="text-sm font-medium text-muted-foreground">
						Recomendaciones personalizadas
					</h4>

					{isRefreshing ? (
						<RecommendationsSkeleton />
					) : currentRecommendations.length > 0 ? (
						currentRecommendations.map((rec, index) => (
							<RecommendationCard
								key={rec.moduleKey}
								recommendation={rec}
								index={index}
							/>
						))
					) : (
						<p className="text-sm text-muted-foreground text-center py-4">
							No hay recomendaciones disponibles en este momento.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Individual Recommendation Card
 */
function RecommendationCard({
	recommendation,
	index,
}: {
	recommendation: ModuleRecommendation;
	index: number;
}) {
	const config = levelConfig[recommendation.level] ?? levelConfig.beginner;
	const Icon = config.icon;

	return (
		<motion.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
		>
			<div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
				<Icon className={cn("h-4 w-4", config.color)} />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<h4 className="font-medium text-sm truncate">
						{recommendation.titleEs}
					</h4>
					<Badge variant="outline" className="text-xs shrink-0">
						{config.label}
					</Badge>
				</div>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{recommendation.reason}
				</p>
				{/* Metadata */}
				<div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{recommendation.estimatedMinutes} min
					</span>
					<span className="flex items-center gap-1">
						<Zap className="h-3 w-3" />
						{recommendation.xpReward} XP
					</span>
					{/* Relevance Score */}
					<div className="flex items-center gap-1 ml-auto">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className={cn(
									"h-1.5 w-1.5 rounded-full",
									i < Math.ceil(recommendation.relevanceScore / 20)
										? "bg-primary"
										: "bg-muted",
								)}
							/>
						))}
					</div>
				</div>
			</div>

			{recommendation.moduleId && (
				<Link href={`/dashboard/development/${recommendation.moduleId}`}>
					<Button variant="ghost" size="icon" className="shrink-0">
						<ArrowRight className="h-4 w-4" />
					</Button>
				</Link>
			)}
		</motion.div>
	);
}

/**
 * Skeleton for loading state
 */
function RecommendationsSkeleton() {
	return (
		<div className="space-y-3">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<div className="flex-1">
						<Skeleton className="h-4 w-3/4 mb-2" />
						<Skeleton className="h-3 w-full" />
					</div>
				</div>
			))}
		</div>
	);
}
