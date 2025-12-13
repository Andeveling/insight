# Tasks: Sub-Team Builder & Match Analyzer

**Feature**: 003-subteam-builder  
**Branch**: `003-subteam-builder`  
**Input**: Design documents from `/specs/003-subteam-builder/`

---

## Task Format

**Format**: `- [ ] [TaskID] [P?] [Story?] Description with file path`

- **[P]**: Parallelizable (can run simultaneously with other [P] tasks)
- **[Story]**: User story label (US1, US2, US3, US4, US5)
- File paths are absolute from repository root

---

## Implementation Strategy

**MVP Scope**: User Story 1 (P1) - Crear Sub-Equipo para Proyecto

**Incremental Delivery**:
1. Phase 1-2: Setup + Foundation (blocking)
2. Phase 3: US1 (P1) - MVP release candidate
3. Phase 4: US2 (P2) - Add match score intelligence
4. Phase 5: US3 (P2) - Add gap analysis
5. Phase 6: US4 (P3) - Add What-If simulation
6. Phase 7: US5 (P3) - Add report generation
7. Phase 8: Polish & Cross-cutting concerns

Each user story is independently testable and delivers incremental value.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Install new dependencies: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, @react-pdf/renderer
- [x] T002 [P] Create directory structure in app/dashboard/team/[teamId]/sub-teams/ with _components, _actions, _hooks, _schemas, _utils subdirectories
- [x] T003 [P] Copy contract types from specs/003-subteam-builder/contracts/ to lib/types/
- [x] T004 [P] Add barrel export for sub-team types in lib/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before ANY user story implementation

**⚠️ CRITICAL**: Phase 3+ cannot begin until these tasks complete

### Database Foundation

- [x] T005 Add SubTeam and ProjectTypeProfile models to prisma/schema.prisma
- [x] T006 Add createdSubTeams relation to User model in prisma/schema.prisma
- [x] T007 Add subTeams relation to Team model in prisma/schema.prisma
- [x] T008 Create migration with `bun prisma migrate dev --name add_subteam_models`
- [x] T009 Create project types seed data file in prisma/data/project-types.data.ts
- [x] T010 Create seed-project-types.ts seeder in prisma/seeders/
- [x] T011 Update prisma/seed.ts to include project types seeder
- [x] T012 Run seed script with `bun prisma db seed`
- [x] T013 Verify seed data in Prisma Studio (4 project type profiles)

### Core Business Logic

- [x] T014 [P] Create match score calculator utility in lib/utils/subteam/match-score-calculator.ts
- [x] T015 [P] Create gap analyzer utility in lib/utils/subteam/gap-analyzer.ts
- [x] T016 [P] Create strength coverage utility in lib/utils/subteam/strength-coverage.ts
- [x] T017 [P] Create SubTeamService in lib/services/subteam.service.ts with base CRUD methods

**Checkpoint**: Foundation complete - user stories can now be implemented in parallel

---

## Phase 3: User Story 1 - Crear Sub-Equipo para Proyecto (Priority: P1) 🎯 MVP

**Goal**: Allow team leaders to create sub-teams by selecting members and defining project type

**Independent Test**: Create a sub-team with name, members, and project type, then verify it appears in the list

### Database Queries (US1)

- [x] T018 [P] [US1] Implement getSubTeamsList method in lib/services/subteam.service.ts
- [x] T019 [P] [US1] Implement getSubTeamDetail method in lib/services/subteam.service.ts
- [x] T020 [P] [US1] Implement getTeamMembersForSelector method in lib/services/subteam.service.ts
- [x] T021 [P] [US1] Implement getProjectTypeProfiles method in lib/services/subteam.service.ts

### Server Actions (US1)

- [x] T022 [US1] Create createSubTeam server action in app/dashboard/team/[teamId]/sub-teams/_actions/create-subteam.ts
- [x] T023 [US1] Add Zod validation with createSubTeamSchema in _actions/create-subteam.ts
- [x] T024 [US1] Add authorization check (user is team member) in _actions/create-subteam.ts
- [x] T025 [US1] Add revalidatePath after successful creation in _actions/create-subteam.ts

### Zod Schemas (US1)

- [x] T026 [P] [US1] Create subteam.schema.ts in app/dashboard/team/[teamId]/sub-teams/_schemas/
- [x] T027 [P] [US1] Define createSubTeamSchema with validation rules (name 3-50 chars, members 2-10, etc.)
- [x] T028 [P] [US1] Create project-type.schema.ts in _schemas/ for project type validation

### UI Components - List View (US1)

- [x] T029 [US1] Create sub-teams list page in app/dashboard/team/[teamId]/sub-teams/page.tsx with PPR pattern
- [x] T030 [US1] Create SubTeamsListContent component (dynamic) in page.tsx
- [x] T031 [US1] Create SubTeamsListSkeleton component in _components/subteams-list-skeleton.tsx
- [x] T032 [US1] Create SubTeamsList component in _components/subteams-list.tsx
- [x] T033 [US1] Create SubTeamCard component in _components/subteam-card.tsx
- [x] T034 [US1] Add "Crear Sub-Equipo" button linking to /new in page.tsx

### UI Components - Create Form (US1)

- [x] T035 [US1] Create new sub-team page in app/dashboard/team/[teamId]/sub-teams/new/page.tsx
- [x] T036 [US1] Create SubTeamForm component in _components/subteam-form.tsx with React Hook Form
- [x] T037 [US1] Create ProjectTypeSelector component in _components/project-type-selector.tsx
- [x] T038 [US1] Create basic MemberSelector component (non-drag) in _components/member-selector.tsx
- [x] T039 [US1] Create MemberCard component in _components/member-card.tsx
- [x] T040 [US1] Add form submission handler calling createSubTeam action in SubTeamForm
- [x] T041 [US1] Add success/error toast notifications after form submission
- [x] T042 [US1] Add redirect to list page after successful creation

### UI Components - Detail View (US1)

- [x] T043 [US1] Create sub-team detail page in app/dashboard/team/[teamId]/sub-teams/[subTeamId]/page.tsx
- [x] T044 [US1] Create SubTeamDetail component in _components/subteam-detail.tsx
- [x] T045 [US1] Display sub-team name, description, project type, and member list
- [x] T046 [US1] Add "Edit" and "Delete" action buttons (UI only, no implementation yet)

### Validation & Edge Cases (US1)

- [x] T047 [US1] Add validation: minimum 2 members required
- [x] T048 [US1] Add validation: maximum 10 members allowed
- [x] T049 [US1] Add validation: no duplicate members
- [x] T050 [US1] Add error handling for team member not found
- [x] T051 [US1] Add error handling for unauthorized access (not team member)

**Checkpoint US1**: Sub-team creation flow is complete and testable end-to-end

---

## Phase 4: User Story 2 - Visualizar Match Score (Priority: P2)

**Goal**: Display automatically calculated compatibility score when creating/viewing sub-teams

**Independent Test**: Select different member combinations and verify score updates in real-time (0-100)

### Match Score Calculation (US2)

- [x] T052 [P] [US2] Implement calculateStrengthCoverage function in lib/utils/subteam/match-score-calculator.ts
- [x] T053 [P] [US2] Implement calculateDomainBalance function in lib/utils/subteam/match-score-calculator.ts
- [x] T054 [P] [US2] Implement calculateCultureFit function in lib/utils/subteam/match-score-calculator.ts
- [x] T055 [P] [US2] Implement calculateTeamSize function in lib/utils/subteam/match-score-calculator.ts
- [x] T056 [P] [US2] Implement calculateRedundancyPenalty function in lib/utils/subteam/match-score-calculator.ts
- [x] T057 [US2] Integrate all factors into calculateMatchScore main function
- [x] T058 [US2] Add caching mechanism to avoid redundant calculations

### Server Actions (US2)

- [x] T059 [US2] Create calculateMatchScore server action in _actions/calculate-match-score.ts
- [x] T060 [US2] Update createSubTeam action to calculate and store match score
- [x] T061 [US2] Store match score result in SubTeam.matchScore and SubTeam.analysis fields

### UI Components (US2)

- [x] T062 [US2] Create MatchScoreDisplay component in _components/match-score-display.tsx
- [x] T063 [US2] Add score visualization with color coding (excellent/good/fair/poor)
- [x] T064 [US2] Create MatchScoreBreakdown component showing factor details
- [x] T065 [US2] Display score in SubTeamForm during creation (preview)
- [x] T066 [US2] Display score in SubTeamDetail view
- [x] T067 [US2] Add score badge in SubTeamCard on list view

### Real-time Updates (US2)

- [x] T068 [US2] Create useMatchScore custom hook in _hooks/use-match-score.ts
- [x] T069 [US2] Add client-side score calculation for instant preview
- [x] T070 [US2] Debounce score calculation to avoid excessive recalculations
- [x] T071 [US2] Update score display when members are added/removed

**Checkpoint US2**: Match score calculation and display are fully functional

---

## Phase 5: User Story 3 - Análisis de Brechas (Priority: P2)

**Goal**: Show missing critical strengths for the project type with actionable recommendations

**Independent Test**: Create incomplete sub-team and verify gap analysis shows specific missing strengths

### Gap Analysis Logic (US3)

- [x] T072 [P] [US3] Implement identifyStrengthGaps function in lib/utils/subteam/gap-analyzer.ts
- [x] T073 [P] [US3] Implement compareDomainDistribution function in gap-analyzer.ts
- [x] T074 [P] [US3] Implement generateRecommendations function in gap-analyzer.ts
- [x] T075 [US3] Integrate gap analysis into calculateMatchScore result

### UI Components (US3)

- [x] T076 [US3] Create GapAnalysis component in _components/gap-analysis.tsx
- [x] T077 [US3] Display list of missing strengths with priorities (critical/recommended/optional)
- [x] T078 [US3] Show reason and impact for each gap
- [x] T079 [US3] Display recommendations list with actionable items
- [x] T080 [US3] Add collapsible section for detailed gap analysis
- [x] T081 [US3] Integrate GapAnalysis into SubTeamDetail view
- [x] T082 [US3] Show gap summary in SubTeamForm during creation

### Suggested Members (US3)

- [x] T083 [US3] Implement getSuggestedMembersForGap function in lib/services/subteam.service.ts
- [x] T084 [US3] Display suggested members who have missing strengths
- [x] T085 [US3] Add "Add to team" quick action for suggested members

**Checkpoint US3**: Gap analysis provides actionable insights for team improvement

---

## Phase 6: User Story 4 - Simulador "What-If" (Priority: P3)

**Goal**: Allow simulation of member swaps without persisting changes

**Independent Test**: Activate What-If mode, swap members, verify projected score changes, cancel to revert

### What-If State Management (US4)

- [x] T086 [P] [US4] Create useWhatIf custom hook in _hooks/use-what-if.ts
- [x] T087 [P] [US4] Implement startSimulation function in useWhatIf hook
- [x] T088 [P] [US4] Implement swapMember function in useWhatIf hook
- [x] T089 [P] [US4] Implement cancelSimulation function in useWhatIf hook
- [x] T090 [P] [US4] Implement applySimulation function calling update action
- [x] T091 [US4] Add simulation state tracking (original vs. simulated members)

### UI Components (US4)

- [x] T092 [US4] Create WhatIfSimulator component in _components/what-if-simulator.tsx
- [x] T093 [US4] Add "Simulate Changes" button in SubTeamDetail view
- [x] T094 [US4] Show simulation mode indicator (banner/badge)
- [x] T095 [US4] Display original score vs. projected score side-by-side
- [x] T096 [US4] Add member swap interface (remove one, add another)
- [x] T097 [US4] Add "Apply Changes" button to persist simulation
- [x] T098 [US4] Add "Cancel" button to discard simulation
- [x] T099 [US4] Show score delta (+/- points) for each swap

### Server Actions (US4)

- [x] T100 [US4] Create updateSubTeam server action in _actions/update-subteam.ts
- [x] T101 [US4] Add authorization check (only creator or admin can update)
- [x] T102 [US4] Recalculate match score when applying simulation changes

**Checkpoint US4**: What-If simulation enables risk-free exploration of team changes

---

## Phase 7: User Story 5 - Compartir Reporte (Priority: P3)

**Goal**: Generate and share visual reports of sub-team composition and analysis

**Independent Test**: Generate report and verify it contains team info, match score, and gaps

### PDF Generation (US5)

- [x] T103 [P] [US5] Create SubTeamReportDocument component in _components/subteam-report-pdf.tsx using @react-pdf/renderer
- [x] T104 [P] [US5] Design PDF layout with sections: header, members, score, gaps, recommendations
- [x] T105 [P] [US5] Add styling for PDF with consistent branding
- [x] T106 [US5] Create generateSubTeamReport server action in _actions/generate-report.ts
- [x] T107 [US5] Generate PDF blob and return download URL

### UI Components (US5)

- [x] T108 [US5] Add "Generar Reporte" button in SubTeamDetail view
- [x] T109 [US5] Show loading state while report is generating
- [x] T110 [US5] Provide download link for generated PDF
- [ ] T111 [US5] Add copy-to-clipboard for shareable link (future: persistent links)
- [x] T112 [US5] Show success message after report generation

### Report Content (US5)

- [x] T113 [US5] Include sub-team name, description, and project type in report
- [x] T114 [US5] List all members with their top 5 strengths
- [x] T115 [US5] Display match score with visual indicator
- [x] T116 [US5] Include factor breakdown in report
- [x] T117 [US5] List identified gaps and recommendations
- [x] T118 [US5] Add creation date and creator info in footer

**Checkpoint US5**: Reports enable effective communication with stakeholders

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Enhancements that span multiple user stories

### Drag-and-Drop Enhancement

- [ ] T119 [P] Upgrade MemberSelector to use @dnd-kit/core for drag-and-drop
- [ ] T120 [P] Create SortableMemberCard component in _components/sortable-member-card.tsx
- [ ] T121 [P] Add drag overlay and visual feedback during drag
- [ ] T122 [P] Implement touch device support for drag-and-drop

### Edit & Delete Operations

- [x] T123 Create edit page in app/dashboard/team/[teamId]/sub-teams/[subTeamId]/edit/page.tsx
- [x] T124 Reuse SubTeamForm component for editing with pre-filled data
- [x] T125 Create deleteSubTeam server action in _actions/delete-subteam.ts (soft delete)
- [x] T126 Add confirmation dialog before deletion

### Archive Feature

- [x] T127 [P] Create archiveSubTeam server action in _actions/archive-subteam.ts
- [x] T128 [P] Add "Archive" button in SubTeamDetail view
- [x] T129 [P] Add filter for archived sub-teams in list view
- [x] T130 [P] Add "Restore" action for archived sub-teams

### Filters & Sorting

- [x] T131 [P] Add project type filter dropdown in list view
- [ ] T132 [P] Add match score range filter (slider)
- [x] T133 [P] Add status filter (active/archived)
- [x] T134 [P] Add search by sub-team name
- [x] T135 [P] Add sort options (name, score, created date)
- [x] T136 Implement filter/sort logic in getSubTeamsList query

### Performance Optimization

- [ ] T137 [P] Add pagination to sub-team list (20 per page)
- [x] T138 [P] Optimize Prisma queries with proper select/include
- [x] T139 [P] Add loading skeletons for all async components
- [ ] T140 [P] Implement error boundaries for graceful error handling

### Accessibility

- [ ] T141 [P] Add ARIA labels to all interactive elements
- [ ] T142 [P] Test keyboard navigation for entire flow
- [ ] T143 [P] Ensure color contrast meets WCAG AA standards
- [ ] T144 [P] Add screen reader announcements for score updates

### Testing

- [ ] T145 [P] Write unit tests for match score calculator in tests/unit/match-score-calculator.test.ts
- [ ] T146 [P] Write unit tests for gap analyzer in tests/unit/gap-analyzer.test.ts
- [ ] T147 [P] Write E2E test for create sub-team flow in tests/e2e/subteam-builder.spec.ts
- [ ] T148 [P] Write E2E test for What-If simulation in tests/e2e/subteam-what-if.spec.ts
- [ ] T149 [P] Write E2E test for report generation in tests/e2e/subteam-report.spec.ts
- [ ] T150 Test with real user data from seed database

### Documentation

- [ ] T151 Update README.md with sub-team feature description
- [ ] T152 Add API documentation for server actions in docs/ folder
- [ ] T153 Create user guide for sub-team creation in docs/features/subteam-builder.md
- [ ] T154 Document match score algorithm in docs/algorithms/match-score.md

### Navigation Integration

- [x] T155 Add Sub-Teams to sidebar navigation (dynamically based on user's team)
- [x] T156 Create getUserTeam action to get current user's team ID

---

## Dependencies Graph

### Story Completion Order

```
Phase 1-2 (Setup + Foundation) → BLOCKING ALL
    ↓
Phase 3 (US1 - P1) → MVP Release
    ↓
Phase 4 (US2 - P2) ← Can start after US1 complete
    ↓
Phase 5 (US3 - P2) ← Depends on US2 (needs match score)
    ↓
Phase 6 (US4 - P3) ← Depends on US1, US2, US3
    ↓
Phase 7 (US5 - P3) ← Depends on US1, US2, US3
    ↓
Phase 8 (Polish) ← Can enhance any completed story
```

### Parallel Execution Opportunities

**After Foundation (Phase 2)**:
- All database query methods (T018-T021) can run in parallel
- All Zod schemas (T026-T028) can run in parallel
- Core UI components (T029-T033) can run in parallel after queries

**Within US2**:
- All match score factor calculations (T052-T056) can run in parallel
- UI components (T062-T067) can run in parallel after calculation logic

**Within US3**:
- Gap analysis functions (T072-T074) can run in parallel
- UI components (T076-T082) can run in parallel

**Within US4**:
- useWhatIf hook functions (T086-T090) can run in parallel

**Within US5**:
- PDF components (T103-T105) can run in parallel

**Phase 8 Polish**:
- Most tasks are independent and can run in parallel

---

## Parallel Execution Examples

### Example 1: Foundation Phase (After T013)
```bash
# Developer A
git checkout -b feat/queries
# Work on T018-T021 (database queries)

# Developer B  
git checkout -b feat/calculator
# Work on T014-T016 (calculators)

# Developer C
git checkout -b feat/service
# Work on T017 (SubTeamService)
```

### Example 2: US1 Implementation (After T025)
```bash
# Developer A
git checkout -b feat/us1-schemas
# Work on T026-T028 (Zod schemas)

# Developer B
git checkout -b feat/us1-list-ui
# Work on T029-T034 (List view UI)

# Developer C
git checkout -b feat/us1-form-ui
# Work on T035-T042 (Form UI)
```

### Example 3: US2 Calculation (After US1 complete)
```bash
# Developer A
git checkout -b feat/us2-coverage
# Work on T052 (strength coverage)

# Developer B
git checkout -b feat/us2-balance
# Work on T053 (domain balance)

# Developer C
git checkout -b feat/us2-culture
# Work on T054 (culture fit)

# Developer D
git checkout -b feat/us2-size
# Work on T055-T056 (team size + redundancy)
```

---

## Implementation Strategy Notes

### MVP First (Phase 3 - US1)
Focus on delivering a working sub-team creation flow first. Users can create and manage sub-teams without match scoring initially. This provides immediate value and validates the core UX.

### Incremental Intelligence (Phases 4-5)
Add match scoring (US2) and gap analysis (US3) as enhancements. These make the tool smarter but don't block core functionality.

### Advanced Features Last (Phases 6-7)
What-If simulation (US4) and reports (US5) are polish features that enhance the experience for power users.

### Independent Testing
Each user story can be tested independently:
- **US1**: Create sub-team → verify it appears in list
- **US2**: Select members → verify score updates
- **US3**: Create incomplete team → verify gaps shown
- **US4**: Simulate swap → verify score projection
- **US5**: Generate report → verify PDF content

---

## Total Task Count

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundation)**: 13 tasks
- **Phase 3 (US1 - P1)**: 34 tasks
- **Phase 4 (US2 - P2)**: 20 tasks
- **Phase 5 (US3 - P2)**: 14 tasks
- **Phase 6 (US4 - P3)**: 17 tasks
- **Phase 7 (US5 - P3)**: 16 tasks
- **Phase 8 (Polish)**: 36 tasks

**Total**: 154 tasks

**Parallelizable**: ~60 tasks (marked with [P])

**Estimated Timeline**:
- MVP (US1): 2 weeks with 2 developers
- US2+US3: 1.5 weeks with 2 developers
- US4+US5: 1 week with 1 developer
- Polish: 1 week with 2 developers

**Total**: ~5-6 weeks with proper parallelization

---

## Next Steps

1. ✅ Tasks breakdown complete
2. → Create feature branch: `git checkout -b 003-subteam-builder`
3. → Start with Phase 1: Setup (T001-T004)
4. → Complete Phase 2: Foundation (T005-T017) - BLOCKING
5. → Implement US1 (MVP): T018-T051
6. → Test US1 end-to-end before proceeding to US2
7. → Iterate through remaining user stories based on priority
