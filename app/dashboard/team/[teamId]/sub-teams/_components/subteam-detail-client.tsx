/**
 * SubTeam Detail with What-If Integration
 *
 * Client component wrapper that adds What-If simulation capabilities
 * to the SubTeam detail view.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-detail-client
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import type { SubTeamDetail, SubTeamMember } from "@/lib/types";
import { updateSubTeamMembers } from "../_actions/update-subteam";
import { GapAnalysis, type SuggestedMemberForGap } from "./gap-analysis";
import { WhatIfSimulator } from "./what-if-simulator";

interface SubTeamDetailClientProps {
	subTeam: SubTeamDetail;
	teamId: string;
	availableMembers: SubTeamMember[];
	suggestedMembers?: SuggestedMemberForGap[];
}

/**
 * Client-side wrapper for What-If simulation and interactive features
 */
export function SubTeamDetailClient({
	subTeam,
	teamId,
	availableMembers,
	suggestedMembers = [],
}: SubTeamDetailClientProps) {
	const router = useRouter();

	/**
	 * Handle applying What-If simulation changes
	 */
	const handleApplySimulation = useCallback(
		async (newMembers: string[]) => {
			const result = await updateSubTeamMembers(subTeam.id, newMembers);

			if (result.success) {
				toast.success("Cambios aplicados exitosamente", {
					description: result.data?.matchScore
						? `Nuevo Match Score: ${Math.round(result.data.matchScore)}%`
						: undefined,
				});
				router.refresh();
			} else {
				toast.error("Error al aplicar cambios", {
					description: result.error,
				});
			}
		},
		[subTeam.id, router],
	);

	/**
	 * Handle adding a suggested member
	 */
	const handleAddSuggestedMember = useCallback(
		async (memberId: string) => {
			const newMembers = [...subTeam.members, memberId];

			// Check max members
			if (newMembers.length > 10) {
				toast.error("El sub-equipo ya tiene el máximo de miembros (10)");
				return;
			}

			const result = await updateSubTeamMembers(subTeam.id, newMembers);

			if (result.success) {
				toast.success("Miembro agregado exitosamente", {
					description: result.data?.matchScore
						? `Nuevo Match Score: ${Math.round(result.data.matchScore)}%`
						: undefined,
				});
				router.refresh();
			} else {
				toast.error("Error al agregar miembro", {
					description: result.error,
				});
			}
		},
		[subTeam.id, subTeam.members, router],
	);

	return (
		<div className="space-y-6">
			{/* What-If Simulator */}
			<WhatIfSimulator
				teamId={teamId}
				subTeamId={subTeam.id}
				projectTypeProfileId={subTeam.projectTypeProfileId}
				currentMembers={subTeam.members}
				currentScore={subTeam.matchScore}
				availableMembers={availableMembers}
				onApply={handleApplySimulation}
			/>

			{/* Gap Analysis with Suggested Members */}
			{subTeam.analysis?.gaps && subTeam.analysis.gaps.length > 0 && (
				<GapAnalysis
					gaps={subTeam.analysis.gaps}
					recommendations={subTeam.analysis.recommendations || []}
					suggestedMembers={suggestedMembers}
					onAddMember={handleAddSuggestedMember}
					defaultOpen={false}
				/>
			)}
		</div>
	);
}
