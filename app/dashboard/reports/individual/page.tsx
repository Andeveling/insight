import { redirect } from "next/navigation";
import { getUserIndividualReportData } from "../_actions";
import { IndividualReportView } from "./individual-report-view";
import DashboardContainer from "../../_components/dashboard-container";

export default async function IndividualReportPage() {
  const data = await getUserIndividualReportData();

  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardContainer
      title={"Reporte de Fortalezas Personales"}
      description={"Análisis impulsado por IA para Andres Parra"}
    >
      <IndividualReportView
        user={data.user}
        hasStrengths={data.hasStrengths}
        existingReport={data.existingReport}
      />
    </DashboardContainer>
  );
}
