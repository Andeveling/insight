/**
 * ModuleNode Component
 *
 * Custom React Flow node for displaying a development module in the roadmap.
 * Shows visual status, progress, and level with gamified styling.
 */

"use client";

import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import {
	CheckCircle2,
	Circle,
	Clock,
	Lock,
	PlayCircle,
	Star,
} from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/cn";
import type { ModuleNodeData, ModuleNode as ModuleNodeType } from "../_schemas";
import {
	getLevelIcon,
	getLevelLabel,
	getStatusBackgroundClass,
} from "../_utils";

/**
 * Get icon component for node status
 */
function StatusIcon({ status }: { status: ModuleNodeData["status"] }) {
	const iconClass = "size-5";

	switch (status) {
		case "completed":
			return <CheckCircle2 className={cn(iconClass, "text-success")} />;
		case "in_progress":
			return <PlayCircle className={cn(iconClass, "text-warning")} />;
		case "locked":
			return <Lock className={cn(iconClass, "text-muted-foreground")} />;
		case "not_started":
		default:
			return <Circle className={cn(iconClass, "text-muted-foreground")} />;
	}
}

/**
 * ModuleNode - Custom node component for React Flow
 *
 * Displays a module with:
 * - Status indicator (icon + background color)
 * - Title
 * - Level badge
 * - Progress percentage (if in progress)
 * - XP reward
 * - HoverCard with detailed info
 */
function ModuleNodeComponent({ data, selected }: NodeProps<ModuleNodeType>) {
	const nodeData = data as ModuleNodeData;
	const {
		title,
		level,
		status,
		progress,
		xpReward,
		estimatedMinutes,
		moduleType,
		strengthKey,
	} = nodeData;

	const statusLabels: Record<ModuleNodeData["status"], string> = {
		completed: "Completado",
		in_progress: "En Progreso",
		not_started: "No Iniciado",
		locked: "Bloqueado",
	};

	return (
		<>
			{/* Input handle - top */}
			<Handle
				type="target"
				position={Position.Top}
				className="bg-transparent! border-none! w-4! h-1!"
			/>

			<HoverCard openDelay={300} closeDelay={100}>
				<HoverCardTrigger asChild>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ 
							scale: 1, 
							opacity: 1,
							// Pulse animation for completed
							...(status === "completed" && {
								boxShadow: [
									"0 0 0 0 rgba(34, 197, 94, 0)",
									"0 0 0 4px rgba(34, 197, 94, 0.2)",
									"0 0 0 0 rgba(34, 197, 94, 0)",
								],
							}),
						}}
						transition={{
							duration: 0.3,
							// Continuous pulse for completed
							...(status === "completed" && {
								boxShadow: {
									repeat: Infinity,
									duration: 2,
									ease: "easeInOut",
								},
							}),
						}}
						whileHover={{ scale: 1.02 }}
						whileTap={status === "locked" 
							? { x: [0, -5, 5, -5, 5, 0] } // Shake for locked
							: { scale: 0.98 }
						}
						className={cn(
							"relative flex flex-col gap-1 p-3 rounded-xl border-2 shadow-md cursor-pointer",
							"min-w-40 max-w-[180px]",
							"transition-shadow duration-200",
							getStatusBackgroundClass(status),
							selected && "ring-2 ring-primary ring-offset-2",
							status === "locked" && "opacity-60 cursor-not-allowed",
							// Glow effect for in_progress
							status === "in_progress" && "shadow-warning/30 shadow-lg",
						)}
					>
						{/* Header: Status icon + Level */}
						<div className="flex items-center justify-between">
							<StatusIcon status={status} />
							<span className="text-xs" title={level}>
								{getLevelIcon(level)}
							</span>
						</div>

						{/* Title */}
						<h3 className="text-sm font-medium leading-tight line-clamp-2">
							{title}
						</h3>

						{/* Progress bar (only for in_progress) */}
						{status === "in_progress" && (
							<div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 0.5 }}
									className="h-full bg-warning rounded-full"
								/>
							</div>
						)}

						{/* Footer: XP + Duration */}
						<div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
							<span className="font-medium text-primary">+{xpReward} XP</span>
							<span>{estimatedMinutes} min</span>
						</div>

						{/* Completed checkmark overlay */}
						{status === "completed" && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="absolute -top-2 -right-2 bg-success text-success-foreground rounded-full p-1"
							>
								<CheckCircle2 className="size-4" />
							</motion.div>
						)}
					</motion.div>
				</HoverCardTrigger>

				<HoverCardContent
					side="right"
					align="center"
					className="w-64 z-50"
					sideOffset={8}
				>
					<div className="space-y-2">
						{/* Header */}
						<div className="flex items-center gap-2">
							<span className="text-lg">{getLevelIcon(level)}</span>
							<div className="flex-1">
								<h4 className="text-sm font-semibold line-clamp-1">{title}</h4>
								<p className="text-xs text-muted-foreground">
									{getLevelLabel(level)}
								</p>
							</div>
						</div>

						{/* Type & Strength Info */}
						{(moduleType === "personalized" || strengthKey) && (
							<p className="text-xs text-muted-foreground line-clamp-2">
								{moduleType === "personalized" ? "Personalizado" : "General"}
								{strengthKey && ` • ${strengthKey}`}
							</p>
						)}

						{/* Stats */}
						<div className="flex items-center gap-4 pt-1">
							<div className="flex items-center gap-1 text-amber-500">
								<Star className="h-3.5 w-3.5" />
								<span className="text-xs font-medium">{xpReward} XP</span>
							</div>
							<div className="flex items-center gap-1 text-muted-foreground">
								<Clock className="h-3.5 w-3.5" />
								<span className="text-xs">{estimatedMinutes} min</span>
							</div>
						</div>

						{/* Status badge */}
						<div className="flex items-center gap-2 pt-1 border-t">
							<StatusIcon status={status} />
							<span className="text-xs">{statusLabels[status]}</span>
							{status === "in_progress" && (
								<span className="text-xs text-warning ml-auto">
									{progress}%
								</span>
							)}
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>

			{/* Output handle - bottom */}
			<Handle
				type="source"
				position={Position.Bottom}
				className="bg-transparent! border-none! w-4! h-1!"
			/>
		</>
	);
}

/**
 * Memoized ModuleNode for performance
 */
export const ModuleNode = memo(ModuleNodeComponent);
