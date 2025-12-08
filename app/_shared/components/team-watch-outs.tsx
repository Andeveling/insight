"use client";

import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/app/_shared/types/strength.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StrengthBadge } from "./strength-badge";
import { AlertTriangle, TrendingUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TeamWatchOutsProps {
  analytics: TeamAnalytics;
  className?: string;
}

export function TeamWatchOuts({ analytics, className }: TeamWatchOutsProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (strengthId: string) => {
    const newSet = new Set(openItems);
    if (newSet.has(strengthId)) {
      newSet.delete(strengthId);
    } else {
      newSet.add(strengthId);
    }
    setOpenItems(newSet);
  };

  if (analytics.overusedStrengths.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Puntos de Atención del Equipo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Fortalezas que podrían crear puntos ciegos si se sobreutilizan
          </p>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>¡Excelente balance!</AlertTitle>
            <AlertDescription>
              Tu equipo tiene una buena distribución de fortalezas. No hay
              fortalezas sobreutilizadas que puedan crear puntos ciegos.
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
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          Puntos de Atención del Equipo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Identifica riesgos potenciales antes de que impacten el rendimiento
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {analytics.overusedStrengths.map((item) => {
          const isOpen = openItems.has(item.strength.id);
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
            },
            medium: {
              bg: "bg-yellow-50 dark:bg-yellow-950/20",
              border: "border-yellow-200 dark:border-yellow-800",
              text: "text-yellow-700 dark:text-yellow-400",
            },
            low: {
              bg: "bg-blue-50 dark:bg-blue-950/20",
              border: "border-blue-200 dark:border-blue-800",
              text: "text-blue-700 dark:text-blue-400",
            },
          };

          const colors = riskColors[riskLevel];

          return (
            <Collapsible
              key={item.strength.id}
              open={isOpen}
              onOpenChange={() => toggleItem(item.strength.id)}
            >
              <Card
                className={cn(
                  "border-2 transition-all",
                  colors.bg,
                  colors.border
                )}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full p-4 h-auto hover:bg-transparent"
                  >
                    <div className="flex items-start justify-between w-full gap-4">
                      <div className="flex-1 text-left space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StrengthBadge
                            name={item.strength.name}
                            nameEs={item.strength.nameEs}
                            domain={item.strength.domain}
                            showTooltip={false}
                          />
                          <span className={cn("text-sm font-semibold", colors.text)}>
                            {item.count} de {analytics.totalMembers} miembros (
                            {item.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.strength.briefDefinition}
                        </p>
                      </div>
                      <AlertTriangle
                        className={cn("h-5 w-5 flex-shrink-0", colors.text)}
                      />
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t pt-3">
                    {item.strength.watchOuts &&
                      item.strength.watchOuts.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            ⚠️ Puntos de Atención:
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {item.strength.watchOuts.map((watchOut, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-muted-foreground">•</span>
                                <span>{watchOut}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: getDomainColor(
                          item.strength.domain,
                          "bg"
                        ),
                      }}
                    >
                      <p className="text-sm">
                        <strong>Recomendación:</strong> Con{" "}
                        {item.percentage.toFixed(0)}% del equipo compartiendo esta
                        fortaleza, asegúrate de que el equipo no descuide las
                        perspectivas de otros dominios. Busca equilibrio con
                        fortalezas complementarias.
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}
