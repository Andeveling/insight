/**
 * Feedback History Page
 *
 * Página para ver el historial de ciclos de feedback y tendencias
 * User Story 4: Track Feedback History
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, History, AlertCircle } from "lucide-react";
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
import { loadFeedbackHistoryAction } from "../_actions/feedback-history.actions";
import { HistoryContent } from "./history-content";

export const metadata = {
  title: "Historial de Feedback | Insight",
  description:
    "Visualiza tu historial de feedback y las tendencias de tus fortalezas",
};

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await loadFeedbackHistoryAction();

  if (!result.success) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
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
              Error al cargar historial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { cycles, trends, adjustmentHistory } = result.data!;

  // No hay historial aún
  if (cycles.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Sin historial de feedback</CardTitle>
            <CardDescription>
              Aún no tienes ciclos de feedback completados. Cuando recibas
              feedback de tus compañeros, podrás ver tu historial aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard/feedback/request">Solicitar Feedback</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/feedback">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Feedback
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Historial de Feedback</h1>
        <p className="text-muted-foreground">
          Visualiza cómo ha evolucionado la percepción de tus fortalezas a lo
          largo del tiempo
        </p>
      </div>

      <Suspense fallback={<HistoryContentSkeleton />}>
        <HistoryContent
          cycles={cycles}
          trends={trends}
          adjustmentHistory={adjustmentHistory}
          userName={session.user.name || "Usuario"}
        />
      </Suspense>
    </div>
  );
}

/**
 * Skeleton para la carga del contenido del historial
 */
function HistoryContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
