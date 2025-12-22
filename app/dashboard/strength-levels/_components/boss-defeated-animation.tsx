"use client";

/**
 * Boss Defeated Animation Component
 *
 * Full-screen celebration animation when a boss battle is completed.
 * Features epic visual effects and XP reward display.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MaturityLevel } from "@/generated/prisma/enums";
import { LEVEL_METADATA } from "@/lib/constants/strength-levels.constants";

interface BossDefeatedAnimationProps {
	isOpen: boolean;
	onClose: () => void;
	xpAwarded: number;
	strengthName: string;
	leveledUp?: boolean;
	newLevel?: MaturityLevel;
}

const MODAL_CLIP_PATH =
	"polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)";

export function BossDefeatedAnimation({
	isOpen,
	onClose,
	xpAwarded,
	strengthName,
	leveledUp = false,
	newLevel,
}: BossDefeatedAnimationProps) {
	// Auto-close after delay
	useEffect(() => {
		if (!isOpen) return;

		const timer = setTimeout(() => {
			onClose();
		}, 4000);

		return () => clearTimeout(timer);
	}, [isOpen, onClose]);

	const levelMeta = newLevel ? LEVEL_METADATA[newLevel] : null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					{/* Content */}
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="relative max-w-md w-full pointer-events-auto"
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring", stiffness: 200, damping: 20 }}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Glowing Border */}
							<motion.div
								className="absolute -inset-1 blur-lg"
								style={{
									clipPath: MODAL_CLIP_PATH,
									background:
										"linear-gradient(135deg, #EF4444, #F59E0B, #EF4444)",
								}}
								animate={{
									opacity: [0.5, 0.8, 0.5],
								}}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							/>

							{/* Main Card */}
							<div
								className="relative p-px"
								style={{
									clipPath: MODAL_CLIP_PATH,
									background:
										"linear-gradient(135deg, #EF4444 0%, #F59E0B 50%, #EF4444 100%)",
								}}
							>
								<div
									className="relative bg-background/95 backdrop-blur-xl p-8 text-center"
									style={{ clipPath: MODAL_CLIP_PATH }}
								>
									{/* Background Effects */}
									<div className="absolute inset-0 bg-grid-tech opacity-10" />

									{/* Particle Effects */}
									<div className="absolute inset-0 overflow-hidden pointer-events-none">
										{[...Array(12)].map((_, i) => (
											<motion.div
												key={i}
												className="absolute w-2 h-2 rounded-full"
												style={{
													left: `${Math.random() * 100}%`,
													top: `${Math.random() * 100}%`,
													background: i % 2 === 0 ? "#EF4444" : "#F59E0B",
												}}
												initial={{ opacity: 0, scale: 0 }}
												animate={{
													opacity: [0, 1, 0],
													scale: [0, 1.5, 0],
													y: [0, -50, -100],
												}}
												transition={{
													duration: 2,
													delay: i * 0.1,
													repeat: Number.POSITIVE_INFINITY,
													ease: "easeOut",
												}}
											/>
										))}
									</div>

									{/* Content */}
									<div className="relative z-10">
										{/* Trophy Icon */}
										<motion.div
											className="text-7xl mb-4"
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{
												type: "spring",
												stiffness: 200,
												damping: 15,
												delay: 0.2,
											}}
										>
											🏆
										</motion.div>

										{/* Title */}
										<motion.h2
											className="text-2xl font-bold uppercase tracking-widest mb-2"
											style={{
												background:
													"linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent",
											}}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
										>
											¡BOSS DERROTADO!
										</motion.h2>

										{/* Strength Name */}
										<motion.p
											className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.4 }}
										>
											{strengthName}
										</motion.p>

										{/* XP Award */}
										<motion.div
											className="mb-6"
											initial={{ opacity: 0, scale: 0.5 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.5, type: "spring" }}
										>
											<motion.span
												className="text-5xl font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
												animate={{
													scale: [1, 1.1, 1],
												}}
												transition={{
													duration: 1,
													repeat: Number.POSITIVE_INFINITY,
													ease: "easeInOut",
												}}
											>
												+{xpAwarded} XP
											</motion.span>
										</motion.div>

										{/* Level Up Message */}
										{leveledUp && levelMeta && (
											<motion.div
												className="p-4 border border-primary/30 bg-primary/5 mb-6"
												style={{
													clipPath:
														"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
												}}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.7 }}
											>
												<p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
													¡NIVEL ALCANZADO!
												</p>
												<p
													className="text-lg font-bold uppercase tracking-wider"
													style={{ color: levelMeta.color }}
												>
													{levelMeta.nameEs}
												</p>
											</motion.div>
										)}

										{/* Close Button */}
										<motion.button
											onClick={onClose}
											className="px-6 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
											style={{
												clipPath:
													"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
											}}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 1 }}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											CONTINUAR
										</motion.button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

/**
 * Hook to manage boss defeated animation state
 */
export function useBossDefeatedAnimation() {
	const [isOpen, setIsOpen] = useState(false);
	const [xpAwarded, setXpAwarded] = useState(0);
	const [strengthName, setStrengthName] = useState("");
	const [leveledUp, setLeveledUp] = useState(false);
	const [newLevel, setNewLevel] = useState<MaturityLevel | undefined>();

	const showAnimation = (
		xp: number,
		strength: string,
		didLevelUp: boolean = false,
		level?: MaturityLevel,
	) => {
		setXpAwarded(xp);
		setStrengthName(strength);
		setLeveledUp(didLevelUp);
		setNewLevel(level);
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	return {
		isOpen,
		xpAwarded,
		strengthName,
		leveledUp,
		newLevel,
		showAnimation,
		close,
	};
}

// Need to import useState for the hook - already imported at top
