import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Spinner } from "@/components/ui/spinner";
import ResultsContent from "./results-content";
import { getSessionResults } from "../../_actions";

interface ResultsPageProps {
	params: Promise<{ sessionId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
	const { sessionId } = await params;

	// Verify authentication
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		notFound();
	}

	// Get results
	const result = await getSessionResults(sessionId);

	if (!result.success || !result.results) {
		notFound();
	}

	return (
		<Suspense
			fallback={
				<div className="flex min-h-[60vh] items-center justify-center">
					<Spinner className="h-8 w-8" />
				</div>
			}
		>
			<ResultsContent sessionId={sessionId} results={result.results} />
		</Suspense>
	);
}
