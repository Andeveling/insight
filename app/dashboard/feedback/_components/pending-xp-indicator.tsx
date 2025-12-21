"use client";

/**
 * PendingXpIndicator Component
 * Shows potential XP from pending feedback requests
 * Part of Feature 005: Gamification Integration
 */

import { Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";

export interface PendingXpIndicatorProps {
	/** Number of pending feedback requests */
	pendingCount: number;
	/** Compact mode for inline display */
	compact?: boolean;
	/** Optional additional CSS classes */
	className?: string;
}

/**
 * Calculate potential XP from pending requests
 */
function calculatePotentialXp(pendingCount: number): number {
	return pendingCount * FEEDBACK_XP_REWARDS.FEEDBACK_RECEIVED;
}

export default function PendingXpIndicator({
	pendingCount,
	compact = false,
	className,
}: PendingXpIndicatorProps) {
	if (pendingCount === 0) return null;

	const potentialXp = calculatePotentialXp(pendingCount);

	if (compact) {
		return (
			<div
				className={cn(
					"inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500/80",
					className,
				)}
			>
				<Zap className="h-3 w-3" />
				<span>EST_REWARD: +{potentialXp} XP</span>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex items-center gap-3 bg-amber-500/5 border-l-2 border-amber-500/50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em]",
				className,
			)}
			style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)" }}
		>
			<Zap className="h-4 w-4 text-amber-500" />
			<span className="text-foreground/80">
				{pendingCount} PENDIENTES // <span className="text-amber-500">MAX_PAYOUT: +{potentialXp} XP</span>
			</span>
		</div>
	);
}
