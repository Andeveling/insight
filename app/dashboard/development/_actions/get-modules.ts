"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";
import type { ModuleCard, ModuleFilters } from "../_schemas";

/**
 * Get development modules filtered by user's strengths and preferences.
 *
 * @param filters - Optional filters for level, domain, strength, etc.
 * @returns Array of module cards with progress information
 */
export async function getModules(
  filters?: ModuleFilters
): Promise<ModuleCard[]> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const userId = session.user.id;

  // Build where clause based on filters
  const where: {
    isActive: boolean;
    level?: string;
    domainKey?: string;
    strengthKey?: string;
    OR?: Array<{
      titleEs?: { contains: string };
      descriptionEs?: { contains: string };
    }>;
  } = {
    isActive: true,
  };

  if (filters?.level) {
    where.level = filters.level;
  }

  if (filters?.domainKey) {
    where.domainKey = filters.domainKey;
  }

  if (filters?.strengthKey) {
    where.strengthKey = filters.strengthKey;
  }

  if (filters?.search) {
    where.OR = [
      { titleEs: { contains: filters.search } },
      { descriptionEs: { contains: filters.search } },
    ];
  }

  // Fetch modules with challenge counts and user progress
  const modules = await prisma.developmentModule.findMany({
    where,
    include: {
      challenges: {
        select: { id: true },
      },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
    orderBy: [ { order: "asc" }, { level: "asc" } ],
  });

  // Fetch completed challenges per module
  const moduleIds = modules.map((m) => m.id);
  const completedChallenges = await prisma.userChallengeProgress.findMany({
    where: {
      userId,
      challenge: {
        moduleId: { in: moduleIds },
      },
      completed: true,
    },
    select: {
      challenge: {
        select: { moduleId: true },
      },
    },
  });

  // Build completed count map
  const completedCountMap = new Map<string, number>();
  for (const cp of completedChallenges) {
    const moduleId = cp.challenge.moduleId;
    completedCountMap.set(moduleId, (completedCountMap.get(moduleId) || 0) + 1);
  }

  // Map to ModuleCard format
  const moduleCards: ModuleCard[] = modules.map((module) => {
    const totalChallenges = module.challenges.length;
    const completedCount = completedCountMap.get(module.id) || 0;
    const userProgress = module.userProgress[ 0 ];

    let status: "not_started" | "in_progress" | "completed" = "not_started";
    if (userProgress) {
      status = userProgress.status as typeof status;
    }

    // Filter out completed modules if not requested
    const percentComplete =
      totalChallenges > 0
        ? Math.round((completedCount / totalChallenges) * 100)
        : 0;

    return {
      id: module.id,
      key: module.key,
      titleEs: module.titleEs,
      descriptionEs: module.descriptionEs,
      level: module.level as "beginner" | "intermediate" | "advanced",
      estimatedMinutes: module.estimatedMinutes,
      xpReward: module.xpReward,
      strengthKey: module.strengthKey,
      domainKey: module.domainKey,
      progress: {
        status,
        percentComplete,
        completedChallenges: completedCount,
        totalChallenges,
      },
    };
  });

  // Filter completed if needed
  if (!filters?.showCompleted) {
    return moduleCards.filter((m) => m.progress.status !== "completed");
  }

  return moduleCards;
}

/**
 * Get modules organized by user's strengths
 */
export async function getModulesByStrength(): Promise<
  Map<string, ModuleCard[]>
> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  // Get user's strengths
  const userStrengths = await prisma.userStrength.findMany({
    where: { userId: session.user.id },
    include: {
      strength: {
        include: { domain: true },
      },
    },
    orderBy: { rank: "asc" },
    take: 5, // Top 5 strengths
  });

  // Get all modules
  const modules = await getModules();

  // Organize by strength
  const modulesByStrength = new Map<string, ModuleCard[]>();

  // Add "Recommended" category for top strength matches
  const strengthKeys = userStrengths.map(
    (us) => us.strength.name.toLowerCase().replace(/\s+/g, "-")
  );
  const domainKeys = [
    ...new Set(userStrengths.map((us) => us.strength.domain.name.toLowerCase())),
  ];

  // Recommended: Modules matching user's top strengths or domains
  const recommended = modules.filter(
    (m) =>
      (m.strengthKey && strengthKeys.includes(m.strengthKey)) ||
      (m.domainKey && domainKeys.includes(m.domainKey))
  );

  if (recommended.length > 0) {
    modulesByStrength.set("Recomendados para ti", recommended);
  }

  // Group remaining by level
  const byLevel = {
    Principiante: modules.filter((m) => m.level === "beginner"),
    Intermedio: modules.filter((m) => m.level === "intermediate"),
    Avanzado: modules.filter((m) => m.level === "advanced"),
  };

  for (const [ level, levelModules ] of Object.entries(byLevel)) {
    if (levelModules.length > 0) {
      modulesByStrength.set(level, levelModules);
    }
  }

  return modulesByStrength;
}
