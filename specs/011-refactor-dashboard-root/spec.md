# Feature Specification: Refactor Dashboard Root

**Feature Branch**: `011-refactor-dashboard-root`
**Created**: 2025-12-21
**Status**: Draft
**Input**: User description: "Refactor dashboard root to focus on personal development and CyberPunk UI"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Personal Development Overview (Priority: P1)

As a user, I want to see my personal development progress immediately upon logging in, so that I know my current status and what to do next.

**Why this priority**: This aligns with the "Personal Development" north star, making individual growth the central focus of the dashboard.

**Independent Test**: Can be tested by logging in as a user with existing progress and verifying the dashboard displays the correct level, XP, and next recommended action.

**Acceptance Scenarios**:

1. **Given** a user with active progress, **When** they visit the dashboard, **Then** they see a "Hero" section displaying their current Level, XP bar, and a "Continue Learning" call-to-action for their active module.
2. **Given** a new user, **When** they visit the dashboard, **Then** they see a "Start Journey" call-to-action prompting them to take the initial assessment or start the first module.
3. **Given** the CyberPunk UI requirement, **When** viewing the overview, **Then** the containers use the specific clip-path shapes and neon borders defined in the design system.

---

### User Story 2 - Strengths Profile Visualization (Priority: P1)

As a user, I want to see my Top 5 Strengths visualized in a high-tech style, so that I am constantly reminded of my core capabilities.

**Why this priority**: Strengths are the foundation of the Insight platform. Visualizing them reinforces the user's identity.

**Independent Test**: Can be tested by verifying the dashboard renders the user's top 5 strengths using the new UI components.

**Acceptance Scenarios**:

1. **Given** a user with a completed strengths assessment, **When** they view the dashboard, **Then** they see a dedicated card listing their Top 5 strengths.
2. **Given** the design system, **When** rendering the strengths, **Then** each strength is displayed with a "tech" aesthetic (e.g., hexagonal icons or precision bars) and appropriate color coding (Emerald/Amber/Purple).

---

### User Story 3 - Quick Access to Recommendations (Priority: P2)

As a user, I want to see AI-driven recommendations for my next steps, so that I have a clear path forward without searching.

**Why this priority**: Reduces friction in the user journey and leverages the "Development" module's capabilities.

**Independent Test**: Can be tested by verifying that the "Recommended for You" section displays modules returned by the recommendation service.

**Acceptance Scenarios**:

1. **Given** a user with available recommendations, **When** they scroll down, **Then** they see a list of recommended modules or challenges.
2. **Given** a recommendation card, **When** clicked, **Then** it navigates the user to that specific module's detail or start page.

### Edge Cases

- **Empty State**: What happens if the user has no progress and no strengths assessed? (Should show onboarding/start CTA).
- **Server Error**: How does the dashboard handle failure to fetch progress or recommendations? (Should show graceful error or fallback content).
- **Mobile View**: How do the complex CyberPunk shapes adapt to small screens? (Should maintain aesthetic but ensure readability and touch targets).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch and display the user's current Gamification Level and XP from the Development module.
- **FR-002**: System MUST fetch and display the user's Top 5 Strengths.
- **FR-003**: System MUST determine the "Next Action" (e.g., resume active module, start recommended module) and provide a direct link.
- **FR-004**: System MUST display a summary of recent achievements or badges if available.
- **FR-005**: The UI MUST strictly adhere to the CyberPunk Design System guidelines:
    - Use the defined "cut corner" shapes for containers and buttons.
    - Use the specified dark color palette and neon accents.
    - Apply the "layered border" technique for visual depth.
    - Use the defined status colors (Emerald, Amber, Purple, Indigo).
- **FR-006**: Team information (e.g., "My Team") MUST be secondary to personal information (placed below or in a smaller section).

### Key Entities

- **UserProgress**: Contains Level, XP, and current streak.
- **StrengthProfile**: The user's top 5 strengths.
- **ModuleRecommendation**: Suggested learning modules based on profile.
- **Achievement**: Badges or milestones unlocked by the user.

## Success Criteria

- **Measurable**: 100% of the dashboard root UI components use the new CyberPunk design system (no legacy rounded corners or white backgrounds).
- **Measurable**: The "Continue Learning" action is visible above the fold on desktop screens.
- **User-focused**: Users can identify their current level and next task within 5 seconds of landing on the dashboard.
- **Verifiable**: The page loads user progress data successfully without errors.

## Assumptions

- The `development` module already exposes necessary server actions or hooks to fetch progress and recommendations (`get-user-progress`, `get-ai-recommendations`).
- The "CyberPunk UI" utility classes or components (like `cn` for merging styles) are available.
- User authentication is handled by the existing layout/middleware.
