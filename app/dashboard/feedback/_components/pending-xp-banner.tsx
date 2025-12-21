"use client";

/**
 * PendingXpBanner Component
 *
 * Shows total pending XP available from feedback requests
 * Part of Feature 008: Feedback Gamification Integration
 */

import { Coins, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { calculatePendingXpAction } from "../_actions/calculate-pending-xp";
import type { PendingXpSummary } from "../_utils/xp-calculator";

export function PendingXpBanner() {
	const [summary, setSummary] = useState<PendingXpSummary | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadPendingXp() {
			const result = await calculatePendingXpAction();
			if (result.success && result.data) {
				setSummary(result.data);
			}
			setLoading(false);
		}

		loadPendingXp();
	}, []);

	// Don't show banner if no pending XP
	if (loading || !summary || summary.totalPendingXp === 0) {
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="relative overflow-hidden p-px bg-amber-500/30 mb-8"
			style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
		>
			<div 
				className="relative bg-background/95 backdrop-blur-md p-5 flex items-center justify-between gap-6"
				style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
			>
				{/* Background Grid Pattern */}
				<div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-grid-white/[0.2]" />
				
				<div className="flex items-center gap-4 relative z-10">
					<div 
						className="h-12 w-12 flex items-center justify-center bg-amber-500/10 text-amber-500 relative"
						style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
					>
						<div className="absolute inset-0 bg-amber-500/20 blur-sm" />
						<Coins className="h-6 w-6 relative z-10" />
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80">XP_RESERVE_DETECTED</span>
							<Sparkles className="h-3 w-3 text-amber-500/50 animate-pulse" />
						</div>
						<h3 className="text-xl font-black uppercase tracking-tighter text-foreground">
							{summary.totalPendingXp} XP <span className="text-amber-500">Disponibles</span>
						</h3>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							{summary.pendingRequestsCount} TRANSMISION{summary.pendingRequestsCount !== 1 ? "ES" : ""} PENDIENTE{summary.pendingRequestsCount !== 1 ? "S" : ""}
						</p>
					</div>
				</div>

				<div className="text-right space-y-2 relative z-10">
					<div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">
						EST_PAYOUT_V.2
					</div>
					<motion.div
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-black uppercase tracking-widest"
						style={{ clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%)" }}
					>
						Reclamar ahora
					</motion.div>
				</div>
				
				{/* Decorative scanned line */}
				<div className="absolute left-0 top-0 h-full w-[2px] bg-linear-to-b from-transparent via-amber-500 to-transparent animate-scan" />
			</div>
		</motion.div>
	);
}
