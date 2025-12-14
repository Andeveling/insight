"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";
import { StartModuleInputSchema } from "../_schemas";

/**
 * Start a development module for the current user.
 *
 * Creates a UserModuleProgress record with status "in_progress".
 *
 * @param input - The module ID to start
 * @returns Success status and module info
 */
export async function startModule(input: { moduleId: string }): Promise<{
  success: boolean;
  moduleId: string;
  message: string;
}> {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }

  const userId = session.user.id;

  // Validate input
  const validatedInput = StartModuleInputSchema.parse(input);
  const { moduleId } = validatedInput;

  // Check if module exists
  const developmentModule = await prisma.developmentModule.findUnique({
    where: { id: moduleId, isActive: true },
    include: {
      challenges: {
        select: { id: true },
      },
    },
  });

  if (!developmentModule) {
    throw new Error("Módulo no encontrado");
  }

  const totalChallenges = developmentModule.challenges.length;

  // Check if user already started this module
  const existingProgress = await prisma.userModuleProgress.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId,
      },
    },
  });

  if (existingProgress) {
    // Already started, return success
    return {
      success: true,
      moduleId,
      message: "Ya has iniciado este módulo",
    };
  }

  // Create progress record
  await prisma.userModuleProgress.create({
    data: {
      userId,
      moduleId,
      status: "in_progress",
      totalChallenges,
      startedAt: new Date(),
    },
  });

  // Ensure user has gamification record
  await prisma.userGamification.upsert({
    where: { userId },
    update: {
      lastActivityDate: new Date(),
    },
    create: {
      userId,
      xpTotal: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
    },
  });

  return {
    success: true,
    moduleId,
    message: `Has comenzado el módulo "${developmentModule.titleEs}"`,
  };
}
