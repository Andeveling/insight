"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";

/**
 * Peer learner type for display
 */
export interface PeerLearner {
  id: string;
  name: string;
  image: string | null;
  strengthKey: string | null;
  strengthNameEs: string;
  moduleId: string;
  moduleNameEs: string;
  progressPercent: number;
  complementaryStrengths: string[];
}

/**
 * Get peer learners working on the same strength path.
 *
 * Finds users who are currently working on the same development module
 * for a specific strength, excluding the current user.
 *
 * @param moduleId - Optional module ID to filter by
 * @param limit - Maximum number of peers to return (default: 10)
 * @returns Array of peer learners with their progress
 */
export async function getPeerLearners(
  moduleId?: string,
  limit: number = 10
): Promise<PeerLearner[]> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const userId = session.user.id;

  // Get user's current module progress or use provided moduleId
  let targetModuleIds: string[] = [];

  if (moduleId) {
    targetModuleIds = [ moduleId ];
  } else {
    // Get all modules the user is currently working on
    const userProgress = await prisma.userModuleProgress.findMany({
      where: {
        userId,
        status: "in_progress",
      },
      select: { moduleId: true },
    });
    targetModuleIds = userProgress.map((p) => p.moduleId);
  }

  if (targetModuleIds.length === 0) {
    return [];
  }

  // Get user's strengths for complementary matching
  const userStrengths = await prisma.userStrength.findMany({
    where: { userId },
    include: {
      strength: {
        select: { name: true },
      },
    },
  });
  const userStrengthNames = userStrengths.map((s) => s.strength.name);

  // Find other users working on the same modules
  const peerProgress = await prisma.userModuleProgress.findMany({
    where: {
      moduleId: { in: targetModuleIds },
      userId: { not: userId },
      status: "in_progress",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          userStrengths: {
            include: {
              strength: {
                select: { name: true, nameEs: true },
              },
            },
            take: 5,
          },
        },
      },
      module: {
        select: {
          id: true,
          titleEs: true,
          strengthKey: true,
        },
      },
    },
    take: limit,
    orderBy: { startedAt: "desc" },
  });

  // Transform to PeerLearner format
  const peers: PeerLearner[] = peerProgress.map((progress) => {
    const totalChallenges = progress.totalChallenges || 1;
    const completedChallenges = progress.completedChallenges;
    const progressPercent = Math.round((completedChallenges / totalChallenges) * 100);

    // Find complementary strengths (strengths the peer has that user doesn't)
    const peerStrengthNames = progress.user.userStrengths.map(
      (s) => s.strength.name
    );
    const complementary = peerStrengthNames
      .filter((name) => !userStrengthNames.includes(name))
      .slice(0, 3);

    return {
      id: progress.user.id,
      name: progress.user.name,
      image: progress.user.image,
      strengthKey: progress.module.strengthKey,
      strengthNameEs: progress.module.strengthKey ?? "General",
      moduleId: progress.module.id,
      moduleNameEs: progress.module.titleEs,
      progressPercent,
      complementaryStrengths: complementary,
    };
  });

  return peers;
}

/**
 * Get peer learners for a specific module with match scoring.
 *
 * Uses complementary strength analysis to find the best peer matches.
 *
 * @param moduleId - Module ID to find peers for
 * @param limit - Maximum number of peers to return (default: 5)
 * @returns Array of peer learners sorted by match score
 */
export async function getPeerMatchesForModule(
  moduleId: string,
  limit: number = 5
): Promise<PeerLearner[]> {
  const peers = await getPeerLearners(moduleId, limit * 2);

  // Sort by complementary strengths (more = better match)
  return peers
    .sort((a, b) => b.complementaryStrengths.length - a.complementaryStrengths.length)
    .slice(0, limit);
}

/**
 * Get count of peer learners for display purposes.
 *
 * @param moduleId - Optional module ID to filter by
 * @returns Number of available peer learners
 */
export async function getPeerLearnerCount(moduleId?: string): Promise<number> {
  const session = await getSession();

  if (!session?.user?.id) {
    return 0;
  }

  const userId = session.user.id;

  // Get modules to check
  let targetModuleIds: string[] = [];

  if (moduleId) {
    targetModuleIds = [ moduleId ];
  } else {
    const userProgress = await prisma.userModuleProgress.findMany({
      where: { userId, status: "in_progress" },
      select: { moduleId: true },
    });
    targetModuleIds = userProgress.map((p) => p.moduleId);
  }

  if (targetModuleIds.length === 0) {
    return 0;
  }

  return prisma.userModuleProgress.count({
    where: {
      moduleId: { in: targetModuleIds },
      userId: { not: userId },
      status: "in_progress",
    },
  });
}
