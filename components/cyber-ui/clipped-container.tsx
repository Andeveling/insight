import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CLIP_PATHS, type ClipPathSize } from "@/lib/constants/clip-paths";

interface ClippedContainerProps {
	/**
	 * Contenido interior del contenedor
	 */
	children: ReactNode;

	/**
	 * Tamaño del clip-path (determina el cutoff en las esquinas)
	 * @default "large"
	 */
	size?: ClipPathSize;

	/**
	 * Color del borde (variable CSS sin hsl/var wrapper)
	 * Ejemplos: "primary", "destructive", "border"
	 * @default "border"
	 */
	borderColor?: string;

	/**
	 * Opacidad del borde (0-100)
	 * @default 20
	 */
	borderOpacity?: number;

	/**
	 * Color de fondo del contenedor interior (variable CSS sin hsl/var wrapper)
	 * @default "background"
	 */
	backgroundColor?: string;

	/**
	 * Opacidad del fondo (0-100)
	 * @default 95
	 */
	backgroundOpacity?: number;

	/**
	 * Habilitar backdrop blur en el contenido interior
	 * @default true
	 */
	backdropBlur?: boolean;

	/**
	 * Clases adicionales para el contenedor exterior
	 */
	className?: string;

	/**
	 * Clases adicionales para el contenedor interior
	 */
	innerClassName?: string;

	/**
	 * Padding del contenedor interior
	 * @default "p-6"
	 */
	padding?: string;

	/**
	 * Deshabilitar el patrón de doble contenedor
	 * (útil para casos donde solo necesitas el clip-path)
	 * @default false
	 */
	noBorder?: boolean;
}

/**
 * Contenedor con geometría industrial CyberPunk.
 * Implementa el patrón de doble contenedor (p-px + bg-border) con clip-paths.
 *
 * @example
 * ```tsx
 * <ClippedContainer size="large" borderColor="primary" borderOpacity={30}>
 *   <div>Contenido con geometría industrial</div>
 * </ClippedContainer>
 * ```
 */
export function ClippedContainer({
	children,
	size = "large",
	borderColor = "border",
	borderOpacity = 20,
	backgroundColor = "background",
	backgroundOpacity = 95,
	backdropBlur = true,
	className,
	innerClassName,
	padding = "p-6",
	noBorder = false,
}: ClippedContainerProps) {
	const clipPath = CLIP_PATHS[size];

	// Construcción de clases dinámicas usando hsl(var(--color))
	const borderClass = `bg-[hsl(var(--${borderColor})/${borderOpacity}%)]`;
	const bgClass = `bg-[hsl(var(--${backgroundColor})/${backgroundOpacity}%)]`;

	if (noBorder) {
		return (
			<div
				className={cn(bgClass, backdropBlur && "backdrop-blur-md", padding, innerClassName)}
				style={{ clipPath }}
			>
				{children}
			</div>
		);
	}

	return (
		<div className={cn("p-px", borderClass, className)} style={{ clipPath }}>
			<div
				className={cn(bgClass, backdropBlur && "backdrop-blur-md", padding, innerClassName)}
				style={{ clipPath }}
			>
				{children}
			</div>
		</div>
	);
}
