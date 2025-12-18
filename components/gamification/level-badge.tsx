"use client";

/**
 * Level Badge Component (Gamification)
 *
 * Reusable badge that displays user's current level with color-coded styling.
 * Used across: assessment, profile, dashboard, development pages.
 *
 * Features:
 * - Dynamic color based on level tier (getLevelColor)
 * - Optional level name display (getLevelName)
 * - Multiple sizes (sm, md, lg, xl)
 * - Optional animation
 * - Icon support
 */

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import {
	getLevelColor,
	getLevelName,
} from "@/lib/services/level-calculator.service";

interface LevelBadgeProps {
	level: number;
	size?: "sm" | "md" | "lg" | "xl";
	showName?: boolean;
	showIcon?: boolean;
	animated?: boolean;
	className?: string;
}

/**
 * Level Badge Component
 *
 * Displays the user's current level with styled badge.
 * Features optional animation and level name display.
 */
export function LevelBadge({
	level,
	size = "md",
	showName = false,
	showIcon = true,
	animated = true,
	className,
}: LevelBadgeProps) {
	const levelColor = getLevelColor(level);
	const levelName = getLevelName(level);

	// Size variants
	const sizeClasses = {
		sm: "text-xs px-1.5 py-0.5",
		md: "text-sm px-2 py-1",
		lg: "text-base px-3 py-1.5",
		xl: "text-lg px-4 py-2",
	};

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
		xl: "h-6 w-6",
	};

	const Wrapper = animated ? motion.div : "div";
	const wrapperProps = animated
		? {
				initial: { scale: 0.9, opacity: 0 },
				animate: { scale: 1, opacity: 1 },
				transition: { duration: 0.3, ease: "easeOut" as const },
			}
		: {};

	return (
		<Wrapper
			{...wrapperProps}
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full font-semibold",
				"border-2",
				getBadgeColorClasses(levelColor),
				sizeClasses[size],
				className,
			)}
		>
			{showIcon && <Star className={cn(iconSizes[size], "fill-current")} />}
			<span>Nivel {level}</span>
			{showName && (
				<span className="font-normal opacity-80">• {levelName}</span>
			)}
		</Wrapper>
	);
}

/**
 * Get Tailwind color classes based on level color
 */
function getBadgeColorClasses(color: string): string {
	const colorMap: Record<string, string> = {
		zinc: "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700",
		slate:
			"bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
		stone:
			"bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700",
		neutral:
			"bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-700",
		green:
			"bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
		emerald:
			"bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700",
		teal: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-700",
		cyan: "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700",
		blue: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
		indigo:
			"bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700",
		violet:
			"bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900 dark:text-violet-300 dark:border-violet-700",
		purple:
			"bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700",
		fuchsia:
			"bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-900 dark:text-fuchsia-300 dark:border-fuchsia-700",
		pink: "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900 dark:text-pink-300 dark:border-pink-700",
		rose: "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900 dark:text-rose-300 dark:border-rose-700",
		amber:
			"bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700",
		orange:
			"bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700",
		red: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
		yellow:
			"bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
		gold: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
	};

	return colorMap[color] || "bg-primary/10 text-primary border-primary/30";
}
