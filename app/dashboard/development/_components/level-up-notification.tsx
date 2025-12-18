"use client";

import { ChevronUp, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LevelBadge } from "@/components/gamification";
import { cn } from "@/lib/cn";
import {
	getLevelColor,
	getLevelName,
} from "@/lib/services/level-calculator.service";

interface LevelUpNotificationProps {
	previousLevel: number;
	newLevel: number;
	onClose?: () => void;
	autoCloseDelay?: number;
	className?: string;
}

/**
 * Level Up Notification Component
 *
 * Displays an animated celebration modal when user levels up.
 * Features scale animation, confetti effect, and auto-dismiss.
 */
export function LevelUpNotification({
	previousLevel,
	newLevel,
	onClose,
	autoCloseDelay = 5000,
	className,
}: LevelUpNotificationProps) {
	const [isVisible, setIsVisible] = useState(true);
	const newLevelName = getLevelName(newLevel);
	const newLevelColor = getLevelColor(newLevel);

	// Auto-close after delay
	useEffect(() => {
		if (autoCloseDelay > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				onClose?.();
			}, autoCloseDelay);

			return () => clearTimeout(timer);
		}
	}, [autoCloseDelay, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		onClose?.();
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
					/>

					{/* Modal */}
					<motion.div
						className={cn(
							"fixed inset-0 z-50 flex items-center justify-center p-4",
							className,
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="relative flex flex-col items-center gap-6 rounded-2xl border bg-card p-8 shadow-2xl max-w-sm w-full"
							initial={{ scale: 0.5, y: 50 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{
								type: "spring",
								damping: 20,
								stiffness: 300,
							}}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Decorative Particles */}
							<ConfettiParticles color={newLevelColor} />

							{/* Icon */}
							<motion.div
								className={cn(
									"flex h-20 w-20 items-center justify-center rounded-full",
									getIconBgClass(newLevelColor),
								)}
								initial={{ scale: 0, rotate: -180 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{
									type: "spring",
									damping: 15,
									stiffness: 200,
									delay: 0.2,
								}}
							>
								<Sparkles className="h-10 w-10 text-white" />
							</motion.div>

							{/* Title */}
							<motion.div
								className="text-center space-y-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<h2 className="text-2xl font-bold">¡Subiste de Nivel!</h2>
								<p className="text-muted-foreground">
									Has alcanzado un nuevo nivel
								</p>
							</motion.div>

							{/* Level Transition */}
							<motion.div
								className="flex items-center gap-4"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4 }}
							>
								<span className="text-2xl font-semibold text-muted-foreground">
									{previousLevel}
								</span>
								<ChevronUp className="h-6 w-6 text-primary animate-bounce" />
								<LevelBadge level={newLevel} size="xl" showName animated />
							</motion.div>

							{/* New Level Name */}
							<motion.p
								className="text-lg text-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5 }}
							>
								Ahora eres <span className="font-bold">{newLevelName}</span>
							</motion.p>

							{/* Close Button */}
							<motion.button
								className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6 }}
								onClick={handleClose}
							>
								Continuar
							</motion.button>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

/**
 * Confetti Particles Animation
 */
function ConfettiParticles({ color }: { color: string }) {
	const particles = Array.from({ length: 12 }, (_, i) => ({
		id: i,
		angle: i * 30 * (Math.PI / 180),
		delay: i * 0.05,
	}));

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className={cn(
						"absolute left-1/2 top-1/2 h-2 w-2 rounded-full",
						getParticleColorClass(color),
					)}
					initial={{
						x: 0,
						y: 0,
						scale: 0,
					}}
					animate={{
						x: Math.cos(particle.angle) * 120,
						y: Math.sin(particle.angle) * 120,
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 0.8,
						delay: 0.2 + particle.delay,
						ease: "easeOut",
					}}
				/>
			))}
		</div>
	);
}

/**
 * Get icon background class based on color
 */
function getIconBgClass(color: string): string {
	const colorMap: Record<string, string> = {
		green: "bg-green-500",
		emerald: "bg-emerald-500",
		teal: "bg-teal-500",
		cyan: "bg-cyan-500",
		blue: "bg-blue-500",
		indigo: "bg-indigo-500",
		violet: "bg-violet-500",
		purple: "bg-purple-500",
		fuchsia: "bg-fuchsia-500",
		pink: "bg-pink-500",
		rose: "bg-rose-500",
		amber: "bg-amber-500",
		orange: "bg-orange-500",
		red: "bg-red-500",
		yellow: "bg-yellow-500",
		gold: "bg-gradient-to-br from-yellow-400 to-amber-500",
	};

	return colorMap[color] || "bg-primary";
}

/**
 * Get particle color class based on level color
 */
function getParticleColorClass(color: string): string {
	const colorMap: Record<string, string> = {
		green: "bg-green-400",
		emerald: "bg-emerald-400",
		teal: "bg-teal-400",
		cyan: "bg-cyan-400",
		blue: "bg-blue-400",
		indigo: "bg-indigo-400",
		violet: "bg-violet-400",
		purple: "bg-purple-400",
		fuchsia: "bg-fuchsia-400",
		pink: "bg-pink-400",
		rose: "bg-rose-400",
		amber: "bg-amber-400",
		orange: "bg-orange-400",
		red: "bg-red-400",
		yellow: "bg-yellow-400",
		gold: "bg-yellow-400",
	};

	return colorMap[color] || "bg-primary";
}
