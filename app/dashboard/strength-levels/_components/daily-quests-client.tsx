"use client";

/**
 * Daily Quests Client Component
 *
 * Client component that handles quest interactions, animations,
 * and level-up notifications.
 */

import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { MaturityLevel } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import type { QuestWithStrength } from "@/specs/012-strength-levels/contracts/get-daily-quests.schema";
import { BossBattleCard } from "./boss-battle-card";
import {
	BossDefeatedAnimation,
	useBossDefeatedAnimation,
} from "./boss-defeated-animation";
import {
	LevelUpNotification,
	useLevelUpNotification,
} from "./level-up-notification";
import { QuestCard } from "./quest-card";
import { useXpGainToast, XpGainToast } from "./xp-gain-toast";

interface DailyQuestsClientProps {
	initialDailyQuests: QuestWithStrength[];
	initialBossQuests: QuestWithStrength[];
	hasCompletedAll: boolean;
	nextRefreshAt: Date | null;
}

const SECTION_CLIP_PATH =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export function DailyQuestsClient({
	initialDailyQuests,
	initialBossQuests,
	hasCompletedAll: initialHasCompletedAll,
	nextRefreshAt,
}: DailyQuestsClientProps) {
	const [dailyQuests, setDailyQuests] = useState(initialDailyQuests);
	const [bossQuests, setBossQuests] = useState(initialBossQuests);
	const [hasCompletedAll, setHasCompletedAll] = useState(
		initialHasCompletedAll,
	);
	const [countdown, setCountdown] = useState("");

	const xpToast = useXpGainToast();
	const levelUpModal = useLevelUpNotification();
	const bossDefeatedAnim = useBossDefeatedAnimation();

	// Update countdown timer
	useEffect(() => {
		if (!nextRefreshAt) return;

		const updateCountdown = () => {
			const now = new Date();
			const refreshDate = new Date(nextRefreshAt);
			const seconds = differenceInSeconds(refreshDate, now);

			if (seconds <= 0) {
				setCountdown("¡Nuevas misiones disponibles!");
				return;
			}

			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const secs = seconds % 60;

			setCountdown(
				`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
			);
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [nextRefreshAt]);

	// Handle quest completion
	const handleQuestComplete = useCallback(
		(
			questId: string,
			result: { xpAwarded: number; leveledUp: boolean; newLevel?: string },
		) => {
			// Show XP toast
			xpToast.showXpGain(result.xpAwarded);

			// Show level up notification if applicable
			if (result.leveledUp && result.newLevel) {
				const quest = [...dailyQuests, ...bossQuests].find(
					(q) => q.id === questId,
				);
				if (quest) {
					levelUpModal.showLevelUp(
						result.newLevel as MaturityLevel,
						quest.strengthNameEs || quest.strengthName,
					);
				}
			}

			// Remove completed quest from active lists
			setDailyQuests((prev) => prev.filter((q) => q.id !== questId));

			// Check if all completed
			const remainingDaily = dailyQuests.filter((q) => q.id !== questId);
			if (remainingDaily.length === 0) {
				setHasCompletedAll(true);
			}
		},
		[dailyQuests, bossQuests, xpToast, levelUpModal],
	);

	// Handle boss battle completion (special animation)
	const handleBossComplete = useCallback(
		(
			questId: string,
			result: { xpAwarded: number; leveledUp: boolean; newLevel?: string },
		) => {
			const quest = bossQuests.find((q) => q.id === questId);

			// Show boss defeated animation instead of simple toast
			bossDefeatedAnim.showAnimation(
				result.xpAwarded,
				quest?.strengthNameEs || quest?.strengthName || "Boss",
				result.leveledUp,
				result.newLevel as MaturityLevel | undefined,
			);

			// Remove completed boss from list
			setBossQuests((prev) => prev.filter((q) => q.id !== questId));
		},
		[bossQuests, bossDefeatedAnim],
	);

	return (
		<div className="space-y-8" data-testid="daily-quests-section">
			{/* Daily Quests Section */}
			<section>
				<div className="flex items-center justify-between mb-4">
					<div>
						<h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
							MISIONES DIARIAS
						</h3>
						<p className="text-xs text-muted-foreground/60 mt-0.5">
							Completa misiones para ganar XP
						</p>
					</div>

					{/* Countdown Timer */}
					{countdown && (
						<div
							className="px-3 py-1.5 text-xs font-mono text-primary border border-primary/30 bg-primary/5"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<span className="text-muted-foreground mr-1">Próximas:</span>
							{countdown}
						</div>
					)}
				</div>

				{/* All Completed State */}
				{hasCompletedAll && dailyQuests.length === 0 ? (
					<motion.div
						className="p-8 border border-green-500/30 bg-green-500/5 text-center"
						style={{ clipPath: SECTION_CLIP_PATH }}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<div className="text-4xl mb-4">🎉</div>
						<p className="text-sm font-bold uppercase tracking-wider text-green-500">
							¡TODAS LAS MISIONES COMPLETADAS!
						</p>
						<p className="text-xs text-muted-foreground/60 mt-2">
							Nuevas misiones disponibles en {countdown || "pronto"}
						</p>
					</motion.div>
				) : dailyQuests.length === 0 ? (
					<div
						className="p-8 border border-border/30 bg-muted/10 text-center"
						style={{ clipPath: SECTION_CLIP_PATH }}
					>
						<div className="text-4xl mb-4">🔍</div>
						<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
							NO HAY MISIONES DISPONIBLES
						</p>
						<p className="text-xs text-muted-foreground/60 mt-2">
							Configura tus fortalezas para recibir misiones diarias
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<AnimatePresence>
							{dailyQuests.map((quest) => (
								<QuestCard
									key={quest.id}
									quest={quest}
									onComplete={(result) => handleQuestComplete(quest.id, result)}
								/>
							))}
						</AnimatePresence>
					</div>
				)}
			</section>

			{/* Boss Battles Section */}
			{bossQuests.length > 0 && (
				<section>
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-sm font-bold uppercase tracking-widest text-red-500">
								BOSS BATTLES
							</h3>
							<p className="text-xs text-muted-foreground/60 mt-0.5">
								Desafíos semanales con 3x XP
							</p>
						</div>

						<div
							className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30"
							style={{
								clipPath:
									"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
							}}
						>
							3x XP
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<AnimatePresence>
							{bossQuests.map((quest) => (
								<BossBattleCard
									key={quest.id}
									quest={quest}
									onComplete={(result) => handleBossComplete(quest.id, result)}
								/>
							))}
						</AnimatePresence>
					</div>
				</section>
			)}

			{/* XP Gain Toast */}
			<XpGainToast
				xpAmount={xpToast.xpAmount}
				strengthName={xpToast.strengthName}
				isVisible={xpToast.isVisible}
				onAnimationComplete={xpToast.hideToast}
				className="bottom-8 right-8"
			/>

			{/* Level Up Notification */}
			{levelUpModal.newLevel && (
				<LevelUpNotification
					isOpen={levelUpModal.isOpen}
					onClose={levelUpModal.close}
					newLevel={levelUpModal.newLevel}
					strengthName={levelUpModal.strengthName}
					previousLevel={levelUpModal.previousLevel}
				/>
			)}

			{/* Boss Defeated Animation */}
			<BossDefeatedAnimation
				isOpen={bossDefeatedAnim.isOpen}
				onClose={bossDefeatedAnim.close}
				xpAwarded={bossDefeatedAnim.xpAwarded}
				strengthName={bossDefeatedAnim.strengthName}
				leveledUp={bossDefeatedAnim.leveledUp}
				newLevel={bossDefeatedAnim.newLevel}
			/>
		</div>
	);
}
