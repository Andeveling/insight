# Research: Refactor Dashboard Root

**Feature**: Refactor Dashboard Root
**Status**: Complete

## Technical Context

- **Server Actions**: Confirmed existence of `get-user-progress`, `get-ai-recommendations`, and `get-user-strengths` in `app/dashboard/development/_actions/`.
- **UI Framework**: Tailwind CSS with `oklch` colors defined in `app/globals.css`.
- **Design System**: CyberPunk UI requires custom `clip-path` and layered borders. No existing utility classes found for specific shapes; will implement as reusable React components.
- **Existing Implementation**: `app/dashboard/page.tsx` uses standard Shadcn cards. Needs complete replacement.

## Decisions

### 1. UI Component Strategy
**Decision**: Create a set of "CyberPunk" wrapper components (`CyberCard`, `CyberButton`, `CyberBadge`) in `app/dashboard/_components/ui/` (or a shared location if intended for wider use, but likely local for now to avoid polluting global namespace immediately).
**Rationale**: The `clip-path` and layered border logic is complex to repeat. Encapsulating it ensures consistency and easier maintenance.
**Alternatives**:
- *Inline Styles*: Too verbose and error-prone.
- *Tailwind Plugins*: Overkill for a single feature refactor, but good for long term. Will start with components.

### 2. Data Fetching Strategy
**Decision**: Use `Promise.all` in `app/dashboard/page.tsx` to fetch progress, strengths, and recommendations in parallel.
**Rationale**: Minimizes waterfall requests and ensures fast initial load.
**Alternatives**:
- *Suspense Boundaries*: Good for progressive loading, but the "Hero" section needs core data immediately. Will use Suspense for the "Recommendations" section if it's slow, but `Promise.all` for the main view is safer for now.

### 3. Team Section Placement
**Decision**: Move Team section to a secondary position below the "Hero" and "Strengths" sections.
**Rationale**: Aligns with the "Personal Development" north star.

## Unknowns & Clarifications

- **Resolved**: Server actions exist.
- **Resolved**: Design system specs are clear in `cyberpunk-ui.md`.
