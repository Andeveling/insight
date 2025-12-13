/**
 * API Contracts: Sub-Team Types
 * 
 * TypeScript interfaces and Zod schemas for sub-team functionality.
 * These types define the contract between client and server.
 * 
 * @module contracts/subteam.types
 */

import { z } from 'zod';

// ============================================================
// Core SubTeam Types
// ============================================================

/**
 * SubTeam entity from database
 */
export interface SubTeam {
  id: string;
  parentTeamId: string;
  projectTypeProfileId: string;
  name: string;
  description: string | null;
  members: string[]; // Array of user IDs (parsed from JSON)
  matchScore: number | null;
  analysis: MatchScoreAnalysis | null; // Parsed from JSON
  status: 'active' | 'archived';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * SubTeam with related data for list view
 */
export interface SubTeamListItem {
  id: string;
  name: string;
  projectType: {
    id: string;
    name: string;
    nameEs: string;
    icon: string | null;
  };
  matchScore: number | null;
  memberCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
}

/**
 * SubTeam with full details for detail/edit view
 */
export interface SubTeamDetail extends SubTeam {
  parentTeam: {
    id: string;
    name: string;
  };
  projectTypeProfile: ProjectTypeProfile;
  membersDetails: SubTeamMember[];
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Member within a sub-team with their strengths
 */
export interface SubTeamMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  strengths: {
    id: string;
    name: string;
    nameEs: string;
    rank: number;
    domain: {
      name: string;
      nameEs: string;
    };
  }[];
}

// ============================================================
// Match Score Analysis Types
// ============================================================

/**
 * Detailed analysis of match score calculation
 */
export interface MatchScoreAnalysis {
  totalScore: number; // 0-100
  factors: {
    strengthCoverage: MatchScoreFactor;
    domainBalance: MatchScoreFactor;
    cultureFit: MatchScoreFactor;
    teamSize: MatchScoreFactor;
    redundancyPenalty: MatchScoreFactor;
  };
  gaps: StrengthGap[];
  recommendations: string[];
  calculatedAt: string; // ISO timestamp
}

/**
 * Individual factor in match score calculation
 */
export interface MatchScoreFactor {
  score: number; // 0-100
  weight: number; // Multiplier (e.g., 0.30 for 30%)
  contribution: number; // score * weight
  details?: Record<string, unknown>; // Factor-specific details
}

/**
 * Identified strength gap
 */
export interface StrengthGap {
  strengthName: string;
  strengthNameEs: string;
  reason: string;
  priority: 'critical' | 'recommended' | 'optional';
}

// ============================================================
// Project Type Profile Types
// ============================================================

/**
 * Project type profile from database
 */
export interface ProjectTypeProfile {
  id: string;
  type: string; // "innovation" | "execution" | "crisis" | "growth"
  name: string;
  nameEs: string;
  idealStrengths: string[]; // Parsed from JSON
  criticalDomains: Record<string, number>; // Parsed from JSON
  cultureFit: string[]; // Parsed from JSON
  description: string;
  descriptionEs: string;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simplified project type for selector
 */
export interface ProjectTypeOption {
  id: string;
  type: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string | null;
}

// ============================================================
// Zod Schemas (Validation)
// ============================================================

/**
 * Schema for creating a new sub-team
 */
export const createSubTeamSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .nullable(),
  parentTeamId: z.string().uuid('ID de equipo inválido'),
  projectTypeProfileId: z.string().uuid('ID de tipo de proyecto inválido'),
  members: z.array(z.string().uuid('ID de usuario inválido'))
    .min(2, 'Se requieren al menos 2 miembros')
    .max(10, 'No se permiten más de 10 miembros')
    .refine((arr) => new Set(arr).size === arr.length, {
      message: 'No se permiten miembros duplicados'
    })
});

export type CreateSubTeamInput = z.infer<typeof createSubTeamSchema>;

/**
 * Schema for updating an existing sub-team
 */
export const updateSubTeamSchema = createSubTeamSchema.partial().extend({
  id: z.string().uuid('ID de sub-equipo inválido')
});

export type UpdateSubTeamInput = z.infer<typeof updateSubTeamSchema>;

/**
 * Schema for archiving a sub-team
 */
export const archiveSubTeamSchema = z.object({
  id: z.string().uuid('ID de sub-equipo inválido')
});

export type ArchiveSubTeamInput = z.infer<typeof archiveSubTeamSchema>;

/**
 * Schema for match score calculation input
 */
export const calculateMatchScoreSchema = z.object({
  members: z.array(z.string().uuid())
    .min(2, 'Se requieren al menos 2 miembros')
    .max(10, 'No se permiten más de 10 miembros'),
  projectTypeProfileId: z.string().uuid('ID de tipo de proyecto inválido')
});

export type CalculateMatchScoreInput = z.infer<typeof calculateMatchScoreSchema>;

// ============================================================
// Server Action Response Types
// ============================================================

/**
 * Generic success response
 */
export interface ActionSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic error response
 */
export interface ActionError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Union type for action responses
 */
export type ActionResponse<T = unknown> = ActionSuccess<T> | ActionError;

// ============================================================
// What-If Simulation Types
// ============================================================

/**
 * State for What-If simulation
 */
export interface WhatIfSimulation {
  isActive: boolean;
  originalMembers: string[];
  simulatedMembers: string[];
  originalScore: number;
  projectedScore: number;
  changes: MemberChange[];
}

/**
 * Individual member change in simulation
 */
export interface MemberChange {
  type: 'add' | 'remove' | 'swap';
  userId: string;
  userName: string;
  replacedUserId?: string; // For 'swap' type
  scoreDelta: number; // Impact on match score
  timestamp: Date;
}

// ============================================================
// Report Generation Types
// ============================================================

/**
 * Report generation request
 */
export interface GenerateReportInput {
  subTeamId: string;
  format: 'pdf' | 'html';
  includeDetails: boolean;
}

/**
 * Report generation result
 */
export interface GenerateReportResult {
  success: true;
  reportUrl?: string; // For HTML reports
  downloadUrl?: string; // For PDF downloads
  blob?: Blob; // For client-side PDF generation
}

// ============================================================
// Filter and Sort Types
// ============================================================

/**
 * Filters for sub-team list
 */
export interface SubTeamFilters {
  status?: 'active' | 'archived' | 'all';
  projectType?: string;
  minMatchScore?: number;
  maxMatchScore?: number;
  searchQuery?: string;
}

/**
 * Sort options for sub-team list
 */
export type SubTeamSortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'score-asc'
  | 'score-desc'
  | 'created-asc'
  | 'created-desc';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
