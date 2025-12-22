"use client";

/**
 * Boss Battle Card Component
 *
 * Displays a boss battle quest with 3x XP badge and special styling.
 * Features enhanced animations and a larger, more prominent design.
 */

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";
import { QuestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import type { QuestWithStrength } from "@/specs/012-strength-levels/contracts/get-daily-quests.schema";
import { completeQuest } from "../_actions/complete-quest";

interface BossBattleCardProps {
	quest: QuestWithStrength;
	cooldownUntil?: Date | null;
	onComplete?: (result: {
		xpAwarded: number;
		leveledUp: boolean;
		newLevel?: string;
	}) => void;
	className?: string;
}

const CARD_CLIP_PATH =
	"polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

const DIFFICULTY_STARS: Record<number, string> = {
	1: "★☆☆☆☆",
	2: "★★☆☆☆",
	3: "★★★☆☆",
	4: "★★★★☆",
	5: "★★★★★",
};

export function BossBattleCard({
	quest,
	cooldownUntil,
	onComplete,
	className,
}: BossBattleCardProps) {
	const [isPending, startTransition] = useTransition();
	const [isCompleted, setIsCompleted] = useState(quest.status === "COMPLETED");
	const [showXpAnimation, setShowXpAnimation] = useState(false);

	const difficultyStars =
		DIFFICULTY_STARS[
			Math.min(
				5,
				Math.max(
					1,
					(quest as unknown as { difficulty: number }).difficulty || 3,
				),
			)
		];
	const isInCooldown = cooldownUntil && new Date(cooldownUntil) > new Date();

	const cooldownRemaining = isInCooldown
		? formatDistanceToNow(new Date(cooldownUntil), {
				locale: es,
				addSuffix: false,
			})
		: null;

	const handleComplete = () => {
		if (isPending || isCompleted || isInCooldown) return;

		// Optimistic update
		setIsCompleted(true);
		setShowXpAnimation(true);

		startTransition(async () => {
			const result = await completeQuest({ questId: quest.id });

			if (!result.success) {
				// Rollback on error
				setIsCompleted(false);
				setShowXpAnimation(false);
				console.error("[BossBattleCard] Error completing quest:", result.error);
				return;
			}

			onComplete?.({
				xpAwarded: result.xpAwarded,
				leveledUp: result.leveledUp,
				newLevel: result.newLevel,
			});

			// Hide XP animation after delay
			setTimeout(() => setShowXpAnimation(false), 2500);
		});
	};

	return (
		<motion.div
			className={cn("relative group", className)}
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.9 }}
			layout
			data-testid="boss-battle-card"
		>
			{/* Glowing Border Effect */}
			<div
				className={cn(
					"absolute -inset-0.5 opacity-75 blur-sm transition-opacity duration-500",
					isCompleted ? "opacity-30" : "group-hover:opacity-100",
				)}
				style={{
					clipPath: CARD_CLIP_PATH,
					background: "linear-gradient(135deg, #EF4444, #F59E0B, #EF4444)",
				}}
			/>

			{/* Outer Border */}
			<div
				className={cn(
					"relative p-px transition-colors duration-300",
					isCompleted ? "opacity-60" : "",
				)}
				style={{
					clipPath: CARD_CLIP_PATH,
					background:
						"linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #EF4444 100%)",
				}}
			>
				{/* Inner Content */}
				<div
					className={cn(
						"relative bg-background/95 backdrop-blur-md p-6 transition-all duration-300",
						!isCompleted && !isInCooldown && "group-hover:bg-background/98",
					)}
					style={{ clipPath: CARD_CLIP_PATH }}
				>
					{/* Background Grid */}
					<div className="absolute inset-0 bg-grid-tech opacity-10" />

					{/* Pulsing Glow Effect */}
					{!isCompleted && !isInCooldown && (
						<motion.div
							className="absolute inset-0 pointer-events-none"
							style={{
								clipPath: CARD_CLIP_PATH,
								background:
									"radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)",
							}}
							animate={{
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
					)}

					{/* Scan Line Animation */}
					{!isCompleted && !isInCooldown && (
						<motion.div
							className="absolute inset-0 pointer-events-none overflow-hidden"
							style={{ clipPath: CARD_CLIP_PATH }}
						>
							<motion.div
								className="absolute left-0 right-0 h-0.5 opacity-50"
								style={{
									background:
										"linear-gradient(90deg, transparent, #EF4444, #F59E0B, #EF4444, transparent)",
								}}
								animate={{
									top: ["-5%", "105%"],
								}}
								transition={{
									duration: 2.5,
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								}}
							/>
						</motion.div>
					)}

					{/* Content */}
					<div className="relative z-10">
						{/* Header: Type Badge + 3x XP */}
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								{/* Boss Battle Badge */}
								<span
									className="px-3 py-1 text-xs font-bold uppercase tracking-widest"
									style={{
										background:
											"linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
										color: "white",
										clipPath:
											"polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
										boxShadow: "0 0 10px rgba(239,68,68,0.5)",
									}}
								>
									BOSS BATTLE
								</span>

								{/* 3x XP Badge */}
								<motion.span
									className="px-2 py-1 text-xs font-bold"
									style={{
										background:
											"linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
										color: "#1a1a1a",
										clipPath:
											"polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
										boxShadow: "0 0 8px rgba(245,158,11,0.5)",
									}}
									animate={{
										scale: [1, 1.05, 1],
									}}
									transition={{
										duration: 1.5,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
								>
									3x XP
								</motion.span>
							</div>

							{/* XP Reward */}
							<div
								className="flex items-center gap-1.5"
								data-testid="boss-xp-reward"
							>
								<span className="text-lg font-mono font-bold text-amber-400">
									+{quest.xpReward}
								</span>
								<span className="text-xs text-muted-foreground">XP</span>
							</div>
						</div>

						{/* Strength Name */}
						<p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">
							{quest.strengthNameEs || quest.strengthName}
						</p>

						{/* Title */}
						<h4
							className={cn(
								"text-lg font-bold uppercase tracking-wider text-foreground mb-2",
								isCompleted && "line-through text-muted-foreground",
							)}
						>
							{quest.title}
						</h4>

						{/* Description */}
						<p className="text-sm text-muted-foreground/80 mb-4 line-clamp-3">
							{quest.description}
						</p>

						{/* Footer: Difficulty + Cooldown + Action */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								{/* Difficulty */}
								<span className="text-sm text-amber-400/80" title="Dificultad">
									{difficultyStars}
								</span>

								{/* Cooldown Timer */}
								{isInCooldown && cooldownRemaining && (
									<span className="text-xs text-red-400/70 font-mono flex items-center gap-1">
										<span className="text-red-500">⏱</span>
										{cooldownRemaining}
									</span>
								)}
							</div>

							{/* Complete Button */}
							<motion.button
								onClick={handleComplete}
								disabled={isPending || isCompleted || !!isInCooldown}
								data-testid="boss-battle-complete-button"
								className={cn(
									"relative px-5 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-200",
									isCompleted
										? "bg-green-500/20 text-green-500 cursor-default"
										: isInCooldown
											? "bg-muted/20 text-muted-foreground cursor-not-allowed"
											: "text-white hover:scale-105 active:scale-95",
									isPending && "opacity-50 cursor-wait",
								)}
								style={{
									clipPath:
										"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
									...(!isCompleted && !isInCooldown
										? {
												background:
													"linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
												boxShadow: "0 0 15px rgba(239,68,68,0.4)",
											}
										: {}),
								}}
								whileHover={
									!isCompleted && !isInCooldown && !isPending
										? { scale: 1.03 }
										: undefined
								}
								whileTap={
									!isCompleted && !isInCooldown && !isPending
										? { scale: 0.97 }
										: undefined
								}
							>
								{isCompleted ? (
									<span className="flex items-center gap-1">
										<span>🏆</span>
										<span>DERROTADO</span>
									</span>
								) : isInCooldown ? (
									"EN COOLDOWN"
								) : isPending ? (
									"LUCHANDO..."
								) : (
									"ENFRENTAR"
								)}
							</motion.button>
						</div>
					</div>

					{/* XP Gain Animation */}
					<AnimatePresence>
						{showXpAnimation && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
								style={{ clipPath: CARD_CLIP_PATH }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{/* Background Flash */}
								<motion.div
									className="absolute inset-0"
									style={{
										background:
											"radial-gradient(circle at center, rgba(245,158,11,0.3) 0%, transparent 70%)",
									}}
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
									transition={{ duration: 1 }}
								/>

								{/* XP Text */}
								<motion.span
									className="text-4xl font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
									initial={{ opacity: 0, scale: 0.5, y: 0 }}
									animate={{
										opacity: [0, 1, 1, 0],
										scale: [0.5, 1.3, 1.2, 1],
										y: [0, -20, -30, -50],
									}}
									transition={{ duration: 1.5 }}
								>
									+{quest.xpReward} XP
								</motion.span>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Completed Overlay */}
					{isCompleted && (
						<motion.div
							className="absolute inset-0 bg-green-500/10 pointer-events-none flex items-center justify-center"
							style={{ clipPath: CARD_CLIP_PATH }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 200, damping: 15 }}
								className="text-6xl"
							>
								🏆
							</motion.div>
						</motion.div>
					)}

					{/* Cooldown Overlay */}
					{isInCooldown && (
						<div
							className="absolute inset-0 bg-background/50 pointer-events-none"
							style={{ clipPath: CARD_CLIP_PATH }}
						/>
					)}
				</div>
			</div>
		</motion.div>
	);
}
