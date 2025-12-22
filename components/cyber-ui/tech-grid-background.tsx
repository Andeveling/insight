import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TechGridBackgroundProps {
	/**
	 * Contenido del componente (opcional)
	 */
	children?: ReactNode;

	/**
	 * Opacidad base de la rejilla (0-100)
	 * @default 10
	 */
	opacity?: number;

	/**
	 * Opacidad en hover (0-100)
	 * Si no se provee, no hay efecto hover
	 */
	hoverOpacity?: number;

	/**
	 * Aplicar máscara radial para centrar el foco
	 * @default false
	 */
	radialMask?: boolean;

	/**
	 * Clases adicionales
	 */
	className?: string;
}

/**
 * Wrapper que agrega textura de rejilla técnica (bg-grid-tech)
 * siguiendo el sistema de diseño CyberPunk.
 *
 * @example
 * ```tsx
 * <TechGridBackground opacity={10} hoverOpacity={20}>
 *   <div>Contenido con textura técnica</div>
 * </TechGridBackground>
 * ```
 */
export function TechGridBackground({
	children,
	opacity = 10,
	hoverOpacity,
	radialMask = false,
	className,
}: TechGridBackgroundProps) {
	const baseOpacityClass = `bg-grid-tech/${opacity}`;
	const hoverOpacityClass = hoverOpacity
		? `group-hover:bg-grid-tech/${hoverOpacity}`
		: "";

	const maskClass = radialMask
		? "[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"
		: "";

	return (
		<div
			className={cn(
				"absolute inset-0 pointer-events-none transition-colors",
				baseOpacityClass,
				hoverOpacityClass,
				maskClass,
				className,
			)}
		>
			{children}
		</div>
	);
}
