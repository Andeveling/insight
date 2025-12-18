"use client";

/**
 * Hook: useQuestionNavigation
 * Handles question navigation, answer validation, and keyboard shortcuts
 */

import { useState, useCallback, useMemo, useRef } from "react";
import type {
	AssessmentQuestion,
	AnswerValue,
	QuestionType,
} from "@/lib/types/assessment.types";

export interface UseQuestionNavigationOptions {
	currentQuestion: AssessmentQuestion | null;
	onSubmit: (answer: AnswerValue, confidence?: number) => Promise<void>;
	isLoading?: boolean;
}

export interface UseQuestionNavigationResult {
	// Current answer state
	answer: AnswerValue | null;
	confidence: number;
	setAnswer: (value: AnswerValue) => void;
	setConfidence: (value: number) => void;

	// Validation
	isValid: boolean;
	validationError: string | null;
	validate: () => boolean;

	// Actions
	submit: () => Promise<void>;
	clear: () => void;

	// Question helpers
	questionType: QuestionType;
	options: string[];
	isScale: boolean;
	isChoice: boolean;
	isRanking: boolean;

	// Keyboard navigation
	handleKeyDown: (event: React.KeyboardEvent) => void;
}

export function useQuestionNavigation({
	currentQuestion,
	onSubmit,
	isLoading = false,
}: UseQuestionNavigationOptions): UseQuestionNavigationResult {
	// State
	const [answer, setAnswerState] = useState<AnswerValue | null>(null);
	const [confidence, setConfidence] = useState<number>(3); // Default: neutral
	const [validationError, setValidationError] = useState<string | null>(null);

	// Derived question properties
	const questionType = currentQuestion?.type ?? "SCALE";
	const options = useMemo(
		() => currentQuestion?.options ?? [],
		[currentQuestion?.options],
	);
	const isScale = questionType === "SCALE";
	const isChoice = questionType === "CHOICE";
	const isRanking = questionType === "RANKING";

	// Track previous question ID to reset state on change
	const prevQuestionIdRef = useRef<string | undefined>(currentQuestion?.id);

	// Reset state when question changes (using ref comparison instead of useEffect)
	if (prevQuestionIdRef.current !== currentQuestion?.id) {
		prevQuestionIdRef.current = currentQuestion?.id;
		// State will be reset on next render cycle via initial values
		// We use the key pattern in the parent component for clean resets
	}

	// Set answer with type checking
	const setAnswer = useCallback(
		(value: AnswerValue) => {
			setValidationError(null);

			// Validate based on question type
			if (isScale && typeof value === "number") {
				if (value < 1 || value > 5) {
					setValidationError("Value must be between 1 and 5");
					return;
				}
			}

			if (isChoice && typeof value === "string") {
				if (!options.includes(value)) {
					setValidationError("Invalid option selected");
					return;
				}
			}

			if (isRanking && Array.isArray(value)) {
				if (value.length !== options.length) {
					setValidationError("Please rank all options");
					return;
				}
			}

			setAnswerState(value);
		},
		[isScale, isChoice, isRanking, options],
	);

	// Validation
	const validate = useCallback((): boolean => {
		if (!currentQuestion) {
			setValidationError("No question to validate");
			return false;
		}

		if (answer === null) {
			setValidationError("Please provide an answer");
			return false;
		}

		// Type-specific validation
		if (isScale) {
			if (typeof answer !== "number" || answer < 1 || answer > 5) {
				setValidationError("Please select a value between 1 and 5");
				return false;
			}
		}

		if (isChoice) {
			if (typeof answer !== "string" || answer.trim() === "") {
				setValidationError("Please select an option");
				return false;
			}
		}

		if (isRanking) {
			if (!Array.isArray(answer) || answer.length !== options.length) {
				setValidationError("Please rank all options");
				return false;
			}
		}

		setValidationError(null);
		return true;
	}, [currentQuestion, answer, isScale, isChoice, isRanking, options.length]);

	const isValid = useMemo(() => {
		if (answer === null) return false;
		if (isScale)
			return typeof answer === "number" && answer >= 1 && answer <= 5;
		if (isChoice) return typeof answer === "string" && answer.trim() !== "";
		if (isRanking)
			return Array.isArray(answer) && answer.length === options.length;
		return false;
	}, [answer, isScale, isChoice, isRanking, options.length]);

	// Submit answer
	const submit = useCallback(async () => {
		if (isLoading || !isValid || answer === null) return;

		if (!validate()) return;

		await onSubmit(answer, confidence);
	}, [isLoading, isValid, answer, validate, onSubmit, confidence]);

	// Clear current answer
	const clear = useCallback(() => {
		setAnswerState(null);
		setConfidence(3);
		setValidationError(null);
	}, []);

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (isLoading) return;

			// Enter to submit
			if (event.key === "Enter" && isValid) {
				event.preventDefault();
				submit();
				return;
			}

			// Number keys for scale answers
			if (isScale && /^[1-5]$/.test(event.key)) {
				event.preventDefault();
				setAnswer(parseInt(event.key, 10));
				return;
			}

			// Arrow keys for scale increment/decrement
			if (isScale && typeof answer === "number") {
				if (event.key === "ArrowRight" || event.key === "ArrowUp") {
					event.preventDefault();
					const newValue = Math.min(5, answer + 1);
					setAnswer(newValue);
					return;
				}
				if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
					event.preventDefault();
					const newValue = Math.max(1, answer - 1);
					setAnswer(newValue);
					return;
				}
			}

			// Escape to clear
			if (event.key === "Escape") {
				event.preventDefault();
				clear();
				return;
			}
		},
		[isLoading, isValid, submit, isScale, answer, setAnswer, clear],
	);

	return {
		answer,
		confidence,
		setAnswer,
		setConfidence,
		isValid,
		validationError,
		validate,
		submit,
		clear,
		questionType,
		options,
		isScale,
		isChoice,
		isRanking,
		handleKeyDown,
	};
}
