/**
 * Development Module Types
 *
 * Types for the development modules feature including modules,
 * challenges, and progress tracking.
 */

/**
 * Module difficulty levels
 */
export type ModuleLevel = "beginner" | "intermediate" | "advanced";

/**
 * Challenge types
 */
export type ChallengeType = "reflection" | "action" | "collaboration";

/**
 * Progress status for modules
 */
export type ModuleProgressStatus = "not_started" | "in_progress" | "completed";

/**
 * Collaborative challenge status
 */
export type CollaborativeChallengeStatus = "pending" | "confirmed" | "expired";

/**
 * Development module data
 */
export interface DevelopmentModuleData {
	id: string;
	key: string;
	titleEs: string;
	descriptionEs: string;
	content: string;
	estimatedMinutes: number;
	xpReward: number;
	level: ModuleLevel;
	strengthKey?: string | null;
	domainKey?: string | null;
	order: number;
	isActive: boolean;
}

/**
 * Development module with challenge count
 */
export interface DevelopmentModuleWithStats extends DevelopmentModuleData {
	challengeCount: number;
	completedChallenges?: number;
	progressStatus?: ModuleProgressStatus;
}

/**
 * Challenge data
 */
export interface ChallengeData {
	id: string;
	moduleId: string;
	titleEs: string;
	descriptionEs: string;
	type: ChallengeType;
	xpReward: number;
	order: number;
}

/**
 * Challenge with completion status
 */
export interface ChallengeWithProgress extends ChallengeData {
	completed: boolean;
	completedAt?: Date | null;
	xpAwarded: number;
}

/**
 * User's module progress
 */
export interface UserModuleProgressData {
	id: string;
	userId: string;
	moduleId: string;
	status: ModuleProgressStatus;
	completedChallenges: number;
	totalChallenges: number;
	moduleXpEarned: number;
	startedAt?: Date | null;
	completedAt?: Date | null;
}

/**
 * User's challenge progress
 */
export interface UserChallengeProgressData {
	id: string;
	userId: string;
	challengeId: string;
	completed: boolean;
	xpAwarded: number;
	completedAt?: Date | null;
}

/**
 * Collaborative challenge data
 */
export interface CollaborativeChallengeData {
	id: string;
	challengeId: string;
	initiatorUserId: string;
	partnerUserId: string;
	initiatorCompleted: boolean;
	partnerCompleted: boolean;
	initiatorCompletedAt?: Date | null;
	partnerCompletedAt?: Date | null;
	xpBonusAwarded?: number | null;
	status: CollaborativeChallengeStatus;
	expiresAt: Date;
}

/**
 * Module with full details for detail page
 */
export interface ModuleDetail extends DevelopmentModuleData {
	challenges: ChallengeWithProgress[];
	userProgress?: UserModuleProgressData | null;
}

/**
 * Domain grouping for module list
 */
export interface ModulesByDomain {
	domainKey: string;
	domainName: string;
	modules: DevelopmentModuleWithStats[];
}

/**
 * Strength grouping for module list
 */
export interface ModulesByStrength {
	strengthKey: string;
	strengthName: string;
	modules: DevelopmentModuleWithStats[];
}

/**
 * Module filters
 */
export interface ModuleFilters {
	level?: ModuleLevel;
	domainKey?: string;
	strengthKey?: string;
	status?: ModuleProgressStatus;
}

/**
 * Module sort options
 */
export type ModuleSortOption =
	| "order"
	| "level"
	| "xp"
	| "duration"
	| "progress";

/**
 * Challenge completion result
 */
export interface ChallengeCompletionResult {
	success: boolean;
	xpAwarded: number;
	challengeCompleted: boolean;
	moduleCompleted: boolean;
	newBadges: string[];
	levelUp: boolean;
	newLevel?: number;
}
