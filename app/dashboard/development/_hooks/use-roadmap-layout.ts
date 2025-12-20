/**
 * useRoadmapLayout Hook
 *
 * Transforms an array of ModuleCard data into React Flow nodes and edges
 * for the Learning Path Flow visualization.
 */

"use client";

import { useMemo } from "react";
import type {
	LayoutConfig,
	ModuleCard,
	RoadmapEdge,
	RoadmapNode,
	SectionNodeData,
} from "../_schemas";
import { DEFAULT_LAYOUT_CONFIG } from "../_schemas";
import {
	generateEdgesFromNodes,
	generateNodesFromModules,
} from "../_utils/layout-calculator";
import { modulesCardsToNodeData } from "../_utils/node-status-mapper";
import {
	type GroupingStrategy,
	groupModulesBySection,
	type SectionGroup,
} from "../_utils/section-grouper";

export interface UseRoadmapLayoutOptions {
	/** Layout configuration (optional, uses defaults) */
	config?: Partial<LayoutConfig>;
	/** Whether to group modules by sections */
	enableSections?: boolean;
	/** Grouping strategy for sections */
	groupBy?: GroupingStrategy;
}

export interface UseRoadmapLayoutResult {
	/** React Flow nodes positioned in serpentine layout */
	nodes: RoadmapNode[];
	/** React Flow edges connecting nodes */
	edges: RoadmapEdge[];
	/** Whether there are any modules */
	isEmpty: boolean;
	/** Total count of modules */
	totalModules: number;
	/** Count of completed modules */
	completedModules: number;
	/** Overall progress percentage */
	overallProgress: number;
	/** Section groups (if enabled) */
	sections: SectionGroup[];
}

/**
 * Hook to transform ModuleCard array into React Flow layout
 *
 * @param modules - Array of module cards from the database
 * @param options - Layout configuration options
 * @returns Nodes, edges, and progress statistics
 *
 * @example
 * ```tsx
 * const { nodes, edges, overallProgress } = useRoadmapLayout(modules);
 *
 * return (
 *   <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}>
 *     <Controls />
 *   </ReactFlow>
 * );
 * ```
 */
export function useRoadmapLayout(
	modules: ModuleCard[],
	options: UseRoadmapLayoutOptions = {},
): UseRoadmapLayoutResult {
	const { enableSections = false, groupBy = "level" } = options;

	const config: LayoutConfig = useMemo(
		() => ({
			...DEFAULT_LAYOUT_CONFIG,
			...options.config,
		}),
		[options.config],
	);

	// Group modules by sections (if enabled)
	const sections = useMemo(
		() => (enableSections ? groupModulesBySection(modules, groupBy) : []),
		[modules, enableSections, groupBy],
	);

	// Transform ModuleCard[] to ModuleNodeData[]
	const nodeData = useMemo(() => modulesCardsToNodeData(modules), [modules]);

	// Generate positioned nodes (including section nodes if enabled)
	const nodes = useMemo(() => {
		const moduleNodes = generateNodesFromModules(nodeData, config);

		if (!enableSections || sections.length === 0) {
			return moduleNodes;
		}

		// Insert section nodes between groups
		const allNodes: RoadmapNode[] = [];
		let yOffset = 0;
		const sectionSpacing = 100; // Extra vertical space for section headers

		for (const section of sections) {
			// Create section node
			const sectionNodeData: SectionNodeData = {
				sectionId: section.id,
				title: section.title,
				domainKey: null,
				completedCount: section.completedCount,
				totalCount: section.totalCount,
				progress: section.progress,
				moduleIds: section.modules.map((m) => m.id),
			};

			allNodes.push({
				id: section.id,
				type: "section",
				position: { x: config.startX, y: yOffset },
				data: sectionNodeData,
			});

			yOffset += sectionSpacing;

			// Add module nodes for this section with adjusted Y positions
			const sectionModuleData = modulesCardsToNodeData(section.modules);
			const sectionModuleNodes = generateNodesFromModules(sectionModuleData, {
				...config,
				startY: yOffset,
			});

			allNodes.push(...sectionModuleNodes);

			// Calculate next section starting Y
			if (sectionModuleNodes.length > 0) {
				const maxY = Math.max(...sectionModuleNodes.map((n) => n.position.y));
				yOffset = maxY + config.verticalSpacing + sectionSpacing;
			}
		}

		return allNodes;
	}, [nodeData, config, enableSections, sections]);

	// Generate edges connecting nodes (skip section nodes)
	const edges = useMemo(() => {
		const moduleNodes = nodes.filter((n) => n.type === "module");
		return generateEdgesFromNodes(moduleNodes);
	}, [nodes]);

	// Calculate progress statistics
	const stats = useMemo(() => {
		const total = modules.length;
		const completed = modules.filter(
			(m) => m.progress.status === "completed",
		).length;
		const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

		return {
			isEmpty: total === 0,
			totalModules: total,
			completedModules: completed,
			overallProgress: progress,
		};
	}, [modules]);

	return {
		nodes,
		edges,
		sections,
		...stats,
	};
}
