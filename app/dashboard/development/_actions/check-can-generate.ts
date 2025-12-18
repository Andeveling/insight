/**
 * Check Can Generate Module Action
 *
 * Server action to verify if user can generate a new personalized module.
 * Now checks per-strength: users can have one pending module per strength.
 */

"use server";

import { getSession } from "@/lib/auth";
import { canUserGenerateModule } from "@/lib/services/module-generator.service";

interface PendingModule {
	id: string;
	titleEs: string;
	strengthKey?: string | null;
	percentComplete: number;
}

interface CheckCanGenerateResult {
	success: boolean;
	canGenerate: boolean;
	pendingModules?: PendingModule[];
	message?: string;
	error?: string;
}

/**
 * Check if user can generate a new personalized module for a specific strength
 * @param strengthKey Optional - if provided, checks only for that strength
 * @returns Result with canGenerate status and pending module info
 */
export async function checkCanGenerateModule(
	strengthKey?: string,
): Promise<CheckCanGenerateResult> {
	const session = await getSession();

	if (!session?.user?.id) {
		return {
			success: false,
			canGenerate: false,
			error: "No estás autenticado",
		};
	}

	try {
		const result = await canUserGenerateModule(session.user.id, strengthKey);

		return {
			success: true,
			canGenerate: result.canGenerate,
			pendingModules: result.pendingModules,
			message: result.message,
		};
	} catch (error) {
		console.error("[checkCanGenerateModule] Error:", error);
		return {
			success: false,
			canGenerate: false,
			error: "Error al verificar elegibilidad",
		};
	}
}
