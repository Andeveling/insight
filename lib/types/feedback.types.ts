/**
 * Peer Feedback System Types
 * TypeScript interfaces for the 360° peer feedback feature
 */

// ============================================================
// Enums (mirror Prisma enums)
// ============================================================

export type FeedbackRequestStatus =
	| "PENDING"
	| "COMPLETED"
	| "DECLINED"
	| "EXPIRED";

export type StrengthAdjustmentStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// ============================================================
// Core Entities
// ============================================================

/**
 * Represents a feedback request from one user to another
 */
export interface FeedbackRequest {
	id: string;
	requesterId: string;
	respondentId: string;
	status: FeedbackRequestStatus;
	isAnonymous: boolean;
	sentAt: Date;
	completedAt: Date | null;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Extended feedback request with user details for display
 */
export interface FeedbackRequestWithUsers extends FeedbackRequest {
	requester: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	respondent: {
		id: string;
		name: string;
		email: string;
		image: string | null;
	};
	responses?: FeedbackResponse[];
}

/**
 * Behavioral question for peer feedback (5 questions total)
 */
export interface FeedbackQuestion {
	id: string;
	text: string;
	answerType: "scale" | "behavioral_choice";
	answerOptions: AnswerOption[];
	strengthMapping: StrengthMapping;
	order: number;
}

/**
 * Answer option for a feedback question
 */
export interface AnswerOption {
	id: string;
	text: string;
	order: number;
}

/**
 * Mapping of answer options to strength weights
 * Structure: { "optionId": { "strengthId": weight } }
 */
export interface StrengthMapping {
	[optionId: string]: {
		[strengthId: string]: number;
	};
}

/**
 * Individual response to a feedback question
 */
export interface FeedbackResponse {
	id: string;
	requestId: string;
	questionId: string;
	answer: string; // JSON: selected option ID(s)
	anonymousHash: string | null;
	createdAt: Date;
}

/**
 * Aggregated feedback insights for a user
 */
export interface FeedbackSummary {
	id: string;
	userId: string;
	totalResponses: number;
	lastResponseAt: Date | null;
	strengthAdjustments: StrengthAdjustmentMap;
	insights: string | null;
	insightsGeneratedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Map of strength adjustments by strength ID
 */
export interface StrengthAdjustmentMap {
	[strengthId: string]: {
		delta: number; // -1.0 to +1.0
		confidence: number; // 0.0 to 1.0
		responseCount: number;
	};
}

/**
 * Proposed strength profile adjustment
 */
export interface StrengthAdjustment {
	id: string;
	userId: string;
	strengthId: string;
	suggestedDelta: number;
	supportingData: SupportingData;
	status: StrengthAdjustmentStatus;
	createdAt: Date;
	processedAt: Date | null;
}

/**
 * Supporting evidence for a strength adjustment
 */
export interface SupportingData {
	responseCount: number;
	averagePeerConfidence: number;
	selfConfidence: number;
	agreementLevel: "strong" | "moderate" | "weak";
	sampleResponses: string[];
}

// ============================================================
// Form & Request Types
// ============================================================

/**
 * Input for creating a feedback request
 */
export interface CreateFeedbackRequestInput {
	respondentIds: string[];
	isAnonymous: boolean;
}

/**
 * Validation result for feedback request
 */
export interface FeedbackRequestValidation {
	valid: boolean;
	errors: string[];
	warnings: string[];
	cooldownViolations: Array<{
		respondentId: string;
		remainingDays: number;
	}>;
}

/**
 * Input for submitting feedback responses
 */
export interface SubmitFeedbackInput {
	requestId: string;
	responses: Array<{
		questionId: string;
		selectedOptionId: string;
	}>;
}

/**
 * Partial progress for feedback (saved to localStorage)
 */
export interface FeedbackDraft {
	requestId: string;
	responses: Array<{
		questionId: string;
		selectedOptionId: string;
	}>;
	lastUpdated: string; // ISO date string
}

// ============================================================
// Insight & Analysis Types
// ============================================================

/**
 * Input for generating insights
 */
export interface InsightGenerationInput {
	userStrengths: Array<{
		strengthId: string;
		strengthName: string;
		selfConfidence: number;
	}>;
	peerFeedback: Array<{
		strengthId: string;
		strengthName: string;
		peerConfidence: number;
		responseCount: number;
	}>;
	userName: string;
}

/**
 * Generated insight summary
 */
export interface InsightSummary {
	overallPattern: string;
	blindSpots: BlindSpot[];
	recommendations: string[];
	generatedAt: Date;
	generationMethod: "ai" | "rule-based";
}

/**
 * Identified blind spot in self-assessment
 */
export interface BlindSpot {
	strengthId: string;
	strengthName: string;
	type: "hidden_talent" | "overestimated";
	selfConfidence: number;
	peerConfidence: number;
	delta: number;
}

/**
 * Strength score calculated from peer feedback
 */
export interface StrengthScore {
	strengthId: string;
	strengthName: string;
	totalScore: number;
	confidence: number;
	contributingQuestions: number;
	responseCount: number;
}

/**
 * Question response for strength mapping
 */
export interface QuestionResponse {
	questionId: string;
	selectedOption: string;
	strengthWeights: {
		[strengthId: string]: number;
	};
}

// ============================================================
// Dashboard & Display Types
// ============================================================

/**
 * Feedback dashboard summary for current user
 */
export interface FeedbackDashboardData {
	pendingRequestsReceived: FeedbackRequestWithUsers[];
	pendingRequestsSent: FeedbackRequestWithUsers[];
	completedRequestsReceived: number;
	completedRequestsSent: number;
	totalResponsesReceived: number;
	hasNewInsights: boolean;
	lastInsightDate: Date | null;
}

/**
 * Feedback history entry for timeline display
 */
export interface FeedbackHistoryEntry {
	id: string;
	cycleDate: Date;
	responseCount: number;
	insightsSummary: string | null;
	topStrengthChanges: Array<{
		strengthName: string;
		delta: number;
		direction: "up" | "down" | "stable";
	}>;
}

/**
 * Trend data for strength perception over time
 */
export interface StrengthTrendData {
	strengthId: string;
	strengthName: string;
	dataPoints: Array<{
		date: Date;
		selfConfidence: number;
		peerConfidence: number;
	}>;
	variance: number;
	trend: "stable" | "increasing" | "decreasing" | "volatile";
}

// ============================================================
// Notification Types
// ============================================================

/**
 * Feedback notification payload
 */
export interface FeedbackNotification {
	type:
		| "feedback_request"
		| "feedback_completed"
		| "insights_ready"
		| "request_declined";
	recipientId: string;
	recipientEmail: string;
	recipientName: string;
	data: FeedbackNotificationData;
}

/**
 * Data payload for feedback notifications
 */
export interface FeedbackNotificationData {
	requesterName?: string;
	respondentName?: string;
	requestId?: string;
	isAnonymous?: boolean;
	responseCount?: number;
	feedbackUrl?: string;
}
