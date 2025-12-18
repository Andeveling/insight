import { Card } from "@/components/ui/card";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/lib/types";
import type { CultureType } from "@/lib/utils/culture-calculator";
import { getCultureDomain } from "@/lib/utils/culture-calculator";

interface CultureCardProps {
	culture: {
		name: string;
		nameEs: string;
		subtitle: string;
		description: string;
		focusLabel: string;
		attributes: string[];
		icon: string;
	};
	className?: string;
}

/**
 * CultureCard Component
 *
 * Displays detailed information about a specific team culture
 * including its description, key attributes, and visual styling
 */
export function CultureCard({ culture, className }: CultureCardProps) {
	const domain = getCultureDomain(culture.name as CultureType) as DomainType;

	return (
		<Card
			className={className}
			style={{
				borderLeft: `4px solid ${getDomainColor(domain)}`,
			}}
		>
			<div className="p-6 space-y-4">
				{/* Header */}
				<div className="flex items-start gap-4">
					<div
						className="text-4xl p-3 rounded-xl shrink-0"
						style={{
							backgroundColor: getDomainColor(domain, "light"),
						}}
					>
						{culture.icon}
					</div>
					<div className="flex-1">
						<h3
							className="text-xl font-bold"
							style={{
								color: getDomainColor(domain, "dark"),
							}}
						>
							{culture.nameEs}
						</h3>
						<p className="text-sm font-medium text-muted-foreground italic">
							{culture.subtitle}
						</p>
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
							{culture.focusLabel}
						</p>
					</div>
				</div>

				{/* Description */}
				<p className="text-sm text-muted-foreground leading-relaxed">
					{culture.description}
				</p>

				{/* Attributes */}
				{culture.attributes && culture.attributes.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-semibold">Características clave:</h4>
						<ul className="space-y-1.5">
							{culture.attributes.map((attr) => (
								<li
									key={attr}
									className="text-sm text-muted-foreground flex items-start gap-2"
								>
									<span
										className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
										style={{
											backgroundColor: getDomainColor(domain),
										}}
									/>
									<span>{attr}</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Card>
	);
}
