# Feature Specification: Gamification Integration for Assessment & Feedback

**Feature Branch**: `005-gamification-integration`  
**Created**: December 14, 2025  
**Status**: Draft  
**Input**: User description: "Integrar el sistema gamificado de XP y Badges con los módulos de Assessment y Peer Feedback existentes para recompensar a los usuarios por completar evaluaciones y dar/recibir feedback"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Earn XP for Completing Assessment (Priority: P1)

A user completing the strength discovery assessment wants to feel rewarded for their effort and see immediate recognition in the form of XP and a potential level-up. The assessment is a significant time investment (15-20 minutes), so the reward should be substantial.

**Why this priority**: The assessment is the foundation of the entire platform. Gamifying it increases completion rates and creates an immediate positive first experience with the gamification system.

**Independent Test**: A user can complete the full assessment and immediately see XP awarded, progress bar update, and potentially trigger a level-up notification. Delivers value by creating momentum in the gamification journey from day one.

**Acceptance Scenarios**:

1. **Given** a user starts a new assessment, **When** they complete Phase 1 (20 questions), **Then** they receive 100 XP with a visual toast notification showing "+100 XP - Fase 1 completada"
2. **Given** a user completes Phase 2 (30 questions), **When** the phase transition screen appears, **Then** they receive 150 XP and see their XP bar animate to reflect the gain
3. **Given** a user completes the entire assessment (all 3 phases), **When** they reach the results screen, **Then** they receive 250 XP bonus for full completion, totaling 500 XP for the complete assessment
4. **Given** a user completes their first-ever assessment, **When** XP is awarded, **Then** they also unlock the "Explorador Interior" badge (Bronze tier) for discovering their strengths
5. **Given** a user's XP after assessment completion crosses a level threshold, **When** they finish, **Then** they see a level-up celebration modal before viewing their results

---

### User Story 2 - Earn XP for Providing Peer Feedback (Priority: P1)

A user providing feedback to a peer wants to be recognized for taking time to help a colleague grow. Providing thoughtful feedback is a generous act that should be rewarded to encourage participation.

**Why this priority**: Feedback response rates directly impact the value of the feedback system. Gamifying feedback provision increases response rates and creates a culture of mutual support.

**Independent Test**: A user can complete a peer feedback request and immediately see XP awarded. The XP appears in their progress dashboard and contributes to their level progression.

**Acceptance Scenarios**:

1. **Given** a user receives a feedback request notification, **When** they click to view it, **Then** they see a message "¡Ayuda a tu compañero y gana 75 XP!"
2. **Given** a user answers all 5 feedback questions, **When** they submit the feedback, **Then** they receive 75 XP with a toast notification "+75 XP - Feedback enviado"
3. **Given** a user has provided feedback to 3 different teammates in a 30-day period, **When** they complete the third feedback, **Then** they unlock the "Espejo Generoso" badge (Silver tier)
4. **Given** a user declines a feedback request, **When** they click "Not Now", **Then** no XP is awarded but no penalty is applied
5. **Given** a user resumes a partially completed feedback, **When** they complete and submit it, **Then** they receive the full 75 XP (no partial rewards)

---

### User Story 3 - Earn XP for Receiving Feedback (Priority: P2)

A user who actively seeks peer feedback by requesting it from teammates should be rewarded for taking initiative in their personal development. The reward comes when feedback is actually received.

**Why this priority**: Encouraging users to seek feedback creates engagement loops. However, the requester has less control over completion, so this is secondary to providing feedback.

**Independent Test**: A user can request feedback, and when teammates complete their responses, the requester receives XP for each completed response.

**Acceptance Scenarios**:

1. **Given** a user requests feedback from 5 teammates, **When** the first teammate completes their feedback, **Then** the requester receives 25 XP with notification "¡Nuevo feedback recibido! +25 XP"
2. **Given** a user has pending feedback requests, **When** they view their dashboard, **Then** they see the potential XP they could earn: "3 respuestas pendientes = hasta 75 XP"
3. **Given** a user receives 3+ feedback responses (minimum for insights), **When** insights are generated, **Then** they receive a bonus 50 XP for "Introspección Completa"
4. **Given** a user receives feedback from 10 different people over time, **When** the 10th response is received, **Then** they unlock the "Escucha Activa" badge (Gold tier)
5. **Given** a user reviews their feedback insights and applies suggestions to their profile, **When** they click "Apply Suggestions", **Then** they receive 30 XP for "Crecimiento Consciente"

---

### User Story 4 - View Gamification Progress in Assessment/Feedback Contexts (Priority: P2)

A user navigating through assessment or feedback flows wants to see their current XP and level, reinforcing the gamification context and showing how their actions contribute to progression.

**Why this priority**: Visibility of progress drives engagement. Users need to see the connection between their actions and rewards in real-time.

**Independent Test**: A user can see their XP bar and level badge displayed during assessment and feedback flows, with real-time updates as they earn XP.

**Acceptance Scenarios**:

1. **Given** a user is on the assessment welcome screen, **When** they view the page, **Then** they see their current level badge and a preview "Completa el assessment y gana hasta 500 XP"
2. **Given** a user is answering assessment questions, **When** they complete a phase, **Then** the XP earned is shown and their progress bar updates in real-time
3. **Given** a user is viewing a feedback request they received, **When** viewing the intro screen, **Then** they see "Responder = 75 XP" clearly displayed
4. **Given** a user opens their feedback dashboard, **When** viewing pending requests, **Then** each request shows the potential XP reward
5. **Given** a user earns XP from any assessment/feedback action, **When** they later visit the Development dashboard, **Then** they see the XP reflected in their total with source attribution in history

---

### User Story 5 - Unlock Badges for Assessment & Feedback Milestones (Priority: P3)

A user achieving significant milestones in assessment and feedback activities wants to earn special badges that recognize their commitment to self-discovery and team collaboration.

**Why this priority**: Badges provide long-term goals and recognition. While not essential for MVP, they add depth to the gamification experience.

**Independent Test**: A user achieving specific milestones (first assessment, multiple feedbacks, etc.) automatically unlocks the corresponding badge with celebration UI.

**Acceptance Scenarios**:

1. **Given** a user completes their first strength assessment, **When** results are saved, **Then** they unlock "Explorador Interior" badge (Bronze, +25 XP)
2. **Given** a user provides feedback to 3 different teammates, **When** the third feedback is submitted, **Then** they unlock "Espejo Generoso" badge (Silver, +75 XP)
3. **Given** a user receives feedback from 10 different teammates, **When** the 10th response arrives, **Then** they unlock "Escucha Activa" badge (Gold, +150 XP)
4. **Given** a user retakes the assessment after receiving peer feedback, **When** results show profile adjustments, **Then** they unlock "Evolución Continua" badge (Silver, +75 XP)
5. **Given** a user unlocks a badge, **When** the badge is awarded, **Then** they see a celebration modal with the badge name, description, tier, and XP bonus

---

### Edge Cases

- What happens if a user completes an assessment but already has one completed (retake)? → Full XP for first completion, reduced XP (200 XP) for retakes
- What happens if a user provides feedback to the same person multiple times (after cooldown)? → Full XP each time (cooldown already prevents spam)
- What happens if a user starts an assessment, gains Phase 1 XP, abandons, and starts fresh? → Phase XP is awarded once per session; new session can earn again
- How does the system prevent XP farming through rapid feedback requests/responses? → 30-day cooldown per requester-respondent pair prevents abuse
- What happens if feedback response is received while user is offline? → XP queued and awarded with notification on next login
- What happens if a user provides feedback but the requester deletes their account? → Feedback provider still receives their earned XP
- How are assessment retakes handled for badge eligibility? → Retakes count for "Evolución Continua" badge but not for "Explorador Interior"
- What if there's a system error during XP award? → Transaction rollback ensures data consistency; retry mechanism attempts award 3 times

## Requirements *(mandatory)*

### Functional Requirements

**Assessment Gamification**:
- **FR-001**: System MUST award 100 XP when a user completes Phase 1 of the assessment
- **FR-002**: System MUST award 150 XP when a user completes Phase 2 of the assessment
- **FR-003**: System MUST award 250 XP completion bonus when a user finishes all phases (total 500 XP for full assessment)
- **FR-004**: System MUST display XP reward preview on the assessment welcome screen
- **FR-005**: System MUST show animated XP gain toast after each phase completion
- **FR-006**: System MUST trigger level-up notification if assessment XP crosses a level threshold
- **FR-007**: System MUST award reduced XP (200 XP total) for assessment retakes

**Feedback Provision Gamification**:
- **FR-008**: System MUST award 75 XP when a user completes and submits peer feedback
- **FR-009**: System MUST display potential XP reward on feedback request notification and intro screen
- **FR-010**: System MUST NOT award partial XP for incomplete feedback submissions
- **FR-011**: System MUST NOT penalize users who decline feedback requests

**Feedback Reception Gamification**:
- **FR-012**: System MUST award 25 XP to the requester when a teammate completes feedback for them
- **FR-013**: System MUST award 50 XP bonus when requester reaches the 3-response insights threshold
- **FR-014**: System MUST award 30 XP when a user applies feedback suggestions to their profile
- **FR-015**: System MUST show potential pending XP on feedback dashboard for outstanding requests

**Badge System Integration**:
- **FR-016**: System MUST unlock "Explorador Interior" badge (Bronze) upon first assessment completion
- **FR-017**: System MUST unlock "Espejo Generoso" badge (Silver) when user provides 3+ feedbacks in 30 days
- **FR-018**: System MUST unlock "Escucha Activa" badge (Gold) when user receives 10+ feedback responses
- **FR-019**: System MUST unlock "Evolución Continua" badge (Silver) when user retakes assessment after receiving feedback
- **FR-020**: System MUST trigger badge unlock celebration modal with badge details and XP bonus

**Cross-Module Integration**:
- **FR-021**: System MUST initialize UserGamification record for users who don't have one when they complete assessment/feedback actions
- **FR-022**: System MUST update lastActivityDate on UserGamification for streak tracking when assessment/feedback actions occur
- **FR-023**: System MUST apply streak bonuses to XP earned from assessment/feedback actions
- **FR-024**: System MUST record XP transactions with source attribution (assessment_phase, feedback_given, feedback_received)
- **FR-025**: System MUST display current level and XP bar in assessment and feedback UI contexts

### Key Entities

- **XpTransaction**: Records each XP award with source (assessment/feedback), amount, timestamp, and user reference
- **Badge (extended)**: New badges for assessment and feedback milestones added to existing badge catalog
- **UserGamification (extended)**: Existing model used to track XP, level, and badges across all gamified activities
- **AssessmentSession (extended)**: Add xpAwarded field to track XP given for each session
- **FeedbackRequest (extended)**: Add xpAwardedToRequester field to track XP given when feedback is received
- **FeedbackResponse (extended)**: Add xpAwardedToProvider field to track XP given when feedback is submitted

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Assessment completion rate increases by 15% after gamification integration (baseline: pre-integration rate)
- **SC-002**: Feedback response rate increases from 60% to 75% within 3 months of integration
- **SC-003**: Users complete feedback requests 20% faster when XP reward is displayed
- **SC-004**: 90% of users who complete their first assessment earn at least one badge
- **SC-005**: Average user reaches Level 2 within their first week of active platform use
- **SC-006**: Users who see XP previews are 25% more likely to complete the action than control group
- **SC-007**: System awards XP within 2 seconds of action completion for seamless experience
- **SC-008**: Zero duplicate XP awards for the same action (idempotency requirement)
- **SC-009**: Users can track XP history with source attribution for all assessment/feedback activities
- **SC-010**: 80% of users report that gamification makes assessment/feedback "more engaging" in feedback surveys

## Assumptions

- The gamification system from Feature 004 (Development Pathways) is fully implemented and operational
- UserGamification model exists and tracks xpTotal, currentLevel, lastActivityDate, and badges
- Badge and UserBadge models exist with unlock criteria support
- XP transaction logging is available for audit and history
- Level-up notifications and badge unlock modals are reusable from Feature 004
- Assessment and Feedback features are implemented per specs 001-peer-feedback and 002-strength-quiz
- Toast notification system is available for XP gain feedback
- Streak calculation respects 48-hour timeout across all gamified activities
