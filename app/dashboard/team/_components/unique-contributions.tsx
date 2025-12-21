"use client";

import { Sparkles, Users } from "lucide-react";
import { StrengthBadge } from "@/app/_shared/components/strength-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/lib/types";

interface UniqueContributionsProps {
	analytics: TeamAnalytics;
	className?: string;
}

export function UniqueContributions({
	analytics,
	className,
}: UniqueContributionsProps) {
	if (analytics.uniqueStrengths.length === 0) {
		return (
			<Card className={cn("w-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-2xl">
						<Sparkles className="h-6 w-6 text-purple-500" />
						Contribuciones Únicas
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Descubre y celebra las contribuciones únicas de cada miembro
					</p>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertTitle>Fortalezas compartidas</AlertTitle>
						<AlertDescription>
							Tu equipo tiene una alta superposición de fortalezas. Esto puede
							ser bueno para la cohesión, pero considera diversificar para
							obtener perspectivas más amplias.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl">
					<Sparkles className="h-6 w-6 text-purple-500" />
					Contribuciones Únicas
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Maximiza el impacto individual destacando talentos especiales
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{analytics.uniqueStrengths.map((item) => (
					<Card
						key={`${item.memberId}-${item.strength.id}`}
						className="border-l-4 transition-all hover:shadow-md overflow-hidden"
						style={{
							borderLeftColor: getDomainColor(item.strength.domain),
						}}
					>
						<CardContent className="p-4">
							<div className="space-y-3">
								{/* Header */}
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 space-y-2">
										<div className="flex items-center gap-2 flex-wrap">
											<StrengthBadge
												name={item.strength.name}
												nameEs={item.strength.nameEs}
												domain={item.strength.domain}
												showTooltip={false}
											/>
											<span
												className="text-xs font-bold uppercase tracking-wider"
												style={{ color: getDomainColor(item.strength.domain) }}
											>
												Fortaleza Única
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span className="font-semibold">{item.memberName}</span>
										</div>
									</div>
									<Sparkles
										className="h-5 w-5 shrink-0 opacity-50"
										style={{ color: getDomainColor(item.strength.domain) }}
									/>
								</div>

								{/* Description */}
								<div className="text-sm text-muted-foreground">
									<MarkdownRenderer
										content={item.strength.briefDefinition}
										variant="compact"
									/>
								</div>

								{/* Best Partners */}
								{item.strength.bestPartners &&
									item.strength.bestPartners.length > 0 && (
										<div className="pt-3 border-t border-border/50">
											<h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
												<span>🤝</span> Mejores Compañeros
											</h4>
											<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
												{item.strength.bestPartners
													.slice(0, 2)
													.map((partner, i) => (
														<li
															key={i}
															className="text-sm p-2 rounded-md bg-muted/50 border border-border/50"
														>
															<MarkdownRenderer
																content={partner}
																variant="compact"
															/>
														</li>
													))}
											</ul>
										</div>
									)}

								{/* Call to Action */}
								<div
									className="p-3 rounded-lg bg-muted/30 border-l-2"
									style={{
										borderLeftColor: getDomainColor(item.strength.domain),
									}}
								>
									<p className="text-sm leading-relaxed">
										<strong className="font-bold">💡 Cómo aprovechar:</strong>{" "}
										{item.memberName} aporta una perspectiva única al equipo.
										Considera asignarle tareas que requieran esta fortaleza
										específica para maximizar el impacto.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	);
}
