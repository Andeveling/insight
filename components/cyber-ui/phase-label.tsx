import { cn } from "@/lib/cn";

type PhaseType = "immediate" | "consolidation" | "sustainability";

interface PhaseLabelProps {
	/**
	 * Tipo de fase
	 */
	phase: PhaseType;

	/**
	 * Duración o timeframe de la fase
	 */
	duration: string;

	/**
	 * Número de fase (opcional)
	 */
	phaseNumber?: number;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

const phaseConfig = {
	immediate: {
		label: "IMMEDIATE",
		color: "text-[hsl(var(--success))]",
	},
	consolidation: {
		label: "CONSOLIDATION",
		color: "text-[hsl(var(--info))]",
	},
	sustainability: {
		label: "SUSTAINABILITY",
		color: "text-[hsl(var(--accent))]",
	},
};

/**
 * Label de fase temporal para planes de acción.
 * Doble línea: título de fase + duración temporal.
 *
 * @example
 * ```tsx
 * <PhaseLabel phase="immediate" duration="FIRST_7_DAYS" phaseNumber={1} />
 * ```
 */
export function PhaseLabel({ phase, duration, phaseNumber, className }: PhaseLabelProps) {
	const config = phaseConfig[phase];

	return (
		<div className={cn("space-y-0.5", className)}>
			<h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em]", config.color)}>
				{phaseNumber ? `PHASE_0${phaseNumber}: ` : ""}
				{config.label}
			</h4>
			<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
				{duration}
			</p>
		</div>
	);
}
