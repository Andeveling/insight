/**
 * Cache utility for feedback data
 * Provides in-memory caching with TTL support
 */

import { prisma } from '@/lib/prisma.db';

import type { FeedbackQuestion } from '@/generated/prisma/client';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// Generic cache store
const cacheStore = new Map<string, CacheEntry<unknown>>();

/**
 * Get or set a cached value
 *
 * @param key - Cache key
 * @param fetcher - Function to fetch data if not cached
 * @param ttlMs - Time to live in milliseconds
 * @returns Cached or fetched data
 */
async function getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number): Promise<T> {
  const now = Date.now();
  const cached = cacheStore.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const data = await fetcher();
  cacheStore.set(key, {
    data,
    expiresAt: now + ttlMs,
  });

  return data;
}

/**
 * Invalidate a cache entry
 *
 * @param key - Cache key to invalidate
 */
export function invalidateCache(key: string): void {
  cacheStore.delete(key);
}

/**
 * Invalidate all cache entries matching a prefix
 *
 * @param prefix - Key prefix to match
 */
export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) {
      cacheStore.delete(key);
    }
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  cacheStore.clear();
}

// =============================================================================
// Feedback Questions Cache (static data, long TTL)
// =============================================================================

const QUESTIONS_CACHE_KEY = 'feedback:questions:all';
const QUESTIONS_TTL_MS = 60 * 60 * 1000; // 1 hour (questions rarely change)

/**
 * Get all feedback questions (cached)
 *
 * @returns All feedback questions ordered by display order
 */
export async function getCachedFeedbackQuestions(): Promise<FeedbackQuestion[]> {
  return getOrSet(
    QUESTIONS_CACHE_KEY,
    async () => {
      return prisma.feedbackQuestion.findMany({
        orderBy: { order: 'asc' },
      });
    },
    QUESTIONS_TTL_MS
  );
}

/**
 * Invalidate feedback questions cache
 * Call this when questions are updated
 */
export function invalidateFeedbackQuestionsCache(): void {
  invalidateCache(QUESTIONS_CACHE_KEY);
}

// =============================================================================
// User Insights Cache (dynamic data, short TTL)
// =============================================================================

const INSIGHTS_CACHE_PREFIX = 'feedback:insights:';
const INSIGHTS_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached user insights
 *
 * @param userId - User ID
 * @param fetcher - Function to fetch insights if not cached
 * @returns Cached or fetched insights
 */
export async function getCachedUserInsights<T>(userId: string, fetcher: () => Promise<T>): Promise<T> {
  const cacheKey = `${INSIGHTS_CACHE_PREFIX}${userId}`;
  return getOrSet(cacheKey, fetcher, INSIGHTS_TTL_MS);
}

/**
 * Invalidate user insights cache
 * Call this when new feedback is received or processed
 *
 * @param userId - User ID to invalidate cache for
 */
export function invalidateUserInsightsCache(userId: string): void {
  invalidateCache(`${INSIGHTS_CACHE_PREFIX}${userId}`);
}

/**
 * Invalidate all user insights caches
 */
export function invalidateAllInsightsCache(): void {
  invalidateCacheByPrefix(INSIGHTS_CACHE_PREFIX);
}

// =============================================================================
// Strength Mapping Cache (static reference data)
// =============================================================================

const STRENGTH_MAPPING_CACHE_KEY = 'feedback:strength-mapping';
const STRENGTH_MAPPING_TTL_MS = 30 * 60 * 1000; // 30 minutes

export interface StrengthMappingData {
  questions: FeedbackQuestion[];
  strengths: { id: string; name: string; nameEs: string }[];
}

/**
 * Get cached strength mapping data (questions + strengths)
 *
 * @returns Cached strength mapping data
 */
export async function getCachedStrengthMapping(): Promise<StrengthMappingData> {
  return getOrSet(
    STRENGTH_MAPPING_CACHE_KEY,
    async () => {
      const [ questions, strengths ] = await Promise.all([
        prisma.feedbackQuestion.findMany({ orderBy: { order: 'asc' } }),
        prisma.strength.findMany({
          select: { id: true, name: true, nameEs: true },
        }),
      ]);

      return { questions, strengths };
    },
    STRENGTH_MAPPING_TTL_MS
  );
}

/**
 * Invalidate strength mapping cache
 */
export function invalidateStrengthMappingCache(): void {
  invalidateCache(STRENGTH_MAPPING_CACHE_KEY);
  invalidateFeedbackQuestionsCache();
}

// =============================================================================
// Cache Statistics (for monitoring)
// =============================================================================

/**
 * Get cache statistics
 *
 * @returns Cache statistics
 */
export function getCacheStats(): {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  memoryEstimate: string;
} {
  const now = Date.now();
  let validCount = 0;
  let expiredCount = 0;

  for (const entry of cacheStore.values()) {
    if (entry.expiresAt > now) {
      validCount++;
    } else {
      expiredCount++;
    }
  }

  // Rough memory estimate (JSON stringify length as proxy)
  let totalSize = 0;
  try {
    for (const entry of cacheStore.values()) {
      totalSize += JSON.stringify(entry.data).length;
    }
  } catch {
    totalSize = -1;
  }

  return {
    totalEntries: cacheStore.size,
    validEntries: validCount,
    expiredEntries: expiredCount,
    memoryEstimate: totalSize >= 0 ? `~${Math.round(totalSize / 1024)}KB` : 'unknown',
  };
}
