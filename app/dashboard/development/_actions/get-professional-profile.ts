/**
 * Get Professional Profile Action
 *
 * Server action to fetch user's professional profile
 * for personalized module generation.
 */

"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import type {
	RoleStatus,
	CareerGoal,
} from "../_schemas/professional-profile.schema";

/**
 * Profile output type for API responses
 */
interface ProfileData {
	roleStatus: RoleStatus;
	currentRole?: string;
	industryContext?: string;
	careerGoals?: CareerGoal[];
	completedAt?: Date;
	skippedAt?: Date;
}

interface ProfileOutput {
	hasProfile: boolean;
	isComplete: boolean;
	profile?: ProfileData;
}

/**
 * Get user's professional profile
 * @returns ProfileOutput with profile data and status
 */
export async function getProfessionalProfile(): Promise<ProfileOutput> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			hasProfile: false,
			isComplete: false,
			profile: undefined,
		};
	}

	const profile = await prisma.userProfessionalProfile.findUnique({
		where: { userId: session.user.id },
		select: {
			roleStatus: true,
			currentRole: true,
			industryContext: true,
			careerGoals: true,
			completedAt: true,
			skippedAt: true,
		},
	});

	if (!profile) {
		return {
			hasProfile: false,
			isComplete: false,
			profile: undefined,
		};
	}

	// Parse careerGoals from JSON string to array
	const careerGoals = profile.careerGoals
		? (JSON.parse(profile.careerGoals) as CareerGoal[])
		: undefined;

	const isComplete = profile.completedAt !== null || profile.skippedAt !== null;

	return {
		hasProfile: true,
		isComplete,
		profile: {
			roleStatus: profile.roleStatus as RoleStatus,
			currentRole: profile.currentRole ?? undefined,
			industryContext: profile.industryContext ?? undefined,
			careerGoals,
			completedAt: profile.completedAt ?? undefined,
			skippedAt: profile.skippedAt ?? undefined,
		},
	};
}
