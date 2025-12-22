"use client";

/**
 * GamifiedBadge Component
 * Refactored to CyberPunk UI Design System
 * Industrial Geometry, HUD Textures, and Monospaced Typography
 */

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface GamifiedBadgeProps {
	/** Icon component from lucide-react */
	icon: LucideIcon;
	/** Main value to display */
	value: string | number;
	/** Optional label (e.g., "Lvl", "XP") */
	label?: string;
	/** Color theme */
	variant?: "cyan" | "orange" | "teal" | "purple" | "gold" | "destructive";
	/** Icon fill */
	iconFill?: boolean;
	/** Size */
	size?: "sm" | "md" | "lg";
	/** Additional CSS classes */
	className?: string;
}

const variantStyles = {
	cyan: {
		border: "bg-chart-2/40",
		bg: "bg-chart-2/10",
		text: "text-chart-2",
		icon: "text-chart-2",
		glow: "bg-chart-2/20",
	},
	orange: {
		border: "bg-primary/40",
		bg: "bg-primary/10",
		text: "text-primary",
		icon: "text-primary",
		glow: "bg-primary/20",
	},
	teal: {
		border: "bg-emerald-500/40",
		bg: "bg-emerald-500/10",
		text: "text-emerald-400",
		icon: "text-emerald-400",
		glow: "bg-emerald-500/20",
	},
	purple: {
		border: "bg-chart-5/40",
		bg: "bg-chart-5/10",
		text: "text-chart-5",
		icon: "text-chart-5",
		glow: "bg-chart-5/20",
	},
	gold: {
		border: "bg-primary/50",
		bg: "bg-primary/20",
		text: "text-primary",
		icon: "text-primary",
		glow: "bg-primary/30",
	},
	destructive: {
		border: "bg-destructive/40",
		bg: "bg-destructive/10",
		text: "text-destructive",
		icon: "text-destructive",
		glow: "bg-destructive/20",
	},
};

const sizeStyles = {
	sm: {
		container: "gap-2 px-3 py-1",
		icon: "w-3.5 h-3.5",
		iconWrapper: "w-6 h-6",
		value: "text-xs",
		label: "text-[9px]",
		clip: 6,
	},
	md: {
		container: "gap-3 px-4 py-1.5",
		icon: "w-4 h-4",
		iconWrapper: "w-8 h-8",
		value: "text-sm",
		label: "text-[10px]",
		clip: 8,
	},
	lg: {
		container: "gap-4 px-5 py-2",
		icon: "w-5 h-5",
		iconWrapper: "w-10 h-10",
		value: "text-base",
		label: "text-xs",
		clip: 10,
	},
};

const HEX_CLIP = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

/**
 * Reusable gamified badge with CyberPunk HUD effect
 */
export function GamifiedBadge({
	icon: Icon,
	value,
	label,
	variant = "cyan",
	iconFill = false,
	size = "md",
	className,
}: GamifiedBadgeProps) {
	const colors = variantStyles[variant];
	const sizes = sizeStyles[size];

	const clipPath = `polygon(${sizes.clip}px 0, 100% 0, 100% calc(100% - ${sizes.clip}px), calc(100% - ${sizes.clip}px) 100%, 0 100%, 0 ${sizes.clip}px)`;

	return (
		<div className={cn("relative group inline-flex", className)}>
			{/* Glow effect (HUD Pulse) */}
			<div
				className={cn(
					"absolute -inset-1 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500",
					colors.glow,
				)}
				style={{ clipPath }}
			/>

			{/* Double Container Pattern for Layered Border */}
			<div className={cn("p-px", colors.border)} style={{ clipPath }}>
				<div
					className={cn(
						"relative flex items-center bg-background/90 backdrop-blur-md",
						sizes.container,
					)}
					style={{ clipPath }}
				>
					{/* Scan line effect */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
						<div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent h-1/2 animate-scan" />
					</div>

					{/* Hexagonal Icon Wrapper */}
					<div
						className={cn(
							"flex items-center justify-center p-px",
							colors.border,
						)}
						style={{ clipPath: HEX_CLIP }}
					>
						<div
							className={cn(
								"flex items-center justify-center bg-background/80",
								sizes.iconWrapper,
							)}
							style={{ clipPath: HEX_CLIP }}
						>
							<Icon
								className={cn(
									sizes.icon,
									colors.icon,
									"drop-shadow-[0_0_5px_currentColor]",
									iconFill && "fill-current",
								)}
							/>
						</div>
					</div>

					{/* Content with HUD Typography */}
					<div className="flex flex-col leading-none">
						{label && (
							<span
								className={cn(
									"font-black uppercase tracking-[0.2em] opacity-70 mb-0.5",
									colors.text,
									sizes.label,
								)}
							>
								[{label}]
							</span>
						)}
						<span
							className={cn(
								"font-mono font-bold tracking-tight text-center",
								colors.text,
								sizes.value,
							)}
						>
							{value}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Simple icon-only badge (for compact display)
 */
export function GamifiedIconBadge({
	icon: Icon,
	value,
	variant = "cyan",
	iconFill = false,
	size = "md",
	className,
}: GamifiedBadgeProps) {
	const colors = variantStyles[variant];
	const sizes = sizeStyles[size];

	const clipPath = `polygon(${sizes.clip}px 0, 100% 0, 100% calc(100% - ${sizes.clip}px), calc(100% - ${sizes.clip}px) 100%, 0 100%, 0 ${sizes.clip}px)`;

	return (
		<div className={cn("relative group inline-flex", className)}>
			{/* Glow effect */}
			<div
				className={cn(
					"absolute -inset-1 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300",
					colors.glow,
				)}
				style={{ clipPath }}
			/>

			{/* Double Container Pattern */}
			<div className={cn("p-px", colors.border)} style={{ clipPath }}>
				<div
					className={cn(
						"relative flex items-center bg-background/90 backdrop-blur-md",
						sizes.container,
					)}
					style={{ clipPath }}
				>
					{/* Icon */}
					<Icon
						className={cn(
							sizes.icon,
							colors.icon,
							"drop-shadow-[0_0_3px_currentColor]",
							iconFill && "fill-current",
						)}
					/>

					{/* Value (HUD Style) */}
					<span
						className={cn(
							"font-mono font-bold ml-1.5",
							colors.text,
							sizes.value,
						)}
					>
						{value}
					</span>
				</div>
			</div>
		</div>
	);
}

