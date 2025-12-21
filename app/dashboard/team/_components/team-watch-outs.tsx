"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/lib/types";

interface TeamWatchOutsProps {
	analytics: TeamAnalytics;
	className?: string;
}

export function TeamWatchOuts({ analytics, className }: TeamWatchOutsProps) {
	console.log("TeamWatchOuts analytics:", analytics);
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-2xl">
					<AlertTriangle className="h-6 w-6 text-yellow-500" />
					Puntos de Atención del Equipo
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Identifica riesgos potenciales antes de que impacten el rendimiento
				</p>
			</CardHeader>
			<CardContent className="space-y-3">
				{analytics.overusedStrengths.map((item) => {
					const riskLevel =
						item.percentage >= 80
							? "high"
							: item.percentage >= 60
								? "medium"
								: "low";

					const riskColors = {
						high: {
							bg: "bg-red-50 dark:bg-red-950/20",
							border: "border-red-200 dark:border-red-800",
							text: "text-red-700 dark:text-red-400",
							badge: "bg-red-600 text-white",
						},
						medium: {
							bg: "bg-yellow-50 dark:bg-yellow-950/20",
							border: "border-yellow-200 dark:border-yellow-800",
							text: "text-yellow-700 dark:text-yellow-400",
							badge: "bg-yellow-500 text-white",
						},
						low: {
							bg: "bg-blue-50 dark:bg-blue-950/20",
							border: "border-blue-200 dark:border-blue-800",
							text: "text-blue-700 dark:text-blue-400",
							badge: "bg-blue-500 text-white",
						},
					};

					const colors = riskColors[riskLevel];
					return (
						<Card
							key={item.strength.id}
							className={cn("border-2", colors.bg, colors.border)}
						>
							<CardContent className="p-4 space-y-3">
								<div className="flex items-center gap-3 flex-wrap">
									<span
										className={cn(
											"rounded-full px-3 py-1 text-xs font-semibold",
											colors.badge,
										)}
									>
										{item.strength.nameEs}
									</span>
									<span className={cn("text-sm font-bold", colors.text)}>
										{item.count} de {analytics.totalMembers} miembros (
										{item.percentage.toFixed(0)}%)
									</span>
								</div>

								<div className="text-sm text-muted-foreground">
									<MarkdownRenderer
										content={item.strength.briefDefinition}
										variant="compact"
									/>
								</div>

								{item.strength.watchOuts &&
									item.strength.watchOuts.length > 0 && (
										<div className="space-y-2">
											<h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
												<span>⚠️</span> Puntos de Atención
											</h4>
											<ul className="space-y-2">
												{item.strength.watchOuts.map((watchOut, idx) => (
													<li
														key={idx}
														className="text-sm p-2 rounded-md bg-background/50 border border-border/50"
													>
														<MarkdownRenderer
															content={watchOut}
															variant="compact"
														/>
													</li>
												))}
											</ul>
										</div>
									)}

		
							</CardContent>
						</Card>
					);
				})}
			</CardContent>
		</Card>
	);
}
