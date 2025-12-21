"use client";

import { motion } from "motion/react";
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

const variantColors: Record<TCGCardVariant, string> = {
	default: "#71717a", // zinc-500
	primary: "#6366f1", // indigo-500
	bronze: "#d97706", // amber-600
	silver: "#94a3b8", // slate-400
	gold: "#eab308", // yellow-500
	platinum: "#06b6d4", // cyan-500
	beginner: "#22c55e", // green-500
	intermediate: "#f59e0b", // amber-500
	advanced: "#a855f7", // purple-500
};

const variantStyles: Record<
	TCGCardVariant,
	{ border: string; bg: string; glow: string }
> = {
	default: {
		border: "border-zinc-500/30",
		bg: "bg-zinc-500/5",
		glow: "from-zinc-500/5",
	},
	primary: {
		border: "border-primary/30",
		bg: "bg-primary/5",
		glow: "from-primary/5",
	},
	bronze: {
		border: "border-amber-600/30",
		bg: "bg-amber-600/5",
		glow: "from-amber-600/5",
	},
	silver: {
		border: "border-slate-400/30",
		bg: "bg-slate-400/5",
		glow: "from-slate-400/5",
	},
	gold: {
		border: "border-yellow-500/30",
		bg: "bg-yellow-500/5",
		glow: "from-yellow-500/5",
	},
	platinum: {
		border: "border-cyan-500/30",
		bg: "bg-cyan-500/5",
		glow: "from-cyan-500/5",
	},
	beginner: {
		border: "border-green-500/30",
		bg: "bg-green-500/5",
		glow: "from-green-500/5",
	},
	intermediate: {
		border: "border-amber-500/30",
		bg: "bg-amber-500/5",
		glow: "from-amber-500/5",
	},
	advanced: {
		border: "border-purple-500/30",
		bg: "bg-purple-500/5",
		glow: "from-purple-500/5",
	},
};

function TCGFrame({
	color,
	isActive,
}: { color: string; isActive: boolean }) {
	return (
		<div className="absolute inset-0 pointer-events-none z-0 select-none">
			<svg
				className="w-full h-full"
				viewBox="0 0 300 400"
				preserveAspectRatio="none"
			>
				<defs>
					<pattern
						id={`grid-${color.replace("#", "")}`}
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M 20 0 L 0 0 0 20"
							fill="none"
							stroke={color}
							strokeWidth="0.5"
							opacity="0.1"
						/>
					</pattern>
				</defs>

				{/* Background Grid */}
				{isActive && (
					<rect
						x="10"
						y="10"
						width="280"
						height="380"
						fill={`url(#grid-${color.replace("#", "")})`}
						opacity="0.4"
					/>
				)}

				{/* Main Border Path with Cut corners */}
				<path
					d="M20,10 L280,10 L290,20 L290,380 L280,390 L20,390 L10,380 L10,20 Z"
					fill="none"
					stroke={color}
					strokeWidth="1.5"
					opacity={isActive ? 0.6 : 0.3}
				/>

				{/* Corner Accents */}
				<path
					d="M10,40 L10,20 L20,10 L40,10"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M260,10 L280,10 L290,20 L290,40"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M290,360 L290,380 L280,390 L260,390"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>
				<path
					d="M40,390 L20,390 L10,380 L10,360"
					fill="none"
					stroke={color}
					strokeWidth="3"
				/>

				{/* Tech Details */}
				<rect x="140" y="8" width="20" height="4" fill={color} opacity="0.8" />
				<rect
					x="140"
					y="388"
					width="20"
					height="4"
					fill={color}
					opacity="0.8"
				/>
			</svg>
		</div>
	);
}

/**
 * TCG Card Component
 *
 * A reusable card component with a "Trading Card Game" aesthetic.
 * Features a custom SVG frame, glassmorphism effects, and variant-based styling.
 */
export function TCGCard({
	children,
	variant = "default",
	className,
	isActive = true,
	isInteractive = false,
	onClick,
}: TCGCardProps) {
	const color = variantColors[variant];
	const styles = variantStyles[variant];

	return (
		<motion.div
			whileHover={isInteractive ? { y: -5 } : undefined}
			className={cn("h-full relative group", className)}
			onClick={onClick}
		>
			<div
				className={cn(
					"relative overflow-hidden transition-all duration-300 h-full flex flex-col",
					"bg-card/30 backdrop-blur-sm", // Base glassmorphism
					isActive ? "opacity-100" : "opacity-70 grayscale-[0.5]",
					isInteractive && isActive && "hover:shadow-lg hover:shadow-primary/5",
				)}
				style={{
					// Custom clip-path to match the SVG frame shape roughly
					clipPath:
						"polygon(20px 10px, calc(100% - 20px) 10px, calc(100% - 10px) 20px, calc(100% - 10px) calc(100% - 20px), calc(100% - 20px) calc(100% - 10px), 20px calc(100% - 10px), 10px calc(100% - 20px), 10px 20px)",
				}}
			>
				{/* Inner Border/Surface */}
				<div
					className={cn(
						"absolute inset-0.5 z-0 transition-colors duration-300",
						isActive ? styles.bg : "bg-muted/5",
					)}
				/>

				{/* TCG Frame Overlay */}
				<TCGFrame color={color} isActive={isActive} />

				{/* Background Gradient */}
				{isActive && (
					<div
						className={cn(
							"absolute inset-0 bg-linear-to-b to-transparent opacity-20 pointer-events-none z-0",
							styles.glow,
						)}
					/>
				)}

				{/* Content Container - Padded to fit inside frame */}
				<div className="relative z-10 flex flex-col h-full p-6 pt-8 pb-8">
					{children}
				</div>
			</div>
		</motion.div>
	);
}
