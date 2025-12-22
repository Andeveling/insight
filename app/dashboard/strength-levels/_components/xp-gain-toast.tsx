"use client";

/**
 * XP Gain Toast Component
 *
 * Animated toast notification showing XP gained from completing actions.
 * Features a flying animation towards progress bars.
 */

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface XpGainToastProps {
	xpAmount: number;
	strengthName?: string;
	isVisible: boolean;
	onAnimationComplete?: () => void;
	className?: string;
}

export function XpGainToast({
	xpAmount,
	strengthName,
	isVisible,
	onAnimationComplete,
	className,
}: XpGainToastProps) {
	return (
		<AnimatePresence onExitComplete={onAnimationComplete}>
			{isVisible && (
				<motion.div
					className={cn("fixed z-50 pointer-events-none", className)}
					initial={{ opacity: 0, scale: 0.5, y: 0 }}
					animate={{
						opacity: [0, 1, 1, 0],
						scale: [0.5, 1.2, 1, 0.8],
						y: [0, -20, -40, -80],
					}}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{
						duration: 1.5,
						times: [0, 0.2, 0.6, 1],
						ease: "easeOut",
					}}
					data-testid="xp-gain-toast"
				>
					<div
						className="relative px-6 py-3 bg-primary/90 backdrop-blur-md"
						style={{
							clipPath:
								"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
							boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
						}}
					>
						{/* Glow Effect */}
						<motion.div
							className="absolute inset-0 bg-primary/30"
							animate={{
								opacity: [0.3, 0.6, 0.3],
							}}
							transition={{
								duration: 0.5,
								repeat: 2,
								ease: "easeInOut",
							}}
							style={{
								clipPath:
									"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
							}}
						/>

						{/* Content */}
						<div className="relative z-10 flex flex-col items-center gap-1">
							<motion.span
								className="text-2xl font-bold text-primary-foreground"
								animate={{
									scale: [1, 1.1, 1],
								}}
								transition={{
									duration: 0.3,
									ease: "easeOut",
								}}
							>
								+{xpAmount} XP
							</motion.span>

							{strengthName && (
								<span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">
									{strengthName}
								</span>
							)}
						</div>

						{/* Particles */}
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							{[...Array(6)].map((_, i) => (
								<motion.div
									key={i}
									className="absolute w-1 h-1 bg-primary-foreground rounded-full"
									style={{
										left: `${20 + i * 12}%`,
										bottom: "50%",
									}}
									initial={{ opacity: 0, y: 0 }}
									animate={{
										opacity: [0, 1, 0],
										y: [-10, -30 - i * 5],
										x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3)],
									}}
									transition={{
										duration: 0.8,
										delay: i * 0.05,
										ease: "easeOut",
									}}
								/>
							))}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

/**
 * Hook for managing XP toast state
 */
export function useXpGainToast() {
	const [toastState, setToastState] = useState<{
		isVisible: boolean;
		xpAmount: number;
		strengthName?: string;
	}>({
		isVisible: false,
		xpAmount: 0,
	});

	const showXpGain = (xpAmount: number, strengthName?: string) => {
		setToastState({
			isVisible: true,
			xpAmount,
			strengthName,
		});
	};

	const hideToast = () => {
		setToastState((prev) => ({ ...prev, isVisible: false }));
	};

	return {
		...toastState,
		showXpGain,
		hideToast,
	};
}

// Need to import useState for the hook
import { useState } from "react";
