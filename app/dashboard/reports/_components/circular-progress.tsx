"use client";

import { cn } from "@/lib/cn";

interface CircularProgressProps {
	/** Progress value from 0 to 100 */
	value: number;
	/** Size of the circle in pixels */
	size?: number;
	/** Stroke width in pixels */
	strokeWidth?: number;
	/** Optional label to display below the percentage */
	label?: string;
	/** Additional CSS classes */
	className?: string;
	/** Whether to show celebration animation at 100% */
	showCelebration?: boolean;
}

/**
 * Get color based on progress value
 */
function getProgressColor(value: number): string {
	if (value === 100) return "text-emerald-500 stroke-emerald-500";
	if (value >= 75) return "text-amber-500 stroke-amber-500";
	if (value >= 50) return "text-primary stroke-primary";
	return "text-muted-foreground stroke-muted-foreground";
}

export function CircularProgress({
	value,
	size = 180,
	strokeWidth = 10,
	label,
	className,
	showCelebration = true,
}: CircularProgressProps) {
	// Clamp value between 0 and 100
	const clampedValue = Math.max(0, Math.min(100, value));

	// Calculate circle dimensions
	const radius = (size - strokeWidth * 4) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

	// Determine color based on value
	const colorClass = getProgressColor(clampedValue);
	const isComplete = clampedValue === 100 && showCelebration;

	return (
		<div
			className={cn(
				"relative flex flex-col items-center justify-center group/progress",
				className,
			)}
		>
			{/* HUD Background Rings */}
			<div className="absolute inset-0 border border-border/10 rounded-full animate-[spin_20s_linear_infinite] opacity-20" />
			<div className="absolute inset-4 border border-dashed border-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

			{/* SVG Progress Circle */}
			<svg
				width={size}
				height={size}
				className={cn(
					"-rotate-90 transition-all duration-1000 ease-out",
					isComplete && "animate-pulse",
				)}
			>
				{/* Background track circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={2}
					className="stroke-muted/20"
				/>

				{/* Segmented Background (Technical Look) */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius + 8}
					fill="none"
					strokeWidth={1}
					className="stroke-border/20"
					strokeDasharray="4 8"
				/>

				{/* Main Progress Circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					className={cn("transition-all duration-1000 ease-out", colorClass)}
					style={{
						filter: isComplete ? "drop-shadow(0 0 8px currentColor)" : "none",
					}}
				/>

				{/* Outer technical markers */}
				{[...Array(8)].map((_, i) => (
					<line
						key={i}
						x1={size / 2}
						y1={strokeWidth}
						x2={size / 2}
						y2={strokeWidth + 10}
						className="stroke-border/40"
						transform={`rotate(${i * 45}, ${size / 2}, ${size / 2})`}
					/>
				))}
			</svg>

			{/* Center content */}
			<div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
				<div className="flex flex-col items-center">
					<span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
						CORE_SYNC
					</span>
					<div className="flex items-baseline gap-1">
						<span
							className={cn(
								"text-5xl font-black tabular-nums transition-colors duration-500 tracking-tighter",
								colorClass.split(" ")[0],
							)}
						>
							{clampedValue}
						</span>
						<span className="text-xl font-black text-muted-foreground/40">
							%
						</span>
					</div>
				</div>
				{label && (
					<div className="px-3 py-1 bg-muted/10 border border-border/20">
						<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
							{label.toUpperCase()}
						</span>
					</div>
				)}
			</div>

			{/* Technical glow effect at 100% */}
			{isComplete && (
				<div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full animate-pulse pointer-events-none" />
			)}
		</div>
	);
}
