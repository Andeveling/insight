/**
 * Feedback Response Page
 *
 * Page for completing peer feedback questionnaire
 */

import { AlertCircle } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardContainer from "@/app/dashboard/_components/dashboard-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { FeedbackQuestionnaire } from "../../_components/feedback-questionnaire";
import XpIncentiveBanner from "../../_components/xp-incentive-banner";
import { getFeedbackRequestById } from "../../_services/feedback-request.service";
import {
	canRespondToRequest,
	getFeedbackQuestions,
	getPartialProgress,
} from "../../_services/feedback-response.service";

interface FeedbackRespondPageProps {
	params: Promise<{
		requestId: string;
	}>;
}

/**
 * Static shell with Suspense for dynamic content
 */
export default async function FeedbackRespondPage({
	params,
}: FeedbackRespondPageProps) {
	const { requestId } = await params;

	return (
		<Suspense fallback={<FeedbackRespondSkeleton />}>
			<FeedbackRespondContent requestId={requestId} />
		</Suspense>
	);
}

/**
 * Loading skeleton
 */
function FeedbackRespondSkeleton() {
	return (
		<DashboardContainer
			title="Dar Feedback"
			description="Cargando cuestionario..."
		>
			<div className="space-y-6">
				<Skeleton className="h-8 w-64" />
				<div className="space-y-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-5 w-full max-w-md" />
							<Skeleton className="h-12 w-full" />
						</div>
					))}
				</div>
				<Skeleton className="h-10 w-32" />
			</div>
		</DashboardContainer>
	);
}

/**
 * Dynamic content that accesses session and database
 */
async function FeedbackRespondContent({ requestId }: { requestId: string }) {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	// Get request details
	const request = await getFeedbackRequestById(requestId);

	if (!request) {
		notFound();
	}

	// Verify authorization
	if (request.respondentId !== session.user.id) {
		return (
			<DashboardContainer
				title="Acceso Denegado"
				description="No tienes permiso para ver esta solicitud"
			>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Sin Autorización</AlertTitle>
					<AlertDescription>
						Esta solicitud de feedback no está dirigida a ti.
					</AlertDescription>
				</Alert>
			</DashboardContainer>
		);
	}

	// Check if can still respond
	const canRespond = await canRespondToRequest(requestId, session.user.id);

	if (!canRespond.canRespond) {
		return (
			<DashboardContainer
				title="Solicitud No Disponible"
				description="Esta solicitud ya no puede ser respondida"
			>
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>No Disponible</AlertTitle>
					<AlertDescription>
						{canRespond.reason ||
							"Esta solicitud ya no está disponible para responder."}
					</AlertDescription>
				</Alert>
			</DashboardContainer>
		);
	}

	// Get questions and any saved progress
	const [questions, savedAnswers] = await Promise.all([
		getFeedbackQuestions(),
		getPartialProgress(requestId, session.user.id),
	]);

	return (
		<DashboardContainer
			title="Dar Feedback"
			description={`${request.requester.name} te ha solicitado feedback`}
		>
			<div className="space-y-6">
				<XpIncentiveBanner type="give_feedback" />
				<FeedbackQuestionnaire
					requestId={requestId}
					requesterName={request.requester.name}
					questions={questions}
					savedAnswers={savedAnswers || []}
				/>
			</div>
		</DashboardContainer>
	);
}
