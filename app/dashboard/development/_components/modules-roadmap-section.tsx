/**
 * ModulesRoadmapSection Component
 *
 * Client component wrapper for the Learning Path Flow.
 * Handles navigation when a module node is clicked.
 * Supports toggle between roadmap and list views.
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useViewPreference } from "../_hooks";
import type { ModuleCard } from "../_schemas";
import { LearningPathFlow } from "./learning-path-flow";
import { ModuleList } from "./module-list";
import { ViewToggle } from "./view-toggle";

export interface ModulesRoadmapSectionProps {
	/** Array of module cards */
	modules: ModuleCard[];
}

/**
 * ModulesRoadmapSection - Client wrapper for roadmap with navigation and view toggle
 */
export function ModulesRoadmapSection({ modules }: ModulesRoadmapSectionProps) {
	const { view, setView, isHydrated } = useViewPreference("roadmap");

	return (
		<div className="space-y-4">
			{/* View Toggle Header */}
			<div className="flex items-center justify-end">
				<ViewToggle view={view} onChange={setView} disabled={!isHydrated} />
			</div>

			{/* Conditional Rendering */}
			{view === "roadmap" ? (
				<LearningPathFlow modules={modules} />
			) : (
				<ModuleList modules={modules} />
			)}
		</div>
	);
}
