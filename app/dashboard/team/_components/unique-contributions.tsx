"use client";

import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StrengthBadge } from "@/app/_shared/components/strength-badge";
import { Sparkles, Users } from "lucide-react";

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
            className="border-2 transition-all hover:shadow-md"
            style={{
              borderColor: getDomainColor(item.strength.domain, "border"),
              backgroundColor: getDomainColor(item.strength.domain, "bg"),
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
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                        Fortaleza Única
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.memberName}</span>
                    </div>
                  </div>
                  <Sparkles
                    className="h-5 w-5 shrink-0"
                    style={{ color: getDomainColor(item.strength.domain) }}
                  />
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/80">
                  {item.strength.briefDefinition}
                </p>

                {/* Best Partners */}
                {item.strength.bestPartners &&
                  item.strength.bestPartners.length > 0 && (
                    <div className="pt-2 border-t">
                      <h4 className="font-semibold text-sm mb-2">
                        🤝 Mejores Compañeros:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {item.strength.bestPartners
                          .slice(0, 2)
                          .map((partner, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{partner}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                {/* Call to Action */}
                <div
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: getDomainColor(item.strength.domain, "border"),
                  }}
                >
                  <p className="text-sm">
                    <strong>💡 Cómo aprovechar:</strong> {item.memberName}{" "}
                    aporta una perspectiva única al equipo. Considera asignarle
                    tareas que requieran esta fortaleza específica para
                    maximizar el impacto.
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
