"use server";

import { prisma } from "@/lib/prisma.db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface CreateFromRetakeResult {
	success: boolean;
	error?: string;
	newSessionId?: string;
	archivedSessionId?: string;
}

/**
 * Server action to create a new assessment from a retake
 * Archives the old session and creates a fresh session
 */
export async function createNewFromRetake(
	oldSessionId: string,
): Promise<CreateFromRetakeResult> {
	try {
		// Get current user
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "User not authenticated" };
		}

		const userId = session.user.id;

		// Verify old session belongs to user
		const oldSession = await prisma.assessmentSession.findFirst({
			where: {
				id: oldSessionId,
				userId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!oldSession) {
			return { success: false, error: "Session not found" };
		}

		// Archive the old session (if not already archived/completed)
		if (
			oldSession.status === "IN_PROGRESS" ||
			oldSession.status === "COMPLETED"
		) {
			await prisma.assessmentSession.update({
				where: { id: oldSessionId },
				data: {
					status: "ABANDONED",
					completedAt: new Date(),
				},
			});
		}

		// Get Phase 1 questions for the new session
		const phase1Questions = await prisma.assessmentQuestion.findMany({
			where: { phase: 1 },
			orderBy: { order: "asc" },
			select: { id: true },
		});

		// Create new session
		const newSession = await prisma.assessmentSession.create({
			data: {
				userId,
				status: "IN_PROGRESS",
				phase: 1,
				currentStep: 0,
				totalSteps: phase1Questions.length,
				startedAt: new Date(),
				lastActivityAt: new Date(),
			},
		});

		return {
			success: true,
			newSessionId: newSession.id,
			archivedSessionId: oldSessionId,
		};
	} catch (error) {
		console.error("[CreateNewFromRetake] Error:", error);
		return { success: false, error: "Failed to create new assessment" };
	}
}
