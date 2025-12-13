/**
 * Feedback Request Page
 *
 * Page for creating new peer feedback requests
 * Shows available teammates and allows selection
 */

import { redirect } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardContainer from "../../_components/dashboard-container";
import { FeedbackRequestForm } from "../_components/feedback-request-form";
import { getAvailableTeammates } from "../_services/feedback-request.service";
import { getSession } from "@/lib/auth";

export default async function FeedbackRequestPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const teammates = await getAvailableTeammates(session.user.id);

  if (teammates.length === 0) {
    return (
      <DashboardContainer
        title="Solicitar Feedback"
        description="Obtén perspectivas de tus compañeros de equipo"
      >
        <Alert>
          <MessageSquarePlus className="h-4 w-4" />
          <AlertTitle>Sin compañeros disponibles</AlertTitle>
          <AlertDescription>
            No tienes compañeros de equipo para solicitar feedback. Asegúrate de
            estar en un equipo con otros miembros.
          </AlertDescription>
        </Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      title="Solicitar Feedback"
      description="Selecciona 3-5 compañeros para recibir feedback sobre tus fortalezas"
    >
      <FeedbackRequestForm teammates={teammates} />
    </DashboardContainer>
  );
}
