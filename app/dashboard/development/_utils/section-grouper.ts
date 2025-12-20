/**
 * Section Grouper Utility
 *
 * Groups modules by domain/level for section visualization in the roadmap.
 * Creates logical sections with progress tracking.
 */

import type { ModuleCard } from "../_schemas";

/**
 * Section information with modules and progress
 */
export interface SectionGroup {
  /** Section identifier (domainKey or level-based) */
  id: string;

  /** Section display title */
  title: string;

  /** Modules in this section */
  modules: ModuleCard[];

  /** Number of completed modules */
  completedCount: number;

  /** Total modules in section */
  totalCount: number;

  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Section configuration for grouping
 */
export type GroupingStrategy = "domain" | "level" | "type";

/**
 * Level order for sorting
 */
const LEVEL_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

/**
 * Level display labels
 */
const LEVEL_LABELS: Record<string, string> = {
  beginner: "🌱 Principiante",
  intermediate: "🌿 Intermedio",
  advanced: "🌳 Avanzado",
};

/**
 * Type display labels
 */
const TYPE_LABELS: Record<string, string> = {
  personalized: "✨ Personalizado",
  general: "📚 General",
};

/**
 * Groups modules by the specified strategy
 *
 * @param modules - Array of modules to group
 * @param strategy - Grouping strategy (domain, level, or type)
 * @returns Array of SectionGroup with progress tracking
 */
export function groupModulesBySection(
  modules: ModuleCard[],
  strategy: GroupingStrategy = "level"
): SectionGroup[] {
  const groups = new Map<string, ModuleCard[]>();

  // Group modules by key
  for (const mod of modules) {
    let key: string;
    switch (strategy) {
      case "domain":
        key = mod.strengthKey || "general";
        break;
      case "type":
        key = mod.moduleType;
        break;
      case "level":
      default:
        key = mod.level;
        break;
    }

    const existing = groups.get(key) || [];
    existing.push(mod);
    groups.set(key, existing);
  }

  // Convert to SectionGroup array with progress
  const sections: SectionGroup[] = [];

  for (const [key, mods] of groups) {
    const completedCount = mods.filter((m) => m.progress.status === "completed").length;
    const totalCount = mods.length;
    const progress =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let title: string;
    switch (strategy) {
      case "domain":
        // Use domain key as title or "General" fallback
        title = key === "general" ? "📚 General" : `🎯 ${key}`;
        break;
      case "type":
        title = TYPE_LABELS[key] || key;
        break;
      case "level":
      default:
        title = LEVEL_LABELS[key] || key;
        break;
    }

    sections.push({
      id: `section-${strategy}-${key}`,
      title,
      modules: mods,
      completedCount,
      totalCount,
      progress,
    });
  }

  // Sort sections
  sections.sort((a, b) => {
    if (strategy === "level") {
      // Sort by level order
      const levelA = a.id.replace(`section-level-`, "");
      const levelB = b.id.replace(`section-level-`, "");
      return (LEVEL_ORDER[levelA] ?? 99) - (LEVEL_ORDER[levelB] ?? 99);
    }
    if (strategy === "type") {
      // Personalized first
      return a.id.includes("personalized") ? -1 : 1;
    }
    // Default alphabetical
    return a.title.localeCompare(b.title);
  });

  return sections;
}

/**
 * Gets all modules as a flat array maintaining section order
 *
 * @param sections - Array of section groups
 * @returns Flattened array of modules in section order
 */
export function flattenSections(sections: SectionGroup[]): ModuleCard[] {
  return sections.flatMap((section) => section.modules);
}

/**
 * Calculate overall progress across all sections
 *
 * @param sections - Array of section groups
 * @returns Overall progress percentage (0-100)
 */
export function calculateOverallProgress(sections: SectionGroup[]): number {
  const totalCompleted = sections.reduce((sum, s) => sum + s.completedCount, 0);
  const totalModules = sections.reduce((sum, s) => sum + s.totalCount, 0);

  if (totalModules === 0) return 0;
  return Math.round((totalCompleted / totalModules) * 100);
}
