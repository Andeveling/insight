"use client";

import { CheckCircle2, ChevronRight, Clock, Play, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
	TCGButton,
	TCGCard,
	type TCGCardVariant,
} from "@/components/gamification";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { startModule } from "../_actions";
import type { ModuleCard as ModuleCardType } from "../_schemas";
import { ModuleTypeBadge } from "./module-type-badge";

interface ModuleCardProps {
	module: ModuleCardType;
	priority?: boolean;
	onStarted?: (moduleId: string) => void;
}

/**
 * Module Card Component
 *
 * Displays a development module with level badge, progress indicator,
 * and action button to start or continue the module.
 */
export function ModuleCard({
	module,
	priority = false,
	onStarted,
}: ModuleCardProps) {
	const [isPending, startTransition] = useTransition();
	const [started, setStarted] = useState(
		module.progress.status !== "not_started",
	);

	const handleStart = () => {
		startTransition(async () => {
			try {
				await startModule({ moduleId: module.id });
				setStarted(true);
				onStarted?.(module.id);
			} catch (error) {
				console.error("Error starting module:", error);
			}
		});
	};

	const isCompleted = module.progress.status === "completed";
	const isInProgress = module.progress.status === "in_progress" || started;

	const variant: TCGCardVariant = priority
		? "primary"
		: (module.level as TCGCardVariant);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="h-full"
		>
			<TCGCard
				variant={variant}
				isActive={true}
				isInteractive={true}
				className={cn(isCompleted && "opacity-80 grayscale-[0.3]")}
			>
				{/* Priority Indicator */}
				{priority && (
					<div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
						Recomendado
					</div>
				)}

				<CardHeader className="pb-2 mt-2 space-y-0 p-0">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-2 flex-1">
							{module.moduleType && (
								<ModuleTypeBadge type={module.moduleType} />
							)}
							<h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors min-h-12 flex items-center">
								{module.titleEs}
							</h3>
						</div>
						<ModuleDifficultyBadge level={module.level} />
					</div>
				</CardHeader>

				<CardContent className="pb-4 flex-1 flex flex-col p-0 mt-4">
					<p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-18">
						{module.descriptionEs}
					</p>

					{/* Meta Info */}
					<div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
						<span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
							<Clock className="h-3.5 w-3.5 text-primary/70" />
							{module.estimatedMinutes} min
						</span>
						<span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
							<Trophy className="h-3.5 w-3.5 text-amber-500" />
							{module.xpReward} XP
						</span>
					</div>

					{/* Progress (if started) */}
					{isInProgress || isCompleted ? (
						<div className="mt-auto space-y-2 pt-2">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground font-medium">
									{module.progress.completedChallenges}/
									{module.progress.totalChallenges} desafíos
								</span>
								<span className="font-bold text-primary">
									{module.progress.percentComplete}%
								</span>
							</div>
							<Progress
								value={module.progress.percentComplete}
								className="h-2 bg-muted/50"
								aria-label={`Progreso del módulo ${module.titleEs}: ${module.progress.percentComplete}% completado`}
							/>
						</div>
					) : (
						<div className="mt-auto" />
					)}
				</CardContent>

				<CardFooter className="pt-0 pb-0 p-0 mt-4">
					{isCompleted ? (
						<TCGButton
							variant="success"
							className="w-full cursor-default"
							disabled
							leftIcon={<CheckCircle2 className="h-4 w-4" />}
						>
							Completado
						</TCGButton>
					) : isInProgress ? (
						<Link
							href={`/dashboard/development/${module.id}`}
							className="w-full"
						>
							<TCGButton
								variant="accent"
								className="w-full"
								rightIcon={
									<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								}
							>
								Continuar
							</TCGButton>
						</Link>
					) : (
						<TCGButton
							onClick={handleStart}
							isLoading={isPending}
							className="w-full"
							leftIcon={<Play className="h-4 w-4 fill-current" />}
						>
							Comenzar
						</TCGButton>
					)}
				</CardFooter>
			</TCGCard>
		</motion.div>
	);
}

/**
 * Module Difficulty Badge Sub-component
 */
function ModuleDifficultyBadge({
	level,
}: {
	level: "beginner" | "intermediate" | "advanced";
}) {
	const levelConfig = {
		beginner: {
			label: "Principiante",
			variant: "secondary" as const,
			className:
				"bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
		},
		intermediate: {
			label: "Intermedio",
			variant: "secondary" as const,
			className:
				"bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
		},
		advanced: {
			label: "Avanzado",
			variant: "secondary" as const,
			className:
				"bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400",
		},
	};

	const config = levelConfig[level];

	return (
		<Badge
			variant={config.variant}
			className={cn(
				"shrink-0 border uppercase text-[10px] font-bold px-2 py-0.5",
				config.className,
			)}
		>
			{config.label}
		</Badge>
	);
}
