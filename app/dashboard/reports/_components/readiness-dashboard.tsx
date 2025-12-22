"use client";

import {
	RocketIcon,
	SparklesIcon,
	Target,
	LayoutGrid,
	ChevronRight,
	Activity,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
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

	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	return (
		<div className={cn("relative group", className)}>
			<div
				className="p-px bg-border/40 group-hover:bg-primary/20 transition-all duration-500"
				style={{ clipPath: clipPath16 }}
			>
				<div
					className="bg-background/95 backdrop-blur-md overflow-hidden relative"
					style={{ clipPath: clipPath16 }}
				>
					{/* Technical Header */}
					<div className="p-6 border-b border-border/40 bg-muted/5">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Target className="size-4 text-primary animate-pulse" />
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
										READINESS_SYNC_DASHBOARD
									</h3>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									SISTEMA_DE_VERIFICACIÓN_DE_REQUISITOS_CONDUCTUALES // v2.0
								</p>
							</div>
							<div className="flex items-center gap-3">
								<div className="px-3 py-1 bg-muted/20 border border-border/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
									<div
										className={cn(
											"w-1.5 h-1.5 rounded-full animate-pulse",
											isReady
												? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
												: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
										)}
									/>
									NODE_STATUS: {isReady ? "OPTIMIZED" : "CALIBRATING"}
								</div>
							</div>
						</div>
					</div>

					<div className="p-8 space-y-12">
						{/* Progress HUD section */}
						<div className="flex flex-col md:flex-row items-center gap-12 py-4">
							{/* Circular progress with technical accents */}
							<div
								className="relative shrink-0 flex items-center justify-center p-8 bg-grid-tech/5 border border-border/10"
								style={{ clipPath: clipHex }}
							>
								<div className="absolute inset-0 bg-primary/5 animate-pulse" />
								<CircularProgress
									value={score}
									label={statusLabel}
									showCelebration={isReady}
								/>
							</div>

							{/* Stats and CTA Stream */}
							<div className="flex flex-1 flex-col items-center md:items-end gap-10">
								<div className="text-center md:text-right space-y-2">
									<p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
										COMPLETION_MATRIX
									</p>
									<div className="flex items-baseline justify-center md:justify-end gap-2 font-black">
										<span
											className={cn(
												"text-5xl uppercase tracking-tighter",
												isReady ? "text-emerald-500" : "text-foreground",
											)}
										>
											{metCount}
										</span>
										<span className="text-2xl text-muted-foreground/40">
											/ {totalCount}
										</span>
									</div>
									<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
										NODOS_DE_CONCIENCIA_ACTIVOS
									</p>
								</div>

								{/* Generate button (optimized for Cyberpunk) */}
								{isReady && onGenerateReport && (
									<motion.div
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3, delay: 0.2 }}
										className="w-full md:w-auto"
									>
										<Button
											onClick={onGenerateReport}
											disabled={isGenerating}
											size="lg"
											className={cn(
												"w-full md:w-auto gap-3 transition-all relative overflow-hidden group/btn px-10 h-14",
												!isGenerating &&
													"shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]",
											)}
											style={{ clipPath: clipPath8 }}
										>
											<div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
											<span className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
												<RocketIcon className="size-4" />
												{isGenerating ? "SYNCING..." : "GENERAR_REPORTE"}
											</span>
											{!isGenerating && (
												<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
											)}
										</Button>
									</motion.div>
								)}

								{/* Next action hint */}
								{!isReady && nextRecommendedAction && (
									<div
										className="p-4 bg-amber-500/10 border-r-2 border-amber-500/40 text-right space-y-1"
										style={{ clipPath: clipPath8 }}
									>
										<p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
											PENDING_PROTOCOL
										</p>
										<p className="text-[11px] font-bold uppercase tracking-widest text-foreground/80 flex items-center justify-end gap-3">
											{nextRecommendedAction.label}
											<ChevronRight className="size-3 text-amber-500" />
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Requirements HUD list */}
						<div className="space-y-6 pt-8 border-t border-border/10">
							<div className="flex items-center gap-3">
								<LayoutGrid className="size-3 text-muted-foreground/40" />
								<h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
									CORE_REQUIREMENTS_REGISTRY
								</h4>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{requirements.map((requirement) => (
									<ReadinessRequirement
										key={requirement.id}
										requirement={requirement}
									/>
								))}
							</div>
						</div>

						{/* Celebration/Status Stream */}
						{isReady && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5 }}
								className="p-px bg-emerald-500/30"
								style={{ clipPath: clipPath8 }}
							>
								<div
									className="bg-emerald-500/5 p-6 flex items-center gap-5 relative overflow-hidden"
									style={{ clipPath: clipPath8 }}
								>
									<div className="absolute top-0 left-0 w-24 h-full bg-linear-to-r from-emerald-500/20 to-transparent pointer-events-none" />
									<div
										className="size-10 bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0"
										style={{ clipPath: clipHex }}
									>
										<Activity className="size-5" />
									</div>
									<p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-500 leading-relaxed italic">
										SUCCESS:
										SUFICIENTE_CONTEXTO_DETECTADO_PARA_ANÁLISIS_PROFUNDO.
										EL_REPORTE_AHORA_INCLUIRÁ_INSIGHTS_DE_ALTO_VALOR_BASADOS_EN_TU_CRECIMIENTO_REAL.
									</p>
								</div>
							</motion.div>
						)}
					</div>

					{/* Decorative corner elements */}
					<div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-border/20 pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-border/20 pointer-events-none" />
				</div>
			</div>
		</div>
	);
}
