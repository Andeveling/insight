"use client";

import { type HTMLMotionProps, motion } from "motion/react"; // Next.js 16 / React 19 friendly
import * as React from "react";
import { cn } from "@/lib/cn";

// Definimos las variantes visuales que coinciden con las cards TCG
export type TCGButtonVariant =
	| "default"
	| "primary"
	| "bronze"
	| "silver"
	| "gold"
	| "platinum"
	| "beginner"
	| "intermediate"
	| "advanced"
	| "accent"
	| "success"
	| "ghost";

interface TCGButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
	variant?: TCGButtonVariant;
	isLoading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	children: React.ReactNode;
}

const variants: Record<
	TCGButtonVariant,
	{ border: string; bg: string; text: string; glow: string }
> = {
	default: {
		border: "bg-zinc-600",
		bg: "bg-zinc-950/60",
		text: "text-zinc-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(113,113,122,0.6)]",
	},
	primary: {
		border: "bg-indigo-500",
		bg: "bg-indigo-950/60",
		text: "text-indigo-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]",
	},
	bronze: {
		border: "bg-orange-700",
		bg: "bg-orange-950/60",
		text: "text-orange-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(194,65,12,0.6)]",
	},
	silver: {
		border: "bg-slate-400",
		bg: "bg-slate-900/60",
		text: "text-slate-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(148,163,184,0.6)]",
	},
	gold: {
		border: "bg-yellow-500",
		bg: "bg-yellow-950/60",
		text: "text-yellow-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(234,179,8,0.6)]",
	},
	platinum: {
		border: "bg-cyan-500",
		bg: "bg-cyan-950/60",
		text: "text-cyan-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]",
	},
	beginner: {
		border: "bg-emerald-500",
		bg: "bg-emerald-950/60",
		text: "text-emerald-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]",
	},
	intermediate: {
		border: "bg-amber-500",
		bg: "bg-amber-950/60",
		text: "text-amber-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]",
	},
	advanced: {
		border: "bg-purple-500",
		bg: "bg-purple-950/60",
		text: "text-purple-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]",
	},
	accent: {
		// Alias para intermediate (amarillo/ámbar)
		border: "bg-amber-500",
		bg: "bg-amber-950/60",
		text: "text-amber-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]",
	},
	success: {
		// Alias para beginner (verde esmeralda)
		border: "bg-emerald-500",
		bg: "bg-emerald-950/60",
		text: "text-emerald-100",
		glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]",
	},
	ghost: {
		border: "bg-slate-700",
		bg: "bg-transparent",
		text: "text-slate-400",
		glow: "group-hover:shadow-none",
	},
};

export const TCGButton = React.forwardRef<HTMLButtonElement, TCGButtonProps>(
	(
		{
			className,
			variant = "primary",
			isLoading,
			leftIcon,
			rightIcon,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const style = variants[variant];
		const isDisabled = disabled || isLoading;

		// Forma geométrica recortada (esquinas cortadas)
		const clipPathStyle =
			"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

		return (
			<motion.button
				ref={ref}
				whileHover={!isDisabled ? { scale: 1.02 } : undefined}
				whileTap={!isDisabled ? { scale: 0.98 } : undefined}
				className={cn(
					"relative group inline-flex items-center justify-center font-bold uppercase tracking-wider outline-none transition-all",
					isDisabled && "opacity-50 grayscale cursor-not-allowed",
					className,
				)}
				style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }} // Sombra base externa
				disabled={isDisabled}
				{...props}
			>
				{/* CAPA 1: Borde Brillante / Glow (Fondo animado) */}
				<div
					className={cn(
						"absolute inset-0 transition-all duration-300",
						style.border,
						!isDisabled && style.glow,
					)}
					style={{ clipPath: clipPathStyle }}
				/>

				{/* CAPA 2: Fondo Interior (El "cuerpo" del botón) */}
				<div
					className={cn(
						"absolute inset-0.5 transition-colors duration-300 z-10 flex items-center justify-center",
						style.bg,
					)}
					style={{ clipPath: clipPathStyle }}
				>
					{/* Trama tecnológica decorativa (Grid o líneas sutiles) */}
					<div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-size-[4px_4px]" />
				</div>

				{/* CAPA 3: Efecto de "Escaneo" (Shine) al hacer hover */}
				{!isDisabled && variant !== "ghost" && (
					<div
						className="absolute inset-0 z-20 w-full h-full pointer-events-none overflow-hidden"
						style={{ clipPath: clipPathStyle }}
					>
						<div className="absolute top-0 -left-[150%] w-[50%] h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
					</div>
				)}

				{/* CONTENIDO TEXTO E ICONOS */}
				<span
					className={cn(
						"relative z-30 flex items-center gap-3 px-8 py-3",
						style.text,
					)}
				>
					{isLoading ? (
						<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					) : (
						leftIcon
					)}

					{children}

					{!isLoading && rightIcon && (
						<span className="transition-transform duration-300 group-hover:translate-x-1">
							{rightIcon}
						</span>
					)}
				</span>
			</motion.button>
		);
	},
);

TCGButton.displayName = "TCGButton";
