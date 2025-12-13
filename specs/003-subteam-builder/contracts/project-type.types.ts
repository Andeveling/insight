/**
 * API Contracts: Project Type Profiles
 * 
 * TypeScript interfaces and constants for project types.
 * 
 * @module contracts/project-type.types
 */

// ============================================================
// Project Type Constants
// ============================================================

/**
 * Available project types
 */
export const PROJECT_TYPES = {
  INNOVATION: 'innovation',
  EXECUTION: 'execution',
  CRISIS: 'crisis',
  GROWTH: 'growth'
} as const;

export type ProjectType = typeof PROJECT_TYPES[keyof typeof PROJECT_TYPES];

// ============================================================
// Project Type Profile Types
// ============================================================

/**
 * Complete project type profile
 */
export interface ProjectTypeProfile {
  id: string;
  type: ProjectType;
  name: string;
  nameEs: string;
  idealStrengths: string[];
  criticalDomains: DomainWeights;
  cultureFit: string[];
  description: string;
  descriptionEs: string;
  icon: string | null;
  characteristics: string[];
  characteristicsEs: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Domain weights for project type
 */
export interface DomainWeights {
  Thinking: number;
  Doing: number;
  Motivating: number;
  Feeling: number;
}

/**
 * Simplified profile for selection UI
 */
export interface ProjectTypeOption {
  id: string;
  type: ProjectType;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string | null;
}

// ============================================================
// Seed Data Structures
// ============================================================

/**
 * Seed data for project type profiles
 */
export const PROJECT_TYPE_SEED_DATA: Omit<ProjectTypeProfile, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: PROJECT_TYPES.INNOVATION,
    name: 'Innovation Sprint',
    nameEs: 'Sprint de Innovación',
    idealStrengths: ['Strategist', 'Thinker', 'Brainstormer', 'Coach', 'Believer'],
    criticalDomains: {
      Thinking: 0.35,
      Motivating: 0.30,
      Doing: 0.20,
      Feeling: 0.15
    },
    cultureFit: ['Strategy', 'Innovation'],
    description: 'Projects focused on creating new products, services, or processes requiring creative thinking and strategic planning.',
    descriptionEs: 'Proyectos enfocados en crear nuevos productos, servicios o procesos que requieren pensamiento creativo y planificación estratégica.',
    icon: 'lightbulb',
    characteristics: [
      'Requires creative problem-solving',
      'Long-term strategic thinking',
      'Experimentation and iteration',
      'Cross-functional collaboration'
    ],
    characteristicsEs: [
      'Requiere resolución creativa de problemas',
      'Pensamiento estratégico a largo plazo',
      'Experimentación e iteración',
      'Colaboración interfuncional'
    ]
  },
  {
    type: PROJECT_TYPES.EXECUTION,
    name: 'Execution-Heavy Initiative',
    nameEs: 'Iniciativa de Ejecución',
    idealStrengths: ['Deliverer', 'Chameleon', 'Commander', 'Time Keeper', 'Focus Expert'],
    criticalDomains: {
      Doing: 0.40,
      Thinking: 0.25,
      Motivating: 0.20,
      Feeling: 0.15
    },
    cultureFit: ['Execution'],
    description: 'Projects with clear objectives and tight deadlines requiring disciplined execution and delivery excellence.',
    descriptionEs: 'Proyectos con objetivos claros y plazos ajustados que requieren ejecución disciplinada y excelencia en la entrega.',
    icon: 'target',
    characteristics: [
      'Clear deliverables and milestones',
      'Tight timelines',
      'Process adherence',
      'Quality assurance focus'
    ],
    characteristicsEs: [
      'Entregables e hitos claros',
      'Plazos ajustados',
      'Adherencia a procesos',
      'Enfoque en aseguramiento de calidad'
    ]
  },
  {
    type: PROJECT_TYPES.CRISIS,
    name: 'Crisis Response',
    nameEs: 'Respuesta a Crisis',
    idealStrengths: ['Commander', 'Problem Solver', 'Deliverer', 'Empathizer', 'Chameleon'],
    criticalDomains: {
      Doing: 0.35,
      Thinking: 0.30,
      Feeling: 0.20,
      Motivating: 0.15
    },
    cultureFit: ['Execution', 'Cohesion'],
    description: 'Urgent projects requiring rapid decision-making, problem-solving, and team coordination under pressure.',
    descriptionEs: 'Proyectos urgentes que requieren toma de decisiones rápida, resolución de problemas y coordinación de equipo bajo presión.',
    icon: 'alert-triangle',
    characteristics: [
      'High urgency and pressure',
      'Rapid decision-making required',
      'Adaptability to changing conditions',
      'Clear leadership and coordination'
    ],
    characteristicsEs: [
      'Alta urgencia y presión',
      'Toma de decisiones rápida requerida',
      'Adaptabilidad a condiciones cambiantes',
      'Liderazgo y coordinación claros'
    ]
  },
  {
    type: PROJECT_TYPES.GROWTH,
    name: 'Growth & Development',
    nameEs: 'Crecimiento y Desarrollo',
    idealStrengths: ['Coach', 'Believer', 'Winner', 'Philomath', 'Catalyst'],
    criticalDomains: {
      Motivating: 0.35,
      Feeling: 0.25,
      Thinking: 0.20,
      Doing: 0.20
    },
    cultureFit: ['Cohesion', 'Influence'],
    description: 'Projects focused on team development, culture building, and organizational growth initiatives.',
    descriptionEs: 'Proyectos enfocados en desarrollo de equipos, construcción de cultura e iniciativas de crecimiento organizacional.',
    icon: 'trending-up',
    characteristics: [
      'People-centric approach',
      'Long-term capability building',
      'Learning and development focus',
      'Culture and morale emphasis'
    ],
    characteristicsEs: [
      'Enfoque centrado en personas',
      'Construcción de capacidades a largo plazo',
      'Enfoque en aprendizaje y desarrollo',
      'Énfasis en cultura y moral'
    ]
  }
];

// ============================================================
// Icon Mapping
// ============================================================

/**
 * Icon mapping for project types
 */
export const PROJECT_TYPE_ICONS: Record<ProjectType, string> = {
  [PROJECT_TYPES.INNOVATION]: 'lightbulb',
  [PROJECT_TYPES.EXECUTION]: 'target',
  [PROJECT_TYPES.CRISIS]: 'alert-triangle',
  [PROJECT_TYPES.GROWTH]: 'trending-up'
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * Get project type profile by type
 */
export function getProjectTypeProfile(type: ProjectType): Omit<ProjectTypeProfile, 'id' | 'createdAt' | 'updatedAt'> | undefined {
  return PROJECT_TYPE_SEED_DATA.find(profile => profile.type === type);
}

/**
 * Validate project type
 */
export function isValidProjectType(type: string): type is ProjectType {
  return Object.values(PROJECT_TYPES).includes(type as ProjectType);
}

/**
 * Get localized project type name
 */
export function getProjectTypeName(type: ProjectType, locale: 'en' | 'es' = 'es'): string {
  const profile = getProjectTypeProfile(type);
  return profile ? (locale === 'es' ? profile.nameEs : profile.name) : type;
}
