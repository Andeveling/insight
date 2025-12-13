/**
 * Anonymization Security Audit
 *
 * Validates that the feedback anonymization implementation meets security requirements
 * Run this periodically to ensure compliance with anonymity guarantees
 */

import { prisma } from '@/lib/prisma.db';

import { generateAnonymousHash, isValidAnonymousHash } from '../_utils/anonymization';

/**
 * Audit result for a single check
 */
export interface AuditCheckResult {
  check: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  details: string;
  recommendation?: string;
}

/**
 * Complete audit report
 */
export interface AnonymizationAuditReport {
  timestamp: Date;
  overallPassed: boolean;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  checks: AuditCheckResult[];
}

/**
 * Check 1: Verify all anonymous responses have valid hashes
 */
async function checkAnonymousHashPresence(): Promise<AuditCheckResult> {
  const anonymousRequestsWithoutHashes = await prisma.feedbackResponse.count({
    where: {
      request: {
        isAnonymous: true,
      },
      anonymousHash: null,
    },
  });

  if (anonymousRequestsWithoutHashes > 0) {
    return {
      check: 'Anonymous responses have hashes',
      passed: false,
      severity: 'critical',
      details: `${anonymousRequestsWithoutHashes} anonymous responses are missing anonymization hashes`,
      recommendation: 'Generate hashes for existing anonymous responses via migration',
    };
  }

  return {
    check: 'Anonymous responses have hashes',
    passed: true,
    severity: 'critical',
    details: 'All anonymous responses have anonymization hashes',
  };
}

/**
 * Check 2: Verify hash format is valid (cannot be reversed)
 */
async function checkHashFormat(): Promise<AuditCheckResult> {
  const sampleResponses = await prisma.feedbackResponse.findMany({
    where: {
      anonymousHash: { not: null },
    },
    select: {
      anonymousHash: true,
    },
    take: 100,
  });

  let invalidHashes = 0;

  for (const response of sampleResponses) {
    if (response.anonymousHash && !isValidAnonymousHash(response.anonymousHash)) {
      invalidHashes++;
    }
  }

  if (invalidHashes > 0) {
    return {
      check: 'Hash format is secure',
      passed: false,
      severity: 'high',
      details: `${invalidHashes} of ${sampleResponses.length} sampled hashes have invalid format`,
      recommendation: 'Regenerate invalid hashes using secure algorithm',
    };
  }

  return {
    check: 'Hash format is secure',
    passed: true,
    severity: 'high',
    details: `All ${sampleResponses.length} sampled hashes have valid secure format`,
  };
}

/**
 * Check 3: Verify hashes are unique per request-question combination
 */
async function checkHashUniqueness(): Promise<AuditCheckResult> {
  const duplicateHashes = await prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) as count
    FROM (
      SELECT "anonymousHash"
      FROM "FeedbackResponse"
      WHERE "anonymousHash" IS NOT NULL
      GROUP BY "anonymousHash"
      HAVING COUNT(*) > 1
    ) as duplicates
  `;

  const duplicateCount = Number(duplicateHashes[ 0 ]?.count || 0);

  if (duplicateCount > 0) {
    return {
      check: 'Hashes are unique',
      passed: false,
      severity: 'high',
      details: `${duplicateCount} duplicate hashes found (potential duplicate submissions)`,
      recommendation: 'Investigate duplicate hashes for potential duplicate detection issues',
    };
  }

  return {
    check: 'Hashes are unique',
    passed: true,
    severity: 'high',
    details: 'All anonymization hashes are unique',
  };
}

/**
 * Check 4: Verify no PII in anonymous responses
 */
async function checkNoPIIInResponses(): Promise<AuditCheckResult> {
  // Check that answer field doesn't contain email-like patterns or names
  const responsesWithPotentialPII = await prisma.feedbackResponse.findMany({
    where: {
      request: {
        isAnonymous: true,
      },
    },
    select: {
      answer: true,
    },
    take: 500,
  });

  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phonePattern = /(\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;

  let piiFound = 0;

  for (const response of responsesWithPotentialPII) {
    try {
      const answerText = JSON.stringify(response.answer);
      if (emailPattern.test(answerText) || phonePattern.test(answerText)) {
        piiFound++;
      }
    } catch {
      // Skip if answer can't be parsed
    }
  }

  if (piiFound > 0) {
    return {
      check: 'No PII in anonymous responses',
      passed: false,
      severity: 'critical',
      details: `${piiFound} of ${responsesWithPotentialPII.length} sampled responses may contain PII`,
      recommendation: 'Review and sanitize responses containing potential PII',
    };
  }

  return {
    check: 'No PII in anonymous responses',
    passed: true,
    severity: 'critical',
    details: `No PII patterns found in ${responsesWithPotentialPII.length} sampled responses`,
  };
}

/**
 * Check 5: Verify respondent identity is not exposed in anonymous summaries
 */
async function checkSummaryAnonymity(): Promise<AuditCheckResult> {
  const summaries = await prisma.feedbackSummary.findMany({
    select: {
      insights: true,
      strengthAdjustments: true,
    },
    take: 100,
  });

  // Check that summaries don't contain respondent names
  const users = await prisma.user.findMany({
    select: { name: true },
    take: 100,
  });

  const names = users
    .map((u) => u.name?.toLowerCase())
    .filter((n): n is string => !!n && n.length > 3);

  let exposures = 0;

  for (const summary of summaries) {
    const text = `${summary.insights || ''} ${summary.strengthAdjustments}`.toLowerCase();

    for (const name of names) {
      if (text.includes(name)) {
        exposures++;
        break;
      }
    }
  }

  if (exposures > 0) {
    return {
      check: 'Summary data maintains anonymity',
      passed: false,
      severity: 'high',
      details: `${exposures} summaries may expose respondent identities`,
      recommendation: 'Review AI prompts to ensure they do not include respondent names',
    };
  }

  return {
    check: 'Summary data maintains anonymity',
    passed: true,
    severity: 'high',
    details: 'No respondent identity exposure found in summaries',
  };
}

/**
 * Check 6: Verify hash algorithm produces consistent results
 */
async function checkHashConsistency(): Promise<AuditCheckResult> {
  // Generate multiple hashes for same input to verify determinism
  const testInputs = [
    { respondentId: 'test-user-1', requestId: 'test-request-1', questionId: 'test-q-1' },
    { respondentId: 'test-user-2', requestId: 'test-request-2', questionId: 'test-q-2' },
  ];

  let inconsistent = 0;

  for (const input of testInputs) {
    const hash1 = generateAnonymousHash(input.respondentId, input.requestId);
    const hash2 = generateAnonymousHash(input.respondentId, input.requestId);

    if (hash1 !== hash2) {
      inconsistent++;
    }
  }

  if (inconsistent > 0) {
    return {
      check: 'Hash generation is deterministic',
      passed: false,
      severity: 'critical',
      details: 'Hash algorithm produces inconsistent results for same input',
      recommendation: 'Review hash generation algorithm for non-deterministic elements',
    };
  }

  return {
    check: 'Hash generation is deterministic',
    passed: true,
    severity: 'critical',
    details: 'Hash algorithm produces consistent results',
  };
}

/**
 * Check 7: Verify minimum response threshold for insights
 */
async function checkMinimumResponseThreshold(): Promise<AuditCheckResult> {
  const summariesBelowThreshold = await prisma.feedbackSummary.count({
    where: {
      totalResponses: { lt: 3 },
      insights: { not: null },
    },
  });

  if (summariesBelowThreshold > 0) {
    return {
      check: 'Minimum response threshold enforced',
      passed: false,
      severity: 'medium',
      details: `${summariesBelowThreshold} users have insights with fewer than 3 responses`,
      recommendation: 'Enforce minimum 3 responses before generating insights',
    };
  }

  return {
    check: 'Minimum response threshold enforced',
    passed: true,
    severity: 'medium',
    details: 'All users with insights have at least 3 responses',
  };
}

/**
 * Run complete anonymization security audit
 */
export async function runAnonymizationAudit(): Promise<AnonymizationAuditReport> {
  const checks: AuditCheckResult[] = await Promise.all([
    checkAnonymousHashPresence(),
    checkHashFormat(),
    checkHashUniqueness(),
    checkNoPIIInResponses(),
    checkSummaryAnonymity(),
    checkHashConsistency(),
    checkMinimumResponseThreshold(),
  ]);

  let criticalIssues = 0;
  let highIssues = 0;
  let mediumIssues = 0;
  let lowIssues = 0;

  for (const check of checks) {
    if (!check.passed) {
      switch (check.severity) {
        case 'critical':
          criticalIssues++;
          break;
        case 'high':
          highIssues++;
          break;
        case 'medium':
          mediumIssues++;
          break;
        case 'low':
          lowIssues++;
          break;
      }
    }
  }

  return {
    timestamp: new Date(),
    overallPassed: criticalIssues === 0 && highIssues === 0,
    criticalIssues,
    highIssues,
    mediumIssues,
    lowIssues,
    checks,
  };
}

/**
 * Log audit results to console (for cron job usage)
 */
export function logAuditResults(report: AnonymizationAuditReport): void {
  const status = report.overallPassed ? '✅ PASSED' : '❌ FAILED';

  console.log(`\n[Anonymization Audit] ${status}`);
  console.log(`Timestamp: ${report.timestamp.toISOString()}`);
  console.log(`Critical: ${report.criticalIssues} | High: ${report.highIssues} | Medium: ${report.mediumIssues} | Low: ${report.lowIssues}`);
  console.log('\nCheck Details:');

  for (const check of report.checks) {
    const icon = check.passed ? '✓' : '✗';
    const color = check.passed ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`  ${color}${icon}${reset} [${check.severity.toUpperCase()}] ${check.check}`);
    console.log(`      ${check.details}`);

    if (!check.passed && check.recommendation) {
      console.log(`      💡 ${check.recommendation}`);
    }
  }

  console.log('');
}
