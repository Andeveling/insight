/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import { BookOpenIcon } from "lucide-react";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { SectionHeader } from "../../section-header";
import type { TeamTipsReport } from "@/dashboard/reports/_schemas/team-tips.schema";
import { BookCard } from "../cards/book-card";

interface BookRecommendationsSectionProps {
	report: TeamTipsReport;
}

export function BookRecommendationsSection({
	report,
}: BookRecommendationsSectionProps) {
	return (
		<section className="space-y-8">
			<SectionHeader
				icon={BookOpenIcon}
				color="accent"
				title="NEURAL_ENRICHMENT_LIBRARY"
				subtitle="RECURSOS_DE_APRENDIZAJE_PARA_OPTIMIZACIÓN_TÉCNICA"
			/>

			{/* Personal Books */}
			<div className="space-y-6">
				<div className="flex items-center gap-3">
					<div
						className="size-8 flex items-center justify-center bg-[hsl(var(--accent)/10%)] text-[hsl(var(--accent))] text-[10px] font-black text-lg"
						style={{ clipPath: CLIP_PATHS.hex }}
					>
						01
					</div>
					<h3 className="text-lg underline underline-offset-8 font-black uppercase tracking-[0.2em] text-foreground">
						INDIVIDUAL_EVOLUTION_LIST
					</h3>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{report.personalBooks.map((book, i) => (
						<BookCard key={i} book={book} variant="personal" />
					))}
				</div>
			</div>

			<div className="h-px bg-[hsl(var(--border)/20%)]" />

			{/* Team Books */}
			<div className="space-y-6">
				<div className="flex items-center gap-3">
					<div
						className="size-8 flex items-center justify-center bg-[hsl(var(--accent)/10%)] text-[hsl(var(--accent))] text-[10px] font-black text-lg"
						style={{ clipPath: CLIP_PATHS.hex }}
					>
						02
					</div>
					<h3 className="text-lg underline underline-offset-8 font-black uppercase tracking-[0.2em] text-foreground">
						COLECTIVE_NODE_RESOURCES
					</h3>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{report.teamBooks.map((book, i) => (
						<BookCard key={i} book={book} variant="team" />
					))}
				</div>
			</div>
		</section>
	);
}
