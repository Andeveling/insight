# Tasks: 360° Peer Feedback System

**Input**: Design documents from `/specs/001-peer-feedback/`  
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md  
**Feature Branch**: `001-peer-feedback`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database structure

- [X] T001 Extend Prisma schema with feedback models (FeedbackRequest, FeedbackQuestion, FeedbackResponse, FeedbackSummary, StrengthAdjustment) in prisma/schema.prisma
- [X] T002 Create database migration for feedback system in prisma/migrations/
- [X] T003 [P] Create feedback questions seeder in prisma/seeders/feedback-questions.seeder.ts with 5 behavioral questions from research.md
- [X] T004 [P] Create TypeScript types in lib/types/feedback.types.ts (FeedbackRequest, FeedbackResponse, InsightSummary, StrengthAdjustment interfaces)
- [X] T005 Run migration and seed feedback questions to populate database

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and services that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Implement anonymization utilities in lib/utils/feedback/anonymization.ts (generateAnonymousHash, canRespondAnonymously, saveAnonymousResponse functions)
- [X] T007 [P] Implement strength mapping service in lib/services/strength-mapping.service.ts (calculateStrengthScores, aggregatePeerFeedback based on research.md algorithm)
- [X] T008 [P] Create question mapper utility in lib/utils/feedback/question-mapper.ts (maps answer options to strength weights from research.md)
- [X] T009 Add FEEDBACK_ANONYMIZATION_SALT to environment variables (.env.local and deployment config)
- [X] T010 Add feedback relations to User model in prisma/schema.prisma (requestedFeedback, receivedFeedback, feedbackSummary, strengthAdjustments)
- [X] T011 Add feedback relation to Strength model in prisma/schema.prisma (strengthAdjustments)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Request Peer Feedback (Priority: P1) 🎯 MVP

**Goal**: Users can select 3-5 teammates, choose anonymity preference, and send feedback requests with email/in-app notifications

**Independent Test**: User navigates to feedback request page, selects teammates, submits request, teammates receive notifications, requester can track pending requests in dashboard

### Implementation for User Story 1

- [X] T012 [P] [US1] Create feedback request page in app/dashboard/feedback/request/page.tsx with teammate selector
- [X] T013 [P] [US1] Create FeedbackRequestForm component in app/dashboard/feedback/_components/feedback-request-form.tsx with validation (3-5 teammates, anonymity toggle)
- [X] T014 [P] [US1] Create feedback request service in app/dashboard/feedback/_services/feedback-request.service.ts (createFeedbackRequest, validateTeamMembership, checkCooldownPeriod, markExpiredRequests)
- [X] T015 [US1] Create feedback request server action in app/dashboard/feedback/_actions/feedback-request.actions.ts (calls service, handles errors)
- [X] T016 [US1] Implement cooldown validation (30-day check per respondent) in feedback-request.service.ts
- [X] T017 [US1] Create feedback notification utility in app/dashboard/feedback/_utils/feedback-notification.ts (sendRequestNotification using email templates from research.md)
- [X] T018 [US1] Create feedback dashboard page in app/dashboard/feedback/page.tsx showing pending/sent/completed requests
- [X] T019 [US1] Implement request status tracking with filters (pending, completed, declined, expired)
- [X] T020 [US1] Add validation to prevent self-requests and duplicate requests within cooldown period

**Checkpoint**: User Story 1 complete - users can request feedback and track requests

---

## Phase 4: User Story 2 - Provide Feedback to Peer (Priority: P1) 🎯 MVP

**Goal**: Respondents can complete 5-question survey in <3 minutes with progress tracking, anonymity enforced, and partial save capability

**Independent Test**: User clicks notification link, sees 5 questions, selects answers, submits, sees thank you confirmation, or declines request

### Implementation for User Story 2

- [X] T021 [P] [US2] Create feedback response page in app/dashboard/feedback/respond/[requestId]/page.tsx with request validation
- [X] T022 [P] [US2] Create FeedbackQuestionnaire component in app/dashboard/feedback/_components/feedback-questionnaire.tsx with progress indicator (Question X of 5)
- [X] T023 [P] [US2] Load 5 behavioral questions from database in correct order (based on FeedbackQuestion.order)
- [X] T024 [US2] Create feedback response service in app/dashboard/feedback/_services/feedback-response.service.ts (saveResponse, updateRequestStatus, handleDecline, savePartialProgress)
- [X] T025 [US2] Create feedback response server action in app/dashboard/feedback/_actions/feedback-response.actions.ts
- [X] T026 [US2] Implement anonymous response saving using anonymization.ts utilities (hash-based, no respondentId stored)
- [X] T027 [US2] Implement attributed response saving (includes respondentId when isAnonymous=false)
- [X] T028 [US2] Add partial progress save on navigation away (localStorage for draft answers, restore on return)
- [X] T029 [US2] Implement decline functionality (mark request as declined, notify requester)
- [X] T030 [US2] Show thank you confirmation page after submission with response recorded message
- [X] T031 [US2] Add request expiration check (if expiresAt < now, show expired message)

**Checkpoint**: User Story 2 complete - respondents can provide feedback with full anonymity protection

---

## Phase 5: User Story 3 - View Insights & Update Profile (Priority: P2)

**Goal**: Users with 3+ responses see AI-generated insights revealing perception gaps and can preview/apply strength profile adjustments

**Independent Test**: User with 3+ responses views insights page, sees patterns (peers agree/disagree with self-assessment), previews suggested adjustments, accepts or rejects profile changes

### Implementation for User Story 3

- [X] T032 [P] [US3] Create insights page in app/dashboard/feedback/insights/page.tsx with minimum 3 responses check
- [X] T033 [P] [US3] Create InsightSummary component in app/dashboard/feedback/_components/insight-summary.tsx displaying AI-generated paragraphs
- [X] T034 [P] [US3] Create StrengthAdjustmentPreview component in app/dashboard/feedback/_components/strength-adjustment-preview.tsx showing current vs. suggested profile
- [X] T035 [P] [US3] Implement insight generator utility in lib/utils/feedback/insight-generator.ts (buildInsightPrompt, callAI, generateRuleBasedInsights fallback from research.md)
- [X] T036 [US3] Create feedback analysis service in lib/services/feedback-analysis.service.ts (aggregateResponses, calculateConfidenceDeltas, generateInsights)
- [X] T037 [US3] Create feedback insights server action in lib/actions/feedback-insights.actions.ts (loadInsights, acceptAdjustments, rejectAdjustments)
- [X] T038 [US3] Integrate Vercel AI SDK for insight generation with prompt template from research.md
- [X] T039 [US3] Implement rule-based fallback logic when AI unavailable (agreements, blindSpotsHigh, blindSpotsLow from research.md)
- [X] T040 [US3] Create FeedbackSummary record after 3+ responses (aggregate all responses, generate insights, store in database)
- [X] T041 [US3] Implement strength adjustment suggestions (calculate confidence deltas per strength based on peer feedback)
- [X] T042 [US3] Add preview functionality to show updated profile before applying changes
- [X] T043 [US3] Implement accept adjustments action (update UserStrength confidence scores, mark StrengthAdjustment as accepted)
- [X] T044 [US3] Implement reject adjustments action (mark StrengthAdjustment as rejected, keep current profile)
- [X] T045 [US3] Add "New Insights Available" notification badge when 3+ responses received

**Checkpoint**: User Story 3 complete - users can view insights and update profiles based on peer feedback

---

## Phase 6: User Story 4 - Track Feedback History (Priority: P3)

**Goal**: Users view historical feedback cycles with trend visualizations showing strength perception changes over time

**Independent Test**: User with multiple feedback cycles views history page, sees timeline of cycles, compares two time periods, visualizes stable vs. evolving perceptions

### Implementation for User Story 4

- [X] T046 [P] [US4] Create feedback history page in app/dashboard/feedback/history/page.tsx with timeline view
- [X] T047 [P] [US4] Query all FeedbackSummary records for user ordered by lastResponseAt descending
- [X] T048 [P] [US4] Display feedback cycles with dates, respondent counts, and insights summaries
- [X] T049 [US4] Implement time period comparison selector (select two cycles to compare)
- [X] T050 [US4] Calculate strength perception changes between selected cycles (delta in confidence scores)
- [X] T051 [US4] Create trend visualization showing stable strengths (low variance) vs. evolving strengths (high variance over time)
- [X] T052 [US4] Add export functionality to download historical data as CSV or PDF

**Checkpoint**: User Story 4 complete - users can track their growth journey over time

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements, background jobs, and production readiness

- [X] T053 [P] Create background job for expiring requests (mark requests as expired when expiresAt < now, run every 6 hours)
- [X] T054 [P] Implement notification delivery tracking (log sent/delivered/opened events from email provider webhooks)
- [X] T055 [P] Add rate limiting to feedback request endpoint (max 10 requests per user per day)
- [X] T056 [P] Implement caching for feedback questions (in-memory cache, static data)
- [X] T057 [P] Implement caching for user insights (5-minute cache, recompute on demand)
- [X] T058 [P] Add database indexes for performance (status+expiresAt for cleanup, respondentId+status for pending queries, requestId for aggregation)
- [X] T059 [P] Create admin analytics queries (response rates, completion rates, time-to-complete metrics)
- [X] T060 [P] Add error logging for AI insight generation failures
- [X] T061 [P] Implement anonymization security audit checklist validation
- [X] T062 [P] Add success metrics tracking (SC-001 through SC-010 from plan.md)
- [X] T063 Create comprehensive error handling with user-friendly messages throughout feedback flow
- [X] T064 Add loading states and skeleton screens for all async operations

---

## Testing Tasks (E2E with Playwright)

**Purpose**: Ensure critical user journeys work end-to-end

- [ ] T065 [P] E2E test: Complete feedback request flow in tests/e2e/feedback/request-feedback.spec.ts
  - User selects 3 teammates, sets anonymous, submits, verifies notifications sent
- [ ] T066 [P] E2E test: Complete feedback response flow in tests/e2e/feedback/respond-feedback.spec.ts
  - User receives request, answers 5 questions, submits, verifies response saved anonymously
- [ ] T067 [P] E2E test: View insights and update profile in tests/e2e/feedback/view-insights.spec.ts
  - User with 3+ responses views insights, previews adjustments, accepts changes, verifies profile updated
- [ ] T068 [P] E2E test: Decline feedback request flow
  - User declines request, verifies requester notified, request marked declined
- [ ] T069 [P] E2E test: Cooldown period validation
  - User attempts duplicate request within 30 days, verifies error message shown
- [ ] T070 [P] E2E test: Partial progress save and resume
  - User starts questionnaire, navigates away, returns, verifies answers persisted

---

## Unit Testing Tasks (Vitest)

**Purpose**: Test critical utility functions and business logic

- [ ] T071 [P] Unit test: question-mapper.ts in tests/unit/question-mapper.test.ts
  - Test strength weight calculations for all 5 questions
- [ ] T072 [P] Unit test: insight-generator.ts in tests/unit/insight-generator.test.ts
  - Test AI prompt generation, rule-based fallback logic
- [ ] T073 [P] Unit test: anonymization.ts in tests/unit/anonymization.test.ts
  - Test hash generation, duplicate detection, cannot reverse engineer respondent
- [ ] T074 [P] Unit test: strength-mapping.service.ts in tests/unit/strength-mapping.test.ts
  - Test calculateStrengthScores, aggregatePeerFeedback, median calculation for conflicts
- [ ] T075 [P] Unit test: feedback-request.service.ts in tests/unit/feedback-request.test.ts
  - Test cooldown validation, team membership validation, expiration logic

---

## Dependencies Graph

**User Story Completion Order**:
```
Setup (Phase 1) 
  ↓
Foundational (Phase 2)
  ↓
├─→ US1: Request Feedback (P1) ←─┐
│                                 │
├─→ US2: Provide Feedback (P1) ←─┤  Can be parallel after Phase 2
│                                 │
└─→ US3: View Insights (P2) ←─────┘  Depends on US1 + US2 data existing
      ↓
    US4: History (P3)  Depends on US3 existing + multiple cycles
```

**Task Dependencies Within Stories**:
- **US1**: T012-T014 can be parallel, T015 depends on T014, T016-T020 depend on T015
- **US2**: T021-T023 can be parallel, T024 depends on T008 (strength-mapping), T025-T031 depend on T024
- **US3**: T032-T035 can be parallel, T036 depends on T007+T008+T035, T037-T045 depend on T036
- **US4**: T046-T048 can be parallel, T049-T052 depend on T048

---

## Parallel Execution Opportunities

### After Phase 2 Complete (T001-T011):

**Parallel Group 1** (US1 Frontend):
- T012: Create request page
- T013: Create request form component

**Parallel Group 2** (US1 Backend):
- T014: Create request service
- T017: Create notification utility

**Parallel Group 3** (US2 Frontend):
- T021: Create response page
- T022: Create questionnaire component

**Parallel Group 4** (US2 Backend):
- T024: Create response service

**Parallel Group 5** (US3 Components):
- T032: Create insights page
- T033: Create insight summary component
- T034: Create adjustment preview component
- T035: Create insight generator utility

**Parallel Group 6** (Testing):
- All E2E tests (T065-T070) can run in parallel
- All unit tests (T071-T075) can run in parallel

---

## Implementation Strategy

### MVP Scope (Minimum for Launch)
**ONLY User Story 1 + User Story 2** = Functional feedback request/response cycle
- Users can request feedback ✅
- Users can respond to feedback ✅
- Basic notification system ✅
- Anonymity enforced ✅
- **Estimated**: 15-20 tasks (T001-T031)

### MVP+ Scope (Recommended Launch)
**User Story 1 + 2 + 3** = Full value delivery with insights
- All MVP features ✅
- AI-generated insights ✅
- Profile adjustment capability ✅
- **Estimated**: 30-35 tasks (T001-T045)

### Full Feature Scope
**All User Stories (1 + 2 + 3 + 4)** = Complete feature with history
- All MVP+ features ✅
- Historical trend tracking ✅
- Longitudinal insights ✅
- **Estimated**: 40-45 tasks (T001-T052)

### Production Readiness
**Full Feature + Polish + Tests** = Production-ready deployment
- All features ✅
- Background jobs ✅
- Performance optimization ✅
- Comprehensive tests ✅
- **Estimated**: 60-75 tasks (T001-T075)

---

## Task Summary

| Phase          | Task Count           | Can Parallelize       |
| -------------- | -------------------- | --------------------- |
| Setup          | 5 tasks (T001-T005)  | 2 parallel            |
| Foundational   | 6 tasks (T006-T011)  | 4 parallel            |
| US1 (Request)  | 9 tasks (T012-T020)  | 3 parallel            |
| US2 (Respond)  | 11 tasks (T021-T031) | 3 parallel            |
| US3 (Insights) | 14 tasks (T032-T045) | 4 parallel            |
| US4 (History)  | 7 tasks (T046-T052)  | 3 parallel            |
| Polish         | 12 tasks (T053-T064) | 10 parallel           |
| E2E Tests      | 6 tasks (T065-T070)  | 6 parallel            |
| Unit Tests     | 5 tasks (T071-T075)  | 5 parallel            |
| **TOTAL**      | **75 tasks**         | **40 parallelizable** |

**MVP Path**: T001-T031 (26 tasks) → ~2-3 weeks with 2 developers  
**MVP+ Path**: T001-T045 (45 tasks) → ~3-4 weeks with 2 developers  
**Full Feature**: T001-T064 (64 tasks) → ~4-5 weeks with 2 developers  
**Production Ready**: T001-T075 (75 tasks) → ~5-6 weeks with 2 developers

---

## Next Actions

1. **Review task breakdown** with team for feasibility and estimates
2. **Assign tasks** to developers based on expertise (frontend/backend/AI)
3. **Start with MVP scope** (T001-T031) for fastest time to value
4. **Run tests continuously** as implementation progresses
5. **Deploy incrementally** (US1 → US1+US2 → US1+US2+US3)

---

## Format Validation

✅ All tasks follow format: `- [ ] [TID] [P?] [Story?] Description with file path`  
✅ Tasks organized by user story (US1, US2, US3, US4)  
✅ Dependencies clearly documented  
✅ Parallel opportunities identified  
✅ MVP scope clearly defined  
✅ File paths are absolute and specific
