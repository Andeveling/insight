# Research: Progressive Strength Discovery Quiz

**Feature**: 001-strength-quiz  
**Created**: December 12, 2025  
**Status**: Phase 0 - Research in Progress

## Overview

This document consolidates research findings for implementing the Progressive Strength Discovery Quiz feature. Each section addresses a specific research task from the implementation plan and documents decisions, rationales, and alternatives considered.

---

## 0.1 Question Design Methodology

### Research Question
What are the best practices for designing assessment questions based on positive psychology principles that accurately map to the HIGH5 strengths framework?

### Findings

#### Question Types

**Decision**: Use three question types strategically across phases

1. **Scale Questions** (1-5 Likert scale)
   - **When**: Phase 1 domain discovery, measuring affinity/frequency
   - **Format**: "How often do you..." or "To what extent do you..."
   - **Scoring**: Direct numerical mapping to domain scores
   - **Example**: "How often do you take charge in ambiguous situations?" (1=Never, 5=Always)

2. **Choice Questions** (Single select from options)
   - **When**: Phase 2 strength refinement, forcing preference
   - **Format**: Scenario-based with 3-4 options representing different strengths
   - **Scoring**: Selected option maps to specific strength(s)
   - **Example**: "When facing a tight deadline, you typically: A) Create a detailed plan B) Rally the team C) Find creative shortcuts D) Focus on quality"

3. **Ranking Questions** (Order 3-5 items)
   - **When**: Phase 3 confirmation, validating top strengths
   - **Format**: "Rank these statements by how true they are for you"
   - **Scoring**: Weighted by position (1st=5 points, 2nd=4 points, etc.)
   - **Example**: Rank behaviors from most to least characteristic

**Rationale**: Each type serves a distinct purpose in narrowing down strengths. Scales provide breadth, choices force differentiation, rankings confirm priorities.

#### Question Wording Guidelines

**Principles**:
1. **Positive framing**: Focus on what people do, not what they lack
2. **Behavioral focus**: Ask about actions, not self-perception ("I do X" vs "I am Y")
3. **Concrete scenarios**: Provide context rather than abstract traits
4. **Neutral language**: Avoid loaded terms that suggest "correct" answers
5. **Present tense**: Focus on current behavior patterns, not aspirations

**Anti-patterns to avoid**:
- Leading questions: "Don't you think it's important to..."
- Double-barreled: Asking two things in one question
- Extreme language: "always", "never" (except in scale endpoints)
- Jargon or academic terminology
- Negatively framed: "How often do you NOT..."

#### Mapping Strategy

**Decision**: Hybrid weighted scoring approach

**Phase 1 - Domain Discovery**:
- Each question maps primarily to one domain (1.0 weight)
- May have secondary domain mapping (0.3-0.5 weight)
- User responses multiplied by weights and aggregated per domain
- Top 2-3 domains with highest scores advance to Phase 2

**Phase 2 - Strength Refinement**:
- Questions map to 2-3 specific strengths within top domains
- Response options explicitly linked to strength indicators
- Scoring accumulates evidence for each strength
- Considers domain balance (avoid all 5 from same domain)

**Phase 3 - Ranking Confirmation**:
- Questions present behaviors associated with top 5 candidate strengths
- Ranking order provides final confidence weighting
- Validates Phase 2 results and establishes final order

#### Weight Assignment Methodology

**Question Weight Factors**:
1. **Discriminant validity** (0.5-2.0): How well the question differentiates between strengths
2. **Construct validity** (0.7-1.5): How directly it measures the target domain/strength
3. **Reliability** (0.8-1.2): Consistency of responses in prior testing (if available)
4. **Phase importance** (Phase 1: 0.8-1.2, Phase 2: 1.0-1.5, Phase 3: 1.5-2.0)

**Default Weights**:
- Phase 1 general questions: 1.0
- Phase 1 domain-defining questions: 1.3
- Phase 2 strength-specific questions: 1.2
- Phase 3 confirmation questions: 1.8

**Adjustment over time**: Collect completion data and adjust weights based on empirical correlation with user satisfaction and peer feedback validation.

#### Validation Approach

**Pre-launch**:
1. Expert review by positive psychology practitioner
2. Pilot testing with 20-30 users
3. Compare results with external HIGH5 test for same users (correlation >0.7 target)
4. A/B test question phrasings for clarity

**Post-launch**:
1. Track completion rates per question (flag if <90% answer rate)
2. Monitor time-per-question (flag outliers for revision)
3. Correlate with user agreement scores (70% target)
4. Analyze patterns in "low confidence" results

### Alternatives Considered

**Alternative 1**: Purely scale-based assessment (like typical personality tests)
- **Rejected**: Less engaging, doesn't force differentiation between similar strengths
- **Trade-off**: Simpler to score but lower discriminant validity

**Alternative 2**: Free-text responses with NLP analysis
- **Rejected**: Complex implementation, requires AI for scoring, language-dependent
- **Trade-off**: Richer data but slower, error-prone, and harder to validate

**Alternative 3**: Behavioral observation tasks (interactive scenarios)
- **Rejected**: Time-intensive, difficult to standardize scoring
- **Trade-off**: High validity but impractical for 15-20 minute assessment

### Implementation Notes

- Question bank seed data will be created in `prisma/data/assessment-questions.data.ts`
- Each question includes: text, type, phase, order, domainId, optional strengthId, weight
- Questions tagged with metadata for future A/B testing
- Initial set: 60 questions (20 per phase), expandable to 80-100 later

---

## 0.2 Adaptive Assessment Algorithms

### Research Question
What algorithms effectively adapt questionnaires based on previous answers to reduce assessment time while maintaining accuracy?

### Findings

#### Scoring Approach Decision

**Decision**: Weighted accumulation with threshold-based phase transitions (simpler than full IRT)

**Why not Item Response Theory (IRT)**:
- IRT requires extensive calibration data (1000+ responses per item)
- Overkill for 60-question assessment with clear domain structure
- Implementation complexity high for marginal accuracy gains
- We have existing HIGH5 framework as ground truth

**Chosen Approach**: Domain-first weighted scoring
1. Phase 1: Accumulate domain scores from all 20 questions
2. Calculate domain percentages: `domainScore / maxPossibleScore * 100`
3. Identify top 2-3 domains (>60% threshold)
4. Phase 2: Present 30 questions focused on strengths within those domains
5. Phase 3: Final 10 questions validate and rank top 5 strengths

#### Phase 2 Question Selection Logic

**Algorithm**:

```typescript
function selectPhase2Questions(
  domainScores: Record<string, number>,
  questionBank: AssessmentQuestion[]
): AssessmentQuestion[] {
  // 1. Identify top domains
  const topDomains = getTopDomains(domainScores, threshold: 60, maxDomains: 3)
  
  // 2. Get strengths belonging to top domains
  const relevantStrengths = getStrengthsByDomains(topDomains)
  
  // 3. Filter question bank for relevant strengths
  const candidateQuestions = questionBank.filter(q => 
    q.phase === 2 && 
    q.strengthId && 
    relevantStrengths.includes(q.strengthId)
  )
  
  // 4. Stratified sampling: ensure coverage across top domains
  const questionsPerDomain = Math.floor(30 / topDomains.length)
  
  // 5. Select balanced set
  return topDomains.flatMap(domain => 
    selectTopQuestions(
      candidateQuestions.filter(q => q.domainId === domain.id),
      count: questionsPerDomain,
      criteria: 'weight' // highest discriminant questions first
    )
  )
}
```

**Edge Cases**:
- **All domains equal**: Present broader Phase 2 question set covering all domains
- **One dominant domain**: Mix 70% from dominant, 30% from runners-up to avoid tunnel vision
- **Tie-breaking**: Use question weight, then random selection

#### Confidence Calculation

**Formula**:

```typescript
function calculateConfidenceScore(
  strengthId: string,
  userAnswers: UserAnswer[],
  questions: AssessmentQuestion[]
): number {
  // 1. Get all answers related to this strength
  const relevantAnswers = userAnswers.filter(a => 
    questions.find(q => q.id === a.questionId)?.strengthId === strengthId
  )
  
  // 2. Calculate weighted average response
  const weightedScore = relevantAnswers.reduce((sum, answer) => {
    const question = questions.find(q => q.id === answer.questionId)!
    const normalizedAnswer = normalizeAnswer(answer.value, question.type)
    return sum + (normalizedAnswer * question.weight)
  }, 0)
  
  const totalWeight = relevantAnswers.reduce((sum, answer) => {
    const question = questions.find(q => q.id === answer.questionId)!
    return sum + question.weight
  }, 0)
  
  const averageScore = weightedScore / totalWeight // 0-1 range
  
  // 3. Adjust for response consistency
  const consistency = calculateConsistency(relevantAnswers) // 0-1, measures variance
  
  // 4. Adjust for sample size (more questions = higher confidence)
  const sampleSizeFactor = Math.min(relevantAnswers.length / 10, 1.0) // Cap at 10 questions
  
  // 5. Final confidence score (0-100)
  return Math.round(averageScore * consistency * sampleSizeFactor * 100)
}
```

**Confidence Thresholds**:
- 80-100: High confidence (strong clear pattern)
- 60-79: Moderate confidence (reasonable certainty)
- 40-59: Low confidence (suggest retake or peer feedback)
- <40: Very low confidence (flag for review, don't include in top 5)

#### Handling Edge Cases

**Tied Scores**:
1. Check Phase 3 ranking order (highest ranked wins)
2. If still tied, use domain diversity (prefer variety across domains)
3. If still tied, flag both for peer feedback validation

**Unclear Patterns** (No clear top 5):
1. If fewer than 5 strengths above 60% confidence threshold:
   - Show top N with confidence scores
   - Recommend peer feedback for remaining slots
   - Provide option to retake assessment

**Neutral Response Bias** (User selecting middle option >70% of time):
1. Detect pattern after 10 consecutive neutral responses
2. Show inline prompt: "Try to choose options that best reflect your preferences"
3. Flag session for potential review/retake recommendation

#### Performance Considerations

**Real-time Calculation**:
- Domain scores: Calculate incrementally after each answer (~5ms)
- Strength scores: Calculate after Phase 2 completion (~50ms for all strengths)
- Final confidence: Calculate on-demand for results page (~100ms)

**Caching Strategy**:
- Cache domain scores in session record after Phase 1
- Cache preliminary strength scores after Phase 2
- Regenerate only on answer changes (use `lastActivityAt` timestamp)

**Database Queries**:
- Batch load all questions for phase at session start
- Single upsert for each answer submission
- Aggregate queries for score calculation (use Prisma aggregations)

### Alternatives Considered

**Alternative 1**: Machine learning-based adaptive testing
- **Rejected**: Requires training data we don't have yet
- **Future consideration**: Implement once we have 1000+ completed assessments

**Alternative 2**: Computerized Adaptive Testing (CAT)
- **Rejected**: Requires pre-calibrated item difficulty parameters
- **Trade-off**: More accurate but much more complex to maintain

**Alternative 3**: Static question set (no adaptation)
- **Rejected**: Longer assessment time, lower engagement
- **Trade-off**: Simpler but misses opportunity to personalize experience

### Implementation Notes

- Score calculation in `lib/utils/assessment/score-calculator.ts`
- Adaptive logic in `lib/utils/assessment/adaptive-logic.ts`
- Confidence thresholds configurable via environment variables
- All calculations server-side for consistency

---

## 0.3 Session Persistence & Recovery Patterns

### Research Question
What are the best practices for implementing auto-save and session recovery in Next.js applications to prevent data loss?

### Findings

[TO BE COMPLETED - Research auto-save patterns, optimistic updates, and session recovery strategies for Next.js App Router]

---

## 0.4 Progress Visualization Best Practices

### Research Question
How should assessment progress and domain affinity be visualized to maintain user engagement without overwhelming them?

### Findings

[TO BE COMPLETED - Research progress indicators, domain affinity charts, and mobile-responsive visualization patterns]

---

## 0.5 AI-Powered Results Generation

### Research Question
How should Vercel AI SDK be used to generate personalized strength descriptions and development recommendations?

### Findings

[TO BE COMPLETED - Research prompt engineering, Zod schemas for structured output, and cost optimization for AI generation]

---

## Summary & Next Actions

**Completed Research**:
- ✅ 0.1 Question Design Methodology - comprehensive guidelines established
- ✅ 0.2 Adaptive Assessment Algorithms - weighted scoring approach defined

**Pending Research**:
- ⏸️ 0.3 Session Persistence & Recovery Patterns
- ⏸️ 0.4 Progress Visualization Best Practices
- ⏸️ 0.5 AI-Powered Results Generation

**Key Decisions Made**:
1. Three question types (scale, choice, ranking) used strategically across phases
2. Weighted accumulation scoring (not IRT) for balance of accuracy and simplicity
3. Confidence scores based on weighted average + consistency + sample size
4. Adaptive Phase 2 questions selected from top 2-3 domains identified in Phase 1

**Next Steps**:
1. Complete remaining research sections (0.3-0.5)
2. Proceed to Phase 1: Data Model Design
3. Create seed data for initial 60 questions based on established guidelines
