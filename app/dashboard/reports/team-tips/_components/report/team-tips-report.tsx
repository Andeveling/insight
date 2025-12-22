"use client";

import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";
import { ActionPlanSection } from "./sections/action-plan-section";
import { BookRecommendationsSection } from "./sections/book-recommendations-section";
import { CommunicationStrategiesSection } from "./sections/communication-strategies-section";
import { MemberTipsSection } from "./sections/member-tips-section";
import { PersonalSummarySection } from "./sections/personal-summary-section";
import { RegenerateSection } from "./sections/regenerate-section";
import { TeamConsiderationsSection } from "./sections/team-considerations-section";

interface TeamTipsReportViewProps {
	report: TeamTipsReport;
	userId: string;
	isPending: boolean;
	canRegenerate: boolean;
	daysUntilRegenerate: number;
	onRegenerate: () => void;
	error?: string | null;
	regenerateMessage?: string | null;
}

export function TeamTipsReportView({
	report,
	userId,
	isPending,
	canRegenerate,
	daysUntilRegenerate,
	onRegenerate,
	error,
	regenerateMessage,
}: TeamTipsReportViewProps) {
	return (
		<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<PersonalSummarySection report={report} userId={userId} />
			<MemberTipsSection report={report} />
			<CommunicationStrategiesSection report={report} />
			<TeamConsiderationsSection report={report} />
			<BookRecommendationsSection report={report} />
			<ActionPlanSection report={report} />
			<RegenerateSection
				isPending={isPending}
				canRegenerate={canRegenerate}
				daysUntilRegenerate={daysUntilRegenerate}
				onRegenerate={onRegenerate}
				error={error}
				regenerateMessage={regenerateMessage}
			/>
		</div>
	);
}
