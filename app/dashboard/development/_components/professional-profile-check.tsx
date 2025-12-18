/**
 * ProfessionalProfileCheck Component
 *
 * Server component that checks if user has completed their
 * professional profile and conditionally shows onboarding modal.
 * Part of US5 - Professional Profile Onboarding.
 */

"use client";

import { type ReactNode, useState } from "react";
import { ProfileOnboardingModal } from "./profile-onboarding-modal";

interface ProfessionalProfileCheckProps {
	/**
	 * Whether user has a complete profile
	 */
	hasCompletedProfile: boolean;

	/**
	 * Whether this is a first-time user (no profile at all)
	 */
	isFirstTime: boolean;

	/**
	 * Children to render (the main content)
	 */
	children: ReactNode;
}

/**
 * Wrapper component that shows onboarding modal for first-time users
 *
 * @example
 * ```tsx
 * <ProfessionalProfileCheck
 *   hasCompletedProfile={profileResult.isComplete}
 *   isFirstTime={!profileResult.hasProfile}
 * >
 *   <ModuleList ... />
 * </ProfessionalProfileCheck>
 * ```
 */
export function ProfessionalProfileCheck({
	hasCompletedProfile,
	isFirstTime,
	children,
}: ProfessionalProfileCheckProps) {
	// Initialize modal open state based on props (first-time users see modal)
	const [showModal, setShowModal] = useState(
		isFirstTime && !hasCompletedProfile,
	);

	const handleComplete = () => {
		setShowModal(false);
		// Refresh to show updated content
		window.location.reload();
	};

	const handleSkip = () => {
		setShowModal(false);
	};

	return (
		<>
			{children}
			<ProfileOnboardingModal
				open={showModal}
				onOpenChange={setShowModal}
				onComplete={handleComplete}
				onSkip={handleSkip}
			/>
		</>
	);
}
