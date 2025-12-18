"use client";

/**
 * FeedbackRequestCard Component
 *
 * Displays feedback request with XP indicator and urgency
 * Part of Feature 008: Feedback Gamification Integration
 */

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Coins, Flame, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GamifiedBadge } from "@/components/gamification";
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

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card
				className={cn(
					"transition-all hover:shadow-md relative overflow-hidden",
					isUrgent && "border-orange-500/50 bg-orange-500/5",
				)}
			>
				{/* Urgent pulse animation overlay */}
				{isUrgent && (
					<motion.div
						className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none"
						animate={{ opacity: [0.3, 0.6, 0.3] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				)}

				<CardContent className="p-4 relative">
					<div className="flex items-start justify-between gap-4">
						{/* Request Info */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<h3 className="font-medium text-foreground truncate">
									{requesterName}
								</h3>
								{isUrgent && (
									<span className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
										<AlertTriangle className="h-3 w-3" aria-hidden="true" />
										Urgente
									</span>
								)}
							</div>
							<div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
								<span
									className={cn(
										"flex items-center gap-1",
										isUrgent &&
											"text-orange-600 dark:text-orange-400 font-medium",
									)}
								>
									<Clock className="h-3 w-3" aria-hidden="true" />
									{daysUntilExpiration > 0
										? `${daysUntilExpiration} día${
												daysUntilExpiration !== 1 ? "s" : ""
											} restante${daysUntilExpiration !== 1 ? "s" : ""}`
										: "¡Expira hoy!"}
								</span>
							</div>
						</div>

						{/* XP Badge with Tooltip (T057) */}
						<div className="flex flex-col items-end gap-2">
							<HoverCard>
								<HoverCardTrigger asChild>
									<div className="cursor-help">
										<GamifiedBadge
											icon={Coins}
											value={totalXp}
											label="XP"
											variant="gold"
											iconFill
											size="md"
											className={cn(
												"transition-transform hover:scale-110",
												isUrgent && "ring-2 ring-orange-500/50",
											)}
										/>
									</div>
								</HoverCardTrigger>
								<HoverCardContent className="w-64" align="end">
									<div className="space-y-2">
										<h4 className="font-semibold text-sm flex items-center gap-2">
											<Sparkles className="h-4 w-4 text-amber-500" />
											Desglose de XP
										</h4>
										<div className="space-y-1 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">Base</span>
												<span className="font-medium">{baseXp} XP</span>
											</div>
											{streakBonus > 0 && (
												<div className="flex justify-between text-amber-600 dark:text-amber-400">
													<span className="flex items-center gap-1">
														<Flame className="h-3 w-3" />
														Racha x{streakMultiplier.toFixed(1)}
													</span>
													<span className="font-medium">+{streakBonus} XP</span>
												</div>
											)}
											<div className="flex justify-between border-t pt-1 mt-1">
												<span className="font-semibold">Total</span>
												<span className="font-bold text-primary">
													{totalXp} XP
												</span>
											</div>
										</div>
									</div>
								</HoverCardContent>
							</HoverCard>

							{/* Streak Multiplier Indicator */}
							{streakMultiplier > 1 && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring" }}
									className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"
								>
									<Flame className="h-3 w-3" aria-hidden="true" />
									<span>x{streakMultiplier.toFixed(1)}</span>
								</motion.div>
							)}
						</div>
					</div>

					{/* Action Button */}
					<div className="mt-4">
						<Link href={`/dashboard/feedback/respond/${requestId}`}>
							<Button
								variant={isUrgent ? "default" : "outline"}
								className={cn(
									"w-full",
									isUrgent && "bg-orange-600 hover:bg-orange-700",
								)}
								size="sm"
							>
								{isUrgent ? "Responder ahora" : "Responder Feedback"}
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
