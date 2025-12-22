import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";

interface HexIconProps {
	/**
	 * Componente de icono de Lucide React
	 */
	icon: LucideIcon;

	/**
	 * Color del icono y del fondo (variable CSS sin hsl/var wrapper)
	 * Ejemplos: "primary", "destructive", "success", "warning"
	 * @default "primary"
	 */
	color?: string;

	/**
	 * Tamaño del contenedor hexagonal
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg" | "xl";

	/**
	 * Habilitar animación de pulso
	 * @default false
	 */
	animated?: boolean;

	/**
	 * Opacidad del fondo hexagonal exterior
	 * @default 20
	 */
	bgOpacity?: number;

	/**
	 * Opacidad del fondo hexagonal interior
	 * @default 50
	 */
	innerBgOpacity?: number;

	/**
	 * Clases adicionales para el contenedor exterior
	 */
	className?: string;
}

const sizeConfig = {
	sm: {
		container: "size-8",
		icon: "size-4",
	},
	md: {
		container: "size-12",
		icon: "size-6",
	},
	lg: {
		container: "size-16",
		icon: "size-8",
	},
	xl: {
		container: "size-20",
		icon: "size-10",
	},
};

/**
 * Icono con fondo hexagonal siguiendo el sistema de diseño CyberPunk.
 * Implementa el patrón de doble capa hexagonal con efecto de vidrio táctico.
 *
 * @example
 * ```tsx
 * <HexIcon icon={UsersIcon} color="primary" size="md" animated />
 * ```
 */
export function HexIcon({
	icon: Icon,
	color = "primary",
	size = "md",
	animated = false,
	bgOpacity = 20,
	innerBgOpacity = 50,
	className,
}: HexIconProps) {
	const { container, icon: iconSize } = sizeConfig[size];
	const colorClass = `text-[hsl(var(--${color}))]`;
	const bgClass = `bg-[hsl(var(--${color})/${bgOpacity}%)]`;
	const innerBgClass = `bg-[hsl(var(--background)/${innerBgOpacity}%)]`;

	return (
		<div
			className={cn(
				"relative flex items-center justify-center",
				container,
				className,
			)}
		>
			{/* Capa exterior hexagonal */}
			<div
				className={cn("absolute inset-0", bgClass, animated && "animate-pulse")}
				style={{ clipPath: CLIP_PATHS.hex }}
			/>

			{/* Capa interior hexagonal con icono */}
			<div
				className={cn(
					"absolute inset-px flex items-center justify-center",
					innerBgClass,
					colorClass,
				)}
				style={{ clipPath: CLIP_PATHS.hex }}
			>
				<Icon className={iconSize} />
			</div>
		</div>
	);
}
