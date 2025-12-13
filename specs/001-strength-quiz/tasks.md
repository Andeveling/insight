---
description: "Task list for Progressive Strength Discovery Quiz feature"
---

# Tasks: Progressive Strength Discovery Quiz

**Input**: Design documents from `/specs/001-strength-quiz/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅
**Feature Branch**: `001-strength-quiz`
**Tests**: Not explicitly requested - focus on implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and assessment feature structure

- [X] T001 Create feature directory structure at app/dashboard/assessment/ with subdirectories: _components/, _hooks/, _actions/, _schemas/, [sessionId]/, results/[sessionId]/
- [X] T002 [P] Create barrel export files (index.ts) in app/dashboard/assessment/_components/, _hooks/, _actions/, _schemas/
- [X] T003 [P] Create assessment utility directory at lib/utils/assessment/ with index.ts
- [X] T004 [P] Create assessment types file at lib/types/assessment.types.ts and add barrel export to lib/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema and seed data that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create Prisma schema models in prisma/schema.prisma: AssessmentQuestion, UserAssessmentAnswer, AssessmentSession (with fields per plan.md data model)
- [X] T006 Create database migration for assessment models using bunx prisma migrate dev --name add_assessment_schema
- [X] T007 [P] Create seed data file at prisma/data/assessment-questions.data.ts with 60 questions (20 Phase 1, 30 Phase 2, 10 Phase 3) following research.md guidelines
- [X] T008 [P] Create assessment questions seeder at prisma/seeders/assessment-questions.seeder.ts
- [X] T009 Update prisma/seed.ts to include assessment questions seeder
- [X] T010 Run seeder to populate assessment questions using bun run prisma/seed.ts
- [X] T011 [P] Define TypeScript types in lib/types/assessment.types.ts: QuestionType, AnswerValue, AssessmentQuestion, SessionStatus, AssessmentSession, AssessmentResults, RankedStrength
- [X] T012 [P] Create Zod schemas in app/dashboard/assessment/_schemas/question.schema.ts for question validation
- [X] T013 [P] Create Zod schemas in app/dashboard/assessment/_schemas/answer.schema.ts for answer validation (scale, choice, ranking)
- [X] T014 [P] Create Zod schemas in app/dashboard/assessment/_schemas/session.schema.ts for session state validation

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Fresh Assessment (Priority: P1) 🎯 MVP

**Goal**: Enable users to discover their top 5 strengths by completing a full assessment from start to finish

**Independent Test**: A user can start a new assessment, answer all 60 questions across 3 phases, and receive a complete strength profile with confidence scores

### Implementation for User Story 1

#### Core Assessment Logic

- [X] T015 [P] [US1] Implement score calculator utility in lib/utils/assessment/score-calculator.ts with functions: calculateDomainScores, calculateStrengthScores, calculateConfidenceScore (per research.md algorithm)
- [X] T016 [P] [US1] Implement adaptive logic utility in lib/utils/assessment/adaptive-logic.ts with functions: selectPhase2Questions, getTopDomains, handleEdgeCases
- [X] T017 [P] [US1] Create barrel export in lib/utils/assessment/index.ts

#### Server Actions - Session Management

- [X] T018 [P] [US1] Implement createAssessmentSession server action in app/dashboard/assessment/_actions/create-session.ts (creates session, loads Phase 1 questions)
- [X] T019 [P] [US1] Implement getActiveSession server action in app/dashboard/assessment/_actions/get-active-session.ts (retrieves in-progress session for user)
- [X] T020 [P] [US1] Implement getNextQuestion server action in app/dashboard/assessment/_actions/get-next-question.ts (loads next question in current phase)

#### Server Actions - Answer Processing

- [X] T021 [US1] Implement saveAnswer server action in app/dashboard/assessment/_actions/save-answer.ts (validates answer, saves to DB, updates session state, returns next question) - depends on T015
- [X] T022 [US1] Implement completePhase server action in app/dashboard/assessment/_actions/complete-phase.ts (calculates phase results, determines next phase questions) - depends on T015, T016

#### Server Actions - Results

- [X] T023 [US1] Implement calculateResults server action in app/dashboard/assessment/_actions/calculate-results.ts (generates top 5 strengths with confidence scores) - depends on T015
- [X] T024 [US1] Implement saveResultsToProfile server action in app/dashboard/assessment/_actions/save-results-to-profile.ts (updates UserProfile with assessment results)
- [X] T025 [US1] Create barrel export in app/dashboard/assessment/_actions/index.ts

#### Custom Hooks

- [X] T026 [P] [US1] Create useAssessmentSession hook in app/dashboard/assessment/_hooks/use-assessment-session.ts (manages session state, handles mutations)
- [X] T027 [P] [US1] Create useQuestionNavigation hook in app/dashboard/assessment/_hooks/use-question-navigation.ts (handles next/previous navigation, validation)
- [X] T028 [P] [US1] Create barrel export in app/dashboard/assessment/_hooks/index.ts

#### UI Components - Welcome & Flow

- [X] T029 [P] [US1] Create WelcomeScreen component in app/dashboard/assessment/_components/welcome-screen.tsx (shows overview, estimated time, start button)
- [X] T030 [P] [US1] Create QuestionCard component in app/dashboard/assessment/_components/question-card.tsx (renders scale/choice/ranking questions with validation)
- [X] T031 [P] [US1] Create PhaseTransition component in app/dashboard/assessment/_components/phase-transition.tsx (shows phase completion summary, domain preview)

#### UI Components - Results

- [X] T032 [P] [US1] Create ResultsSummary component in app/dashboard/assessment/_components/results-summary.tsx (displays top 5 strengths overview)
- [X] T033 [P] [US1] Create StrengthConfidenceCard component in app/dashboard/assessment/_components/strength-confidence-card.tsx (individual strength display with confidence score)
- [X] T034 [US1] Create barrel export in app/dashboard/assessment/_components/index.ts

#### Pages

- [X] T035 [US1] Create assessment landing page in app/dashboard/assessment/page.tsx (shows WelcomeScreen for new users, resume option for in-progress) - depends on T029
- [X] T036 [US1] Create active session page in app/dashboard/assessment/[sessionId]/page.tsx (displays current question, handles answer submission, shows phase transitions) - depends on T030, T031
- [X] T037 [US1] Create results page in app/dashboard/assessment/results/[sessionId]/page.tsx (displays complete strength profile with confidence scores, save/retake options) - depends on T032, T033

**Checkpoint**: At this point, User Story 1 should be fully functional - users can complete a fresh assessment end-to-end

---

## Phase 4: User Story 2 - Pause and Resume Assessment (Priority: P1)

**Goal**: Enable users to save progress and continue their assessment later from where they left off

**Independent Test**: A user can start an assessment, answer 15 questions, close the browser, return hours later, and resume from question 16 with all previous answers preserved

### Implementation for User Story 2

- [X] T038 [P] [US2] Create useAutoSave hook in app/dashboard/assessment/_hooks/use-auto-save.ts (debounced auto-save with 2-second delay, optimistic updates)
- [X] T039 [P] [US2] Implement autoSaveAnswer server action in app/dashboard/assessment/_actions/auto-save-answer.ts (non-blocking answer save, updates lastActivityAt)
- [X] T040 [US2] Add auto-save integration to QuestionCard component in app/dashboard/assessment/_components/question-card.tsx (trigger auto-save on answer change) - depends on T038
- [X] T041 [US2] Update assessment landing page in app/dashboard/assessment/page.tsx to detect and display in-progress sessions with "Continue Assessment" button showing progress percentage
- [X] T042 [US2] Implement resumeAssessmentSession server action in app/dashboard/assessment/_actions/resume-session.ts (loads session, returns current question)
- [X] T043 [US2] Add session recovery logic to active session page in app/dashboard/assessment/[sessionId]/page.tsx (auto-resume on browser refresh/close/navigation)
- [X] T044 [US2] Create SaveExitButton component in app/dashboard/assessment/_components/save-exit-button.tsx (explicit save and exit with confirmation)
- [X] T045 [US2] Implement abandonSession server action in app/dashboard/assessment/_actions/abandon-session.ts (soft delete for 7+ day old sessions with restart option)
- [X] T046 [US2] Update barrel exports in app/dashboard/assessment/_hooks/index.ts and app/dashboard/assessment/_actions/index.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can complete assessments fresh or resume after pausing

---

## Phase 5: User Story 3 - View Progress and Domain Affinity (Priority: P2)

**Goal**: Provide real-time visual feedback showing assessment progress and emerging domain patterns

**Independent Test**: A user can see a visual progress bar and domain affinity bars that update after each answer, providing transparency into the assessment process

### Implementation for User Story 3

- [ ] T047 [P] [US3] Create ProgressIndicator component in app/dashboard/assessment/_components/progress-indicator.tsx (shows current question number, total questions, percentage bar with animation)
- [ ] T048 [P] [US3] Create DomainAffinityChart component in app/dashboard/assessment/_components/domain-affinity-chart.tsx (horizontal bar chart showing real-time domain scores with color coding per domain)
- [ ] T049 [US3] Update QuestionCard component in app/dashboard/assessment/_components/question-card.tsx to include ProgressIndicator - depends on T047
- [ ] T050 [US3] Update active session page in app/dashboard/assessment/[sessionId]/page.tsx to display DomainAffinityChart during Phase 1 and Phase 2 - depends on T048
- [ ] T051 [US3] Update PhaseTransition component in app/dashboard/assessment/_components/phase-transition.tsx to show detailed domain profile summary at Phase 1 completion
- [ ] T052 [US3] Add CSS animations in app/globals.css for progress bar fill and domain bar transitions (smooth 300ms easing)
- [ ] T053 [US3] Update barrel export in app/dashboard/assessment/_components/index.ts

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - users get visual feedback throughout their assessment

---

## Phase 6: User Story 4 - Adaptive Question Selection (Priority: P2)

**Goal**: Intelligently adapt Phase 2 questions based on Phase 1 responses to efficiently narrow down strengths

**Independent Test**: Two users with different response patterns receive different questions in Phase 2, demonstrating adaptive logic

### Implementation for User Story 4

- [ ] T054 [US4] Enhance completePhase server action in app/dashboard/assessment/_actions/complete-phase.ts to call adaptive-logic for Phase 2 question selection based on top domains
- [ ] T055 [US4] Update adaptive-logic utility in lib/utils/assessment/adaptive-logic.ts to implement stratified sampling (ensure balanced coverage across top 2-3 domains)
- [ ] T056 [US4] Add edge case handling in adaptive-logic.ts: all domains equal, one dominant domain, tie-breaking (per research.md)
- [ ] T057 [US4] Update PhaseTransition component in app/dashboard/assessment/_components/phase-transition.tsx to preview which domains will be explored in Phase 2
- [ ] T058 [US4] Add logging to adaptive-logic.ts to track question selection patterns for future optimization (use console.log in development)

**Checkpoint**: At this point, assessment adapts intelligently - users with different patterns get personalized question sets

---

## Phase 7: User Story 5 - Review and Understand Results (Priority: P1)

**Goal**: Present comprehensive results with confidence scores, descriptions, and actionable next steps

**Independent Test**: A user completing the assessment can view a comprehensive results page with their top 5 strengths, confidence scores, descriptions, and actionable next steps

### Implementation for User Story 5

- [X] T059 [P] [US5] Enhance ResultsSummary component in app/dashboard/assessment/_components/results-summary.tsx to display all 5 strengths with ranks and confidence scores
- [X] T060 [P] [US5] Update StrengthConfidenceCard component in app/dashboard/assessment/_components/strength-confidence-card.tsx to show expandable detailed descriptions and examples
- [X] T061 [P] [US5] Create LowConfidenceWarning component in app/dashboard/assessment/_components/low-confidence-warning.tsx (displays when any confidence score < 60 with retake recommendation)
- [X] T062 [US5] Update results page in app/dashboard/assessment/results/[sessionId]/page.tsx to integrate all result components and handle save/retake actions - depends on T059, T060, T061
- [X] T063 [US5] Add "Save to Profile" button in results page that calls saveResultsToProfile action and redirects to dashboard
- [X] T064 [US5] Add "Retake Assessment" button in results page that confirms with user (archives current session) and redirects to new assessment
- [X] T065 [US5] Implement createNewFromRetake server action in app/dashboard/assessment/_actions/create-new-from-retake.ts (archives old session, creates fresh session)
- [X] T066 [US5] Add strength description static content in app/dashboard/assessment/_components/strength-descriptions.ts (fallback content for each of 20 strengths)
- [X] T067 [US5] Update barrel exports in app/dashboard/assessment/_components/index.ts and app/dashboard/assessment/_actions/index.ts

**Checkpoint**: All core user stories (US1, US2, US5) are complete - users can take, pause, and understand their assessments

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T068 [P] Add error boundaries to assessment pages in app/dashboard/assessment/error.tsx for graceful error handling
- [X] T069 [P] Add loading states to assessment pages in app/dashboard/assessment/loading.tsx with spinner and skeleton screens
- [X] T070 [P] Implement responsive design for mobile devices (QuestionCard, DomainAffinityChart, ProgressIndicator responsive at <768px breakpoint)
- [X] T071 [P] Add accessibility attributes (ARIA labels, keyboard navigation, focus management) to all interactive components
- [X] T072 [P] Optimize database queries with Prisma select statements (only load needed fields for each action)
- [X] T073 [P] Add session cleanup scheduled task in app/api/cron/cleanup-sessions/route.ts (archive sessions with lastActivityAt > 30 days)
- [X] T074 [P] Create assessment feature documentation in docs/features/assessment.md (how it works, architecture, key decisions)
- [X] T075 [P] Add console logging for development debugging (assessment flow, score calculations, adaptive logic)
- [X] T076 [P] Validate all Zod schemas handle edge cases (empty values, malformed data, out-of-range numbers)
- [ ] T077 [P] Test session recovery across different browsers and devices
- [ ] T078 Code review and refactoring pass (ensure type safety, remove any types, consistent naming)
- [ ] T079 Performance testing with 100+ concurrent users (measure question load time <500ms, auto-save <200ms, results <5s)
- [ ] T080 Final integration testing following user story acceptance scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are P1 priority and should be completed first
  - US3 and US4 are P2 priority (can wait until US1/US2 are stable)
  - US5 is P1 priority but depends on US1 foundation
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP CORE**
- **User Story 2 (P1)**: Integrates with US1 components but independently testable - **MVP CORE**
- **User Story 3 (P2)**: Enhances US1/US2 with visualizations - Optional for MVP
- **User Story 4 (P2)**: Enhances US1 with adaptive logic - Optional for MVP
- **User Story 5 (P1)**: Depends on US1 foundation (results generation) - **MVP CORE**

### Within Each User Story

- Core utilities (score-calculator, adaptive-logic) before server actions
- Server actions before hooks
- Hooks before components
- Components before pages
- Foundation components (QuestionCard, WelcomeScreen) before enhancement components (ProgressIndicator, DomainAffinityChart)

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003, T004 can run in parallel (different directories)

**Phase 2 (Foundational)**:
- T007, T008, T011, T012, T013, T014 can all run in parallel after T006 (migration) completes

**Phase 3 (US1)**:
- T015, T016, T017 (utilities) can run in parallel
- T018, T019, T020 (session actions) can run in parallel after utilities
- T026, T027, T028 (hooks) can run in parallel
- T029, T030, T031, T032, T033, T034 (components) can run in parallel after hooks
- T035, T036, T037 (pages) must be sequential (each depends on specific components)

**Phase 4 (US2)**:
- T038, T039 can run in parallel
- T044, T045 can run in parallel after T038, T039

**Phase 5 (US3)**:
- T047, T048 can run in parallel
- T049, T050, T051 can run in parallel after T047, T048

**Phase 8 (Polish)**:
- T068, T069, T070, T071, T072, T073, T074, T075, T076, T077 can all run in parallel

---

## Parallel Example: User Story 1 Foundation

```bash
# After Foundational phase complete, these can run simultaneously:

# Developer 1: Core utilities
task: T015 - Implement score calculator
task: T016 - Implement adaptive logic  
task: T017 - Create barrel export

# Developer 2: Server actions (session)
task: T018 - createAssessmentSession
task: T019 - getActiveSession
task: T020 - getNextQuestion

# Developer 3: Custom hooks
task: T026 - useAssessmentSession
task: T027 - useQuestionNavigation
task: T028 - Barrel export

# After above complete, components can proceed in parallel:

# Developer 1: Welcome flow
task: T029 - WelcomeScreen
task: T030 - QuestionCard

# Developer 2: Phase transitions
task: T031 - PhaseTransition

# Developer 3: Results display
task: T032 - ResultsSummary
task: T033 - StrengthConfidenceCard
task: T034 - Barrel export

# Finally, pages are sequential:
task: T035 - Assessment landing page (needs T029)
task: T036 - Active session page (needs T030, T031)
task: T037 - Results page (needs T032, T033)
```

---

## MVP Scope Recommendation

**Minimum Viable Product** should include:
- ✅ Phase 1: Setup
- ✅ Phase 2: Foundational
- ✅ Phase 3: User Story 1 (Complete Fresh Assessment)
- ✅ Phase 4: User Story 2 (Pause and Resume)
- ✅ Phase 7: User Story 5 (Review Results)
- ⏸️ Phase 5: User Story 3 (Progress Visualization) - Nice to have
- ⏸️ Phase 6: User Story 4 (Adaptive Questions) - Nice to have
- ✅ Phase 8: Polish (Essential items: error handling, loading states, responsive design)

**Rationale**: US1, US2, and US5 deliver the core value proposition (discover strengths, pause/resume, understand results). US3 and US4 are enhancements that improve experience but aren't blocking for launch.

**Estimated Task Count**:
- MVP tasks: ~55 tasks (Phases 1, 2, 3, 4, 7, 8 essentials)
- Full feature: ~80 tasks (all phases)

---

## Implementation Strategy

1. **Week 1**: Complete Setup + Foundational phases (T001-T014) - establish solid foundation
2. **Week 2**: Implement US1 core flow (T015-T037) - get basic assessment working end-to-end
3. **Week 3**: Add US2 pause/resume (T038-T046) + US5 results (T059-T067) - complete MVP core features
4. **Week 4**: Add US3 visualizations (T047-T053) + US4 adaptive logic (T054-T058) - enhance experience
5. **Week 5**: Polish phase (T068-T080) - production readiness

**Delivery Milestones**:
- End of Week 2: Demo-able assessment flow
- End of Week 3: MVP ready for internal testing
- End of Week 4: Feature-complete for user testing
- End of Week 5: Production-ready

**Total Estimated Effort**: 80 tasks × ~2-4 hours average = 160-320 hours (~4-8 weeks for 1 developer, 2-4 weeks for 2 developers working in parallel)

---

## Format Validation ✅

All tasks follow the required checklist format:
- ✅ Checkbox: `- [ ]` at start
- ✅ Task ID: Sequential (T001-T080)
- ✅ [P] marker: Present for parallelizable tasks
- ✅ [Story] label: Present for user story phases (US1-US5)
- ✅ Description: Clear action with exact file path
- ✅ No setup/foundational tasks have story labels
- ✅ All user story tasks have story labels
- ✅ No polish tasks have story labels
