import { Flame, Trophy, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import type { ProfileGamificationProgress } from "@/lib/types/profile-gamification-progress.types";
import type { ProfileAchievementsSummary } from "@/lib/types/profile-achievements-summary.types";

interface ProfileGamifiedHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  progress: ProfileGamificationProgress | null;
  achievements: ProfileAchievementsSummary | null;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
}

export function ProfileGamifiedHeader({
  user,
  progress,
  achievements,
}: ProfileGamifiedHeaderProps) {
  const initials = getInitials(user.name);

  const xpText = progress
    ? progress.nextLevelXpRequired > 0
      ? `${progress.currentLevelXp} / ${progress.nextLevelXpRequired} XP`
      : `${progress.currentLevelXp} XP (máximo)`
    : "Progreso no disponible";

  const progressValue = progress?.levelProgress ?? 0;

  return (
    <section
      aria-label="Resumen gamificado del perfil"
      className={cn(
        "relative overflow-hidden rounded-xl border",
        "bg-gamified-hero text-gamified-hero-foreground",
        "shadow-sm"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-linear-to-br from-gamified-gradient-from/15 to-gamified-gradient-to/15"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full",
          "bg-gamified-glow blur-3xl"
        )}
      />

      <div className="relative p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "h-14 w-14 rounded-full border",
                "bg-gamified-surface text-gamified-surface-foreground",
                "grid place-items-center font-semibold"
              )}
              aria-label={`Avatar de ${user.name}`}
            >
              {user.image ? (
                <span className="sr-only">{user.name}</span>
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-lg font-semibold leading-tight truncate">
                {user.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div
              className={cn(
                "rounded-lg border bg-gamified-surface/70",
                "px-4 py-3"
              )}
            >
              <p className="text-xs text-muted-foreground">Nivel</p>
              <p className="text-base font-semibold">
                {progress ? progress.currentLevel : "—"}
              </p>
            </div>

            <div
              className={cn(
                "rounded-lg border bg-gamified-surface/70",
                "px-4 py-3"
              )}
            >
              <p className="text-xs text-muted-foreground">Recompensas</p>
              <p className="flex items-center gap-1 text-base font-semibold">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {achievements ? achievements.unlockedCount : "—"}
              </p>
            </div>

            <div
              className={cn(
                "rounded-lg border bg-gamified-surface/70",
                "px-4 py-3"
              )}
            >
              <p className="text-xs text-muted-foreground">Racha</p>
              <p className="flex items-center gap-1 text-base font-semibold">
                <Flame className="h-4 w-4" aria-hidden="true" />
                {progress ? `${progress.currentStreak} días` : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2" aria-label="Progreso de experiencia">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Experiencia
            </p>
            <p className="text-sm text-muted-foreground" aria-label={xpText}>
              {xpText}
            </p>
          </div>

          <Progress
            value={progressValue}
            aria-label="Barra de progreso de XP"
          />
        </div>
      </div>
    </section>
  );
}
