import { CultureCard } from "./culture-card";
import { cn } from "@/lib/cn";
import { Share2 } from "lucide-react";

interface Culture {
	name: string;
	nameEs: string;
	subtitle: string;
	description: string;
	focusLabel: string;
	attributes: string[];
	icon: string;
}

interface CulturesGridProps {
	cultures: Culture[];
	className?: string;
}

/**
 * CulturesGrid Component
 *
 * Displays a grid of culture cards with detailed information
 * about each culture type
 */
export function CulturesGrid({ cultures, className }: CulturesGridProps) {
	return (
		<div className={cn("space-y-12", className)}>
			<div className="space-y-4 max-w-2xl">
				<div className="flex items-center gap-3">
					<Share2 className="size-5 text-primary" />
					<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
						ARCHETYPES_DISTRIBUTION_SYSTEM
					</h3>
				</div>
				<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
					CADA_CULTURA_EMERGE_DE_LA_COMBINACIÓN_DE_DOS_EJES: ENERGÍA
					(ACCIÓN/REFLEXIÓN) Y ORIENTACIÓN (RESULTADOS/PERSONAS). COMPRENDE LAS
					DINÁMICAS NATURALES DE TU EQUIPO Y CÓMO APROVECHARLAS // [MODEL_V4]
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{cultures.map((culture) => (
					<CultureCard key={culture.name} culture={culture} />
				))}
			</div>
		</div>
	);
}
