"use client";

import { motion } from "motion/react";
import { BookOpen, Target, Trophy, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
 * Displays key statistics about user's development progress.
 */
export function StatsOverview({
	xpTotal,
	currentLevel,
	modulesCompleted,
	challengesCompleted,
	currentStreak = 0,
	className,
}: StatsOverviewProps) {
	const stats = [
		{
			label: "XP Total",
			value: formatNumber(xpTotal),
			icon: Trophy,
			color: "text-amber-500",
			bgColor: "bg-amber-100 dark:bg-amber-900/30",
		},
		{
			label: "Nivel",
			value: currentLevel.toString(),
			icon: TrendingUp,
			color: "text-blue-500",
			bgColor: "bg-blue-100 dark:bg-blue-900/30",
		},
		{
			label: "Módulos",
			value: modulesCompleted.toString(),
			icon: BookOpen,
			color: "text-green-500",
			bgColor: "bg-green-100 dark:bg-green-900/30",
		},
		{
			label: "Desafíos",
			value: challengesCompleted.toString(),
			icon: Target,
			color: "text-purple-500",
			bgColor: "bg-purple-100 dark:bg-purple-900/30",
		},
	];

	// Add streak if active
	if (currentStreak > 0) {
		stats.push({
			label: "Racha",
			value: `${currentStreak} días`,
			icon: Flame,
			color: "text-orange-500",
			bgColor: "bg-orange-100 dark:bg-orange-900/30",
		});
	}

	return (
		<div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
			{stats.map((stat, index) => (
				<motion.div
					key={stat.label}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
				>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.label}
							</CardTitle>
							<div className={cn("rounded-md p-2", stat.bgColor)}>
								<stat.icon className={cn("h-4 w-4", stat.color)} />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
						</CardContent>
					</Card>
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
