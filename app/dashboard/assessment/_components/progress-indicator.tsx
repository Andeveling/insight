"use client";

/**
 * ProgressIndicator Component - CyberPunk Style
 * Shows current question number, total questions, percentage bar with animation
 */

import { cn } from "@/lib/cn";

export interface ProgressIndicatorProps {
	currentStep: number;
	totalSteps: number;
	phase: 1 | 2 | 3;
	className?: string;
	showPhaseLabel?: boolean;
	compact?: boolean;
}

const PHASE_LABELS: Record<number, string> = {
	1: "Descubrimiento de Dominio",
	2: "Refinamiento de Fortalezas",
	3: "Ranking Final",
};

const PHASE_COLORS: Record<
	number,
	{ bg: string; glow: string; text: string; border: string }
> = {
	1: {
		bg: "bg-chart-2",
		glow: "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
		text: "text-chart-2",
		border: "border-chart-2/30",
	},
	2: {
		bg: "bg-primary",
		glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
		text: "text-primary",
		border: "border-primary/30",
	},
	3: {
		bg: "bg-chart-5",
		glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
		text: "text-chart-5",
		border: "border-chart-5/30",
	},
};

export default function ProgressIndicator({
	currentStep,
	totalSteps,
	phase,
	className,
	showPhaseLabel = true,
	compact = false,
}: ProgressIndicatorProps) {
	const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
	const questionNumber = currentStep + 1;
	const colors = PHASE_COLORS[phase];

	if (compact) {
		return (
			<div className={cn("flex items-center gap-3", className)}>
				<span className="text-muted-foreground text-xs font-mono">
					{questionNumber}/{totalSteps}
				</span>
				<div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden border border-border">
					<div
						className={cn(
							"h-full transition-all duration-300",
							colors.bg,
							colors.glow,
						)}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className="text-muted-foreground text-xs font-mono">
					{Math.round(progress)}%
				</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"p-4 border-[0.5px] border-border bg-background/80 backdrop-blur-sm relative overflow-hidden group",
				className,
			)}
			style={{
				clipPath:
					"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
			}}
		>
			{/* Scanline effect */}
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent h-[200%] -top-full animate-progress-fill opacity-20 pointer-events-none" />

			{/* Header row */}
			<div className="flex items-center justify-between mb-3 relative z-10">
				{showPhaseLabel && (
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"h-1.5 w-1.5 rounded-full animate-pulse",
								colors.bg,
								colors.glow,
							)}
							aria-hidden="true"
						/>
						<span
							className={cn(
								"text-[10px] font-black uppercase tracking-[0.2em]",
								colors.text,
							)}
						>
							Mission Phase {phase} {/* */}
							{PHASE_LABELS[phase]}
						</span>
					</div>
				)}

				<div className="flex items-center gap-3">
					<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
						Data Point {questionNumber} / {totalSteps}
					</span>
					<span
						className={cn(
							"px-2 py-0.5 text-[10px] font-black border tracking-tighter",
							colors.text,
							colors.border,
							"bg-muted/50",
						)}
					>
						{Math.round(progress)}%
					</span>
				</div>
			</div>

			{/* Progress bar */}
			<div className="h-1 bg-muted overflow-hidden border-[0.5px] border-border relative">
				<div
					className={cn(
						"h-full transition-all duration-700 ease-out relative",
						colors.bg,
						colors.glow,
					)}
					style={{ width: `${progress}%` }}
					role="progressbar"
					aria-valuenow={progress}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div className="absolute inset-y-0 right-0 w-4 bg-white/40 blur-sm" />
				</div>
			</div>

			{/* Phase indicators */}
			<div className="flex justify-between mt-4 relative z-10">
				{[1, 2, 3].map((phaseNum) => {
					const isCurrent = phaseNum === phase;
					const isPast = phaseNum < phase;
					const phaseColors = PHASE_COLORS[phaseNum];

					return (
						<div key={phaseNum} className="flex flex-col items-center gap-2">
							<div
								className={cn(
									"h-6 w-6 flex items-center justify-center text-[10px] font-black transition-all duration-500",
									isCurrent
										? phaseColors.bg +
												" text-primary-foreground scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
										: isPast
											? phaseColors.bg + " text-primary-foreground opacity-50"
											: "bg-muted border border-border text-muted-foreground",
								)}
								style={{
									clipPath:
										"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
								}}
							>
								{phaseNum}
							</div>
							<span
								className={cn(
									"text-[9px] uppercase font-black tracking-tighter transition-colors duration-500",
									isCurrent
										? phaseColors.text
										: isPast
											? "text-muted-foreground"
											: "text-muted-foreground/60",
								)}
							>
								{phaseNum === 1
									? "Dominio"
									: phaseNum === 2
										? "Refine"
										: "Final"}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
