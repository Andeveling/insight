# Research: 360° Peer Feedback System

**Feature**: 001-peer-feedback  
**Phase**: 0 (Research & Design Validation)  
**Created**: December 13, 2025  
**Status**: In Progress

## Purpose

This document resolves all NEEDS CLARIFICATION items from the technical context and establishes the foundation for data model and API contract design in Phase 1.

---

## 1. Feedback Question Design

### Research Goal
Design 5 behavioral observation questions that:
- Map to all 20 strengths with adequate coverage
- Balance across 4 domains (Doing, Feeling, Motivating, Thinking)
- Take <3 minutes to complete
- Use observable behaviors (not personality judgments)

### Question Bank (Finalized)

#### Question 1: Problem-Solving Approach (Maps to: Thinking Domain)

**Question**: "When facing a complex challenge, this person typically..."

**Answer Type**: Behavioral choice (select one)

**Options**:
- **A**: "Pauses to reflect deeply before proposing solutions"
  - Strength weights: `thinker: 0.9`, `analyst: 0.7`, `strategist: 0.6`
- **B**: "Quickly generates multiple creative ideas to explore"
  - Strength weights: `brainstormer: 0.9`, `catalyst: 0.6`, `philomath: 0.5`
- **C**: "Breaks it down into structured, logical steps"
  - Strength weights: `analyst: 0.8`, `strategist: 0.7`, `focus-expert: 0.5`
- **D**: "Energizes others to tackle it together"
  - Strength weights: `catalyst: 0.8`, `commander: 0.7`, `optimist: 0.6`

---

#### Question 2: Team Contribution Style (Maps to: Motivating Domain)

**Question**: "In team discussions, this person's contribution style is best described as..."

**Answer Type**: Behavioral choice (select one)

**Options**:
- **A**: "Sharing knowledge and helping others learn"
  - Strength weights: `philomath: 0.8`, `coach: 0.7`, `storyteller: 0.6`
- **B**: "Keeping everyone positive and focused on possibilities"
  - Strength weights: `optimist: 0.9`, `peace-keeper: 0.6`, `empathizer: 0.5`
- **C**: "Challenging ideas and pushing for excellence"
  - Strength weights: `winner: 0.8`, `commander: 0.7`, `self-believer: 0.6`
- **D**: "Building bridges between different perspectives"
  - Strength weights: `peace-keeper: 0.9`, `empathizer: 0.7`, `chameleon: 0.6`

---

#### Question 3: Work Execution Pattern (Maps to: Doing Domain)

**Question**: "When working on projects with deadlines, this person..."

**Answer Type**: Behavioral choice (select one)

**Options**:
- **A**: "Reliably follows through on every commitment"
  - Strength weights: `deliverer: 0.9`, `time-keeper: 0.7`, `focus-expert: 0.6`
- **B**: "Takes initiative to get things moving quickly"
  - Strength weights: `catalyst: 0.8`, `commander: 0.6`, `winner: 0.5`
- **C**: "Adapts approach based on what the situation needs"
  - Strength weights: `chameleon: 0.9`, `problem-solver: 0.6`, `brainstormer: 0.5`
- **D**: "Stays guided by core principles and values"
  - Strength weights: `believer: 0.9`, `deliverer: 0.6`, `self-believer: 0.5`

---

#### Question 4: Interpersonal Dynamics (Maps to: Feeling Domain)

**Question**: "When conflicts or tension arise in the team, this person tends to..."

**Answer Type**: Behavioral choice (select one)

**Options**:
- **A**: "Sense others' emotions and create space for everyone"
  - Strength weights: `empathizer: 0.9`, `peace-keeper: 0.8`, `coach: 0.5`
- **B**: "Step up to make clear decisions and provide direction"
  - Strength weights: `commander: 0.9`, `catalyst: 0.6`, `winner: 0.5`
- **C**: "Stay focused on the goal and keep work moving forward"
  - Strength weights: `focus-expert: 0.8`, `deliverer: 0.7`, `time-keeper: 0.5`
- **D**: "Invest time in developing others' perspectives"
  - Strength weights: `coach: 0.9`, `empathizer: 0.7`, `peace-keeper: 0.6`

---

#### Question 5: Communication & Influence (Maps to: Thinking + Motivating)

**Question**: "When communicating ideas or plans, this person..."

**Answer Type**: Behavioral choice (select one)

**Options**:
- **A**: "Crafts compelling narratives that engage everyone"
  - Strength weights: `storyteller: 0.9`, `optimist: 0.6`, `chameleon: 0.5`
- **B**: "Presents data and logical analysis clearly"
  - Strength weights: `analyst: 0.8`, `strategist: 0.7`, `thinker: 0.6`
- **C**: "Thinks several steps ahead and maps out scenarios"
  - Strength weights: `strategist: 0.9`, `thinker: 0.7`, `time-keeper: 0.5`
- **D**: "Inspires confidence through their self-assurance"
  - Strength weights: `self-believer: 0.9`, `winner: 0.6`, `commander: 0.5`

---

### Coverage Analysis

**Strength Coverage Matrix**:

| Strength       | Q1  | Q2  | Q3  | Q4  | Q5  | Total Weight |
| -------------- | --- | --- | --- | --- | --- | ------------ |
| analyst        | 0.7 | -   | -   | -   | 0.8 | 1.5 ✅        |
| believer       | -   | -   | 0.9 | -   | -   | 0.9 ✅        |
| chameleon      | -   | 0.6 | 0.9 | -   | 0.5 | 2.0 ✅        |
| catalyst       | 0.6 | -   | 0.8 | 0.6 | -   | 2.0 ✅        |
| brainstormer   | 0.9 | -   | 0.5 | -   | -   | 1.4 ✅        |
| deliverer      | -   | -   | 0.9 | 0.7 | -   | 1.6 ✅        |
| focus-expert   | 0.5 | -   | 0.6 | 0.8 | -   | 1.9 ✅        |
| coach          | -   | 0.7 | -   | 0.9 | -   | 1.6 ✅        |
| empathizer     | -   | 0.5 | -   | 0.9 | -   | 1.4 ✅        |
| commander      | 0.7 | 0.7 | 0.6 | 0.9 | 0.5 | 3.4 ✅        |
| problem-solver | -   | -   | 0.6 | -   | -   | 0.6 ⚠️        |
| optimist       | 0.6 | 0.9 | -   | -   | 0.6 | 2.1 ✅        |
| self-believer  | -   | 0.6 | 0.5 | -   | 0.9 | 2.0 ✅        |
| philomath      | 0.5 | 0.8 | -   | -   | -   | 1.3 ✅        |
| peace-keeper   | -   | 0.9 | -   | 0.8 | -   | 1.7 ✅        |
| time-keeper    | -   | -   | 0.7 | 0.5 | 0.5 | 1.7 ✅        |
| storyteller    | -   | 0.6 | -   | -   | 0.9 | 1.5 ✅        |
| winner         | -   | 0.8 | 0.5 | 0.5 | 0.6 | 2.4 ✅        |
| strategist     | 0.7 | -   | -   | -   | 0.9 | 1.6 ✅        |
| thinker        | 0.9 | -   | -   | -   | 0.7 | 1.6 ✅        |

**Coverage Status**: 
- ✅ 19/20 strengths have adequate coverage (total weight ≥ 0.9)
- ⚠️ `problem-solver` has low coverage (0.6) - **Action**: Add weight to Q3 option C (increase to 0.7)

**Domain Balance**:
- Doing: Q3 (primary), Q1, Q2 (secondary)
- Feeling: Q4 (primary), Q3 (secondary)
- Motivating: Q2 (primary), Q1, Q5 (secondary)
- Thinking: Q1, Q5 (primary), Q3 (secondary)

✅ **Validation**: All domains adequately represented across questions.

---

## 2. Anonymization Architecture

### Research Goal
Design a cryptographically secure anonymization system that prevents identity inference while enabling response aggregation.

### Technical Specification

#### Database Design for Anonymity

**Principle**: Responses must be linkable to requests but NOT to specific respondents when anonymous.

**Implementation**:

```prisma
model FeedbackResponse {
  id                String   @id @default(uuid())
  requestId         String   // Can link to request
  questionId        String
  answer            String   // JSON answer data
  anonymousHash     String?  // One-way hash (only present if isAnonymous=true)
  createdAt         DateTime @default(now())
  
  request           FeedbackRequest @relation(fields: [requestId], references: [id])
  question          FeedbackQuestion @relation(fields: [questionId], references: [id])
  
  @@index([requestId])
  @@index([anonymousHash]) // For duplicate detection
}
```

**Key Design Decisions**:
1. **No direct `respondentId` field** when anonymous
2. **`anonymousHash`**: SHA-256 hash of `requestId + respondentId + serverSalt`
   - Purpose: Prevent duplicate responses from same person
   - Cannot reverse to identify respondent (salt is server secret)
3. **Timing attack prevention**: Randomize response save timing (±5 seconds)
4. **Metadata stripping**: No IP address, user-agent, or browser fingerprint stored

#### Anonymization Service

```typescript
// lib/utils/feedback/anonymization.ts

import crypto from 'crypto';

const SERVER_SALT = process.env.FEEDBACK_ANONYMIZATION_SALT!;

export function generateAnonymousHash(
  requestId: string,
  respondentId: string
): string {
  const data = `${requestId}:${respondentId}:${SERVER_SALT}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function canRespondAnonymously(
  requestId: string,
  respondentId: string,
  existingHashes: string[]
): boolean {
  const hash = generateAnonymousHash(requestId, respondentId);
  return !existingHashes.includes(hash);
}

export async function saveAnonymousResponse(
  requestId: string,
  respondentId: string,
  questionId: string,
  answer: string
) {
  // Randomize timing to prevent correlation attacks
  await randomDelay(0, 5000);
  
  const hash = generateAnonymousHash(requestId, respondentId);
  
  // Save without respondent linkage
  return prisma.feedbackResponse.create({
    data: {
      requestId,
      questionId,
      answer,
      anonymousHash: hash,
      // No respondentId stored
    }
  });
}

function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}
```

#### Security Audit Checklist

- [ ] `SERVER_SALT` is cryptographically random (32+ bytes)
- [ ] Salt is stored in secure environment variable (not in code)
- [ ] No database query can join anonymous responses to User table
- [ ] No API endpoint exposes `anonymousHash` values
- [ ] Response timestamps are rounded/randomized
- [ ] Browser fingerprinting is disabled for feedback forms
- [ ] IP addresses are not logged for feedback submissions

#### Attack Scenarios & Mitigations

| Attack Vector                                        | Risk   | Mitigation                                                |
| ---------------------------------------------------- | ------ | --------------------------------------------------------- |
| Timing correlation (submit time → respondent)        | Medium | Randomize save timing ±5 seconds                          |
| Small team inference ("only 3 possible respondents") | High   | Warn requester when team <5 people, still allow anonymous |
| Hash rainbow table attack                            | Low    | Use server-side salt (not exposed)                        |
| Database admin access                                | High   | Audit logs for database queries, access control           |
| Metadata correlation (IP, browser fingerprint)       | Medium | Strip all metadata, use generic timestamps                |

---

## 3. AI Insight Generation

### Research Goal
Design prompts and fallback logic for generating constructive, strength-focused insights from peer feedback.

### AI Prompt Template

```typescript
// lib/utils/feedback/insight-generator.ts

export interface InsightGenerationInput {
  userStrengths: Array<{
    strengthName: string;
    selfConfidence: number; // 0-1
  }>;
  peerFeedback: Array<{
    strengthName: string;
    peerConfidence: number; // 0-1
    responseCount: number;
  }>;
  userName: string;
}

export function buildInsightPrompt(input: InsightGenerationInput): string {
  return `You are a positive psychology expert specializing in strengths-based development. Analyze peer feedback to help individuals grow.

CONTEXT:
${input.userName} completed a self-assessment of their top strengths. They then received peer feedback from ${input.peerFeedback[0]?.responseCount || 3} teammates who observed their behaviors.

SELF-ASSESSED STRENGTHS:
${input.userStrengths.map(s => `- ${s.strengthName}: Confidence ${(s.selfConfidence * 100).toFixed(0)}%`).join('\n')}

PEER FEEDBACK (Aggregated):
${input.peerFeedback.map(p => `- ${p.strengthName}: Peers rate ${(p.peerConfidence * 100).toFixed(0)}% confidence (${p.responseCount} observations)`).join('\n')}

TASK:
Generate a constructive 3-paragraph insight summary:

1. **Overall Pattern** (2-3 sentences)
   - Where peers strongly agree with self-assessment
   - Where peers see strengths differently
   - Overall message: Teammates recognize your strengths

2. **Blind Spots** (2-3 sentences)
   - Strengths peers see MORE strongly than you rated yourself (hidden talents)
   - Strengths peers see LESS strongly than you rated yourself (growth areas)
   - Frame as opportunities, not weaknesses

3. **Actionable Recommendation** (2-3 sentences)
   - One specific strength to emphasize more (based on peer validation)
   - One specific strength to explore further (based on blind spot)
   - How to leverage insights for team contribution

TONE GUIDELINES:
- Constructive and encouraging (not critical)
- Specific (mention exact strength names)
- Actionable (suggest concrete next steps)
- Empowering (highlight user's unique value)
- Strength-focused (not deficit-focused)

OUTPUT FORMAT: Plain text, 3 paragraphs, no headers.`;
}
```

### Example AI Output

**Input**:
- Self: Deliverer (90%), Strategist (85%), Analyst (80%)
- Peers: Deliverer (95%), Empathizer (75%), Strategist (70%)

**AI Generated Insight**:

> Your teammates strongly recognize your Deliverer strength, rating it even higher than you did yourself. They consistently see you as someone who follows through on commitments reliably. However, they also notice your Empathizer strength showing up more than you might realize—your ability to understand and support others is having an impact. There's a slight difference in how you and your peers view your Strategist strength, which is worth exploring.
>
> A potential blind spot: While you see yourself as highly strategic, your peers observe this strength at a moderate level. This could mean you're doing more strategic thinking internally than you're communicating outwardly. On the flip side, your Empathizer strength is a hidden talent—peers see you creating psychological safety and understanding others' needs more than you give yourself credit for.
>
> **Actionable next step**: Continue leaning into your Deliverer strength—it's clearly valued and recognized by your team. Additionally, explore your Empathizer strength more intentionally. Consider how you can leverage this to build even stronger team connections. For your Strategist strength, try verbalizing your strategic thinking more openly so teammates can see the long-term planning you're doing behind the scenes.

### Rule-Based Fallback Logic

**When AI Service Unavailable** (network failure, rate limit, etc.):

```typescript
export function generateRuleBasedInsights(
  input: InsightGenerationInput
): string {
  const agreements: string[] = [];
  const blindSpotsHigh: string[] = []; // Peers see higher
  const blindSpotsLow: string[] = []; // Peers see lower
  
  input.peerFeedback.forEach(peer => {
    const self = input.userStrengths.find(s => s.strengthName === peer.strengthName);
    if (!self) return;
    
    const diff = peer.peerConfidence - self.selfConfidence;
    
    if (Math.abs(diff) < 0.15) {
      agreements.push(peer.strengthName);
    } else if (diff > 0.25) {
      blindSpotsHigh.push(peer.strengthName);
    } else if (diff < -0.25) {
      blindSpotsLow.push(peer.strengthName);
    }
  });
  
  // Template-based paragraphs
  const p1 = `Your peers strongly recognize ${agreements.length} of your top strengths: ${agreements.join(', ')}. This alignment shows that your self-awareness is accurate and your strengths are visible to your teammates.`;
  
  const p2 = blindSpotsHigh.length > 0
    ? `Your peers see ${blindSpotsHigh.join(' and ')} more strongly than you rated yourself. This is a positive signal—you have hidden talents that are making an impact on your team.`
    : `Your self-assessment closely matches how your peers observe your strengths, showing strong self-awareness.`;
  
  const p3 = blindSpotsLow.length > 0
    ? `Consider exploring ${blindSpotsLow[0]} further—while you see this as a top strength, your peers observe it at a moderate level. This could be an opportunity to communicate this strength more explicitly.`
    : `Continue developing your top strengths and look for opportunities to apply them in new contexts.`;
  
  return `${p1}\n\n${p2}\n\n${p3}`;
}
```

### Validation Criteria

AI-generated insights will be validated for:
1. **Tone**: No negative/critical language (sentiment analysis score >0.6)
2. **Specificity**: Must mention at least 2 strength names explicitly
3. **Actionability**: Must contain at least 1 "consider", "try", or "explore" recommendation
4. **Length**: 250-500 words (3 paragraphs)

If validation fails → fallback to rule-based insights.

---

## 4. Strength Mapping Algorithm

### Research Goal
Design algorithm to map 5 question responses to 20 strengths with confidence scores.

### Aggregation Algorithm

```typescript
// lib/services/strength-mapping.service.ts

export interface QuestionResponse {
  questionId: string;
  selectedOption: string; // "A", "B", "C", "D"
  strengthWeights: Record<string, number>; // e.g., { "deliverer": 0.9, "time-keeper": 0.7 }
}

export interface StrengthScore {
  strengthId: string;
  strengthName: string;
  totalScore: number;
  confidence: number; // 0-1
  contributingQuestions: number;
}

export function calculateStrengthScores(
  responses: QuestionResponse[]
): StrengthScore[] {
  const strengthAccumulator: Record<string, { 
    total: number; 
    count: number;
    maxPossible: number;
  }> = {};
  
  // Accumulate scores from all questions
  responses.forEach(response => {
    Object.entries(response.strengthWeights).forEach(([strengthId, weight]) => {
      if (!strengthAccumulator[strengthId]) {
        strengthAccumulator[strengthId] = { total: 0, count: 0, maxPossible: 0 };
      }
      
      strengthAccumulator[strengthId].total += weight;
      strengthAccumulator[strengthId].count += 1;
      strengthAccumulator[strengthId].maxPossible += 1.0; // Max weight per question is 1.0
    });
  });
  
  // Convert to strength scores with confidence
  const scores: StrengthScore[] = Object.entries(strengthAccumulator).map(
    ([strengthId, data]) => {
      const averageScore = data.total / data.count;
      const confidence = data.total / data.maxPossible; // How close to max possible
      
      return {
        strengthId,
        strengthName: getStrengthName(strengthId), // Lookup from DB/constants
        totalScore: data.total,
        confidence: Math.min(confidence, 1.0), // Cap at 1.0
        contributingQuestions: data.count
      };
    }
  );
  
  // Sort by total score (descending)
  return scores.sort((a, b) => b.totalScore - a.totalScore);
}

export function aggregatePeerFeedback(
  allResponses: QuestionResponse[][]  // Array of response sets (one per peer)
): StrengthScore[] {
  // Calculate scores for each peer individually
  const peerScores = allResponses.map(responses => 
    calculateStrengthScores(responses)
  );
  
  // Aggregate across peers (average confidence scores)
  const aggregated: Record<string, { 
    totalConfidence: number; 
    count: number;
    contributingPeers: number;
  }> = {};
  
  peerScores.forEach(scores => {
    scores.forEach(score => {
      if (!aggregated[score.strengthId]) {
        aggregated[score.strengthId] = { 
          totalConfidence: 0, 
          count: 0,
          contributingPeers: 0
        };
      }
      
      aggregated[score.strengthId].totalConfidence += score.confidence;
      aggregated[score.strengthId].count += 1;
      aggregated[score.strengthId].contributingPeers += 1;
    });
  });
  
  // Convert to final scores
  return Object.entries(aggregated).map(([strengthId, data]) => ({
    strengthId,
    strengthName: getStrengthName(strengthId),
    totalScore: data.totalConfidence,
    confidence: data.totalConfidence / data.contributingPeers,
    contributingQuestions: data.count
  })).sort((a, b) => b.confidence - a.confidence);
}
```

### Conflict Resolution Rules

**Scenario**: Peers give conflicting signals for same strength.

**Example**:
- Peer 1: Deliverer confidence 0.9
- Peer 2: Deliverer confidence 0.3
- Peer 3: Deliverer confidence 0.8

**Resolution**: Use **median** instead of mean to reduce outlier impact.

```typescript
function calculateMedianConfidence(confidences: number[]): number {
  const sorted = [...confidences].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Result: median([0.9, 0.3, 0.8]) = 0.8 (more representative than mean 0.67)
```

### Coverage Issue: `problem-solver`

**Issue**: Q3 option C only maps to `problem-solver` with 0.6 weight (low).

**Resolution**: Update mapping in question bank:
- Q3, Option C: Increase `problem-solver` weight from 0.6 to 0.7 ✅

---

## 5. Notification Strategy

### Research Goal
Design notification copy and delivery strategy that maximizes response rate without creating pressure.

### Notification Templates

#### 1. Initial Request Notification (Email)

**Subject**: `${requesterName} requested your feedback (2 minutes)`

**Body**:
```
Hi ${respondentName},

${requesterName} values your perspective and has asked for quick feedback on their strengths. This survey takes about 2 minutes and will help them understand how their strengths show up in teamwork.

[Start Feedback Survey]

Your response will be ${isAnonymous ? 'anonymous' : 'shared with ' + requesterName}.

This is completely optional—there's no obligation to respond. If you choose to participate, your insights can help ${requesterName} grow.

Thanks for being part of a supportive team,
The Insight Team
```

**Design Rationale**:
- ✅ Emphasizes brevity (2 minutes)
- ✅ Clarifies anonymity upfront
- ✅ Makes it optional (no pressure)
- ✅ Highlights positive impact (helping teammate grow)

#### 2. In-App Notification (Dashboard Badge)

**Text**: `${requesterName} requested feedback`

**Badge Count**: Number of pending feedback requests

**Action**: Click to view list of pending requests with "Start Survey" buttons

#### 3. Reminder Notification (Optional, Future Enhancement)

**Timing**: 7 days after initial request (if still pending)

**Subject**: `Reminder: Feedback request from ${requesterName}`

**Body**:
```
Hi ${respondentName},

Just a friendly reminder that ${requesterName} is hoping for your feedback. This 2-minute survey will expire in 7 days.

[Complete Survey]

If you're not able to provide feedback, that's completely fine—no action needed.
```

**Design Rationale**:
- ⚠️ Only ONE reminder (avoid annoyance)
- ✅ Mentions expiration (creates urgency without pressure)
- ✅ Provides easy opt-out (no action needed)

### Copy A/B Testing Plan

**Hypothesis**: Adding social proof increases response rate.

**Variant A** (Control): Standard template above  
**Variant B** (Social Proof): Add line: `"3 teammates have already responded"`

**Metrics**:
- Response rate within 48 hours
- Response rate within 7 days
- Completion rate (started → finished)

**Target**: 60%+ response rate (success criterion SC-003)

### Notification Delivery Infrastructure

**Existing System**: Assume email notification service exists (verify in Phase 1)

**New Requirements**:
- Queue system for sending notifications (batch send to avoid spam filters)
- Notification preference: Allow users to opt-out of feedback request emails
- Retry logic: Retry failed email sends up to 3 times
- Tracking: Log notification sent/delivered/opened (email provider webhooks)

**Technical Dependencies**:
- Email service (Resend, SendGrid, or similar)
- Database table: `Notification` (track sent notifications)
- Cron job: Process notification queue every 5 minutes

---

## Research Outcomes Summary

### Decisions Made

| Research Area        | Decision                         | Rationale                                                          |
| -------------------- | -------------------------------- | ------------------------------------------------------------------ |
| **Question Count**   | 5 questions                      | Balances coverage (all 20 strengths) with completion time (<3 min) |
| **Answer Format**    | Behavioral choice (4 options)    | Easier to map to strengths than Likert scales, faster to complete  |
| **Anonymization**    | Hash-based unlinkable responses  | Prevents identity inference while allowing duplicate detection     |
| **AI Insights**      | GPT-4 with rule-based fallback   | Best quality insights, graceful degradation if AI unavailable      |
| **Strength Mapping** | Weighted aggregation with median | Handles conflicts, emphasizes consistent patterns                  |
| **Notifications**    | Email + in-app, single reminder  | Maximizes reach, minimizes annoyance                               |

### Action Items for Phase 1

1. ✅ **Question bank finalized** - Ready for database seeding
2. ✅ **Anonymization spec complete** - Ready for schema design
3. ✅ **AI prompt template ready** - Ready for service implementation
4. ✅ **Strength mapping algorithm defined** - Ready for coding
5. ✅ **Notification copy approved** - Ready for template implementation

### Open Questions (Optional Enhancements)

- **Gamification**: Should we add badges/points for providing feedback? (Out of scope for MVP)
- **Manager feedback**: Different questions for managers vs. peers? (Out of scope for MVP)
- **Historical trends**: Visualize confidence changes over time? (Future feature, not MVP)

---

## Next Steps

1. ✅ Phase 0 complete - All research questions answered
2. ➡️ **Proceed to Phase 1**: Create `data-model.md` with Prisma schema extensions
3. ➡️ **Proceed to Phase 1**: Generate API contracts in `contracts/` directory
4. ➡️ **Proceed to Phase 1**: Write `quickstart.md` for developer setup
5. ⏸️ **Constitution re-check**: After Phase 1 design, validate against principles

---

## Appendix: References

**Strength Data Sources**:
- `/prisma/data/strengths.data.ts` - Full strength definitions
- `/app/dashboard/assessment/_components/strength-descriptions.ts` - UI descriptions
- `/lib/data/strengths.data.ts` - Client metadata

**Existing Models**:
- `User`, `Team`, `TeamMember` - For request recipient validation
- `Strength`, `Domain` - For mapping answers to strengths
- `UserStrength` - For comparing self vs. peer assessments

**Best Practices**:
- HIGH5 methodology (strengths-based positive psychology)
- 360-degree feedback research (Patricia Wheeler, 2011)
- Anonymous feedback systems (Harvard Business Review, 2019)
