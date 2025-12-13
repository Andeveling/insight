/**
 * Insights Page
 *
 * Página para visualizar los insights generados a partir del feedback de pares
 * Requiere al menos 3 respuestas para generar insights
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, AlertCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { loadInsightsAction } from "../_actions/feedback-insights.actions";
import { InsightSummary } from "../_components/insight-summary";
import {
  StrengthAdjustmentPreview,
  type StrengthAdjustment,
} from "../_components/strength-adjustment-preview";

export default async function InsightsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await loadInsightsAction();

  if (!result.success) {
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
      </div>
    );
  }

  const {
    hasEnoughResponses,
    responseCount,
    minRequired,
    insights,
    adjustments,
  } = result.data!;

  // No hay suficientes respuestas
  if (!hasEnoughResponses) {
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

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Aún no hay suficientes respuestas</CardTitle>
            <CardDescription className="text-base mt-2">
              Necesitas al menos {minRequired} respuestas para generar insights.
              <br />
              Actualmente tienes {responseCount} respuesta
              {responseCount !== 1 ? "s" : ""}.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
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
                <Link href="/dashboard/feedback">
                  Ver estado de solicitudes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
        <div className="space-y-8">
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
                  insights. Esto puede ocurrir si las respuestas son muy
                  similares o neutras.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </Suspense>
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
