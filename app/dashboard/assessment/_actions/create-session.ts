"use server";

/**
 * Server Action: Create Assessment Session
 * Creates a new assessment session and loads Phase 1 questions
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type { AssessmentQuestion } from "@/lib/types/assessment.types";

export interface CreateSessionResult {
	success: boolean;
	sessionId?: string;
	questions?: AssessmentQuestion[];
	error?: string;
}

/**
 * Create a new assessment session for the current user
 * Marks any existing in-progress sessions as abandoned
 */
export async function createAssessmentSession(): Promise<CreateSessionResult> {
	try {
		// Get current user session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return {
				success: false,
				error: "User not authenticated",
			};
		}

		const userId = session.user.id;

		// Verify Prisma client is initialized
		if (!prisma) {
			console.error("[CreateSession] Prisma client is undefined");
			return {
				success: false,
				error: "Database connection not available",
			};
		}

		// Check for existing in-progress session
		const existingSession = await prisma.assessmentSession.findFirst({
			where: {
				userId,
				status: "IN_PROGRESS",
			},
		});

		if (existingSession) {
			// Mark as abandoned before creating new one
			await prisma.assessmentSession.update({
				where: { id: existingSession.id },
				data: { status: "ABANDONED" },
			});
		}

		// Create new session
		const newSession = await prisma.assessmentSession.create({
			data: {
				userId,
				status: "IN_PROGRESS",
				phase: 1,
				currentStep: 1,
				totalSteps: 60,
				startedAt: new Date(),
				lastActivityAt: new Date(),
			},
		});

		// Load Phase 1 questions
		const phase1Questions = await prisma.assessmentQuestion.findMany({
			where: { phase: 1 },
			orderBy: { order: "asc" },
			include: {
				domain: {
					select: {
						id: true,
						name: true,
					},
				},
				strength: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		// Transform to client-friendly format
		const questions: AssessmentQuestion[] = phase1Questions.map((q) => ({
			id: q.id,
			phase: q.phase as 1 | 2 | 3,
			order: q.order,
			text: q.text,
			type: q.type as "SCALE" | "CHOICE" | "RANKING",
			options: q.options ? JSON.parse(q.options) : undefined,
			scaleRange: q.scaleRange ? JSON.parse(q.scaleRange) : undefined,
			domainId: q.domainId,
			strengthId: q.strengthId ?? undefined,
			weight: q.weight,
		}));

		return {
			success: true,
			sessionId: newSession.id,
			questions,
		};
	} catch (error) {
		console.error("[CreateSession] Error creating session:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create session",
		};
	}
}
