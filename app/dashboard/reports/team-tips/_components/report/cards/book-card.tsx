"use client";

import { BookOpenIcon } from "lucide-react";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";

interface BookCardProps {
	book:
		| TeamTipsReport["personalBooks"][number]
		| TeamTipsReport["teamBooks"][number];
	variant: "personal" | "team";
}

export function BookCard({ book, variant }: BookCardProps) {
	return (
		<div
			className="p-px bg-[hsl(var(--border)/20%)] group/book hover:bg-[hsl(var(--accent)/20%)] transition-all duration-300 h-full"
			style={{ clipPath: CLIP_PATHS.small }}
		>
			<div
				className="bg-[hsl(var(--background)/95%)] p-6 h-full flex flex-col space-y-6 relative overflow-hidden backdrop-blur-md"
				style={{ clipPath: CLIP_PATHS.small }}
			>
				<div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none group-hover/book:opacity-20 transition-opacity">
					<BookOpenIcon className="size-12" />
				</div>

				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div
							className="size-1.5 bg-[hsl(var(--accent))]"
							style={{ clipPath: CLIP_PATHS.hex }}
						/>
						<span className="text-[8px] font-black uppercase tracking-widest text-[hsl(var(--accent))]">
							{variant === "personal" ? "SELF_OPTIMIZATION" : "TEAM_SINCRO"}
						</span>
					</div>
					<h4 className="text-xs font-black uppercase tracking-widest text-foreground group-hover/book:text-[hsl(var(--accent))] transition-colors">
						{book.title}
					</h4>
					<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
						{book.author}
					</p>
				</div>

				<div className="space-y-4 flex-1">
					<div className="space-y-1">
						<span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
							OBJECTIVE_CONTEXT
						</span>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
							{book.whyRecommended}
						</p>
					</div>

					<div className="space-y-2 border-t border-[hsl(var(--border)/10%)] pt-4">
						<span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
							CORE_INSIGHTS
						</span>
						<ul className="space-y-1.5">
							{book.keyTakeaways.map((item, i) => (
								<li key={i} className="flex items-center gap-2">
									<div
										className="size-1 bg-[hsl(var(--accent)/40%)]"
										style={{ clipPath: CLIP_PATHS.hex }}
									/>
									<span className="text-[9px] font-bold uppercase tracking-widest text-foreground/70">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
