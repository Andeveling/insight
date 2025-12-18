/**
 * Insights Page
 *
 * Página para visualizar los insights generados a partir del feedback de pares
 * Requiere al menos 3 respuestas para generar insights
 */

import {
	AlertCircle,
	ArrowLeft,
	Clock,
	Gift,
	Sparkles,
	Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { FEEDBACK_XP_REWARDS } from "@/lib/constants/xp-rewards";
import { loadInsightsAction } from "../_actions/feedback-insights.actions";
import { InsightSummary } from "../_components/insight-summary";
import {
	type StrengthAdjustment,
	StrengthAdjustmentPreview,
} from "../_components/strength-adjustment-preview";

/**
 * Static shell with Suspense for dynamic content
 */
export default function InsightsPage() {
	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="mb-6">
				<Button variant="ghost" asChild>
					<Link href="/dashboard/feedback">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver al Feedback
					</Link>
				</Button>
			</div>

			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Tus Insights</h1>
				<p className="text-muted-foreground mt-2">
					Descubre cómo te perciben tus compañeros y ajusta tu perfil de
					fortalezas
				</p>
			</div>

			<Suspense fallback={<InsightsSkeleton />}>
				<InsightsPageContent />
			</Suspense>
		</div>
	);
}

/**
 * Dynamic content that accesses session and database
 */
async function InsightsPageContent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
		redirect("/login");
	}

	const result = await loadInsightsAction();

	if (!result.success) {
		return (
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						Error al cargar insights
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">{result.error}</p>
				</CardContent>
			</Card>
		);
	}

	const {
		hasEnoughResponses,
		responseCount,
		minRequired,
		insights,
		adjustments,
		xpBonusAwarded,
	} = result.data!;

	// No hay suficientes respuestas - show progress
	if (!hasEnoughResponses) {
		const progress = (responseCount / minRequired) * 100;

		return (
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
						<Users className="h-8 w-8 text-muted-foreground" />
					</div>
					<CardTitle>Aún no hay suficientes respuestas</CardTitle>
					<CardDescription className="text-base mt-2">
						Necesitas al menos {minRequired} respuestas para generar insights.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Progress toward insights threshold (T036) */}
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								Progreso hacia insights
							</span>
							<span className="font-medium">
								{responseCount} / {minRequired}
							</span>
						</div>
						<Progress value={progress} className="h-2" />
						<p className="text-xs text-muted-foreground text-center">
							{minRequired - responseCount} respuesta
							{minRequired - responseCount !== 1 ? "s" : ""} más para
							desbloquear
						</p>
					</div>

					{/* XP reward preview */}
					<div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
						<Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
						<span className="text-sm font-medium text-amber-700 dark:text-amber-300">
							+{FEEDBACK_XP_REWARDS.INSIGHTS_UNLOCKED} XP al desbloquear
							insights
						</span>
					</div>

					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Clock className="h-4 w-4" />
						<span>
							Los insights se generarán automáticamente cuando alcances el
							mínimo
						</span>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
						<Button asChild>
							<Link href="/dashboard/feedback/request">
								Solicitar más Feedback
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/dashboard/feedback">Ver estado de solicitudes</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Mapear adjustments al formato del componente
	const formattedAdjustments: StrengthAdjustment[] = adjustments.map((adj) => ({
		id: adj.id,
		strengthId: adj.strengthId,
		strengthName: adj.strength?.nameEs || adj.strength?.name || adj.strengthId,
		suggestedDelta: adj.suggestedDelta,
		supportingData: adj.supportingData,
		status: adj.status as "PENDING" | "ACCEPTED" | "REJECTED",
	}));

	return (
		<div className="space-y-8">
			{/* XP Bonus notification (T034/T035) - Only shown when first generating insights */}
			{xpBonusAwarded && xpBonusAwarded > 0 && (
				<Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10">
					<CardContent className="py-4">
						<div className="flex items-center justify-center gap-3">
							<div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-500/20">
								<Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
							</div>
							<div className="text-center">
								<p className="text-lg font-bold text-amber-700 dark:text-amber-300">
									¡+{xpBonusAwarded} XP Ganados!
								</p>
								<p className="text-sm text-muted-foreground">
									Bonus por desbloquear tus primeros insights
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Resumen de Insights */}
			{insights && (
				<InsightSummary
					summary={insights.summary}
					insights={insights.insights}
					responseCount={responseCount}
				/>
			)}

			{/* Ajustes Sugeridos */}
			{formattedAdjustments.length > 0 && (
				<StrengthAdjustmentPreview adjustments={formattedAdjustments} />
			)}

			{/* Sin insights ni ajustes */}
			{!insights && formattedAdjustments.length === 0 && (
				<Card>
					<CardHeader className="text-center">
						<CardTitle>No hay insights disponibles</CardTitle>
						<CardDescription>
							Aunque tienes suficientes respuestas, no se han podido generar
							insights. Esto puede ocurrir si las respuestas son muy similares o
							neutras.
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</div>
	);
}

function InsightsSkeleton() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-64 mt-2" />
				</CardHeader>
				<CardContent className="space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-4/6" />
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader className="pb-2">
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-5 w-32 mt-2" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4 mt-2" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
