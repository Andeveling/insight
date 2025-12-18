"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { getLevelColor } from "@/lib/services/level-calculator.service";
import { formatXp } from "@/lib/services/xp-calculator.service";

interface XpBarProps {
	currentXp: number;
	minXp: number;
	maxXp: number;
	level: number;
	showLabels?: boolean;
	size?: "sm" | "md" | "lg";
	animated?: boolean;
	className?: string;
}

/**
 * XP Bar Component
 *
 * Displays a progress bar showing XP progress towards the next level.
 * Features Framer Motion animations for smooth transitions.
 */
export function XpBar({
	currentXp,
	minXp,
	maxXp,
	level,
	showLabels = true,
	size = "md",
	animated = true,
	className,
}: XpBarProps) {
	// Calculate progress percentage
	const xpInLevel = currentXp - minXp;
	const xpRequired = maxXp - minXp;
	const progressPercent = Math.min((xpInLevel / xpRequired) * 100, 100);

	// Get level color for styling
	const levelColor = getLevelColor(level);

	// Size variants
	const sizeClasses = {
		sm: "h-1.5",
		md: "h-2.5",
		lg: "h-4",
	};

	return (
		<div className={cn("w-full", className)}>
			{/* Labels */}
			{showLabels && (
				<div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
					<span className="font-medium">
						{formatXp(xpInLevel)} / {formatXp(xpRequired)} XP
					</span>
					<span>{Math.round(progressPercent)}%</span>
				</div>
			)}

			{/* Progress Bar Background */}
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-full bg-secondary",
					sizeClasses[size],
				)}
				role="progressbar"
				aria-valuenow={Math.round(progressPercent)}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={`Progreso de XP: ${formatXp(xpInLevel)} de ${formatXp(
					xpRequired,
				)} XP (${Math.round(progressPercent)}%)`}
			>
				{/* Animated Progress Fill */}
				<motion.div
					className={cn(
						"absolute inset-y-0 left-0 rounded-full",
						getBarColorClass(levelColor),
					)}
					initial={animated ? { width: 0 } : { width: `${progressPercent}%` }}
					animate={{ width: `${progressPercent}%` }}
					transition={{
						duration: animated ? 0.8 : 0,
						ease: "easeOut",
					}}
				/>

				{/* Shimmer Effect */}
				{animated && progressPercent > 0 && (
					<motion.div
						className="absolute inset-y-0 left-0 w-full"
						style={{
							background:
								"linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
						}}
						initial={{ x: "-100%" }}
						animate={{ x: "100%" }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							repeatDelay: 3,
							ease: "linear",
						}}
					/>
				)}
			</div>
		</div>
	);
}

/**
 * Get Tailwind color class based on level color
 */
function getBarColorClass(color: string): string {
	const colorMap: Record<string, string> = {
		zinc: "bg-zinc-500",
		slate: "bg-slate-500",
		stone: "bg-stone-500",
		neutral: "bg-neutral-500",
		green: "bg-green-500",
		emerald: "bg-emerald-500",
		teal: "bg-teal-500",
		cyan: "bg-cyan-500",
		blue: "bg-blue-500",
		indigo: "bg-indigo-500",
		violet: "bg-violet-500",
		purple: "bg-purple-500",
		fuchsia: "bg-fuchsia-500",
		pink: "bg-pink-500",
		rose: "bg-rose-500",
		amber: "bg-amber-500",
		orange: "bg-orange-500",
		red: "bg-red-500",
		yellow: "bg-yellow-500",
		gold: "bg-yellow-500",
	};

	return colorMap[color] || "bg-primary";
}
