"use client";

import { Flame, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StreakCalendarProps {
  weekDays?: boolean[];
  onFreeze?: () => void;
  canFreeze?: boolean;
}

const dayLabels = ["L", "D", "M", "J", "V", "S", "D"];

export function StreakCalendar({
  weekDays = [true, true, true, true, true, true, false],
  onFreeze,
  canFreeze = true,
}: StreakCalendarProps) {
  return (
    <div className="rounded-2xl border border-blue-500/20 bg-linear-to-b from-slate-900/90 to-slate-800/90 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-center text-xl font-bold text-white">Rachas</h3>

      {/* Icono de Fuego */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-linear-to-b from-orange-500 to-red-600 p-6 shadow-2xl shadow-orange-500/50">
          <Flame className="h-16 w-16 fill-orange-200 text-orange-200" />
        </div>
      </div>

      <p className="mb-6 text-center text-lg font-semibold text-white">
        Rachas
      </p>

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
            className={`flex aspect-square items-center justify-center rounded-lg border-2 ${
              checked
                ? "border-blue-400 bg-blue-500/30"
                : "border-slate-700 bg-slate-800/50"
            }`}
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
