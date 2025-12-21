# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the dashboard root page (`app/dashboard/page.tsx`) to prioritize personal development and implement the CyberPunk UI design system. This involves creating new UI components (`CyberCard`, `CyberButton`), fetching user progress and strengths data, and restructuring the layout to highlight individual growth.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16 (App Router)
**Primary Dependencies**: Tailwind CSS, Lucide React, Framer Motion (motion/react)
**Storage**: Prisma (via Server Actions)
**Testing**: Manual verification (Independent Tests defined in Spec)
**Target Platform**: Web (Responsive)
**Project Type**: Web Application
**Performance Goals**: <200ms TTFB, Instant interaction
**Constraints**: Must use existing Server Actions for data fetching.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Human-First Design**: Prioritizes user growth and clarity.
- [x] **Positive Psychology**: Highlights strengths and progress.
- [x] **Feature-First Architecture**: Components will be co-located or in shared UI if generic.
- [x] **AI-Augmented Insights**: Uses AI recommendations.
- [x] **Behavioral Design**: Uses progress bars and "next action" triggers.
- [x] **Type Safety**: Strict TypeScript usage.

## Project Structure

### Documentation (this feature)

```text
specs/011-refactor-dashboard-root/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
app/
└── dashboard/
    ├── page.tsx                 # Main dashboard page (Refactored)
    └── _components/
        ├── cyber-ui/            # New CyberPunk UI components
        │   ├── cyber-card.tsx
        │   ├── cyber-button.tsx
        │   └── cyber-badge.tsx
        ├── hero-section.tsx     # Personal Development Overview
        ├── strengths-card.tsx   # Strengths Visualization
        └── recommendations.tsx  # AI Recommendations
```

**Structure Decision**: Create a `cyber-ui` folder within `dashboard/_components` to house the specific design system components, keeping them close to where they are used initially.

## Complexity Tracking

N/A - No constitution violations.


| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
