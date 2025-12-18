"use client";

import { Flame, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface XpGainToastProps {
	xpAmount: number;
	source?: string;
	streakBonus?: number;
	leveledUp?: boolean;
	newLevel?: number;
	onComplete?: () => void;
	autoCloseDelay?: number;
	className?: string;
}

/**
 * XP Gain Toast Component (Shared)
 *
 * Shows an animated notification when XP is earned.
 * Used by assessment, feedback, and development modules.
 */
export function XpGainToast({
	xpAmount,
	source,
	streakBonus,
	leveledUp,
	newLevel,
	onComplete,
	autoCloseDelay = 3000,
	className,
}: XpGainToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onComplete?.(), 300);
		}, autoCloseDelay);

		return () => clearTimeout(timer);
	}, [autoCloseDelay, onComplete]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					role="status"
					aria-live="polite"
					aria-label={`Has ganado ${xpAmount} puntos de experiencia`}
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 100, opacity: 0 }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
					className={cn(
						"fixed bottom-4 right-4 z-50",
						"flex flex-col gap-1 rounded-lg",
						"bg-linear-to-r from-amber-500 to-orange-500",
						"px-4 py-3 shadow-lg",
						"text-white",
						className,
					)}
				>
					<div className="flex items-center gap-3">
						{/* Animated Icon */}
						<motion.div
							initial={{ rotate: -20, scale: 0.8 }}
							animate={{ rotate: 0, scale: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
						>
							<Trophy className="h-5 w-5" aria-hidden="true" />
						</motion.div>

						{/* XP Amount */}
						<motion.span
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="text-lg font-bold"
						>
							+{xpAmount} XP
						</motion.span>

						{/* Streak Bonus Indicator */}
						{streakBonus && streakBonus > 0 && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3, type: "spring" }}
								className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs"
								aria-label={`Bonus de racha: ${streakBonus}%`}
							>
								<Flame className="h-3 w-3" aria-hidden="true" />
								<span>+{streakBonus}%</span>
							</motion.div>
						)}

						{/* Sparkle Particles */}
						<SparkleParticles />
					</div>

					{/* Source label */}
					{source && (
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-xs text-white/80 pl-8"
						>
							{source}
						</motion.span>
					)}

					{/* Level up indicator */}
					{leveledUp && newLevel && (
						<motion.div
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="text-xs font-medium text-white/90 pl-8"
						>
							¡Nivel {newLevel} alcanzado!
						</motion.div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

/**
 * Sparkle Particles Effect
 */
function SparkleParticles() {
	const particles = Array.from({ length: 6 }, (_, i) => ({
		id: i,
		delay: i * 0.1,
	}));

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute h-1 w-1 rounded-full bg-white/60"
					style={{
						left: `${20 + particle.id * 15}%`,
						top: "50%",
					}}
					initial={{ y: 0, opacity: 1 }}
					animate={{
						y: -20 - particle.id * 5,
						opacity: 0,
					}}
					transition={{
						delay: particle.delay,
						duration: 0.8,
						ease: "easeOut",
					}}
				/>
			))}
		</div>
	);
}
