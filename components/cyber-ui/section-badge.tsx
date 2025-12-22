import { cn } from "@/lib/cn";

interface SectionBadgeProps {
	/**
	 * Texto del label de sección
	 */
	label: string;

	/**
	 * Color del badge (variable CSS sin hsl/var wrapper)
	 * @default "primary"
	 */
	color?: string;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

/**
 * Badge de etiqueta de sección.
 * Usado para categorizar contenido (personal/team, optimization/sincro, etc).
 *
 * @example
 * ```tsx
 * <SectionBadge label="SELF_OPTIMIZATION / TEAM_SINCRO" color="accent" />
 * ```
 */
export function SectionBadge({
	label,
	color = "primary",
	className,
}: SectionBadgeProps) {
	const colorClass = `text-[hsl(var(--${color}))]`;

	return (
		<span
			className={cn(
				"text-[8px] font-black uppercase tracking-widest",
				colorClass,
				className,
			)}
		>
			{label}
		</span>
	);
}
