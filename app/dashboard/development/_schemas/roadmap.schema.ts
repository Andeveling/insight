/**
 * Roadmap Schemas
 *
 * Zod validation schemas and TypeScript types for the Learning Path Flow visualization.
 * Used by React Flow to render the interactive roadmap canvas.
 */

import type { Edge, Node } from "@xyflow/react";
import { z } from "zod";

// ============================================================================
// Node Status
// ============================================================================

/**
 * Visual states for roadmap nodes
 */
export const NodeStatusSchema = z.enum([
	"completed", // Green with checkmark ✓
	"in_progress", // Yellow with percentage
	"not_started", // Neutral gray
	"locked", // Dark gray with lock 🔒
]);

export type NodeStatus = z.infer<typeof NodeStatusSchema>;

// ============================================================================
// Module Node Data
// ============================================================================

/**
 * Extended data for a module node in React Flow
 */
export const ModuleNodeDataSchema = z.object({
	/** Module ID (from DevelopmentModule) */
	moduleId: z.string(),

	/** Title in Spanish */
	title: z.string(),

	/** Difficulty level */
	level: z.enum(["beginner", "intermediate", "advanced"]),

	/** Visual state of the node */
	status: NodeStatusSchema,

	/** Progress percentage (0-100) */
	progress: z.number().min(0).max(100),

	/** XP reward for completing the module */
	xpReward: z.number(),

	/** Estimated duration in minutes */
	estimatedMinutes: z.number(),

	/** Associated strength key (optional) */
	strengthKey: z.string().nullable(),

	/** Associated domain key (optional) */
	domainKey: z.string().nullable(),

	/** Module type */
	moduleType: z.enum(["general", "personalized"]),

	/** Completed challenges count */
	completedChallenges: z.number(),

	/** Total challenges count */
	totalChallenges: z.number(),
});

export type ModuleNodeData = z.infer<typeof ModuleNodeDataSchema>;

// ============================================================================
// Section Node Data
// ============================================================================

/**
 * Data for a section node (domain/strength separator)
 */
export const SectionNodeDataSchema = z.object({
	/** Unique section ID */
	sectionId: z.string(),

	/** Section title (e.g., "Nivel Principiante") */
	title: z.string(),

	/** Domain key for theming */
	domainKey: z.string().nullable(),

	/** Completed modules in this section */
	completedCount: z.number(),

	/** Total modules in this section */
	totalCount: z.number(),

	/** Progress percentage (0-100) */
	progress: z.number().min(0).max(100),

	/** IDs of modules in this section (for zoom/focus) */
	moduleIds: z.array(z.string()),
});

export type SectionNodeData = z.infer<typeof SectionNodeDataSchema>;

// ============================================================================
// React Flow Node Types
// ============================================================================

/**
 * Module node for React Flow
 */
export type ModuleNode = Node<ModuleNodeData, "module">;

/**
 * Section node for React Flow
 */
export type SectionNode = Node<SectionNodeData, "section">;

/**
 * Union of all roadmap node types
 */
export type RoadmapNode = ModuleNode | SectionNode;

// ============================================================================
// React Flow Edge Types
// ============================================================================

/**
 * Edge data for roadmap connections
 */
export interface RoadmapEdgeData extends Record<string, unknown> {
	/** Whether the edge connects completed nodes */
	active?: boolean;
}

/**
 * Edge for connecting nodes in the roadmap
 * Uses animated smoothstep edges
 */
export type RoadmapEdge = Edge<RoadmapEdgeData>;

// ============================================================================
// Layout Configuration
// ============================================================================

/**
 * Configuration for the serpentine layout algorithm
 */
export const LayoutConfigSchema = z.object({
	/** Node width in px */
	nodeWidth: z.number().default(100),

	/** Node height in px */
	nodeHeight: z.number().default(100),

	/** Horizontal spacing between nodes */
	horizontalSpacing: z.number().default(80),

	/** Vertical spacing between rows */
	verticalSpacing: z.number().default(100),

	/** Extra spacing before section nodes */
	sectionSpacing: z.number().default(60),

	/** Number of nodes per row (before zigzag) */
	nodesPerRow: z.number().default(3),

	/** Starting X position */
	startX: z.number().default(100),

	/** Starting Y position */
	startY: z.number().default(50),
});

export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;

/**
 * Default layout configuration
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
	nodeWidth: 160,
	nodeHeight: 160,
	horizontalSpacing: 120,
	verticalSpacing: 140,
	sectionSpacing: 100,
	nodesPerRow: 6,
	startX: 150,
	startY: 100,
};

// ============================================================================
// View Preference
// ============================================================================

/**
 * User's view preference
 */
export const ViewPreferenceSchema = z.enum(["roadmap", "list"]);

export type ViewPreference = z.infer<typeof ViewPreferenceSchema>;

/**
 * localStorage key for view preference
 */
export const VIEW_PREFERENCE_KEY = "insight:development:viewPreference";
