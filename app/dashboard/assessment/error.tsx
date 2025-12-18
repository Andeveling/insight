"use client";

/**
 * Assessment Error Boundary
 * Graceful error handling for assessment pages
 */

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function AssessmentError({ error, reset }: ErrorProps) {
	useEffect(() => {
		// Log error to console in development
		console.error("[Assessment Error]:", error);
	}, [error]);

	const isSessionError = error.message?.toLowerCase().includes("session");
	const isNetworkError =
		error.message?.toLowerCase().includes("network") ||
		error.message?.toLowerCase().includes("fetch");

	return (
		<div className="flex min-h-[60vh] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-8 w-8 text-destructive" />
					</div>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>
						{isNetworkError
							? "Unable to connect to the server. Please check your internet connection."
							: isSessionError
								? "There was a problem with your assessment session."
								: "An unexpected error occurred during the assessment."}
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
							onClick={() => (window.location.href = "/dashboard")}
						>
							<Home className="h-4 w-4" />
							Return to Dashboard
						</Button>
					</div>

					{/* Help text */}
					<p className="text-center text-xs text-muted-foreground">
						If this problem persists, please contact support.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
