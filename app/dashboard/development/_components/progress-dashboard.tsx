"use client";

import { motion } from "motion/react";
import {
	Trophy,
	Zap,
	Target,
	BookOpen,
	Award,
	Flame,
	TrendingUp,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "@/components/gamification";
import { XpBar } from "./index";
import Link from "next/link";

interface ProgressDashboardProps {
	progress: {
		xpTotal: number;
		formattedXp: string;
		xpToday: number;
		level: number;
		levelName: string;
		progressToNextLevel: number;
		xpForCurrentLevel: number;
		xpForNextLevel: number;
		isMaxLevel: boolean;
		modulesCompleted: number;
		modulesInProgress: number;
		challengesCompleted: number;
		totalChallenges: number;
		badgesUnlocked: number;
		totalBadges: number;
		currentStreak: number;
		longestStreak: number;
		lastActivityAt: Date | null;
		levelRoadmap: Array<{
			level: number;
			name: string;
			minXp: number;
			maxXp: number;
			isAchieved: boolean;
			isCurrent: boolean;
		}>;
	};
}

/**
 * Progress Dashboard Component
 *
 * Main dashboard showing user's gamification progress.
 * Displays XP, level, stats, and roadmap.
 */
export function ProgressDashboard({ progress }: ProgressDashboardProps) {
	const xpToNextLevel = progress.xpForNextLevel
		? progress.xpForNextLevel - progress.xpTotal
		: 0;

	return (
		<div className="space-y-6">
			{/* Hero Section - Level & XP */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-background border p-6"
			>
				<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
					{/* Level Badge */}
					<div className="flex items-center gap-4">
						<LevelBadge level={progress.level} size="lg" showName />
						<div>
							<h2 className="text-2xl font-bold">{progress.levelName}</h2>
							<p className="text-muted-foreground">
								{progress.formattedXp} XP total
							</p>
						</div>
					</div>

					{/* XP Progress to Next Level */}
					<div className="flex-1 max-w-md w-full">
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="text-muted-foreground">
								Progreso al nivel {progress.level + 1}
							</span>
							<span className="font-medium">
								{Math.round(progress.progressToNextLevel)}%
							</span>
						</div>
						<XpBar
							currentXp={progress.xpTotal}
							minXp={progress.xpForCurrentLevel}
							maxXp={progress.xpForNextLevel}
							level={progress.level}
							size="md"
							showLabels={false}
						/>
						{!progress.isMaxLevel && (
							<p className="text-xs text-muted-foreground mt-1">
								{xpToNextLevel.toLocaleString()} XP para el siguiente nivel
							</p>
						)}
					</div>
				</div>

				{/* Decorative background */}
				<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
			</motion.div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard
					icon={Zap}
					label="XP Hoy"
					value={`+${progress.xpToday}`}
					color="text-amber-500"
					bgColor="bg-amber-500/10"
					delay={0}
				/>
				<StatCard
					icon={BookOpen}
					label="Módulos"
					value={`${progress.modulesCompleted}/${
						progress.modulesCompleted + progress.modulesInProgress
					}`}
					sublabel="completados"
					color="text-blue-500"
					bgColor="bg-blue-500/10"
					delay={0.05}
				/>
				<StatCard
					icon={Target}
					label="Desafíos"
					value={progress.challengesCompleted.toString()}
					sublabel="completados"
					color="text-green-500"
					bgColor="bg-green-500/10"
					delay={0.1}
				/>
				<StatCard
					icon={Award}
					label="Insignias"
					value={`${progress.badgesUnlocked}/${progress.totalBadges}`}
					sublabel="desbloqueadas"
					color="text-purple-500"
					bgColor="bg-purple-500/10"
					delay={0.15}
				/>
			</div>

			{/* Streak & Roadmap Row */}
			<div className="grid md:grid-cols-2 gap-6">
				{/* Streak Card */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-lg">
								<Flame className="h-5 w-5 text-orange-500" />
								Racha de Actividad
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-baseline gap-2 mb-4">
								<span className="text-4xl font-bold">
									{progress.currentStreak}
								</span>
								<span className="text-muted-foreground">
									{progress.currentStreak === 1 ? "día" : "días"} consecutivos
								</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Mejor racha</span>
								<Badge variant="secondary">
									<Trophy className="h-3 w-3 mr-1" />
									{progress.longestStreak} días
								</Badge>
							</div>
							{progress.currentStreak > 0 && (
								<p className="text-xs text-muted-foreground mt-2">
									¡Mantén tu racha completando desafíos cada día!
								</p>
							)}
						</CardContent>
					</Card>
				</motion.div>

				{/* Level Roadmap Card */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.25 }}
				>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-lg">
								<TrendingUp className="h-5 w-5 text-primary" />
								Tu Camino de Niveles
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{progress.levelRoadmap.map((level) => (
									<div
										key={level.level}
										className={cn(
											"flex items-center gap-3 p-2 rounded-lg transition-colors",
											level.isCurrent && "bg-primary/10",
											level.isAchieved && "opacity-60",
										)}
									>
										<LevelBadge level={level.level} size="sm" />
										<div className="flex-1 min-w-0">
											<p
												className={cn(
													"font-medium text-sm",
													level.isCurrent && "text-primary",
												)}
											>
												{level.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{level.isAchieved
													? "Completado"
													: level.isCurrent
														? `${progress.xpTotal.toLocaleString()} / ${level.maxXp.toLocaleString()} XP`
														: `${level.minXp.toLocaleString()} XP requeridos`}
											</p>
										</div>
										{level.isAchieved && (
											<Badge variant="secondary" className="text-green-600">
												✓
											</Badge>
										)}
										{level.isCurrent && (
											<Progress
												value={progress.progressToNextLevel}
												className="w-16 h-1.5"
											/>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Action Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="flex flex-wrap gap-4"
			>
				<Link href="/dashboard/development">
					<Button variant="default">
						<BookOpen className="h-4 w-4 mr-2" />
						Explorar Módulos
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				</Link>
				<Link href="/dashboard/development/badges">
					<Button variant="outline">
						<Award className="h-4 w-4 mr-2" />
						Ver Insignias
					</Button>
				</Link>
			</motion.div>
		</div>
	);
}

/**
 * Stat Card Component
 */
interface StatCardProps {
	icon: typeof Trophy;
	label: string;
	value: string;
	sublabel?: string;
	color: string;
	bgColor: string;
	delay?: number;
}

function StatCard({
	icon: Icon,
	label,
	value,
	sublabel,
	color,
	bgColor,
	delay = 0,
}: StatCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay }}
		>
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<div className={cn("p-2 rounded-lg", bgColor)}>
							<Icon className={cn("h-5 w-5", color)} />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">{label}</p>
							<p className="text-xl font-bold">{value}</p>
							{sublabel && (
								<p className="text-xs text-muted-foreground">{sublabel}</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
