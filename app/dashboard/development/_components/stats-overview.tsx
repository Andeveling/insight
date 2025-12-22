"use client";

import {
	BookOpen,
	Flame,
	type LucideIcon,
	Target,
	TrendingUp,
	Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { GamifiedBadge, LevelBadge } from "@/components/gamification";
import { cn } from "@/lib/cn";
import { XpBar } from "./xp-bar";

interface StatItem {
	label: string;
	value: string;
	icon: LucideIcon;
	variant: "cyan" | "orange" | "teal" | "purple" | "gold";
}

interface StatsOverviewProps {
	xpTotal: number;
	currentLevel: number;
	minXp: number;
	maxXp: number;
	modulesCompleted: number;
	challengesCompleted: number;
	currentStreak?: number;
	className?: string;
}

/**
 * Stats Overview Component
 *
 * Displays key statistics about user's development progress using gamified badges.
 * Integrates Level and XP progress for a compact HUD experience.
 */
export function StatsOverview({
	xpTotal,
	currentLevel,
	minXp,
	maxXp,
	modulesCompleted,
	challengesCompleted,
	currentStreak = 0,
	className,
}: StatsOverviewProps) {
	const stats: StatItem[] = [
		{
			label: "XP Total",
			value: formatNumber(xpTotal),
			icon: Trophy,
			variant: "gold",
		},
		{
			label: "Módulos",
			value: modulesCompleted.toString(),
			icon: BookOpen,
			variant: "teal",
		},
		{
			label: "Desafíos",
			value: challengesCompleted.toString(),
			icon: Target,
			variant: "purple",
		},
	];

	// Add streak if active
	if (currentStreak > 0) {
		stats.push({
			label: "Racha",
			value: `${currentStreak} días`,
			icon: Flame,
			variant: "orange",
		});
	}

	return (
		<div
			className={cn(
				"relative flex flex-col gap-5 p-6 bg-background/60 border-l-2 border-primary/50 backdrop-blur-md",
				className,
			)}
			style={{
				clipPath:
					"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
			}}
		>
			<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
			{/* Top Row: Level and XP Bar */}
			<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
				<LevelBadge
					level={currentLevel}
					size="md"
					showName
					animated={false}
					className="shrink-0"
				/>
				<div className="flex-1 w-full">
					<XpBar
						currentXp={xpTotal}
						minXp={minXp}
						maxXp={maxXp}
						level={currentLevel}
						size="sm"
						className="w-full"
					/>
				</div>
			</div>

			{/* Bottom Row: Gamified Badges */}
			<div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
				{stats.map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, scale: 0.5, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{
							delay: index * 0.1,
							type: "spring",
							stiffness: 260,
							damping: 20,
						}}
					>
						<GamifiedBadge
							icon={stat.icon}
							value={stat.value}
							label={stat.label}
							variant={stat.variant}
							size="sm"
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}

/**
 * Format large numbers with K/M suffix
 */
function formatNumber(num: number): string {
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toString();
}
