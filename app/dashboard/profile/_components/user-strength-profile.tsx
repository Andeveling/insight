"use client";

import { useMemo } from "react";
import type { DomainType, TeamMemberWithStrengths } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  getDomainColor,
  getDomainMetadata,
} from "@/lib/constants/domain-colors";
import { DomainIndicator } from "@/app/_shared/components/domain-indicator";
import { StrengthDetailCard } from "@/app/_shared/components/strength-detail-card";

interface UserStrengthProfileProps {
  user: TeamMemberWithStrengths;
  className?: string;
}

export function UserStrengthProfile({
  user,
  className,
}: UserStrengthProfileProps) {
  // Sort strengths by rank
  const sortedStrengths = useMemo(() => {
    return [...user.strengths].sort((a, b) => a.rank - b.rank);
  }, [user.strengths]);

  // Calculate domain distribution
  const domainDistribution = useMemo(() => {
    const counts: Record<DomainType, number> = {
      Doing: 0,
      Feeling: 0,
      Motivating: 0,
      Thinking: 0,
    };

    user.strengths.forEach((s) => {
      counts[s.strength.domain]++;
    });

    return Object.entries(counts)
      .map(([domain, count]) => ({
        domain: domain as DomainType,
        count,
        percentage: (count / user.strengths.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [user.strengths]);

  const primaryDomain = domainDistribution[0];

  return (
    <div className={cn("space-y-6", className)}>
      {/* User Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">
                Fortalezas y Dominios
              </CardTitle>

              {/* Primary Domain */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Dominio Principal:</span>
                <DomainIndicator
                  domain={primaryDomain.domain}
                  showIcon
                  showName
                />
                <span className="text-sm text-muted-foreground">
                  ({primaryDomain.count} de {user.strengths.length} fortalezas)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Domain Distribution */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Distribución por Dominio:</h4>
            <div className="space-y-2">
              {domainDistribution.map(({ domain, count, percentage }) => (
                <div key={domain} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DomainIndicator
                        domain={domain}
                        variant="dot"
                        showName
                        size="sm"
                      />
                    </div>
                    <span className="font-medium">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getDomainColor(domain),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Strengths */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">Mis Top 5 Fortalezas</h3>
          <p className="text-sm text-muted-foreground">
            Estas son tus fortalezas principales según el test HIGH5
          </p>
        </div>

        {sortedStrengths.map((userStrength) => (
          <StrengthDetailCard
            key={userStrength.strength.id}
            strength={userStrength.strength}
            rank={userStrength.rank}
          />
        ))}
      </div>

      {/* Summary Card */}
      <Card
        className="border-2"
        style={{
          borderColor: getDomainColor(primaryDomain.domain, "border"),
          backgroundColor: getDomainColor(primaryDomain.domain, "bg"),
        }}
      >
        <CardContent className="p-6">
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>{getDomainMetadata(primaryDomain.domain).icon}</span>
            Tu Perfil de Fortalezas
          </h4>
          <p className="text-sm leading-relaxed">
            Con un enfoque principal en{" "}
            <strong>{getDomainMetadata(primaryDomain.domain).nameEs}</strong>,
            tu estilo natural de trabajo se centra en{" "}
            <em>{getDomainMetadata(primaryDomain.domain).keyQuestion}</em>
          </p>
          <p className="text-sm leading-relaxed mt-2">
            Tus fortalezas te posicionan como{" "}
            <strong>{getDomainMetadata(primaryDomain.domain).metaphor}</strong>{" "}
            del equipo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
