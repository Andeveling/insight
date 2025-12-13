# Feature Specification: Progressive Strength Discovery Quiz

**Feature Branch**: `001-strength-quiz`  
**Created**: December 12, 2025  
**Status**: Draft  
**Input**: User description: "Build an internal domain-based progressive questionnaire that guides users through discovering their top 5 strengths organically. Users should be able to pause and resume the assessment at any time to avoid fatigue and rushed responses."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Fresh Assessment (Priority: P1)

A new user wants to discover their top 5 strengths without taking an external test. They start the assessment, complete all questions, and receive their personalized strength profile.

**Why this priority**: This is the core value proposition - enabling users to independently discover their strengths without external dependencies. Without this, the feature has no purpose.

**Independent Test**: A user can start a new assessment, answer all questions across all phases, and receive a complete strength profile with confidence scores. This delivers immediate standalone value.

**Acceptance Scenarios**:

1. **Given** a user with no existing assessment, **When** they navigate to "Discover Your Strengths", **Then** they see a welcome screen showing estimated completion time (15-20 minutes) and phase overview
2. **Given** a user on the welcome screen, **When** they click "Start Assessment", **Then** Phase 1 begins with the first domain discovery question and progress indicator shows "Question 1 of 60"
3. **Given** a user completing Phase 1 (20 questions), **When** they answer the final Phase 1 question, **Then** they see their preliminary domain affinity visualization and Phase 2 begins automatically
4. **Given** a user completing Phase 2 (30 questions), **When** they answer the final Phase 2 question, **Then** they see their top 5 preliminary strengths and Phase 3 begins for ranking confirmation
5. **Given** a user completing Phase 3 (10 questions), **When** they submit their final answer, **Then** they receive their complete strength profile with confidence scores and can save it to their profile

---

### User Story 2 - Pause and Resume Assessment (Priority: P1)

A user starts the assessment but needs to stop midway due to time constraints or fatigue. They want to save their progress and continue later from where they left off.

**Why this priority**: Preventing user fatigue and rushed responses is critical for accurate results. Without this, completion rates will suffer and response quality will decline.

**Independent Test**: A user can start an assessment, answer 15 questions, close the browser, return hours later, and resume from question 16 with all previous answers preserved. This ensures data integrity and user flexibility.

**Acceptance Scenarios**:

1. **Given** a user in the middle of an assessment (e.g., question 15 of 60), **When** they click "Save & Exit", **Then** their progress is saved and they see a confirmation "Your progress has been saved. You can resume anytime."
2. **Given** a user with a saved in-progress assessment, **When** they navigate to "Discover Your Strengths", **Then** they see a "Continue Assessment" option showing their progress percentage (e.g., "25% complete - Resume from Phase 1")
3. **Given** a user clicking "Continue Assessment", **When** the assessment loads, **Then** they resume at the exact question where they left off with all previous answers intact
4. **Given** a user who closes the browser during an assessment without explicitly saving, **When** they return and navigate to the assessment, **Then** their progress is automatically recovered (auto-save functionality)
5. **Given** a user with a paused assessment for 7+ days, **When** they return, **Then** they see a notification "Would you like to continue your assessment or start fresh?" with both options available

---

### User Story 3 - View Progress and Domain Affinity (Priority: P2)

During the assessment, a user wants to see their progress and understand how their responses are shaping their emerging strength profile.

**Why this priority**: Real-time feedback increases engagement and helps users understand the assessment logic, but the assessment can function without this visualization.

**Independent Test**: A user can see a visual progress bar and domain affinity bars that update after each answer, providing transparency into the assessment process.

**Acceptance Scenarios**:

1. **Given** a user on any question, **When** they view the screen, **Then** they see a progress indicator showing current question number, total questions, and percentage complete (e.g., "Question 15 of 60 - 25% complete")
2. **Given** a user completing Phase 1 questions, **When** they answer questions related to different domains, **Then** they see domain affinity bars updating in real-time showing their emerging pattern (e.g., "Thinking: 75%, Doing: 60%, Motivating: 45%, Relating: 40%")
3. **Given** a user at the end of Phase 1, **When** Phase 1 completes, **Then** they see a summary screen "Your Domain Profile" with a visualization of their top 2-3 domains and a brief explanation before Phase 2 begins
4. **Given** a user viewing their domain profile, **When** they review the visualization, **Then** they understand which domains are strongest without seeing specific strength names yet

---

### User Story 4 - Adaptive Question Selection (Priority: P2)

The assessment intelligently adapts questions based on previous answers to efficiently narrow down the user's top strengths.

**Why this priority**: Adaptive logic improves accuracy and reduces assessment time, but a static question set would still provide value.

**Independent Test**: Two users with different response patterns receive different questions in Phase 2, demonstrating that the system adapts to individual responses.

**Acceptance Scenarios**:

1. **Given** a user showing strong affinity for "Thinking" and "Relating" domains in Phase 1, **When** Phase 2 begins, **Then** they receive questions focused on strengths within those two domains (e.g., Strategist, Analyst, Empathizer, Coach)
2. **Given** a user showing balanced scores across all domains in Phase 1, **When** Phase 2 begins, **Then** they receive a broader range of questions to help differentiate their top domains
3. **Given** a user in Phase 2, **When** their answers consistently indicate a specific strength, **Then** subsequent questions become more nuanced to assess the confidence level for that strength
4. **Given** a user completing Phase 2, **When** the AI calculates preliminary results, **Then** Phase 3 presents ranking questions that help validate and order the top 5 identified strengths

---

### User Story 5 - Review and Understand Results (Priority: P1)

After completing the assessment, a user wants to understand their results, see confidence levels, and have the option to save the profile or retake the assessment.

**Why this priority**: Results presentation is the culmination of the assessment experience. Without clear results, the entire assessment loses value.

**Independent Test**: A user completing the assessment can view a comprehensive results page with their top 5 strengths, confidence scores, descriptions, and actionable next steps.

**Acceptance Scenarios**:

1. **Given** a user completing all assessment phases, **When** results are generated, **Then** they see their top 5 strengths ranked in order with confidence scores (0-100) for each
2. **Given** a user viewing results, **When** they click on any strength, **Then** they see a detailed description, real-world examples, and how this strength manifests in daily work
3. **Given** a user with results showing low confidence scores (below 60), **When** they view results, **Then** they see a recommendation "Some results have lower confidence. Consider retaking the assessment or requesting peer feedback for more accurate results."
4. **Given** a user satisfied with results, **When** they click "Save to Profile", **Then** their strength profile is updated and they're redirected to their dashboard showing the new strengths
5. **Given** a user unsure about results, **When** they click "Retake Assessment", **Then** they're asked to confirm (previous results will be archived) and can start a fresh assessment

---

### Edge Cases

- What happens when a user starts multiple assessment sessions without completing them? → System shows the most recent in-progress session and archives older ones after 30 days
- How does the system handle a user who consistently chooses neutral answers? → After 10 consecutive neutral responses, system prompts "Try to choose answers that best reflect your preferences, even if slightly. This helps us provide accurate results."
- What happens if a user clicks browser back/forward during assessment? → System detects navigation and prompts "Are you sure you want to leave? Your progress is auto-saved." and allows seamless return
- How does the system handle technical failures during assessment? → All answers are auto-saved after each submission; if session expires, user can resume from last saved question
- What if two strengths have identical confidence scores? → System uses secondary metrics (domain balance, response consistency) to break ties; if still tied, both are flagged for peer feedback validation
- What happens if a user's results don't clearly show 5 distinct strengths? → System provides as many confident results as possible (minimum 3) and recommends peer feedback or retaking assessment for remaining slots

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present questions in three distinct phases: Phase 1 (Domain Discovery - 20 questions), Phase 2 (Strength Refinement - 30 questions), Phase 3 (Ranking Confirmation - 10 questions)
- **FR-002**: System MUST link each question to at least one domain and optionally to specific strengths for scoring purposes
- **FR-003**: System MUST support three question types: scale (1-5 rating), choice (select one option), and ranking (order multiple options)
- **FR-004**: System MUST auto-save user responses after each question submission to prevent data loss
- **FR-005**: System MUST allow users to pause an assessment and resume from the exact question where they left off
- **FR-006**: System MUST maintain assessment session state including current phase, current step, and all previous answers
- **FR-007**: System MUST calculate real-time domain affinity scores based on weighted answers throughout the assessment
- **FR-008**: System MUST adapt Phase 2 questions based on Phase 1 domain affinity results
- **FR-009**: System MUST calculate confidence scores (0-100) for each identified strength based on response consistency and question weights
- **FR-010**: System MUST identify and rank the top 5 strengths for each user upon assessment completion
- **FR-011**: System MUST display progress indicators showing current question number, total questions, and percentage complete
- **FR-012**: System MUST provide a visual domain affinity display during and after Phase 1
- **FR-013**: System MUST archive incomplete assessment sessions after 30 days of inactivity
- **FR-014**: System MUST allow users to retake the assessment, archiving previous results
- **FR-015**: System MUST validate that each question is answered before allowing progression to the next question
- **FR-016**: System MUST handle session recovery if user closes browser or loses connection during assessment
- **FR-017**: System MUST flag results with confidence scores below 60 as "low confidence" and suggest validation options
- **FR-018**: System MUST provide detailed descriptions and examples for each strength in the results view
- **FR-019**: System MUST allow users to save their assessment results to their user profile
- **FR-020**: System MUST track completion timestamps and completion rate for analytics purposes

### Key Entities

- **AssessmentQuestion**: Represents individual questions in the assessment, including question text, type (scale/choice/ranking), associated domain, optional strength indicator, importance weight, and display order
- **UserAssessmentAnswer**: Records individual user responses including the user, question, serialized answer data, self-reported confidence level, and timestamp
- **AssessmentSession**: Tracks the state of a user's assessment journey including user, current status (in_progress/completed/abandoned), current step number, preliminary results, completion timestamp, and creation date
- **Domain**: Represents the four core domains (Thinking, Doing, Motivating, Relating) that group related strengths
- **Strength**: Represents the 20 possible strengths that users can be matched with, each belonging to a specific domain
- **UserProfile**: User's saved strength profile containing their top 5 strengths with confidence scores (existing entity, updated by this feature)

### Assumptions

- The system uses the existing 4 domains and 20 strengths from the HIGH5 framework
- Question bank will be created by domain experts using positive psychology principles
- Users can only have one active assessment session at a time
- Assessment can be completed on any device with session continuity across devices
- Minimum recommended time per question is 10 seconds to ensure thoughtful responses
- Results are saved to user profile only upon explicit user confirmation
- Assessment data is retained for analytics but individual responses remain private
- The AI/algorithm for calculating strength matches uses a deterministic weighted scoring system
- Peer feedback system (mentioned in results recommendations) exists or will exist as a separate feature

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can discover their complete strength profile without external test dependency
- **SC-002**: 80% or more of users who start an assessment complete it within 7 days of starting
- **SC-003**: Average assessment completion time is 20 minutes or less for users completing in one session
- **SC-004**: Users who pause and resume an assessment can continue from their exact stopping point with 100% answer preservation
- **SC-005**: 70% or more of users report agreement with their top 5 suggested strengths (measured via optional post-assessment survey)
- **SC-006**: Assessment sessions recover successfully from browser closures or connection losses 95% of the time
- **SC-007**: Users can view real-time progress and domain affinity visualization throughout the assessment
- **SC-008**: System provides results with confidence scores for all 5 strengths within 5 seconds of final answer submission
- **SC-009**: Users who receive low-confidence results (below 60) are presented with actionable next steps
- **SC-010**: Assessment completion rate for paused sessions is at least 60% (users who pause do eventually complete)
