import { CultureCard } from "./culture-card";

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
		<div className={className}>
			<div className="space-y-3 mb-6">
				<h3 className="text-2xl font-bold">Las 4 Culturas de Equipo</h3>
				<p className="text-muted-foreground">
					Cada cultura emerge de la combinación de dos ejes: Energía
					(Acción/Reflexión) y Orientación (Resultados/Personas). Comprende las
					dinámicas naturales de tu equipo y cómo aprovecharlas.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{cultures.map((culture) => (
					<CultureCard key={culture.name} culture={culture} />
				))}
			</div>
		</div>
	);
}
