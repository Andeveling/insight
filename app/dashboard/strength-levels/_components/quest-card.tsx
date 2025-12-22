"use client";

/**
 * Quest Card Component
 *
 * Displays a single quest with completion button and optimistic update animations.
 * Uses CyberPunk styling with scan lines and hexagonal elements.
 */

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";
import { QuestStatus, QuestType } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import type { QuestWithStrength } from "@/specs/012-strength-levels/contracts/get-daily-quests.schema";
import { completeQuest } from "../_actions/complete-quest";

interface QuestCardProps {
	quest: QuestWithStrength;
	onComplete?: (result: {
		xpAwarded: number;
		leveledUp: boolean;
		newLevel?: string;
	}) => void;
	className?: string;
}

const CARD_CLIP_PATH =
	"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

const DIFFICULTY_STARS: Record<number, string> = {
	1: "★☆☆☆☆",
	2: "★★☆☆☆",
	3: "★★★☆☆",
	4: "★★★★☆",
	5: "★★★★★",
};

const QUEST_TYPE_CONFIG: Record<
	string,
	{ label: string; color: string; multiplier?: string }
> = {
	DAILY: { label: "DIARIA", color: "#22D3EE" },
	BOSS_BATTLE: { label: "BOSS BATTLE", color: "#EF4444", multiplier: "3x" },
	COMBO_BREAKER: { label: "COMBO", color: "#A78BFA", multiplier: "2x" },
	COOPERATIVE: { label: "COOPERATIVA", color: "#10B981" },
};

export function QuestCard({ quest, onComplete, className }: QuestCardProps) {
	const [isPending, startTransition] = useTransition();
	const [isCompleted, setIsCompleted] = useState(quest.status === "COMPLETED");
	const [showXpAnimation, setShowXpAnimation] = useState(false);

	const typeConfig = QUEST_TYPE_CONFIG[quest.type] || QUEST_TYPE_CONFIG.DAILY;
	const difficultyStars =
		DIFFICULTY_STARS[
			Math.min(
				5,
				Math.max(
					1,
					(quest as unknown as { difficulty: number }).difficulty || 1,
				),
			)
		];

	const handleComplete = () => {
		if (isPending || isCompleted) return;

		// Optimistic update
		setIsCompleted(true);
		setShowXpAnimation(true);

		startTransition(async () => {
			const result = await completeQuest({ questId: quest.id });

			if (!result.success) {
				// Rollback on error
				setIsCompleted(false);
				setShowXpAnimation(false);
				console.error("[QuestCard] Error completing quest:", result.error);
				return;
			}

			onComplete?.({
				xpAwarded: result.xpAwarded,
				leveledUp: result.leveledUp,
				newLevel: result.newLevel,
			});

			// Hide XP animation after delay
			setTimeout(() => setShowXpAnimation(false), 2000);
		});
	};

	const timeRemaining = quest.expiresAt
		? formatDistanceToNow(new Date(quest.expiresAt), {
				locale: es,
				addSuffix: false,
			})
		: null;

	return (
		<motion.div
			className={cn("relative group", className)}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			layout
			data-testid="quest-card"
		>
			{/* Outer Border */}
			<div
				className={cn(
					"p-px transition-colors duration-300",
					isCompleted ? "opacity-60" : "",
				)}
				style={{
					clipPath: CARD_CLIP_PATH,
					backgroundColor: `${typeConfig.color}40`,
				}}
			>
				{/* Inner Content */}
				<div
					className={cn(
						"relative bg-background/90 backdrop-blur-md p-4 transition-all duration-300",
						!isCompleted && "group-hover:bg-background/95",
					)}
					style={{ clipPath: CARD_CLIP_PATH }}
				>
					{/* Background Grid */}
					<div className="absolute inset-0 bg-grid-tech opacity-5" />

					{/* Scan Line Animation (only on hover and not completed) */}
					{!isCompleted && (
						<motion.div
							className="absolute inset-0 pointer-events-none overflow-hidden"
							style={{ clipPath: CARD_CLIP_PATH }}
						>
							<motion.div
								className="absolute left-0 right-0 h-[2px] opacity-30"
								style={{
									background: `linear-gradient(90deg, transparent, ${typeConfig.color}, transparent)`,
								}}
								animate={{
									top: ["-10%", "110%"],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						</motion.div>
					)}

					{/* Content */}
					<div className="relative z-10">
						{/* Header: Type Badge + XP Reward */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								{/* Type Badge */}
								<span
									className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
									style={{
										backgroundColor: `${typeConfig.color}20`,
										color: typeConfig.color,
										clipPath:
											"polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
									}}
								>
									{typeConfig.label}
								</span>

								{/* XP Multiplier Badge */}
								{typeConfig.multiplier && (
									<span
										className="px-1.5 py-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/20"
										style={{
											clipPath:
												"polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)",
										}}
									>
										{typeConfig.multiplier} XP
									</span>
								)}
							</div>

							{/* XP Reward */}
							<div className="flex items-center gap-1">
								<span className="text-xs font-mono text-primary">
									+{quest.xpReward}
								</span>
								<span className="text-[10px] text-muted-foreground">XP</span>
							</div>
						</div>

						{/* Strength Name */}
						<p
							className="text-[10px] font-bold uppercase tracking-widest mb-1"
							style={{ color: typeConfig.color }}
						>
							{quest.strengthNameEs || quest.strengthName}
						</p>

						{/* Title */}
						<h4
							className={cn(
								"text-sm font-bold uppercase tracking-wider text-foreground mb-2",
								isCompleted && "line-through text-muted-foreground",
							)}
						>
							{quest.title}
						</h4>

						{/* Description */}
						<p className="text-xs text-muted-foreground/80 mb-3 line-clamp-2">
							{quest.description}
						</p>

						{/* Footer: Difficulty + Time + Action */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{/* Difficulty */}
								<span className="text-xs text-amber-400/70" title="Dificultad">
									{difficultyStars}
								</span>

								{/* Time Remaining */}
								{timeRemaining && !isCompleted && (
									<span className="text-[10px] text-muted-foreground font-mono">
										⏱ {timeRemaining}
									</span>
								)}
							</div>

							{/* Complete Button */}
							<motion.button
								onClick={handleComplete}
								disabled={isPending || isCompleted}
								data-testid="quest-complete-button"
								className={cn(
									"relative px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-200",
									isCompleted
										? "bg-green-500/20 text-green-500 cursor-default"
										: "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95",
									isPending && "opacity-50 cursor-wait",
								)}
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
								whileHover={
									!isCompleted && !isPending ? { scale: 1.02 } : undefined
								}
								whileTap={
									!isCompleted && !isPending ? { scale: 0.98 } : undefined
								}
							>
								{isCompleted ? (
									<span className="flex items-center gap-1">
										<span>✓</span>
										<span>COMPLETADA</span>
									</span>
								) : isPending ? (
									"PROCESANDO..."
								) : (
									"COMPLETAR"
								)}
							</motion.button>
						</div>
					</div>

					{/* XP Gain Animation */}
					<AnimatePresence>
						{showXpAnimation && (
							<motion.div
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1, y: -30 }}
								exit={{ opacity: 0, y: -60 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
							>
								<span className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
									+{quest.xpReward} XP
								</span>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Completed Overlay */}
					{isCompleted && (
						<motion.div
							className="absolute inset-0 bg-green-500/5 pointer-events-none"
							style={{ clipPath: CARD_CLIP_PATH }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						/>
					)}
				</div>
			</div>
		</motion.div>
	);
}
