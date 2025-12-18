"use client";

/**
 * GamifiedBadge Component
 * Reusable badge with neon glow effects
 * Can be used for level, XP, streak, currency, etc.
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
	variant?: "cyan" | "orange" | "teal" | "purple" | "gold";
	/** Icon fill */
	iconFill?: boolean;
	/** Size */
	size?: "sm" | "md" | "lg";
	/** Additional CSS classes */
	className?: string;
}

const variantStyles = {
	cyan: {
		glow: "from-cyan-500/50 to-blue-500/50",
		container: "from-blue-900/90 to-cyan-900/90 border-cyan-400/60",
		icon: "from-cyan-400 to-blue-500",
		text: "text-cyan-100",
		iconColor: "text-cyan-300",
		iconFillColor: "fill-cyan-400",
	},
	orange: {
		glow: "from-orange-500/50 to-red-500/50",
		container: "from-orange-900/90 to-red-900/90 border-orange-400/60",
		icon: "from-orange-400 to-red-500",
		text: "text-orange-100",
		iconColor: "text-orange-300",
		iconFillColor: "fill-orange-400",
	},
	teal: {
		glow: "from-cyan-500/50 to-teal-500/50",
		container: "from-teal-900/90 to-cyan-900/90 border-cyan-400/60",
		icon: "from-teal-400 to-cyan-500",
		text: "text-cyan-100",
		iconColor: "text-cyan-300",
		iconFillColor: "fill-cyan-400",
	},
	purple: {
		glow: "from-purple-500/50 to-violet-500/50",
		container: "from-purple-900/90 to-violet-900/90 border-purple-400/60",
		icon: "from-purple-400 to-violet-500",
		text: "text-purple-100",
		iconColor: "text-purple-300",
		iconFillColor: "fill-purple-400",
	},
	gold: {
		glow: "from-yellow-500/50 to-amber-500/50",
		container: "from-yellow-900/90 to-amber-900/90 border-yellow-400/60",
		icon: "from-yellow-400 to-amber-500",
		text: "text-yellow-100",
		iconColor: "text-yellow-300",
		iconFillColor: "fill-yellow-400",
	},
};

const sizeStyles = {
	sm: {
		container: "gap-1.5 px-2.5 py-1.5",
		icon: "w-5 h-5",
		iconWrapper: "w-6 h-6",
		value: "text-sm",
		label: "text-[10px]",
	},
	md: {
		container: "gap-2 px-3 py-2",
		icon: "w-5 h-5",
		iconWrapper: "w-8 h-8",
		value: "text-base",
		label: "text-xs",
	},
	lg: {
		container: "gap-2.5 px-4 py-2.5",
		icon: "w-6 h-6",
		iconWrapper: "w-9 h-9",
		value: "text-lg",
		label: "text-sm",
	},
};

/**
 * Reusable gamified badge with neon glow effect
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

	return (
		<div className={cn("relative group", className)}>
			{/* Glow effect */}
			<div
				className={cn(
					"absolute -inset-1 bg-linear-to-r rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity",
					colors.glow,
				)}
			/>

			{/* Badge container */}
			<div
				className={cn(
					"relative flex items-center rounded-full bg-linear-to-br border-2 backdrop-blur-sm shadow-lg",
					colors.container,
					sizes.container,
				)}
			>
				{/* Icon with gradient background */}
				<div
					className={cn(
						"flex items-center justify-center rounded-full bg-linear-to-br shadow-inner",
						colors.icon,
						sizes.iconWrapper,
					)}
				>
					<Icon
						className={cn(
							sizes.icon,
							"text-white drop-shadow-lg",
							iconFill && colors.iconFillColor,
						)}
					/>
				</div>

				{/* Content */}
				<div className="flex flex-col leading-none">
					{label && (
						<span
							className={cn("font-medium opacity-90", colors.text, sizes.label)}
						>
							{label}
						</span>
					)}
					<span
						className={cn("font-bold drop-shadow-lg", colors.text, sizes.value)}
					>
						{value}
					</span>
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

	return (
		<div className={cn("relative group", className)}>
			{/* Glow effect */}
			<div
				className={cn(
					"absolute -inset-1 bg-linear-to-r rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity",
					colors.glow,
				)}
			/>

			{/* Badge container */}
			<div
				className={cn(
					"relative flex items-center rounded-full bg-linear-to-br border-2 backdrop-blur-sm shadow-lg",
					colors.container,
					sizes.container,
				)}
			>
				{/* Icon */}
				<Icon
					className={cn(
						sizes.icon,
						colors.iconColor,
						"drop-shadow-lg",
						iconFill && colors.iconFillColor,
					)}
				/>

				{/* Value */}
				<span
					className={cn(
						"font-bold drop-shadow-lg ml-1",
						colors.text,
						sizes.value,
					)}
				>
					{value}
				</span>
			</div>
		</div>
	);
}
