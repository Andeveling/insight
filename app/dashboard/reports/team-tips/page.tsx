import { redirect } from "next/navigation";
import { getTeamTipsData } from "../_actions";
import { TeamTipsView } from "./team-tips-view";

export default async function TeamTipsPage() {
  const data = await getTeamTipsData();

  if (!data) {
    redirect("/login");
  }

  return (
    <TeamTipsView
      user={data.user}
      team={data.team}
      teammates={data.teammates}
      hasStrengths={data.hasStrengths}
      existingReport={data.existingReport}
    />
  );
}
