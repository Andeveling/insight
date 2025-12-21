/**
 * ModuleNode Component
 *
 * Custom React Flow node for displaying a development module in the roadmap.
 * Redesigned as a compact, gamified badge (Duolingo-style).
 */

"use client";

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Check, Lock, Play, Star } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/cn";
import type { ModuleNodeData, ModuleNode as ModuleNodeType } from "../_schemas";

/**
 * ModuleNode - Custom node component for React Flow
 *
 * Displays a compact module badge with:
 * - Circular shape
 * - Status color coding
 * - Central icon
 * - Progress ring (for in-progress)
 * - HoverCard for quick details
 */
function ModuleNodeComponent({ data, selected }: NodeProps<ModuleNodeType>) {
	const nodeData = data as ModuleNodeData;
	const { title, status, progress, xpReward, level, estimatedMinutes } = nodeData;

	// Status-based styles
	const statusStyles = {
		completed: {
			bg: "bg-emerald-500",
			border: "border-emerald-600",
			shadow: "shadow-[0_4px_0_0_#059669]", // 3D effect
			icon: <Check className="size-8 text-white stroke-3" />,
		},
		in_progress: {
			bg: "bg-amber-400",
			border: "border-amber-500",
			shadow: "shadow-[0_4px_0_0_#d97706]",
			icon: <Play className="size-8 text-white fill-white ml-1" />,
		},
		not_started: {
			bg: "bg-slate-200 dark:bg-slate-700",
			border: "border-slate-300 dark:border-slate-600",
			shadow: "shadow-[0_4px_0_0_#94a3b8] dark:shadow-[0_4px_0_0_#475569]",
			icon: <Star className="size-8 text-slate-400 dark:text-slate-500" />,
		},
		locked: {
			bg: "bg-slate-100 dark:bg-slate-800",
			border: "border-slate-200 dark:border-slate-700",
			shadow: "none",
			icon: <Lock className="size-6 text-slate-300 dark:text-slate-600" />,
		},
	};

	const currentStyle = statusStyles[status];
	const isLocked = status === "locked";

	// Animation variants
	const variants = {
		initial: { scale: 0.8, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		hover: {
			scale: isLocked ? 1 : 1.1,
			y: isLocked ? 0 : -4,
			transition: { type: "spring" as const, stiffness: 400, damping: 10 },
		},
		tap: { scale: 0.95, y: 0 },
	};

	return (
		<>
			{/* Connection Handles - 8 handles for better edge routing */}
			{/* All handles are centered to allow edges to enter/exit from any direction cleanly */}
			<Handle
				type="source"
				position={Position.Top}
				id="top"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="bottom"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="source"
				position={Position.Left}
				id="left"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="right"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>

			<Handle
				type="target"
				position={Position.Top}
				id="top"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="target"
				position={Position.Bottom}
				id="bottom"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="target"
				position={Position.Left}
				id="left"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>
			<Handle
				type="target"
				position={Position.Right}
				id="right"
				className="bg-transparent! border-none! w-1! h-1! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			/>

			<HoverCard openDelay={200} closeDelay={100}>
				<HoverCardTrigger asChild>
					<motion.div
						className="relative group cursor-pointer"
						initial="initial"
						animate="animate"
						whileHover="hover"
						whileTap="tap"
						variants={variants}
					>
						{/* Main Circle Badge */}
						<div
							className={cn(
								"size-20 rounded-full flex items-center justify-center border-4 transition-colors relative z-10",
								currentStyle.bg,
								currentStyle.border,
								currentStyle.shadow,
								selected && "ring-4 ring-primary/30 ring-offset-2",
								isLocked && "opacity-80 grayscale",
							)}
						>
							{/* Progress Ring for In Progress */}
							{status === "in_progress" && (
								<svg
									className="absolute inset-0 -m-1 size-[88px] -rotate-90 pointer-events-none"
									viewBox="0 0 100 100"
								>
									<circle
										cx="50"
										cy="50"
										r="46"
										fill="none"
										stroke="currentColor"
										strokeWidth="6"
										className="text-amber-200/30"
									/>
									<circle
										cx="50"
										cy="50"
										r="46"
										fill="none"
										stroke="currentColor"
										strokeWidth="6"
										strokeDasharray="289"
										strokeDashoffset={289 - (289 * progress) / 100}
										strokeLinecap="round"
										className="text-amber-600 transition-all duration-1000 ease-out"
									/>
								</svg>
							)}

							{/* Icon */}
							{currentStyle.icon}

							{/* XP Pill (Floating below) */}
							{!isLocked && (
								<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-sm whitespace-nowrap flex items-center gap-1">
									<span className="text-amber-500">⚡</span>
									{xpReward}
								</div>
							)}
						</div>

						{/* Label (Title) - Visible on hover or always if preferred */}
						<div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-32 text-center pointer-events-none">
							<span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								{title}
							</span>
						</div>
					</motion.div>
				</HoverCardTrigger>

				<HoverCardContent
					side="right"
					align="center"
					className="w-64 p-4 border-l-4 border-l-primary"
				>
					<div className="space-y-2">
						<div className="flex items-start justify-between">
							<h4 className="text-sm font-semibold leading-tight">{title}</h4>
							{status === "completed" && (
								<Check className="size-4 text-emerald-500 shrink-0" />
							)}
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<span className="capitalize bg-secondary px-1.5 py-0.5 rounded">
								{level}
							</span>
							<span>•</span>
							<span>{estimatedMinutes} min</span>
						</div>
						{status === "in_progress" && (
							<div className="space-y-1">
								<div className="flex justify-between text-xs">
									<span>Progreso</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
									<div
										className="h-full bg-primary transition-all duration-500"
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>
						)}
						<div className="pt-2 text-xs text-muted-foreground border-t mt-2">
							Click para ver detalles
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>
		</>
	);
}

export const ModuleNode = memo(ModuleNodeComponent);
