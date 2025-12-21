/**
 * Layout Calculator
 *
 * Serpentine layout algorithm for the Learning Path Flow visualization.
 * Creates a Duolingo-style zigzag vertical path for module nodes.
 */

import type {
	LayoutConfig,
	ModuleNodeData,
	RoadmapEdge,
	RoadmapNode,
} from "../_schemas";
import { DEFAULT_LAYOUT_CONFIG } from "../_schemas";

/**
 * Calculate position for a single node in the serpentine layout
 *
 * @param index - The node's index in the list
 * @param config - Layout configuration
 * @returns Position { x, y } for the node
 *
 * @example
 * ```
 * Row 0:  [0] → [1] → [2]
 *                     ↓
 * Row 1:  [5] ← [4] ← [3]
 *         ↓
 * Row 2:  [6] → [7] → [8]
 * ```
 */
export function calculateSerpentinePosition(
	index: number,
	config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
): { x: number; y: number } {
	const row = Math.floor(index / config.nodesPerRow);
	const posInRow = index % config.nodesPerRow;
	const isEvenRow = row % 2 === 0;

	// Zigzag: even rows go left→right, odd rows go right→left
	const col = isEvenRow ? posInRow : config.nodesPerRow - 1 - posInRow;

	return {
		x: config.startX + col * (config.nodeWidth + config.horizontalSpacing),
		y: config.startY + row * (config.nodeHeight + config.verticalSpacing),
	};
}

/**
 * Generate React Flow nodes from module data
 *
 * @param modules - Array of module node data
 * @param config - Layout configuration
 * @returns Array of positioned React Flow nodes
 */
export function generateNodesFromModules(
	modules: ModuleNodeData[],
	config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
): RoadmapNode[] {
	return modules.map((moduleData, index) => {
		const position = calculateSerpentinePosition(index, config);

		return {
			id: moduleData.moduleId,
			type: "module" as const,
			position,
			data: moduleData,
			draggable: false,
			selectable: true,
			connectable: false,
		};
	});
}

/**
 * Generate edges connecting nodes in serpentine order
 *
 * @param nodes - Array of roadmap nodes
 * @returns Array of React Flow edges
 */
export function generateEdgesFromNodes(nodes: RoadmapNode[]): RoadmapEdge[] {
	const edges: RoadmapEdge[] = [];

	// Filter only module nodes for edge generation
	const moduleNodes = nodes.filter((node) => node.type === "module");

	for (let i = 0; i < moduleNodes.length - 1; i++) {
		const sourceNode = moduleNodes[i];
		const targetNode = moduleNodes[i + 1];

		// Check if both nodes are completed for "active" edge styling
		const sourceData = sourceNode.data as ModuleNodeData;
		const targetData = targetNode.data as ModuleNodeData;
		const isActive =
			sourceData.status === "completed" && targetData.status === "completed";

		// Determine handles based on relative position
		let sourceHandle = "bottom";
		let targetHandle = "top";

		if (targetNode.position.y > sourceNode.position.y) {
			// Row change
			sourceHandle = "bottom";
			targetHandle = "top";
		} else if (targetNode.position.x > sourceNode.position.x) {
			// Left to Right
			sourceHandle = "right";
			targetHandle = "left";
		} else if (targetNode.position.x < sourceNode.position.x) {
			// Right to Left
			sourceHandle = "left";
			targetHandle = "right";
		}

		edges.push({
			id: `edge-${sourceNode.id}-${targetNode.id}`,
			source: sourceNode.id,
			target: targetNode.id,
			sourceHandle,
			targetHandle,
			type: "animated",
			animated:
				sourceData.status === "completed" ||
				sourceData.status === "in_progress",
			data: { active: isActive },
			style: {
				stroke: isActive
					? "var(--color-success)"
					: "var(--color-muted-foreground)",
				strokeWidth: 2,
			},
		});
	}

	return edges;
}

/**
 * Calculate the bounds of the entire roadmap for fitView
 *
 * @param nodes - Array of roadmap nodes
 * @param config - Layout configuration
 * @returns Bounding box { x, y, width, height }
 */
export function calculateRoadmapBounds(
	nodes: RoadmapNode[],
	config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
): { x: number; y: number; width: number; height: number } {
	if (nodes.length === 0) {
		return { x: 0, y: 0, width: 400, height: 300 };
	}

	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;

	for (const node of nodes) {
		minX = Math.min(minX, node.position.x);
		minY = Math.min(minY, node.position.y);
		maxX = Math.max(maxX, node.position.x + config.nodeWidth);
		maxY = Math.max(maxY, node.position.y + config.nodeHeight);
	}

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
}
