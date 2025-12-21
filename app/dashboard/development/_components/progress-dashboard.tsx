"use client";

import {
	Award,
	BookOpen,
	ChevronRight,
	Flame,
	Target,
	TrendingUp,
	Trophy,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { LevelBadge } from "@/components/gamification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import { XpBar } from "./index";

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

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<div className="space-y-6">
			{/* Hero Section - Level & XP */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative p-px bg-border/40 overflow-hidden"
				style={{ clipPath: clipPath16 }}
			>
				<div 
					className="relative z-10 bg-background/80 backdrop-blur-sm p-8"
					style={{ clipPath: clipPath16 }}
				>
					{/* Accent lines */}
					<div className="absolute top-0 left-0 w-32 h-1 bg-primary/40" />
					<div className="absolute top-0 left-0 w-1 h-32 bg-primary/40" />

					<div className="relative z-10 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-8">
						{/* Level Badge */}
						<div className="flex items-center gap-6">
							<div className="relative group/badge">
								<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover/badge:opacity-100 transition-opacity" />
								<LevelBadge level={progress.level} size="lg" showName />
							</div>
							<div className="space-y-1">
								<h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">
									{progress.levelName}
								</h2>
								<div className="flex items-center gap-2">
									<div className="h-1 w-8 bg-primary/50" />
									<p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
										{progress.formattedXp} XP TOTAL
									</p>
								</div>
							</div>
						</div>

						{/* XP Progress to Next Level */}
						<div className="flex-1 max-w-md w-full">
							<div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
								<span className="text-muted-foreground">
									Progreso al nivel {progress.level + 1}
								</span>
								<span className="text-primary">
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
								<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-3 flex items-center gap-2">
									<span className="h-1 w-1 bg-primary rounded-full animate-pulse" />
									{xpToNextLevel.toLocaleString()} XP para el siguiente nivel
								</p>
							)}
						</div>
					</div>

					{/* Decorative background grid */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full opacity-20" />
				</div>
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
					className="relative overflow-hidden p-px bg-border/40"
					style={{ clipPath: clipPath16 }}
				>
					<div className="bg-background/90 backdrop-blur-sm p-6" style={{ clipPath: clipPath16 }}>
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-orange-500/10 text-orange-500" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}>
								<Flame className="h-5 w-5" />
							</div>
							<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
								Racha de Actividad
							</h3>
						</div>
						
						<div className="flex items-baseline gap-3 mb-6">
							<span className="text-6xl font-black uppercase tracking-tighter text-foreground">
								{progress.currentStreak}
							</span>
							<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
								{progress.currentStreak === 1 ? "día" : "días"} consecutivos
							</span>
						</div>

						<div className="flex items-center justify-between p-3 bg-muted/20 border border-border/40">
							<span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Mejor racha</span>
							<div className="flex items-center gap-2">
								<Trophy className="h-3 w-3 text-primary" />
								<span className="text-xs font-black text-foreground">{progress.longestStreak} DÍAS</span>
							</div>
						</div>
						
						{progress.currentStreak > 0 && (
							<p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 mt-4 leading-relaxed">
								[PROTOCOLO_MANTENIMIENTO_ACTIVO]: Completa desafíos para preservar la racha.
							</p>
						)}
					</div>
				</motion.div>

				{/* Level Roadmap Card */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.25 }}
					className="relative overflow-hidden p-px bg-border/40"
					style={{ clipPath: clipPath16 }}
				>
					<div className="bg-background/90 backdrop-blur-sm p-6 h-full" style={{ clipPath: clipPath16 }}>
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2 bg-primary/10 text-primary" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}>
								<TrendingUp className="h-5 w-5" />
							</div>
							<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
								Camino de Niveles
							</h3>
						</div>

						<div className="space-y-4">
							{progress.levelRoadmap.map((level) => (
								<div
									key={level.level}
									className={cn(
										"group relative flex items-center gap-4 p-3 transition-colors",
										level.isCurrent ? "bg-primary/10 border-l-2 border-primary" : "bg-muted/10 border-l-2 border-transparent",
										level.isAchieved && "opacity-50"
									)}
								>
									<div className="relative z-10">
										<LevelBadge level={level.level} size="sm" />
									</div>
									<div className="flex-1 min-w-0">
										<p className={cn("text-xs font-black uppercase tracking-tight", level.isCurrent ? "text-primary" : "text-foreground")}>
											{level.name}
										</p>
										<p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
											{level.isAchieved
												? "COMPLETADO"
												: level.isCurrent
													? `${progress.xpTotal.toLocaleString()} / ${level.maxXp.toLocaleString()} XP`
													: `${level.minXp.toLocaleString()} XP REQUERIDOS`}
										</p>
									</div>
									{level.isAchieved && (
										<div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-black">
											✓
										</div>
									)}
									{level.isCurrent && (
										<Progress
											value={progress.progressToNextLevel}
											className="w-12 h-1 bg-primary/20"
										/>
									)}
								</div>
							))}
						</div>
					</div>
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
					<button 
						className="group/btn flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/90"
						style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
					>
						<BookOpen className="h-4 w-4" />
						Explorar Módulos
						<ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
					</button>
				</Link>
				<Link href="/dashboard/development/badges">
					<button 
						className="group/btn flex items-center gap-2 px-6 py-2.5 bg-muted border border-border text-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:border-primary/50"
						style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
					>
						<Award className="h-4 w-4" />
						Ver Insignias
					</button>
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
			className="relative overflow-hidden p-px bg-border/40"
			style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
		>
			<div 
				className="relative z-10 bg-background/90 backdrop-blur-sm p-4 h-full"
				style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
			>
				<div className="flex items-center gap-4">
					<div 
						className={cn("p-2 shrink-0 relative", color)}
						style={{ 
							clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							backgroundColor: "currentColor",
							opacity: 0.2
						}}
					/>
					<div className="absolute left-[24px] top-[24px] p-2">
						<Icon className={cn("h-4 w-4", color)} />
					</div>
					<div>
						<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
						<p className="text-xl font-black uppercase tracking-tighter text-foreground">{value}</p>
						{sublabel && (
							<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{sublabel}</p>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
