/**
 * Node Status Mapper
 *
 * Maps module progress data to visual node status for the Learning Path Flow.
 * Transforms ModuleCard data into ModuleNodeData for React Flow rendering.
 */

import type { ModuleCard } from "../_schemas";
import type { ModuleNodeData, NodeStatus } from "../_schemas/roadmap.schema";

/**
 * Map module progress status to visual node status
 *
 * @param module - Module card with progress data
 * @returns Visual node status for rendering
 */
export function mapModuleToNodeStatus(module: ModuleCard): NodeStatus {
	const { status } = module.progress;

	switch (status) {
		case "completed":
			return "completed";
		case "in_progress":
			return "in_progress";
		case "not_started":
		default:
			// TODO: Add prerequisite checking for "locked" status
			// For now, all not_started modules are available
			return "not_started";
	}
}

/**
 * Transform ModuleCard to ModuleNodeData for React Flow
 *
 * @param module - Module card from the existing schema
 * @returns Module node data for React Flow rendering
 */
export function moduleCardToNodeData(module: ModuleCard): ModuleNodeData {
	return {
		moduleId: module.id,
		title: module.titleEs,
		level: module.level,
		status: mapModuleToNodeStatus(module),
		progress: module.progress.percentComplete,
		xpReward: module.xpReward,
		estimatedMinutes: module.estimatedMinutes,
		strengthKey: module.strengthKey,
		domainKey: null, // ModuleCard doesn't have domainKey, will be inferred from strengthKey if needed
		moduleType: module.moduleType,
		completedChallenges: module.progress.completedChallenges,
		totalChallenges: module.progress.totalChallenges,
	};
}

/**
 * Transform array of ModuleCards to ModuleNodeData array
 *
 * @param modules - Array of module cards
 * @returns Array of module node data
 */
export function modulesCardsToNodeData(
	modules: ModuleCard[],
): ModuleNodeData[] {
	return modules.map(moduleCardToNodeData);
}

/**
 * Get CSS color variable for node status
 *
 * @param status - Node status
 * @returns CSS variable name for the status color
 */
export function getStatusColor(status: NodeStatus): string {
	switch (status) {
		case "completed":
			return "var(--color-success)";
		case "in_progress":
			return "var(--color-warning)";
		case "locked":
			return "var(--color-muted)";
		case "not_started":
		default:
			return "var(--color-muted-foreground)";
	}
}

/**
 * Get background color class for node status
 *
 * @param status - Node status
 * @returns Tailwind class for background color
 */
export function getStatusBackgroundClass(status: NodeStatus): string {
	switch (status) {
		case "completed":
			return "bg-success/10 border-success";
		case "in_progress":
			return "bg-warning/10 border-warning";
		case "locked":
			return "bg-muted/50 border-muted";
		case "not_started":
		default:
			return "bg-card border-border";
	}
}

/**
 * Get icon name for node status
 *
 * @param status - Node status
 * @returns Lucide icon name
 */
export function getStatusIcon(status: NodeStatus): string {
	switch (status) {
		case "completed":
			return "CheckCircle2";
		case "in_progress":
			return "PlayCircle";
		case "locked":
			return "Lock";
		case "not_started":
		default:
			return "Circle";
	}
}

/**
 * Get level icon for module level
 *
 * @param level - Module level
 * @returns Emoji icon for the level
 */
export function getLevelIcon(level: ModuleNodeData["level"]): string {
	switch (level) {
		case "beginner":
			return "🌱";
		case "intermediate":
			return "🌿";
		case "advanced":
			return "🌳";
		default:
			return "📚";
	}
}

/**
 * Get level label in Spanish
 *
 * @param level - Module level
 * @returns Spanish label for the level
 */
export function getLevelLabel(level: ModuleNodeData["level"]): string {
	switch (level) {
		case "beginner":
			return "Principiante";
		case "intermediate":
			return "Intermedio";
		case "advanced":
			return "Avanzado";
		default:
			return "Nivel desconocido";
	}
}
