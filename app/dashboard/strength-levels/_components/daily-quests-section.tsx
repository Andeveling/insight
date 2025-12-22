/**
 * Daily Quests Section Component (RSC)
 *
 * Server component that fetches and displays daily quests with countdown timer.
 * Includes "All completed" state and next refresh time.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { getDailyQuests } from "../_actions/get-daily-quests";
import { DailyQuestsClient } from "./daily-quests-client";

const CARD_CLIP_PATH =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export async function DailyQuestsSection() {
	const result = await getDailyQuests();

	if (!result.success) {
		return (
			<div
				className="p-6 border border-destructive/30 bg-destructive/5 text-center"
				style={{ clipPath: CARD_CLIP_PATH }}
			>
				<p className="text-sm font-bold uppercase tracking-wider text-destructive">
					[ERROR_MISIONES]
				</p>
				<p className="text-xs text-muted-foreground mt-1">
					{result.error || "No se pudieron cargar las misiones"}
				</p>
			</div>
		);
	}

	const dailyQuests = result.quests.filter((q) => q.type === "DAILY");
	const bossQuests = result.quests.filter((q) => q.type === "BOSS_BATTLE");

	return (
		<DailyQuestsClient
			initialDailyQuests={dailyQuests}
			initialBossQuests={bossQuests}
			hasCompletedAll={result.hasCompletedAll}
			nextRefreshAt={result.nextRegenerationTime}
		/>
	);
}

/**
 * Skeleton loader for daily quests section
 */
export function DailyQuestsSectionSkeleton() {
	return (
		<div className="space-y-4">
			{/* Header Skeleton */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-4 w-24" />
			</div>

			{/* Quest Cards Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<QuestCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

function QuestCardSkeleton() {
	return (
		<div
			className="p-4 border border-border/30 bg-muted/10"
			style={{ clipPath: CARD_CLIP_PATH }}
		>
			<div className="flex items-center justify-between mb-3">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-12" />
			</div>
			<Skeleton className="h-3 w-20 mb-2" />
			<Skeleton className="h-5 w-3/4 mb-2" />
			<Skeleton className="h-3 w-full mb-3" />
			<div className="flex items-center justify-between">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-8 w-24" />
			</div>
		</div>
	);
}
