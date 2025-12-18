/**
 * Generate Module Button
 *
 * Client component button to trigger personalized module generation
 * with loading state and error handling.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { getDomainButtonClasses } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/lib/types";

import { generatePersonalizedModule } from "../_actions/generate-personalized";
import { PendingModulesTooltip } from "./pending-modules-tooltip";
import { TRANSITIONS, VARIANTS } from "../_utils/motion-tokens";

type GenerationState = "idle" | "generating" | "success" | "error";

interface PendingModule {
	id: string;
	titleEs: string;
	percentComplete: number;
}

interface GenerateModuleButtonProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof Button>,
		"onClick" | "children"
	> {
	/**
	 * The strength key to generate module for
	 */
	strengthKey: string;
	/**
	 * Display name of the strength
	 */
	strengthName: string;
	/**
	 * Domain key to determine button color
	 */
	domainKey: string;
	/**
	 * Whether generation is blocked (pending modules exist)
	 */
	isBlocked?: boolean;
	/**
	 * Message to show when blocked
	 */
	blockedMessage?: string;
	/**
	 * Pending modules to show in tooltip when blocked
	 */
	pendingModules?: PendingModule[];
	/**
	 * Callback when module is generated successfully
	 */
	onSuccess?: (moduleId: string) => void;
}

export function GenerateModuleButton({
	strengthKey,
	strengthName,
	domainKey,
	isBlocked = false,
	blockedMessage = "Completa tus módulos pendientes primero",
	pendingModules = [],
	onSuccess,
	...buttonProps
}: GenerateModuleButtonProps) {
	const [state, setState] = useState<GenerationState>("idle");

	// Get domain-specific button classes
	const domainClasses = getDomainButtonClasses(domainKey as DomainType);

	const handleGenerate = async () => {
		if (isBlocked || state === "generating") return;

		setState("generating");

		try {
			const result = await generatePersonalizedModule({ strengthKey });

			if (result.success && result.moduleId) {
				setState("success");
				toast.success("¡Módulo generado!", {
					description: `Nuevo módulo personalizado para ${strengthName}`,
				});
				onSuccess?.(result.moduleId);

				// Reset to idle after animation
				setTimeout(() => setState("idle"), 2000);
			} else {
				setState("error");
				toast.error("Error al generar", {
					description: result.error,
				});

				// Reset to idle after error display
				setTimeout(() => setState("idle"), 3000);
			}
		} catch (error) {
			console.error("[GenerateModuleButton] Error:", error);
			setState("error");
			toast.error("Error inesperado", {
				description: "Intenta de nuevo más tarde",
			});
			setTimeout(() => setState("idle"), 3000);
		}
	};

	const buttonContent = (
		<AnimatePresence mode="wait">
			{state === "idle" && (
				<motion.span
					key="idle"
					variants={VARIANTS.fadeInUp}
					initial="initial"
					animate="animate"
					exit="exit"
					className="flex items-center gap-2"
				>
					<Sparkles className="h-4 w-4" />
					{strengthName}
				</motion.span>
			)}

			{state === "generating" && (
				<motion.span
					key="generating"
					variants={VARIANTS.fadeInUp}
					initial="initial"
					animate="animate"
					exit="exit"
					className="flex items-center gap-2"
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					>
						<Loader2 className="h-4 w-4" />
					</motion.div>
					Generando...
				</motion.span>
			)}

			{state === "success" && (
				<motion.span
					key="success"
					variants={VARIANTS.fadeInUp}
					initial="initial"
					animate="animate"
					exit="exit"
					className="flex items-center gap-2"
				>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={TRANSITIONS.bounce}
					>
						<Check className="h-4 w-4" />
					</motion.div>
					¡Creado!
				</motion.span>
			)}

			{state === "error" && (
				<motion.span
					key="error"
					variants={VARIANTS.fadeInUp}
					initial="initial"
					animate="animate"
					exit="exit"
					className="flex items-center gap-2"
				>
					<AlertCircle className="h-4 w-4" />
					Error
				</motion.span>
			)}
		</AnimatePresence>
	);

	// Blocked state with PendingModulesTooltip
	if (isBlocked) {
		const blockedButton = (
			<Button
				variant="default"
				disabled
				className={cn(
					domainClasses,
					"opacity-40 cursor-not-allowed saturate-50",
				)}
				{...buttonProps}
			>
				<Sparkles className="h-4 w-4 mr-2" />
				{strengthName}
			</Button>
		);

		// Use PendingModulesTooltip if we have pending modules, otherwise simple disabled state
		if (pendingModules.length > 0) {
			return (
				<PendingModulesTooltip
					pendingModules={pendingModules}
					message={blockedMessage}
				>
					{blockedButton}
				</PendingModulesTooltip>
			);
		}

		return blockedButton;
	}

	return (
		<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
			<Button
				onClick={handleGenerate}
				disabled={state === "generating"}
				variant={state === "success" ? "default" : "default"}
				className={cn(
					state === "idle" && domainClasses,
					state === "success" && "bg-green-600 hover:bg-green-700",
					state === "error" &&
						"border-destructive text-destructive bg-destructive/10",
					state === "generating" && "opacity-80",
				)}
				{...buttonProps}
			>
				{buttonContent}
			</Button>
		</motion.div>
	);
}
