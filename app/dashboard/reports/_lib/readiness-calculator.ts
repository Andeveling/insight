/**
 * Readiness Calculator
 *
 * Pure functions for calculating report readiness scores and requirements.
 * No side effects - all calculations are deterministic.
 *
 * @feature 009-contextual-reports
 */

import {
	INDIVIDUAL_REPORT_THRESHOLDS,
	READINESS_WEIGHTS,
	TEAM_REPORT_THRESHOLDS,
} from "@/lib/constants/report-thresholds";

import type {
	Requirement,
	TeamMemberReadiness,
} from "../_schemas/readiness.schema";

// ============================================================
// Types
// ============================================================

/**
 * Input data for individual readiness calculation
 */
export interface IndividualProgressData {
	modulesCompleted: number;
	xpTotal: number;
	challengesCompleted: number;
	hasStrengths: boolean;
}

/**
 * Input data for team readiness calculation
 */
export interface TeamProgressData {
	members: TeamMemberReadiness[];
	teamId: string;
	teamName: string;
}

// ============================================================
// Individual Readiness Calculations
// ============================================================

/**
 * Calculate individual readiness score (0-100)
 *
 * Score is a weighted average of progress toward each threshold.
 * All weights must sum to 100.
 *
 * @param progress - User's current progress data
 * @returns Score from 0 to 100
 */
export function calculateIndividualScore(
	progress: IndividualProgressData,
): number {
	const T = INDIVIDUAL_REPORT_THRESHOLDS;
	const W = READINESS_WEIGHTS;

	// Calculate each component score (0 to weight max)
	const moduleScore =
		Math.min(progress.modulesCompleted / T.MODULES_COMPLETED, 1) * W.modules;
	const xpScore = Math.min(progress.xpTotal / T.XP_TOTAL, 1) * W.xp;
	const challengeScore =
		Math.min(progress.challengesCompleted / T.CHALLENGES_COMPLETED, 1) *
		W.challenges;
	const strengthScore = progress.hasStrengths ? W.strengths : 0;

	// Sum all component scores
	const totalScore = moduleScore + xpScore + challengeScore + strengthScore;

	return Math.round(totalScore);
}

/**
 * Build requirements list with current status for each
 *
 * @param progress - User's current progress data
 * @returns Array of requirements with met/unmet status
 */
export function buildRequirements(
	progress: IndividualProgressData,
): Requirement[] {
	const T = INDIVIDUAL_REPORT_THRESHOLDS;

	return [
		{
			id: "strengths",
			label: "Fortalezas identificadas",
			current: progress.hasStrengths ? 1 : 0,
			target: 1,
			met: progress.hasStrengths,
			priority: "required",
			icon: "strengths",
			actionUrl: "/dashboard/assessment",
		},
		{
			id: "modules",
			label: "Módulos completados",
			current: progress.modulesCompleted,
			target: T.MODULES_COMPLETED,
			met: progress.modulesCompleted >= T.MODULES_COMPLETED,
			priority: "required",
			icon: "modules",
			actionUrl: "/dashboard/development",
		},
		{
			id: "challenges",
			label: "Challenges completados",
			current: progress.challengesCompleted,
			target: T.CHALLENGES_COMPLETED,
			met: progress.challengesCompleted >= T.CHALLENGES_COMPLETED,
			priority: "required",
			icon: "challenges",
			actionUrl: "/dashboard/development",
		},
		{
			id: "xp",
			label: "XP acumulada",
			current: progress.xpTotal,
			target: T.XP_TOTAL,
			met: progress.xpTotal >= T.XP_TOTAL,
			priority: "required",
			icon: "xp",
			actionUrl: "/dashboard/development",
		},
	];
}

/**
 * Check if all required thresholds are met for individual report
 *
 * @param requirements - List of requirements to check
 * @returns true if all required requirements are met
 */
export function isIndividualReady(requirements: Requirement[]): boolean {
	return requirements
		.filter((r) => r.priority === "required")
		.every((r) => r.met);
}

// ============================================================
// Team Readiness Calculations
// ============================================================

/**
 * Calculate team readiness score (0-100)
 *
 * Score is the percentage of members who meet the minimum individual readiness.
 *
 * @param members - Array of team member readiness data
 * @returns Score from 0 to 100
 */
export function calculateTeamScore(members: TeamMemberReadiness[]): number {
	if (members.length === 0) return 0;

	const readyMembers = members.filter((m) => m.individualScore >= 50).length;
	return Math.round((readyMembers / members.length) * 100);
}

/**
 * Build team requirements list
 *
 * @param teamData - Team progress data
 * @returns Array of requirements for team report
 */
export function buildTeamRequirements(
	teamData: TeamProgressData,
): Requirement[] {
	const T = TEAM_REPORT_THRESHOLDS;
	const memberCount = teamData.members.length;
	const readyMemberCount = teamData.members.filter(
		(m) => m.individualScore >= 50,
	).length;
	const readinessPercent =
		memberCount > 0 ? Math.round((readyMemberCount / memberCount) * 100) : 0;

	return [
		{
			id: "active-members",
			label: "Miembros activos en el equipo",
			current: memberCount,
			target: T.MIN_ACTIVE_MEMBERS,
			met: memberCount >= T.MIN_ACTIVE_MEMBERS,
			priority: "required",
			icon: "modules",
			actionUrl: "/dashboard/team",
		},
		{
			id: "member-readiness",
			label: "Miembros con progreso suficiente",
			current: readinessPercent,
			target: T.MEMBER_READINESS_PERCENT,
			met: readinessPercent >= T.MEMBER_READINESS_PERCENT,
			priority: "required",
			icon: "challenges",
		},
	];
}

/**
 * Check if team meets minimum requirements for report generation
 *
 * @param teamData - Team progress data
 * @returns true if team can generate report
 */
export function isTeamReady(teamData: TeamProgressData): boolean {
	const T = TEAM_REPORT_THRESHOLDS;
	const memberCount = teamData.members.length;
	const readyMemberCount = teamData.members.filter(
		(m) => m.individualScore >= 50,
	).length;
	const readinessPercent =
		memberCount > 0 ? (readyMemberCount / memberCount) * 100 : 0;

	return (
		memberCount >= T.MIN_ACTIVE_MEMBERS &&
		readinessPercent >= T.MEMBER_READINESS_PERCENT
	);
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Calculate individual readiness for a specific user (for team breakdown)
 *
 * @param progress - User's progress data
 * @returns Individual score (0-100)
 */
export function calculateMemberReadiness(
	progress: IndividualProgressData,
): number {
	return calculateIndividualScore(progress);
}

/**
 * Get the next recommended action for a user to improve readiness
 *
 * @param requirements - List of requirements
 * @returns The first unmet requirement or null if all met
 */
export function getNextRecommendedAction(
	requirements: Requirement[],
): Requirement | null {
	// Priority order: strengths first, then modules, then challenges, then XP
	const priorityOrder = ["strengths", "modules", "challenges", "xp"];

	for (const id of priorityOrder) {
		const req = requirements.find((r) => r.id === id && !r.met);
		if (req) return req;
	}

	return null;
}

/**
 * Format readiness score for display
 *
 * @param score - Score from 0-100
 * @returns Formatted string with percentage
 */
export function formatReadinessScore(score: number): string {
	return `${score}%`;
}

/**
 * Get readiness status label
 *
 * @param score - Score from 0-100
 * @returns Human-readable status label
 */
export function getReadinessStatusLabel(score: number): string {
	if (score === 100) return "¡Listo!";
	if (score >= 75) return "Casi listo";
	if (score >= 50) return "En progreso";
	if (score >= 25) return "Comenzando";
	return "Por empezar";
}
