import { redirect } from "next/navigation";
import { getTeamReportData } from "../_actions";
import { TeamReportView } from "./team-report-view";

export default async function TeamReportPage() {
  const data = await getTeamReportData();

  if (!data) {
    redirect("/login");
  }

  if (!data.teamMember) {
    return (
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold">No Team Found</h1>
          <p className="mt-2 text-muted-foreground">
            You are not a member of any team. Contact your administrator to be
            added to a team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TeamReportView
      team={data.team}
      membersWithStrengthsCount={data.membersWithStrengthsCount}
      existingReport={data.existingReport}
    />
  );
}
