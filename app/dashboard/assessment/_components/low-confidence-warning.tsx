"use client";

/**
 * LowConfidenceWarning Component
 * Displays when any strength confidence score < 60%
 * Recommends retaking the assessment for more accurate results
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { RankedStrength } from "@/lib/types/assessment.types";

export interface LowConfidenceWarningProps {
  /**
   * Strengths with low confidence scores
   */
  lowConfidenceStrengths: RankedStrength[];
  /**
   * Overall confidence score
   */
  overallConfidence: number;
  /**
   * Callback when user wants to retake the assessment
   */
  onRetake?: () => void;
  /**
   * Whether the retake action is loading
   */
  isRetakeLoading?: boolean;
}

const LOW_CONFIDENCE_THRESHOLD = 60;

export default function LowConfidenceWarning({
  lowConfidenceStrengths,
  overallConfidence,
  onRetake,
  isRetakeLoading = false,
}: LowConfidenceWarningProps) {
  // Only show if there are low confidence strengths or overall confidence is low
  if (
    lowConfidenceStrengths.length === 0 &&
    overallConfidence >= LOW_CONFIDENCE_THRESHOLD
  ) {
    return null;
  }

  const hasLowOverall = overallConfidence < LOW_CONFIDENCE_THRESHOLD;
  const lowStrengthCount = lowConfidenceStrengths.length;

  return (
    <Alert
      variant="destructive"
      className="border-amber-500 bg-amber-50 dark:bg-amber-950"
    >
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-300">
        Some Results Need Confirmation
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <div className="text-amber-700 dark:text-amber-300">
          {hasLowOverall ? (
            <p>
              Your overall confidence score of{" "}
              <strong>{Math.round(overallConfidence)}%</strong> is below our
              recommended threshold. This may indicate:
            </p>
          ) : (
            <p>
              <strong>
                {lowStrengthCount}{" "}
                {lowStrengthCount === 1 ? "strength has" : "strengths have"}
              </strong>{" "}
              confidence scores below 60%. This may indicate:
            </p>
          )}
        </div>

        <ul className="ml-4 list-disc space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>Neutral responses throughout the assessment</li>
          <li>Close competition between multiple strengths</li>
          <li>Answers that varied significantly within similar questions</li>
        </ul>

        {lowStrengthCount > 0 && (
          <div className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Low confidence strengths:</strong>{" "}
            {lowConfidenceStrengths.map((s) => s.strengthName).join(", ")}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Consider retaking the assessment with more decisive answers for
            better accuracy.
          </p>
          {onRetake && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetake}
              disabled={isRetakeLoading}
              className="shrink-0 border-amber-500 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isRetakeLoading ? "animate-spin" : ""
                }`}
              />
              {isRetakeLoading ? "Starting..." : "Retake Assessment"}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Helper function to filter strengths with low confidence
 */
export function getLowConfidenceStrengths(
  strengths: RankedStrength[],
  threshold = LOW_CONFIDENCE_THRESHOLD
): RankedStrength[] {
  return strengths.filter((s) => s.confidenceScore < threshold);
}

export { LOW_CONFIDENCE_THRESHOLD };
