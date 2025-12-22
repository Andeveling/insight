"use client";

import { useState } from "react";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";
import { NoStrengthsState } from "./empty-states/no-strengths";
import { NoTeamState } from "./empty-states/no-team";
import { NoTeammatesState } from "./empty-states/no-teammates";
import { TeamTipsReportView } from "./report/team-tips-report";
import { GenerateTeamTipsPanel } from "./report/generate-team-tips-panel";
import { useTeamTipsGeneration } from "./use-team-tips-generation";

interface TeamTipsViewProps {
	user: {
		id: string;
		name: string;
		email: string;
		profile: {
			career: string | null;
			age: number | null;
			description: string | null;
		} | null;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
		}>;
	};
	team: {
		id: string;
		name: string;
		description: string | null;
		role: string | null;
	} | null;
	teammates: Array<{
		id: string;
		name: string;
		role: string | null;
		career: string | null;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
		}>;
	}>;
	hasStrengths: boolean;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: TeamTipsReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
}

export function TeamTipsView({
	user,
	team,
	teammates,
	hasStrengths,
	existingReport,
}: TeamTipsViewProps) {
	const [report] = useState<TeamTipsReport | null>(
		existingReport?.content ?? null,
	);

	const {
		isPending,
		error,
		regenerateMessage,
		daysUntilRegenerate,
		canRegenerate,
		handleGenerate,
	} = useTeamTipsGeneration({
		userId: user.id,
		teamId: team?.id ?? "",
		createdAt: existingReport?.createdAt,
	});

	if (!team) return <NoTeamState />;
	if (!hasStrengths) return <NoStrengthsState />;
	if (teammates.length === 0) return <NoTeammatesState />;

	return (
		<div className="space-y-8 py-4">
			{!report ? (
				<GenerateTeamTipsPanel
					isPending={isPending}
					onGenerate={() => handleGenerate(false)}
					error={error}
				/>
			) : (
				<TeamTipsReportView
					report={report}
					userId={user.id}
					isPending={isPending}
					canRegenerate={canRegenerate}
					daysUntilRegenerate={daysUntilRegenerate}
					onRegenerate={() => handleGenerate(true)}
					error={error}
					regenerateMessage={regenerateMessage}
				/>
			)}
		</div>
	);
}
