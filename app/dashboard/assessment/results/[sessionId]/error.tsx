"use client";

/**
 * Results Error Boundary
 * Graceful error handling for results pages
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ResultsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Results Error]:", error);
  }, [error]);

  const isNotFoundError =
    error.message?.toLowerCase().includes("not found") ||
    error.message?.toLowerCase().includes("no session");
  const isCalculationError = error.message?.toLowerCase().includes("calculat");

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>
            {isNotFoundError ? "Results Not Found" : "Error Loading Results"}
          </CardTitle>
          <CardDescription>
            {isNotFoundError
              ? "The assessment session you are looking for does not exist or has been archived."
              : isCalculationError
              ? "There was a problem calculating your strength results."
              : "An unexpected error occurred while loading your results."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error details (in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-lg bg-muted p-3 text-xs">
              <p className="font-mono text-muted-foreground">{error.message}</p>
              {error.digest && (
                <p className="mt-1 text-muted-foreground/70">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => (window.location.href = "/dashboard/assessment")}
            >
              <RotateCcw className="h-4 w-4" />
              Start New Assessment
            </Button>
          </div>

          {/* Help text */}
          <p className="text-center text-xs text-muted-foreground">
            If this problem persists, your assessment may need to be retaken.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
