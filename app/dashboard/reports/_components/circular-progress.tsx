"use client";

/**
 * Circular Progress Component
 *
 * Displays a circular progress indicator with percentage and status label.
 * Used for showing readiness score in a visually appealing way.
 *
 * @feature 009-contextual-reports
 */

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
	if (value === 100) return "text-success stroke-success";
	if (value >= 75) return "text-warning stroke-warning";
	if (value >= 50) return "text-primary stroke-primary";
	if (value >= 25) return "text-muted-foreground stroke-muted-foreground";
	return "text-muted-foreground/50 stroke-muted-foreground/50";
}

export function CircularProgress({
	value,
	size = 160,
	strokeWidth = 12,
	label,
	className,
	showCelebration = true,
}: CircularProgressProps) {
	// Clamp value between 0 and 100
	const clampedValue = Math.max(0, Math.min(100, value));

	// Calculate circle dimensions
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

	// Determine color based on value
	const colorClass = getProgressColor(clampedValue);

	// Check if should show celebration
	const isComplete = clampedValue === 100 && showCelebration;

	return (
		<div
			className={cn(
				"relative flex flex-col items-center justify-center",
				className,
			)}
		>
			{/* SVG Progress Circle */}
			<svg
				width={size}
				height={size}
				className={cn(
					"-rotate-90 transition-all duration-500",
					isComplete && "animate-pulse",
				)}
			>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					className="stroke-muted"
				/>

				{/* Progress circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					className={cn("transition-all duration-700 ease-out", colorClass)}
				/>
			</svg>

			{/* Center content */}
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className={cn(
						"text-4xl font-bold tabular-nums transition-colors duration-300",
						colorClass.split(" ")[0], // Use text color only
					)}
				>
					{clampedValue}%
				</span>
				{label && (
					<span className="mt-1 text-sm font-medium text-muted-foreground">
						{label}
					</span>
				)}
			</div>

			{/* Celebration particles (only at 100%) */}
			{isComplete && (
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute left-1/2 top-0 size-2 -translate-x-1/2 animate-bounce rounded-full bg-success delay-75" />
					<div className="absolute right-0 top-1/2 size-2 -translate-y-1/2 animate-bounce rounded-full bg-success delay-100" />
					<div className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 animate-bounce rounded-full bg-success delay-150" />
					<div className="absolute left-0 top-1/2 size-2 -translate-y-1/2 animate-bounce rounded-full bg-success delay-200" />
				</div>
			)}
		</div>
	);
}
