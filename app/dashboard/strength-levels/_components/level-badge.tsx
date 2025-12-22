"use client";

/**
 * Level Badge Component
 *
 * Hexagonal badge displaying the current maturity level with CyberPunk styling.
 * Uses clip-paths for hexagonal shape and level-specific colors.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { LEVEL_METADATA } from "@/lib/constants/strength-levels.constants";
import type { MaturityLevel } from "@/lib/types/strength-levels.types";

interface LevelBadgeProps {
	level: MaturityLevel;
	size?: "sm" | "md" | "lg" | "xl";
	showLabel?: boolean;
	animate?: boolean;
	className?: string;
}

const SIZE_CLASSES = {
	sm: { container: "w-8 h-9", icon: "text-sm", label: "text-[8px]" },
	md: { container: "w-12 h-14", icon: "text-xl", label: "text-[10px]" },
	lg: { container: "w-16 h-[72px]", icon: "text-2xl", label: "text-xs" },
	xl: { container: "w-20 h-[92px]", icon: "text-3xl", label: "text-sm" },
} as const;

const HEXAGON_CLIP =
	"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function LevelBadge({
	level,
	size = "md",
	showLabel = true,
	animate = false,
	className,
}: LevelBadgeProps) {
	const metadata = LEVEL_METADATA[level];
	const sizeConfig = SIZE_CLASSES[size];

	const BadgeContent = (
		<div
			className={cn(
				"relative flex flex-col items-center justify-center",
				sizeConfig.container,
				className,
			)}
			data-testid="level-badge"
		>
			{/* Outer Hexagon Border */}
			<div
				className="absolute inset-0"
				style={{
					clipPath: HEXAGON_CLIP,
					backgroundColor: metadata.color,
					opacity: 0.3,
				}}
			/>

			{/* Inner Hexagon */}
			<div
				className="absolute inset-[2px] flex items-center justify-center"
				style={{
					clipPath: HEXAGON_CLIP,
					backgroundColor: "hsl(var(--background))",
				}}
			>
				{/* Icon Glow Background */}
				<div
					className="absolute inset-0 opacity-20"
					style={{
						background: `radial-gradient(circle at center, ${metadata.color} 0%, transparent 70%)`,
					}}
				/>

				{/* Level Icon */}
				<span
					className={cn(sizeConfig.icon, "relative z-10")}
					style={{ filter: `drop-shadow(0 0 4px ${metadata.color})` }}
				>
					{metadata.icon}
				</span>
			</div>

			{/* Active Pulse Ring */}
			{animate && (
				<motion.div
					className="absolute inset-0"
					style={{
						clipPath: HEXAGON_CLIP,
						border: `2px solid ${metadata.color}`,
					}}
					animate={{
						opacity: [0.5, 1, 0.5],
						scale: [1, 1.05, 1],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			)}
		</div>
	);

	if (!showLabel) {
		return BadgeContent;
	}

	return (
		<div className="flex flex-col items-center gap-1">
			{BadgeContent}
			<span
				className={cn("font-bold uppercase tracking-widest", sizeConfig.label)}
				style={{ color: metadata.color }}
			>
				{metadata.name}
			</span>
		</div>
	);
}

/**
 * Mini inline level indicator for compact displays
 */
export function LevelIndicator({
	level,
	className,
}: {
	level: MaturityLevel;
	className?: string;
}) {
	const metadata = LEVEL_METADATA[level];

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
				"border",
				className,
			)}
			style={{
				color: metadata.color,
				borderColor: metadata.color,
				clipPath:
					"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
			}}
		>
			<span>{metadata.icon}</span>
			<span>{metadata.name}</span>
		</span>
	);
}
