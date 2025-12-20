/**
 * ModuleEdge Component
 *
 * Custom animated edge for connecting module nodes in the roadmap.
 * Shows visual feedback with dash animation for active paths.
 */

"use client";

import { BaseEdge, type EdgeProps, getBezierPath } from "@xyflow/react";
import { memo } from "react";
import type { RoadmapEdge, RoadmapEdgeData } from "../_schemas";

/**
 * ModuleEdge - Custom edge component for React Flow
 *
 * Features:
 * - Bezier curve path for organic flow
 * - Animated dashes for active/in-progress paths
 * - Color coding based on completion status
 */
function ModuleEdgeComponent({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	data,
	animated,
}: EdgeProps<RoadmapEdge>) {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edgeData = data as RoadmapEdgeData | undefined;
	const isActive = edgeData?.active;

	return (
		<>
			{/* Background path for glow effect on active edges */}
			{isActive && (
				<BaseEdge
					id={`${id}-glow`}
					path={edgePath}
					style={{
						stroke: "var(--color-success)",
						strokeWidth: 6,
						opacity: 0.2,
						filter: "blur(3px)",
					}}
				/>
			)}

			{/* Main edge path */}
			<BaseEdge
				id={id}
				path={edgePath}
				style={{
					strokeWidth: 2,
					stroke: isActive
						? "var(--color-success)"
						: animated
							? "var(--color-warning)"
							: "var(--color-border)",
					...style,
				}}
				className={animated ? "animate-dash" : ""}
			/>
		</>
	);
}

/**
 * Memoized ModuleEdge for performance
 */
export const ModuleEdge = memo(ModuleEdgeComponent);
