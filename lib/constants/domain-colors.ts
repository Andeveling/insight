import type { DomainType } from "@/lib/types";

/**
 * Color system for the 4 strength domains
 * Based on HIGH5 design references
 */
export const DOMAIN_COLORS = {
  Doing: {
    primary: "hsl(340, 82%, 52%)", // Pink/Red
    light: "hsl(340, 82%, 92%)",
    dark: "hsl(340, 82%, 32%)",
    border: "hsl(340, 82%, 72%)",
    bg: "hsl(340, 82%, 97%)",
    tailwind: "pink-600",
  },
  Feeling: {
    primary: "hsl(45, 100%, 51%)", // Yellow
    light: "hsl(45, 100%, 92%)",
    dark: "hsl(45, 100%, 31%)",
    border: "hsl(45, 100%, 71%)",
    bg: "hsl(45, 100%, 97%)",
    tailwind: "yellow-500",
  },
  Motivating: {
    primary: "hsl(122, 39%, 49%)", // Green
    light: "hsl(122, 39%, 92%)",
    dark: "hsl(122, 39%, 29%)",
    border: "hsl(122, 39%, 69%)",
    bg: "hsl(122, 39%, 97%)",
    tailwind: "green-500",
  },
  Thinking: {
    primary: "hsl(207, 90%, 54%)", // Blue
    light: "hsl(207, 90%, 92%)",
    dark: "hsl(207, 90%, 34%)",
    border: "hsl(207, 90%, 74%)",
    bg: "hsl(207, 90%, 97%)",
    tailwind: "blue-500",
  },
} as const;

/**
 * Get color for a domain
 */
export function getDomainColor(
  domain: DomainType,
  variant: "primary" | "light" | "dark" | "border" | "bg" = "primary"
): string {
  return DOMAIN_COLORS[ domain ][ variant ];
}

/**
 * Get Tailwind class for a domain
 */
export function getDomainTailwindClass(domain: DomainType): string {
  return DOMAIN_COLORS[ domain ].tailwind;
}

/**
 * Domain metadata
 */
export const DOMAIN_METADATA = {
  Doing: {
    nameEs: "Hacer",
    metaphor: "El Motor del Equipo",
    keyQuestion: "¿Cómo lo hacemos realidad?",
    icon: "⚡",
  },
  Feeling: {
    nameEs: "Sentir",
    metaphor: "El Corazón del Equipo",
    keyQuestion: "¿Cómo nos cuidamos y conectamos?",
    icon: "❤️",
  },
  Motivating: {
    nameEs: "Motivar",
    metaphor: "La Chispa y el Timón",
    keyQuestion: "¿Cómo inspiramos la acción y lideramos el camino?",
    icon: "🚀",
  },
  Thinking: {
    nameEs: "Pensar",
    metaphor: "El Arquitecto y el Navegante",
    keyQuestion: "¿Cuál es el mejor plan y por qué?",
    icon: "🧠",
  },
} as const;

/**
 * Get domain metadata
 */
export function getDomainMetadata(domain: DomainType) {
  return DOMAIN_METADATA[ domain ];
}

/**
 * Get button variant classes for a domain
 * Returns classes for background, text, border and hover states
 */
export function getDomainButtonClasses(domain: DomainType): string {
  const colorMap = {
    Doing: "bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-pink-400",
    Feeling: "bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-yellow-400",
    Motivating: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-400",
    Thinking: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-400",
  };
  return colorMap[ domain ];
}
