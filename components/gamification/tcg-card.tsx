"use client";

import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/cn";

export type TCGCardVariant =
	| "default"
	| "primary"
	| "bronze"
	| "silver"
	| "gold"
	| "platinum"
	| "beginner"
	| "intermediate"
	| "advanced";

interface TCGCardProps {
	children: React.ReactNode;
	variant?: TCGCardVariant;
	className?: string;
	isActive?: boolean;
	isInteractive?: boolean;
	onClick?: () => void;
}

// Configuración de colores alineada con el estilo "Neon/Tech"
const variantStyles: Record<
	TCGCardVariant,
	{ border: string; bg: string; accent: string; glow: string }
> = {
	default: {
		border: "bg-zinc-600",
		bg: "bg-zinc-950/95",
		accent: "text-zinc-500",
		glow: "group-hover:shadow-[0_0_30px_rgba(113,113,122,0.3)]",
	},
	primary: {
		border: "bg-indigo-500",
		bg: "bg-indigo-950/95",
		accent: "text-indigo-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]",
	},
	bronze: {
		border: "bg-orange-700",
		bg: "bg-orange-950/95",
		accent: "text-orange-600",
		glow: "group-hover:shadow-[0_0_30px_rgba(194,65,12,0.4)]",
	},
	silver: {
		border: "bg-slate-400",
		bg: "bg-slate-900/90",
		accent: "text-slate-300",
		glow: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]",
	},
	gold: {
		border: "bg-yellow-500",
		bg: "bg-yellow-950/95",
		accent: "text-yellow-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]",
	},
	platinum: {
		border: "bg-cyan-500",
		bg: "bg-cyan-950/95",
		accent: "text-cyan-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]",
	},
	beginner: {
		border: "bg-emerald-500",
		bg: "bg-emerald-950/95",
		accent: "text-emerald-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
	},
	intermediate: {
		border: "bg-amber-500",
		bg: "bg-amber-950/95",
		accent: "text-amber-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
	},
	advanced: {
		border: "bg-purple-500",
		bg: "bg-purple-950/95",
		accent: "text-purple-400",
		glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
	},
};

/**
 * TCG Card Component (Tech/Sci-Fi Version)
 * * Reemplaza el SVG frame con CSS clip-path para bordes nítidos y
 * una estética de panel de control (HUD) que hace juego con el TechButton.
 */
export function TCGCard({
	children,
	variant = "default",
	className,
	isActive = true,
	isInteractive = false,
	onClick,
}: TCGCardProps) {
	const styles = variantStyles[variant];

	// Define la forma geométrica "Tech" (esquinas cortadas simétricas)
	// Corta 24px en las esquinas superior-izquierda e inferior-derecha
	const clipPathStyle =
		"polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)";

	return (
		<motion.div
			whileHover={
				isInteractive && isActive ? { y: -4, scale: 1.01 } : undefined
			}
			className={cn(
				"relative h-full w-full group transition-all duration-300",
				!isActive && "opacity-60 grayscale-[0.8]",
				className,
			)}
			onClick={isInteractive && isActive ? onClick : undefined}
		>
			{/* CAPA 1: Glow exterior (Resplandor) */}
			{isActive && (
				<div
					className={cn(
						"absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-500 blur-xl",
						isInteractive && styles.glow,
						isInteractive ? "group-hover:opacity-100" : "opacity-0",
					)}
				/>
			)}

			{/* CAPA 2: Borde Principal (Geometría Recortada) */}
			<div
				className={cn(
					"relative h-full w-full p-0.5 transition-colors duration-300", // p-[2px] crea el grosor del borde
					styles.border,
				)}
				style={{ clipPath: clipPathStyle }}
			>
				{/* CAPA 3: Fondo Interno (Surface) */}
				<div
					className={cn(
						"relative h-full w-full overflow-hidden flex flex-col",
						styles.bg,
					)}
					style={{ clipPath: clipPathStyle }}
				>
					{/* Textura de fondo (Grid Tecnológico) */}
					<div
						className="absolute inset-0 z-0 opacity-10"
						style={{
							backgroundImage: `radial-gradient(${styles.border.replace("bg-", "")} 1px, transparent 1px)`,
							backgroundSize: "20px 20px",
						}}
					/>

					{/* Gradiente sutil superior para dar profundidad */}
					<div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

					{/* Decoraciones "Tech" en las esquinas */}
					{/* Top Right Accent */}
					<div
						className={cn(
							"absolute top-0 right-0 w-16 h-0.5 z-10 opacity-60",
							styles.border,
						)}
					/>
					<div
						className={cn(
							"absolute top-0 right-0 w-0.5 h-8 z-10 opacity-60",
							styles.border,
						)}
					/>

					{/* Bottom Left Accent */}
					<div
						className={cn(
							"absolute bottom-0 left-0 w-16 h-0.5 z-10 opacity-60",
							styles.border,
						)}
					/>
					<div
						className={cn(
							"absolute bottom-0 left-0 w-0.5 h-8 z-10 opacity-60",
							styles.border,
						)}
					/>

					{/* Etiqueta decorativa pequeña (opcional, estilo HUD) */}
					<div
						className={cn(
							"absolute top-3 right-4 text-[10px] font-mono tracking-widest opacity-40 uppercase",
							styles.accent,
						)}
					>
						SYS.CORE
					</div>

					{/* CONTENIDO REAL */}
					<div className="relative z-20 flex-1 p-6 pt-8">{children}</div>
				</div>
			</div>
		</motion.div>
	);
}
