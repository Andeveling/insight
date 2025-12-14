/**
 * Badges Seed Data
 *
 * Contains badges for the gamification system.
 * Badges are unlocked based on XP, modules completed, challenges, streaks, and collaboration.
 */

export interface BadgeData {
  key: string;
  nameEs: string;
  descriptionEs: string;
  iconUrl: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlockCriteria: {
    type: "xp" | "modules" | "challenges" | "streak" | "collaborative" | "level";
    threshold: number;
  };
  xpReward: number;
}

export const badgesData: BadgeData[] = [
  // ============================================================================
  // XP-BASED BADGES
  // ============================================================================
  {
    key: "xp-collector-bronze",
    nameEs: "Coleccionista de XP",
    descriptionEs: "Acumula tus primeros 500 puntos de experiencia",
    iconUrl: "/badges/xp-bronze.svg",
    tier: "bronze",
    unlockCriteria: { type: "xp", threshold: 500 },
    xpReward: 50,
  },
  {
    key: "xp-collector-silver",
    nameEs: "Acumulador de XP",
    descriptionEs: "Alcanza 2,000 puntos de experiencia",
    iconUrl: "/badges/xp-silver.svg",
    tier: "silver",
    unlockCriteria: { type: "xp", threshold: 2000 },
    xpReward: 100,
  },
  {
    key: "xp-collector-gold",
    nameEs: "Maestro del XP",
    descriptionEs: "Alcanza 5,000 puntos de experiencia",
    iconUrl: "/badges/xp-gold.svg",
    tier: "gold",
    unlockCriteria: { type: "xp", threshold: 5000 },
    xpReward: 200,
  },
  {
    key: "xp-collector-platinum",
    nameEs: "Leyenda del XP",
    descriptionEs: "Alcanza 10,000 puntos de experiencia",
    iconUrl: "/badges/xp-platinum.svg",
    tier: "platinum",
    unlockCriteria: { type: "xp", threshold: 10000 },
    xpReward: 500,
  },

  // ============================================================================
  // LEVEL-BASED BADGES
  // ============================================================================
  {
    key: "level-explorer",
    nameEs: "Explorador",
    descriptionEs: "Alcanza el nivel 3",
    iconUrl: "/badges/level-explorer.svg",
    tier: "bronze",
    unlockCriteria: { type: "level", threshold: 3 },
    xpReward: 75,
  },
  {
    key: "level-adventurer",
    nameEs: "Aventurero",
    descriptionEs: "Alcanza el nivel 5",
    iconUrl: "/badges/level-adventurer.svg",
    tier: "silver",
    unlockCriteria: { type: "level", threshold: 5 },
    xpReward: 150,
  },
  {
    key: "level-master",
    nameEs: "Maestro",
    descriptionEs: "Alcanza el nivel 10",
    iconUrl: "/badges/level-master.svg",
    tier: "gold",
    unlockCriteria: { type: "level", threshold: 10 },
    xpReward: 300,
  },
  {
    key: "level-legend",
    nameEs: "Leyenda",
    descriptionEs: "Alcanza el nivel 15",
    iconUrl: "/badges/level-legend.svg",
    tier: "platinum",
    unlockCriteria: { type: "level", threshold: 15 },
    xpReward: 500,
  },

  // ============================================================================
  // MODULE COMPLETION BADGES
  // ============================================================================
  {
    key: "first-module",
    nameEs: "Primer Paso",
    descriptionEs: "Completa tu primer módulo de desarrollo",
    iconUrl: "/badges/module-first.svg",
    tier: "bronze",
    unlockCriteria: { type: "modules", threshold: 1 },
    xpReward: 100,
  },
  {
    key: "module-enthusiast",
    nameEs: "Entusiasta del Aprendizaje",
    descriptionEs: "Completa 5 módulos de desarrollo",
    iconUrl: "/badges/module-enthusiast.svg",
    tier: "silver",
    unlockCriteria: { type: "modules", threshold: 5 },
    xpReward: 200,
  },
  {
    key: "module-scholar",
    nameEs: "Erudito",
    descriptionEs: "Completa 10 módulos de desarrollo",
    iconUrl: "/badges/module-scholar.svg",
    tier: "gold",
    unlockCriteria: { type: "modules", threshold: 10 },
    xpReward: 350,
  },
  {
    key: "module-sage",
    nameEs: "Sabio de Fortalezas",
    descriptionEs: "Completa 20 módulos de desarrollo",
    iconUrl: "/badges/module-sage.svg",
    tier: "platinum",
    unlockCriteria: { type: "modules", threshold: 20 },
    xpReward: 500,
  },

  // ============================================================================
  // CHALLENGE COMPLETION BADGES
  // ============================================================================
  {
    key: "first-challenge",
    nameEs: "Desafío Aceptado",
    descriptionEs: "Completa tu primer desafío",
    iconUrl: "/badges/challenge-first.svg",
    tier: "bronze",
    unlockCriteria: { type: "challenges", threshold: 1 },
    xpReward: 50,
  },
  {
    key: "challenge-seeker",
    nameEs: "Buscador de Desafíos",
    descriptionEs: "Completa 10 desafíos",
    iconUrl: "/badges/challenge-seeker.svg",
    tier: "bronze",
    unlockCriteria: { type: "challenges", threshold: 10 },
    xpReward: 100,
  },
  {
    key: "challenge-warrior",
    nameEs: "Guerrero de Desafíos",
    descriptionEs: "Completa 25 desafíos",
    iconUrl: "/badges/challenge-warrior.svg",
    tier: "silver",
    unlockCriteria: { type: "challenges", threshold: 25 },
    xpReward: 200,
  },
  {
    key: "challenge-champion",
    nameEs: "Campeón de Desafíos",
    descriptionEs: "Completa 50 desafíos",
    iconUrl: "/badges/challenge-champion.svg",
    tier: "gold",
    unlockCriteria: { type: "challenges", threshold: 50 },
    xpReward: 400,
  },
  {
    key: "challenge-legend",
    nameEs: "Leyenda de Desafíos",
    descriptionEs: "Completa 100 desafíos",
    iconUrl: "/badges/challenge-legend.svg",
    tier: "platinum",
    unlockCriteria: { type: "challenges", threshold: 100 },
    xpReward: 750,
  },

  // ============================================================================
  // STREAK BADGES
  // ============================================================================
  {
    key: "streak-starter",
    nameEs: "Racha Inicial",
    descriptionEs: "Mantén una racha de 3 días consecutivos",
    iconUrl: "/badges/streak-3.svg",
    tier: "bronze",
    unlockCriteria: { type: "streak", threshold: 3 },
    xpReward: 75,
  },
  {
    key: "streak-week",
    nameEs: "Semana de Fuego",
    descriptionEs: "Mantén una racha de 7 días consecutivos",
    iconUrl: "/badges/streak-7.svg",
    tier: "silver",
    unlockCriteria: { type: "streak", threshold: 7 },
    xpReward: 150,
  },
  {
    key: "streak-fortnight",
    nameEs: "Quincena Imparable",
    descriptionEs: "Mantén una racha de 14 días consecutivos",
    iconUrl: "/badges/streak-14.svg",
    tier: "gold",
    unlockCriteria: { type: "streak", threshold: 14 },
    xpReward: 300,
  },
  {
    key: "streak-month",
    nameEs: "Mes de Constancia",
    descriptionEs: "Mantén una racha de 30 días consecutivos",
    iconUrl: "/badges/streak-30.svg",
    tier: "platinum",
    unlockCriteria: { type: "streak", threshold: 30 },
    xpReward: 600,
  },

  // ============================================================================
  // COLLABORATIVE BADGES
  // ============================================================================
  {
    key: "first-collab",
    nameEs: "Primer Colaborador",
    descriptionEs: "Completa tu primer desafío colaborativo",
    iconUrl: "/badges/collab-first.svg",
    tier: "bronze",
    unlockCriteria: { type: "collaborative", threshold: 1 },
    xpReward: 100,
  },
  {
    key: "team-player",
    nameEs: "Jugador de Equipo",
    descriptionEs: "Completa 5 desafíos colaborativos",
    iconUrl: "/badges/collab-team.svg",
    tier: "silver",
    unlockCriteria: { type: "collaborative", threshold: 5 },
    xpReward: 250,
  },
  {
    key: "collaboration-master",
    nameEs: "Maestro Colaborativo",
    descriptionEs: "Completa 15 desafíos colaborativos",
    iconUrl: "/badges/collab-master.svg",
    tier: "gold",
    unlockCriteria: { type: "collaborative", threshold: 15 },
    xpReward: 400,
  },
  {
    key: "collaboration-legend",
    nameEs: "Leyenda de la Colaboración",
    descriptionEs: "Completa 30 desafíos colaborativos",
    iconUrl: "/badges/collab-legend.svg",
    tier: "platinum",
    unlockCriteria: { type: "collaborative", threshold: 30 },
    xpReward: 750,
  },
];
