import type { DomainType, TeamAnalytics } from "@/app/_shared/types/strength.types";

/**
 * Culture Calculation Algorithm
 *
 * Mathematical Model:
 * 1. Calculate Domain Scores from team member strengths
 * 2. Calculate Focus Scores by summing contributing domains
 * 3. Determine dominant Culture from focus combination
 *
 * Focus Score Formulas:
 * - Action = Doing% + Motivating%
 * - Reflection = Thinking% + Feeling%
 * - Results = Doing% + Thinking%
 * - People = Motivating% + Feeling%
 *
 * Culture Matrix:
 *                    Results         People
 *           ┌────────────────┬────────────────┐
 *   Action  │   Execution    │   Influence    │
 *           ├────────────────┼────────────────┤
 * Reflection│   Strategy     │   Cohesion     │
 *           └────────────────┴────────────────┘
 */

export type FocusType = "Action" | "Reflection" | "Results" | "People";
export type CultureType = "Execution" | "Influence" | "Strategy" | "Cohesion";

/**
 * Map culture to corresponding domain for color reference
 */
const CULTURE_TO_DOMAIN_MAP: Record<CultureType, string> = {
  Execution: "Doing",
  Influence: "Motivating",
  Strategy: "Thinking",
  Cohesion: "Feeling",
};

export interface FocusScores {
  action: number;
  reflection: number;
  results: number;
  people: number;
}

export interface CultureAnalysis {
  dominantCulture: CultureType;
  cultureNameEs: string;
  focusScores: FocusScores;
  dominantEnergy: FocusType;
  dominantOrientation: FocusType;
  confidence: number; // 0-1, how dominant is the culture vs others
  secondaryCulture: CultureType | null;
  coordinates: {
    x: number; // -100 (Results) to +100 (People)
    y: number; // -100 (Reflection) to +100 (Action)
  };
}

/**
 * Culture matrix based on focus combinations
 */
const CULTURE_MATRIX: Record<FocusType, Record<FocusType, CultureType>> = {
  Action: {
    Action: "Execution", // Not used
    Reflection: "Execution", // Not used
    Results: "Execution",
    People: "Influence",
  },
  Reflection: {
    Action: "Strategy", // Not used
    Reflection: "Cohesion", // Not used
    Results: "Strategy",
    People: "Cohesion",
  },
  Results: {
    Action: "Execution",
    Reflection: "Strategy",
    Results: "Execution", // Not used
    People: "Execution", // Not used
  },
  People: {
    Action: "Influence",
    Reflection: "Cohesion",
    Results: "Influence", // Not used
    People: "Cohesion", // Not used
  },
};

const CULTURE_NAMES_ES: Record<CultureType, string> = {
  Execution: "Ejecución",
  Influence: "Influencia",
  Strategy: "Estrategia",
  Cohesion: "Cohesión",
};

/**
 * Calculate Focus Scores from Domain Distribution
 */
export function calculateFocusScores(
  domainDistribution: TeamAnalytics[ "domainDistribution" ]
): FocusScores {
  const getDomainPercentage = (domain: DomainType): number => {
    return domainDistribution.find((d) => d.domain === domain)?.percentage ?? 0;
  };

  const doing = getDomainPercentage("Doing");
  const motivating = getDomainPercentage("Motivating");
  const thinking = getDomainPercentage("Thinking");
  const feeling = getDomainPercentage("Feeling");

  return {
    action: doing + motivating,
    reflection: thinking + feeling,
    results: doing + thinking,
    people: motivating + feeling,
  };
}

/**
 * Determine the dominant culture based on focus scores
 */
export function determineCulture(focusScores: FocusScores): CultureAnalysis {
  const { action, reflection, results, people } = focusScores;

  // Determine dominant focuses
  const dominantEnergy: FocusType = action >= reflection ? "Action" : "Reflection";
  const dominantOrientation: FocusType = results >= people ? "Results" : "People";

  // Get the dominant culture from the matrix
  const dominantCulture = CULTURE_MATRIX[ dominantEnergy ][ dominantOrientation ];

  // Calculate confidence (how close are the competing cultures)
  const energyDiff = Math.abs(action - reflection);
  const orientationDiff = Math.abs(results - people);
  const maxPossibleDiff = 200; // Maximum difference possible (100% vs 0%)
  const avgDiff = (energyDiff + orientationDiff) / 2;
  const confidence = avgDiff / maxPossibleDiff;

  // Determine secondary culture (if confidence is low)
  let secondaryCulture: CultureType | null = null;
  if (confidence < 0.3) {
    // Find the second most likely culture
    const secondEnergy: FocusType = dominantEnergy === "Action" ? "Reflection" : "Action";
    const secondOrientation: FocusType = dominantOrientation === "Results" ? "People" : "Results";

    // The secondary is the culture with the next closest axis
    if (energyDiff < orientationDiff) {
      secondaryCulture = CULTURE_MATRIX[ secondEnergy ][ dominantOrientation ];
    } else {
      secondaryCulture = CULTURE_MATRIX[ dominantEnergy ][ secondOrientation ];
    }
  }

  // Calculate coordinates for visualization
  // X: -100 (pure Results) to +100 (pure People)
  // Y: -100 (pure Reflection) to +100 (pure Action)
  const x = people - results; // Range: -200 to +200, normalized below
  const y = action - reflection;

  return {
    dominantCulture,
    cultureNameEs: CULTURE_NAMES_ES[ dominantCulture ],
    focusScores,
    dominantEnergy,
    dominantOrientation,
    confidence,
    secondaryCulture,
    coordinates: {
      x: (x / 200) * 100, // Normalize to -100 to +100
      y: (y / 200) * 100,
    },
  };
}

/**
 * Full culture analysis from team analytics
 */
export function analyzeTeamCulture(analytics: TeamAnalytics): CultureAnalysis {
  const focusScores = calculateFocusScores(analytics.domainDistribution);
  return determineCulture(focusScores);
}

/**
 * Get the domain associated with a culture (for color reference)
 */
export function getCultureDomain(culture: CultureType): string {
  return CULTURE_TO_DOMAIN_MAP[ culture ];
}

/**
 * Get culture metadata (icon, color, description)
 */
export function getCultureMetadata(culture: CultureType) {
  const metadata: Record<
    CultureType,
    {
      icon: string;
      color: string;
      subtitle: string;
      focusLabel: string;
    }
  > = {
    Execution: {
      icon: "🚀",
      color: "red",
      subtitle: "El Motor de Rendimiento",
      focusLabel: "Acción + Resultados",
    },
    Influence: {
      icon: "✨",
      color: "yellow",
      subtitle: "El Catalizador de Energía",
      focusLabel: "Acción + Personas",
    },
    Strategy: {
      icon: "🧠",
      color: "blue",
      subtitle: "La Arquitectura de la Razón",
      focusLabel: "Reflexión + Resultados",
    },
    Cohesion: {
      icon: "💚",
      color: "green",
      subtitle: "El Tejido Humano",
      focusLabel: "Reflexión + Personas",
    },
  };

  return metadata[ culture ];
}
