/**
 * Save Professional Profile Action
 *
 * Server action to save/update user's professional profile.
 */

"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	SaveProfileInputSchema,
	type SaveProfileInput,
} from "../_schemas/professional-profile.schema";

interface SaveProfileResult {
	success: boolean;
	error?: string;
}

/**
 * Save user's professional profile
 * @param input Profile data to save
 * @returns Result with success status
 */
export async function saveProfessionalProfile(
	input: SaveProfileInput,
): Promise<SaveProfileResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			success: false,
			error: "No estás autenticado",
		};
	}

	// Validate input
	const validation = SaveProfileInputSchema.safeParse(input);
	if (!validation.success) {
		// Zod 4 uses .issues instead of .errors
		const firstIssue = validation.error.issues[0];
		return {
			success: false,
			error: firstIssue?.message ?? "Datos inválidos",
		};
	}

	const { skip, roleStatus, currentRole, industryContext, careerGoals } =
		validation.data;

	// Serialize careerGoals to JSON string for storage
	const careerGoalsJson = careerGoals ? JSON.stringify(careerGoals) : null;

	const now = new Date();

	await prisma.userProfessionalProfile.upsert({
		where: { userId: session.user.id },
		create: {
			userId: session.user.id,
			roleStatus,
			currentRole: currentRole ?? null,
			industryContext: industryContext ?? null,
			careerGoals: careerGoalsJson,
			completedAt: skip ? null : now,
			skippedAt: skip ? now : null,
		},
		update: {
			roleStatus,
			currentRole: currentRole ?? null,
			industryContext: industryContext ?? null,
			careerGoals: careerGoalsJson,
			completedAt: skip ? null : now,
			skippedAt: skip ? now : null,
		},
	});

	return { success: true };
}
