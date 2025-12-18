"use client";

/**
 * PendingXpBanner Component
 *
 * Shows total pending XP available from feedback requests
 * Part of Feature 008: Feedback Gamification Integration
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Coins, Sparkles } from "lucide-react";
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
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative overflow-hidden rounded-lg bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 p-4 mb-6"
		>
			{/* Background Sparkles */}
			<div className="absolute inset-0 opacity-20">
				<Sparkles
					className="absolute top-2 right-4 h-6 w-6 text-amber-500"
					aria-hidden="true"
				/>
				<Sparkles
					className="absolute bottom-3 left-8 h-4 w-4 text-orange-500"
					aria-hidden="true"
				/>
			</div>

			<div className="relative flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-amber-500/20 p-2">
						<Coins
							className="h-5 w-5 text-amber-600 dark:text-amber-400"
							aria-hidden="true"
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-foreground">XP Disponible</p>
						<p className="text-xs text-muted-foreground">
							{summary.pendingRequestsCount} solicitud
							{summary.pendingRequestsCount !== 1 ? "es" : ""} pendiente
							{summary.pendingRequestsCount !== 1 ? "s" : ""}
						</p>
					</div>
				</div>

				<div className="text-right">
					<motion.p
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
						className="text-2xl font-bold text-amber-600 dark:text-amber-400"
					>
						{summary.totalPendingXp} XP
					</motion.p>
					<p className="text-xs text-muted-foreground">Completa para ganar</p>
				</div>
			</div>
		</motion.div>
	);
}
