"use client";

import { Award, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BadgeTier } from "@/lib/types";

interface BadgeUnlockModalProps {
	badge: {
		id: string;
		nameEs: string;
		descriptionEs: string;
		iconUrl: string;
		tier: BadgeTier;
		xpReward: number;
	} | null;
	isOpen: boolean;
	onClose: () => void;
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
 * Badge Unlock Modal Component
 *
 * Displays an animated celebration when a badge is unlocked.
 * Features rotate animation, sparkles, and tier-specific styling.
 */
export function BadgeUnlockModal({
	badge,
	isOpen,
	onClose,
}: BadgeUnlockModalProps) {
	// Initialize showContent based on isOpen to avoid cascading renders
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const timer = setTimeout(() => setShowContent(true), 200);
			return () => clearTimeout(timer);
		} else {
			// Reset synchronously via callback to avoid cascade
			const timer = setTimeout(() => setShowContent(false), 0);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!badge) return null;

	const tier = tierConfig[badge.tier];

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
					onClick={onClose}
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
							onClick={onClose}
							className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
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
									className="text-white space-y-4"
								>
									<div className="flex items-center justify-center gap-2">
										<Sparkles className="h-5 w-5" />
										<span className="uppercase tracking-wider text-sm font-medium">
											¡Nueva Insignia Desbloqueada!
										</span>
										<Sparkles className="h-5 w-5" />
									</div>

									<h2 className="text-2xl font-bold">{badge.nameEs}</h2>

									<p className="text-white/80 text-sm">{badge.descriptionEs}</p>

									<div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
										<span>Nivel: {tier.label}</span>
										<span>•</span>
										<span>+{badge.xpReward} XP</span>
									</div>

									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.8 }}
									>
										<Button
											onClick={onClose}
											className="mt-4 bg-white text-black hover:bg-white/90"
										>
											¡Genial!
										</Button>
									</motion.div>
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
 * Generate stable particle positions
 */
function generateParticles() {
	return Array.from({ length: 12 }, (_, i) => ({
		id: i,
		x: (i * 8 + 5) % 100, // Deterministic positions
		y: ((i * 13 + 7) * 3) % 100,
		delay: (i * 0.05) % 0.5,
		repeatDelay: (i * 0.2) % 2,
	}));
}

/**
 * Sparkle Particles Effect
 */
function SparkleParticles() {
	// Use useMemo to ensure stable positions across renders
	const particles = useMemo(() => generateParticles(), []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute h-1 w-1 rounded-full bg-white"
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
					}}
					initial={{ opacity: 0, scale: 0 }}
					animate={{
						opacity: [0, 1, 0],
						scale: [0, 1.5, 0],
					}}
					transition={{
						duration: 2,
						delay: 0.5 + particle.delay,
						repeat: Infinity,
						repeatDelay: particle.repeatDelay,
					}}
				/>
			))}
		</div>
	);
}
