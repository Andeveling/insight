/**
 * Strength Adjustment Preview Component
 *
 * Muestra las sugerencias de ajuste basadas en feedback de pares
 * Permite aceptar o rechazar cada ajuste sugerido
 */

"use client";

import { useState } from "react";
import { Check, X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  acceptAdjustmentAction,
  rejectAdjustmentAction,
} from "../_actions/feedback-insights.actions";
import { toast } from "sonner";

/**
 * Datos de soporte parseados del JSON
 */
interface SupportingDataParsed {
  peerScore?: number;
  confidence?: number;
  reason?: string;
}

export interface StrengthAdjustment {
  id: string;
  strengthId: string;
  strengthName: string;
  suggestedDelta: number;
  supportingData: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

interface StrengthAdjustmentPreviewProps {
  adjustments: StrengthAdjustment[];
  onAdjustmentUpdated?: () => void;
}

export function StrengthAdjustmentPreview({
  adjustments,
  onAdjustmentUpdated,
}: StrengthAdjustmentPreviewProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [localAdjustments, setLocalAdjustments] = useState(adjustments);

  const pendingAdjustments = localAdjustments.filter(
    (a) => a.status === "PENDING"
  );
  const processedAdjustments = localAdjustments.filter(
    (a) => a.status !== "PENDING"
  );

  /**
   * Parsea los datos de soporte JSON de forma segura
   */
  function parseSupportingData(data: string): SupportingDataParsed {
    try {
      return JSON.parse(data) as SupportingDataParsed;
    } catch {
      return {};
    }
  }

  async function handleAccept(adjustmentId: string) {
    setProcessingId(adjustmentId);
    try {
      const result = await acceptAdjustmentAction(adjustmentId);
      if (result.success) {
        setLocalAdjustments((prev) =>
          prev.map((a) =>
            a.id === adjustmentId ? { ...a, status: "ACCEPTED" as const } : a
          )
        );
        toast.success("Ajuste aceptado", {
          description: "Tu perfil de fortalezas ha sido actualizado",
        });
        onAdjustmentUpdated?.();
      } else {
        toast.error("Error al aceptar ajuste", {
          description: result.error || "Por favor intenta de nuevo",
        });
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(adjustmentId: string) {
    setProcessingId(adjustmentId);
    try {
      const result = await rejectAdjustmentAction(adjustmentId);
      if (result.success) {
        setLocalAdjustments((prev) =>
          prev.map((a) =>
            a.id === adjustmentId ? { ...a, status: "REJECTED" as const } : a
          )
        );
        toast.info("Ajuste rechazado", {
          description: "El ajuste ha sido descartado",
        });
        onAdjustmentUpdated?.();
      } else {
        toast.error("Error al rechazar ajuste", {
          description: result.error || "Por favor intenta de nuevo",
        });
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setProcessingId(null);
    }
  }

  /**
   * Icono según la dirección del delta sugerido
   */
  function getDeltaIcon(delta: number) {
    if (delta > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    if (delta < 0) {
      return <TrendingDown className="h-4 w-4 text-amber-500" />;
    }
    return null;
  }

  /**
   * Formatea el delta como texto descriptivo
   */
  function formatDelta(delta: number): string {
    if (delta > 0.5) return "Muy alto según tus pares";
    if (delta > 0.2) return "Alto según tus pares";
    if (delta > 0) return "Ligeramente alto según tus pares";
    if (delta < -0.5) return "Muy bajo según tus pares";
    if (delta < -0.2) return "Bajo según tus pares";
    if (delta < 0) return "Ligeramente bajo según tus pares";
    return "Sin cambio sugerido";
  }

  if (localAdjustments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Ajustes Pendientes */}
      {pendingAdjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ajustes Sugeridos</CardTitle>
            <CardDescription>
              Basado en el feedback de tus compañeros, te sugerimos estos
              cambios en tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAdjustments.map((adjustment) => {
              const supporting = parseSupportingData(adjustment.supportingData);

              return (
                <div
                  key={adjustment.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    processingId === adjustment.id && "opacity-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getDeltaIcon(adjustment.suggestedDelta)}
                        <span className="font-medium">
                          {adjustment.strengthName}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {formatDelta(adjustment.suggestedDelta)}
                      </p>

                      {supporting.reason && (
                        <p className="text-sm text-muted-foreground italic">
                          &ldquo;{supporting.reason}&rdquo;
                        </p>
                      )}

                      {supporting.confidence !== undefined && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Confianza: {Math.round(supporting.confidence * 100)}
                            %
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(adjustment.id)}
                        disabled={processingId !== null}
                      >
                        {processingId === adjustment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span className="sr-only">Rechazar</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(adjustment.id)}
                        disabled={processingId !== null}
                      >
                        {processingId === adjustment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">Aceptar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Ajustes Procesados */}
      {processedAdjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Decisiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {processedAdjustments.map((adjustment) => (
              <div
                key={adjustment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{adjustment.strengthName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDelta(adjustment.suggestedDelta)}
                  </span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    adjustment.status === "ACCEPTED" &&
                      "bg-green-100 text-green-800",
                    adjustment.status === "REJECTED" &&
                      "bg-gray-100 text-gray-800"
                  )}
                >
                  {adjustment.status === "ACCEPTED" ? "Aceptado" : "Rechazado"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
