"use server";

/**
 * Server Action: Save Results to Profile
 * Persists assessment results to user's profile with top 5 strengths
 * Uses UserStrength junction table for strength associations
 */

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type { AssessmentResults } from "@/lib/types/assessment.types";

export interface SaveResultsToProfileResult {
	success: boolean;
	strengthCount?: number;
	error?: string;
}

/**
 * Save assessment results to user's strengths
 */
export async function saveResultsToProfile(
	sessionId: string,
): Promise<SaveResultsToProfileResult> {
	try {
		// Verify user authentication
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "User not authenticated" };
		}

		const userId = session.user.id;

		// Get assessment session with results
		const assessmentSession = await prisma.assessmentSession.findUnique({
			where: { id: sessionId },
			select: {
				userId: true,
				results: true,
				status: true,
			},
		});

		if (!assessmentSession) {
			return { success: false, error: "Session not found" };
		}

		if (assessmentSession.userId !== userId) {
			return { success: false, error: "Access denied" };
		}

		if (!assessmentSession.results) {
			return { success: false, error: "No results to save" };
		}

		const results = JSON.parse(assessmentSession.results) as AssessmentResults;

		// Get top 5 strengths with their IDs and ranks
		const top5Strengths = results.rankedStrengths.slice(0, 5);

		if (top5Strengths.length < 5) {
			return {
				success: false,
				error: "Insufficient strength data for profile",
			};
		}

		// Delete existing user strengths and recreate with new results
		await prisma.userStrength.deleteMany({
			where: { userId },
		});

		// Create new user strengths with ranks
		const strengthsToCreate = top5Strengths.map((strength, index) => ({
			userId,
			strengthId: strength.strengthId,
			rank: index + 1, // 1-5
		}));

		// Create each strength individually (Turso doesn't support createMany well)
		for (const strengthData of strengthsToCreate) {
			await prisma.userStrength.create({
				data: strengthData,
			});
		}

		// Ensure user profile exists
		const existingProfile = await prisma.userProfile.findUnique({
			where: { userId },
		});

		if (!existingProfile) {
			await prisma.userProfile.create({
				data: { userId },
			});
		}

		// Update session last activity
		await prisma.assessmentSession.update({
			where: { id: sessionId },
			data: {
				lastActivityAt: new Date(),
			},
		});

		return { success: true, strengthCount: strengthsToCreate.length };
	} catch (error) {
		console.error("[SaveResultsToProfile] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to save results to profile",
		};
	}
}

/**
 * Check if user already has strengths configured
 */
export async function hasExistingProfile(): Promise<{
	hasProfile: boolean;
	hasStrengths: boolean;
}> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { hasProfile: false, hasStrengths: false };
		}

		const [profile, strengthCount] = await Promise.all([
			prisma.userProfile.findUnique({
				where: { userId: session.user.id },
				select: { id: true },
			}),
			prisma.userStrength.count({
				where: { userId: session.user.id },
			}),
		]);

		return {
			hasProfile: !!profile,
			hasStrengths: strengthCount >= 5,
		};
	} catch (error) {
		console.error("[HasExistingProfile] Error:", error);
		return { hasProfile: false, hasStrengths: false };
	}
}
