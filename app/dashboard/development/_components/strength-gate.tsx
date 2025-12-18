import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserStrengthsForDevelopment } from "../_actions/get-user-strengths";
import { StrengthsRequiredMessage } from "./strengths-required-message";

interface StrengthGateProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

/**
 * Loading state for StrengthGate
 */
function StrengthGateLoading() {
	return (
		<div className="space-y-4 py-8">
			<Skeleton className="h-8 w-64 mx-auto" />
			<Skeleton className="h-4 w-96 mx-auto" />
			<Skeleton className="h-10 w-40 mx-auto" />
		</div>
	);
}

/**
 * Inner component that checks strengths
 */
async function StrengthGateContent({ children, fallback }: StrengthGateProps) {
	const { hasTop5 } = await getUserStrengthsForDevelopment();

	if (!hasTop5) {
		return fallback ?? <StrengthsRequiredMessage />;
	}

	return <>{children}</>;
}

/**
 * StrengthGate Server Component
 *
 * Gates access to development modules based on user's Top 5 strengths.
 * If user doesn't have 5 strengths defined, shows a message prompting
 * them to complete the assessment.
 */
export function StrengthGate({ children, fallback }: StrengthGateProps) {
	return (
		<Suspense fallback={<StrengthGateLoading />}>
			<StrengthGateContent fallback={fallback}>{children}</StrengthGateContent>
		</Suspense>
	);
}
