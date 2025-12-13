/**
 * Focus Data - The two axes of the HIGH5 Culture Model
 *
 * The culture model is built on two axes:
 * 1. Energy Axis: Action ↔ Reflection
 * 2. Orientation Axis: Results ↔ People
 *
 * Each Domain contributes to one focus per axis:
 * - Doing: Action + Results
 * - Motivating: Action + People
 * - Thinking: Reflection + Results
 * - Feeling: Reflection + People
 */

export interface FocusData {
  name: string;
  nameEs: string;
  axis: "energy" | "orientation";
  description: string;
  icon: string;
}

export const focusData: FocusData[] = [
  {
    name: "Action",
    nameEs: "Acción",
    axis: "energy",
    description:
      "Orientación hacia la ejecución inmediata, la toma de decisiones rápida y el movimiento constante. Favorece 'hacer' sobre 'planificar'.",
    icon: "⚡",
  },
  {
    name: "Reflection",
    nameEs: "Reflexión",
    axis: "energy",
    description:
      "Orientación hacia el análisis profundo, la planificación cuidadosa y la consideración antes de actuar. Favorece 'pensar' sobre 'reaccionar'.",
    icon: "🔍",
  },
  {
    name: "Results",
    nameEs: "Resultados",
    axis: "orientation",
    description:
      "Enfoque en los objetivos, las métricas, la eficiencia y los entregables tangibles. Prioriza el 'qué' se logra.",
    icon: "🎯",
  },
  {
    name: "People",
    nameEs: "Personas",
    axis: "orientation",
    description:
      "Enfoque en las relaciones, el bienestar del equipo, la colaboración y el impacto humano. Prioriza el 'quién' y el 'cómo nos sentimos'.",
    icon: "👥",
  },
];

/**
 * Domain to Focus Mapping
 * Each domain contributes to exactly 2 focuses (one per axis)
 *
 * Mathematical Model:
 * - Domain Score = Sum of member strengths in that domain
 * - Focus Score = Sum of contributing domain scores
 * - Culture = Intersection of dominant Energy Focus + dominant Orientation Focus
 */
export const domainFocusMapping: Record<
  string,
  { energy: string; orientation: string }
> = {
  Doing: { energy: "Action", orientation: "Results" },
  Motivating: { energy: "Action", orientation: "People" },
  Thinking: { energy: "Reflection", orientation: "Results" },
  Feeling: { energy: "Reflection", orientation: "People" },
};

export default focusData;
