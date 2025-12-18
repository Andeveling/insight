/**
 * SubTeams List
 *
 * Component displaying the grid of sub-team cards.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteams-list
 */

import { Users } from "lucide-react";

import { SubTeamCard } from "./subteam-card";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import type { SubTeamListItem } from "@/lib/types";

interface SubTeamsListProps {
	subTeams: SubTeamListItem[];
	teamId: string;
}

export function SubTeamsList({ subTeams, teamId }: SubTeamsListProps) {
	if (subTeams.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Users />
					</EmptyMedia>
					<EmptyTitle>Sin sub-equipos</EmptyTitle>
					<EmptyDescription>
						Crea tu primer sub-equipo para organizar a tu equipo en grupos de
						trabajo especializados.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{subTeams.map((subTeam) => (
				<SubTeamCard key={subTeam.id} subTeam={subTeam} teamId={teamId} />
			))}
		</div>
	);
}
