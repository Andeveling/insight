# Implementation Plan: Progressive Strength Discovery Quiz

**Branch**: `001-strength-quiz` | **Date**: December 12, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-strength-quiz/spec.md`

## Summary

Build an internal domain-based progressive questionnaire system that enables users to discover their top 5 strengths independently. The system must support pause/resume functionality with auto-save to prevent user fatigue and ensure response quality. The assessment progresses through 3 phases (Domain Discovery, Strength Refinement, Ranking Confirmation) with adaptive question selection and real-time progress visualization, culminating in AI-calculated confidence scores for identified strengths.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) with Next.js 16  
**Primary Dependencies**: 
  - Next.js 16 (App Router, React Server Components, Turbopack)
  - Prisma ORM (with Turso/libSQL adapter)
  - React Hook Form + Zod validation
  - Vercel AI SDK with OpenAI GPT-4o
  - shadcn/ui + Radix UI primitives
  - Tailwind CSS (with CSS variables)

**Storage**: Turso (libSQL) via Prisma ORM for assessment sessions, questions, and user responses  
**Authentication**: BetterAuth (existing)  
**Testing**: Jest/Vitest for unit tests, Playwright for E2E (to be determined in Phase 1)  
**Target Platform**: Web application (responsive design for desktop/tablet/mobile)  
**Project Type**: Web application with feature-first Next.js App Router architecture  
**Performance Goals**: 
  - Question load time: <500ms
  - Auto-save latency: <200ms
  - Results calculation: <5 seconds
  - Session recovery: <1 second

**Constraints**: 
  - Must work across devices with session continuity
  - Must handle offline scenarios gracefully (resume when connection restored)
  - Must prevent data loss on browser close/refresh
  - Must support concurrent sessions from multiple devices (use most recent)

**Scale/Scope**: 
  - 60 total questions (20 Phase 1, 30 Phase 2, 10 Phase 3)
  - Expected user base: 10k+ users
  - Concurrent assessments: 100+ simultaneous users
  - Assessment completion time: 15-20 minutes average

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Human-First Design ✅ PASS
- **Assessment**: This feature removes friction by eliminating external test dependency
- **Pause/Resume**: Respects human attention limits and prevents fatigue-induced errors
- **Progress Visualization**: Provides transparency and reduces anxiety about assessment progress
- **Confidence Scores**: Makes AI reasoning explainable and actionable
- **Verdict**: Strongly aligns - the entire feature is designed to respect human cognitive limits

### Principle II: Positive Psychology Foundation ✅ PASS
- **Assessment**: Uses existing HIGH5 framework with 4 domains and 20 strengths
- **Strength Focus**: Questions designed around positive psychology principles (to be validated in Phase 0)
- **Growth Mindset**: Results presentation emphasizes development opportunities, not limitations
- **No New Psychology**: Feature doesn't introduce new assessment methodologies
- **Verdict**: Compliant - extends existing validated framework

### Principle III: Feature-First Architecture ✅ PASS
- **Structure**: Will use `/app/dashboard/assessment/` with co-located `_components/`, `_hooks/`, `_actions/`, `_schemas/`
- **Isolation**: Assessment is self-contained and independently navigable
- **Barrel Exports**: Will provide `index.ts` for clean imports
- **Shared Code**: Will use existing `lib/types/` and `components/ui/` appropriately
- **Verdict**: Compliant - follows Next.js 16 App Router feature-first conventions

### Principle IV: AI-Augmented Insights ✅ PASS
- **Core Logic**: Strength calculation uses deterministic weighted scoring (no AI required for assessment itself)
- **AI Enhancement**: AI used only for generating personalized result descriptions and recommendations
- **Structured Generation**: Will use Zod schemas for AI outputs (result summaries, development suggestions)
- **Graceful Degradation**: System can show results without AI-generated descriptions
- **Verdict**: Compliant - AI augments but doesn't replace core assessment logic

### Principle V: Type Safety & Explicit Contracts ✅ PASS
- **TypeScript**: All code will use strict mode with no `any` types
- **Zod Validation**: Form inputs and API boundaries will have Zod schemas
- **Prisma Types**: New models will generate types consumed by application
- **Type Definitions**: Question types, answer types, session states will be explicitly typed in `lib/types/`
- **Verdict**: Compliant - plan includes comprehensive type safety

**Constitution Compliance Summary**: ✅ **PASSED** - No violations detected. Feature aligns with all 5 core principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-strength-quiz/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api.yaml        # API contract for assessment endpoints
│   └── types.ts        # Shared TypeScript types
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── dashboard/
│   └── assessment/                    # NEW: Assessment feature
│       ├── page.tsx                   # Main assessment landing/resume page
│       ├── [sessionId]/              # Dynamic route for active session
│       │   └── page.tsx              # Question display and navigation
│       ├── results/
│       │   └── [sessionId]/
│       │       └── page.tsx          # Results display page
│       ├── _components/              # Co-located components
│       │   ├── welcome-screen.tsx
│       │   ├── question-card.tsx
│       │   ├── progress-indicator.tsx
│       │   ├── domain-affinity-chart.tsx
│       │   ├── phase-transition.tsx
│       │   ├── results-summary.tsx
│       │   ├── strength-confidence-card.tsx
│       │   └── index.ts              # Barrel export
│       ├── _hooks/                   # Custom hooks
│       │   ├── use-assessment-session.ts
│       │   ├── use-auto-save.ts
│       │   ├── use-question-navigation.ts
│       │   └── index.ts
│       ├── _actions/                 # Server actions
│       │   ├── create-session.ts
│       │   ├── save-answer.ts
│       │   ├── complete-phase.ts
│       │   ├── calculate-results.ts
│       │   └── index.ts
│       └── _schemas/                 # Zod validation schemas
│           ├── question.schema.ts
│           ├── answer.schema.ts
│           ├── session.schema.ts
│           └── index.ts

lib/
├── types/
│   ├── assessment.types.ts           # NEW: Assessment-specific types
│   └── index.ts
└── utils/
    └── assessment/                    # NEW: Assessment utilities
        ├── score-calculator.ts        # Weighted scoring algorithm
        ├── adaptive-logic.ts          # Phase 2 question selection
        └── index.ts

prisma/
├── schema.prisma                      # MODIFIED: Add new models
├── migrations/
│   └── [timestamp]_add_assessment/   # NEW: Migration for assessment tables
└── data/
    └── assessment-questions.data.ts   # NEW: Seed data for questions

components/ui/                         # REUSE: Existing UI primitives
├── progress.tsx
├── card.tsx
└── button.tsx
```

**Structure Decision**: Feature-first architecture using Next.js 16 App Router with co-located components, hooks, actions, and schemas within `/app/dashboard/assessment/`. This follows the project's established pattern (seen in `/app/dashboard/profile/`, `/app/dashboard/team/`, etc.) and ensures the assessment feature is self-contained and independently testable.

## Complexity Tracking

> **No violations detected - this section intentionally left empty**

No Constitution violations to justify. The feature uses standard patterns established in the codebase and aligns with all architectural principles.

---

## Phase 0: Outline & Research

### Research Tasks

This phase resolves all [NEEDS CLARIFICATION] items and establishes best practices for the feature.

#### 0.1 Question Design Methodology
**Research Question**: What are the best practices for designing assessment questions based on positive psychology principles that accurately map to the HIGH5 strengths framework?

**Deliverable**: Document in `research.md` covering:
- Question types (scale, choice, ranking) and when to use each
- Question wording guidelines to avoid bias
- Mapping strategy from answers to domain/strength scores
- Weight assignment methodology for questions
- Validation approaches for question effectiveness

#### 0.2 Adaptive Assessment Algorithms
**Research Question**: What algorithms effectively adapt questionnaires based on previous answers to reduce assessment time while maintaining accuracy?

**Deliverable**: Document in `research.md` covering:
- Item Response Theory (IRT) or simpler weighted scoring approaches
- Phase 2 question selection logic based on Phase 1 domain scores
- Confidence threshold calculations
- Handling edge cases (tied scores, unclear patterns)
- Performance considerations for real-time calculation

#### 0.3 Session Persistence & Recovery Patterns
**Research Question**: What are the best practices for implementing auto-save and session recovery in Next.js applications to prevent data loss?

**Deliverable**: Document in `research.md` covering:
- Auto-save timing strategies (debounced vs. immediate)
- Server action patterns for optimistic updates
- Session state management (database vs. client storage)
- Cross-device session continuity approaches
- Offline-first considerations and recovery mechanisms

#### 0.4 Progress Visualization Best Practices
**Research Question**: How should assessment progress and domain affinity be visualized to maintain user engagement without overwhelming them?

**Deliverable**: Document in `research.md` covering:
- Progress indicator design patterns
- Real-time data visualization approaches (charts, bars, animations)
- Information density guidelines for assessment UIs
- Accessibility considerations for visual feedback
- Mobile-responsive visualization strategies

#### 0.5 AI-Powered Results Generation
**Research Question**: How should Vercel AI SDK be used to generate personalized strength descriptions and development recommendations?

**Deliverable**: Document in `research.md` covering:
- Prompt engineering strategies for strength descriptions
- Zod schema design for structured AI outputs
- Streaming vs. batch generation trade-offs
- Cost optimization strategies for AI generation
- Fallback content when AI is unavailable

### Research Output

**File**: `research.md` - Consolidated findings with decisions, rationales, and alternatives considered for each research area.

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete

### 1.1 Data Model Design

**Task**: Extract entities from feature spec and design database schema.

**Output**: `data-model.md` containing:

#### Core Entities

**AssessmentQuestion**
- Fields: id, domainId, strengthId (optional), text, type, weight, order, phase
- Relationships: belongsTo Domain, optionally references Strength
- Indexes: phase + order, domainId
- Validation: weight 0.1-2.0, type enum, phase 1-3

**UserAssessmentAnswer**
- Fields: id, userId, sessionId, questionId, answer (JSON), confidence, answeredAt
- Relationships: belongsTo User, AssessmentSession, AssessmentQuestion
- Indexes: sessionId + questionId (unique), userId
- Validation: answer schema based on question type

**AssessmentSession**
- Fields: id, userId, status, phase, currentStep, domainScores (JSON), strengthScores (JSON), results (JSON), startedAt, completedAt, lastActivityAt
- Relationships: belongsTo User, hasMany UserAssessmentAnswer
- Indexes: userId + status, lastActivityAt (for cleanup)
- Validation: status enum, phase 1-3, currentStep > 0

**AssessmentResult** (optional - may be embedded in session)
- Fields: id, sessionId, userId, strengthId, rank, confidenceScore, generatedDescription
- Relationships: belongsTo AssessmentSession, User, Strength
- Indexes: sessionId + rank (unique)

#### Schema Considerations

- Use existing Domain and Strength models (no changes needed)
- Session state stored in database for cross-device continuity
- Answer data as JSON to support flexible question types
- Computed scores stored for performance (domain/strength affinity)
- Archive strategy: soft delete sessions after 30 days inactivity

### 1.2 API Contracts

**Task**: Define API boundaries for all assessment operations.

**Output**: `contracts/api.yaml` (OpenAPI 3.0 spec) and `contracts/types.ts`

#### Server Actions

```typescript
// contracts/types.ts

// Session Management
createAssessmentSession(userId: string): Promise<AssessmentSession>
resumeAssessmentSession(sessionId: string): Promise<AssessmentSession | null>
abandonSession(sessionId: string): Promise<void>

// Question Flow
getNextQuestion(sessionId: string): Promise<AssessmentQuestion | null>
getCurrentPhaseQuestions(sessionId: string, phase: number): Promise<AssessmentQuestion[]>

// Answer Submission
saveAnswer(input: SaveAnswerInput): Promise<{ success: boolean; nextQuestion?: AssessmentQuestion }>
autoSaveAnswer(input: SaveAnswerInput): Promise<{ success: boolean }> // Optimistic, no blocking

// Phase Transitions
completePhase(sessionId: string, phase: number): Promise<PhaseTransitionResult>
// PhaseTransitionResult includes: domainScores, topDomains, nextPhasePreview

// Results Generation
calculateResults(sessionId: string): Promise<AssessmentResults>
generateAIDescriptions(sessionId: string, strengthIds: string[]): Promise<AIGeneratedContent>
saveResultsToProfile(sessionId: string, userId: string): Promise<UserProfile>

// Session Recovery
getActiveSession(userId: string): Promise<AssessmentSession | null>
```

#### Type Definitions

```typescript
// Assessment Question Types
type QuestionType = 'scale' | 'choice' | 'ranking'
type AnswerValue = number | string | string[] // Based on question type

interface AssessmentQuestion {
  id: string
  phase: 1 | 2 | 3
  order: number
  text: string
  type: QuestionType
  options?: string[] // For choice/ranking questions
  scaleRange?: { min: number; max: number; labels: string[] } // For scale questions
  domainId: string
  strengthId?: string
  weight: number
}

// Session State
type SessionStatus = 'in_progress' | 'completed' | 'abandoned'

interface AssessmentSession {
  id: string
  userId: string
  status: SessionStatus
  phase: 1 | 2 | 3
  currentStep: number
  totalSteps: number
  domainScores: Record<string, number> // domainId -> score
  strengthScores?: Record<string, number> // strengthId -> score (Phase 2+)
  results?: AssessmentResults
  startedAt: Date
  lastActivityAt: Date
  completedAt?: Date
}

// Results Structure
interface AssessmentResults {
  strengths: RankedStrength[]
  overallConfidence: number
  recommendations: string[]
  generatedAt: Date
}

interface RankedStrength {
  strengthId: string
  strengthName: string
  rank: 1 | 2 | 3 | 4 | 5
  confidenceScore: number // 0-100
  domainId: string
  description?: string // AI-generated
  developmentTips?: string[] // AI-generated
}
```

### 1.3 Quickstart Guide

**Task**: Create user-facing documentation for completing the assessment.

**Output**: `quickstart.md` containing:

- How to start a new assessment
- Understanding the 3 phases
- How pause/resume works
- Interpreting progress indicators
- What to do with results
- FAQ section (e.g., "Can I change my answers?" "How long does it take?")

### 1.4 Agent Context Update

**Task**: Update AI agent context with new technologies and patterns introduced by this feature.

**Command**: `.specify/scripts/bash/update-agent-context.sh copilot`

**Updates**:
- Add assessment question design patterns
- Add session state management patterns
- Add auto-save implementation details
- Add adaptive algorithm usage
- Document new Prisma models and relationships

---

## Phase 2: Task Breakdown

**Prerequisites**: Phase 1 complete, Constitution Check re-verified

**Output**: This phase is handled by `/speckit.tasks` command (NOT created by `/speckit.plan`)

The tasks command will break down implementation into:
- Database migration creation
- Seed data preparation (60 questions)
- Server actions implementation
- UI components development
- Hook and utility development
- E2E test scenarios
- Integration testing

**Note**: Execute `/speckit.tasks` after completing Phase 0 and Phase 1 to generate the detailed task breakdown.

---

## Next Steps

1. ✅ Phase 0: Execute research tasks and consolidate findings in `research.md`
2. ✅ Phase 1: Design data model, create API contracts, write quickstart guide
3. ✅ Phase 1: Run `.specify/scripts/bash/update-agent-context.sh copilot`
4. ✅ Re-verify Constitution Check after design phase
5. ⏸️  Phase 2: Run `/speckit.tasks` to generate implementation task breakdown
6. ⏸️  Implementation: Execute tasks from `tasks.md`

**Current Status**: Ready for Phase 0 research execution.
