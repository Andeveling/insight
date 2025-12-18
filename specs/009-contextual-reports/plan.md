# Implementation Plan: Contextual Reports System

**Branch**: `009-contextual-reports` | **Date**: 17 de diciembre de 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/009-contextual-reports/spec.md`

---

## Summary

Refactorizar el sistema de reportes para requerir **contexto de progreso** antes de habilitarse. Los reportes individuales requieren actividad mínima (3 módulos, 100 XP, 5 challenges). Los reportes de equipo requieren ≥60% de miembros con progreso suficiente. El sistema se conecta armónicamente con el módulo de development reutilizando sus actions existentes.

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Framework**: Next.js 16 (App Router, React Server Components, Turbopack)  
**Primary Dependencies**: Prisma ORM, Vercel AI SDK, Zod, React Hook Form  
**Storage**: Turso (libSQL) via Prisma  
**Testing**: Vitest (unit), Playwright (e2e)  
**Target Platform**: Web (SSR/RSC)  
**Project Type**: Web application (monorepo structure with feature-first organization)  
**Performance Goals**: Readiness calculation < 100ms, Report generation < 30s  
**Constraints**: AI tokens managed via existing cache strategy (30-day regeneration policy)  
**Scale/Scope**: ~100 users initial, ~10 teams, existing gamification system

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Human-First Design** | ✅ PASS | Readiness dashboard empowers users to understand what's needed; no hidden gates |
| **II. Positive Psychology Foundation** | ✅ PASS | Readiness framed as "progress toward insight" not "blocked from feature"; XP rewards reinforce positive behavior |
| **III. Feature-First Architecture** | ✅ PASS | All readiness logic co-located in `app/dashboard/reports/`; reuses development actions via imports |
| **IV. AI-Augmented Insights** | ✅ PASS | Extended prompts validated with Zod; AI context clearly distinguished from objective data |
| **V. Behavioral Design** | ✅ PASS | Readiness indicator is meaningful trigger tied to actual progress; rewards tied to real achievement |
| **VI. Type Safety** | ✅ PASS | New schemas defined with Zod; no `any` types; explicit interfaces |

**Gate Result**: ✅ PASS - Proceed to Phase 0

---

## Project Structure

### Documentation (this feature)

```text
specs/009-contextual-reports/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── readiness.schema.ts
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/dashboard/reports/
├── page.tsx                          # Refactored: adds readiness cards
├── _actions/
│   ├── index.ts                      # Add new exports
│   ├── get-individual-readiness.ts   # NEW: Calculate individual readiness
│   ├── get-team-readiness.ts         # NEW: Calculate team readiness
│   ├── generate-individual-report.action.ts  # MODIFIED: Add context enrichment
│   └── generate-team-report.action.ts        # MODIFIED: Add context enrichment
├── _components/
│   ├── index.ts                      # Add new exports
│   ├── readiness-dashboard.tsx       # NEW: Circular progress + requirements list
│   ├── readiness-requirement.tsx     # NEW: Individual requirement row
│   ├── report-readiness-card.tsx     # NEW: Card for /dashboard/reports page
│   └── team-member-readiness.tsx     # NEW: Member status for team reports
├── _lib/
│   ├── ai-prompts.ts                 # MODIFIED: Add development context sections
│   └── readiness-calculator.ts       # NEW: Pure functions for threshold logic
├── _schemas/
│   ├── index.ts                      # Add new exports
│   └── readiness.schema.ts           # NEW: Zod schemas for readiness
├── individual/
│   └── page.tsx                      # MODIFIED: Add readiness gate
└── team/
    └── page.tsx                      # MODIFIED: Add readiness gate

lib/
├── constants/
│   └── report-thresholds.ts          # NEW: Configurable threshold constants
└── types/
    └── report-readiness.types.ts     # NEW: TypeScript interfaces
```

**Structure Decision**: Feature-first organization maintained. All readiness logic lives in `reports/` feature directory. Shared constants in `lib/constants/`. Reuses existing `development/_actions/` via direct imports (no duplication).

---

## Phase 0: Research

### Research Tasks

1. **Existing development actions API surface**
   - Which functions from `development/_actions/` can be directly reused?
   - What data structures do they return?

2. **Current report generation flow**
   - How does the existing cache/regeneration policy work?
   - Where to inject development context into prompts?

3. **Gamification integration points**
   - How to award XP for report generation?
   - How to create new badges for "Insight Desbloqueado"?

### Findings

#### 1. Development Actions Available for Reuse

| Action | What it provides | Reuse for Readiness |
|--------|------------------|---------------------|
| `getUserProgress()` | XP, level, modules completed, challenges completed, badges, streak | ✅ Primary source for individual readiness |
| `getModules()` | List of modules with completion status | ✅ For detailed module context in prompts |
| `getBadges()` | User's unlocked badges | ✅ For prompt context and badge count |
| `getModulesCompletionStats()` | Aggregated completion stats | ✅ For team-level aggregation |

**Decision**: Import directly from `app/dashboard/development/_actions`. No wrapper needed.

#### 2. Report Generation Flow

Current flow in `generate-individual-report.action.ts`:
1. Fetch user + strengths + profile + team
2. Check existing report (cache policy: 30 days or strength change)
3. Build `IndividualPromptContext` with user data
4. Call `generateObject()` with AI SDK
5. Save report with version tracking

**Integration point**: Extend `IndividualPromptContext` interface to include `developmentProgress` field. Modify prompt builder to include new section.

#### 3. Gamification Integration

Existing patterns from development feature:
- XP awarded via `awardXP()` from `lib/services/xp-calculator.service.ts`
- Badges created via `checkBadgeUnlock()` from `development/_actions/check-badge-unlock.ts`
- New badges require seed data in `prisma/data/badges.data.ts`

**Decision**: 
- Create 2 new badges: `INSIGHT_INDIVIDUAL`, `INSIGHT_TEAM`
- Use existing `awardXP()` service
- Trigger badge check after successful report generation

---

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md) for full entity definitions.

**Key Entities**:

```typescript
// Readiness score for a report (not persisted - calculated on demand)
interface ReportReadiness {
  type: 'individual' | 'team';
  score: number;              // 0-100
  isReady: boolean;           // score >= threshold
  requirements: Requirement[];
  calculatedAt: Date;
}

interface Requirement {
  id: string;
  label: string;
  current: number;
  target: number;
  met: boolean;
  priority: 'required' | 'bonus';
}

// Extended context for AI prompts
interface DevelopmentContext {
  modulesCompleted: ModuleSummary[];
  challengesCompleted: ChallengeSummary[];
  currentLevel: number;
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  badgesUnlocked: BadgeSummary[];
}
```

### Contracts

See [contracts/readiness.schema.ts](./contracts/readiness.schema.ts) for Zod schemas.

### Threshold Configuration

```typescript
// lib/constants/report-thresholds.ts
export const INDIVIDUAL_REPORT_THRESHOLDS = {
  MODULES_COMPLETED: 3,
  XP_TOTAL: 100,
  CHALLENGES_COMPLETED: 5,
  HAS_STRENGTHS: true,  // Boolean requirement
} as const;

export const TEAM_REPORT_THRESHOLDS = {
  MEMBER_READINESS_PERCENT: 60,  // % of members with individual readiness >= 50%
  MIN_ACTIVE_MEMBERS: 3,
} as const;

export const REPORT_XP_REWARDS = {
  FIRST_INDIVIDUAL_REPORT: 50,
  FIRST_TEAM_REPORT_GENERATOR: 75,
  FIRST_TEAM_REPORT_CONTRIBUTOR: 25,
} as const;
```

---

## Phase 1: Quickstart

See [quickstart.md](./quickstart.md) for step-by-step implementation guide.

### Implementation Order

1. **Schemas & Types** (30 min)
   - Create `_schemas/readiness.schema.ts`
   - Create `lib/types/report-readiness.types.ts`
   - Create `lib/constants/report-thresholds.ts`

2. **Readiness Calculator** (1 hour)
   - Create `_lib/readiness-calculator.ts` with pure functions
   - Unit tests for threshold logic

3. **Server Actions** (2 hours)
   - Create `get-individual-readiness.ts`
   - Create `get-team-readiness.ts`
   - Update barrel exports

4. **UI Components** (3 hours)
   - Create `readiness-dashboard.tsx`
   - Create `readiness-requirement.tsx`
   - Create `report-readiness-card.tsx`
   - Create `team-member-readiness.tsx`

5. **Page Integration** (2 hours)
   - Refactor `reports/page.tsx` with readiness cards
   - Refactor `reports/individual/page.tsx` with gate
   - Refactor `reports/team/page.tsx` with gate

6. **AI Prompt Enrichment** (2 hours)
   - Extend `_lib/ai-prompts.ts` with development context
   - Modify `generate-individual-report.action.ts`
   - Modify `generate-team-report.action.ts`

7. **Gamification** (1 hour)
   - Add badge seed data
   - Add XP rewards on generation
   - Add badge unlock check

8. **Testing & Polish** (2 hours)
   - Integration tests
   - UI polish and animations

**Total Estimated Time**: ~13 hours

---

## Constitution Re-Check (Post-Design)

| Principle | Status | Verification |
|-----------|--------|--------------|
| **I. Human-First Design** | ✅ PASS | Readiness UI clearly shows progress; CTA links to modules |
| **II. Positive Psychology** | ✅ PASS | Language is "X of Y complete" not "blocked"; XP rewards celebrate progress |
| **III. Feature-First** | ✅ PASS | All new code in `reports/` feature; reuses development actions |
| **IV. AI-Augmented** | ✅ PASS | Context clearly labeled; Zod validates extended schema |
| **V. Behavioral Design** | ✅ PASS | Circular progress is meaningful trigger; no manipulation |
| **VI. Type Safety** | ✅ PASS | All interfaces defined; Zod schemas for validation |

**Final Gate Result**: ✅ PASS - Proceed to Phase 2 (tasks)

---

## Complexity Tracking

No constitution violations. No complexity justification needed.

---

## Dependencies Graph

```
lib/constants/report-thresholds.ts (NEW)
       ↓
_lib/readiness-calculator.ts (NEW)
       ↓
_actions/get-individual-readiness.ts (NEW)
       ↓ imports from
development/_actions/getUserProgress()
       ↓
_components/readiness-dashboard.tsx (NEW)
       ↓
individual/page.tsx (MODIFIED)
       ↓
_actions/generate-individual-report.action.ts (MODIFIED)
       ↓ extended with
_lib/ai-prompts.ts (MODIFIED)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Thresholds too high for new users | Medium | High (frustration) | Configurable constants; A/B test values |
| AI prompt exceeds token limit | Low | Medium | Summarize development context; limit to top 5 modules |
| Team readiness calculation slow | Low | Low | Already using Prisma batching; can add cache if needed |
| Users bypass gate via direct URL | Low | Low | Server-side check in generate action |

---

## Next Steps

1. ✅ Phase 0: Research complete
2. ✅ Phase 1: Design complete
3. 🔜 Generate detailed artifacts:
   - Create `research.md`
   - Create `data-model.md`
   - Create `contracts/readiness.schema.ts`
   - Create `quickstart.md`
4. 🔜 Phase 2: Run `/speckit.tasks` to generate implementation tasks
