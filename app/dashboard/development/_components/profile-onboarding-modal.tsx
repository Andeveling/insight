/**
 * Profile Onboarding Modal
 *
 * Modal dialog that presents the professional profile form
 * to first-time users accessing the development module.
 * Uses motion/react for Gaming Fluent Design animations.
 */

"use client";

import { motion } from "motion/react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

import { ProfessionalProfileForm } from "./professional-profile-form";
import { VARIANTS, TRANSITIONS } from "../_utils/motion-tokens";

interface ProfileOnboardingModalProps {
	/**
	 * Whether the modal is open
	 */
	open: boolean;

	/**
	 * Callback when open state changes
	 */
	onOpenChange: (open: boolean) => void;

	/**
	 * Callback when profile is completed
	 */
	onComplete: () => void;

	/**
	 * Callback when user skips the profile
	 */
	onSkip: () => void;
}

/**
 * Modal for first-time user onboarding
 *
 * @example
 * ```tsx
 * <ProfileOnboardingModal
 *   open={showModal}
 *   onOpenChange={setShowModal}
 *   onComplete={handleComplete}
 *   onSkip={handleSkip}
 * />
 * ```
 */
export function ProfileOnboardingModal({
	open,
	onOpenChange,
	onComplete,
	onSkip,
}: ProfileOnboardingModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="max-w-lg overflow-hidden p-0"
			>
				<motion.div
					variants={VARIANTS.fadeInUp}
					initial="initial"
					animate="animate"
					transition={TRANSITIONS.spring}
					className="p-6"
				>
					<DialogHeader className="mb-4">
						<DialogTitle className="flex items-center gap-2 text-xl">
							<span className="text-2xl">🎯</span>
							Personaliza tu experiencia
						</DialogTitle>
						<DialogDescription>
							Completa tu perfil profesional para recibir módulos de desarrollo
							personalizados según tus objetivos y contexto laboral.
						</DialogDescription>
					</DialogHeader>

					<ProfessionalProfileForm showSkip onSuccess={onComplete} />

					<div className="mt-4 text-center">
						<button
							type="button"
							onClick={onSkip}
							className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline transition-colors"
						>
							Omitir por ahora
						</button>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
