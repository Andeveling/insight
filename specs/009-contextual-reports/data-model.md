# Data Model: Contextual Reports System

**Feature**: 009-contextual-reports  
**Date**: 17 de diciembre de 2025  
**Status**: Complete

---

## Overview

Este feature **no requiere nuevas tablas en la base de datos**. El concepto de "readiness" es calculado en tiempo real basándose en datos existentes. Los únicos cambios de datos son:

1. **Badges nuevos** (seed data)
2. **Campo opcional en metadata de Report** (para marcar versión contextualizada)

---

## Entities

### ReportReadiness (Calculated - Not Persisted)

Representa el estado de preparación para generar un reporte. Se calcula on-demand.

```typescript
/**
 * Report readiness score and requirements
 * This is NOT a database entity - it's calculated at runtime
 */
interface ReportReadiness {
  /** Type of report being evaluated */
  type: 'individual' | 'team';
  
  /** Readiness score from 0-100 */
  score: number;
  
  /** Whether all required thresholds are met */
  isReady: boolean;
  
  /** Individual requirements with their status */
  requirements: Requirement[];
  
  /** When this readiness was calculated */
  calculatedAt: Date;
  
  /** For team reports: breakdown by member */
  memberBreakdown?: TeamMemberReadiness[];
}

interface Requirement {
  /** Unique identifier for the requirement */
  id: string;
  
  /** Human-readable label (Spanish) */
  label: string;
  
  /** Current value achieved */
  current: number;
  
  /** Target value needed */
  target: number;
  
  /** Whether this requirement is met */
  met: boolean;
  
  /** Whether this is required or bonus */
  priority: 'required' | 'bonus';
  
  /** Icon identifier for UI */
  icon: 'modules' | 'xp' | 'challenges' | 'strengths' | 'streak';
  
  /** Link to complete this requirement (optional) */
  actionUrl?: string;
}

interface TeamMemberReadiness {
  userId: string;
  userName: string;
  userAvatar?: string;
  individualScore: number;
  isReady: boolean;
}
```

---

### DevelopmentContext (Extended Prompt Data)

Contexto de desarrollo incluido en el prompt de IA para reportes contextualizados.

```typescript
/**
 * Development progress context for AI report generation
 * Attached to report prompts when user meets readiness thresholds
 */
interface DevelopmentContext {
  /** User's current level */
  level: number;
  
  /** User's level name (e.g., "Explorador") */
  levelName: string;
  
  /** Total XP accumulated */
  xpTotal: number;
  
  /** Current streak in days */
  currentStreak: number;
  
  /** Longest streak achieved */
  longestStreak: number;
  
  /** Summary of completed modules */
  modulesCompleted: ModuleSummary[];
  
  /** Total challenges completed count */
  challengesCompletedCount: number;
  
  /** Badges unlocked (names only for prompt) */
  badgesUnlocked: string[];
}

interface ModuleSummary {
  /** Module name */
  name: string;
  
  /** Related strength name */
  strengthName: string;
  
  /** When it was completed */
  completedAt: Date;
  
  /** Number of challenges completed in this module */
  challengesCompleted: number;
}
```

---

### Report Metadata Extension

El modelo `Report` existente tiene un campo `metadata: String?` (JSON). Extendemos su estructura:

```typescript
/**
 * Extended metadata for contextual reports
 * Stored as JSON string in Report.metadata
 */
interface ReportMetadata {
  /** Existing field: hash of strengths at generation time */
  strengthsHash?: string;
  
  /** Existing field: when generated */
  generatedAt?: string;
  
  /** NEW: Version of report schema */
  schemaVersion: 1 | 2;
  
  /** NEW: Whether development context was included */
  hasContext: boolean;
  
  /** NEW: Snapshot of context at generation time */
  contextSnapshot?: {
    level: number;
    xpTotal: number;
    modulesCount: number;
    challengesCount: number;
    badgesCount: number;
  };
}
```

**Migration**: Reportes existentes sin `schemaVersion` se consideran v1. Nuevos reportes con contexto son v2.

---

### Badge Seed Data

Nuevos badges a agregar en `prisma/data/badges.data.ts`:

```typescript
// Add to existing badges array
{
  id: 'INSIGHT_INDIVIDUAL',
  name: 'Insight Desbloqueado',
  description: 'Generaste tu primer reporte individual con contexto de desarrollo',
  imageUrl: '/badges/insight-individual.svg',
  tier: 'SILVER',
  category: 'ACHIEVEMENT',
  xpReward: 50,
  criteria: {
    type: 'REPORT_GENERATED',
    reportType: 'individual',
    contextRequired: true,
  },
  isActive: true,
},
{
  id: 'INSIGHT_TEAM',
  name: 'Insight de Equipo',
  description: 'Contribuiste al primer reporte de equipo contextualizado',
  imageUrl: '/badges/insight-team.svg',
  tier: 'BRONZE',
  category: 'COLLABORATION',
  xpReward: 25,
  criteria: {
    type: 'TEAM_REPORT_CONTRIBUTION',
    contextRequired: true,
  },
  isActive: true,
}
```

---

## Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXISTING ENTITIES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User ──────┬──────> UserGamification (xp, level, streak)      │
│             │                                                   │
│             ├──────> UserModuleProgress[] (modules completed)  │
│             │                                                   │
│             ├──────> UserChallengeProgress[] (challenges)      │
│             │                                                   │
│             ├──────> UserBadge[] (badges unlocked)             │
│             │                                                   │
│             ├──────> UserStrength[] (from assessment)          │
│             │                                                   │
│             └──────> Report[] (generated reports)              │
│                          │                                      │
│                          └──> metadata (JSON) ← EXTENDED        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CALCULATED AT RUNTIME                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  getUserProgress() ──────> ReportReadiness (not persisted)     │
│         │                         │                             │
│         │                         ├──> score                    │
│         │                         ├──> requirements[]           │
│         │                         └──> isReady                  │
│         │                                                       │
│         └──────────────────────> DevelopmentContext             │
│                                        │                        │
│                                        └──> Included in prompt  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Validation Rules

### Individual Readiness Thresholds

| Field | Rule | Source |
|-------|------|--------|
| `modulesCompleted` | `>= 3` | `UserModuleProgress.status = 'completed'` |
| `xpTotal` | `>= 100` | `UserGamification.xpTotal` |
| `challengesCompleted` | `>= 5` | `UserChallengeProgress.completed = true` |
| `hasStrengths` | `= true` | `UserStrength.length > 0` |

### Team Readiness Thresholds

| Field | Rule | Source |
|-------|------|--------|
| `memberReadinessPercent` | `>= 60%` | % of members with individual score >= 50 |
| `activeMembers` | `>= 3` | `TeamMember.count` |

### Score Calculation

```typescript
// Individual score: weighted average of requirements
const WEIGHTS = {
  modules: 30,     // 30% weight
  xp: 25,          // 25% weight
  challenges: 25,  // 25% weight
  strengths: 20,   // 20% weight (boolean: 0 or 20)
};

function calculateIndividualScore(progress: UserProgress): number {
  const moduleScore = Math.min(progress.modulesCompleted / 3, 1) * WEIGHTS.modules;
  const xpScore = Math.min(progress.xpTotal / 100, 1) * WEIGHTS.xp;
  const challengeScore = Math.min(progress.challengesCompleted / 5, 1) * WEIGHTS.challenges;
  const strengthScore = progress.hasStrengths ? WEIGHTS.strengths : 0;
  
  return Math.round(moduleScore + xpScore + challengeScore + strengthScore);
}

// Team score: percentage of members ready
function calculateTeamScore(members: TeamMemberReadiness[]): number {
  const readyMembers = members.filter(m => m.individualScore >= 50).length;
  return Math.round((readyMembers / members.length) * 100);
}
```

---

## State Transitions

### Report States

```
┌──────────────┐    User meets     ┌──────────────┐
│  NOT_READY   │ ──────────────>   │    READY     │
│  (blocked)   │    thresholds     │  (can gen)   │
└──────────────┘                   └──────────────┘
                                          │
                                   Click generate
                                          │
                                          v
                                   ┌──────────────┐
                                   │  GENERATING  │
                                   │   (AI call)  │
                                   └──────────────┘
                                          │
                               ┌──────────┴──────────┐
                               │                     │
                               v                     v
                        ┌──────────────┐      ┌──────────────┐
                        │  COMPLETED   │      │   FAILED     │
                        │  (v2 + XP)   │      │  (retry ok)  │
                        └──────────────┘      └──────────────┘
```

### Readiness Score Lifecycle

```
0%  ──> Assessment done ──> 20% (strengths ✓)
20% ──> 1st challenge  ──> 25%
25% ──> 1st module     ──> 35%
35% ──> 3 challenges   ──> 50%
50% ──> 2nd module     ──> 65%
65% ──> 5 challenges   ──> 75%
75% ──> 3rd module     ──> 85%
85% ──> 100 XP reached ──> 100% ✓ READY
```

---

## No Schema Migration Required

Este feature no requiere `prisma migrate` porque:

1. `ReportReadiness` es calculado, no persistido
2. `DevelopmentContext` es ephemeral (solo en prompt)
3. `Report.metadata` ya es JSON flexible
4. Badges son seed data, no schema change

**Única acción de datos**: Agregar badges al seed file y ejecutar `bunx prisma db seed`.
