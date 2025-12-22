"use client";

import { UsersIcon } from "lucide-react";
import { NodeIdBadge } from "@/components/cyber-ui";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface PersonalSummarySectionProps {
	report: TeamTipsReport;
	userId: string;
}

export function PersonalSummarySection({
	report,
	userId,
}: PersonalSummarySectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={UsersIcon}
				color="primary"
				title="USER_NODE_SYNOPSIS"
				subtitle="ANÁLISIS_DE_TU_IMPACTO_EN_LA_MATRIZ_OPERATIVA_DE_EQUIPO"
				badge={<NodeIdBadge nodeId={userId.slice(0, 8).toUpperCase()} />}
			/>

			<div
				className="p-px bg-[hsl(var(--border)/40%)] relative group"
				style={{ clipPath: CLIP_PATHS.large }}
			>
				<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
				<div
					className="bg-[hsl(var(--background)/95%)] backdrop-blur-md overflow-hidden"
					style={{ clipPath: CLIP_PATHS.large }}
				>
					<div className="bg-[hsl(var(--muted)/5%)] border-b border-[hsl(var(--border)/40%)] p-8">
						<h3 className="text-2xl font-black uppercase tracking-widest text-foreground mb-1">
							{report.personalSummary.headline}
						</h3>
						<p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--primary))]">
							TEAM_ALIGNMENT: {report.personalSummary.teamName.toUpperCase()}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[hsl(var(--border)/20%)]">
						<div className="p-8 space-y-4 group/item hover:bg-[hsl(var(--primary)/5%)] transition-colors">
							<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
								<div
									className="size-1.5 bg-[hsl(var(--primary)/40%)] group-hover/item:bg-[hsl(var(--primary))]"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								RESONANCE_CONTEXT
							</h4>
							<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
								{report.personalSummary.yourStrengthsInTeamContext}
							</p>
						</div>
						<div className="p-8 space-y-4 group/item hover:bg-[hsl(var(--primary)/5%)] transition-colors">
							<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
								<div
									className="size-1.5 bg-[hsl(var(--primary)/40%)] group-hover/item:bg-[hsl(var(--primary))]"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								NATURAL_NODE_ROLE
							</h4>
							<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
								{report.personalSummary.naturalRole}
							</p>
						</div>
						<div className="p-8 space-y-4 group/item hover:bg-[hsl(var(--primary)/5%)] transition-colors">
							<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
								<div
									className="size-1.5 bg-[hsl(var(--primary)/40%)] group-hover/item:bg-[hsl(var(--primary))]"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								EVOLUTION_PROTOCOL
							</h4>
							<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
								{report.personalSummary.growthOpportunity}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
