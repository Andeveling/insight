"use client";

/**
 * Results Content Component
 * Client component for interactive results display
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, RefreshCw, Home } from "lucide-react";
import {
  ResultsSummary,
  StrengthConfidenceCard,
  LowConfidenceWarning,
  getLowConfidenceStrengths,
  getStrengthDescription,
} from "../../_components";
import { saveResultsToProfile, createNewFromRetake } from "../../_actions";
import type {
  AssessmentResults,
  RankedStrength,
} from "@/lib/types/assessment.types";

interface ResultsContentProps {
  sessionId: string;
  results: AssessmentResults;
}

export default function ResultsContent({
  sessionId,
  results,
}: ResultsContentProps) {
  const router = useRouter();
  const [selectedStrength, setSelectedStrength] =
    useState<RankedStrength | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);
  const [showRetakeDialog, setShowRetakeDialog] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Get low confidence strengths
  const lowConfidenceStrengths = getLowConfidenceStrengths(
    results.rankedStrengths
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
    </div>
  );
}
