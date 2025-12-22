import { cn } from "@/lib/cn";

interface NodeIdBadgeProps {
	/**
	 * ID del nodo (user ID, team ID, etc)
	 */
	nodeId: string;

	/**
	 * Prefijo del texto
	 * @default "NODE_ID"
	 */
	prefix?: string;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

/**
 * Badge de identificador de nodo del sistema.
 * Usado para mostrar IDs técnicos de usuarios, equipos, o entidades del sistema.
 *
 * @example
 * ```tsx
 * <NodeIdBadge nodeId={user.id.slice(0, 8).toUpperCase()} />
 * ```
 */
export function NodeIdBadge({
	nodeId,
	prefix = "NODE_ID",
	className,
}: NodeIdBadgeProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1",
				"bg-[hsl(var(--muted)/10%)] border border-[hsl(var(--border)/20%)]",
				"text-[9px] font-black uppercase tracking-widest text-muted-foreground",
				className,
			)}
		>
			{prefix}: {nodeId}
		</div>
	);
}
