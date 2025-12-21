---
description: "Task list for Refactor Dashboard Root feature"
---

# Tasks: Refactor Dashboard Root

**Input**: Design documents from `/specs/011-refactor-dashboard-root/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Manual verification as defined in spec.md (Independent Tests).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure for CyberPunk UI components in app/dashboard/_components/cyber-ui/

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 [P] Implement CyberCard component with clip-path and layered borders in app/dashboard/_components/cyber-ui/cyber-card.tsx
- [ ] T003 [P] Implement CyberButton component with hover effects and variants in app/dashboard/_components/cyber-ui/cyber-button.tsx
- [ ] T004 [P] Implement CyberBadge component for status indicators in app/dashboard/_components/cyber-ui/cyber-badge.tsx

**Checkpoint**: CyberPunk UI components ready - user story implementation can now begin

## Phase 3: User Story 1 - Personal Development Overview (Priority: P1) 🎯 MVP

**Goal**: Display personal development progress (Level, XP) immediately upon login.

**Independent Test**: Log in as a user with progress and verify the Hero section displays correct Level, XP, and "Continue Learning" CTA.

### Implementation for User Story 1

- [ ] T005 [US1] Create HeroSection component using CyberCard in app/dashboard/_components/hero-section.tsx
- [ ] T006 [US1] Refactor dashboard page to fetch UserProgress using get-user-progress action in app/dashboard/page.tsx
- [ ] T007 [US1] Integrate HeroSection into dashboard page passing progress data in app/dashboard/page.tsx

**Checkpoint**: User Story 1 functional - Hero section visible with real data

## Phase 4: User Story 2 - Strengths Profile Visualization (Priority: P1)

**Goal**: Visualize Top 5 Strengths in a high-tech style.

**Independent Test**: Verify dashboard renders the user's top 5 strengths using the new UI components.

### Implementation for User Story 2

- [ ] T008 [US2] Create StrengthsCard component to visualize top strengths in app/dashboard/_components/strengths-card.tsx
- [ ] T009 [US2] Update dashboard page to fetch StrengthProfile using get-user-strengths action in app/dashboard/page.tsx
- [ ] T010 [US2] Integrate StrengthsCard into dashboard page passing strengths data in app/dashboard/page.tsx

**Checkpoint**: User Story 2 functional - Strengths card visible with real data

## Phase 5: User Story 3 - Quick Access to Recommendations (Priority: P2)

**Goal**: Display AI-driven recommendations for next steps.

**Independent Test**: Verify "Recommended for You" section displays modules returned by the recommendation service.

### Implementation for User Story 3

- [ ] T011 [US3] Create Recommendations component to list suggested modules in app/dashboard/_components/recommendations.tsx
- [ ] T012 [US3] Update dashboard page to fetch ModuleRecommendation using get-ai-recommendations action in app/dashboard/page.tsx
- [ ] T013 [US3] Integrate Recommendations component into dashboard page passing recommendations data in app/dashboard/page.tsx

**Checkpoint**: User Story 3 functional - Recommendations list visible with real data

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final adjustments and edge case handling

- [ ] T014 Refactor Team section to be secondary (below Hero/Strengths) in app/dashboard/page.tsx
- [ ] T015 Ensure responsive design for CyberPunk components on mobile in app/dashboard/_components/cyber-ui/cyber-card.tsx
- [ ] T016 Verify empty states for new users (no progress/strengths) in app/dashboard/page.tsx

## Dependencies

1.  **T001-T004** (Foundational UI) must be done first.
2.  **US1 (T005-T007)** depends on Foundational UI.
3.  **US2 (T008-T010)** depends on Foundational UI.
4.  **US3 (T011-T013)** depends on Foundational UI.
5.  **US1, US2, US3** can be implemented in parallel after Phase 2.

## Parallel Execution Examples

- **Developer A**: Implement US1 (Hero Section)
- **Developer B**: Implement US2 (Strengths Card)
- **Developer C**: Implement US3 (Recommendations)

## Implementation Strategy

1.  **MVP**: Complete Phase 1, Phase 2, and Phase 3 (US1). This gives the core "Personal Development" focus.
2.  **Increment 1**: Add Phase 4 (US2) to bring in the Strengths aspect.
3.  **Increment 2**: Add Phase 5 (US3) for AI recommendations.
4.  **Final**: Polish layout and responsiveness.
