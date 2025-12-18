// Score Calculator exports
export {
	normalizeAnswer,
	calculateDomainScores,
	calculateStrengthScores,
	calculateConfidenceScore,
	calculateFinalResults,
} from "./score-calculator";
export type {
	QuestionData,
	AnswerData,
	DomainInfo,
	StrengthInfo,
} from "./score-calculator";

// Adaptive Logic exports (uses different type names internally)
export {
	getTopDomains,
	selectPhase2Questions,
	handleEdgeCases,
	detectNeutralBias,
} from "./adaptive-logic";
