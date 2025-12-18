"use client";

import { ChevronUp, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getLevelInfo } from "@/lib/constants/xp-levels";

export interface LevelUpNotificationProps {
	previousLevel: number;
	newLevel: number;
	levelName?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	autoCloseDelay?: number;
}

/**
 * Level Up Notification Component (Shared)
 *
 * Displays an animated celebration modal when user levels up.
 * Used by assessment, feedback, and development modules.
 */
export function LevelUpNotification({
	previousLevel,
	newLevel,
	levelName,
	open,
	onOpenChange,
	autoCloseDelay = 5000,
}: LevelUpNotificationProps) {
	const levelInfo = getLevelInfo(newLevel);
	const displayName = levelName ?? levelInfo.name;
	const levelColor = levelInfo.color;

	// Auto-close after delay
	useEffect(() => {
		if (open && autoCloseDelay > 0) {
			const timer = setTimeout(() => {
				onOpenChange(false);
			}, autoCloseDelay);

			return () => clearTimeout(timer);
		}
	}, [open, autoCloseDelay, onOpenChange]);

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<AnimatePresence>
			{open && (
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
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
							{/* Close button */}
							<button
								onClick={handleClose}
								className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
								aria-label="Cerrar notificación"
							>
								<X className="h-5 w-5 text-muted-foreground" />
							</button>

							{/* Decorative Particles */}
							<ConfettiParticles color={levelColor} />

							{/* Icon */}
							<motion.div
								className={cn(
									"flex h-20 w-20 items-center justify-center rounded-full",
									getIconBgClass(levelColor),
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
								<motion.div
									className={cn(
										"flex items-center gap-2 px-4 py-2 rounded-full font-bold text-2xl",
										getIconBgClass(levelColor),
										"text-white",
									)}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.5, type: "spring" }}
								>
									{newLevel}
								</motion.div>
							</motion.div>

							{/* New Level Name */}
							<motion.p
								className="text-lg text-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6 }}
							>
								Ahora eres <span className="font-bold">{displayName}</span>
							</motion.p>

							{/* Close Button */}
							<motion.button
								className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
								onClick={handleClose}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
							>
								Toca para continuar
							</motion.button>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

/**
 * Get background class based on level color
 */
function getIconBgClass(color: string): string {
	const colorMap: Record<string, string> = {
		zinc: "bg-zinc-500",
		slate: "bg-slate-500",
		green: "bg-green-500",
		emerald: "bg-emerald-500",
		teal: "bg-teal-500",
		cyan: "bg-cyan-500",
		sky: "bg-sky-500",
		blue: "bg-blue-500",
		indigo: "bg-indigo-500",
		violet: "bg-violet-500",
		purple: "bg-purple-500",
		fuchsia: "bg-fuchsia-500",
		pink: "bg-pink-500",
		rose: "bg-rose-500",
		amber: "bg-amber-500",
		orange: "bg-orange-500",
		yellow: "bg-yellow-500",
		lime: "bg-lime-500",
		red: "bg-red-500",
		gradient: "bg-linear-to-r from-purple-500 via-pink-500 to-amber-500",
	};

	return colorMap[color] ?? "bg-primary";
}

/**
 * Confetti Particles Effect
 */
function ConfettiParticles({ color }: { color: string }) {
	const particles = Array.from({ length: 12 }, (_, i) => ({
		id: i,
		delay: i * 0.05,
		x: (Math.random() - 0.5) * 200,
		y: (Math.random() - 0.5) * 200,
	}));

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className={cn("absolute h-2 w-2 rounded-full", getIconBgClass(color))}
					style={{
						left: "50%",
						top: "30%",
					}}
					initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
					animate={{
						x: particle.x,
						y: particle.y,
						opacity: 0,
						scale: 0.5,
					}}
					transition={{
						delay: 0.3 + particle.delay,
						duration: 1,
						ease: "easeOut",
					}}
				/>
			))}
		</div>
	);
}
