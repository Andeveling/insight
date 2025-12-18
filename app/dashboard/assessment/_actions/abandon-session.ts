"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

interface AbandonSessionResult {
	success: boolean;
	error?: string;
	abandonedSessionId?: string;
}

/**
 * Server action to abandon/archive an assessment session
 * Used for sessions that are too old (7+ days) or when user wants to start fresh
 */
export async function abandonSessionAction(
	sessionId: string,
): Promise<AbandonSessionResult> {
	try {
		// Get current user
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "User not authenticated" };
		}

		const userId = session.user.id;

		// Verify session belongs to user
		const assessmentSession = await prisma.assessmentSession.findFirst({
			where: {
				id: sessionId,
				userId,
			},
			select: {
				id: true,
				status: true,
				lastActivityAt: true,
			},
		});

		if (!assessmentSession) {
			return { success: false, error: "Session not found" };
		}

		// Update session status to ABANDONED
		await prisma.assessmentSession.update({
			where: { id: sessionId },
			data: {
				status: "ABANDONED",
				completedAt: new Date(),
			},
		});

		return {
			success: true,
			abandonedSessionId: sessionId,
		};
	} catch (error) {
		console.error("[AbandonSession] Error:", error);
		return { success: false, error: "Failed to abandon session" };
	}
}

/**
 * Server action to check and handle stale sessions
 * Returns stale sessions for the user that should be prompted for restart
 */
export async function checkStaleSessions(): Promise<{
	success: boolean;
	staleSessions: Array<{
		id: string;
		startedAt: Date;
		lastActivityAt: Date;
		currentPhase: number;
		answeredCount: number;
	}>;
}> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, staleSessions: [] };
		}

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const staleSessions = await prisma.assessmentSession.findMany({
			where: {
				userId: session.user.id,
				status: "IN_PROGRESS",
				lastActivityAt: {
					lt: sevenDaysAgo,
				},
			},
			select: {
				id: true,
				startedAt: true,
				lastActivityAt: true,
				phase: true,
				_count: {
					select: {
						answers: true,
					},
				},
			},
		});

		return {
			success: true,
			staleSessions: staleSessions.map((s) => ({
				id: s.id,
				startedAt: s.startedAt,
				lastActivityAt: s.lastActivityAt,
				currentPhase: s.phase,
				answeredCount: s._count.answers,
			})),
		};
	} catch (error) {
		console.error("[CheckStaleSessions] Error:", error);
		return { success: false, staleSessions: [] };
	}
}
