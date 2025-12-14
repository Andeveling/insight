# Tasks: Gamification Integration for Assessment & Feedback

**Input**: Design documents from `/specs/005-gamification-integration/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: No tests requested in spec. Test tasks omitted.

**Organization**: Tasks grouped by user story to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US5 from spec.md)
- Exact file paths included

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared services, constants, and components that all user stories depend on

- [ ] T001 Create XP rewards constants in lib/constants/xp-rewards.ts
- [ ] T002 Extend XpSource type in lib/types/gamification.types.ts with assessment and feedback sources
- [ ] T003 Create ensureGamificationRecord function in lib/services/gamification.service.ts
- [ ] T004 Create awardXp function in lib/services/gamification.service.ts
- [ ] T005 Create checkBadgeUnlocks function in lib/services/gamification.service.ts
- [ ] T006 [P] Create XpGainToast component in components/gamification/xp-gain-toast.tsx
- [ ] T007 [P] Create LevelUpNotification component in components/gamification/level-up-notification.tsx
- [ ] T008 [P] Create BadgeUnlockModal component in components/gamification/badge-unlock-modal.tsx
- [ ] T009 [P] Create XpPreviewCard component in components/gamification/xp-preview-card.tsx
- [ ] T010 Create barrel export in components/gamification/index.ts
- [ ] T011 Add 4 new badges to prisma/data/badges.data.ts (explorer_interior, generous_mirror, active_listener, continuous_evolution)
- [ ] T012 Extend badge criteria evaluator in lib/services/badge-criteria.service.ts for new badge types

**Checkpoint**: Shared infrastructure complete - user stories can now be implemented

---

## Phase 2: User Story 1 - Earn XP for Completing Assessment (Priority: P1) 🎯 MVP

**Goal**: Users earn XP (100+150+250=500 total) for completing assessment phases and unlock "Explorador Interior" badge

**Independent Test**: Complete full assessment → see XP toast after each phase → level bar updates → badge unlocks on first completion

### Implementation for User Story 1

- [ ] T013 [US1] Create Zod schema for AwardAssessmentXpInput in app/dashboard/assessment/_schemas/award-xp.schema.ts
- [ ] T014 [US1] Create awardAssessmentXp server action in app/dashboard/assessment/_actions/award-assessment-xp.ts
- [ ] T015 [US1] Create useAssessmentXp hook in app/dashboard/assessment/_hooks/use-assessment-xp.ts
- [ ] T016 [P] [US1] Create XpRewardPreview component in app/dashboard/assessment/_components/xp-reward-preview.tsx
- [ ] T017 [US1] Modify complete-phase.ts to call awardAssessmentXp after phase completion
- [ ] T018 [US1] Modify save-results-to-profile.ts to award completion bonus and check "Explorador Interior" badge
- [ ] T019 [US1] Modify welcome-screen.tsx to show XP preview ("Gana hasta 500 XP")
- [ ] T020 [US1] Modify phase-transition.tsx to show XP earned with XpGainToast
- [ ] T021 [US1] Modify results page to show level-up notification if applicable
- [ ] T022 [US1] Add xpAwarded tracking to AssessmentSession.results JSON to prevent duplicate awards
- [ ] T023 [US1] Handle retake scenario with reduced XP (200 total) in awardAssessmentXp action

**Checkpoint**: User Story 1 complete - assessment gamification fully functional

---

## Phase 3: User Story 2 - Earn XP for Providing Peer Feedback (Priority: P1)

**Goal**: Users earn 75 XP for each peer feedback submitted and can unlock "Espejo Generoso" badge

**Independent Test**: Receive feedback request → complete response → see 75 XP toast → after 3 feedbacks in 30 days, badge unlocks

### Implementation for User Story 2

- [ ] T024 [US2] Create Zod schema for AwardFeedbackXpInput in app/dashboard/feedback/_schemas/award-xp.schema.ts
- [ ] T025 [US2] Create awardFeedbackGivenXp server action in app/dashboard/feedback/_actions/award-feedback-xp.ts
- [ ] T026 [P] [US2] Create XpIncentiveBanner component in app/dashboard/feedback/_components/xp-incentive-banner.tsx
- [ ] T027 [US2] Modify feedback-response.actions.ts to call awardFeedbackGivenXp after submit
- [ ] T028 [US2] Modify feedback intro screen (respond/[requestId]/page.tsx) to show "Responder = 75 XP"
- [ ] T029 [US2] Add XpGainToast after successful feedback submission
- [ ] T030 [US2] Check and award "Espejo Generoso" badge when 3+ feedbacks given in 30 days
- [ ] T031 [US2] Add idempotency check to prevent duplicate XP for same response

**Checkpoint**: User Story 2 complete - feedback provision gamification functional

---

## Phase 4: User Story 3 - Earn XP for Receiving Feedback (Priority: P2)

**Goal**: Requesters earn 25 XP per response received, 50 XP bonus at insights threshold, and can unlock "Escucha Activa" badge

**Independent Test**: Request feedback from teammates → receive responses → see XP notifications → at 10+ responses unlock badge

### Implementation for User Story 3

- [ ] T032 [US3] Create awardFeedbackReceivedXp server action in app/dashboard/feedback/_actions/award-feedback-xp.ts
- [ ] T033 [US3] Modify feedback-request.actions.ts to trigger XP award when response is received
- [ ] T034 [US3] Add insights threshold detection (3+ responses) for 50 XP bonus
- [ ] T035 [P] [US3] Create PendingXpIndicator component showing potential XP in app/dashboard/feedback/_components/pending-xp-indicator.tsx
- [ ] T036 [US3] Modify pending-requests UI to show potential XP ("3 pendientes = hasta 75 XP")
- [ ] T037 [US3] Check and award "Escucha Activa" badge when 10+ feedbacks received
- [ ] T038 [US3] Handle notification to requester when feedback arrives with XP info

**Checkpoint**: User Story 3 complete - feedback reception gamification functional

---

## Phase 5: User Story 4 - View Gamification Progress in Context (Priority: P2)

**Goal**: Users see XP bar and level in assessment/feedback UIs with real-time updates

**Independent Test**: Navigate assessment/feedback flows → see current level badge → XP bar animates after earning

### Implementation for User Story 4

- [ ] T039 [US4] Create useGamificationProgress hook in lib/hooks/use-gamification-progress.ts
- [ ] T040 [P] [US4] Create GamificationContextBadge component in components/gamification/gamification-context-badge.tsx
- [ ] T041 [US4] Add GamificationContextBadge to assessment layout
- [ ] T042 [US4] Add GamificationContextBadge to feedback layout
- [ ] T043 [US4] Implement real-time XP bar animation after XP gain
- [ ] T044 [US4] Add source attribution when XP appears in Development dashboard history

**Checkpoint**: User Story 4 complete - gamification visibility across contexts

---

## Phase 6: User Story 5 - Unlock Badges for Milestones (Priority: P3)

**Goal**: Users unlock 4 new badges for assessment/feedback milestones with celebration UI

**Independent Test**: Achieve badge criteria → see badge unlock modal → badge appears in profile

### Implementation for User Story 5

- [ ] T045 [US5] Implement "Explorador Interior" badge criteria check (first assessment)
- [ ] T046 [US5] Implement "Espejo Generoso" badge criteria check (3 feedbacks in 30 days)
- [ ] T047 [US5] Implement "Escucha Activa" badge criteria check (10 feedbacks received)
- [ ] T048 [US5] Implement "Evolución Continua" badge criteria check (retake after 2+ feedbacks)
- [ ] T049 [US5] Integrate BadgeUnlockModal trigger after any badge unlock
- [ ] T050 [US5] Award badge XP bonus (25/75/150/75) when badge unlocks
- [ ] T051 [US5] Show newly earned badges in assessment results and feedback completion screens

**Checkpoint**: User Story 5 complete - all 4 badges unlockable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, validation, and documentation

- [ ] T052 [P] Run TypeScript strict mode validation (bunx tsc --noEmit)
- [ ] T053 [P] Verify no cross-feature imports (architecture compliance check)
- [ ] T054 Run seed to ensure 4 new badges are created (bun prisma db seed)
- [ ] T055 Test complete user journey: new user → assessment → feedback → badges
- [ ] T056 Verify streak bonuses apply correctly to assessment/feedback XP
- [ ] T057 Verify idempotency: refresh pages don't duplicate XP awards
- [ ] T058 [P] Add ARIA labels to all gamification UI components
- [ ] T059 [P] Update docs/features/gamification-integration.md with feature documentation
- [ ] T060 Run quickstart.md validation checklist

**Checkpoint**: Feature complete and validated

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓ BLOCKS
Phase 2 (US1) ←──────────────────────────────┐
    ↓ (optional)                              │
Phase 3 (US2) ←── Can run parallel with US1 ──┤
    ↓ (optional)                              │
Phase 4 (US3) ←── Can run parallel with US1 ──┘
    ↓ (optional)
Phase 5 (US4) ←── Depends on at least US1 for testing
    ↓ (optional)
Phase 6 (US5) ←── Badge logic depends on US1-US3 actions existing
    ↓
Phase 7 (Polish) ←── All stories complete
```

### User Story Dependencies

| Story | Priority | Dependencies                         | Can Parallel With     |
| ----- | -------- | ------------------------------------ | --------------------- |
| US1   | P1       | Phase 1 complete                     | US2, US3              |
| US2   | P1       | Phase 1 complete                     | US1, US3              |
| US3   | P2       | Phase 1 complete                     | US1, US2              |
| US4   | P2       | Phase 1 + at least one action exists | None (UI integration) |
| US5   | P3       | Phase 1 + US1-US3 actions            | None (badge criteria) |

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T006, T007, T008, T009 → All component creation in parallel
```

**Phase 2-4 (US1-US3)**:
```
After Phase 1:
  US1 (T013-T023) ─┬─ US2 (T024-T031) ─┬─ US3 (T032-T038)
                   │                   │
                   └───────────────────┘
  (All three user stories can run in parallel if capacity allows)
```

**Phase 7 (Polish)**:
```
T052, T053, T058, T059 → Documentation and validation in parallel
```

---

## Implementation Strategy

### MVP Scope
**User Story 1 only** delivers immediate value:
- Assessment XP (500 total for completion)
- "Explorador Interior" badge
- Level-up capability

### Incremental Delivery

| Milestone | Stories         | Value Delivered                  |
| --------- | --------------- | -------------------------------- |
| MVP       | US1             | Assessment completion rewarded   |
| v1.1      | US1 + US2       | Feedback provision incentivized  |
| v1.2      | US1 + US2 + US3 | Full feedback loop gamified      |
| v1.3      | All stories     | Complete gamification visibility |

### Estimated Effort

| Phase            | Tasks  | Estimated Hours |
| ---------------- | ------ | --------------- |
| Phase 1 (Setup)  | 12     | 4-5h            |
| Phase 2 (US1)    | 11     | 4-5h            |
| Phase 3 (US2)    | 8      | 3-4h            |
| Phase 4 (US3)    | 7      | 3h              |
| Phase 5 (US4)    | 6      | 2-3h            |
| Phase 6 (US5)    | 7      | 2-3h            |
| Phase 7 (Polish) | 9      | 2h              |
| **Total**        | **60** | **20-25h**      |

---

## Summary

| Metric                 | Value                  |
| ---------------------- | ---------------------- |
| Total Tasks            | 60                     |
| User Stories           | 5                      |
| Phases                 | 7                      |
| Parallel Opportunities | 15 tasks (25%)         |
| MVP Tasks (US1 only)   | 23 (Phase 1 + Phase 2) |
| New Files              | ~15                    |
| Modified Files         | ~10                    |
| New Badges             | 4                      |

**Format Validation**: ✅ All tasks follow `- [ ] [TaskID] [P?] [Story?] Description with file path` format
