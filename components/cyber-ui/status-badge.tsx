import { cn } from "@/lib/cn";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";

type CompatibilityLevel = "high" | "medium" | "low";

interface StatusBadgeProps {
	/**
	 * Nivel de compatibilidad/estado
	 */
	variant: CompatibilityLevel;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

const variantConfig = {
	high: {
		color: "text-[hsl(var(--success))]",
		bg: "bg-[hsl(var(--success)/5%)]",
		border: "border-[hsl(var(--success)/20%)]",
		label: "HIGH_RESONANCE",
	},
	medium: {
		color: "text-[hsl(var(--warning))]",
		bg: "bg-[hsl(var(--warning)/5%)]",
		border: "border-[hsl(var(--warning)/20%)]",
		label: "MID_ALIGNMENT",
	},
	low: {
		color: "text-[hsl(var(--destructive))]",
		bg: "bg-[hsl(var(--destructive)/5%)]",
		border: "border-[hsl(var(--destructive)/20%)]",
		label: "INTERFERENCE_DETECTED",
	},
};

/**
 * Badge de estado/compatibilidad con punto pulsante.
 * Usado para indicar niveles de resonancia o sincronización entre nodos.
 *
 * @example
 * ```tsx
 * <StatusBadge variant="high" />
 * ```
 */
export function StatusBadge({ variant, className }: StatusBadgeProps) {
	const config = variantConfig[variant];

	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1 border",
				"text-[8px] font-black uppercase tracking-widest",
				config.border,
				config.bg,
				config.color,
				className,
			)}
		>
			<div
				className={cn(
					"size-1.5 animate-pulse",
					config.color.replace("text-", "bg-"),
				)}
				style={{ clipPath: CLIP_PATHS.hex }}
			/>
			{config.label}
		</div>
	);
}
