"use client";

/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */

import { CheckCircle2Icon } from "lucide-react";
import { PhaseLabel } from "@/components/cyber-ui";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface ActionPlanSectionProps {
	report: TeamTipsReport;
}

function PhaseColumn({
	phase,
	phaseNumber,
	duration,
	actions,
}: {
	phase: "immediate" | "consolidation" | "sustainability";
	phaseNumber: 1 | 2 | 3;
	duration: string;
	actions: string[];
}) {
	return (
		<div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-[hsl(var(--border)/20%)] group/plan hover:bg-[hsl(var(--success)/5%)] transition-colors">
			<PhaseLabel phase={phase} duration={duration} phaseNumber={phaseNumber} />
			<ul className="space-y-4">
				{actions.map((action, i) => (
					<li key={i} className="flex gap-4 group/item">
						<div
							className="mt-1 size-4 shrink-0 flex items-center justify-center bg-[hsl(var(--background))] border border-[hsl(var(--success)/30%)] text-[8px] font-black text-[hsl(var(--success))] group-hover/item:bg-[hsl(var(--success))] group-hover/item:text-white transition-colors"
							style={{ clipPath: CLIP_PATHS.hex }}
						>
							{i + 1}
						</div>
						<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
							{action}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export function ActionPlanSection({ report }: ActionPlanSectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={CheckCircle2Icon}
				color="success"
				title="EXECUTION_ROADMAP"
				subtitle="FASE_DE_IMPLEMENTACIÓN_Y_DESLIEGUE_ESTRATÉGICO"
			/>

			<div
				className="p-px bg-[hsl(var(--border)/40%)]"
				style={{ clipPath: CLIP_PATHS.large }}
			>
				<div
					className="bg-[hsl(var(--background)/95%)] backdrop-blur-md p-0 overflow-hidden"
					style={{ clipPath: CLIP_PATHS.large }}
				>
					<div className="grid grid-cols-1 md:grid-cols-3">
						<PhaseColumn
							phase="immediate"
							phaseNumber={1}
							duration="FIRST_7_DAYS"
							actions={report.actionPlan.thisWeek}
						/>
						<PhaseColumn
							phase="consolidation"
							phaseNumber={2}
							duration="MONTH_01"
							actions={report.actionPlan.thisMonth}
						/>
						<div className="p-8 space-y-8 group/plan hover:bg-[hsl(var(--success)/5%)] transition-colors">
							<PhaseLabel
								phase="sustainability"
								duration="CONTINUOUS_PROTOCOL"
								phaseNumber={3}
							/>
							<ul className="space-y-4">
								{report.actionPlan.ongoing.map((action, i) => (
									<li key={i} className="flex gap-4 group/item">
										<div
											className="mt-1 size-4 shrink-0 flex items-center justify-center bg-[hsl(var(--background))] border border-[hsl(var(--success)/30%)] text-[8px] font-black text-[hsl(var(--success))] group-hover/item:bg-[hsl(var(--success))] group-hover/item:text-white transition-colors"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											{i + 1}
										</div>
										<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
											{action}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
