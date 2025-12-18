"use server";

import { prisma } from "@/lib/prisma.db";
import { getSession } from "@/lib/auth";

/**
 * Check if a module is completed and update status if needed.
 *
 * @param moduleId - The module to check
 * @returns Object with completion status and stats
 */
export async function checkModuleCompletion(moduleId: string): Promise<{
	isCompleted: boolean;
	totalChallenges: number;
	completedChallenges: number;
	percentComplete: number;
	justCompleted: boolean;
}> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Get total challenges in module (no isActive filter - schema doesn't have it)
	const totalChallenges = await prisma.challenge.count({
		where: { moduleId },
	});

	// Get completed challenges by user (completed boolean not status string)
	const completedChallenges = await prisma.userChallengeProgress.count({
		where: {
			userId,
			completed: true,
			challenge: { moduleId },
		},
	});

	const percentComplete =
		totalChallenges > 0
			? Math.round((completedChallenges / totalChallenges) * 100)
			: 0;

	const isCompleted =
		completedChallenges >= totalChallenges && totalChallenges > 0;

	// Check if this is the first time completing
	const existingProgress = await prisma.userModuleProgress.findUnique({
		where: {
			userId_moduleId: { userId, moduleId },
		},
	});

	let justCompleted = false;

	if (isCompleted && existingProgress?.status !== "completed") {
		// Update module progress to completed
		await prisma.userModuleProgress.update({
			where: {
				userId_moduleId: { userId, moduleId },
			},
			data: {
				status: "completed",
				completedAt: new Date(),
			},
		});

		// Award module completion XP
		const devModule = await prisma.developmentModule.findUnique({
			where: { id: moduleId },
		});

		if (devModule) {
			await prisma.userGamification.update({
				where: { userId },
				data: {
					xpTotal: { increment: devModule.xpReward },
				},
			});
		}

		justCompleted = true;
	}

	return {
		isCompleted,
		totalChallenges,
		completedChallenges,
		percentComplete,
		justCompleted,
	};
}

/**
 * Get module completion stats for multiple modules
 */
export async function getModulesCompletionStats(moduleIds: string[]): Promise<
	Map<
		string,
		{
			totalChallenges: number;
			completedChallenges: number;
			percentComplete: number;
			status: "not_started" | "in_progress" | "completed";
		}
	>
> {
	const session = await getSession();

	if (!session?.user?.id) {
		throw new Error("No autorizado");
	}

	const userId = session.user.id;

	// Get challenge counts per module (no isActive filter)
	const challengeCounts = await prisma.challenge.groupBy({
		by: ["moduleId"],
		where: {
			moduleId: { in: moduleIds },
		},
		_count: { id: true },
	});

	// Get completed challenges with their challengeId
	const completedProgress = await prisma.userChallengeProgress.findMany({
		where: {
			userId,
			completed: true,
			challenge: {
				moduleId: { in: moduleIds },
			},
		},
		select: { challengeId: true },
	});

	// Get challenge to module mapping
	const challenges = await prisma.challenge.findMany({
		where: { moduleId: { in: moduleIds } },
		select: { id: true, moduleId: true },
	});

	const challengeToModule = new Map(challenges.map((c) => [c.id, c.moduleId]));

	// Build completed per module map
	const completedPerModule = new Map<string, number>();
	for (const progress of completedProgress) {
		const modId = challengeToModule.get(progress.challengeId);
		if (modId) {
			completedPerModule.set(modId, (completedPerModule.get(modId) || 0) + 1);
		}
	}

	// Get module progress records
	const moduleProgress = await prisma.userModuleProgress.findMany({
		where: {
			userId,
			moduleId: { in: moduleIds },
		},
	});

	const progressMap = new Map(
		moduleProgress.map((mp) => [mp.moduleId, mp.status]),
	);

	// Build result map
	const result = new Map<
		string,
		{
			totalChallenges: number;
			completedChallenges: number;
			percentComplete: number;
			status: "not_started" | "in_progress" | "completed";
		}
	>();

	for (const moduleId of moduleIds) {
		const total =
			challengeCounts.find((c) => c.moduleId === moduleId)?._count.id ?? 0;
		const completed = completedPerModule.get(moduleId) ?? 0;
		const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
		const status =
			(progressMap.get(moduleId) as
				| "not_started"
				| "in_progress"
				| "completed") || "not_started";

		result.set(moduleId, {
			totalChallenges: total,
			completedChallenges: completed,
			percentComplete: percent,
			status,
		});
	}

	return result;
}
