# Tasks: Progressive Strength Discovery Quiz

**Input**: Design documents from `/specs/001-strength-quiz/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅ (partial)

**Tests**: Not explicitly requested in spec - focusing on implementation tasks

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4, US5)
- Exact file paths included

---

## Phase 1: Setup

**Purpose**: Project initialization and database schema

- [ ] T001 Create Prisma migration for assessment models in prisma/migrations/[timestamp]_add_assessment_tables/
- [ ] T002 Add AssessmentQuestion model to prisma/schema.prisma
- [ ] T003 Add UserAssessmentAnswer model to prisma/schema.prisma
- [ ] T004 Add AssessmentSession model to prisma/schema.prisma
- [ ] T005 Run Prisma migration and generate client: `bun run db:migrate`
- [ ] T006 [P] Create assessment types in lib/types/assessment.types.ts
- [ ] T007 [P] Create Zod schemas in app/dashboard/assessment/_schemas/question.schema.ts
- [ ] T008 [P] Create Zod schemas in app/dashboard/assessment/_schemas/answer.schema.ts
- [ ] T009 [P] Create Zod schemas in app/dashboard/assessment/_schemas/session.schema.ts
- [ ] T010 Create barrel export in app/dashboard/assessment/_schemas/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure - MUST complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase completes

- [ ] T011 Create question seed data file in prisma/data/assessment-questions.data.ts (60 questions: 20 Phase 1, 30 Phase 2, 10 Phase 3)
- [ ] T012 Create question seeder in prisma/seeders/assessment-questions.seeder.ts
- [ ] T013 Update main seed file prisma/seed.ts to include assessment questions
- [ ] T014 Run seed: `bun run db:seed` to populate question bank
- [ ] T015 [P] Create score calculator utility in lib/utils/assessment/score-calculator.ts (weighted scoring, confidence calculation)
- [ ] T016 [P] Create adaptive logic utility in lib/utils/assessment/adaptive-logic.ts (Phase 2 question selection)
- [ ] T017 Create barrel export in lib/utils/assessment/index.ts
- [ ] T018 Create base UI components directory structure: app/dashboard/assessment/_components/

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Complete Fresh Assessment (Priority: P1) 🎯 MVP

**Goal**: New users can start assessment, answer all 60 questions across 3 phases, and receive complete strength profile

**Independent Test**: User navigates to /dashboard/assessment, starts new assessment, completes all phases, sees top 5 strengths with confidence scores

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create welcome screen component in app/dashboard/assessment/_components/welcome-screen.tsx
- [ ] T020 [P] [US1] Create question card component in app/dashboard/assessment/_components/question-card.tsx
- [ ] T021 [P] [US1] Create progress indicator component in app/dashboard/assessment/_components/progress-indicator.tsx
- [ ] T022 [P] [US1] Create phase transition component in app/dashboard/assessment/_components/phase-transition.tsx
- [ ] T023 [P] [US1] Create results summary component in app/dashboard/assessment/_components/results-summary.tsx
- [ ] T024 [P] [US1] Create strength confidence card component in app/dashboard/assessment/_components/strength-confidence-card.tsx
- [ ] T025 [US1] Create barrel export in app/dashboard/assessment/_components/index.ts
- [ ] T026 [P] [US1] Create assessment session hook in app/dashboard/assessment/_hooks/use-assessment-session.ts
- [ ] T027 [P] [US1] Create question navigation hook in app/dashboard/assessment/_hooks/use-question-navigation.ts
- [ ] T028 [US1] Create barrel export in app/dashboard/assessment/_hooks/index.ts
- [ ] T029 [P] [US1] Create session creation server action in app/dashboard/assessment/_actions/create-session.ts
- [ ] T030 [P] [US1] Create answer save server action in app/dashboard/assessment/_actions/save-answer.ts
- [ ] T031 [P] [US1] Create phase completion server action in app/dashboard/assessment/_actions/complete-phase.ts
- [ ] T032 [P] [US1] Create results calculation server action in app/dashboard/assessment/_actions/calculate-results.ts
- [ ] T033 [US1] Create barrel export in app/dashboard/assessment/_actions/index.ts
- [ ] T034 [US1] Create assessment landing page in app/dashboard/assessment/page.tsx (welcome/start assessment)
- [ ] T035 [US1] Create active session page in app/dashboard/assessment/[sessionId]/page.tsx (question display)
- [ ] T036 [US1] Create results page in app/dashboard/assessment/results/[sessionId]/page.tsx (show top 5 strengths)
- [ ] T037 [US1] Implement Phase 1 flow: display 20 domain discovery questions with scale inputs
- [ ] T038 [US1] Implement Phase 1 completion: calculate domain scores, show affinity visualization
- [ ] T039 [US1] Implement Phase 2 flow: display 30 adaptive questions based on top domains
- [ ] T040 [US1] Implement Phase 2 completion: calculate strength scores, show preliminary top 5
- [ ] T041 [US1] Implement Phase 3 flow: display 10 ranking confirmation questions
- [ ] T042 [US1] Implement Phase 3 completion: finalize top 5 with confidence scores
- [ ] T043 [US1] Integrate results display with strength data from existing Strength model
- [ ] T044 [US1] Add "Save to Profile" functionality to update UserStrength records

**Checkpoint**: User Story 1 complete - users can take full assessment and get results

---

## Phase 4: User Story 2 - Pause and Resume Assessment (Priority: P1)

**Goal**: Users can pause assessment midway, close browser, and resume later from exact question

**Independent Test**: Start assessment, answer 15 questions, click "Save & Exit", close browser, return later, click "Continue Assessment", resume at question 16

### Implementation for User Story 2

- [ ] T045 [P] [US2] Create auto-save hook in app/dashboard/assessment/_hooks/use-auto-save.ts (debounced saves)
- [ ] T046 [US2] Update hook barrel export in app/dashboard/assessment/_hooks/index.ts
- [ ] T047 [US2] Add "Save & Exit" button to question card component in app/dashboard/assessment/_components/question-card.tsx
- [ ] T048 [US2] Update landing page to detect and show "Continue Assessment" option in app/dashboard/assessment/page.tsx
- [ ] T049 [US2] Create resume session server action in app/dashboard/assessment/_actions/resume-session.ts
- [ ] T050 [US2] Update action barrel export in app/dashboard/assessment/_actions/index.ts
- [ ] T051 [US2] Implement auto-save functionality: save answer after each submission automatically
- [ ] T052 [US2] Implement session state persistence: update lastActivityAt timestamp on each interaction
- [ ] T053 [US2] Implement session recovery: load existing session with all previous answers on page load
- [ ] T054 [US2] Add browser beforeunload handler to show "Progress auto-saved" message
- [ ] T055 [US2] Implement 7+ day inactive session notification: "Continue or start fresh?" dialog
- [ ] T056 [US2] Create session cleanup cron job (optional): archive sessions >30 days inactive in scripts/cleanup-sessions.ts

**Checkpoint**: User Story 2 complete - pause/resume works seamlessly with data preservation

---

## Phase 5: User Story 3 - View Progress and Domain Affinity (Priority: P2)

**Goal**: During assessment, users see real-time progress bar and domain affinity visualization

**Independent Test**: While answering questions, observe progress bar updating (e.g., "15 of 60 - 25%") and domain bars changing after Phase 1 answers

### Implementation for User Story 3

- [ ] T057 [P] [US3] Create domain affinity chart component in app/dashboard/assessment/_components/domain-affinity-chart.tsx
- [ ] T058 [US3] Update component barrel export in app/dashboard/assessment/_components/index.ts
- [ ] T059 [US3] Enhance progress indicator component to show detailed progress (question X of Y, percentage) in app/dashboard/assessment/_components/progress-indicator.tsx
- [ ] T060 [US3] Add real-time domain score calculation to question card component in app/dashboard/assessment/_components/question-card.tsx
- [ ] T061 [US3] Implement domain affinity visualization display during Phase 1 in app/dashboard/assessment/[sessionId]/page.tsx
- [ ] T062 [US3] Create Phase 1 summary screen showing "Your Domain Profile" visualization in app/dashboard/assessment/_components/phase-transition.tsx
- [ ] T063 [US3] Add animations/transitions for progress updates using motion library
- [ ] T064 [US3] Ensure mobile-responsive visualization (test on small screens)

**Checkpoint**: User Story 3 complete - progress and domain affinity visible in real-time

---

## Phase 6: User Story 4 - Adaptive Question Selection (Priority: P2)

**Goal**: Assessment adapts Phase 2 questions based on Phase 1 domain scores to efficiently identify strengths

**Independent Test**: Two users with different Phase 1 responses receive different Phase 2 question sets focused on their top domains

### Implementation for User Story 4

- [ ] T065 [US4] Implement Phase 2 question selection algorithm in lib/utils/assessment/adaptive-logic.ts (use existing function structure)
- [ ] T066 [US4] Update complete-phase server action to trigger adaptive selection after Phase 1 in app/dashboard/assessment/_actions/complete-phase.ts
- [ ] T067 [US4] Modify Phase 2 question loading to use filtered question set based on session's domainScores in app/dashboard/assessment/[sessionId]/page.tsx
- [ ] T068 [US4] Implement edge case handling: balanced domains get broader question set
- [ ] T069 [US4] Implement edge case handling: single dominant domain gets 70/30 split
- [ ] T070 [US4] Add logging/analytics to track which questions are selected (for future optimization)
- [ ] T071 [US4] Test adaptive logic with various Phase 1 score patterns

**Checkpoint**: User Story 4 complete - Phase 2 questions adapt to individual response patterns

---

## Phase 7: User Story 5 - Review and Understand Results (Priority: P1)

**Goal**: After completion, users see comprehensive results with confidence scores, descriptions, and can save or retake

**Independent Test**: Complete assessment, view results page with top 5 ranked strengths, click each for details, click "Save to Profile" to persist

### Implementation for User Story 5

- [ ] T072 [P] [US5] Enhance results summary component with detailed view in app/dashboard/assessment/_components/results-summary.tsx
- [ ] T073 [P] [US5] Enhance strength confidence card with expandable descriptions in app/dashboard/assessment/_components/strength-confidence-card.tsx
- [ ] T074 [US5] Update component barrel export in app/dashboard/assessment/_components/index.ts
- [ ] T075 [US5] Create AI description generation server action (optional) in app/dashboard/assessment/_actions/generate-ai-descriptions.ts
- [ ] T076 [US5] Create save to profile server action in app/dashboard/assessment/_actions/save-to-profile.ts
- [ ] T077 [US5] Create retake assessment server action in app/dashboard/assessment/_actions/retake-assessment.ts
- [ ] T078 [US5] Update action barrel export in app/dashboard/assessment/_actions/index.ts
- [ ] T079 [US5] Implement low confidence warning (<60) in results page app/dashboard/assessment/results/[sessionId]/page.tsx
- [ ] T080 [US5] Add "Save to Profile" functionality: create/update UserStrength records with ranks
- [ ] T081 [US5] Add "Retake Assessment" functionality: archive current session, create new one
- [ ] T082 [US5] Implement strength detail modal/expansion: show description, examples, domain info
- [ ] T083 [US5] Add navigation to dashboard after saving results
- [ ] T084 [US5] Integrate with existing UserProfile to show updated strengths

**Checkpoint**: User Story 5 complete - comprehensive results display with action options

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T085 [P] Add loading states to all server actions (optimistic UI updates)
- [ ] T086 [P] Add error boundaries to assessment pages in app/dashboard/assessment/error.tsx
- [ ] T087 [P] Add loading skeleton to assessment pages in app/dashboard/assessment/loading.tsx
- [ ] T088 [P] Implement proper error handling for all server actions (toast notifications using sonner)
- [ ] T089 [P] Add analytics tracking for assessment events (start, phase completion, results)
- [ ] T090 [P] Optimize database queries: add indexes for sessionId, userId, status
- [ ] T091 [P] Add metadata to assessment pages (SEO, Open Graph)
- [ ] T092 Test accessibility: keyboard navigation, screen reader support
- [ ] T093 Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T094 Test mobile responsiveness on various screen sizes
- [ ] T095 Performance audit: Lighthouse score >90
- [ ] T096 Update documentation in docs/ folder with assessment feature overview
- [ ] T097 Add assessment feature to main dashboard navigation
- [ ] T098 Review and update .env.example with any new environment variables
- [ ] T099 Code cleanup: remove console.logs, unused imports, commented code
- [ ] T100 Final Constitution Check: verify all 5 principles maintained

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T010) - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational (T011-T018) completion
  - Can proceed in parallel if multiple developers
  - Or sequentially: US1 → US2 → US5 (P1 stories) → US3 → US4 (P2 stories)
- **Polish (Phase 8)**: Depends on desired user stories completion

### User Story Dependencies

- **US1 (Complete Fresh Assessment)**: Can start after Foundational - NO dependencies on other stories ✅ MVP
- **US2 (Pause and Resume)**: Can start after Foundational - Enhances US1 but US1 works without it
- **US5 (Review and Understand Results)**: Can start after Foundational - Works with US1 results
- **US3 (Progress Visualization)**: Can start after Foundational - Enhances US1 but independent
- **US4 (Adaptive Questions)**: Can start after Foundational - Enhances US1 but independent

### Within Each User Story

- Components ([P] tasks) can be built in parallel
- Hooks ([P] tasks) can be built in parallel
- Server actions ([P] tasks) can be built in parallel
- Pages depend on components/hooks/actions being complete
- Integration/flow tasks come last within each story

### Parallel Opportunities

**Setup Phase**: T006-T009 can run in parallel (different schema files)

**Foundational Phase**: T011-T017 (seed data + utilities) can run in parallel

**User Story 1**: 
- T019-T024 (all components) in parallel
- T026-T027 (all hooks) in parallel
- T029-T032 (all actions) in parallel
- Then pages and integration (T034-T044)

**User Story 2**: T045, T047-T050 can start in parallel after US1 components exist

**User Story 3**: T057-T059 (components) in parallel

**User Story 5**: T072-T078 in parallel

**Polish Phase**: T085-T091 can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Phase 1: All components in parallel
T019: welcome-screen.tsx
T020: question-card.tsx
T021: progress-indicator.tsx
T022: phase-transition.tsx
T023: results-summary.tsx
T024: strength-confidence-card.tsx

# Phase 2: All hooks in parallel
T026: use-assessment-session.ts
T027: use-question-navigation.ts

# Phase 3: All actions in parallel
T029: create-session.ts
T030: save-answer.ts
T031: complete-phase.ts
T032: calculate-results.ts

# Phase 4: Pages (sequential, depend on above)
T034: page.tsx (landing)
T035: [sessionId]/page.tsx
T036: results/[sessionId]/page.tsx

# Phase 5: Integration (sequential)
T037-T044: Wire everything together
```

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Scope**: User Stories 1, 2, 5 only (P1 priorities)

1. ✅ Complete Phase 1: Setup (T001-T010)
2. ✅ Complete Phase 2: Foundational (T011-T018) - CRITICAL
3. ✅ Complete Phase 3: User Story 1 (T019-T044) - Core assessment flow
4. ✅ Complete Phase 4: User Story 2 (T045-T056) - Pause/resume
5. ✅ Complete Phase 7: User Story 5 (T072-T084) - Results review
6. **STOP and VALIDATE**: Test complete assessment journey end-to-end
7. Deploy/demo MVP

**MVP delivers**: Users can discover their strengths, pause anytime, and understand results - core value proposition complete!

### Incremental Delivery (Full Feature)

1. Deploy MVP (US1 + US2 + US5)
2. Add US3 (Progress Visualization) - improves engagement
3. Add US4 (Adaptive Questions) - improves accuracy
4. Polish phase (Phase 8) - production ready

### Parallel Team Strategy

**Team of 3 developers after Foundational phase completes**:

- **Developer A**: User Story 1 (T019-T044) - Core flow
- **Developer B**: User Story 2 (T045-T056) - Pause/resume  
- **Developer C**: User Story 5 (T072-T084) - Results

Then all three tackle User Stories 3 and 4 together or sequentially.

---

## Task Count Summary

- **Setup**: 10 tasks
- **Foundational**: 8 tasks (BLOCKING)
- **User Story 1 (P1)**: 26 tasks ⭐ MVP Core
- **User Story 2 (P1)**: 12 tasks ⭐ MVP Critical
- **User Story 3 (P2)**: 8 tasks
- **User Story 4 (P2)**: 7 tasks
- **User Story 5 (P1)**: 13 tasks ⭐ MVP Essential
- **Polish**: 16 tasks

**Total**: 100 tasks

**MVP Scope**: 10 + 8 + 26 + 12 + 13 = 69 tasks (delivers complete core experience)

---

## Notes

- All file paths follow Next.js 16 App Router feature-first architecture
- [P] marker = parallelizable (different files, no blocking dependencies)
- [Story] label = traceability to user story from spec.md
- Each user story independently completable and testable
- Tests not included per spec (not explicitly requested)
- Commit after each task or logical group
- Use existing UI components from components/ui/ where possible
- Follow TypeScript strict mode, no `any` types
- Use Zod for all validation
- Use server actions for mutations
- Keep components client-only when needed (`'use client'` directive)
