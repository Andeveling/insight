import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { HexIcon } from "@/components/cyber-ui";

interface SectionHeaderProps {
	/**
	 * Ícono de Lucide a mostrar
	 */
	icon: LucideIcon;

	/**
	 * Color semántico del tema
	 */
	color:
		| "primary"
		| "info"
		| "success"
		| "warning"
		| "destructive"
		| "highlight"
		| "insight"
		| "accent";

	/**
	 * Título de la sección (en UPPERCASE)
	 */
	title: string;

	/**
	 * Subtítulo descriptivo
	 */
	subtitle: string;

	/**
	 * Badge opcional en la derecha
	 */
	badge?: ReactNode;
}

/**
 * Header estándar para secciones del reporte con hexágono, título y línea decorativa.
 * Sigue el patrón CyberPunk UI con borde inferior y línea de acento.
 */
export function SectionHeader({
	icon,
	color,
	title,
	subtitle,
	badge,
}: SectionHeaderProps) {
	const colorClass = `bg-[hsl(var(--${color}))]`;

	return (
		<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[hsl(var(--border)/40%)] pb-6 relative">
			<div className={`absolute bottom-0 left-0 w-32 h-0.5 ${colorClass}`} />
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<HexIcon icon={icon} color={color} size="md" />
					<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
						{title}
					</h2>
				</div>
				<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
					{subtitle}
				</p>
			</div>
			{badge && badge}
		</div>
	);
}
