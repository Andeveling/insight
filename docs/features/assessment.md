# Strength Assessment Feature

## Overview

The Strength Assessment is a multi-phase quiz that helps users discover their top 5 personal strengths based on the High5 methodology. It uses an adaptive algorithm to efficiently narrow down from 20 possible strengths across 4 domains.

## Architecture

### File Structure

```
app/dashboard/assessment/
├── page.tsx                    # Landing page (welcome/resume)
├── loading.tsx                 # Loading skeleton
├── error.tsx                   # Error boundary
├── [sessionId]/
│   └── page.tsx                # Active assessment (redirect to main)
├── results/
│   └── [sessionId]/
│       ├── page.tsx            # Server component for results
│       ├── results-content.tsx # Client component for interactivity
│       ├── loading.tsx         # Results loading skeleton
│       └── error.tsx           # Results error boundary
├── _actions/                   # Server actions
│   ├── create-session.ts       # Start new assessment
│   ├── get-active-session.ts   # Load existing session
│   ├── save-answer.ts          # Save and advance
│   ├── auto-save-answer.ts     # Non-blocking save
│   ├── complete-phase.ts       # Phase transitions
│   ├── calculate-results.ts    # Final scoring
│   ├── save-results-to-profile.ts
│   ├── resume-session.ts       # Session recovery
│   ├── abandon-session.ts      # Session cleanup
│   └── create-new-from-retake.ts
├── _components/                # UI components
│   ├── welcome-screen.tsx
│   ├── question-card.tsx
│   ├── phase-transition.tsx
│   ├── results-summary.tsx
│   ├── strength-confidence-card.tsx
│   ├── save-exit-button.tsx
│   ├── low-confidence-warning.tsx
│   └── strength-descriptions.ts
├── _hooks/                     # React hooks
│   ├── use-assessment.ts       # Main assessment logic
│   ├── use-assessment-session.ts
│   └── use-auto-save.ts
├── _schemas/                   # Zod validation
│   ├── session.schema.ts
│   └── answer.schema.ts
└── _utils/                     # Client utilities
    └── session-storage.ts
```

### Data Flow

```
User Action → Component → Hook → Server Action → Prisma → Database
     ↑                                              ↓
     └──────────── Revalidation ←──────────────────┘
```

## Assessment Phases

### Phase 1: Domain Discovery (20 questions)

- **Purpose**: Identify user's primary domains
- **Questions**: 5 questions per domain (4 domains)
- **Scoring**: Builds domain affinity scores
- **Output**: Top 2-3 domains for Phase 2 focus

### Phase 2: Strength Refinement (25 questions)

- **Purpose**: Narrow down to specific strengths
- **Questions**: Focused on strengths within top domains
- **Scoring**: Builds individual strength scores
- **Output**: Ranked strength candidates

### Phase 3: Final Ranking (15 questions)

- **Purpose**: Determine final top 5 strengths
- **Questions**: Direct comparisons between top candidates
- **Scoring**: Establishes final rankings with confidence scores
- **Output**: Top 5 strengths with confidence percentages

## Key Decisions

### Scoring Algorithm

```typescript
// Domain score = sum of (answer * weight) for all domain questions
// Strength score = weighted combination of Phase 2 and Phase 3 answers
// Confidence = variance-based metric (lower variance = higher confidence)
```

### Auto-Save Strategy

- 2-second debounce on answer changes
- Non-blocking saves (doesn't interrupt user flow)
- Session recovery on page reload
- Explicit "Save & Exit" option

### Session Management

- Sessions expire after 7 days of inactivity
- Archived sessions kept for 90 days
- Users can have only one active session at a time

## API Reference

### Server Actions

| Action                 | Purpose                    | Input                         | Output          |
| ---------------------- | -------------------------- | ----------------------------- | --------------- |
| `createSession`        | Start new assessment       | none                          | sessionId       |
| `saveAnswer`           | Save and get next question | sessionId, questionId, answer | nextQuestion    |
| `completePhase`        | Transition to next phase   | sessionId                     | phase info      |
| `calculateResults`     | Generate final results     | sessionId                     | top 5 strengths |
| `saveResultsToProfile` | Store to user profile      | sessionId                     | success         |

### Hooks

| Hook            | Purpose              | Returns                          |
| --------------- | -------------------- | -------------------------------- |
| `useAssessment` | Main assessment flow | state, actions, current question |
| `useAutoSave`   | Debounced saving     | triggerAutoSave, saveNow         |

## Testing

### Unit Tests

- Score calculator: `lib/utils/assessment/__tests__/score-calculator.test.ts`
- Adaptive logic: `lib/utils/assessment/__tests__/adaptive-logic.test.ts`

### Integration Tests

- Full assessment flow: Start → Answer all → View results
- Session recovery: Start → Close → Resume
- Edge cases: Neutral responses, ties, low confidence

## Performance

### Targets

- Question load: < 500ms
- Auto-save: < 200ms
- Results calculation: < 5 seconds

### Optimizations

- Prisma `select` for minimal data transfer
- Parallel database queries where possible
- Client-side caching of questions per phase
- Optimistic UI updates during auto-save

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (1-5 for scale, Enter to submit)
- Focus management between questions
- Screen reader announcements for progress

## Mobile Support

- Responsive breakpoints at 768px
- Touch-friendly button sizes (min 44px)
- Simplified progress indicators on mobile
- Collapsible domain chart
