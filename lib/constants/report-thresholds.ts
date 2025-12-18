/**
 * Report Thresholds Configuration
 *
 * Configurable constants for Report Readiness System.
 * Adjust these values based on user behavior data.
 *
 * @feature 009-contextual-reports
 */

/**
 * Thresholds for individual report readiness
 * All must be met to enable report generation
 */
export const INDIVIDUAL_REPORT_THRESHOLDS = {
	/** Minimum modules completed */
	MODULES_COMPLETED: 3,
	/** Minimum total XP accumulated */
	XP_TOTAL: 100,
	/** Minimum challenges completed */
	CHALLENGES_COMPLETED: 5,
	/** Must have strengths from assessment */
	HAS_STRENGTHS: true,
} as const;

/**
 * Thresholds for team report readiness
 */
export const TEAM_REPORT_THRESHOLDS = {
	/** Minimum % of members with individual readiness >= 50% */
	MEMBER_READINESS_PERCENT: 60,
	/** Minimum active members in team */
	MIN_ACTIVE_MEMBERS: 3,
} as const;

/**
 * XP rewards for report generation milestones
 */
export const REPORT_XP_REWARDS = {
	/** XP for generating first individual contextual report */
	FIRST_INDIVIDUAL_REPORT: 50,
	/** XP for the person who generates team report */
	FIRST_TEAM_REPORT_GENERATOR: 75,
	/** XP for team members who contributed to team report */
	FIRST_TEAM_REPORT_CONTRIBUTOR: 25,
} as const;

/**
 * Weights for calculating readiness score (0-100)
 * Must sum to 100
 */
export const READINESS_WEIGHTS = {
	/** Weight for modules completed requirement */
	modules: 30,
	/** Weight for XP total requirement */
	xp: 25,
	/** Weight for challenges completed requirement */
	challenges: 25,
	/** Weight for strengths requirement (boolean) */
	strengths: 20,
} as const;

/**
 * Report schema versions
 */
export const REPORT_SCHEMA_VERSIONS = {
	/** Legacy reports without development context */
	V1_LEGACY: 1,
	/** New reports with development context */
	V2_CONTEXTUAL: 2,
} as const;

export type ReportSchemaVersion =
	(typeof REPORT_SCHEMA_VERSIONS)[keyof typeof REPORT_SCHEMA_VERSIONS];
