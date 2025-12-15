"use client";

import { Flame, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface StreakCalendarProps {
  weekDays?: boolean[];
  onFreeze?: () => void;
  canFreeze?: boolean;
  streakCount?: number;
}

const dayLabels = ["L", "D", "M", "J", "V", "S", "D"];

function getStreakTier(count: number): { color: string; name: string } {
  if (count >= 100)
    return { color: "from-rose-500 to-pink-600", name: "Mítico" };
  if (count >= 80)
    return { color: "from-indigo-400 to-blue-600", name: "Diamante" };
  if (count >= 60)
    return { color: "from-cyan-400 to-teal-600", name: "Platino" };
  if (count >= 50)
    return { color: "from-yellow-400 to-yellow-600", name: "Legendario" };
  if (count >= 30)
    return { color: "from-purple-500 to-purple-700", name: "Épico" };
  if (count >= 10) return { color: "from-blue-500 to-blue-700", name: "Raro" };
  return { color: "from-orange-500 to-red-600", name: "Común" };
}

export function StreakCalendar({
  weekDays = [true, true, true, true, true, true, false],
  onFreeze,
  canFreeze = true,
  streakCount = 0,
}: StreakCalendarProps) {
  const streakTier = getStreakTier(streakCount);

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-linear-to-b from-slate-900/90 to-slate-800/90 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-center text-xl font-bold text-white">Rachas</h3>

      {/* Icono de Fuego */}
      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            "rounded-full bg-linear-to-b p-6 shadow-2xl",
            streakTier.color,
            `shadow-${streakTier.color.split(" ")[0].replace("from-", "")}/50`
          )}
        >
          <Flame className="h-16 w-16 fill-orange-200 text-orange-200" />
        </div>
      </div>

      <p className="mb-2 text-center text-lg font-semibold text-white">
        Rachas
      </p>
      {streakCount >= 10 && (
        <p
          className={cn(
            "mb-4 text-center text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent",
            streakTier.color
          )}
        >
          {streakTier.name} - {streakCount} días
        </p>
      )}

      {/* Días de la semana */}
      <div className="mb-4 grid grid-cols-7 gap-2">
        {dayLabels.map((day, index) => (
          <div key={index} className="text-center text-sm text-slate-400">
            {day}
          </div>
        ))}
      </div>

      {/* Checkboxes de días */}
      <div className="mb-6 grid grid-cols-7 gap-2">
        {weekDays.map((checked, index) => (
          <div
            key={index}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border-2",
              checked
                ? "border-blue-400 bg-blue-500/30"
                : "border-slate-700 bg-slate-800/50"
            )}
          >
            {checked && (
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Botón Congelar Racha */}
      <Button
        onClick={onFreeze}
        disabled={!canFreeze}
        className="w-full rounded-xl border-2 border-cyan-400/30 bg-linear-to-r from-cyan-900/60 to-blue-900/60 py-6 text-base font-semibold text-white hover:from-cyan-800/60 hover:to-blue-800/60 disabled:opacity-50"
      >
        <Snowflake className="mr-2 h-5 w-5 fill-cyan-400 text-cyan-400" />
        Congelar Racha
      </Button>
    </div>
  );
}
