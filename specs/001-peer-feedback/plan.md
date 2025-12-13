# Implementation Plan: 360° Peer Feedback System

**Branch**: `001-peer-feedback` | **Date**: December 13, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-peer-feedback/spec.md`

## Summary

Implement a peer feedback mechanism that allows users to request behavioral observations from 3-5 teammates through a 5-question survey. Feedback responses are mapped to the existing 20 strengths across 4 domains (Doing, Feeling, Motivating, Thinking). After collecting 3+ responses, the system generates AI-powered insights revealing perception gaps between self-assessment and peer feedback, enabling users to refine their strength profiles with increased confidence.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16 (App Router)  
**Primary Dependencies**: 
- Next.js 16 (App Router, Server Actions, Route Handlers)
- Prisma ORM (existing schema extension)
- BetterAuth (existing authentication system)
- Vercel AI SDK (`ai` package for insight generation)
- React Hook Form + Zod (form validation)
- Shadcn/Radix UI (component primitives)

**Storage**: SQLite (existing Prisma datasource, extending current schema)  
**Testing**: Playwright (E2E tests), Vitest (unit tests for utilities)  
**Target Platform**: Web application (responsive design for desktop/mobile)  
**Project Type**: Web application (Next.js App Router with server-side rendering)  
**Performance Goals**: 
- <2 seconds page load for feedback forms
- <5 seconds AI insight generation
- 500 concurrent feedback responses without degradation

**Constraints**: 
- Must work within existing strengths framework (20 strengths, 4 domains)
- Anonymity must be cryptographically enforceable (no technical reversibility)
- Email notifications depend on existing notification infrastructure
- AI insights generation must gracefully degrade to rule-based if AI service unavailable

**Scale/Scope**: 
- Initial rollout: 50-100 teams, ~500-1000 users
- Expected volume: 200-300 feedback requests/month
- Database growth: ~1000 feedback records/month

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Human-First Design
- **Status**: PASS
- **Evidence**: Feature empowers users to gain self-awareness through peer perspectives. Users maintain full control over profile adjustments. Anonymous option protects psychological safety. Insights are explainable (show supporting feedback patterns).
- **Re-check after Phase 1**: Verify UI designs are accessible and emotionally supportive, feedback language is constructive.

### ✅ II. Positive Psychology Foundation  
- **Status**: PASS
- **Evidence**: Feedback questions focus on observable strength-based behaviors (not deficits). Insights frame differences as "blind spots" and "growth opportunities" rather than weaknesses. Aligns with existing HIGH5 strengths framework.
- **Re-check after Phase 1**: Validate question wording with positive psychology principles, ensure insights emphasize complementary strengths.

### ✅ III. Privacy & Ethical AI
- **Status**: PASS with monitoring requirement
- **Evidence**: Anonymous feedback is cryptographically protected. Users opt-in to feedback requests. AI insights are aggregated from 3+ responses (statistical relevance). Users can reject AI suggestions.
- **Monitoring Required**: Audit anonymization implementation, log AI insight generation for bias detection.
- **Re-check after Phase 1**: Verify anonymization architecture prevents identity inference through metadata.

### ✅ IV. Feature-First Simplicity
- **Status**: PASS
- **Evidence**: Extends existing Prisma schema without new services/infrastructure. Uses established Next.js patterns (Server Actions, Route Handlers). Leverages existing notification system. No new external dependencies beyond existing AI SDK.
- **Re-check after Phase 1**: Ensure data model additions are minimal and well-indexed.

### ✅ V. Team Empowerment
- **Status**: PASS
- **Evidence**: Feature builds on existing team model. Feedback requests limited to team members (leverages existing TeamMember relationships). Insights enhance team understanding without surveillance.
- **Re-check after Phase 1**: Validate that team leaders cannot access individual feedback responses.

## Project Structure

### Documentation (this feature)

```text
specs/001-peer-feedback/
├── plan.md              # This file (implementation strategy)
├── research.md          # Phase 0: Question design research, anonymization patterns
├── data-model.md        # Phase 1: Prisma schema extensions, indexes
├── quickstart.md        # Phase 1: Setup guide for developers
├── contracts/           # Phase 1: API contracts for feedback endpoints
│   ├── feedback-request.api.md
│   ├── feedback-response.api.md
│   └── feedback-insights.api.md
└── checklists/
    └── requirements.md  # Quality validation (completed)
```

### Source Code (repository root)

```text
# Next.js App Router structure (extends existing)

app/
└── dashboard/
    └── feedback/                    # NEW: Feedback feature module
        ├── page.tsx                 # Dashboard: pending/completed requests
        ├── request/
        │   └── page.tsx             # Request feedback form
        ├── respond/
        │   └── [requestId]/
        │       └── page.tsx         # Respond to feedback request
        ├── insights/
        │   └── page.tsx             # View aggregated insights
        └── _components/
            ├── feedback-request-form.tsx
            ├── feedback-questionnaire.tsx
            ├── insight-summary.tsx
            └── strength-adjustment-preview.tsx

prisma/
├── schema.prisma                    # EXTEND: Add feedback models
├── migrations/
│   └── [timestamp]_add_feedback_system/
│       └── migration.sql
└── seeders/
    └── feedback-questions.seeder.ts # NEW: Seed 5 behavioral questions

lib/
├── actions/                         # NEW: Server actions for feedback
│   ├── feedback-request.actions.ts
│   ├── feedback-response.actions.ts
│   └── feedback-insights.actions.ts
├── services/                        # NEW: Business logic layer
│   ├── feedback-request.service.ts
│   ├── feedback-analysis.service.ts
│   └── strength-mapping.service.ts
├── utils/
│   ├── feedback/                    # NEW: Feedback utilities
│   │   ├── question-mapper.ts       # Maps answers to strengths
│   │   ├── insight-generator.ts     # AI/rule-based insights
│   │   └── anonymization.ts         # Crypto utilities for anonymity
│   └── notifications/               # EXTEND: Add feedback notifications
│       └── feedback-notification.ts
└── types/
    └── feedback.types.ts            # NEW: TypeScript types

components/
└── ui/                              # Uses existing Shadcn components
    # No new components needed - reuse Card, Form, Button, etc.

tests/
├── e2e/
│   └── feedback/
│       ├── request-feedback.spec.ts
│       ├── respond-feedback.spec.ts
│       └── view-insights.spec.ts
└── unit/
    ├── question-mapper.test.ts
    ├── insight-generator.test.ts
    └── anonymization.test.ts
```

**Structure Decision**: Extends existing Next.js App Router structure with a new `dashboard/feedback` module. Follows repository pattern: actions → services → Prisma. Aligns with existing architecture patterns (no new paradigms introduced).

## Complexity Tracking

> No constitution violations requiring justification. All gates passed.

---

## Phase 0: Research & Design Validation

### Research Questions

1. **Feedback Question Design**
   - What are the 5 optimal behavioral questions that map to all 20 strengths?
   - How should answer options be structured (Likert scale vs behavioral choices)?
   - What question-to-strength mapping weights ensure accurate detection?

2. **Anonymization Architecture**
   - How to cryptographically enforce anonymity at database level?
   - What metadata must be stripped to prevent inference attacks?
   - How to aggregate anonymous responses while preventing de-anonymization?

3. **AI Insight Generation**
   - What prompts generate constructive, strength-focused insights?
   - How to structure feedback data for AI input (JSON schema)?
   - What fallback rules when AI service unavailable?

4. **Strength Mapping Algorithm**
   - How to map 5 question responses to 20 strengths with confidence scores?
   - What weighting system balances domain coverage?
   - How to handle conflicting signals (e.g., 2 questions suggest different strengths)?

5. **Notification Strategy**
   - How to craft notification copy that encourages responses without pressure?
   - What cadence for reminder notifications (if any)?
   - How to track notification delivery success?

### Research Deliverable

**File**: `research.md`

**Contents**:
- Question bank with 5 finalized behavioral questions
- Answer option structures with strength mappings (JSON)
- Anonymization technical specification (crypto approach)
- AI prompt templates for insight generation
- Strength mapping algorithm pseudocode
- Notification copy templates

---

## Phase 1: Data Model & API Contracts

### Data Model Extensions

**File**: `data-model.md`

**Entities** (extends existing Prisma schema):

```prisma
model FeedbackRequest {
  id            String   @id @default(uuid())
  requesterId   String   // FK to User
  respondentId  String   // FK to User
  status        String   // "pending" | "completed" | "declined" | "expired"
  isAnonymous   Boolean  @default(true)
  sentAt        DateTime @default(now())
  completedAt   DateTime?
  expiresAt     DateTime // sentAt + 14 days
  
  requester     User     @relation("RequestedFeedback", fields: [requesterId], references: [id])
  respondent    User     @relation("ReceivedFeedback", fields: [respondentId], references: [id])
  responses     FeedbackResponse[]
  
  @@unique([requesterId, respondentId, sentAt]) // Prevent duplicate requests
  @@index([respondentId, status]) // Query pending requests
  @@index([requesterId]) // Query sent requests
  @@index([expiresAt]) // Cleanup expired requests
}

model FeedbackQuestion {
  id              String   @id @default(uuid())
  text            String
  answerType      String   // "scale" | "behavioral_choice"
  answerOptions   String   // JSON: array of options
  strengthMapping String   // JSON: { "option": { "strengthId": weight } }
  order           Int      @unique
  
  responses       FeedbackResponse[]
  
  @@index([order])
}

model FeedbackResponse {
  id         String   @id @default(uuid())
  requestId  String
  questionId String
  answer     String   // JSON: selected option(s)
  createdAt  DateTime @default(now())
  
  request    FeedbackRequest  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  question   FeedbackQuestion @relation(fields: [questionId], references: [id])
  
  @@unique([requestId, questionId]) // One answer per question per request
  @@index([requestId]) // Query all responses for a request
}

model FeedbackSummary {
  id                  String   @id @default(uuid())
  userId              String   @unique
  totalResponses      Int      @default(0)
  lastResponseAt      DateTime?
  strengthAdjustments String   // JSON: { "strengthId": { "delta": number, "confidence": number } }
  insights            String   // AI-generated summary text
  insightsGeneratedAt DateTime?
  updatedAt           DateTime @updatedAt
  
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([lastResponseAt]) // Track recent feedback activity
}

model StrengthAdjustment {
  id               String   @id @default(uuid())
  userId           String
  strengthId       String
  suggestedDelta   Float    // -1.0 to +1.0 confidence adjustment
  supportingData   String   // JSON: evidence from feedback
  status           String   // "pending" | "accepted" | "rejected"
  createdAt        DateTime @default(now())
  processedAt      DateTime?
  
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  strength         Strength @relation(fields: [strengthId], references: [id])
  
  @@unique([userId, strengthId, createdAt]) // One suggestion per strength per cycle
  @@index([userId, status]) // Query pending adjustments
}
```

**Indexes Rationale**:
- `@@index([respondentId, status])` - Efficient queries for "my pending feedback requests"
- `@@index([expiresAt])` - Background job to mark expired requests
- `@@index([requestId])` - Fast response aggregation
- `@@index([lastResponseAt])` - Track feedback activity for analytics

### API Contracts

**Directory**: `contracts/`

**Files**:

1. **`feedback-request.api.md`** - POST endpoint to create feedback requests
2. **`feedback-response.api.md`** - POST endpoint to submit feedback responses
3. **`feedback-insights.api.md`** - GET endpoint to retrieve insights summary

**Contract Structure** (each file follows this template):

```markdown
# [Endpoint Name]

**Method**: [GET/POST/PUT/DELETE]  
**Path**: `/api/feedback/[resource]`  
**Auth Required**: Yes (BetterAuth session)

## Request Body

\```typescript
interface RequestBody {
  // TypeScript schema
}
\```

## Response Body

\```typescript
interface SuccessResponse {
  // TypeScript schema
}

interface ErrorResponse {
  // Error schema
}
\```

## Validation Rules

- [List Zod validation rules]

## Error Codes

- 400: [Validation failure scenarios]
- 403: [Authorization failures]
- 404: [Not found scenarios]
- 429: [Rate limiting]
```

### Quickstart Guide

**File**: `quickstart.md`

**Contents**:
- Prerequisites (existing setup)
- Database migration steps
- Seed feedback questions
- Environment variables (if any)
- Running tests
- Manual testing workflow

---

## Phase 2: Task Breakdown

**Note**: This phase is executed by `/speckit.tasks` command (NOT part of `/speckit.plan`)

**File**: `tasks.md`

**Structure**:
- Breaking down implementation into atomic tasks
- Sequencing tasks with dependencies
- Estimating effort per task
- Assigning priorities

---

## Implementation Notes

### Strengths Context Integration

**Critical**: The platform has **20 pre-defined strengths** across **4 domains**:

**Domains**:
1. **Doing** - Analyst, Believer, Chameleon, Catalyst, Brainstormer
2. **Feeling** - Deliverer, Focus Expert, Coach, Empathizer, Commander  
3. **Motivating** - Problem Solver, Optimist, Self-Believer, Philomath, Peace Keeper
4. **Thinking** - Time Keeper, Storyteller, Winner, Strategist, Thinker

**Strength Data Files**:
- `/prisma/data/strengths.data.ts` - Full strength definitions (used in seeding)
- `/app/dashboard/assessment/_components/strength-descriptions.ts` - UI descriptions
- `/lib/data/strengths.data.ts` - Client-accessible strength metadata

**Question-to-Strength Mapping Requirements**:
1. Each of the 5 questions must map to multiple strengths (not 1:1)
2. All 20 strengths must be detectable across the 5 questions (coverage)
3. Domain balance: Questions should cover all 4 domains reasonably
4. Mapping weights: Numeric confidence (0.0-1.0) per strength per answer option

**Example Question Mapping**:

```json
{
  "question": "When working on tight deadlines, this person typically...",
  "answerType": "behavioral_choice",
  "options": [
    {
      "text": "Stays calm and methodically works through priorities",
      "strengthWeights": {
        "deliverer": 0.8,
        "focus-expert": 0.6,
        "time-keeper": 0.7
      }
    },
    {
      "text": "Energizes the team and drives rapid action",
      "strengthWeights": {
        "catalyst": 0.9,
        "commander": 0.7,
        "optimist": 0.5
      }
    }
  ]
}
```

### Anonymization Strategy

**Technical Approach**:
1. Store responses without direct `respondentId` linkage when anonymous
2. Use one-way hash of `requestId + respondentId + salt` as response identifier
3. Aggregate responses via request grouping (not respondent attribution)
4. Never expose response timestamps that could correlate to respondent activity

**Verification Test**:
- Given 5 anonymous responses to same request
- When querying database directly
- Then no query can identify which user submitted which response

### AI Insight Generation

**Prompt Structure**:

```typescript
const insightPrompt = `
You are a positive psychology expert analyzing peer feedback for strengths development.

USER STRENGTHS (Self-Assessed):
${userStrengths.map(s => `- ${s.name}: ${s.confidence}`).join('\n')}

PEER FEEDBACK PATTERNS (Aggregated):
${feedbackPatterns.map(p => `- ${p.strength}: ${p.peerConfidence} (${p.responseCount} responses)`).join('\n')}

TASK:
Generate a 3-paragraph insight summary:
1. Overall pattern (where peers agree/disagree with self-assessment)
2. Specific blind spots (strengths peers see more/less strongly)
3. Actionable recommendation (which strength to emphasize or reconsider)

TONE: Constructive, encouraging, specific. Frame differences as growth opportunities.
`;
```

**Fallback Rules** (when AI unavailable):

```typescript
function generateRuleBasedInsights(userStrengths, peerFeedback) {
  const agreements = peerFeedback.filter(p => 
    Math.abs(p.peerConfidence - p.selfConfidence) < 0.2
  );
  
  const blindSpots = peerFeedback.filter(p => 
    p.peerConfidence - p.selfConfidence > 0.3
  );
  
  return {
    summary: `Your peers agreed with ${agreements.length} of your strengths...`,
    blindSpots: blindSpots.map(b => b.strength),
    recommendations: [/* template-based suggestions */]
  };
}
```

### Notification Templates

**Request Sent Notification** (to respondent):

```
Subject: ${requesterName} requested your feedback (2 minutes)

Hi ${respondentName},

${requesterName} values your perspective and has asked for feedback on their strengths. 
This quick survey takes about 2 minutes and will help them understand how their strengths 
show up in teamwork.

[Start Feedback Survey]

Your response will be ${isAnonymous ? 'anonymous' : 'attributed'}.

Thanks for helping your teammate grow!
```

**Insights Ready Notification** (to requester):

```
Subject: New insights available from your peer feedback

Hi ${requesterName},

You've received ${responseCount} responses to your feedback request. 
Your insights summary is ready to view.

[View Insights]

These insights can help you refine your strength profile and identify blind spots.
```

### Performance Optimization

**Query Optimization**:
- Use Prisma's `include` judiciously (only load needed relations)
- Implement cursor-based pagination for feedback history
- Cache feedback questions (static data, rarely changes)
- Index `status` + `expiresAt` for background cleanup job

**Caching Strategy**:
- Feedback questions: Cache in-memory (static)
- User insights: Cache for 5 minutes (recompute on demand)
- Pending requests count: Cache for 1 minute (badge indicator)

**Background Jobs**:
- Expire requests: Cron job every 6 hours to mark expired requests
- Notification reminders: (Future) Send reminder 7 days after initial request

---

## Risk Mitigation

| Risk                                        | Probability | Impact | Mitigation                                                                     |
| ------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------ |
| Low response rates (<60%)                   | Medium      | High   | A/B test notification copy, add social proof ("3 teammates already responded") |
| AI insight quality issues                   | Medium      | Medium | Implement rule-based fallback, A/B test prompts with sample data               |
| Anonymization bypass attack                 | Low         | High   | Security audit of anonymization logic, penetration testing                     |
| Database performance at scale               | Low         | Medium | Load test with 10k records, optimize indexes, implement pagination             |
| Users gaming system (coordinated responses) | Medium      | Low    | Log IP/timing patterns, implement cooldown periods, human review for anomalies |

---

## Success Metrics Tracking

Implement analytics tracking for success criteria:

| Success Criterion                  | Tracking Method                     | Dashboard Location              |
| ---------------------------------- | ----------------------------------- | ------------------------------- |
| SC-001: <2 min request flow        | Client-side timing events           | `/dashboard/feedback/analytics` |
| SC-002: <3 min response completion | Track `sentAt` → `completedAt`      | Database query (admin)          |
| SC-003: 60%+ response rate         | Count completed / sent requests     | `/dashboard/feedback/analytics` |
| SC-004: <5 sec insight generation  | Server-side timing logs             | Application logs                |
| SC-005: 40%+ profile adjustments   | Count accepted strength adjustments | Database query (admin)          |
| SC-007: Zero anonymity breaches    | Security audit log                  | Manual review quarterly         |
| SC-009: 80%+ completion rate       | Track started vs finished responses | Database query (admin)          |

---

## Next Steps

1. **Review this plan** with stakeholders for alignment
2. **Execute Phase 0**: Run research tasks to fill `research.md`
3. **Execute Phase 1**: Generate data model and API contracts
4. **Constitution re-check**: Validate design against principles post-Phase 1
5. **Ready for `/speckit.tasks`**: Break down into implementation tasks

---

## Appendix: Existing Schema References

**Relevant Existing Models** (do not modify, only extend relationships):

- `User` - Add relations: `requestedFeedback`, `receivedFeedback`, `feedbackSummary`, `strengthAdjustments`
- `Strength` - Add relation: `strengthAdjustments`
- `Team` / `TeamMember` - Used for validating feedback request recipients (must be teammates)
- `UserStrength` - Reference for comparing self-assessment vs peer feedback

**Database**: SQLite (development), PostgreSQL-compatible (production via Turso/libSQL)
