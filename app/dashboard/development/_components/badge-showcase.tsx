"use client";

import { Award, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { GeneratedBadge } from "@/components/gamification/generated-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import type { BadgeTier } from "@/lib/types";

interface BadgeData {
	id: string;
	key: string;
	nameEs: string;
	descriptionEs: string;
	iconUrl: string;
	tier: BadgeTier;
	xpReward: number;
	isUnlocked: boolean;
	unlockedAt: Date | null;
	progress: number;
	criteria: string | null;
}

interface BadgeShowcaseProps {
	badges: BadgeData[];
	unlockedCount: number;
	totalBadges: number;
	byTier: {
		bronze: { total: number; unlocked: number };
		silver: { total: number; unlocked: number };
		gold: { total: number; unlocked: number };
		platinum: { total: number; unlocked: number };
	};
}

const tierConfig = {
	bronze: {
		label: "Bronce",
		color: "text-amber-700 dark:text-amber-500",
		bgColor: "bg-amber-100 dark:bg-amber-900/30",
		borderColor: "border-amber-300 dark:border-amber-700",
		shadowColor: "hover:shadow-amber-500/25",
		gradient: "from-amber-500/5 to-transparent",
	},
	silver: {
		label: "Plata",
		color: "text-slate-500 dark:text-slate-400",
		bgColor: "bg-slate-100 dark:bg-slate-800/50",
		borderColor: "border-slate-300 dark:border-slate-600",
		shadowColor: "hover:shadow-slate-500/25",
		gradient: "from-slate-500/5 to-transparent",
	},
	gold: {
		label: "Oro",
		color: "text-yellow-600 dark:text-yellow-400",
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		borderColor: "border-yellow-400 dark:border-yellow-600",
		shadowColor: "hover:shadow-yellow-500/25",
		gradient: "from-yellow-500/5 to-transparent",
	},
	platinum: {
		label: "Platino",
		color: "text-cyan-600 dark:text-cyan-400",
		bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
		borderColor: "border-cyan-400 dark:border-cyan-600",
		shadowColor: "hover:shadow-cyan-500/25",
		gradient: "from-cyan-500/5 to-transparent",
	},
};

function TCGFrame({
	tier,
	isUnlocked,
}: { tier: BadgeTier; isUnlocked: boolean }) {
	const colors = {
		bronze: "#d97706",
		silver: "#94a3b8",
		gold: "#eab308",
		platinum: "#06b6d4",
	};

	const color = isUnlocked ? colors[tier] : "#52525b";

	return (
		<div className="absolute inset-0 pointer-events-none z-0">
			<svg
				className="w-full h-full"
				viewBox="0 0 300 400"
				preserveAspectRatio="none"
			>
				<defs>
					<pattern
						id={`grid-${tier}`}
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 20 0 L 0 0 0 20"
							fill="none"
							stroke={color}
							strokeWidth="0.5"
							opacity="0.1"
						/>
					</pattern>
				</defs>

				{/* Background Grid */}
				{isUnlocked && (
					<rect
						x="10"
						y="10"
						width="280"
						height="380"
						fill={`url(#grid-${tier})`}
						opacity="0.4"
					/>
				)}

				{/* Main Border Path with Cut corners */}
				<path
					d="M20,10 L280,10 L290,20 L290,380 L280,390 L20,390 L10,380 L10,20 Z"
					fill="none"
					stroke={color}
					strokeWidth="1.5"
					opacity={isUnlocked ? 0.6 : 0.3}
				/>

				{/* Corner Accents */}
				<path
					d="M10,40 L10,20 L20,10 L40,10"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M260,10 L280,10 L290,20 L290,40"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M290,360 L290,380 L280,390 L260,390"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M40,390 L20,390 L10,380 L10,360"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>

				{/* Tech Details */}
				<rect x="140" y="8" width="20" height="4" fill={color} opacity="0.8" />
				<rect
					x="140"
					y="388"
					width="20"
					height="4"
					fill={color}
					opacity="0.8"
				/>
			</svg>
		</div>
	);
}

/**
 * Badge Showcase Component
 *
 * Displays a grid of badges organized by tier.
 * Shows locked/unlocked state with progress for locked badges.
 */
export function BadgeShowcase({
	badges,
	unlockedCount,
	totalBadges,
	byTier,
}: BadgeShowcaseProps) {
	const [selectedTier, setSelectedTier] = useState<"all" | BadgeTier>("all");

	const filteredBadges =
		selectedTier === "all"
			? badges
			: badges.filter((b) => b.tier === selectedTier);

	return (
		<div className="space-y-6">
			{/* Summary */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center gap-4 text-sm"
			>
				<div className="flex items-center gap-2">
					<Award className="h-5 w-5 text-primary" />
					<span className="font-medium">
						{unlockedCount} / {totalBadges}
					</span>
					<span className="text-muted-foreground">insignias desbloqueadas</span>
				</div>
			</motion.div>

			{/* Tier Tabs */}
			<Tabs
				value={selectedTier}
				onValueChange={(v) => setSelectedTier(v as "all" | BadgeTier)}
			>
				<TabsList className="grid w-full grid-cols-5">
					<TabsTrigger value="all">Todas ({totalBadges})</TabsTrigger>
					{(Object.keys(tierConfig) as BadgeTier[]).map((tier) => (
						<TabsTrigger key={tier} value={tier}>
							{tierConfig[tier].label} ({byTier[tier].unlocked}/
							{byTier[tier].total})
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={selectedTier} className="mt-6">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{filteredBadges.map((badge, index) => (
							<BadgeCard key={badge.id} badge={badge} index={index} />
						))}
					</div>

					{filteredBadges.length === 0 && (
						<div className="text-center py-12 text-muted-foreground">
							No hay insignias en esta categoría
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}

/**
 * Individual Badge Card
 */
function BadgeCard({ badge, index }: { badge: BadgeData; index: number }) {
	const tier = tierConfig[badge.tier];

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.05 }}
						whileHover={{ y: -5 }}
						className="h-full"
					>
						<Card
							className={cn(
								"relative overflow-hidden transition-all duration-300 group h-full flex flex-col border-0 bg-transparent shadow-none",
								badge.isUnlocked
									? cn(tier.shadowColor, "hover:shadow-lg")
									: "opacity-70 grayscale-[0.8]",
							)}
						>
							{/* Card Background Surface */}
							<div
								className={cn(
									"absolute inset-0.5 rounded-lg border bg-card/80 backdrop-blur-sm z-0",
									badge.isUnlocked
										? tier.borderColor
										: "border-muted/20 bg-muted/5",
								)}
							/>

							{/* TCG Frame Overlay */}
							<TCGFrame tier={badge.tier} isUnlocked={badge.isUnlocked} />

							{/* Background Gradient */}
							{badge.isUnlocked && (
								<div
									className={cn(
										"absolute inset-1 bg-linear-to-b opacity-10 z-0",
										tier.gradient,
									)}
								/>
							)}

							<CardContent className="pt-8 pb-6 text-center relative z-10 flex flex-col h-full px-4">
								{/* Badge Icon */}
								<div className="relative mx-auto mb-4 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 shrink-0">
									{/* Glow behind badge */}
									{badge.isUnlocked && (
										<div
											className={cn(
												"absolute inset-0 blur-2xl opacity-40 rounded-full scale-150",
												tier.bgColor,
											)}
										/>
									)}

									<GeneratedBadge
										badgeKey={badge.key}
										tier={badge.tier}
										iconUrl={badge.iconUrl}
										isUnlocked={badge.isUnlocked}
										size="lg"
										className="drop-shadow-xl"
									/>

									{/* Unlocked Check */}
									{badge.isUnlocked && (
										<div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 z-40 shadow-lg border-2 border-background">
											<CheckCircle2 className="h-3 w-3 text-white" strokeWidth={3} />
										</div>
									)}
								</div>

								{/* Badge Name */}
								<h3
									className={cn(
										"font-bold text-base mb-1 leading-tight min-h-10 flex items-center justify-center",
										!badge.isUnlocked && "text-muted-foreground",
									)}
								>
									{badge.nameEs}
								</h3>

								{/* Tier Badge */}
								<div className="mt-1 mb-3 shrink-0">
									<span
										className={cn(
											"text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
											badge.isUnlocked
												? cn(tier.color, tier.borderColor, "bg-background/50")
												: "text-muted-foreground border-muted",
										)}
									>
										{tier.label}
									</span>
								</div>

								{/* Progress for locked badges - Fixed height container */}
								<div className="mt-auto pt-2">
									{!badge.isUnlocked && badge.progress > 0 ? (
										<div className="space-y-1.5">
											<Progress
												value={badge.progress}
												className="h-2 bg-muted"
												aria-label={`Progreso hacia ${badge.nameEs}: ${Math.round(
													badge.progress,
												)}%`}
											/>
											<p className="text-xs font-medium text-muted-foreground">
												{Math.round(badge.progress)}% Completado
											</p>
										</div>
									) : (
										<div className="h-[26px]" /> /* Spacer to maintain height */
									)}

									{/* XP Reward */}
									<div className="mt-3">
										{badge.isUnlocked ? (
											<div
												className={cn(
													"inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-background/50 border",
													tier.borderColor,
													tier.color,
												)}
											>
												<span>+{badge.xpReward} XP</span>
											</div>
										) : (
											<p className="text-xs text-muted-foreground font-medium">
												Recompensa: {badge.xpReward} XP
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					className="max-w-xs p-4 border-primary/20 bg-popover/95 backdrop-blur-md"
				>
					<p className="font-bold text-base mb-1 text-primary">{badge.nameEs}</p>
					<p className="text-sm text-muted-foreground leading-relaxed">
						{badge.descriptionEs}
					</p>
					{badge.isUnlocked && badge.unlockedAt && (
						<div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
							<CheckCircle2 className="h-3 w-3 text-green-500" />
							<span>
								Desbloqueado el{" "}
								{new Date(badge.unlockedAt).toLocaleDateString("es-ES", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</span>
						</div>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
