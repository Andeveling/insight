"use client";

/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */

import { TargetIcon } from "lucide-react";
import { ProtocolBadge } from "@/components/cyber-ui";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface TeamConsiderationsSectionProps {
	report: TeamTipsReport;
}

export function TeamConsiderationsSection({
	report,
}: TeamConsiderationsSectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={TargetIcon}
				color="insight"
				title="SYSTEM_OPERATIONAL_LOGS"
				subtitle="DIRECTIVAS_DE_EQUIPO_Y_CALIBRACIÓN_COLECTIVA"
			/>

			<div className="grid gap-6 md:grid-cols-2">
				{report.teamConsiderations.map((consideration, i) => (
					<div
						key={i}
						className="p-px bg-[hsl(var(--border)/20%)] hover:bg-[hsl(var(--insight)/20%)] transition-all duration-300 group/cons"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<div
							className="bg-[hsl(var(--background)/95%)] p-8 flex flex-col h-full space-y-6 relative overflow-hidden backdrop-blur-md"
							style={{ clipPath: CLIP_PATHS.medium }}
						>
							<div className="absolute top-0 right-0 p-4">
								<ProtocolBadge
									id={i + 1}
									prefix="PROTOCOL_ID"
									color="insight"
								/>
							</div>
							<div className="space-y-2">
								<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground group-hover/cons:text-[hsl(var(--insight))] transition-colors">
									{consideration.title.toUpperCase()}
								</h3>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									{consideration.description}
								</p>
							</div>

							<div className="space-y-4 pt-4 border-t border-[hsl(var(--border)/10%)]">
								<div className="space-y-1">
									<span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
										CUÁNDO_APLICAR
									</span>
									<p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80 leading-relaxed border-l border-[hsl(var(--insight)/30%)] pl-3">
										{consideration.whenToApply}
									</p>
								</div>
								<div className="space-y-3">
									<span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
										ACCIONES_CLAVE
									</span>
									<ul className="grid grid-cols-1 gap-2">
										{consideration.actionItems.map((item, j) => (
											<li
												key={j}
												className="flex items-center gap-3 group/item"
											>
												<div
													className="size-1 bg-[hsl(var(--insight)/40%)] group-hover/item:bg-[hsl(var(--insight))] transition-colors"
													style={{ clipPath: CLIP_PATHS.hex }}
												/>
												<span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors">
													{item}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
