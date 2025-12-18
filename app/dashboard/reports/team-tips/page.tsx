import { redirect } from "next/navigation";
import DashboardContainer from "../../_components/dashboard-container";
import { getTeamTipsData } from "../_actions";
import { TeamTipsView } from "./team-tips-view";

export default async function TeamTipsPage() {
	const data = await getTeamTipsData();

	if (!data) {
		redirect("/login");
	}

	return (
		<DashboardContainer
			title={`Consejos para ${data.team?.name}`}
			description="Estrategias personalizadas para mejorar la colaboración de tu equipo"
		>
			<TeamTipsView
				user={data.user}
				team={data.team}
				teammates={data.teammates}
				hasStrengths={data.hasStrengths}
				existingReport={data.existingReport}
			/>
		</DashboardContainer>
	);
}
