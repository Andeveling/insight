"use client";

/**
 * FeedbackSuccessCelebration Component
 *
 * Orchestrates celebration sequence after feedback completion
 * Shows XP toast, level up modal, and badge unlock modals
 * Part of Feature 008: Feedback Gamification Integration
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	useGamificationCelebration,
	type CelebrationSequence,
} from "../_hooks/use-gamification-celebration";
import {
	XpGainToast,
	LevelUpNotification,
	BadgeUnlockModal,
} from "@/components/gamification";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export interface FeedbackSuccessCelebrationProps {
	celebrationData: CelebrationSequence;
	onComplete?: () => void;
}

/**
 * Main celebration component shown after feedback submission
 * Manages animation sequence and navigation
 */
export function FeedbackSuccessCelebration({
	celebrationData,
	onComplete,
}: FeedbackSuccessCelebrationProps) {
	const router = useRouter();
	const {
		state,
		startCelebration,
		handleLevelUpComplete,
		handleBadgeComplete,
	} = useGamificationCelebration();

	// Start celebration sequence on mount
	useEffect(() => {
		startCelebration(celebrationData);
	}, [startCelebration, celebrationData]);

	const handleContinue = () => {
		onComplete?.();
		router.push("/dashboard/feedback");
	};

	const { xpData, currentBadge } = state;

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
			{/* Success Message */}
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="flex flex-col items-center gap-4 text-center"
			>
				<div className="rounded-full bg-success/10 p-6">
					<CheckCircle className="h-16 w-16 text-success" aria-hidden="true" />
				</div>

				<div>
					<h1 className="text-2xl font-bold">¡Feedback enviado!</h1>
					<p className="text-muted-foreground mt-2">
						Gracias por compartir tu perspectiva valiosa
					</p>
				</div>
			</motion.div>

			{/* XP Summary */}
			{xpData && (
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="rounded-lg border bg-card p-6 text-center"
				>
					<p className="text-sm text-muted-foreground">Has ganado</p>
					<p className="text-4xl font-bold text-primary">
						{xpData.xpAwarded} XP
					</p>
					{xpData.streakMultiplier > 1 && (
						<p className="text-sm text-muted-foreground mt-2">
							Con bonus de racha x{xpData.streakMultiplier.toFixed(1)}
						</p>
					)}
					<div className="mt-4 pt-4 border-t">
						<p className="text-sm text-muted-foreground">XP Total</p>
						<p className="text-xl font-semibold">{xpData.totalXp} XP</p>
					</div>
				</motion.div>
			)}

			{/* Continue Button */}
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.6 }}
			>
				<Button onClick={handleContinue} size="lg">
					Continuar
				</Button>
			</motion.div>

			{/* XP Toast (auto-appears) */}
			{state.showXpToast && xpData && (
				<XpGainToast
					xpAmount={xpData.xpAwarded}
					source="feedback_given"
					streakBonus={
						xpData.streakMultiplier > 1
							? (xpData.streakMultiplier - 1) * 100
							: undefined
					}
					leveledUp={xpData.leveledUp}
					newLevel={xpData.newLevel}
				/>
			)}

			{/* Level Up Modal */}
			{xpData && (
				<LevelUpNotification
					previousLevel={xpData.previousLevel}
					newLevel={xpData.newLevel}
					open={state.showLevelUpModal}
					onOpenChange={(open) => {
						if (!open) handleLevelUpComplete();
					}}
				/>
			)}

			{/* Badge Unlock Modal */}
			<BadgeUnlockModal
				badge={
					currentBadge
						? {
								name: currentBadge.badge.name,
								description: currentBadge.badge.description,
								tier: currentBadge.badge.tier,
								xpReward: currentBadge.badge.xpReward,
								iconUrl: currentBadge.badge.iconUrl,
							}
						: null
				}
				open={state.showBadgeModal}
				onOpenChange={(open) => {
					if (!open) handleBadgeComplete();
				}}
			/>
		</div>
	);
}
