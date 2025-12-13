# Insight - Next Generation Features

**Version**: 1.0.0  
**Created**: December 12, 2025  
**Status**: Proposed Features Roadmap

---

## Overview

This document outlines the next 10 key features to evolve Insight from a HIGH5-dependent assessment viewer into a comprehensive, self-sufficient strength discovery and team optimization platform. These features address three core objectives:

1. **Self-Assessment Independence**: Enable users to discover their profile without external HIGH5 test dependency
2. **360° Feedback Integration**: Incorporate peer perspectives to refine individual profiles
3. **Dynamic Team Optimization**: Create sub-teams and analyze match quality for specific projects

---

## Top 10 Feature Priorities

### Feature 1: Progressive Strength Discovery Quiz

**Priority**: P0 (Critical)  
**Effort**: Large (4-6 weeks)  
**Dependencies**: None

#### Problem Statement

Currently, users must complete the external HIGH5 test to get their strength profile. This creates:
- Friction in onboarding (external redirect, paid test)
- Dependency on third-party availability
- Limited control over assessment experience

#### Proposed Solution

Build an internal **domain-based progressive questionnaire** that guides users through discovering their top 5 strengths organically.

#### Key Components

| Component                   | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| **Question Bank**           | 60-80 questions (15-20 per domain) designed by positive psychology principles |
| **Adaptive Logic**          | Questions adapt based on previous answers to narrow down strengths            |
| **Progress Visualization**  | Real-time domain affinity bars showing emerging pattern                       |
| **Result Confidence Score** | AI-calculated confidence level for each suggested strength                    |

#### Technical Implementation

**Database Schema**:
```prisma
model AssessmentQuestion {
  id          String   @id @default(uuid())
  domainId    String   // Links to Domain
  strengthId  String?  // Optional: specific strength indicator
  text        String
  type        String   // "scale" | "choice" | "ranking"
  weight      Float    // Importance multiplier
  order       Int
}

model UserAssessmentAnswer {
  id         String   @id @default(uuid())
  userId     String
  questionId String
  answer     String   // JSON-serialized answer
  confidence Float    // 0-1 self-reported confidence
  createdAt  DateTime @default(now())
}

model AssessmentSession {
  id          String   @id @default(uuid())
  userId      String
  status      String   // "in_progress" | "completed" | "abandoned"
  currentStep Int
  results     String?  // JSON: preliminary strength rankings
  completedAt DateTime?
  createdAt   DateTime @default(now())
}
```

**User Flow**:
1. Start quiz → Welcome screen with estimated time (15-20 min)
2. Phase 1: Domain discovery (20 questions, 5 per domain)
3. Phase 2: Strength refinement (30 questions, focused on top 2-3 domains)
4. Phase 3: Ranking confirmation (10 questions, validate top 5 order)
5. Results → AI-generated confidence report + suggested top 5

#### Success Metrics

- 80%+ completion rate for started assessments
- <20 minutes average completion time
- 70%+ user agreement with AI-suggested strengths

---

### Feature 2: 360° Peer Feedback System

**Priority**: P0 (Critical)  
**Effort**: Medium (3-4 weeks)  
**Dependencies**: Feature 1 (can run in parallel)

#### Problem Statement

Self-assessment has inherent blind spots. Users may not accurately perceive how their strengths manifest to others, leading to:
- Overestimation of certain strengths
- Undervaluation of natural talents
- Misalignment between self-view and team perception

#### Proposed Solution

Implement a **lightweight peer feedback mechanism** where teammates answer 5 quick questions about a user's observable behaviors, mapped to strength indicators.

#### Key Components

| Component                | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| **Feedback Request**     | User selects 3-5 teammates to request feedback from    |
| **Quick Questionnaire**  | 5 behavioral questions (2 min to complete)             |
| **Anonymous Option**     | Toggle for anonymous vs. attributed feedback           |
| **Feedback Aggregation** | AI synthesizes patterns across multiple responses      |
| **Profile Refinement**   | Adjusts confidence scores and suggests profile updates |

#### Technical Implementation

**Database Schema**:
```prisma
model FeedbackRequest {
  id            String   @id @default(uuid())
  requesterId   String   // User requesting feedback
  respondentId  String   // User giving feedback
  status        String   // "pending" | "completed" | "declined"
  isAnonymous   Boolean  @default(true)
  sentAt        DateTime @default(now())
  completedAt   DateTime?
  responses     FeedbackResponse[]
}

model FeedbackQuestion {
  id              String   @id @default(uuid())
  text            String
  strengthMapping String   // JSON: maps answers to strengths
  type            String   // "scale" | "behavioral_choice"
  order           Int
}

model FeedbackResponse {
  id         String   @id @default(uuid())
  requestId  String
  questionId String
  answer     String   // JSON-serialized
  createdAt  DateTime @default(now())
}

model FeedbackSummary {
  id               String   @id @default(uuid())
  userId           String   @unique
  totalResponses   Int
  strengthAdjustments String // JSON: confidence deltas per strength
  insights         String   // AI-generated summary
  updatedAt        DateTime @updatedAt
}
```

#### User Flow

**Requesting Feedback**:
1. User navigates to Profile → "Request Peer Feedback"
2. Select teammates from dropdown (3-5 recommended)
3. Choose anonymous vs. attributed
4. System sends email/in-app notification

**Giving Feedback**:
1. Receive notification: "Sarah requested your feedback (2 min)"
2. Answer 5 questions:
   - "When working on tight deadlines, Sarah typically..."
   - "In team discussions, Sarah's contribution style is..."
   - "Sarah's approach to problem-solving can be described as..."
   - "When conflicts arise, Sarah tends to..."
   - "Sarah energizes the team most when..."
3. Submit → Thank you message

**Profile Update**:
1. After 3+ responses, user sees "New Insights Available"
2. AI summary: "Your peers consistently see Deliverer and Strategist more strongly than you rated yourself"
3. Option to adjust profile or request more feedback

#### Success Metrics

- 60%+ response rate on feedback requests
- <3 minutes average feedback completion time
- 40%+ users adjust profile after receiving feedback

---

### Feature 3: Sub-Team Builder & Match Analyzer

**Priority**: P1 (High)  
**Effort**: Medium (3-4 weeks)  
**Dependencies**: None (uses existing team data)

#### Problem Statement

Organizations need to form project-specific sub-teams from larger teams. Current platform shows overall team dynamics but doesn't help answer:
- "Who should work together on Project X?"
- "Which combination creates the best balance for this initiative?"
- "Are we missing critical strengths for this project type?"

#### Proposed Solution

A **sub-team composition tool** that allows creating virtual teams and analyzing their strength match for specific project types.

#### Key Components

| Component                 | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| **Project Type Selector** | Choose initiative type (e.g., "Crisis Response", "Innovation Sprint", "Process Improvement") |
| **Member Selector**       | Drag-and-drop interface to build sub-teams                                                   |
| **Match Score**           | AI-calculated compatibility score (0-100)                                                    |
| **Gap Analysis**          | Highlights missing strengths for project type                                                |
| **What-If Simulator**     | Swap members to see impact on match score                                                    |

#### Technical Implementation

**Database Schema**:
```prisma
model SubTeam {
  id          String   @id @default(uuid())
  parentTeamId String
  name        String
  description String?
  projectType String   // "innovation" | "execution" | "crisis" | "growth"
  members     String   // JSON: array of userIds
  matchScore  Float?   // AI-calculated
  analysis    String?  // JSON: detailed match analysis
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProjectTypeProfile {
  id                 String   @id @default(uuid())
  type               String   @unique
  name               String
  idealStrengths     String   // JSON: array of strength names
  criticalDomains    String   // JSON: domain weights
  cultureFit         String   // JSON: culture preferences
  description        String
}
```

#### User Flow

1. Navigate to Team → "Create Sub-Team"
2. **Step 1: Project Context**
   - Name sub-team: "Q1 Product Launch"
   - Select project type: "Execution-Heavy Initiative"
   - Set timeline: "3 months"
3. **Step 2: Build Team**
   - Available members shown with strength badges
   - Drag 4-7 members into sub-team zone
   - Real-time match score updates as members added
4. **Step 3: Analyze Match**
   - Overall Score: 78/100
   - Strengths: "Strong execution focus, balanced domains"
   - Gaps: "Missing Strategist for long-term planning"
   - Recommendation: "Add Maria (Strategist) or reduce scope"
5. **Step 4: Save & Share**
   - Save configuration
   - Generate sub-team report
   - Share with stakeholders

#### Match Score Algorithm

```typescript
interface MatchScoreFactors {
  strengthCoverage: number;    // 0-30 points
  domainBalance: number;       // 0-25 points
  cultureFit: number;          // 0-20 points
  teamSize: number;            // 0-15 points
  redundancyPenalty: number;   // 0-10 deduction
}
```

#### Success Metrics

- 30+ sub-teams created per month per organization
- 70%+ users report improved project team formation
- 50%+ sub-teams achieve 75+ match score

---

### Feature 4: Strength Development Pathways

**Priority**: P1 (High)  
**Effort**: Medium (2-3 weeks)  
**Dependencies**: None

#### Problem Statement

Users know their strengths but lack structured guidance on how to develop them further or apply them in new contexts.

#### Proposed Solution

**Personalized development paths** with micro-learning content, challenges, and progress tracking for each strength.

#### Key Components

| Component               | Description                                      |
| ----------------------- | ------------------------------------------------ |
| **Development Modules** | 3-5 modules per strength (Beginner → Advanced)   |
| **Weekly Challenges**   | Practical exercises to apply strengths           |
| **Progress Tracking**   | Visual journey map showing completion            |
| **Peer Learning**       | Connect with others developing same strength     |
| **AI Coach**            | Personalized suggestions based on usage patterns |

#### Technical Implementation

**Database Schema**:
```prisma
model DevelopmentModule {
  id          String   @id @default(uuid())
  strengthId  String
  level       String   // "beginner" | "intermediate" | "advanced"
  title       String
  description String
  content     String   // Markdown content
  duration    Int      // Estimated minutes
  challenges  Challenge[]
}

model Challenge {
  id          String   @id @default(uuid())
  moduleId    String
  title       String
  description String
  type        String   // "reflection" | "action" | "collaboration"
  xpReward    Int      // Gamification points
}

model UserProgress {
  id              String   @id @default(uuid())
  userId          String
  moduleId        String
  status          String   // "not_started" | "in_progress" | "completed"
  completedChallenges Int
  totalChallenges     Int
  xpEarned        Int
  startedAt       DateTime?
  completedAt     DateTime?
}
```

#### Success Metrics

- 40%+ users start at least one development path
- 60%+ completion rate for started paths
- 3+ challenges completed per active user per week

---

### Feature 5: Real-Time Collaboration Insights

**Priority**: P1 (High)  
**Effort**: Large (4-5 weeks)  
**Dependencies**: Slack/Teams integration

#### Problem Statement

Teams work asynchronously across tools (Slack, Teams, Email). Platform insights are static and don't reflect real-time collaboration patterns.

#### Proposed Solution

**Integration layer** that analyzes communication patterns and provides real-time strength-based collaboration insights.

#### Key Components

| Component                        | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| **Communication Analysis**       | Parse Slack/Teams messages for collaboration signals |
| **Strength Utilization Tracker** | Detect when team members use their strengths         |
| **Burnout Detector**             | Flag overuse of certain strengths                    |
| **Suggestion Engine**            | Real-time tips during active collaboration           |
| **Weekly Digest**                | Summary of collaboration effectiveness               |

#### Example Insights

- "Sarah (Deliverer) has closed 12 tasks this week—consider delegating to prevent burnout"
- "Your team is in 'execution mode'—schedule a Strategy session with Mark"
- "3 Thinkers in this channel—decision paralysis risk detected"

#### Success Metrics

- 50%+ teams enable integration within first month
- 80%+ find insights "useful" or "very useful"
- 20% improvement in perceived team effectiveness

---

### Feature 6: Strength-Based Role Recommendations

**Priority**: P2 (Medium)  
**Effort**: Small (1-2 weeks)  
**Dependencies**: Feature 1 or HIGH5 data

#### Problem Statement

Users wonder "What roles best fit my strengths?" but platform only shows generic career applications.

#### Proposed Solution

**AI-powered role matcher** that maps user strengths to specific job roles, project types, and team positions.

#### Key Components

| Component           | Description                                  |
| ------------------- | -------------------------------------------- |
| **Role Database**   | 200+ roles categorized by required strengths |
| **Match Algorithm** | Score roles based on strength profile        |
| **Growth Roles**    | Roles that would stretch 1-2 strengths       |
| **Team Position**   | Suggested role within current team context   |

#### Success Metrics

- 60%+ users explore role recommendations
- 30%+ discuss results with manager/team lead

---

### Feature 7: Team Rituals & Playbooks

**Priority**: P2 (Medium)  
**Effort**: Medium (2-3 weeks)  
**Dependencies**: None

#### Problem Statement

Teams receive insights but lack practical frameworks to act on them.

#### Proposed Solution

**Curated playbooks** with strength-based meeting formats, decision-making frameworks, and conflict resolution protocols.

#### Example Playbooks

| Playbook                | Use Case                              |
| ----------------------- | ------------------------------------- |
| **Innovation Sprint**   | For teams high in Thinking/Motivating |
| **Crisis Response**     | For teams high in Doing/Action        |
| **Strategic Planning**  | For teams needing Reflection focus    |
| **Conflict Resolution** | Strength-aware mediation techniques   |

#### Success Metrics

- 40%+ teams adopt at least one playbook
- 3+ playbook sessions run per team per quarter

---

### Feature 8: Strength Evolution Timeline

**Priority**: P2 (Medium)  
**Effort**: Small (1-2 weeks)  
**Dependencies**: Longitudinal data (6+ months)

#### Problem Statement

Users want to see how their strengths have evolved over time, especially after development efforts or role changes.

#### Proposed Solution

**Timeline visualization** showing strength profile changes with annotated life events (promotions, projects, feedback).

#### Key Components

| Component           | Description                                      |
| ------------------- | ------------------------------------------------ |
| **Timeline Chart**  | Visual history of strength rankings              |
| **Event Markers**   | Annotate major events (e.g., "Promoted to Lead") |
| **Trend Analysis**  | AI insights on growth trajectory                 |
| **Comparison View** | Before/after snapshots                           |

#### Success Metrics

- 50%+ users revisit timeline quarterly
- 70%+ users add life event annotations

---

### Feature 9: Organization Strength Heatmap

**Priority**: P2 (Medium)  
**Effort**: Medium (2-3 weeks)  
**Dependencies**: Multi-team organizations

#### Problem Statement

Leadership lacks visibility into organizational-wide strength distribution and gaps.

#### Proposed Solution

**Executive dashboard** showing aggregate strength analytics across all teams with gap analysis and hiring recommendations.

#### Key Components

| Component               | Description                                  |
| ----------------------- | -------------------------------------------- |
| **Org Heatmap**         | Visual map of strength density by department |
| **Gap Report**          | Underrepresented strengths org-wide          |
| **Hiring Advisor**      | Suggested strength profiles for open roles   |
| **Succession Planning** | Identify strength coverage risks             |

#### Success Metrics

- 80%+ leadership finds insights actionable
- 30% reduction in critical strength gaps over 12 months

---

### Feature 10: AI-Powered Strength Discovery Interviews

**Priority**: P3 (Nice-to-Have)  
**Effort**: Large (5-6 weeks)  
**Dependencies**: Advanced AI capabilities

#### Problem Statement

Questionnaires feel impersonal. Users want conversational, adaptive assessment experiences.

#### Proposed Solution

**Voice/text-based AI interview** that asks adaptive follow-up questions based on user's story-based responses.

#### Key Components

| Component              | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Conversational UI**  | Chat interface with AI interviewer                |
| **Story Elicitation**  | Asks for specific work/life examples              |
| **Adaptive Probing**   | Follows interesting threads with "tell me more"   |
| **Real-Time Analysis** | Identifies strength signals during conversation   |
| **Transcript Summary** | Generates narrative report with strength evidence |

#### Example Interaction

```
AI: "Tell me about a time you felt most energized at work."

User: "Last quarter, we had a tight deadline and I coordinated 
       everything to make sure we delivered."

AI: "What specifically did you enjoy about coordinating?"

User: "Seeing all the pieces come together. I love when everyone 
       knows what to do and we execute flawlessly."

AI: [Detects Deliverer + Commander signals]
    "Interesting! Walk me through how you organized the team..."
```

#### Success Metrics

- 40%+ users prefer AI interview over questionnaire
- 85%+ completion rate (higher than Feature 1)
- 90%+ users say experience felt "personalized"

---

## Implementation Roadmap

### Phase 1: Independence (Months 1-3)
- **Feature 1**: Progressive Strength Discovery Quiz
- **Feature 2**: 360° Peer Feedback System

### Phase 2: Optimization (Months 4-6)
- **Feature 3**: Sub-Team Builder & Match Analyzer
- **Feature 4**: Strength Development Pathways
- **Feature 6**: Role Recommendations

### Phase 3: Integration (Months 7-9)
- **Feature 5**: Real-Time Collaboration Insights
- **Feature 7**: Team Rituals & Playbooks
- **Feature 8**: Strength Evolution Timeline

### Phase 4: Scale (Months 10-12)
- **Feature 9**: Organization Strength Heatmap
- **Feature 10**: AI-Powered Interviews (if resources permit)

---

## Success Criteria

### Product Metrics

| Metric                          | Target (12 months) |
| ------------------------------- | ------------------ |
| Self-Assessment Completion Rate | 70%+               |
| Peer Feedback Participation     | 60%+               |
| Sub-Team Creation Activity      | 500+ sub-teams     |
| Development Path Engagement     | 40%+ users         |
| Integration Adoption            | 50%+ teams         |

### Business Metrics

| Metric                   | Target (12 months)                   |
| ------------------------ | ------------------------------------ |
| Reduced HIGH5 Dependency | 50%+ users via self-assessment       |
| User Retention           | 80%+ quarterly retention             |
| Team Expansion           | 30%+ teams add members               |
| Premium Conversion       | 20%+ freemium → paid (if applicable) |

---

## Technical Considerations

### Database Impact

Features 1, 2, and 3 require significant schema additions:
- ~8 new models for assessment system
- ~5 new models for feedback system
- ~3 new models for sub-teams

**Migration Strategy**: Staged rollout with feature flags

### AI Costs

Features 2, 4, 5, and 10 have significant AI usage:
- Estimated: $0.50-$2.00 per user per month (GPT-4o)
- Optimization: Cache common analyses, use GPT-4o-mini for simpler tasks

### Performance

Feature 5 (Real-Time Insights) requires:
- Webhook infrastructure for Slack/Teams
- Background job processing
- Redis caching layer

---

## Next Steps

1. **Validation Phase** (2 weeks)
   - User interviews with 10-15 existing users
   - Prioritize features based on feedback
   - Create detailed spec for Feature 1

2. **Design Sprint** (1 week)
   - UI/UX mockups for Features 1-3
   - User flow validation
   - Technical architecture review

3. **Development Kickoff** (Week 4)
   - Begin Feature 1 implementation
   - Set up feature flags and A/B testing infrastructure
   - Establish success metrics tracking

---

**Document Owner**: Product Team  
**Last Review**: December 12, 2025  
**Next Review**: January 15, 2026
