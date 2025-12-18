"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/cn";

interface XpGainToastProps {
	xpAmount: number;
	onClose?: () => void;
	autoCloseDelay?: number;
	className?: string;
}

/**
 * XP Gain Toast Component
 *
 * Shows an animated notification when XP is earned.
 * Slides in from the right and auto-dismisses.
 */
export function XpGainToast({
	xpAmount,
	onClose,
	autoCloseDelay = 3000,
	className,
}: XpGainToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onClose?.(), 300);
		}, autoCloseDelay);

		return () => clearTimeout(timer);
	}, [autoCloseDelay, onClose]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ x: 100, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: 100, opacity: 0 }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
					className={cn(
						"fixed bottom-4 right-4 z-50",
						"flex items-center gap-3 rounded-lg",
						"bg-linear-to-r from-amber-500 to-orange-500",
						"px-4 py-3 shadow-lg",
						"text-white font-medium",
						className,
					)}
				>
					{/* Animated Icon */}
					<motion.div
						initial={{ rotate: -20, scale: 0.8 }}
						animate={{ rotate: 0, scale: 1 }}
						transition={{ delay: 0.2, type: "spring" }}
					>
						<Trophy className="h-5 w-5" />
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

					{/* Sparkle Particles */}
					<SparkleParticles />
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
					initial={{ y: 0, opacity: 1, scale: 0 }}
					animate={{
						y: [-20, -40],
						opacity: [1, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 0.8,
						delay: 0.3 + particle.delay,
						ease: "easeOut",
					}}
				/>
			))}
		</div>
	);
}
