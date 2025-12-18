// Score Calculator exports

// Adaptive Logic exports (uses different type names internally)
export {
	detectNeutralBias,
	getTopDomains,
	handleEdgeCases,
	selectPhase2Questions,
} from "./adaptive-logic";
export type {
	AnswerData,
	DomainInfo,
	QuestionData,
	StrengthInfo,
} from "./score-calculator";
export {
	calculateConfidenceScore,
	calculateDomainScores,
	calculateFinalResults,
	calculateStrengthScores,
	normalizeAnswer,
} from "./score-calculator";
