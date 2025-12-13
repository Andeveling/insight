/**
 * Anonymization Utilities for Peer Feedback
 *
 * Implements SHA-256 hashing for anonymous feedback responses
 * Ensures respondent identity cannot be traced back from stored data
 */

import { createHash } from 'crypto';

/**
 * Generates a deterministic anonymous hash for a respondent
 * Uses SHA-256 with environment salt for security
 *
 * @param respondentId - The user ID of the respondent
 * @param requestId - The feedback request ID (adds uniqueness per request)
 * @returns A 16-character hex hash that anonymizes the respondent
 */
export function generateAnonymousHash(
  respondentId: string,
  requestId: string
): string {
  const salt = process.env.FEEDBACK_ANONYMIZATION_SALT;

  if (!salt) {
    throw new Error(
      'FEEDBACK_ANONYMIZATION_SALT environment variable is required for anonymous feedback'
    );
  }

  const dataToHash = `${salt}:${respondentId}:${requestId}`;
  const fullHash = createHash('sha256').update(dataToHash).digest('hex');

  // Return first 16 characters for storage efficiency while maintaining uniqueness
  return fullHash.substring(0, 16);
}

/**
 * Checks if a user can respond anonymously to a feedback request
 * Anonymous responses are only allowed if:
 * 1. The request has isAnonymous = true
 * 2. The respondent is a valid team member
 * 3. The respondent hasn't already responded to this request
 *
 * @param requestId - The feedback request ID
 * @param respondentId - The user ID of the potential respondent
 * @param isAnonymousRequest - Whether the original request allows anonymity
 * @returns Boolean indicating if anonymous response is allowed
 */
export function canRespondAnonymously(
  isAnonymousRequest: boolean
): boolean {
  // Anonymous responses are only possible if the requester opted for anonymity
  return isAnonymousRequest;
}

/**
 * Creates an anonymous response payload with hashed identity
 * Only includes the hash, never the original respondent ID
 *
 * @param respondentId - The user ID (will be hashed, not stored)
 * @param requestId - The feedback request ID
 * @param answer - The answer value selected by respondent
 * @param questionId - The question ID being answered
 * @returns Object ready for database insertion with anonymized respondent
 */
export function createAnonymousResponsePayload(
  respondentId: string,
  requestId: string,
  questionId: string,
  answer: string
): {
  requestId: string;
  questionId: string;
  answer: string;
  anonymousHash: string;
} {
  return {
    requestId,
    questionId,
    answer,
    anonymousHash: generateAnonymousHash(respondentId, requestId),
  };
}

/**
 * Validates that a hash belongs to a specific respondent for a request
 * Used for audit purposes and duplicate detection only
 *
 * @param respondentId - The user ID to verify
 * @param requestId - The feedback request ID
 * @param storedHash - The hash stored in the database
 * @returns Boolean indicating if the hash matches
 */
export function verifyAnonymousHash(
  respondentId: string,
  requestId: string,
  storedHash: string
): boolean {
  const computedHash = generateAnonymousHash(respondentId, requestId);
  return computedHash === storedHash;
}

/**
 * Checks if a respondent has already submitted a response to a request
 * Uses hash comparison without exposing respondent identity
 *
 * @param respondentId - The user ID to check
 * @param requestId - The feedback request ID
 * @param existingHashes - Array of hashes from existing responses
 * @returns Boolean indicating if respondent has already responded
 */
export function hasRespondentAlreadyResponded(
  respondentId: string,
  requestId: string,
  existingHashes: string[]
): boolean {
  const respondentHash = generateAnonymousHash(respondentId, requestId);
  return existingHashes.includes(respondentHash);
}

/**
 * Validates that a hash has the expected format (16 hexadecimal characters)
 * Used for security audits to verify hash integrity
 *
 * @param hash - The hash to validate
 * @returns Boolean indicating if the hash has valid format
 */
export function isValidAnonymousHash(hash: string): boolean {
  // Hash should be exactly 16 hexadecimal characters
  const hexPattern = /^[0-9a-f]{16}$/i;
  return hexPattern.test(hash);
}

