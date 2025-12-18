import { TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import DashboardContainer from "../_components/dashboard-container";
import { calculateTeamAnalytics } from "@/lib/utils/strength-helpers";
import {
	getAllCulturesForDisplay,
	getAllStrengths,
	getTeamByName,
	getTeamMembersWithStrengths,
} from "./_actions";
import {
	TeamCultureMap,
	TeamStrengthsGrid,
	TeamWatchOuts,
	UniqueContributions,
} from "./_components";

export default async function TeamPage() {
	// Fetch the default team "nojau"
	const team = await getTeamByName("nojau");

	if (!team) {
		return (
			<DashboardContainer
				title="Mi Equipo"
				description="Gestiona y visualiza la dinámica de tu equipo"
			>
				<Alert variant="destructive">
					<AlertTitle>Equipo no encontrado</AlertTitle>
					<AlertDescription>
						No se pudo cargar el equipo. Por favor, verifica que el equipo
						existe en la base de datos.
					</AlertDescription>
				</Alert>
			</DashboardContainer>
		);
	}

	const teamMembers = await getTeamMembersWithStrengths(team.id);
	const allStrengths = await getAllStrengths();
	const cultures = await getAllCulturesForDisplay();

	if (teamMembers.length === 0) {
		return (
			<DashboardContainer
				title={team.name}
				description={
					team.description || "Gestiona y visualiza la dinámica de tu equipo"
				}
			>
				<Alert>
					<AlertTitle>Equipo sin miembros</AlertTitle>
					<AlertDescription>
						Este equipo aún no tiene miembros con fortalezas configuradas.
					</AlertDescription>
				</Alert>
			</DashboardContainer>
		);
	}

	const analytics = calculateTeamAnalytics(teamMembers);

	const memberCountCard = (
		<span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-medium">
			<TrendingUp className="h-4 w-4 mr-1" />
			{teamMembers.length} miembros
		</span>
	);

	return (
		<DashboardContainer
			title={`Equipo ${team.name}`}
			description={
				team.description || "Gestiona y visualiza la dinámica de tu equipo"
			}
			card={memberCountCard}
		>
			{/* Team Strengths Grid */}
			<section>
				<TeamStrengthsGrid
					teamMembers={teamMembers}
					allStrengths={allStrengths}
				/>
			</section>

			<Separator />

			{/* Team Culture Map */}
			<section>
				<TeamCultureMap analytics={analytics} cultures={cultures} />
			</section>

			<Separator />

			{/* Two Column Layout for Watch Outs and Unique Contributions */}
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TeamWatchOuts analytics={analytics} />
				<UniqueContributions analytics={analytics} />
			</section>
		</DashboardContainer>
	);
}
