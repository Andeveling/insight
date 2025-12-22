"use client";

/**
 * FeedbackRequestCard Component
 *
 * Displays feedback request with XP indicator and urgency
 * Part of Feature 008: Feedback Gamification Integration
 */

import { AlertTriangle, Clock, Coins, Flame, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { GamifiedBadge } from "@/components/gamification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/cn";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";

export interface FeedbackRequestCardProps {
	requestId: string;
	requesterName: string;
	expiresAt: Date;
	xpReward: number;
	streakMultiplier?: number;
	isUrgent?: boolean;
}

/**
 * Card showing feedback request with gamification indicators
 */
export function FeedbackRequestCard({
	requestId,
	requesterName,
	expiresAt,
	xpReward,
	streakMultiplier = 1,
	isUrgent = false,
}: FeedbackRequestCardProps) {
	const daysUntilExpiration = Math.ceil(
		(expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
	);

	const baseXp = FEEDBACK_XP_REWARDS.FEEDBACK_GIVEN;
	const streakBonus =
		streakMultiplier > 1 ? Math.round(baseXp * (streakMultiplier - 1)) : 0;
	const totalXp = xpReward;

	const clipPath12 =
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="relative group"
		>
			<div
				className={cn(
					"relative overflow-hidden p-px transition-all duration-300",
					isUrgent
						? "bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
						: "bg-border/40",
				)}
				style={{ clipPath: clipPath12 }}
			>
				<div
					className={cn(
						"bg-background/95 backdrop-blur-sm p-4 h-full relative z-10",
						isUrgent && "bg-orange-500/[0.03]",
					)}
					style={{ clipPath: clipPath12 }}
				>
					{/* Scanned line for urgent requests */}
					{isUrgent && (
						<motion.div
							className="absolute top-0 left-0 w-full h-[1px] bg-orange-500/30 z-20 pointer-events-none"
							animate={{ top: ["0%", "100%", "0%"] }}
							transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
						/>
					)}

					<div className="flex items-start justify-between gap-4">
						{/* Request Info */}
						<div className="flex-1 min-w-0 space-y-3">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="text-sm font-black uppercase tracking-tight text-foreground truncate">
										{requesterName}
									</h3>
									{isUrgent && (
										<div
											className="px-2 py-0.5 bg-orange-500 text-orange-950 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"
											style={{
												clipPath: "polygon(4px 0, 100% 0, 100% 100%, 0 100%)",
											}}
										>
											<AlertTriangle className="h-3 w-3" />
											CRITICAL_PRIORITY
										</div>
									)}
								</div>
								<div className="flex items-center gap-3">
									<p
										className={cn(
											"text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5",
											isUrgent ? "text-orange-500" : "text-muted-foreground/60",
										)}
									>
										<Clock className="h-3 w-3" />
										{daysUntilExpiration > 0
											? `${daysUntilExpiration}D_RESTANTES`
											: "EXPIRA_HOY"}
									</p>
								</div>
							</div>
						</div>

						{/* XP Badge with Tooltip (T057) */}
						<div className="flex flex-col items-end gap-2">
							<HoverCard>
								<HoverCardTrigger asChild>
									<div className="cursor-help transition-transform hover:scale-105">
										<div
											className={cn(
												"relative flex items-center justify-center h-10 w-10 text-amber-500",
												isUrgent && "text-orange-500",
											)}
											style={{
												clipPath:
													"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
											}}
										>
											<div className="absolute inset-0 bg-current opacity-10" />
											<div className="absolute inset-0 border border-current opacity-30" />
											<Coins className="h-4 w-4 relative z-10" />
											<span className="absolute -bottom-1 right-0 text-[8px] font-black bg-background px-1 border border-current">
												{totalXp}
											</span>
										</div>
									</div>
								</HoverCardTrigger>
								<HoverCardContent
									className="w-64 border-primary/20 bg-background/95 backdrop-blur-md"
									align="end"
								>
									<div className="space-y-3">
										<div className="flex items-center gap-2 border-b border-border/40 pb-2">
											<Sparkles className="h-3.5 w-3.5 text-amber-500" />
											<h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
												DATA_PAYOUT_BREAKDOWN
											</h4>
										</div>
										<div className="space-y-1.5 text-[9px] font-bold uppercase tracking-widest">
											<div className="flex justify-between text-muted-foreground">
												<span>BASE_XP</span>
												<span>{baseXp} XP</span>
											</div>
											{streakBonus > 0 && (
												<div className="flex justify-between text-amber-500">
													<span className="flex items-center gap-1">
														<Flame className="h-2.5 w-2.5" />
														STREAK_X{streakMultiplier.toFixed(1)}
													</span>
													<span>+{streakBonus} XP</span>
												</div>
											)}
											<div className="flex justify-between border-t border-border/40 pt-1.5 mt-1.5 text-primary">
												<span>TOTAL_XP</span>
												<span className="font-black">{totalXp} XP</span>
											</div>
										</div>
									</div>
								</HoverCardContent>
							</HoverCard>

							{/* Streak Multiplier Indicator */}
							{streakMultiplier > 1 && (
								<div
									className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1"
									style={{
										clipPath: "polygon(4px 0, 100% 0, 100% 100%, 0 100%)",
									}}
								>
									<Flame className="h-2.5 w-2.5" />
									STREAK_X{streakMultiplier.toFixed(1)}
								</div>
							)}
						</div>
					</div>

					{/* Action Button */}
					<div className="mt-5">
						<Link
							href={`/dashboard/feedback/respond/${requestId}`}
							className="block"
						>
							<button
								className={cn(
									"w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
									isUrgent
										? "bg-orange-500 text-orange-950 hover:bg-orange-400"
										: "bg-muted border border-border text-foreground hover:border-primary/50",
								)}
								style={{ clipPath: clipPath8 }}
							>
								{isUrgent ? "RESPOND_IMMEDIATELY" : "RESPOND_FEEDBACK"}
							</button>
						</Link>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
