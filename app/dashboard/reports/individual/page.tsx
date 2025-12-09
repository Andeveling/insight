import { redirect } from "next/navigation";
import { getUserIndividualReportData } from "../_actions";
import { IndividualReportView } from "./individual-report-view";

export default async function IndividualReportPage() {
  const data = await getUserIndividualReportData();

  if (!data) {
    redirect("/login");
  }

  return (
    <IndividualReportView
      user={data.user}
      hasStrengths={data.hasStrengths}
      existingReport={data.existingReport}
    />
  );
}
