/**
 * Feedback Success Page
 *
 * Página de confirmación después de enviar feedback con celebración gamificada
 * Part of Feature 008: Feedback Gamification Integration
 */

import { Suspense } from "react";
import DashboardContainer from "@/app/dashboard/_components/dashboard-container";
import { FeedbackSuccessContent } from "../_components/feedback-success-content";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackSuccessPageProps {
	searchParams: Promise<{
		xp?: string;
		level?: string;
		badges?: string;
	}>;
}

/**
 * Static shell with Suspense for celebration content
 */
export default async function FeedbackSuccessPage({
	searchParams,
}: FeedbackSuccessPageProps) {
	return (
		<DashboardContainer
			title="¡Gracias!"
			description="Tu feedback ha sido registrado"
		>
			<Suspense fallback={<SuccessSkeleton />}>
				<FeedbackSuccessContent searchParams={searchParams} />
			</Suspense>
		</DashboardContainer>
	);
}

/**
 * Loading skeleton for success page
 */
function SuccessSkeleton() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
			<Skeleton className="h-32 w-32 rounded-full" />
			<div className="space-y-2 text-center">
				<Skeleton className="h-8 w-64 mx-auto" />
				<Skeleton className="h-4 w-96 mx-auto" />
			</div>
			<Skeleton className="h-32 w-80" />
		</div>
	);
}
