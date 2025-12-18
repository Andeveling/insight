/**
 * useModuleGeneration Hook
 *
 * Custom hook for managing personalized module generation state
 * including loading, error handling, and UI updates.
 */

"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	generatePersonalizedModule,
	checkCanGenerateModule,
} from "../_actions";

export type GenerationStatus =
	| "idle"
	| "checking"
	| "generating"
	| "success"
	| "error"
	| "blocked";

interface UseModuleGenerationOptions {
	/**
	 * Callback when generation succeeds
	 */
	onSuccess?: (moduleId: string) => void;
	/**
	 * Callback when generation fails
	 */
	onError?: (error: string) => void;
	/**
	 * Whether to auto-refresh the page on success
	 */
	autoRefresh?: boolean;
}

interface UseModuleGenerationReturn {
	/**
	 * Current generation status
	 */
	status: GenerationStatus;
	/**
	 * Whether generation is in progress
	 */
	isGenerating: boolean;
	/**
	 * Whether user can generate (no pending modules)
	 */
	canGenerate: boolean | null;
	/**
	 * Error message if generation failed
	 */
	error: string | null;
	/**
	 * Check if user can generate a new module for a specific strength
	 */
	checkEligibility: (strengthKey?: string) => Promise<boolean>;
	/**
	 * Generate a personalized module for a strength
	 */
	generate: (strengthKey: string, strengthName: string) => Promise<void>;
	/**
	 * Reset state to idle
	 */
	reset: () => void;
}

export function useModuleGeneration(
	options: UseModuleGenerationOptions = {},
): UseModuleGenerationReturn {
	const { onSuccess, onError, autoRefresh = true } = options;

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [status, setStatus] = useState<GenerationStatus>("idle");
	const [canGenerate, setCanGenerate] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Check if user can generate a new module for a specific strength
	 */
	const checkEligibility = useCallback(
		async (strengthKey?: string): Promise<boolean> => {
			setStatus("checking");
			setError(null);

			try {
				const result = await checkCanGenerateModule(strengthKey);

				if (!result.success) {
					setStatus("blocked");
					setCanGenerate(false);
					return false;
				}

				setCanGenerate(result.canGenerate);
				setStatus(result.canGenerate ? "idle" : "blocked");
				return result.canGenerate;
			} catch (err) {
				console.error("[useModuleGeneration] Check error:", err);
				setStatus("error");
				setError("Error al verificar elegibilidad");
				return false;
			}
		},
		[],
	);

	/**
	 * Generate a personalized module
	 */
	const generate = useCallback(
		async (strengthKey: string, strengthName: string): Promise<void> => {
			setStatus("generating");
			setError(null);

			try {
				const result = await generatePersonalizedModule({ strengthKey });

				if (result.success && result.moduleId) {
					setStatus("success");
					toast.success("¡Módulo generado!", {
						description: `Nuevo módulo personalizado para ${strengthName}`,
					});

					onSuccess?.(result.moduleId);

					if (autoRefresh) {
						startTransition(() => {
							router.refresh();
						});
					}
				} else {
					setStatus("error");
					setError(result.error || "Error desconocido");
					toast.error("Error al generar módulo", {
						description: result.error,
					});
					onError?.(result.error || "Error desconocido");
				}
			} catch (err) {
				console.error("[useModuleGeneration] Generate error:", err);
				const errorMsg =
					err instanceof Error ? err.message : "Error inesperado";
				setStatus("error");
				setError(errorMsg);
				toast.error("Error inesperado", {
					description: "Intenta de nuevo más tarde",
				});
				onError?.(errorMsg);
			}
		},
		[onSuccess, onError, autoRefresh, router],
	);

	/**
	 * Reset state to idle
	 */
	const reset = useCallback(() => {
		setStatus("idle");
		setError(null);
	}, []);

	return {
		status,
		isGenerating: status === "generating" || isPending,
		canGenerate,
		error,
		checkEligibility,
		generate,
		reset,
	};
}
