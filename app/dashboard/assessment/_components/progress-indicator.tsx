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

const PHASE_COLORS: Record<number, { bg: string; glow: string; text: string }> =
	{
		1: {
			bg: "bg-blue-500",
			glow: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
			text: "text-blue-400",
		},
		2: {
			bg: "bg-amber-500",
			glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]",
			text: "text-amber-400",
		},
		3: {
			bg: "bg-emerald-500",
			glow: "shadow-[0_0_10px_rgba(16,185,129,0.5)]",
			text: "text-emerald-400",
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
				<span className="text-zinc-500 text-xs font-mono">
					{questionNumber}/{totalSteps}
				</span>
				<div className="h-1.5 w-20 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
					<div
						className={cn(
							"h-full transition-all duration-300",
							colors.bg,
							colors.glow,
						)}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className="text-zinc-500 text-xs font-mono">
					{Math.round(progress)}%
				</span>
			</div>
		);
	}

	return (
		<div
			className={cn("p-4 border border-zinc-800 bg-zinc-950/50", className)}
			style={{
				clipPath:
					"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
			}}
		>
			{/* Header row */}
			<div className="flex items-center justify-between mb-3">
				{showPhaseLabel && (
					<div className="flex items-center gap-2">
						<div
							className={cn("h-2 w-2 rounded-full", colors.bg, colors.glow)}
							aria-hidden="true"
						/>
						<span className={cn("text-sm font-medium", colors.text)}>
							Fase {phase}: {PHASE_LABELS[phase]}
						</span>
					</div>
				)}

				<div className="flex items-center gap-3">
					<span className="text-sm font-bold text-white">
						Pregunta {questionNumber} de {totalSteps}
					</span>
					<span
						className={cn(
							"px-2 py-0.5 text-xs font-mono border",
							colors.text,
							"border-zinc-700 bg-zinc-900/50",
						)}
						style={{
							clipPath:
								"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
						}}
					>
						{Math.round(progress)}%
					</span>
				</div>
			</div>

			{/* Progress bar */}
			<div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
				<div
					className={cn(
						"h-full transition-all duration-500 ease-out",
						colors.bg,
						colors.glow,
					)}
					style={{ width: `${progress}%` }}
					role="progressbar"
					aria-valuenow={progress}
					aria-valuemin={0}
					aria-valuemax={100}
				/>
			</div>

			{/* Phase indicators */}
			<div className="flex justify-between mt-3">
				{[1, 2, 3].map((phaseNum) => (
					<div key={phaseNum} className="flex items-center gap-1.5">
						<div
							className={cn(
								"h-4 w-4 flex items-center justify-center text-xs font-bold",
								phaseNum <= phase
									? PHASE_COLORS[phaseNum].bg + " text-white"
									: "bg-zinc-800 text-zinc-600",
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
								"text-xs hidden sm:inline",
								phaseNum <= phase ? "text-zinc-300" : "text-zinc-600",
							)}
						>
							{phaseNum === 1
								? "Dominios"
								: phaseNum === 2
									? "Fortalezas"
									: "Ranking"}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
