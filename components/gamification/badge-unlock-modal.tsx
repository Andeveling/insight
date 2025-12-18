"use client";

import { Award, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BadgeTier } from "@/lib/types/gamification.types";

export interface BadgeUnlockModalProps {
	badge: {
		name: string;
		description: string;
		tier: BadgeTier;
		xpReward: number;
		iconUrl?: string | null;
	} | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const tierConfig = {
	bronze: {
		label: "Bronce",
		gradient: "from-amber-500 to-amber-700",
		glowColor: "shadow-amber-500/50",
		textColor: "text-amber-700 dark:text-amber-400",
	},
	silver: {
		label: "Plata",
		gradient: "from-slate-400 to-slate-600",
		glowColor: "shadow-slate-400/50",
		textColor: "text-slate-600 dark:text-slate-300",
	},
	gold: {
		label: "Oro",
		gradient: "from-yellow-400 to-yellow-600",
		glowColor: "shadow-yellow-400/50",
		textColor: "text-yellow-600 dark:text-yellow-400",
	},
	platinum: {
		label: "Platino",
		gradient: "from-cyan-400 to-cyan-600",
		glowColor: "shadow-cyan-400/50",
		textColor: "text-cyan-600 dark:text-cyan-400",
	},
};

/**
 * Badge Unlock Modal Component (Shared)
 *
 * Displays an animated celebration when a badge is unlocked.
 * Used by assessment, feedback, and development modules.
 */
export function BadgeUnlockModal({
	badge,
	open,
	onOpenChange,
}: BadgeUnlockModalProps) {
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => setShowContent(true), 200);
			return () => clearTimeout(timer);
		} else {
			const timer = setTimeout(() => setShowContent(false), 0);
			return () => clearTimeout(timer);
		}
	}, [open]);

	if (!badge) return null;

	const tier = tierConfig[badge.tier];

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
					onClick={handleClose}
				>
					<motion.div
						initial={{ scale: 0.5, rotate: -10 }}
						animate={{ scale: 1, rotate: 0 }}
						exit={{ scale: 0.5, opacity: 0 }}
						transition={{ type: "spring", damping: 15, stiffness: 300 }}
						className="relative w-full max-w-sm mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							onClick={handleClose}
							className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
							aria-label="Cerrar modal"
						>
							<X className="h-5 w-5 text-white" />
						</button>

						{/* Card */}
						<div
							className={cn(
								"relative overflow-hidden rounded-2xl p-8 text-center",
								"bg-linear-to-br",
								tier.gradient,
								"shadow-2xl",
								tier.glowColor,
							)}
						>
							{/* Sparkle Particles */}
							<SparkleParticles />

							{/* Badge Icon with rotation animation */}
							<motion.div
								initial={{ scale: 0, rotate: -180 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{ delay: 0.3, type: "spring", damping: 12 }}
								className="relative mx-auto mb-6"
							>
								<div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mx-auto">
									{badge.iconUrl ? (
										<span className="text-5xl">{badge.iconUrl}</span>
									) : (
										<Award className="h-14 w-14 text-white" />
									)}
								</div>

								{/* Rotating ring */}
								<motion.div
									className="absolute inset-0 rounded-full border-4 border-white/30 border-dashed"
									animate={{ rotate: 360 }}
									transition={{
										duration: 10,
										repeat: Infinity,
										ease: "linear",
									}}
								/>
							</motion.div>

							{/* Text Content */}
							{showContent && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="space-y-4"
								>
									<div>
										<p className="text-white/70 text-sm mb-1">
											¡Nuevo Badge Desbloqueado!
										</p>
										<h3 className="text-2xl font-bold text-white">
											{badge.name}
										</h3>
									</div>

									<p className="text-white/80 text-sm">{badge.description}</p>

									{/* Tier Badge */}
									<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm">
										<Award className="h-4 w-4" />
										<span>{tier.label}</span>
									</div>

									{/* XP Reward */}
									{badge.xpReward > 0 && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.7, type: "spring" }}
											className="text-lg font-bold text-white"
										>
											+{badge.xpReward} XP
										</motion.div>
									)}

									<Button
										onClick={handleClose}
										variant="secondary"
										className="mt-4 bg-white/20 hover:bg-white/30 text-white border-none"
									>
										¡Genial!
									</Button>
								</motion.div>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

/**
 * Sparkle Particles Effect
 */
function SparkleParticles() {
	const particles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: 2 + Math.random() * 4,
		delay: Math.random() * 2,
	}));

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute rounded-full bg-white"
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: particle.size,
						height: particle.size,
					}}
					animate={{
						opacity: [0.2, 1, 0.2],
						scale: [1, 1.5, 1],
					}}
					transition={{
						delay: particle.delay,
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}
