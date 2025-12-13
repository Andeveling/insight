/**
 * Admin Analytics Service
 *
 * Provides analytics queries for feedback system monitoring
 * Tracks response rates, completion rates, and time-to-complete metrics
 */

import { prisma } from '@/lib/prisma.db';

/**
 * Overall feedback system metrics
 */
export interface FeedbackSystemMetrics {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  declinedRequests: number;
  expiredRequests: number;
  responseRate: number; // percentage
  completionRate: number; // percentage
  averageTimeToComplete: number | null; // hours
  medianTimeToComplete: number | null; // hours
}

/**
 * Time-based metrics
 */
export interface TimeBasedMetrics {
  period: string;
  requestsCreated: number;
  requestsCompleted: number;
  requestsDeclined: number;
  requestsExpired: number;
  avgTimeToComplete: number | null;
}

/**
 * User engagement metrics
 */
export interface UserEngagementMetrics {
  activeRequesters: number; // users who sent requests in period
  activeRespondents: number; // users who responded in period
  avgRequestsPerUser: number;
  avgResponsesPerUser: number;
  usersWithInsights: number; // users with 3+ responses
}

/**
 * Get overall feedback system metrics
 */
export async function getSystemMetrics(): Promise<FeedbackSystemMetrics> {
  const [ statusCounts, completionTimes ] = await Promise.all([
    prisma.feedbackRequest.groupBy({
      by: [ 'status' ],
      _count: { id: true },
    }),
    prisma.feedbackRequest.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { not: null },
      },
      select: {
        sentAt: true,
        completedAt: true,
      },
    }),
  ]);

  const counts: Record<string, number> = {};
  let totalRequests = 0;

  for (const item of statusCounts) {
    counts[ item.status ] = item._count.id;
    totalRequests += item._count.id;
  }

  const pending = counts[ 'PENDING' ] || 0;
  const completed = counts[ 'COMPLETED' ] || 0;
  const declined = counts[ 'DECLINED' ] || 0;
  const expired = counts[ 'EXPIRED' ] || 0;

  // Calculate response rate (completed + declined) / total
  const responded = completed + declined;
  const responseRate = totalRequests > 0 ? (responded / totalRequests) * 100 : 0;

  // Calculate completion rate (completed / (completed + declined))
  const completionRate = responded > 0 ? (completed / responded) * 100 : 0;

  // Calculate time to complete
  const completionHours: number[] = [];
  for (const req of completionTimes) {
    if (req.completedAt) {
      const hours = (req.completedAt.getTime() - req.sentAt.getTime()) / (1000 * 60 * 60);
      completionHours.push(hours);
    }
  }

  let averageTimeToComplete: number | null = null;
  let medianTimeToComplete: number | null = null;

  if (completionHours.length > 0) {
    averageTimeToComplete =
      completionHours.reduce((a, b) => a + b, 0) / completionHours.length;

    completionHours.sort((a, b) => a - b);
    const mid = Math.floor(completionHours.length / 2);
    medianTimeToComplete =
      completionHours.length % 2 === 0
        ? (completionHours[ mid - 1 ] + completionHours[ mid ]) / 2
        : completionHours[ mid ];
  }

  return {
    totalRequests,
    pendingRequests: pending,
    completedRequests: completed,
    declinedRequests: declined,
    expiredRequests: expired,
    responseRate: Math.round(responseRate * 100) / 100,
    completionRate: Math.round(completionRate * 100) / 100,
    averageTimeToComplete: averageTimeToComplete
      ? Math.round(averageTimeToComplete * 10) / 10
      : null,
    medianTimeToComplete: medianTimeToComplete
      ? Math.round(medianTimeToComplete * 10) / 10
      : null,
  };
}

/**
 * Get time-based metrics for a specific period
 *
 * @param startDate - Start of period
 * @param endDate - End of period
 * @param periodLabel - Label for the period (e.g., "Last 7 days")
 */
export async function getTimeBasedMetrics(
  startDate: Date,
  endDate: Date,
  periodLabel: string
): Promise<TimeBasedMetrics> {
  const [ created, completed, declined, expired, completionTimes ] = await Promise.all([
    prisma.feedbackRequest.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.feedbackRequest.count({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.feedbackRequest.count({
      where: {
        status: 'DECLINED',
        updatedAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.feedbackRequest.count({
      where: {
        status: 'EXPIRED',
        updatedAt: { gte: startDate, lte: endDate },
      },
    }),
    prisma.feedbackRequest.findMany({
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startDate, lte: endDate },
      },
      select: {
        sentAt: true,
        completedAt: true,
      },
    }),
  ]);

  let avgTimeToComplete: number | null = null;

  if (completionTimes.length > 0) {
    const hours = completionTimes.map((req) =>
      req.completedAt
        ? (req.completedAt.getTime() - req.sentAt.getTime()) / (1000 * 60 * 60)
        : 0
    );
    avgTimeToComplete =
      Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10;
  }

  return {
    period: periodLabel,
    requestsCreated: created,
    requestsCompleted: completed,
    requestsDeclined: declined,
    requestsExpired: expired,
    avgTimeToComplete,
  };
}

/**
 * Get user engagement metrics for a specific period
 *
 * @param startDate - Start of period
 * @param endDate - End of period
 */
export async function getUserEngagementMetrics(
  startDate: Date,
  endDate: Date
): Promise<UserEngagementMetrics> {
  const [ requesters, respondents, usersWithInsights ] = await Promise.all([
    // Active requesters
    prisma.feedbackRequest.groupBy({
      by: [ 'requesterId' ],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    }),
    // Active respondents
    prisma.feedbackRequest.groupBy({
      by: [ 'respondentId' ],
      where: {
        status: 'COMPLETED',
        completedAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    }),
    // Users with enough responses for insights
    prisma.feedbackSummary.count({
      where: {
        totalResponses: { gte: 3 },
        lastResponseAt: { gte: startDate, lte: endDate },
      },
    }),
  ]);

  const activeRequestersCount = requesters.length;
  const activeRespondentsCount = respondents.length;

  const totalRequests = requesters.reduce((sum, r) => sum + r._count.id, 0);
  const totalResponses = respondents.reduce((sum, r) => sum + r._count.id, 0);

  return {
    activeRequesters: activeRequestersCount,
    activeRespondents: activeRespondentsCount,
    avgRequestsPerUser:
      activeRequestersCount > 0
        ? Math.round((totalRequests / activeRequestersCount) * 10) / 10
        : 0,
    avgResponsesPerUser:
      activeRespondentsCount > 0
        ? Math.round((totalResponses / activeRespondentsCount) * 10) / 10
        : 0,
    usersWithInsights,
  };
}

/**
 * Get analytics dashboard data
 */
export async function getAnalyticsDashboard(): Promise<{
  system: FeedbackSystemMetrics;
  last7Days: TimeBasedMetrics;
  last30Days: TimeBasedMetrics;
  engagement: UserEngagementMetrics;
}> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [ system, last7Days, last30Days, engagement ] = await Promise.all([
    getSystemMetrics(),
    getTimeBasedMetrics(sevenDaysAgo, now, 'Últimos 7 días'),
    getTimeBasedMetrics(thirtyDaysAgo, now, 'Últimos 30 días'),
    getUserEngagementMetrics(thirtyDaysAgo, now),
  ]);

  return {
    system,
    last7Days,
    last30Days,
    engagement,
  };
}
