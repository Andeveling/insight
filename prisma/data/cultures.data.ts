/**
 * Team Cultures Data - Emergent from Focus Combinations
 *
 * Culture Matrix:
 *                    Results              People
 *           ┌─────────────────────┬─────────────────────┐
 *   Action  │     EXECUTION       │     INFLUENCE       │
 *           │   (Doing Culture)   │ (Motivating Culture)│
 *           ├─────────────────────┼─────────────────────┤
 * Reflection│     STRATEGY        │     COHESION        │
 *           │ (Thinking Culture)  │  (Feeling Culture)  │
 *           └─────────────────────┴─────────────────────┘
 *
 * Formula:
 * - Culture = f(Energy Focus, Orientation Focus)
 * - Energy Focus = max(Action Score, Reflection Score)
 * - Orientation Focus = max(Results Score, People Score)
 * - Action Score = Doing% + Motivating%
 * - Reflection Score = Thinking% + Feeling%
 * - Results Score = Doing% + Thinking%
 * - People Score = Motivating% + Feeling%
 */

export interface CultureData {
  name: string;
  nameEs: string;
  subtitle: string;
  description: string;
  focusEnergy: string; // "Action" or "Reflection"
  focusOrientation: string; // "Results" or "People"
  attributes: string[];
  icon: string;
  color: string;
}

export const culturesData: CultureData[] = [
  {
    name: "Execution",
    nameEs: "Ejecución",
    subtitle: "El Motor de Rendimiento",
    description:
      "Un entorno pragmático y acelerado donde el valor se mide por lo que se entrega. Aquí, la planificación excesiva se ve como un obstáculo; se prioriza el 'bias for action', la resolución pragmática de problemas y la capacidad de cerrar ciclos rápidamente. Es una cultura de alto rendimiento obsesionada con la eficiencia y el logro tangible.",
    focusEnergy: "Action",
    focusOrientation: "Results",
    attributes: [
      "Obsesión por la eficiencia y el cumplimiento de KPIs.",
      "Comunicación directa, breve y orientada a tareas.",
      "Mentalidad de 'Done is better than perfect'.",
      "Alta autonomía operativa y responsabilidad individual.",
    ],
    icon: "🚀",
    color: "red",
  },
  {
    name: "Influence",
    nameEs: "Influencia",
    subtitle: "El Catalizador de Energía",
    description:
      "Un ecosistema vibrante impulsado por la visión y el carisma. En esta cultura, el éxito depende de la capacidad de vender ideas, movilizar voluntades y mantener la moral alta. Se valora a quienes pueden contar historias convincentes (storytelling) y conectar el propósito de la organización con las aspiraciones individuales de las personas.",
    focusEnergy: "Action",
    focusOrientation: "People",
    attributes: [
      "Énfasis en la inspiración, el optimismo y la persuasión.",
      "Valoración de la agilidad social y las redes de contacto.",
      "Toma de decisiones impulsada por el entusiasmo del equipo.",
      "Ambiente dinámico, expresivo y promotor del cambio.",
    ],
    icon: "✨",
    color: "yellow",
  },
  {
    name: "Strategy",
    nameEs: "Estrategia",
    subtitle: "La Arquitectura de la Razón",
    description:
      "Un espacio cerebral y metódico donde la precisión es la norma. Aquí, nada se deja al azar; se venera el análisis de datos, la lógica deductiva y la planificación a largo plazo. Es una cultura que busca la excelencia a través del rigor, minimizando riesgos mediante procesos estructurados y una comprensión profunda del 'por qué' antes del 'cómo'.",
    focusEnergy: "Reflection",
    focusOrientation: "Results",
    attributes: [
      "Enfoque en datos, lógica y objetividad absoluta.",
      "Preferencia por la calidad y precisión sobre la velocidad.",
      "Procesos claros, estandarización y mejora continua.",
      "Valoración de la experiencia técnica y la profundidad intelectual.",
    ],
    icon: "🧠",
    color: "blue",
  },
  {
    name: "Cohesion",
    nameEs: "Cohesión",
    subtitle: "El Tejido Humano",
    description:
      "Una comunidad unida por la empatía y la confianza mutua. El objetivo principal es la sostenibilidad humana: si el equipo está bien, los resultados llegarán. Se prioriza la seguridad psicológica, el consenso y la inclusión, creando un ambiente donde la lealtad y el bienestar colectivo son los indicadores reales de éxito.",
    focusEnergy: "Reflection",
    focusOrientation: "People",
    attributes: [
      "Prioridad absoluta en la armonía y el bienestar del equipo.",
      "Toma de decisiones democrática y basada en consenso.",
      "Comunicación empática y resolución pacífica de conflictos.",
      "Alto sentido de pertenencia y apoyo emocional mutuo.",
    ],
    icon: "💚",
    color: "green",
  },
];

export default culturesData;
