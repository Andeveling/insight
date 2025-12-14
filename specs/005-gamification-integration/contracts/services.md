# Service Contracts: Gamification Integration

**Feature**: 005-gamification-integration  
**Date**: December 14, 2025  
**Type**: Internal Service API (Server Actions)

## Overview

Esta feature no expone APIs REST públicas. Todas las operaciones de gamificación se ejecutan vía Server Actions de Next.js y servicios internos. Este documento define los contratos de esos servicios.

---

## Shared Services

### GamificationService

Ubicación: `lib/services/gamification.service.ts`

#### awardXp

Awards XP to a user with optional streak bonus.

```typescript
/**
 * @function awardXp
 * @description Awards XP to a user, applies streak bonuses, and updates level
 */
interface AwardXpParams {
  userId: string;
  amount: number;
  source: XpSource;
  applyStreakBonus?: boolean; // Default: true
}

interface AwardXpResult {
  xpAwarded: number;        // Final XP after bonuses
  baseXp: number;           // Original amount before bonuses
  streakMultiplier: number; // 1.0, 1.1, 1.25, 1.5, or 2.0
  totalXp: number;          // User's new total XP
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
}

async function awardXp(params: AwardXpParams): Promise<AwardXpResult>
```

**Error Handling**:
| Error                | Description           |
| -------------------- | --------------------- |
| `UserNotFoundError`  | userId does not exist |
| `InvalidAmountError` | amount <= 0           |

---

#### checkBadgeUnlocks

Evaluates and unlocks any eligible badges for a user.

```typescript
/**
 * @function checkBadgeUnlocks
 * @description Checks if user meets criteria for any unclaimed badges
 */
interface BadgeCheckContext {
  assessmentCompleted?: boolean;
  feedbackGiven?: boolean;
  feedbackReceived?: boolean;
  isRetake?: boolean;
}

interface UnlockedBadge {
  badge: {
    id: string;
    slug: string;
    name: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    xpReward: number;
    iconUrl: string | null;
  };
  earnedAt: Date;
}

async function checkBadgeUnlocks(
  userId: string,
  context: BadgeCheckContext
): Promise<UnlockedBadge[]>
```

**Behavior**:
- Returns only newly unlocked badges (not previously earned)
- Automatically awards XP for each unlocked badge
- Idempotent: calling multiple times with same context returns empty array

---

#### ensureGamificationRecord

Creates a UserGamification record if it doesn't exist.

```typescript
/**
 * @function ensureGamificationRecord
 * @description Ensures user has a gamification record, creating one if needed
 */
async function ensureGamificationRecord(userId: string): Promise<UserGamification>
```

**Behavior**:
- Returns existing record if present
- Creates new record with defaults if not present
- Used as initialization step before any XP operation

---

## Feature-Local Actions

### Assessment Actions

Ubicación: `app/dashboard/assessment/_actions/`

#### awardAssessmentXp

Awards XP for assessment progress.

```typescript
/**
 * @action awardAssessmentXp
 * @location app/dashboard/assessment/_actions/award-assessment-xp.ts
 */
interface AwardAssessmentXpInput {
  sessionId: string;
  milestone: 'phase_1' | 'phase_2' | 'completion';
}

interface AwardAssessmentXpResult {
  success: boolean;
  xpResult?: AwardXpResult;
  unlockedBadges?: UnlockedBadge[];
  alreadyAwarded?: boolean;
  error?: string;
}

async function awardAssessmentXp(
  input: AwardAssessmentXpInput
): Promise<AwardAssessmentXpResult>
```

**Validation**:
- Session must belong to current user
- Milestone must not have been previously awarded (check results.xpAwarded)
- Session must have reached the milestone

**XP Values**:
| Milestone  | XP  |
| ---------- | --- |
| phase_1    | 100 |
| phase_2    | 150 |
| completion | 250 |

---

### Feedback Actions

Ubicación: `app/dashboard/feedback/_actions/`

#### awardFeedbackGivenXp

Awards XP when user provides feedback to another user.

```typescript
/**
 * @action awardFeedbackGivenXp
 * @location app/dashboard/feedback/_actions/award-feedback-xp.ts
 */
interface AwardFeedbackGivenXpInput {
  responseId: string;
}

interface AwardFeedbackGivenXpResult {
  success: boolean;
  xpResult?: AwardXpResult;
  unlockedBadges?: UnlockedBadge[];
  alreadyAwarded?: boolean;
  error?: string;
}

async function awardFeedbackGivenXp(
  input: AwardFeedbackGivenXpInput
): Promise<AwardFeedbackGivenXpResult>
```

**Validation**:
- Response must belong to current user
- XP must not have been previously awarded for this response

**XP Values**: 75 XP per feedback given

---

#### awardFeedbackReceivedXp

Awards XP when user receives feedback.

```typescript
/**
 * @action awardFeedbackReceivedXp  
 * @location app/dashboard/feedback/_actions/award-feedback-xp.ts
 */
interface AwardFeedbackReceivedXpInput {
  requestId: string;
  responseId: string;
}

interface AwardFeedbackReceivedXpResult {
  success: boolean;
  xpResult?: AwardXpResult;
  insightsBonus?: boolean;   // True if 3+ responses unlocked insights
  insightsBonusXp?: number;  // 50 XP if applicable
  unlockedBadges?: UnlockedBadge[];
  error?: string;
}

async function awardFeedbackReceivedXp(
  input: AwardFeedbackReceivedXpInput
): Promise<AwardFeedbackReceivedXpResult>
```

**Validation**:
- Request must belong to current user
- Response must be new (not previously processed)

**XP Values**:
- 25 XP per feedback received
- 50 XP bonus when reaching 3+ responses (insights unlocked)

---

## Component Props Contracts

### XpGainToast

```typescript
interface XpGainToastProps {
  xpAmount: number;
  source: string;           // Human-readable: "Assessment Phase 1", "Feedback"
  streakBonus?: number;     // Percentage: 10, 25, 50, 100
  leveledUp?: boolean;
  newLevel?: number;
  onComplete?: () => void;  // Called when animation finishes
}
```

### LevelUpNotification

```typescript
interface LevelUpNotificationProps {
  previousLevel: number;
  newLevel: number;
  levelName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

### BadgeUnlockModal

```typescript
interface BadgeUnlockModalProps {
  badge: {
    name: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    xpReward: number;
    iconUrl?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

### XpPreviewCard

```typescript
interface XpPreviewCardProps {
  potentialXp: number;
  label: string;            // "Completa la fase para ganar"
  streakMultiplier?: number;
  compact?: boolean;
}
```

---

## Constants Contract

### XP Rewards

```typescript
// lib/constants/xp-rewards.ts

export const ASSESSMENT_XP_REWARDS = {
  PHASE_1_COMPLETE: 100,
  PHASE_2_COMPLETE: 150,
  ASSESSMENT_COMPLETE: 250,
  ASSESSMENT_RETAKE: 200,
} as const;

export const FEEDBACK_XP_REWARDS = {
  FEEDBACK_GIVEN: 75,
  FEEDBACK_RECEIVED: 25,
  INSIGHTS_UNLOCKED: 50,
  FEEDBACK_APPLIED: 30,
} as const;

export const BADGE_XP_REWARDS = {
  BRONZE: 25,
  SILVER: 75,
  GOLD: 150,
  PLATINUM: 250,
} as const;

export type AssessmentXpReward = typeof ASSESSMENT_XP_REWARDS[keyof typeof ASSESSMENT_XP_REWARDS];
export type FeedbackXpReward = typeof FEEDBACK_XP_REWARDS[keyof typeof FEEDBACK_XP_REWARDS];
```

---

## Integration Points

### Assessment → Gamification

```
complete-phase.ts (existing)
  ↓ calls
awardAssessmentXp (new)
  ↓ calls
gamification.service.awardXp
  ↓ calls
gamification.service.checkBadgeUnlocks
  ↓ returns
{ xpResult, unlockedBadges }
```

### Feedback → Gamification

```
submit-response.ts (existing)
  ↓ calls
awardFeedbackGivenXp (new)
  ↓ calls
gamification.service.awardXp
  ↓ calls
gamification.service.checkBadgeUnlocks
  ↓ returns
{ xpResult, unlockedBadges }
```

---

## Error Codes

| Code               | Description         | HTTP Status (if API) |
| ------------------ | ------------------- | -------------------- |
| `GAMIFICATION_001` | User not found      | N/A (Server Action)  |
| `GAMIFICATION_002` | Invalid XP amount   | N/A                  |
| `GAMIFICATION_003` | Already awarded     | N/A                  |
| `GAMIFICATION_004` | Session not found   | N/A                  |
| `GAMIFICATION_005` | Unauthorized access | N/A                  |
