/**
 * Generate Personalized Module Action
 *
 * Server action to generate a personalized development module
 * using AI based on user's profile and selected strength.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import {
	canUserGenerateModule,
	createPersonalizedModule,
	generatePersonalizedModuleContent,
	getExistingModuleTitles,
	getUserTeamContext,
} from "@/lib/services/module-generator.service";
import { GenerateModuleInputSchema } from "../_schemas";

interface GenerateModuleResult {
	success: boolean;
	moduleId?: string;
	error?: string;
}

/**
 * Generate a personalized module for a specific strength
 * @param input Object containing strengthKey
 * @returns Result with moduleId or error
 */
export async function generatePersonalizedModule(input: {
	strengthKey: string;
}): Promise<GenerateModuleResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			success: false,
			error: "No estás autenticado",
		};
	}

	// Validate input
	const validation = GenerateModuleInputSchema.safeParse(input);
	if (!validation.success) {
		const firstIssue = validation.error.issues[0];
		return {
			success: false,
			error: firstIssue?.message ?? "Datos inválidos",
		};
	}

	const { strengthKey } = validation.data;

	// Check if user can generate for THIS specific strength (not globally)
	const canGenerateResult = await canUserGenerateModule(
		session.user.id,
		strengthKey,
	);
	if (!canGenerateResult.canGenerate) {
		return {
			success: false,
			error:
				canGenerateResult.message ||
				"No puedes generar un módulo para esta fortaleza ahora",
		};
	}

	// Verify strength is in user's Top 5
	const userStrength = await prisma.userStrength.findFirst({
		where: {
			userId: session.user.id,
			strength: { name: strengthKey },
		},
		include: { strength: true },
	});

	if (!userStrength) {
		return {
			success: false,
			error: "Esta fortaleza no está en tu Top 5",
		};
	}

	// Get user's professional profile
	const profile = await prisma.userProfessionalProfile.findUnique({
		where: { userId: session.user.id },
		select: {
			roleStatus: true,
			currentRole: true,
			industryContext: true,
			careerGoals: true,
		},
	});

	// Default profile if none exists
	const professionalProfile = profile
		? {
				roleStatus: profile.roleStatus,
				currentRole: profile.currentRole,
				industryContext: profile.industryContext,
				careerGoals: profile.careerGoals
					? (JSON.parse(profile.careerGoals) as string[])
					: null,
			}
		: {
				roleStatus: "neutral",
				currentRole: null,
				industryContext: null,
				careerGoals: null,
			};

	// Get existing module titles to avoid duplicates
	const existingModuleTitles = await getExistingModuleTitles(
		session.user.id,
		strengthKey,
	);

	// Get team context for realistic collaborative challenges
	const teamContext = await getUserTeamContext(session.user.id);

	try {
		// Generate content with AI
		const content = await generatePersonalizedModuleContent({
			userId: session.user.id,
			strengthKey,
			professionalProfile,
			teamContext,
			existingModuleTitles,
		});

		// Create module in database
		const { moduleId } = await createPersonalizedModule(
			session.user.id,
			strengthKey,
			content,
		);

		// Revalidate development page cache
		revalidatePath("/dashboard/development");

		return {
			success: true,
			moduleId,
		};
	} catch (error) {
		console.error("[generatePersonalizedModule] Error:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Error al generar el módulo. Intenta de nuevo.",
		};
	}
}
