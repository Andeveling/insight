"use client";

/**
 * Session-specific Assessment Page
 * Redirects to main assessment page and resumes the session
 * Handles direct URL access with sessionId
 */

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function SessionPage() {
	const router = useRouter();
	const params = useParams();
	const sessionId = params.sessionId as string;

	useEffect(() => {
		// Store sessionId in sessionStorage for the main page to pick up
		if (sessionId) {
			sessionStorage.setItem("assessment_resume_session", sessionId);
		}
		// Redirect to main assessment page which handles resume logic
		router.replace("/dashboard/assessment");
	}, [sessionId, router]);

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
			<Spinner className="h-8 w-8" />
			<p className="text-muted-foreground">Reanudando tu evaluación...</p>
		</div>
	);
}
