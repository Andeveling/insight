"use client";

import { useMemo } from "react";
import type {
  DomainType,
  StrengthWithDomain,
  TeamMemberWithStrengths,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import {
  getDomainColor,
  getDomainMetadata,
} from "@/lib/constants/domain-colors";
import { groupStrengthsByDomain } from "@/lib/utils/strength-helpers";

interface TeamStrengthsGridProps {
  teamMembers: TeamMemberWithStrengths[];
  allStrengths?: StrengthWithDomain[];
  className?: string;
}

export function TeamStrengthsGrid({
  teamMembers,
  allStrengths,
  className,
}: TeamStrengthsGridProps) {
  // Get all unique strengths from team members, grouped by domain
  const strengthsByDomain = useMemo(() => {
    if (allStrengths) {
      return groupStrengthsByDomain(allStrengths);
    }

    const strengths = teamMembers.flatMap((member) =>
      member.strengths.map((s) => s.strength)
    );

    // Remove duplicates
    const uniqueStrengths = Array.from(
      new Map(strengths.map((s) => [s.id, s])).values()
    );

    return groupStrengthsByDomain(uniqueStrengths);
  }, [teamMembers, allStrengths]);

  // Get ordered list of all strengths for columns
  const orderedStrengths = useMemo(() => {
    const domains: DomainType[] = [
      "Doing",
      "Feeling",
      "Motivating",
      "Thinking",
    ];
    return domains.flatMap((domain) => strengthsByDomain[domain]);
  }, [strengthsByDomain]);

  // Check if a member has a specific strength
  const hasMemberStrength = (memberId: string, strengthId: string): boolean => {
    const member = teamMembers.find((m) => m.id === memberId);
    return member?.strengths.some((s) => s.strength.id === strengthId) ?? false;
  };

  // Get member's rank for a strength (1-5)
  const getMemberStrengthRank = (
    memberId: string,
    strengthId: string
  ): number | null => {
    const member = teamMembers.find((m) => m.id === memberId);
    const userStrength = member?.strengths.find(
      (s) => s.strength.id === strengthId
    );
    return userStrength?.rank ?? null;
  };

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">
          Matriz de Fortalezas del Equipo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualiza cómo los miembros del equipo se complementan entre sí
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header Row - Domain Groups */}
            <div className="flex border-b bg-muted/50">
              <div className="sticky left-0 z-20 w-48 bg-muted/50 border-r p-3 font-semibold">
                Miembro
              </div>
              {(
                ["Doing", "Feeling", "Motivating", "Thinking"] as DomainType[]
              ).map((domain) => {
                const count = strengthsByDomain[domain].length;
                if (count === 0) return null;

                return (
                  <div
                    key={domain}
                    className="flex items-center justify-center px-4 py-2 font-semibold text-sm"
                    style={{
                      width: `${count * 40}px`,
                      backgroundColor: getDomainColor(domain, "bg"),
                      borderLeft: `3px solid ${getDomainColor(domain)}`,
                    }}
                  >
                    {getDomainMetadata(domain).nameEs}
                  </div>
                );
              })}
            </div>

            {/* Strength Names Row */}
            <div className="flex border-b bg-background sticky top-0 z-10">
              <div className="sticky left-0 z-20 w-48 bg-background border-r shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]" />
              {orderedStrengths.map((strength) => (
                <TooltipProvider key={strength.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-end justify-center border-l cursor-help transition-colors hover:bg-black/5 py-3"
                        style={{
                          width: "40px",
                          height: "180px",
                          backgroundColor: getDomainColor(
                            strength.domain,
                            "bg"
                          ),
                        }}
                      >
                        <div
                          className="text-xs font-medium whitespace-nowrap"
                          style={{
                            color: getDomainColor(strength.domain, "dark"),
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {strength.nameEs}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold">{strength.nameEs}</p>
                        <p className="text-xs text-muted-foreground">
                          {strength.name}
                        </p>
                        <p className="text-sm">{strength.briefDefinition}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Member Rows */}
            {teamMembers.map((member, idx) => (
              <div
                key={member.id}
                className={cn(
                  "flex hover:bg-muted/30 transition-colors",
                  idx % 2 === 0 ? "bg-background" : "bg-muted/10"
                )}
              >
                {/* Member Name */}
                <div className="sticky left-0 z-10 w-48 bg-inherit border-r p-3 flex items-center gap-2 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Strength Dots */}
                {orderedStrengths.map((strength) => {
                  const hasStrength = hasMemberStrength(member.id, strength.id);
                  const rank = getMemberStrengthRank(member.id, strength.id);

                  return (
                    <div
                      key={strength.id}
                      className="flex items-center justify-center border-l"
                      style={{ width: "40px", height: "56px" }}
                    >
                      {hasStrength && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="h-3 w-3 rounded-full cursor-pointer hover:scale-125 transition-transform"
                                style={{
                                  backgroundColor: getDomainColor(
                                    strength.domain
                                  ),
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p className="font-semibold">
                                  {strength.nameEs}
                                </p>
                                <p className="text-xs">
                                  Ranking: #{rank} de {member.name}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t p-4 bg-muted/20">
          <p className="text-xs font-semibold mb-2">Dominios:</p>
          <div className="flex flex-wrap gap-3">
            {(
              ["Doing", "Feeling", "Motivating", "Thinking"] as DomainType[]
            ).map((domain) => (
              <div key={domain} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: getDomainColor(domain) }}
                />
                <span className="text-xs">
                  {getDomainMetadata(domain).nameEs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
