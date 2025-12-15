# Quickstart: Gamification Integration

**Feature**: 005-gamification-integration  
**Estimated Time**: 4-5 days (50 tasks)

## Prerequisites

- [ ] Feature 004 (Development Pathways) completado
- [ ] Feature 002 (Strength Quiz/Assessment) completado
- [ ] Feature 001 (Peer Feedback) completado
- [ ] Branch `005-gamification-integration` activo

## Quick Setup

```bash
# Verificar branch
git checkout 005-gamification-integration

# Instalar dependencias
bun install

# Verificar estado actual
bunx tsc --noEmit
```

## Implementation Phases Overview

### Phase 1: Shared Infrastructure (Day 1)
**Tasks T001-T010**

Crear servicios y componentes compartidos que ambos features consumirán.

**Key Files**:
- `lib/services/gamification.service.ts`
- `lib/constants/xp-rewards.ts`
- `lib/types/gamification.types.ts` (extensiones)
- `components/gamification/` (4 componentes)

**Start Here**:
```typescript
// lib/services/gamification.service.ts
import { prisma } from '@/lib/prisma.db';
import { calculateLevel } from './level-calculator.service';
import { XP_LEVELS, STREAK_BONUSES } from '@/lib/constants/xp-levels';

export type XpSource = 
  | 'assessment_phase_1' | 'assessment_phase_2' | 'assessment_complete'
  | 'feedback_given' | 'feedback_received' | 'feedback_insights';

export interface AwardXpParams {
  userId: string;
  amount: number;
  source: XpSource;
  applyStreakBonus?: boolean;
}

export async function awardXp(params: AwardXpParams): Promise<AwardXpResult> {
  // Implementation here
}
```

### Phase 2: Assessment Gamification (Day 2)
**Tasks T011-T025**

Integrar XP y badges en el flujo de assessment.

**Key Files**:
- `app/dashboard/assessment/_actions/award-assessment-xp.ts`
- `app/dashboard/assessment/_components/xp-reward-preview.tsx`
- Modificar `complete-phase.ts`, `save-results-to-profile.ts`

**Integration Point**:
```typescript
// En complete-phase.ts (existente)
export async function completePhase(phaseNumber: number) {
  // ... lógica existente de completar fase ...
  
  // Nuevo: Award XP
  const xpResult = await awardAssessmentXp({
    sessionId: session.id,
    milestone: `phase_${phaseNumber}` as const
  });
  
  return { ...existingResult, xpResult };
}
```

### Phase 3: Feedback Gamification (Day 3)
**Tasks T026-T040**

Integrar XP y badges en el flujo de feedback.

**Key Files**:
- `app/dashboard/feedback/_actions/award-feedback-xp.ts`
- `app/dashboard/feedback/_components/xp-incentive-banner.tsx`
- Modificar `feedback-response.actions.ts`

**Integration Point**:
```typescript
// En feedback-response.actions.ts (existente)
export async function submitFeedbackResponse(data) {
  // ... lógica existente de submit ...
  
  // Nuevo: Award XP to provider
  const xpResult = await awardFeedbackGivenXp({
    responseId: response.id
  });
  
  // Nuevo: Notify requester and award their XP
  // (puede ser en otro action o background job)
  
  return { ...existingResult, xpResult };
}
```

### Phase 4: Integration & Polish (Day 4-5)
**Tasks T041-T050**

Testing end-to-end, badges, y polish de UX.

**Key Activities**:
- Seed nuevos badges
- Test flujos completos
- Ajustar animaciones y feedback visual
- Documentar

## File Structure (Final)

```
lib/
├── services/
│   ├── gamification.service.ts      ← NEW (unified API)
│   ├── xp-calculator.service.ts     ← Existing
│   └── level-calculator.service.ts  ← Existing
├── constants/
│   ├── xp-rewards.ts                ← NEW
│   └── xp-levels.ts                 ← Existing
└── types/
    └── gamification.types.ts        ← Extended

components/
└── gamification/
    ├── index.ts                     ← NEW
    ├── xp-gain-toast.tsx            ← NEW
    ├── level-up-notification.tsx    ← NEW
    ├── badge-unlock-modal.tsx       ← NEW
    └── xp-preview-card.tsx          ← NEW

app/dashboard/
├── assessment/
│   ├── _actions/
│   │   └── award-assessment-xp.ts   ← NEW
│   └── _components/
│       └── xp-reward-preview.tsx    ← NEW
└── feedback/
    ├── _actions/
    │   └── award-feedback-xp.ts     ← NEW
    └── _components/
        └── xp-incentive-banner.tsx  ← NEW

prisma/data/
└── badges.data.ts                   ← Extended with 4 new badges
```

## Testing Checklist

### Phase 1 Verification
```bash
# TypeScript compiles
bunx tsc --noEmit

# New service exports correctly
bun run -e "import { awardXp } from './lib/services/gamification.service'"

# Components render
# (manual check in development)
```

### Phase 2 Verification
- [ ] Complete Phase 1 of assessment → receive 100 XP
- [ ] Complete Phase 2 → receive 150 XP  
- [ ] Complete Phase 3 → receive 250 XP + "Explorador Interior" badge
- [ ] XP toast appears after each phase
- [ ] Level up modal appears if applicable

### Phase 3 Verification
- [ ] Submit feedback → receive 75 XP + toast
- [ ] Receive feedback → requester gets 25 XP
- [ ] Reach 3+ responses → receive 50 XP insights bonus
- [ ] Give 3 feedbacks in 30 days → "Espejo Generoso" badge
- [ ] Receive 10 feedbacks → "Escucha Activa" badge

### Phase 4 Verification
- [ ] Full end-to-end: New user → assessment → feedback → badges
- [ ] Streak bonuses apply correctly
- [ ] No duplicate XP awards on refresh/retry
- [ ] All badges seeded and unlockable
- [ ] No cross-feature imports (architecture compliance)

## Common Issues

### "XP not showing"
Check `UserGamification` record exists for user:
```typescript
await ensureGamificationRecord(userId);
```

### "Badge not unlocking"
Verify badge criteria match user stats:
```typescript
const stats = await getUserGamificationStats(userId);
console.log(stats); // { assessmentCount, feedbackGivenCount, ... }
```

### "Duplicate XP"
Check idempotency flags:
```typescript
// Assessment: results.xpAwarded.phase1 should be true
// Feedback: check xpAwarded timestamp vs response createdAt
```

## Success Criteria (from spec.md)

| ID     | Criteria                                | Target        |
| ------ | --------------------------------------- | ------------- |
| SC-001 | 100% de assessment completions award XP | ≥ 99%         |
| SC-002 | 100% de feedback submissions award XP   | ≥ 99%         |
| SC-003 | No duplicate XP awards                  | 0 duplicates  |
| SC-004 | Streak bonuses apply correctly          | 100% accuracy |
| SC-005 | 4 nuevos badges unlockable              | All 4         |
| SC-006 | XP UI visible en assessment/feedback    | Both modules  |
| SC-007 | Level-up notification works             | 100% triggers |
| SC-008 | No cross-feature imports                | 0 violations  |
| SC-009 | TypeScript strict mode passes           | No errors     |
| SC-010 | Assessment conversion no decrease       | ≥ baseline    |

## Next Steps After Completion

1. Run full regression test suite
2. Verify no performance degradation
3. Update user documentation
4. Consider Phase 2 features:
   - XP leaderboard
   - Weekly XP challenges
   - Team gamification aggregates
