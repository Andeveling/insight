/**
 * Insight Summary Component
 *
 * Muestra el resumen de insights generados a partir del feedback de pares
 */

import { Lightbulb, CheckCircle2, Eye, Target } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeneratedInsight } from "../_utils/insight-generator";

interface InsightSummaryProps {
	summary: string;
	insights: GeneratedInsight[];
	responseCount: number;
}

export function InsightSummary({
	summary,
	insights,
	responseCount,
}: InsightSummaryProps) {
	const insightTypeConfig = {
		agreement: {
			icon: CheckCircle2,
			label: "Validada",
			className:
				"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		},
		blind_spot_high: {
			icon: Eye,
			label: "Talento Oculto",
			className:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		},
		blind_spot_low: {
			icon: Target,
			label: "Oportunidad",
			className:
				"bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
		},
		emerging: {
			icon: Lightbulb,
			label: "Emergente",
			className:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
		},
	};

	return (
		<div className="space-y-6">
			{/* Resumen Principal */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lightbulb className="h-5 w-5 text-primary" />
						Resumen de Insights
					</CardTitle>
					<CardDescription>
						Basado en {responseCount} respuestas de tus compañeros
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div
						className="prose prose-sm dark:prose-invert max-w-none"
						dangerouslySetInnerHTML={{
							__html: summary
								.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
								.replace(/\n\n/g, "</p><p>")
								.replace(/^/, "<p>")
								.replace(/$/, "</p>"),
						}}
					/>
				</CardContent>
			</Card>

			{/* Insights Individuales */}
			<div className="grid gap-4 md:grid-cols-2">
				{insights.map((insight, index) => {
					const config = insightTypeConfig[insight.type];
					const Icon = config.icon;

					return (
						<Card key={`${insight.strengthKey}-${index}`}>
							<CardHeader className="pb-2">
								<div className="flex items-center justify-between">
									<Badge variant="outline" className={config.className}>
										<Icon className="h-3 w-3 mr-1" />
										{config.label}
									</Badge>
									<span className="text-xs text-muted-foreground">
										{Math.round(insight.confidence * 100)}% confianza
									</span>
								</div>
								<CardTitle className="text-base mt-2">
									{insight.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									{insight.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
