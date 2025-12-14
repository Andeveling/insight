/**
 * Match Score Calculator
 *
 * Calculates overall compatibility score for a sub-team based on multiple factors.
 * Includes caching to avoid redundant calculations for the same inputs.
 *
 * @module lib/utils/subteam/match-score-calculator
 */

import type {
  CultureFitResult,
  DomainBalanceResult,
  MatchScoreResult,
  RedundancyPenaltyResult,
  TeamSizeResult,
} from '@/lib/types';
import type { DomainDistribution } from '@/lib/types/match-score.types';
import type { DomainWeights, ProjectTypeProfile } from '@/lib/types/project-type.types';

import { DEFAULT_MATCH_SCORE_WEIGHTS } from '@/lib/types';

import { compareDomainDistribution, generateRecommendations, identifyStrengthGaps } from './gap-analyzer';
import {
  calculateDomainDistribution,
  calculateStrengthCoverage,
  normalizeDomainDistribution,
  type MemberStrengthData,
} from './strength-coverage';

// ============================================================
// Cache Implementation
// ============================================================

/**
 * Cache entry with TTL
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * In-memory cache for match score results
 * Uses LRU-like eviction with TTL
 */
const matchScoreCache = new Map<string, CacheEntry<MatchScoreResult>>();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

/**
 * Generate cache key from input parameters
 */
function generateCacheKey(
  members: MemberStrengthData[],
  projectType: Omit<ProjectTypeProfile, 'id' | 'createdAt' | 'updatedAt'>
): string {
  const memberIds = members.map((m) => m.userId).sort().join(',');
  const strengthsHash = members
    .flatMap((m) => m.strengths.map((s) => `${m.userId}:${s.name}:${s.rank}`))
    .sort()
    .join('|');
  return `${projectType.type}:${memberIds}:${strengthsHash}`;
}

/**
 * Get cached result if valid
 */
function getCached(key: string): MatchScoreResult | null {
  const entry = matchScoreCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    matchScoreCache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Store result in cache with eviction if needed
 */
function setCached(key: string, value: MatchScoreResult): void {
  // Evict oldest entries if cache is full
  if (matchScoreCache.size >= MAX_CACHE_SIZE) {
    const firstKey = matchScoreCache.keys().next().value;
    if (firstKey) matchScoreCache.delete(firstKey);
  }

  matchScoreCache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Clear the match score cache
 */
export function clearMatchScoreCache(): void {
  matchScoreCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getMatchScoreCacheStats(): { size: number; maxSize: number; ttlMs: number } {
  return {
    size: matchScoreCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL_MS,
  };
}

// ============================================================
// Match Score Calculation
// ============================================================

/**
 * Calculate complete match score for a sub-team
 * Results are cached for 5 minutes to avoid redundant calculations
 *
 * @param members - Array of member strength data
 * @param projectType - Project type profile with ideal characteristics
 * @param skipCache - If true, bypass cache and recalculate
 * @returns Complete match score result with all factors
 */
export function calculateMatchScore(
  members: MemberStrengthData[],
  projectType: Omit<ProjectTypeProfile, 'id' | 'createdAt' | 'updatedAt'>,
  skipCache = false
): MatchScoreResult {
  // Check cache first
  const cacheKey = generateCacheKey(members, projectType);
  if (!skipCache) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  // Calculate each factor
  const strengthCoverage = calculateStrengthCoverage(members, projectType.idealStrengths);
  const domainBalance = calculateDomainBalance(members, projectType.criticalDomains);
  const cultureFit = calculateCultureFit(members, projectType.cultureFit);
  const teamSize = calculateTeamSize(members.length);
  const redundancyPenalty = calculateRedundancyPenalty(members);

  // Calculate total score (weighted sum minus penalties)
  const positiveScore =
    strengthCoverage.contribution +
    domainBalance.contribution +
    cultureFit.contribution +
    teamSize.contribution;

  const totalScore = Math.max(0, Math.min(100, Math.round(positiveScore - redundancyPenalty.contribution)));

  // Get gaps and recommendations
  const gaps = identifyStrengthGaps(members, projectType.idealStrengths);
  const deviation = compareDomainDistribution(
    normalizeDomainDistribution(calculateDomainDistribution(members)),
    projectType.criticalDomains
  );
  const recommendations = generateRecommendations(gaps, deviation, members.length);

  const result: MatchScoreResult = {
    totalScore,
    factors: {
      strengthCoverage,
      domainBalance,
      cultureFit,
      teamSize,
      redundancyPenalty,
    },
    gaps,
    recommendations,
    metadata: {
      calculatedAt: new Date(),
      version: '1.0.0',
      weights: DEFAULT_MATCH_SCORE_WEIGHTS,
      projectType: projectType.type,
      memberCount: members.length,
    },
  };

  // Cache the result
  setCached(cacheKey, result);

  return result;
}

/**
 * Calculate domain balance score
 */
export function calculateDomainBalance(
  members: MemberStrengthData[],
  idealDomains: DomainWeights
): DomainBalanceResult {
  const weight = DEFAULT_MATCH_SCORE_WEIGHTS.domainBalance;

  const actualDistribution = calculateDomainDistribution(members);
  const normalizedActual = normalizeDomainDistribution(actualDistribution);
  const deviation = compareDomainDistribution(normalizedActual, idealDomains);

  // Calculate total deviation (sum of absolute differences)
  const totalDeviation =
    deviation.Thinking + deviation.Doing + deviation.Motivating + deviation.Feeling;

  // Score: 100 if perfect match, decreases with deviation
  // Max possible deviation is 2.0 (all weight in one domain vs opposite)
  const balanceScore = Math.round((1 - totalDeviation / 2) * 100);
  const score = Math.max(0, balanceScore);

  return {
    score,
    weight,
    contribution: score * weight,
    details: {
      actual: normalizedActual,
      ideal: idealDomains as DomainDistribution,
      deviation,
      balanceScore,
    },
  };
}

/**
 * Calculate culture fit score
 */
export function calculateCultureFit(
  members: MemberStrengthData[],
  idealCultures: string[]
): CultureFitResult {
  const weight = DEFAULT_MATCH_SCORE_WEIGHTS.cultureFit;

  // TODO: Get actual team cultures from members
  // For now, assume we derive cultures from domain distribution
  const domainDist = calculateDomainDistribution(members);
  const normalized = normalizeDomainDistribution(domainDist);

  // Derive team cultures based on dominant domains
  const teamCultures: string[] = [];
  if (normalized.Doing > 0.3 && normalized.Thinking > 0.2) {
    teamCultures.push('Execution');
  }
  if (normalized.Motivating > 0.3 && normalized.Feeling > 0.2) {
    teamCultures.push('Cohesion');
  }
  if (normalized.Thinking > 0.3 && normalized.Motivating > 0.2) {
    teamCultures.push('Strategy');
  }
  if (normalized.Doing > 0.3 && normalized.Motivating > 0.2) {
    teamCultures.push('Influence');
  }

  // Calculate match
  const matchCount = idealCultures.filter((c) => teamCultures.includes(c)).length;
  const matchPercentage = idealCultures.length > 0 ? matchCount / idealCultures.length : 0;
  const score = Math.round(matchPercentage * 100);

  return {
    score,
    weight,
    contribution: score * weight,
    details: {
      teamCultures,
      idealCultures,
      matchCount,
      matchPercentage,
    },
  };
}

/**
 * Calculate team size score
 */
export function calculateTeamSize(memberCount: number): TeamSizeResult {
  const weight = DEFAULT_MATCH_SCORE_WEIGHTS.teamSize;
  const idealSize = 5; // Ideal team size is 5-7

  // Score based on deviation from ideal
  let score: number;
  if (memberCount >= 5 && memberCount <= 7) {
    score = 100; // Perfect size
  } else if (memberCount === 4 || memberCount === 8) {
    score = 85; // Slightly off
  } else if (memberCount === 3 || memberCount === 9) {
    score = 70; // Acceptable
  } else if (memberCount === 2 || memberCount === 10) {
    score = 50; // Minimum viable
  } else {
    score = 30; // Poor size (should not happen due to constraints)
  }

  return {
    score,
    weight,
    contribution: score * weight,
    details: {
      actualSize: memberCount,
      idealSize,
      sizeScore: score,
    },
  };
}

/**
 * Calculate redundancy penalty
 */
export function calculateRedundancyPenalty(members: MemberStrengthData[]): RedundancyPenaltyResult {
  const weight = DEFAULT_MATCH_SCORE_WEIGHTS.redundancyPenalty;
  const penaltyPerDuplicate = 2; // Points to subtract per duplicate

  // Count strength occurrences
  const strengthCounts = new Map<string, { count: number; members: string[] }>();

  members.forEach((member) => {
    member.strengths.forEach((strength) => {
      const existing = strengthCounts.get(strength.name) || { count: 0, members: [] };
      existing.count++;
      existing.members.push(member.userId);
      strengthCounts.set(strength.name, existing);
    });
  });

  // Find duplicates (strength appearing more than once)
  const duplicateStrengths: {
    strengthName: string;
    strengthNameEs: string;
    count: number;
    members: string[];
  }[] = [];

  strengthCounts.forEach((data, strengthName) => {
    if (data.count > 1) {
      duplicateStrengths.push({
        strengthName,
        strengthNameEs: strengthName, // TODO: Get Spanish name
        count: data.count,
        members: data.members,
      });
    }
  });

  // Calculate total duplicates (count -1 for each, since first occurrence is not duplicate)
  const totalDuplicates = duplicateStrengths.reduce((sum, d) => sum + (d.count - 1), 0);
  const score = Math.min(totalDuplicates * penaltyPerDuplicate, 10); // Cap at 10 points penalty

  return {
    score,
    weight,
    contribution: score * weight, // This will be subtracted
    details: {
      duplicateStrengths,
      totalDuplicates,
      penaltyPerDuplicate,
    },
  };
}
