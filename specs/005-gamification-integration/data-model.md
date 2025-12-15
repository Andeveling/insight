# Data Model: Gamification Integration

**Feature**: 005-gamification-integration  
**Date**: December 14, 2025

## Overview

Este documento define las extensiones al modelo de datos existente para soportar gamificación en Assessment y Feedback. Se aprovechan las estructuras existentes de Feature 004 sin cambios al schema Prisma.

## Existing Models (No Changes Required)

### UserGamification
Modelo central de gamificación ya existente.

```prisma
model UserGamification {
  id               String    @id @default(cuid())
  userId           String    @unique
  xpTotal          Int       @default(0)
  currentLevel     Int       @default(1)
  lastActivityDate DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  badges           UserBadge[]
}
```

**Usage for Integration**:
- `xpTotal` - Se incrementa con assessment y feedback XP
- `currentLevel` - Se recalcula automáticamente
- `lastActivityDate` - Se actualiza para streak bonuses

### Badge
Catálogo de badges disponibles.

```prisma
model Badge {
  id             String      @id @default(cuid())
  slug           String      @unique
  name           String
  description    String
  iconUrl        String?
  tier           String      @default("bronze") // bronze, silver, gold, platinum
  xpReward       Int         @default(0)
  unlockCriteria String      // JSON string
  createdAt      DateTime    @default(now())
  users          UserBadge[]
}
```

**New Badges to Add (via seed)**:

| Slug                   | Name                | Tier   | XP  | Criteria                                               |
| ---------------------- | ------------------- | ------ | --- | ------------------------------------------------------ |
| `explorer_interior`    | Explorador Interior | bronze | 25  | `{"type":"assessment_completed","count":1}`            |
| `generous_mirror`      | Espejo Generoso     | silver | 75  | `{"type":"feedbacks_given","count":3,"periodDays":30}` |
| `active_listener`      | Escucha Activa      | gold   | 150 | `{"type":"feedbacks_received","count":10}`             |
| `continuous_evolution` | Evolución Continua  | silver | 75  | `{"type":"retake_after_feedback","minFeedbacks":2}`    |

### UserBadge
Relación usuario-badge ya existente.

```prisma
model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  badgeId   String
  earnedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge     Badge    @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, badgeId])
}
```

## Extended Types (TypeScript Only)

### XP Source Types
Nueva enum lógica para tracking de fuentes de XP.

```typescript
// lib/types/gamification.types.ts (extensión)

export type XpSource =
  // Assessment sources
  | 'assessment_phase_1'
  | 'assessment_phase_2'
  | 'assessment_complete'
  | 'assessment_retake'
  // Feedback sources
  | 'feedback_given'
  | 'feedback_received'
  | 'feedback_insights'
  | 'feedback_applied'
  // Existing development sources
  | 'challenge_completed'
  | 'module_completed'
  | 'collaborative_bonus';
```

### Badge Criteria Types
Extensión del sistema de criterios de badges.

```typescript
// lib/types/badge-criteria.types.ts (extensión)

export interface AssessmentCompletedCriteria {
  type: 'assessment_completed';
  count: number;
}

export interface FeedbacksGivenCriteria {
  type: 'feedbacks_given';
  count: number;
  periodDays?: number; // Opcional: dentro de X días
}

export interface FeedbacksReceivedCriteria {
  type: 'feedbacks_received';
  count: number;
}

export interface RetakeAfterFeedbackCriteria {
  type: 'retake_after_feedback';
  minFeedbacks: number; // Mínimo feedbacks recibidos antes de retake
}

export type BadgeCriteria =
  | ModulesCompletedCriteria
  | ChallengesCompletedCriteria
  | XpEarnedCriteria
  | AssessmentCompletedCriteria    // New
  | FeedbacksGivenCriteria         // New
  | FeedbacksReceivedCriteria      // New
  | RetakeAfterFeedbackCriteria;   // New
```

## Existing Models to Extend (JSON Fields)

### AssessmentSession.results Extension
Agregar tracking de XP otorgado en el campo JSON existente.

```typescript
// Existing AssessmentSession.results structure (extended)
interface AssessmentSessionResults {
  // Existing fields...
  phaseResults: PhaseResult[];
  
  // New gamification tracking
  xpAwarded?: {
    phase1?: boolean;
    phase2?: boolean;
    completion?: boolean;
    retakeBonus?: boolean;
  };
}
```

### FeedbackRequest/Response Tracking
Sin cambios al schema - tracking via queries.

```typescript
// Se determina si ya se otorgó XP consultando:
// - Para feedback dado: existencia de XP event en logs (opcional)
// - Para feedback recibido: timestamp de última award vs response createdAt
```

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
├─────────────────────────────────────────────────────────────┤
│ id                                                          │
└─────────────────┬─────────────────────────┬─────────────────┘
                  │                         │
                  ▼                         ▼
┌─────────────────────────┐   ┌─────────────────────────────────┐
│    UserGamification     │   │      AssessmentSession          │
├─────────────────────────┤   ├─────────────────────────────────┤
│ xpTotal (acumulativo)   │   │ results.xpAwarded (tracking)    │
│ currentLevel            │   │ phase (1, 2, 3)                 │
│ lastActivityDate        │   │ status (completed)              │
└─────────┬───────────────┘   └─────────────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│      UserBadge          │
├─────────────────────────┤
│ badgeId → Badge         │
│ earnedAt                │
└─────────────────────────┘
          │
          ▼
┌─────────────────────────┐
│        Badge            │
├─────────────────────────┤
│ explorer_interior       │
│ generous_mirror         │
│ active_listener         │
│ continuous_evolution    │
└─────────────────────────┘
```

## Validation Rules

### XP Award Validation
```typescript
interface XpAwardValidation {
  // Assessment
  assessmentPhase1: {
    requires: 'completed phase 1 (20 questions)',
    maxAwards: 1, // Por session
  };
  assessmentPhase2: {
    requires: 'completed phase 2 (50 questions total)',
    maxAwards: 1,
  };
  assessmentComplete: {
    requires: 'completed phase 3 (60 questions total)',
    maxAwards: 1,
  };
  
  // Feedback
  feedbackGiven: {
    requires: 'submitted response for a strength',
    maxAwards: 1, // Per FeedbackRequestStrength
  };
  feedbackReceived: {
    requires: 'response received on own request',
    maxAwards: 1, // Per FeedbackResponse
  };
}
```

### Badge Unlock Validation
```typescript
interface BadgeUnlockValidation {
  explorer_interior: {
    check: 'COUNT(AssessmentSession WHERE status=completed) >= 1',
  };
  generous_mirror: {
    check: 'COUNT(FeedbackResponse WHERE createdAt > now()-30days) >= 3',
  };
  active_listener: {
    check: 'COUNT(FeedbackResponse ON own requests) >= 10',
  };
  continuous_evolution: {
    check: 'AssessmentSession.isRetake=true AND received 2+ feedbacks before retake',
  };
}
```

## State Transitions

### Assessment XP Flow
```
Session Created → Phase 1 Complete → [Award Phase 1 XP]
                → Phase 2 Complete → [Award Phase 2 XP]  
                → Phase 3 Complete → [Award Completion XP]
                                   → [Check Badges]
```

### Feedback XP Flow
```
Response Submitted → [Award Feedback Given XP]
                   → [Check Generous Mirror Badge]

Response Received → [Award Feedback Received XP]
                  → [If 3+ responses: Award Insights XP]
                  → [Check Active Listener Badge]
```

## Queries Needed

### Get User Stats for Badge Evaluation
```typescript
async function getUserGamificationStats(userId: string) {
  const [assessmentCount, feedbackGivenCount, feedbackReceivedCount] = await Promise.all([
    // Assessments completados
    prisma.assessmentSession.count({
      where: { userId, status: 'completed' }
    }),
    // Feedbacks dados (últimos 30 días para generous_mirror)
    prisma.feedbackResponse.count({
      where: { 
        userId,
        createdAt: { gte: subDays(new Date(), 30) }
      }
    }),
    // Feedbacks recibidos (en requests propios)
    prisma.feedbackResponse.count({
      where: {
        feedbackRequest: { requesterId: userId }
      }
    })
  ]);

  return { assessmentCount, feedbackGivenCount, feedbackReceivedCount };
}
```

## Migration Notes

**No schema migrations required** - Esta feature usa:
1. Modelos existentes de Feature 004 (UserGamification, Badge, UserBadge)
2. Campos JSON existentes para tracking adicional
3. Nuevos badges agregados via seed data

**Seed Data Required**:
- 4 nuevos badges en `prisma/data/badges.data.ts`
