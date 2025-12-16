# Tasks: Development Module Refactor - Strength-Focused Learning

**Input**: Design documents from `/specs/007-development-refactor/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not included (not explicitly requested in feature specification)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are absolute from repository root

---

## Phase 1: Setup

**Purpose**: Database schema changes and foundational infrastructure

- [x] T001 Update Prisma schema with new fields in `prisma/schema.prisma` - Add `moduleType`, `userId`, `isArchived`, `generatedBy` to DevelopmentModule
- [x] T002 Add UserProfessionalProfile model to `prisma/schema.prisma`
- [x] T003 Add new relations to User model in `prisma/schema.prisma` - `professionalProfile` and `personalizedModules`
- [x] T004 Run database migration with `bun run db:migrate --name add_module_types_and_professional_profile`
- [x] T005 Regenerate Prisma client with `bun run db:generate`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create professional profile schema in `app/dashboard/development/_schemas/professional-profile.schema.ts`
- [x] T007 [P] Extend module schema with ModuleType in `app/dashboard/development/_schemas/module.schema.ts`
- [x] T008 Update barrel exports in `app/dashboard/development/_schemas/index.ts`
- [x] T009 Create module generator service in `lib/services/module-generator.service.ts` with Zod validation for AI outputs
- [x] T010 [P] Create motion tokens config for Gaming Fluent Design in `app/dashboard/development/_utils/motion-tokens.ts`
- [x] T011 Archive domain modules via SQL update - Set `isArchived = true` WHERE `strengthKey IS NULL AND domainKey IS NOT NULL`

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 & 2 - Strength-Based Module Access (Priority: P1) 🎯 MVP

**Goal**: Users with Top 5 defined see only modules for their strengths. Users without Top 5 see gate message.

**Independent Test**: 
- User without Top 5 → sees "Complete your assessment" message with CTA
- User with Top 5 → sees only general modules for their 5 strengths
- No domain modules visible

### Implementation for User Story 1 & 2

- [x] T012 [P] [US1] Create `getUserStrengthsForDevelopment` action in `app/dashboard/development/_actions/get-user-strengths.ts`
- [x] T013 [P] [US1] Create StrengthGate server component in `app/dashboard/development/_components/strength-gate.tsx`
- [x] T014 [P] [US1] Create StrengthsRequiredMessage component in `app/dashboard/development/_components/strengths-required-message.tsx` with motion/react animations
- [x] T015 [US1] Modify `getModules` action in `app/dashboard/development/_actions/get-modules.ts` to filter by user Top 5 strengths only
- [x] T016 [US1] Modify `getModules` to exclude archived modules (`isArchived = false`)
- [x] T017 [US1] Modify `getModules` to return separate `general` and `personalized` arrays
- [x] T018 [P] [US2] Create ModuleTypeBadge component in `app/dashboard/development/_components/module-type-badge.tsx` with motion/react
- [x] T019 [US2] Modify ModuleCard component in `app/dashboard/development/_components/module-card.tsx` to show ModuleTypeBadge
- [x] T020 [US2] Modify ModuleList component in `app/dashboard/development/_components/module-list.tsx` to display two sections (General/Personalizado)
- [x] T021 Update barrel exports in `app/dashboard/development/_components/index.ts`
- [x] T022 Update barrel exports in `app/dashboard/development/_actions/index.ts`
- [x] T023 [US1] Integrate StrengthGate in main page `app/dashboard/development/page.tsx`

**Checkpoint**: User Story 1 & 2 complete - Users see only strength-based general modules

---

## Phase 4: User Story 3 - Personalized Modules (Priority: P2)

**Goal**: Users can receive AI-generated personalized modules based on their professional profile and specific strength

**Independent Test**:
- User can generate a personalized module for one of their Top 5 strengths
- Generated module appears in "Personalizado" section
- Module content reflects user's professional context

### Implementation for User Story 3

- [x] T024 [P] [US3] Create `getProfessionalProfile` action in `app/dashboard/development/_actions/get-professional-profile.ts`
- [x] T025 [P] [US3] Create `saveProfessionalProfile` action in `app/dashboard/development/_actions/save-professional-profile.ts`
- [x] T026 [US3] Create `generatePersonalizedModule` action in `app/dashboard/development/_actions/generate-personalized.ts` using module-generator service
- [x] T027 [P] [US3] Create ProfessionalProfileForm client component in `app/dashboard/development/_components/professional-profile-form.tsx` with React Hook Form + motion/react
- [x] T028 [P] [US3] Create GenerateModuleButton client component in `app/dashboard/development/_components/generate-module-button.tsx` with loading state
- [x] T029 [US3] Create useModuleGeneration hook in `app/dashboard/development/_hooks/use-module-generation.ts`
- [x] T030 Update barrel exports in `app/dashboard/development/_hooks/index.ts`
- [x] T031 [US3] Integrate GenerateModuleButton in ModulesSection of `app/dashboard/development/page.tsx`

**Checkpoint**: User Story 3 complete - Users can generate personalized modules

---

## Phase 5: User Story 4 - Sequential Progression (Priority: P2)

**Goal**: Block new module generation until all pending modules are completed

**Independent Test**:
- User with 1+ pending modules → Generate button disabled with tooltip
- User with 0 pending modules → Generate button enabled
- Completing a module re-enables generation

### Implementation for User Story 4

- [x] T032 [US4] Create `checkCanGenerateModule` action in `app/dashboard/development/_actions/check-can-generate.ts`
- [x] T033 [US4] Modify GenerateModuleButton to use checkCanGenerateModule and show disabled state with tooltip
- [x] T034 [P] [US4] Create PendingModulesTooltip component in `app/dashboard/development/_components/pending-modules-tooltip.tsx` with motion shake animation
- [x] T035 [US4] Update GenerateModuleButton to show PendingModulesTooltip when generation blocked
- [x] T036 Update barrel exports in `app/dashboard/development/_actions/index.ts`

**Checkpoint**: User Story 4 complete - Sequential progression enforced ✅

---

## Phase 6: User Story 5 - Professional Profile Onboarding (Priority: P3)

**Goal**: First-time users see a professional profile questionnaire before accessing modules

**Independent Test**:
- New user with Top 5 but no profile → sees questionnaire
- User completes questionnaire → data saved, modules shown
- User skips questionnaire → neutral defaults used, modules shown
- Returning user → no questionnaire, direct to modules

### Implementation for User Story 5

- [x] T037 [P] [US5] Create ProfessionalProfileCheck wrapper component in `app/dashboard/development/_components/professional-profile-check.tsx`
- [x] T038 [P] [US5] Create ProfileOnboardingModal client component in `app/dashboard/development/_components/profile-onboarding-modal.tsx` with motion/react
- [x] T039 [US5] Create useProfileOnboarding hook in `app/dashboard/development/_hooks/use-profile-onboarding.ts`
- [x] T040 [US5] Integrate ProfessionalProfileCheck in main page after StrengthGate in `app/dashboard/development/page.tsx`
- [x] T041 Update barrel exports in `app/dashboard/development/_hooks/index.ts`
- [x] T042 Update barrel exports in `app/dashboard/development/_components/index.ts`

**Checkpoint**: User Story 5 complete - Onboarding flow operational ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, cleanup, and validation

- [x] T043 [P] Verify all motion/react animations work smoothly across components
- [x] T044 [P] Add loading skeletons for async components in `app/dashboard/development/_components/`
- [x] T045 Verify gamification integration (XP, badges) works with new module types
- [x] T046 Update development module detail page `app/dashboard/development/[moduleId]/page.tsx` to handle personalized modules
- [x] T047 [P] Validate error states and fallbacks for AI generation failures
- [x] T048 Run quickstart.md validation checklist
- [x] T049 [P] Update any TypeScript types in `lib/types/` if needed

**Checkpoint**: Feature 007-development-refactor complete ✅

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ─── BLOCKS ALL USER STORIES
    ↓
┌───┴────────────────────────────────┐
│                                    │
▼                                    ▼
Phase 3 (US1 & US2)            Phase 4 (US3)*
    ↓                                ↓
Phase 5 (US4)                  Phase 6 (US5)
    ↓                                ↓
└───┬────────────────────────────────┘
    ↓
Phase 7 (Polish)

* Phase 4 can start in parallel with Phase 3 after Foundational
```

### Task Dependencies Within Phases

**Phase 1**: T001 → T002 → T003 → T004 → T005 (sequential - schema changes)

**Phase 2**: 
- T006, T007, T009, T010 can run in parallel
- T008 depends on T006, T007
- T011 depends on T004

**Phase 3**:
- T012, T013, T014, T018 can run in parallel
- T015, T016, T017 are sequential (same file)
- T019 depends on T018
- T020 depends on T017, T019
- T021 depends on all components
- T022 depends on T012, T015
- T023 depends on T013, T020

**Phase 4**:
- T024, T025 can run in parallel
- T026 depends on T009, T024
- T027, T028 can run in parallel
- T029 depends on T026, T028
- T031 depends on T028, T029

**Phase 5**:
- T032 first
- T033 depends on T032
- T034 parallel with T033
- T035 depends on T033, T034

**Phase 6**:
- T037, T038 can run in parallel
- T039 depends on T024
- T040 depends on T037, T038
- T041, T042 are barrel export updates

### Parallel Opportunities per Phase

```bash
# Phase 2 - Schemas & Infrastructure (4 parallel tracks)
T006, T007, T009, T010 → then T008

# Phase 3 - Core Gates & Modules (3 parallel tracks)
Track 1: T012 → T015 → T016 → T017
Track 2: T013 → T014
Track 3: T018 → T019 → T020
Merge: T021, T022, T023

# Phase 4 - Personalization (2 parallel tracks)
Track 1: T024, T025 → T026
Track 2: T027, T028 → T029
Merge: T030, T031

# Phase 5 - Progression Gate (2 parallel tracks)
Track 1: T032 → T033 → T035
Track 2: T034
Merge: T036

# Phase 6 - Onboarding (2 parallel tracks)  
Track 1: T037, T038 → T040
Track 2: T039
Merge: T041, T042
```

---

## Summary

| Metric                    | Count |
| ------------------------- | ----- |
| **Total Tasks**           | 49    |
| **Setup Phase**           | 5     |
| **Foundational Phase**    | 6     |
| **User Story 1 & 2 (P1)** | 12    |
| **User Story 3 (P2)**     | 8     |
| **User Story 4 (P2)**     | 5     |
| **User Story 5 (P3)**     | 6     |
| **Polish Phase**          | 7     |
| **Parallel Tasks**        | 23    |

### MVP Scope

**Minimum Viable Product** = Phase 1 + Phase 2 + Phase 3 (Tasks T001-T023)

This delivers:
- ✅ Strength gate (require Top 5)
- ✅ Filter modules by user's strengths only
- ✅ No domain modules
- ✅ General modules displayed with badges
- ✅ Basic structure for personalized (empty initially)

### Suggested Implementation Order (Single Developer)

1. **Day 1**: T001-T011 (Setup + Foundational)
2. **Day 2**: T012-T023 (US1 & US2 - Core MVP)
3. **Day 3**: T024-T031 (US3 - Personalization)
4. **Day 4**: T032-T036 (US4 - Progression) + T037-T042 (US5 - Onboarding)
5. **Day 5**: T043-T049 (Polish)

---

## Implementation Strategy

1. **MVP First**: Complete Phase 1-3 for a working strength-based module system
2. **Incremental Delivery**: Each user story phase delivers testable functionality
3. **AI Integration Last**: Personalized module generation (Phase 4) can be stubbed initially
4. **Polish Iteratively**: Phase 7 tasks can be addressed throughout development

---

## Validation Checklist

After completing all phases, verify:

- [ ] User without Top 5 sees strength gate with CTA to assessment
- [ ] User with Top 5 sees ONLY modules for their 5 strengths
- [ ] No domain-based modules appear anywhere
- [ ] General modules show "General" badge with Shield icon
- [ ] Personalized modules show "Personalizado" badge with Sparkles icon
- [ ] New user sees professional profile questionnaire on first visit
- [ ] Profile can be completed or skipped
- [ ] User with pending modules cannot generate new ones
- [ ] User with all completed can generate personalized module
- [ ] AI generation creates module and challenges correctly
- [ ] XP and gamification still work with new module types
- [ ] All motion/react animations are smooth
