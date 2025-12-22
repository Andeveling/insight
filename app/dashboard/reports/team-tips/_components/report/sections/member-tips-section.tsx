"use client";

import { MessageCircleIcon } from "lucide-react";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";
import { MemberTipCard } from "../cards/member-tip-card";

interface MemberTipsSectionProps {
	report: TeamTipsReport;
}

export function MemberTipsSection({ report }: MemberTipsSectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={MessageCircleIcon}
				color="info"
				title="TEAMMATE_RESONANCE_DATA"
				subtitle="SINCRO_PERSONALIZADA_CON_NODOS_ADYACENTES"
			/>

			<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
				{report.memberTips.map((member) => (
					<MemberTipCard key={member.memberId} member={member} />
				))}
			</div>
		</section>
	);
}
