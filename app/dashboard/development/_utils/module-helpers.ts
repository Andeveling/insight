/**
 * Module Helpers
 *
 * Utility functions for filtering, sorting, and organizing development modules.
 */

import type { ModuleCard, ModuleLevel } from "../_schemas";

/**
 * Sort modules by various criteria
 */
export function sortModules(
  modules: ModuleCard[],
  sortBy: "level" | "xp" | "time" | "progress" = "level"
): ModuleCard[] {
  const sorted = [ ...modules ];

  switch (sortBy) {
    case "level":
      return sorted.sort((a, b) => {
        const levelOrder: Record<ModuleLevel, number> = {
          beginner: 1,
          intermediate: 2,
          advanced: 3,
        };
        return levelOrder[ a.level ] - levelOrder[ b.level ];
      });

    case "xp":
      return sorted.sort((a, b) => b.xpReward - a.xpReward);

    case "time":
      return sorted.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

    case "progress":
      return sorted.sort(
        (a, b) => b.progress.percentComplete - a.progress.percentComplete
      );

    default:
      return sorted;
  }
}

/**
 * Filter modules by status
 */
export function filterModulesByStatus(
  modules: ModuleCard[],
  status: "all" | "not_started" | "in_progress" | "completed"
): ModuleCard[] {
  if (status === "all") return modules;
  return modules.filter((m) => m.progress.status === status);
}

/**
 * Group modules by level
 */
export function groupModulesByLevel(
  modules: ModuleCard[]
): Record<ModuleLevel, ModuleCard[]> {
  return {
    beginner: modules.filter((m) => m.level === "beginner"),
    intermediate: modules.filter((m) => m.level === "intermediate"),
    advanced: modules.filter((m) => m.level === "advanced"),
  };
}

/**
 * Group modules by domain
 */
export function groupModulesByDomain(
  modules: ModuleCard[]
): Map<string, ModuleCard[]> {
  const grouped = new Map<string, ModuleCard[]>();

  for (const devModule of modules) {
    const domain = devModule.domainKey || "general";
    if (!grouped.has(domain)) {
      grouped.set(domain, []);
    }
    grouped.get(domain)!.push(devModule);
  }

  return grouped;
}

/**
 * Get modules that match user's strengths
 */
export function getRecommendedModules(
  modules: ModuleCard[],
  userStrengthKeys: string[],
  userDomainKeys: string[]
): ModuleCard[] {
  return modules.filter(
    (m) =>
      (m.strengthKey && userStrengthKeys.includes(m.strengthKey)) ||
      (m.domainKey && userDomainKeys.includes(m.domainKey))
  );
}

/**
 * Get in-progress modules sorted by most recent activity
 */
export function getInProgressModules(modules: ModuleCard[]): ModuleCard[] {
  return modules
    .filter((m) => m.progress.status === "in_progress")
    .sort((a, b) => b.progress.percentComplete - a.progress.percentComplete);
}

/**
 * Calculate total stats from modules
 */
export function calculateModuleStats(modules: ModuleCard[]): {
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalXpAvailable: number;
  earnedXp: number;
  totalMinutes: number;
  completedMinutes: number;
} {
  const totalModules = modules.length;
  const completedModules = modules.filter(
    (m) => m.progress.status === "completed"
  ).length;
  const inProgressModules = modules.filter(
    (m) => m.progress.status === "in_progress"
  ).length;
  const totalXpAvailable = modules.reduce((sum, m) => sum + m.xpReward, 0);
  const earnedXp = modules
    .filter((m) => m.progress.status === "completed")
    .reduce((sum, m) => sum + m.xpReward, 0);
  const totalMinutes = modules.reduce((sum, m) => sum + m.estimatedMinutes, 0);
  const completedMinutes = modules
    .filter((m) => m.progress.status === "completed")
    .reduce((sum, m) => sum + m.estimatedMinutes, 0);

  return {
    totalModules,
    completedModules,
    inProgressModules,
    totalXpAvailable,
    earnedXp,
    totalMinutes,
    completedMinutes,
  };
}

/**
 * Get level display name in Spanish
 */
export function getLevelDisplayName(level: ModuleLevel): string {
  const names: Record<ModuleLevel, string> = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
  };
  return names[ level ];
}

/**
 * Get domain display name in Spanish
 */
export function getDomainDisplayName(domainKey: string | null): string {
  if (!domainKey) return "General";

  const names: Record<string, string> = {
    doing: "Hacer",
    feeling: "Sentir",
    motivating: "Motivar",
    thinking: "Pensar",
  };

  return names[ domainKey ] || domainKey;
}
