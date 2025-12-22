/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { StatusBadge, StrengthTag } from "@/components/cyber-ui";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface MemberTipCardProps {
	member: TeamTipsReport["memberTips"][number];
}

export function MemberTipCard({ member }: MemberTipCardProps) {
	return (
		<div
			className="p-px bg-[hsl(var(--border)/20%)] group/member transition-all duration-300 hover:bg-[hsl(var(--border)/40%)]"
			style={{ clipPath: CLIP_PATHS.medium }}
		>
			<div
				className="bg-[hsl(var(--background)/95%)] flex flex-col h-full relative backdrop-blur-md"
				style={{ clipPath: CLIP_PATHS.medium }}
			>
				{/* Header */}
				<div className="border-b border-[hsl(var(--border)/20%)] bg-[hsl(var(--muted)/5%)] p-6 space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="relative size-12 flex items-center justify-center">
								<div
									className="absolute inset-0 bg-[hsl(var(--primary)/20%)] group-hover/member:bg-[hsl(var(--primary)/40%)] transition-colors"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								<div
									className="absolute inset-px bg-[hsl(var(--background)/50%)] flex items-center justify-center text-[hsl(var(--primary))] text-lg font-black"
									style={{ clipPath: CLIP_PATHS.hex }}
								>
									{member.memberName.charAt(0).toUpperCase()}
								</div>
							</div>
							<div className="space-y-1">
								<h3 className="text-sm font-black uppercase tracking-widest text-foreground">
									{member.memberName}
								</h3>
								{member.memberRole && (
									<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
										{member.memberRole}
									</p>
								)}
							</div>
						</div>

						<StatusBadge variant={member.relationshipDynamics.compatibility} />
					</div>

					<div className="flex flex-wrap gap-1.5 pt-2">
						{member.theirTopStrengths.map((strength) => (
							<StrengthTag key={strength} strength={strength} />
						))}
					</div>
				</div>

				<div className="p-6 space-y-8 flex-1">
					{/* Dynamics Matrix */}
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-4">
							<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[hsl(var(--success))] flex items-center gap-2">
								<ThumbsUpIcon className="size-3" />
								SYNERGY_POINTS
							</h4>
							<ul className="space-y-3">
								{member.relationshipDynamics.synergies.map((s, i) => (
									<li key={i} className="flex items-start gap-2 group/item">
										<div
											className="mt-1 size-1 bg-[hsl(var(--success)/40%)] group-hover/item:bg-[hsl(var(--success))] transition-colors"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
											{s}
										</span>
									</li>
								))}
							</ul>
						</div>

						<div className="space-y-4">
							<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[hsl(var(--destructive))] flex items-center gap-2">
								<ThumbsDownIcon className="size-3" />
								FRICTION_ZONES
							</h4>
							<ul className="space-y-3">
								{member.relationshipDynamics.potentialFrictions.map((f, i) => (
									<li key={i} className="flex items-start gap-2 group/item">
										<div
											className="mt-1 size-1 bg-[hsl(var(--destructive)/40%)] group-hover/item:bg-[hsl(var(--destructive))] transition-colors"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
											{f}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Implementation Protocol */}
					<div
						className="p-4 bg-[hsl(var(--muted)/10%)] border border-[hsl(var(--border)/20%)] relative"
						style={{ clipPath: CLIP_PATHS.small }}
					>
						<div className="space-y-6">
							<div className="space-y-2">
								<h5 className="text-[8px] font-black uppercase tracking-widest text-primary/60">
									PRIMARY_COMMUNICATION_APPROACH
								</h5>
								<p className="text-[11px] font-black uppercase tracking-widest text-foreground leading-relaxed italic">
									&quot;{member.communicationStyle.preferredApproach}&quot;
								</p>
							</div>

							<div className="grid gap-6 sm:grid-cols-2">
								<div className="space-y-3">
									<h6 className="text-[8px] font-black uppercase tracking-widest text-[hsl(var(--success))]">
										OPTIMIZE
									</h6>
									<ul className="space-y-2">
										{member.communicationStyle.doList.map((item, i) => (
											<li
												key={i}
												className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-l border-[hsl(var(--success)/30%)] pl-3"
											>
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="space-y-3">
									<h6 className="text-[8px] font-black uppercase tracking-widest text-[hsl(var(--destructive))]">
										RESTRICT
									</h6>
									<ul className="space-y-2">
										{member.communicationStyle.dontList.map((item, i) => (
											<li
												key={i}
												className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-l border-[hsl(var(--destructive)/30%)] pl-3"
											>
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
							COLLECTIVE_MISSION_TYPES
						</h4>
						<div className="flex flex-wrap gap-2">
							{member.projectTypes.map((type, i) => (
								<div
									key={i}
									className="px-3 py-1 bg-[hsl(var(--primary)/10%)] border border-[hsl(var(--primary)/20%)] text-[8px] font-black uppercase tracking-widest text-[hsl(var(--primary))]"
									style={{ clipPath: CLIP_PATHS.small }}
								>
									{type}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
