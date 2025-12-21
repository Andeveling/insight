"use client";

/**
 * Level Badge Component (Gamification) - CyberPunk variant
 *
 * Adopted design system: docs/design-system/cyberpunk-ui.md
 * Changes:
 * - Layered border with gradient accent (outer p-px wrapper)
 * - Clipped corners using clip-path (sizes vary)
 * - Dark glass background with slight backdrop blur
 * - Hover glow and subtle lift using motion/react
 * - Uppercase labels with tracking-wider
 */

import { Star } from "lucide-react";
import { motion } from "motion/react";
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

function getClipPath(size: LevelBadgeProps["size"]) {
	switch (size) {
		case "sm":
			return "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
		case "lg":
			return "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
		case "xl":
			return "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";
		case "md":
		default:
			return "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	}
}

function getAccentGradient(color: string) {
	const map: Record<string, string> = {
		emerald: "bg-gradient-to-br from-emerald-400/60 to-emerald-900/25",
		amber: "bg-gradient-to-br from-amber-400/60 to-amber-900/25",
		purple: "bg-gradient-to-br from-purple-400/60 to-purple-900/25",
		indigo: "bg-gradient-to-br from-indigo-400/60 to-indigo-900/25",
		blue: "bg-gradient-to-br from-blue-400/60 to-blue-900/25",
		green: "bg-gradient-to-br from-green-400/60 to-green-900/25",
		default: "bg-gradient-to-br from-primary/60 to-primary-900/25",
	};

	return map[color] || map.default;
}

function getGlowColorHex(color: string) {
	switch (color) {
		case "emerald":
			return "#10b981"; // emerald
		case "amber":
			return "#f59e0b"; // amber
		case "purple":
			return "#a855f7"; // purple
		case "indigo":
			return "#6366f1"; // indigo
		case "blue":
			return "#3b82f6"; // blue
		default:
			return "#6366f1";
	}
}

/**
 * Level Badge Component
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

	// Size variants for inner content
	const sizeContent = {
		sm: "text-[10px] px-2 py-1",
		md: "text-sm px-3 py-1.5",
		lg: "text-base px-4 py-2",
		xl: "text-lg px-5 py-3",
	};

	const numberSize = {
		sm: "text-sm font-bold",
		md: "text-lg font-extrabold",
		lg: "text-xl font-extrabold",
		xl: "text-2xl font-extrabold",
	};

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
		xl: "h-6 w-6",
	};

	const clipPath = getClipPath(size);
	const accent = getAccentGradient(levelColor);
	const glowHex = getGlowColorHex(levelColor);

	const Wrapper: any = animated ? motion.div : "div";

	return (
		<Wrapper
			initial={{ scale: 0.96, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.28, ease: "easeOut" as const }}
			whileHover={{ y: -3, scale: 1.02, boxShadow: `0 10px 30px ${glowHex}40` }}
			className={cn("inline-flex p-px", accent, "rounded-md", className)}
			style={{ clipPath }}
		>
			{/* Inner glass layer - same clip-path */}
			<div
				className={cn(
					"bg-zinc-950/90 backdrop-blur-sm text-zinc-100 flex items-center gap-2",
					sizeContent[size],
					"select-none",
				)}
				style={{ clipPath }}
			>
				{showIcon && (
					<span
						className={cn(
							"inline-flex items-center justify-center rounded-sm",
							"bg-black/40 border border-white/6 p-1",
						)}
						style={{ boxShadow: `0 0 16px ${glowHex}20` }}
					>
						<Star className={cn(iconSizes[size], "text-zinc-100")} />
					</span>
				)}

				<div className="flex flex-col leading-none">
					<span className="text-[10px] tracking-wider uppercase opacity-70">
						Nivel
					</span>
					<span className={cn(numberSize[size], "uppercase tracking-tighter")}>
						{" "}
						{level}
					</span>
				</div>

				{showName && (
					<span className="ml-2 text-xs font-medium opacity-80 uppercase tracking-wider">
						• {levelName}
					</span>
				)}
			</div>
		</Wrapper>
	);
}

/**
 * Legacy helper kept for compatibility (not used by cyberpunk variant)
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
	};

	return colorMap[color] || "bg-primary/10 text-primary border-primary/30";
}
