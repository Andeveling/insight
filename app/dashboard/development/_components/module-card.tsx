"use client";

import { CheckCircle2, ChevronRight, Clock, Play, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Mapas de color sutiles para los bordes y acentos (no fondos pesados)
const levelStyles = {
	beginner: {
		border: "border-emerald-500/60",
		text: "text-emerald-500",
		glow: "group-hover:shadow-emerald-500/10",
		gradient: "from-emerald-500/20 to-emerald-900/10",
		button: "text-emerald-500 hover:bg-emerald-500 hover:text-zinc-950",
		btnBorder: "bg-emerald-500/50",
	},
	intermediate: {
		border: "border-amber-500/60",
		text: "text-amber-500",
		glow: "group-hover:shadow-amber-500/10",
		gradient: "from-amber-500/20 to-amber-900/10",
		button: "text-amber-500 hover:bg-amber-500 hover:text-zinc-950",
		btnBorder: "bg-amber-500/50",
	},
	advanced: {
		border: "border-purple-500/60",
		text: "text-purple-500",
		glow: "group-hover:shadow-purple-500/10",
		gradient: "from-purple-500/20 to-purple-900/10",
		button: "text-purple-500 hover:bg-purple-500 hover:text-zinc-950",
		btnBorder: "bg-purple-500/50",
	},
};

/**
 * Module Card Component (Tech/Stealth Version)
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

	// Determinamos el estilo base según el nivel o estado
	const styles = levelStyles[module.level] || levelStyles.beginner;
	const isActive = priority || isInProgress;

	// Clip path para esquinas recortadas (Tech look)
	const clipPathStyle =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ y: -4 }}
			className={cn(
				"group relative h-full w-full",
				isCompleted && "opacity-60 grayscale-[0.8]",
			)}
		>
			{/* CAPA 1: Borde Base (Definido por padding 1px) */}
			<div
				className={cn(
					"h-full p-px transition-all duration-300",
					"bg-linear-to-br",
					!isActive && "from-zinc-800 to-zinc-900",
					priority && !isInProgress && "from-indigo-500/60 to-indigo-900/40",
					isInProgress && styles.gradient,
					"group-hover:from-zinc-700 group-hover:to-zinc-800",
				)}
				style={{ clipPath: clipPathStyle }}
			>
				{/* CAPA 2: Contenedor Principal (Fondo Oscuro/Sutil) */}
				<div
					className={cn(
						"h-full flex flex-col relative overflow-hidden transition-all duration-300",
						isActive
							? "bg-zinc-950/70 backdrop-blur-sm"
							: "bg-zinc-950/90 backdrop-blur-sm",
					)}
					style={{ clipPath: clipPathStyle }}
				>
					{/* Fondo decorativo muy sutil (Grid) */}
					<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

					{/* Header */}
					<div className="p-5 pb-2 relative z-10">
						<div className="flex items-start justify-between gap-3">
							<div className="space-y-3 flex-1">
								<div className="flex items-center gap-2">
									{priority && (
										<span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-sm border border-indigo-500/20">
											Recomendado
										</span>
									)}
									{module.moduleType && (
										<ModuleTypeBadge type={module.moduleType} />
									)}
								</div>

								<h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-10">
									{module.titleEs}
								</h3>
							</div>
							<ModuleDifficultyBadge level={module.level} />
						</div>
					</div>

					{/* Body */}
					<div className="px-5 flex-1 flex flex-col relative z-10">
						<p className="text-sm text-zinc-400 line-clamp-3 mb-5 min-h-16">
							{module.descriptionEs}
						</p>

						{/* Meta Info (Minimalista) */}
						<div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
							<span className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5 opacity-70" />
								{module.estimatedMinutes} min
							</span>
							<span className="w-px h-3 bg-zinc-800" /> {/* Separador */}
							<span className="flex items-center gap-1.5">
								<Trophy className={cn("h-3.5 w-3.5", styles.text)} />
								<span className={cn(isInProgress ? styles.text : "")}>
									{module.xpReward} XP
								</span>
							</span>
						</div>

						{/* Barra de Progreso (Integrada) */}
						{isInProgress || isCompleted ? (
							<div className="mt-auto space-y-2 pt-2 pb-2">
								<div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold">
									<span className="text-zinc-500">Progreso</span>
									<span className={styles.text}>
										{module.progress.percentComplete}%
									</span>
								</div>
								<Progress
									value={module.progress.percentComplete}
									className={cn(
										"h-1 bg-zinc-800",
										// Add a custom indicator color using a data attribute or override if Progress supports it
										styles.text.replace("text-", "progress-bar-bg-"),
									)}
								/>
							</div>
						) : (
							<div className="mt-auto border-t border-dashed border-zinc-800 my-2" />
						)}
					</div>

					{/* Footer Actions */}
					<div className="p-5 pt-0 mt-2 relative z-10">
						{isCompleted ? (
							<div className="w-full flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 bg-zinc-900/50 py-2 border border-zinc-800 rounded-none clip-path-button">
								<CheckCircle2 className="h-4 w-4 text-emerald-500" />
								Completado
							</div>
						) : isInProgress ? (
							<Link
								href={`/dashboard/development/${module.id}`}
								className="w-full block group/btn"
							>
								<div
									className={cn(
										"p-px transition-all duration-300",
										styles.btnBorder,
									)}
									style={{
										clipPath:
											"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
									}}
								>
									<Button
										variant="ghost"
										className={cn(
											"w-full uppercase tracking-wider text-xs font-bold rounded-none transition-all duration-300 bg-zinc-950/50 backdrop-blur-sm hover:bg-transparent",
											styles.button,
										)}
										style={{
											clipPath:
												"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
										}}
									>
										Continuar
										<ChevronRight className="h-3.5 w-3.5 ml-1" />
									</Button>
								</div>
							</Link>
						) : (
							<div
								className={cn(
									"p-px transition-all duration-300",
									priority ? "bg-indigo-400/50" : "bg-zinc-700",
								)}
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								<Button
									onClick={handleStart}
									disabled={isPending}
									className={cn(
										"w-full uppercase tracking-wider text-xs font-bold rounded-none transition-all duration-300 border-none",
										"bg-zinc-100 text-zinc-950 hover:bg-white", // Botón blanco/gris alto contraste
										priority &&
											"bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]",
									)}
									style={{
										clipPath:
											"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
									}}
								>
									{isPending ? (
										"Iniciando..."
									) : (
										<>
											<Play className="h-3.5 w-3.5 mr-2 fill-current" />
											Comenzar
										</>
									)}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/**
 * Module Difficulty Badge (Minimalist)
 */
function ModuleDifficultyBadge({
	level,
}: {
	level: "beginner" | "intermediate" | "advanced";
}) {
	const config = {
		beginner: {
			label: "Principiante",
			className: "text-emerald-500 border-emerald-500/20",
		},
		intermediate: {
			label: "Intermedio",
			className: "text-amber-500 border-amber-500/20",
		},
		advanced: {
			label: "Avanzado",
			className: "text-purple-500 border-purple-500/20",
		},
	}[level];

	return (
		<div
			className={cn(
				"shrink-0 border uppercase text-[9px] font-bold px-2 py-0.5 tracking-wider bg-transparent",
				config.className,
			)}
			style={{
				clipPath:
					"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
			}}
		>
			{config.label}
		</div>
	);
}
