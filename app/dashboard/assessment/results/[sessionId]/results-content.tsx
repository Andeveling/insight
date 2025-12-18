"use client";

/**
 * Results Content Component
 * Client component for interactive results display
 */

import { Home, RefreshCw, Save, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	BadgeUnlockModal,
	LevelUpNotification,
} from "@/components/gamification";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type {
	AssessmentResults,
	RankedStrength,
} from "@/lib/types/assessment.types";
import type { UnlockedBadge } from "@/lib/types/gamification.types";
import {
	createNewFromRetake,
	getAssessmentXpStatus,
	saveResultsToProfile,
} from "../../_actions";
import {
	getLowConfidenceStrengths,
	getStrengthDescription,
	LowConfidenceWarning,
	ResultsSummary,
	StrengthConfidenceCard,
} from "../../_components";

interface ResultsContentProps {
	sessionId: string;
	results: AssessmentResults;
	/** Total XP earned from this assessment (passed from parent) */
	totalXpEarned?: number;
	/** Whether user leveled up during this assessment */
	leveledUp?: boolean;
	/** New level if leveled up */
	newLevel?: number;
	/** Previous level before assessment */
	previousLevel?: number;
	/** Badges unlocked during this assessment */
	unlockedBadges?: UnlockedBadge[];
}

interface ResultsContentProps {
	sessionId: string;
	results: AssessmentResults;
}

export default function ResultsContent({
	sessionId,
	results,
	totalXpEarned,
	leveledUp = false,
	newLevel,
	previousLevel,
	unlockedBadges = [],
}: ResultsContentProps) {
	const router = useRouter();
	const [selectedStrength, setSelectedStrength] =
		useState<RankedStrength | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isRetaking, setIsRetaking] = useState(false);
	const [showRetakeDialog, setShowRetakeDialog] = useState(false);
	const [hasSaved, setHasSaved] = useState(false);

	// Gamification modals
	const [showLevelUp, setShowLevelUp] = useState(leveledUp);
	const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
	const [showBadgeModal, setShowBadgeModal] = useState(
		unlockedBadges.length > 0,
	);

	// Get level name based on level number
	const getLevelName = (level: number): string => {
		const levelNames: Record<number, string> = {
			1: "Principiante",
			2: "Aprendiz",
			3: "Explorador",
			4: "Desarrollador",
			5: "Especialista",
			6: "Experto",
			7: "Maestro",
			8: "Visionario",
			9: "Líder",
			10: "Leyenda",
		};
		return levelNames[level] ?? `Nivel ${level}`;
	};

	// Handle badge modal close - show next badge if available
	const handleBadgeModalClose = (open: boolean) => {
		if (!open) {
			if (currentBadgeIndex < unlockedBadges.length - 1) {
				setCurrentBadgeIndex(currentBadgeIndex + 1);
			} else {
				setShowBadgeModal(false);
			}
		}
	};

	// Get low confidence strengths
	const lowConfidenceStrengths = getLowConfidenceStrengths(
		results.rankedStrengths,
	);

	// Handle save to profile
	const handleSaveToProfile = async () => {
		setIsSaving(true);
		try {
			const result = await saveResultsToProfile(sessionId);

			if (result.success) {
				setHasSaved(true);
				toast.success("Strengths saved to your profile!");
			} else {
				toast.error(result.error ?? "Failed to save to profile");
			}
		} catch (error) {
			console.error("Save error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsSaving(false);
		}
	};

	// Handle retake assessment with proper archiving
	const handleRetake = async () => {
		setIsRetaking(true);
		try {
			const result = await createNewFromRetake(sessionId);

			if (result.success && result.newSessionId) {
				toast.success("Starting new assessment...");
				router.push("/dashboard/assessment");
			} else {
				toast.error(result.error ?? "Failed to start new assessment");
			}
		} catch (error) {
			console.error("Retake error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsRetaking(false);
			setShowRetakeDialog(false);
		}
	};

	// Handle go to dashboard
	const handleGoToDashboard = () => {
		router.push("/dashboard");
	};

	// Handle strength click for details
	const handleStrengthClick = (strength: RankedStrength) => {
		setSelectedStrength(strength);
	};

	// Enrich strength with description data
	const enrichStrength = (strength: RankedStrength): RankedStrength => {
		const description = getStrengthDescription(strength.strengthId);
		if (description) {
			return {
				...strength,
				description: description.description,
				developmentTips: description.developmentTips,
			};
		}
		return strength;
	};

	const enrichedStrengths = results.rankedStrengths
		.slice(0, 5)
		.map(enrichStrength);

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
			{/* XP Earned Banner */}
			{totalXpEarned && totalXpEarned > 0 && (
				<div className="flex items-center justify-center gap-4 rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-6 py-4 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-orange-950/30">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
						<Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							¡XP ganado en este assessment!
						</span>
						<span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
							+{totalXpEarned} XP
						</span>
					</div>
					{unlockedBadges.length > 0 && (
						<div className="ml-4 flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
							<span>🏅</span>
							<span>
								{unlockedBadges.length} badge
								{unlockedBadges.length > 1 ? "s" : ""} desbloqueado
								{unlockedBadges.length > 1 ? "s" : ""}
							</span>
						</div>
					)}
				</div>
			)}

			{/* Results summary */}
			<ResultsSummary results={results} onStrengthClick={handleStrengthClick} />

			{/* Low confidence warning */}
			<LowConfidenceWarning
				lowConfidenceStrengths={lowConfidenceStrengths}
				overallConfidence={results.overallConfidence}
				onRetake={() => setShowRetakeDialog(true)}
				isRetakeLoading={isRetaking}
			/>

			{/* Detailed strength cards */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Strength Details</h2>
				{enrichedStrengths.map((strength) => (
					<StrengthConfidenceCard
						key={strength.strengthId}
						strength={strength}
						showRank={true}
					/>
				))}
			</div>

			{/* Action buttons */}
			<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
				<Button
					size="lg"
					onClick={handleSaveToProfile}
					disabled={isSaving || hasSaved}
					className="gap-2"
				>
					<Save className="h-4 w-4" />
					{hasSaved ? "Saved!" : isSaving ? "Saving..." : "Save to Profile"}
				</Button>

				<Button
					variant="outline"
					size="lg"
					onClick={() => setShowRetakeDialog(true)}
					disabled={isRetaking}
					className="gap-2"
				>
					<RefreshCw
						className={`h-4 w-4 ${isRetaking ? "animate-spin" : ""}`}
					/>
					{isRetaking ? "Starting..." : "Retake Assessment"}
				</Button>

				<Button
					variant="ghost"
					size="lg"
					onClick={handleGoToDashboard}
					className="gap-2"
				>
					<Home className="h-4 w-4" />
					Go to Dashboard
				</Button>
			</div>

			{/* Retake confirmation dialog */}
			<Dialog open={showRetakeDialog} onOpenChange={setShowRetakeDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Retake Assessment?</DialogTitle>
						<DialogDescription>
							Starting a new assessment will archive your current results. You
							can still view them in your history, but your profile will be
							updated with the new results.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => setShowRetakeDialog(false)}
							disabled={isRetaking}
						>
							Cancel
						</Button>
						<Button onClick={handleRetake} disabled={isRetaking}>
							{isRetaking ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Starting...
								</>
							) : (
								"Yes, Start New Assessment"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Strength detail modal */}
			{selectedStrength && (
				<Dialog
					open={!!selectedStrength}
					onOpenChange={() => setSelectedStrength(null)}
				>
					<DialogContent className="max-w-lg">
						<DialogHeader>
							<DialogTitle>{selectedStrength.strengthName}</DialogTitle>
							<DialogDescription>
								Domain: {selectedStrength.domainName}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<StrengthConfidenceCard
								strength={enrichStrength(selectedStrength)}
								showRank={false}
								defaultExpanded={true}
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Level Up Notification */}
			{leveledUp && newLevel && previousLevel && (
				<LevelUpNotification
					previousLevel={previousLevel}
					newLevel={newLevel}
					levelName={getLevelName(newLevel)}
					open={showLevelUp}
					onOpenChange={setShowLevelUp}
				/>
			)}

			{/* Badge Unlock Modals */}
			{unlockedBadges.length > 0 && unlockedBadges[currentBadgeIndex] && (
				<BadgeUnlockModal
					badge={{
						name: unlockedBadges[currentBadgeIndex].badge.name,
						description: unlockedBadges[currentBadgeIndex].badge.description,
						tier: unlockedBadges[currentBadgeIndex].badge.tier,
						xpReward: unlockedBadges[currentBadgeIndex].badge.xpReward,
						iconUrl: unlockedBadges[currentBadgeIndex].badge.iconUrl,
					}}
					open={showBadgeModal}
					onOpenChange={handleBadgeModalClose}
				/>
			)}
		</div>
	);
}
