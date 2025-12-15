import Link from "next/link";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ProfileAchievementsSummary } from "@/lib/types/profile-achievements-summary.types";

interface ProfileAchievementsCardProps {
  summary: ProfileAchievementsSummary | null;
  className?: string;
}

function isLikelyEmojiOrShortIcon(icon: string): boolean {
  if (!icon) return false;

  const trimmed = icon.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return false;
  }

  if (trimmed.startsWith("/")) {
    return false;
  }

  return trimmed.length <= 6;
}

export function ProfileAchievementsCard({
  summary,
  className,
}: ProfileAchievementsCardProps) {
  const unlockedCount = summary?.unlockedCount ?? 0;
  const totalCount = summary?.totalCount ?? 0;
  const recent = summary?.recent ?? [];

  return (
    <Card className={cn("border bg-gamified-surface", className)}>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5" aria-hidden="true" />
              Recompensas
            </CardTitle>
            <CardDescription>
              Tus insignias desbloqueadas recientemente y el progreso general.
            </CardDescription>
          </div>

          <Badge
            variant="secondary"
            className="w-fit bg-gamified-hero/70 border border-gamified-border"
          >
            {unlockedCount} / {totalCount}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recent.length > 0 ? (
          <ul className="space-y-3">
            {recent.map((a) => (
              <li
                key={a.badgeId}
                className={cn("flex gap-3 rounded-lg border p-3", "bg-card/70")}
              >
                <div
                  className={cn(
                    "h-10 w-10 shrink-0 rounded-full border",
                    "bg-gamified-hero/60 border-gamified-border",
                    "grid place-items-center"
                  )}
                  aria-hidden="true"
                >
                  {isLikelyEmojiOrShortIcon(a.icon) ? a.icon : "🏅"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold truncate">{a.nameEs}</p>
                    <Badge variant="outline" className="border-gamified-border">
                      {a.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {a.descriptionEs}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className={cn(
              "rounded-lg border p-4",
              "bg-gamified-hero/50 border-gamified-border"
            )}
          >
            <p className="font-semibold">Tu primera insignia está a un paso</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa evaluaciones, comparte feedback o avanza en tus rutas de
              desarrollo. Cada acción suma.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button asChild variant="secondary">
            <Link href="/dashboard/development/badges">Ver todo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
