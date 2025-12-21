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
import { GamifiedBadge } from "@/components/gamification";
import { cn } from "@/lib/cn";

interface StatItem {
	label: string;
	value: string;
	icon: LucideIcon;
	variant: "cyan" | "orange" | "teal" | "purple" | "gold";
}

interface StatsOverviewProps {
	xpTotal: number;
	currentLevel: number;
	modulesCompleted: number;
	challengesCompleted: number;
	currentStreak?: number;
	className?: string;
}

/**
 * Stats Overview Component
 *
 * Displays key statistics about user's development progress using gamified badges.
 */
export function StatsOverview({
	xpTotal,
	currentLevel,
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
			label: "Nivel",
			value: currentLevel.toString(),
			icon: TrendingUp,
			variant: "cyan",
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
				"flex flex-wrap gap-3 sm:gap-6 justify-center md:justify-start p-3 rounded-2xl bg-muted/20 border border-border/40 backdrop-blur-xs",
				className,
			)}
		>
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
