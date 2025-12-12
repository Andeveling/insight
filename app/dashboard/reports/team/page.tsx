import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardContainer from "../../_components/dashboard-container";
import { getTeamReportData } from "../_actions";
import { TeamReportView } from "./team-report-view";

export default async function TeamReportPage() {
  const data = await getTeamReportData();

  if (!data) {
    redirect("/login");
  }

  if (!data.teamMember) {
    return (
      <DashboardContainer
        title="Reporte del Equipo"
        description="Análisis impulsado por IA de la dinámica de tu equipo"
      >
        <Alert>
          <AlertTitle>Equipo no encontrado</AlertTitle>
          <AlertDescription>
            No eres miembro de ningún equipo. Contacta a tu administrador para
            que te agregue a un equipo.
          </AlertDescription>
        </Alert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      title={`Reporte del Equipo: ${data.team?.name}`}
      description={`Análisis impulsado por IA de la dinámica de tu equipo`}
    >
      <TeamReportView
        team={data.team}
        membersWithStrengthsCount={data.membersWithStrengthsCount}
        existingReport={data.existingReport}
      />
    </DashboardContainer>
  );
}
