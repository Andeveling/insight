"use client";

/**
 * Level Up Notification Component
 *
 * Modal celebration when user levels up a strength maturity level.
 * Features CyberPunk animations and level description.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MaturityLevel } from "@/generated/prisma/enums";
import { cn } from "@/lib/cn";
import { LEVEL_METADATA } from "@/lib/constants/strength-levels.constants";
import { LevelBadge } from "./level-badge";

interface LevelUpNotificationProps {
	isOpen: boolean;
	onClose: () => void;
	newLevel: MaturityLevel;
	strengthName: string;
	previousLevel?: MaturityLevel;
}

const MODAL_CLIP_PATH =
	"polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

const LEVEL_DESCRIPTIONS: Record<
	MaturityLevel,
	{ title: string; description: string }
> = {
	SPONGE: {
		title: "¡Nuevo Comienzo!",
		description:
			"Has comenzado tu viaje como Esponja. Absorbe todo el conocimiento que puedas sobre esta fortaleza.",
	},
	CONNECTOR: {
		title: "¡Conexión Establecida!",
		description:
			"Como Conector, ahora puedes vincular tu fortaleza con otras personas y situaciones. ¡Boss Battles desbloqueados!",
	},
	GUIDE: {
		title: "¡Sabiduría Alcanzada!",
		description:
			"Como Guía, puedes enseñar a otros sobre esta fortaleza. Tu experiencia te convierte en mentor.",
	},
	ALCHEMIST: {
		title: "¡Maestría Absoluta!",
		description:
			"Has alcanzado el nivel máximo: Alquimista. Puedes transformar cualquier situación usando esta fortaleza.",
	},
};

export function LevelUpNotification({
	isOpen,
	onClose,
	newLevel,
	strengthName,
	previousLevel,
}: LevelUpNotificationProps) {
	const [showContent, setShowContent] = useState(false);

	const metadata = LEVEL_METADATA[newLevel];
	const levelInfo = LEVEL_DESCRIPTIONS[newLevel];

	useEffect(() => {
		if (isOpen) {
			// Delay content appearance for dramatic effect
			const timer = setTimeout(() => setShowContent(true), 300);
			return () => clearTimeout(timer);
		} else {
			setShowContent(false);
		}
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="relative w-full max-w-md"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
							data-testid="level-up-notification"
						>
							{/* Outer Glow */}
							<div
								className="absolute -inset-1 opacity-50 blur-xl"
								style={{ backgroundColor: metadata.color }}
							/>

							{/* Border */}
							<div
								className="p-px"
								style={{
									clipPath: MODAL_CLIP_PATH,
									backgroundColor: metadata.color,
								}}
							>
								{/* Content Container */}
								<div
									className="relative bg-background/95 backdrop-blur-md p-8"
									style={{ clipPath: MODAL_CLIP_PATH }}
								>
									{/* Background Effects */}
									<div className="absolute inset-0 bg-grid-tech opacity-10" />

									{/* Scan Lines */}
									<motion.div
										className="absolute inset-0 pointer-events-none overflow-hidden"
										style={{ clipPath: MODAL_CLIP_PATH }}
									>
										<motion.div
											className="absolute left-0 right-0 h-[2px]"
											style={{
												background: `linear-gradient(90deg, transparent, ${metadata.color}, transparent)`,
												boxShadow: `0 0 10px ${metadata.color}`,
											}}
											animate={{
												top: ["-5%", "105%"],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: "linear",
											}}
										/>
									</motion.div>

									{/* Content */}
									<div className="relative z-10 flex flex-col items-center text-center">
										{/* Level Up Badge */}
										<motion.div
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											transition={{ delay: 0.2, type: "spring", damping: 12 }}
											className="mb-6"
										>
											<LevelBadge level={newLevel} size="xl" animate />
										</motion.div>

										{/* Title */}
										<AnimatePresence>
											{showContent && (
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.1 }}
												>
													<motion.h2
														className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
													>
														[LEVEL_UP_DETECTED]
													</motion.h2>

													<h3
														className="text-2xl font-bold uppercase tracking-wider mb-2"
														style={{ color: metadata.color }}
													>
														{levelInfo.title}
													</h3>

													<p className="text-lg font-bold uppercase tracking-widest text-foreground mb-1">
														{strengthName}
													</p>

													<div className="flex items-center justify-center gap-2 mb-4">
														{previousLevel && (
															<>
																<span className="text-sm text-muted-foreground uppercase">
																	{LEVEL_METADATA[previousLevel].nameEs}
																</span>
																<span className="text-primary">→</span>
															</>
														)}
														<span
															className="text-sm font-bold uppercase"
															style={{ color: metadata.color }}
														>
															{metadata.nameEs}
														</span>
													</div>

													<p className="text-sm text-muted-foreground/80 max-w-sm">
														{levelInfo.description}
													</p>
												</motion.div>
											)}
										</AnimatePresence>

										{/* Close Button */}
										<motion.button
											onClick={onClose}
											className="mt-6 px-6 py-2 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
											style={{
												clipPath:
													"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
											}}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.5 }}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
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
 * Hook for managing level up notification state
 */
export function useLevelUpNotification() {
	const [state, setState] = useState<{
		isOpen: boolean;
		newLevel: MaturityLevel | null;
		strengthName: string;
		previousLevel?: MaturityLevel;
	}>({
		isOpen: false,
		newLevel: null,
		strengthName: "",
	});

	const showLevelUp = (
		newLevel: MaturityLevel,
		strengthName: string,
		previousLevel?: MaturityLevel,
	) => {
		setState({
			isOpen: true,
			newLevel,
			strengthName,
			previousLevel,
		});
	};

	const close = () => {
		setState((prev) => ({ ...prev, isOpen: false }));
	};

	return {
		...state,
		showLevelUp,
		close,
	};
}
