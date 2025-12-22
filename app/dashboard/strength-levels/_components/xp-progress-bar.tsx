"use client";

/**
 * XP Progress Bar Component
 *
 * Animated progress bar for displaying XP progression toward next level.
 * Uses Framer Motion for smooth animations with CyberPunk styling.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
	LEVEL_METADATA,
	XP_THRESHOLDS,
} from "@/lib/constants/strength-levels.constants";
import {
	formatXpDisplay,
	getXpToNextLevel,
} from "@/lib/services/strength-levels/xp-calculator";
import type { MaturityLevel } from "@/lib/types/strength-levels.types";

interface XpProgressBarProps {
	currentXp: number;
	currentLevel: MaturityLevel;
	progressPercent: number;
	isMaxLevel?: boolean;
	showLabels?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
	sm: "h-2",
	md: "h-3",
	lg: "h-4",
} as const;

const CLIP_PATH_BAR =
	"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)";

export function XpProgressBar({
	currentXp,
	currentLevel,
	progressPercent,
	isMaxLevel = false,
	showLabels = true,
	className,
	size = "md",
}: XpProgressBarProps) {
	const levelMetadata = LEVEL_METADATA[currentLevel];
	const xpToNext = isMaxLevel
		? null
		: getXpToNextLevel(currentXp, currentLevel);
	const nextLevelXp = isMaxLevel
		? null
		: XP_THRESHOLDS[currentLevel].max
			? XP_THRESHOLDS[currentLevel].max! + 1
			: null;

	return (
		<div className={cn("w-full", className)} data-testid="xp-progress-bar">
			{/* Labels */}
			{showLabels && (
				<div className="flex justify-between items-center mb-1.5">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						XP
					</span>
					<span className="text-xs font-mono text-foreground/80">
						{formatXpDisplay(currentXp)}
						{!isMaxLevel && nextLevelXp && (
							<span className="text-muted-foreground">
								{" / "}
								{formatXpDisplay(nextLevelXp)}
							</span>
						)}
						{isMaxLevel && <span className="text-primary ml-1">[MAX]</span>}
					</span>
				</div>
			)}

			{/* Progress Bar Container */}
			<div
				className={cn(
					"relative w-full bg-muted/30 border border-border/50",
					SIZE_CLASSES[size],
				)}
				style={{ clipPath: CLIP_PATH_BAR }}
			>
				{/* Background Grid Pattern */}
				<div className="absolute inset-0 bg-grid-tech opacity-20" />

				{/* Animated Progress Fill */}
				<motion.div
					className="absolute inset-y-0 left-0"
					style={{
						backgroundColor: levelMetadata.color,
						clipPath: CLIP_PATH_BAR,
					}}
					initial={{ width: 0 }}
					animate={{ width: `${Math.min(progressPercent, 100)}%` }}
					transition={{
						duration: 0.8,
						ease: [0.4, 0, 0.2, 1],
					}}
				>
					{/* Glow Effect */}
					<div
						className="absolute inset-0"
						style={{
							boxShadow: `0 0 8px ${levelMetadata.color}, inset 0 1px 0 rgba(255,255,255,0.2)`,
						}}
					/>

					{/* Scan Line Animation */}
					<motion.div
						className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						animate={{
							x: ["-32px", "100%"],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "linear",
							repeatDelay: 1,
						}}
					/>
				</motion.div>

				{/* Notch Markers */}
				<div className="absolute inset-0 flex">
					{[25, 50, 75].map((percent) => (
						<div
							key={percent}
							className="absolute top-0 bottom-0 w-px bg-border/40"
							style={{ left: `${percent}%` }}
						/>
					))}
				</div>
			</div>

			{/* XP to Next Level */}
			{showLabels && !isMaxLevel && xpToNext !== null && (
				<div className="flex justify-end mt-1">
					<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
						{formatXpDisplay(xpToNext)} XP TO NEXT
					</span>
				</div>
			)}
		</div>
	);
}
