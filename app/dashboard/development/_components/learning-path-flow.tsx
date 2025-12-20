/**
 * LearningPathFlow Component
 *
 * Main React Flow canvas wrapper for the Learning Path visualization.
 * Renders modules as connected nodes in a serpentine layout.
 */

"use client";

import {
	Background,
	BackgroundVariant,
	type EdgeTypes,
	type NodeMouseHandler,
	type NodeTypes,
	ReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";
import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/cn";
import { useNodeInteractions, useRoadmapLayout } from "../_hooks";
import type { ModuleCard } from "../_schemas";
import { ModuleEdge } from "./module-edge";
import { ModuleNode } from "./module-node";
import { ModulePreviewPanel } from "./module-preview-panel";
import { RoadmapControls } from "./roadmap-controls";
import { RoadmapEmptyState } from "./roadmap-empty-state";
import { SectionNode } from "./section-node";

// Register custom node types - use type assertion for React Flow compatibility
const nodeTypes = {
	module: ModuleNode,
	section: SectionNode,
} as NodeTypes;

// Register custom edge types
const edgeTypes = {
	animated: ModuleEdge,
} as EdgeTypes;

export interface LearningPathFlowProps {
	/** Array of module cards to display */
	modules: ModuleCard[];
	/** Callback when a module node is clicked */
	onNodeClick?: (moduleId: string) => void;
	/** Optional className for the container */
	className?: string;
}

/**
 * LearningPathFlow - Main roadmap canvas component
 *
 * Features:
 * - Serpentine layout for modules
 * - Custom styled nodes with status indicators
 * - Animated edges connecting nodes
 * - Zoom/pan controls
 * - Click handlers for module selection
 * - Preview panel for module details
 */
export function LearningPathFlow({
	modules,
	onNodeClick,
	className,
}: LearningPathFlowProps) {
	const {
		nodes,
		edges,
		isEmpty,
		overallProgress,
		completedModules,
		totalModules,
	} = useRoadmapLayout(modules);

	const {
		selectedNodeData,
		isPanelOpen,
		handleNodeClick: onNodeInteractionClick,
		handleClosePanel,
	} = useNodeInteractions();

	// Handle node click - trigger both external callback and internal panel
	const handleNodeClick: NodeMouseHandler = useCallback(
		(event, node) => {
			// Internal panel handling
			onNodeInteractionClick(event, node);

			// External callback if provided
			if (node.type === "module" && onNodeClick) {
				onNodeClick(node.id);
			}
		},
		[onNodeClick, onNodeInteractionClick],
	);

	// Default edge options
	const defaultEdgeOptions = useMemo(
		() => ({
			type: "animated",
			animated: false,
		}),
		[],
	);

	if (isEmpty) {
		return <RoadmapEmptyState />;
	}

	return (
		<div
			className={cn(
				"relative w-full rounded-xl border bg-background",
				"h-[400px] sm:h-[500px] md:h-[600px]", // Responsive height
				className,
			)}
		>
			{/* Progress header */}
			<div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg border px-2 py-1 sm:px-4 sm:py-2 shadow-sm">
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="text-xs sm:text-sm font-medium">
						Progreso: <span className="text-primary">{overallProgress}%</span>
					</div>
					<div className="text-xs text-muted-foreground hidden sm:block">
						{completedModules}/{totalModules} módulos
					</div>
				</div>
			</div>

			<ReactFlow
				nodes={nodes as never[]}
				edges={edges as never[]}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				defaultEdgeOptions={defaultEdgeOptions}
				onNodeClick={handleNodeClick}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.3}
				maxZoom={1.5}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={true}
				panOnDrag={true}
				zoomOnScroll={true}
				zoomOnPinch={true}
				panOnScroll={false}
				preventScrolling={true}
				attributionPosition="bottom-left"
				proOptions={{ hideAttribution: true }}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
					color="var(--color-muted-foreground)"
					className="opacity-30"
				/>
				<RoadmapControls />
			</ReactFlow>

			{/* Module Preview Panel */}
			<ModulePreviewPanel
				module={selectedNodeData}
				open={isPanelOpen}
				onClose={handleClosePanel}
			/>
		</div>
	);
}
