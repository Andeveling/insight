import { getDomainColor } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/lib/types";
import type { CultureType } from "@/lib/utils/culture-calculator";
import { getCultureDomain } from "@/lib/utils/culture-calculator";
import { cn } from "@/lib/cn";
import { Info } from "lucide-react";

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
	const domainColor = getDomainColor(domain);

	const clipPath12 =
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	return (
		<div className={cn("relative group/culture", className)}>
			{/* Layered Border Container */}
			<div
				className="p-px bg-border/40 group-hover/culture:bg-primary/30 transition-all duration-300"
				style={{ clipPath: clipPath12 }}
			>
				<div
					className="bg-background/95 backdrop-blur-md relative h-full flex flex-col"
					style={{ clipPath: clipPath12 }}
				>
					{/* Sidebar Highlight */}
					<div
						className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover/culture:w-1.5"
						style={{ backgroundColor: domainColor }}
					/>

					<div className="p-6 space-y-6">
						{/* Header HUD */}
						<div className="flex items-start gap-5">
							<div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
								<div
									className="absolute inset-0 opacity-10 blur-md group-hover/culture:opacity-30 transition-opacity"
									style={{ backgroundColor: domainColor }}
								/>
								<div
									className="size-full flex items-center justify-center relative z-10 text-3xl"
									style={{
										clipPath: clipHex,
										backgroundColor: getDomainColor(domain, "light"),
										color: getDomainColor(domain, "dark"),
									}}
								>
									{culture.icon}
								</div>
							</div>

							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<h3
										className="text-lg font-black uppercase tracking-[0.1em]"
										style={{ color: getDomainColor(domain, "dark") }}
									>
										{culture.nameEs}
									</h3>
									<div className="px-1.5 py-0.5 border border-border/40 text-[7px] font-black uppercase tracking-widest text-muted-foreground">
										NODE_INF: {culture.name.toUpperCase()}
									</div>
								</div>
								<p className="text-[10px] font-bold text-muted-foreground/60 italic uppercase tracking-widest">
									{culture.subtitle}
								</p>
								<div className="inline-block mt-1 px-2 py-0.5 bg-primary/5 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em]">
									{culture.focusLabel}
								</div>
							</div>
						</div>

						{/* Description stream */}
						<div className="relative space-y-2">
							<div className="flex items-center gap-2">
								<Info className="size-3 text-muted-foreground/40" />
								<span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
									PROTOCOL_DEFINITION
								</span>
							</div>
							<p className="text-xs text-muted-foreground leading-relaxed pl-5 border-l border-border/20">
								{culture.description}
							</p>
						</div>

						{/* Attributes Matrix */}
						{culture.attributes && culture.attributes.length > 0 && (
							<div className="space-y-4 pt-4 border-t border-border/10">
								<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
									CORE_CHARACTERISTICS_MATRIX
								</h4>
								<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{culture.attributes.map((attr) => (
										<li
											key={attr}
											className="group/attr flex items-center gap-3"
										>
											<div
												className="shrink-0 size-2.5 transition-all group-hover/attr:scale-125 group-hover/attr:shadow-[0_0_8px_currentColor]"
												style={{
													clipPath: clipHex,
													backgroundColor: domainColor,
												}}
											/>
											<span className="text-[11px] font-medium text-muted-foreground/80 group-hover/attr:text-foreground transition-colors">
												{attr}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Aesthetic detail */}
					<div className="mt-auto h-1 w-full bg-grid-tech/10 opacity-20" />
				</div>
			</div>
		</div>
	);
}
