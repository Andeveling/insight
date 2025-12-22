"use client";

/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */

import {
	LightbulbIcon,
	MessageCircleIcon,
	SparklesIcon,
	TargetIcon,
	UsersIcon,
} from "lucide-react";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface CommunicationStrategiesSectionProps {
	report: TeamTipsReport;
}

function TipList({ tips }: { tips: string[] }) {
	return (
		<ul className="space-y-4">
			{tips.map((tip, i) => (
				<li key={i} className="flex items-start gap-3 group">
					<div
						className="mt-1.5 size-1.5 shrink-0 bg-[hsl(var(--primary)/40%)] group-hover:bg-[hsl(var(--primary))] transition-colors"
						style={{ clipPath: CLIP_PATHS.hex }}
					/>
					<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
						{tip}
					</span>
				</li>
			))}
		</ul>
	);
}

export function CommunicationStrategiesSection({
	report,
}: CommunicationStrategiesSectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={LightbulbIcon}
				color="highlight"
				title="INTERACTION_STRATEGY_MATRIX"
				subtitle="PROTOCOLOS_DE_COMUNICACIÓN_MULTIMODAL"
			/>

			<div
				className="p-px bg-[hsl(var(--border)/40%)]"
				style={{ clipPath: CLIP_PATHS.large }}
			>
				<div
					className="bg-[hsl(var(--background)/95%)] backdrop-blur-md p-8 overflow-hidden relative"
					style={{ clipPath: CLIP_PATHS.large }}
				>
					<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />

					<div className="relative z-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-6">
							<div className="flex items-center gap-3 border-b border-[hsl(var(--border)/20%)] pb-3">
								<UsersIcon className="size-4 text-[hsl(var(--primary))]" />
								<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
									SYNC_MEETINGS
								</h4>
							</div>
							<TipList tips={report.communicationStrategies.inMeetings} />
						</div>

						<div className="space-y-6">
							<div className="flex items-center gap-3 border-b border-[hsl(var(--border)/20%)] pb-3">
								<TargetIcon className="size-4 text-[hsl(var(--primary))]" />
								<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
									CONFLICT_RESOLUTION
								</h4>
							</div>
							<TipList tips={report.communicationStrategies.inConflicts} />
						</div>

						<div className="space-y-6">
							<div className="flex items-center gap-3 border-b border-[hsl(var(--border)/20%)] pb-3">
								<SparklesIcon className="size-4 text-[hsl(var(--primary))]" />
								<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
									COLLECTIVE_PEAK
								</h4>
							</div>
							<TipList tips={report.communicationStrategies.inCelebrations} />
						</div>

						<div className="space-y-6">
							<div className="flex items-center gap-3 border-b border-[hsl(var(--border)/20%)] pb-3">
								<MessageCircleIcon className="size-4 text-[hsl(var(--primary))]" />
								<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
									DAILY_OPERATIONS
								</h4>
							</div>
							<TipList
								tips={report.communicationStrategies.dailyInteractions}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
