"use client";

/**
 * QuestionCard Component
 * Renders scale/choice/ranking questions with validation
 * Includes auto-save integration for pause/resume functionality
 */

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type {
	AnswerValue,
	AssessmentQuestion,
	ScaleRange,
} from "@/lib/types/assessment.types";
import { useAutoSave } from "../_hooks/use-auto-save";

export interface QuestionCardProps {
	question: AssessmentQuestion;
	onAnswer: (answer: AnswerValue) => void;
	currentStep: number;
	totalSteps: number;
	phase: 1 | 2 | 3;
	isLoading?: boolean;
	savedAnswer?: AnswerValue;
	/**
	 * Session ID for auto-save functionality
	 */
	sessionId?: string;
	/**
	 * Enable auto-save on answer change (default: true if sessionId provided)
	 */
	enableAutoSave?: boolean;
}

/** Default labels as fallback if scaleRange is not provided */
const DEFAULT_SCALE_LABELS = [
	"Totalmente en desacuerdo",
	"En desacuerdo",
	"Neutral",
	"De acuerdo",
	"Totalmente de acuerdo",
];

export default function QuestionCard({
	question,
	onAnswer,
	currentStep,
	totalSteps,
	phase,
	isLoading = false,
	savedAnswer,
	sessionId,
	enableAutoSave = true,
}: QuestionCardProps) {
	const [selectedValue, setSelectedValue] = useState<AnswerValue | null>(
		savedAnswer ?? null,
	);
	const [rankingOrder, setRankingOrder] = useState<string[]>(
		Array.isArray(savedAnswer) ? savedAnswer : [],
	);

	// Auto-save hook
	const { triggerAutoSave } = useAutoSave({
		onSaveSuccess: () => {
			console.log("[QuestionCard] Auto-save successful");
		},
		onSaveError: (error) => {
			console.error("[QuestionCard] Auto-save failed:", error);
		},
	});

	// Trigger auto-save when answer changes
	const handleAutoSave = useCallback(
		(value: AnswerValue) => {
			if (sessionId && enableAutoSave && value !== null) {
				triggerAutoSave(sessionId, question.id, value);
			}
		},
		[sessionId, enableAutoSave, question.id, triggerAutoSave],
	);

	const handleScaleSelect = (value: number) => {
		setSelectedValue(value);
		handleAutoSave(value);
	};

	const handleChoiceSelect = (option: string) => {
		setSelectedValue(option);
		handleAutoSave(option);
	};

	const handleRankingChange = (option: string, direction: "up" | "down") => {
		const currentIndex = rankingOrder.indexOf(option);
		if (currentIndex === -1) return;

		const newOrder = [...rankingOrder];
		const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (swapIndex >= 0 && swapIndex < newOrder.length) {
			[newOrder[currentIndex], newOrder[swapIndex]] = [
				newOrder[swapIndex],
				newOrder[currentIndex],
			];
			setRankingOrder(newOrder);
			setSelectedValue(newOrder);
			handleAutoSave(newOrder);
		}
	};

	const initializeRanking = () => {
		if (rankingOrder.length === 0 && question.options) {
			const initialOrder = [...question.options];
			setRankingOrder(initialOrder);
			setSelectedValue(initialOrder);
		}
	};

	const handleSubmit = () => {
		if (selectedValue !== null && !isLoading) {
			onAnswer(selectedValue);
		}
	};

	const isAnswerValid =
		selectedValue !== null &&
		(question.type !== "RANKING" ||
			(Array.isArray(selectedValue) &&
				selectedValue.length === (question.options?.length ?? 0)));

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			{/* Question card */}
			<Card className="shadow-lg" role="form" aria-labelledby="question-text">
				<CardHeader className="pb-4">
					<h2
						id="question-text"
						className="text-base font-medium leading-relaxed sm:text-xl text-center"
					>
						{question.text}
					</h2>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Pregunta tipo escala */}
					{question.type === "SCALE" && (
						<ScaleInput
							value={typeof selectedValue === "number" ? selectedValue : null}
							onSelect={handleScaleSelect}
							disabled={isLoading}
							scaleRange={question.scaleRange}
						/>
					)}

					{/* Pregunta de opción */}
					{question.type === "CHOICE" && question.options && (
						<ChoiceInput
							options={question.options}
							value={typeof selectedValue === "string" ? selectedValue : null}
							onSelect={handleChoiceSelect}
							disabled={isLoading}
						/>
					)}

					{/* Pregunta de ranking */}
					{question.type === "RANKING" && question.options && (
						<RankingInput
							options={question.options}
							order={rankingOrder}
							onOrderChange={handleRankingChange}
							onInitialize={initializeRanking}
							disabled={isLoading}
						/>
					)}

					{/* Botón de enviar */}
					<div className="flex justify-end pt-4">
						<Button
							onClick={handleSubmit}
							disabled={!isAnswerValid || isLoading}
							size="lg"
						>
							{isLoading ? "Guardando..." : "Siguiente"}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Sugerencia de teclado */}
			<p className="text-muted-foreground text-center text-sm">
				{question.type === "SCALE" &&
					"Presiona 1-5 para seleccionar, Enter para continuar"}
				{question.type === "CHOICE" &&
					"Haz clic en una opción para seleccionar"}
				{question.type === "RANKING" && "Arrastra o usa flechas para reordenar"}
			</p>
		</div>
	);
}

// Componente de escala con soporte de accesibilidad
interface ScaleInputProps {
	value: number | null;
	onSelect: (value: number) => void;
	disabled?: boolean;
	scaleRange?: ScaleRange;
}

function ScaleInput({
	value,
	onSelect,
	disabled,
	scaleRange,
}: ScaleInputProps) {
	// Use dynamic labels from scaleRange or fallback to defaults
	const labels = scaleRange?.labels ?? DEFAULT_SCALE_LABELS;
	const min = scaleRange?.min ?? 1;
	const max = scaleRange?.max ?? 5;

	// Generate scale items with dynamic labels
	const scaleItems = Array.from({ length: max - min + 1 }, (_, i) => ({
		value: min + i,
		label: labels[i] ?? `${min + i}`,
	}));

	// Keyboard navigation support
	const handleKeyDown = (event: React.KeyboardEvent) => {
		const key = event.key;
		const numKey = parseInt(key, 10);
		if (numKey >= min && numKey <= max) {
			event.preventDefault();
			onSelect(numKey);
		}
	};

	// Get extreme labels for aria description
	const firstLabel = labels[0] ?? "Mínimo";
	const lastLabel = labels[labels.length - 1] ?? "Máximo";

	return (
		<div
			className="space-y-3"
			role="radiogroup"
			aria-label={`Califica del ${min} (${firstLabel}) al ${max} (${lastLabel})`}
			onKeyDown={handleKeyDown}
		>
			<div className="flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:justify-between sm:gap-3">
				{scaleItems.map((item) => (
					<button
						key={item.value}
						type="button"
						role="radio"
						aria-checked={value === item.value}
						aria-label={`${item.value}: ${item.label}`}
						onClick={() => onSelect(item.value)}
						disabled={disabled}
						className={cn(
							"flex min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 transition-all sm:min-w-20 sm:p-4",
							"hover:border-primary hover:bg-primary/5",
							"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
							value === item.value
								? "border-primary bg-primary text-primary-foreground"
								: "border-muted bg-background",
						)}
					>
						<span className="text-lg font-bold sm:text-xl">{item.value}</span>
						<span
							className={cn(
								"text-center text-[10px] leading-tight sm:text-xs",
								value === item.value
									? "text-primary-foreground"
									: "text-muted-foreground",
							)}
						>
							{item.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

// Componente de opción única con soporte de accesibilidad
interface ChoiceInputProps {
	options: string[];
	value: string | null;
	onSelect: (option: string) => void;
	disabled?: boolean;
}

function ChoiceInput({ options, value, onSelect, disabled }: ChoiceInputProps) {
	return (
		<div
			className="space-y-2"
			role="radiogroup"
			aria-label="Selecciona una opción"
		>
			{options.map((option, index) => (
				<button
					key={option}
					type="button"
					role="radio"
					aria-checked={value === option}
					onClick={() => onSelect(option)}
					disabled={disabled}
					className={cn(
						"w-full rounded-lg border-2 p-3 text-left text-sm transition-all sm:p-4 sm:text-base",
						"hover:border-primary hover:bg-primary/5",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						value === option ? "border-primary bg-primary/10" : "border-muted",
					)}
				>
					<span className="mr-2 text-muted-foreground">
						{String.fromCharCode(65 + index)}.
					</span>
					{option}
				</button>
			))}
		</div>
	);
}

// Componente de ranking con soporte de accesibilidad
interface RankingInputProps {
	options: string[];
	order: string[];
	onOrderChange: (option: string, direction: "up" | "down") => void;
	onInitialize: () => void;
	disabled?: boolean;
}

function RankingInput({
	order,
	onOrderChange,
	onInitialize,
	disabled,
}: RankingInputProps) {
	// Initialize order if empty
	if (order.length === 0) {
		onInitialize();
		return null;
	}

	return (
		<div
			className="space-y-2"
			role="listbox"
			aria-label="Ordena los ítems de más a menos importante"
		>
			<p className="text-muted-foreground mb-4 text-sm">
				Ordena de más a menos importante (1 = más importante)
			</p>
			{order.map((option, index) => (
				<div
					key={option}
					role="option"
					aria-selected={true}
					aria-label={`Rank ${index + 1}: ${option}`}
					className={cn(
						"flex items-center gap-2 rounded-lg border-2 p-2 transition-all sm:gap-3 sm:p-3",
						"border-muted bg-background",
					)}
				>
					<span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm">
						{index + 1}
					</span>
					<span className="flex-1 text-sm sm:text-base">{option}</span>
					<div className="flex gap-1">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onOrderChange(option, "up")}
							disabled={disabled || index === 0}
							aria-label={`Mover ${option} hacia arriba`}
							className="h-8 w-8 p-0"
						>
							↑
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onOrderChange(option, "down")}
							disabled={disabled || index === order.length - 1}
							aria-label={`Mover ${option} hacia abajo`}
							className="h-8 w-8 p-0"
						>
							↓
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
