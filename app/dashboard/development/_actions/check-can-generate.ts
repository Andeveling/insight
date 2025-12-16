/**
 * Check Can Generate Module Action
 *
 * Server action to verify if user can generate a new personalized module.
 * Returns false if user has any pending (in-progress) modules.
 */

"use server";

import { getSession } from "@/lib/auth";
import { canUserGenerateModule } from "@/lib/services/module-generator.service";

interface PendingModule {
  id: string;
  titleEs: string;
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
 * Check if user can generate a new personalized module
 * @returns Result with canGenerate status and pending module count
 */
export async function checkCanGenerateModule(): Promise<CheckCanGenerateResult> {
  const session = await getSession();

  if (!session?.user?.id) {
    return {
      success: false,
      canGenerate: false,
      error: "No estás autenticado",
    };
  }

  try {
    const result = await canUserGenerateModule(session.user.id);

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
