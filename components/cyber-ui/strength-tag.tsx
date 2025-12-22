import { cn } from "@/lib/cn";

interface StrengthTagProps {
	/**
	 * Nombre de la fortaleza
	 */
	strength: string;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

/**
 * Tag micro para fortalezas.
 * Badge compacto con tipografía técnica para listar fortalezas.
 *
 * @example
 * ```tsx
 * <StrengthTag strength="Empathizer" />
 * ```
 */
export function StrengthTag({ strength, className }: StrengthTagProps) {
	return (
		<div
			className={cn(
				"inline-block px-2 py-0.5",
				"bg-[hsl(var(--muted)/20%)] border border-[hsl(var(--border)/10%)]",
				"text-[7px] font-black uppercase tracking-widest text-muted-foreground",
				className,
			)}
		>
			{strength}
		</div>
	);
}
