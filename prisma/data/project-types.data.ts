/**
 * Project Types Seed Data
 *
 * Data for seeding the ProjectTypeProfile table.
 *
 * @module prisma/data/project-types.data
 */

import { PROJECT_TYPE_SEED_DATA } from '@/lib/types';

/**
 * Transform seed data for database insertion.
 * Converts arrays and objects to JSON strings for SQLite storage.
 */
export const projectTypesData = PROJECT_TYPE_SEED_DATA.map((profile) => ({
  type: profile.type,
  name: profile.name,
  nameEs: profile.nameEs,
  idealStrengths: JSON.stringify(profile.idealStrengths),
  criticalDomains: JSON.stringify(profile.criticalDomains),
  cultureFit: JSON.stringify(profile.cultureFit),
  description: profile.description,
  descriptionEs: profile.descriptionEs,
  characteristics: JSON.stringify(profile.characteristics),
  characteristicsEs: JSON.stringify(profile.characteristicsEs),
  icon: profile.icon,
}));
