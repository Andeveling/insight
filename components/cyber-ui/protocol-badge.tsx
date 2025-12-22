import { cn } from "@/lib/cn";

interface ProtocolBadgeProps {
	/**
	 * ID del protocolo (número o string)
	 */
	id: number | string;

	/**
	 * Color del badge (variable CSS sin hsl/var wrapper)
	 * @default "primary"
	 */
	color?: string;

	/**
	 * Prefijo del texto
	 * @default "PROTOCOL_ID"
	 */
	prefix?: string;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

/**
 * Badge de identificador de protocolo.
 * Usado para numerar consideraciones, items o protocolos del sistema.
 *
 * @example
 * ```tsx
 * <ProtocolBadge id={1} color="insight" />
 * ```
 */
export function ProtocolBadge({
	id,
	color = "primary",
	prefix = "PROTOCOL_ID",
	className,
}: ProtocolBadgeProps) {
	const colorClass = `text-[hsl(var(--${color}))]`;
	const bgClass = `bg-[hsl(var(--${color})/5%)]`;
	const borderClass = `border-[hsl(var(--${color})/30%)]`;

	return (
		<div
			className={cn(
				"inline-flex items-center px-2 py-0.5 border",
				"text-[8px] font-black uppercase tracking-widest",
				colorClass,
				bgClass,
				borderClass,
				className,
			)}
		>
			{prefix}: {id}
		</div>
	);
}
