/**
 * Feedback Request Page
 *
 * Page for creating new peer feedback requests
 * Shows available teammates and allows selection
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardContainer from "../../_components/dashboard-container";
import { FeedbackRequestForm } from "../_components/feedback-request-form";
import { getAvailableTeammates } from "../_services/feedback-request.service";
import { getSession } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Static shell with Suspense for dynamic content
 */
export default function FeedbackRequestPage() {
	return (
		<DashboardContainer
			title="Solicitar Feedback"
			description="Selecciona 3-5 compañeros para recibir feedback sobre tus fortalezas"
		>
			<Suspense fallback={<FeedbackRequestSkeleton />}>
				<FeedbackRequestContent />
			</Suspense>
		</DashboardContainer>
	);
}

/**
 * Loading skeleton
 */
function FeedbackRequestSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-10 w-full" />
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Skeleton key={i} className="h-20 w-full" />
				))}
			</div>
			<Skeleton className="h-10 w-32" />
		</div>
	);
}

/**
 * Dynamic content that accesses session and database
 */
async function FeedbackRequestContent() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const teammates = await getAvailableTeammates(session.user.id);

	if (teammates.length === 0) {
		return (
			<Alert>
				<MessageSquarePlus className="h-4 w-4" />
				<AlertTitle>Sin compañeros disponibles</AlertTitle>
				<AlertDescription>
					No tienes compañeros de equipo para solicitar feedback. Asegúrate de
					estar en un equipo con otros miembros.
				</AlertDescription>
			</Alert>
		);
	}

	return <FeedbackRequestForm teammates={teammates} />;
}
