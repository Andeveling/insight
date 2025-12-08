import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea fecha de forma consistente para evitar hydration mismatch */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Calcula días restantes para poder regenerar (política de 30 días) */
export function getDaysUntilRegenerate(createdAt: Date | string): number {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsed = now - created;
  const remaining = THIRTY_DAYS_MS - elapsed;
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}
