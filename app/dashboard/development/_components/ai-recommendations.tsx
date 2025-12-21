"use client";

import {
	AlertCircle,
	ArrowRight,
	BookOpen,
	Clock,
	Lightbulb,
	RefreshCw,
	Sparkles,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import type { ModuleRecommendation } from "@/lib/types/ai-coach.types";
import { refreshAIRecommendations } from "../_actions/get-ai-recommendations";

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

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<div 
			className="relative overflow-hidden p-px bg-border/40 group/coach"
			style={{ clipPath: clipPath16 }}
		>
			<div 
				className="bg-background/95 backdrop-blur-md relative h-full"
				style={{ clipPath: clipPath16 }}
			>
				{/* Header Section */}
				<div className="p-6 pb-0 space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
								<Sparkles className="h-3 w-3" />
								AI_COACH_PROTO
							</h4>
							<h3 className="text-xl font-black uppercase tracking-tighter text-foreground">
								AI Coach
							</h3>
						</div>
						<button
							onClick={handleRefresh}
							disabled={isRefreshing || isOnCooldown}
							className={cn(
								"flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all",
								"bg-muted border border-border text-foreground hover:text-primary hover:border-primary/50",
								(isRefreshing || isOnCooldown) && "opacity-50 cursor-not-allowed"
							)}
							style={{ clipPath: clipPath8 }}
							title={isOnCooldown ? `Disponible en ${formatCooldown(cooldownSeconds)}` : "Actualizar"}
						>
							<RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
							{isRefreshing ? "SYNC..." : isOnCooldown ? formatCooldown(cooldownSeconds) : "Actualizar"}
						</button>
					</div>
					
					{isCached && cachedAt && (
						<div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
							<Clock className="h-3 w-3" />
							Escaneo finalizado: {new Date(cachedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" }).toUpperCase()}
						</div>
					)}
				</div>

				<div className="p-6 space-y-6">
					{/* Next Action Card */}
					{nextAction && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="relative p-5 bg-primary/5 border border-primary/20 overflow-hidden"
							style={{ clipPath: clipPath8 }}
						>
							<div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-3xl rounded-full" />
							
							<span className="text-[9px] font-black uppercase tracking-widest text-primary/70 mb-2 block">
								Siguiente paso_
							</span>
							<h3 className="font-black text-sm uppercase tracking-tight text-foreground mb-1">
								{nextAction.title}
							</h3>
							<p className="text-[11px] font-medium text-muted-foreground mb-4 leading-relaxed">
								{nextAction.description}
							</p>
							
							<Link href={nextAction.actionUrl} className="block">
								<button 
									className="group/btn w-full py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/90 flex items-center justify-center gap-2"
									style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
								>
									{nextAction.actionLabel}
									<ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
								</button>
							</Link>
						</motion.div>
					)}

					{/* Recommendations List Container */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
							<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
								Directivas_Personalizadas
							</h4>
							<div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
						</div>

						{/* Error Message */}
						{refreshError && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
								style={{ clipPath: clipPath8 }}
							>
								<AlertCircle className="h-3 w-3 shrink-0" />
								Error en el enlace de datos. Reintentar.
							</motion.div>
						)}

						{isRefreshing ? (
							<RecommendationsSkeleton />
						) : currentRecommendations.length > 0 ? (
							<div className="space-y-3">
								{currentRecommendations.map((rec, index) => (
									<RecommendationCard
										key={rec.moduleKey}
										recommendation={rec}
										index={index}
									/>
								))}
							</div>
						) : (
							<div className="text-center py-8 border border-dashed border-border/40">
								<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
									Sin transmisiones disponibles_
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
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
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			className="group/rec relative flex items-start gap-4 p-4 bg-muted/20 border border-border/40 hover:bg-muted/40 transition-all"
			style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
		>
			<div 
				className={cn("p-2 shrink-0 flex items-center justify-center relative", config.color)}
				style={{ 
					clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
					backgroundColor: "currentColor",
					opacity: 0.2
				}}
			/>
			<div className="absolute left-4 top-4 p-2 shrink-0 flex items-center justify-center">
				<Icon className={cn("h-3.5 w-3.5", config.color)} />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<h4 className="font-black text-[11px] uppercase tracking-tight text-foreground truncate">
						{recommendation.titleEs}
					</h4>
					<div className={cn(
						"px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest border",
						config.color,
						"bg-current/10 border-current/20"
					)}>
						{config.label}
					</div>
				</div>
				<p className="text-[10px] font-medium text-muted-foreground line-clamp-2 leading-tight">
					{recommendation.reason}
				</p>
				
				{/* Metadata */}
				<div className="flex items-center gap-3 mt-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">
					<span className="flex items-center gap-1 group-hover/rec:text-foreground transition-colors">
						<Clock className="h-2.5 w-2.5" />
						{recommendation.estimatedMinutes} MIN
					</span>
					<span className="flex items-center gap-1 group-hover/rec:text-foreground transition-colors">
						<Zap className="h-2.5 w-2.5 text-primary" />
						{recommendation.xpReward} XP
					</span>
					
					{/* Relevance Score Indicator */}
					<div className="flex items-center gap-0.5 ml-auto">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className={cn(
									"h-1 w-2 transition-all",
									i < Math.ceil(recommendation.relevanceScore / 20)
										? "bg-primary"
										: "bg-muted-foreground/20"
								)}
								style={{ clipPath: "polygon(2px 0, 100% 0, 100% 100%, 0 100%)" }}
							/>
						))}
					</div>
				</div>
			</div>

			{recommendation.moduleId && (
				<Link href={`/dashboard/development/${recommendation.moduleId}`} className="shrink-0">
					<button className="h-full px-1 border-l border-border/20 text-muted-foreground hover:text-primary transition-colors">
						<ArrowRight className="h-4 w-4" />
					</button>
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
				<div 
					key={i} 
					className="flex items-start gap-4 p-4 border border-border/40 bg-muted/10"
					style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
				>
					<Skeleton className="h-10 w-10 shrink-0 bg-muted/20" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4 bg-muted/20" />
						<Skeleton className="h-3 w-full bg-muted/20" />
					</div>
				</div>
			))}
		</div>
	);
}
