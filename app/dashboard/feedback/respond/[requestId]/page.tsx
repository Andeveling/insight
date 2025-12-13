/**
 * Feedback Response Page
 *
 * Page for completing peer feedback questionnaire
 */

import { redirect, notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardContainer from "@/app/dashboard/_components/dashboard-container";
import { FeedbackQuestionnaire } from "../../_components/feedback-questionnaire";
import { getSession } from "@/lib/auth";
import { getFeedbackRequestById } from "../../_services/feedback-request.service";
import {
  getFeedbackQuestions,
  getPartialProgress,
  canRespondToRequest,
} from "../../_services/feedback-response.service";

interface FeedbackRespondPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

export default async function FeedbackRespondPage({
  params,
}: FeedbackRespondPageProps) {
  const { requestId } = await params;
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
      <FeedbackQuestionnaire
        requestId={requestId}
        requesterName={request.requester.name}
        questions={questions}
        savedAnswers={savedAnswers || []}
      />
    </DashboardContainer>
  );
}
