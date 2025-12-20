/**
 * SectionNode Component
 *
 * Custom React Flow node for displaying a section header in the roadmap.
 * Shows section title and progress indicator.
 */

"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ChevronRight, Target } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

import type { SectionNodeData } from "../_schemas";

type SectionNodeType = Node<SectionNodeData, "section">;

/**
 * SectionNode - Custom node for section headers
 *
 * Features:
 * - Section title with emoji/icon
 * - Progress bar (X/Y completed)
 * - Click to focus/zoom on section modules
 */
function SectionNodeComponent({ data }: NodeProps<SectionNodeType>) {
	const nodeData = data as SectionNodeData;
	const { title, completedCount, totalCount, progress, moduleIds } = nodeData;
	const reactFlow = useReactFlow();

	/**
	 * Handle click to zoom to section modules
	 */
	const handleFocusSection = () => {
		if (!moduleIds || moduleIds.length === 0) return;

		// Get all nodes in this section
		const nodes = reactFlow.getNodes();
		const sectionNodes = nodes.filter((n) => moduleIds.includes(n.id));

		if (sectionNodes.length === 0) return;

		// Calculate bounds for these nodes
		const padding = 100;
		const xs = sectionNodes.map((n) => n.position.x);
		const ys = sectionNodes.map((n) => n.position.y);

		const minX = Math.min(...xs) - padding;
		const maxX = Math.max(...xs) + 200 + padding; // 200 = node width estimate
		const minY = Math.min(...ys) - padding;
		const maxY = Math.max(...ys) + 150 + padding; // 150 = node height estimate

		reactFlow.fitBounds(
			{ x: minX, y: minY, width: maxX - minX, height: maxY - minY },
			{ duration: 400, padding: 0.1 },
		);
	};

	const isComplete = completedCount === totalCount && totalCount > 0;

	return (
		<>
			{/* Input handle - for potential edge connections */}
			<Handle
				type="target"
				position={Position.Top}
				className="bg-transparent! border-none! w-1! h-1! opacity-0!"
			/>

			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					"flex items-center gap-3 px-4 py-2 rounded-lg border shadow-sm",
					"bg-muted/50 backdrop-blur-sm min-w-64",
					isComplete && "border-success/50 bg-success/10",
				)}
			>
				{/* Section icon */}
				<div
					className={cn(
						"flex items-center justify-center size-8 rounded-full",
						isComplete
							? "bg-success/20 text-success"
							: "bg-primary/20 text-primary",
					)}
				>
					<Target className="size-4" />
				</div>

				{/* Section info */}
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold truncate">{title}</h3>
					<div className="flex items-center gap-2 mt-1">
						<Progress value={progress} className="h-1.5 flex-1" />
						<span className="text-xs text-muted-foreground whitespace-nowrap">
							{completedCount}/{totalCount}
						</span>
					</div>
				</div>

				{/* Focus button */}
				<Button
					variant="ghost"
					size="icon"
					className="size-7 shrink-0"
					onClick={handleFocusSection}
					title="Ir a esta sección"
				>
					<ChevronRight className="size-4" />
				</Button>
			</motion.div>

			{/* Output handle */}
			<Handle
				type="source"
				position={Position.Bottom}
				className="bg-transparent! border-none! w-1! h-1! opacity-0!"
			/>
		</>
	);
}

/**
 * Memoized SectionNode for performance
 */
export const SectionNode = memo(SectionNodeComponent);
