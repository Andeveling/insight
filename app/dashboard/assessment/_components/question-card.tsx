"use client";

/**
 * QuestionCard Component
 * Renders scale/choice/ranking questions with validation
 * Includes auto-save integration for pause/resume functionality
 */

import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type {
	AnswerValue,
	AssessmentQuestion,
	PhaseTransitionResult,
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

	// Phase-based accent colors
	const accentColor =
		phase === 1 ? "chart-2" : phase === 2 ? "primary" : "chart-5";

	const borderGradient =
		phase === 1
			? "from-chart-2/50 to-chart-2/10"
			: phase === 2
				? "from-primary/50 to-primary/10"
				: "from-chart-5/50 to-chart-5/10";

	const _glowColor =
		phase === 1
			? "group-hover:shadow-[0_0_20px_var(--chart-2)]"
			: phase === 2
				? "group-hover:shadow-[0_0_20px_var(--primary)]"
				: "group-hover:shadow-[0_0_20px_var(--chart-5)]";

	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mx-auto w-full max-w-4xl space-y-6"
		>
			<div
				className={cn(
					"group relative p-px transition-all duration-300",
					borderGradient,
					"bg-linear-to-br",
				)}
				style={{ clipPath: clipPath16 }}
			>
				<div
					className="bg-background/90 backdrop-blur-md p-6 sm:p-8"
					style={{ clipPath: clipPath16 }}
				>
					<div className="space-y-8">
						<div className="space-y-2 text-center">
							<div
								className={cn(
									"inline-block px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm mb-2",
									phase === 1
										? "bg-chart-2/10 text-chart-2"
										: phase === 2
											? "bg-primary/10 text-primary"
											: "bg-chart-5/10 text-chart-5",
								)}
							>
								Fase {phase} {/* Misión de Evaluación */}
							</div>
							<h2
								id="question-text"
								className="text-xl font-bold leading-relaxed sm:text-3xl bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
							>
								{question.text}
							</h2>
						</div>

						<div className="space-y-8">
							{/* Pregunta tipo escala */}
							{question.type === "SCALE" && (
								<ScaleInput
									value={
										typeof selectedValue === "number" ? selectedValue : null
									}
									onSelect={handleScaleSelect}
									disabled={isLoading}
									scaleRange={question.scaleRange}
									accentColor={accentColor}
								/>
							)}

							{/* Pregunta de opción */}
							{question.type === "CHOICE" && question.options && (
								<ChoiceInput
									options={question.options}
									value={
										typeof selectedValue === "string" ? selectedValue : null
									}
									onSelect={handleChoiceSelect}
									disabled={isLoading}
									accentColor={accentColor}
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
									accentColor={accentColor}
								/>
							)}

							{/* Botón de enviar */}
							<div className="flex justify-end pt-4">
								<button
									onClick={handleSubmit}
									disabled={!isAnswerValid || isLoading}
									className={cn(
										"relative px-8 py-3 font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn",
										phase === 1
											? "text-chart-2"
											: phase === 2
												? "text-primary"
												: "text-chart-5",
									)}
									style={{
										clipPath:
											"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
									}}
								>
									<div
										className={cn(
											"absolute inset-0 opacity-10 group-hover/btn:opacity-20 transition-opacity",
											phase === 1
												? "bg-chart-2"
												: phase === 2
													? "bg-primary"
													: "bg-chart-5",
										)}
									/>
									<div
										className={cn(
											"absolute inset-x-0 bottom-0 h-0.5 transition-all duration-300 group-hover/btn:h-full group-hover/btn:opacity-10",
											phase === 1
												? "bg-chart-2"
												: phase === 2
													? "bg-primary"
													: "bg-chart-5",
										)}
									/>
									<span className="relative z-10 flex items-center gap-2">
										{isLoading ? (
											"Procesando..."
										) : (
											<>
												Siguiente
												<svg
													className="w-4 h-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13 7l5 5m0 0l-5 5m5-5H6"
													/>
												</svg>
											</>
										)}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sugerencia de teclado */}
			<p className="text-muted-foreground text-center text-[10px] uppercase tracking-[0.2em] font-bold">
				{question.type === "SCALE" &&
					"USAR TECLADO [1-5] PARA SELECCIÓN // [ENTER] PARA CONTINUAR"}
				{question.type === "CHOICE" && "SELECCIONE UNA OPCIÓN PARA CONTINUAR"}
				{question.type === "RANKING" &&
					"ARRASTRE O USE FLECHAS PARA REORDENAR EL RANKING"}
			</p>
		</motion.div>
	);
}

// Componente de escala con soporte de accesibilidad
interface ScaleInputProps {
	value: number | null;
	onSelect: (value: number) => void;
	disabled?: boolean;
	scaleRange?: ScaleRange;
	accentColor: string;
}

function ScaleInput({
	value,
	onSelect,
	disabled,
	scaleRange,
	accentColor,
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
							"flex min-w-16 flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 sm:min-w-20 p-2 sm:p-4 group/item",
							"hover:bg-white/5",
							"focus:outline-none",
							value === item.value ? "bg-white/10" : "bg-transparent",
						)}
						style={{
							clipPath:
								"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
						}}
					>
						<div
							className={cn(
								"absolute inset-0 border-[0.5px] transition-colors duration-300",
								value === item.value
									? accentColor === "chart-2"
										? "border-chart-2 bg-chart-2/10"
										: accentColor === "primary"
											? "border-primary bg-primary/10"
											: "border-chart-5 bg-chart-5/10"
									: "border-border group-hover/item:border-muted-foreground/30",
							)}
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						/>

						<span
							className={cn(
								"text-lg font-black sm:text-2xl relative z-10",
								value === item.value
									? accentColor === "chart-2"
										? "text-chart-2"
										: accentColor === "primary"
											? "text-primary"
											: "text-chart-5"
									: "text-muted-foreground group-hover/item:text-foreground",
							)}
						>
							{item.value}
						</span>
						<span
							className={cn(
								"text-center text-[8px] leading-tight sm:text-[10px] uppercase font-bold tracking-tighter relative z-10",
								value === item.value
									? "text-foreground"
									: "text-muted-foreground/50",
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
	accentColor: string;
}

function ChoiceInput({
	options,
	value,
	onSelect,
	disabled,
	accentColor,
}: ChoiceInputProps) {
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
						"w-full p-4 text-left transition-all duration-300 relative group/choice",
						"hover:bg-white/5",
						"focus:outline-none",
					)}
					style={{
						clipPath:
							"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
					}}
				>
					<div
						className={cn(
							"absolute inset-0 border-[0.5px] transition-colors duration-300",
							value === option
								? accentColor === "chart-2"
									? "border-chart-2 bg-chart-2/10"
									: accentColor === "primary"
										? "border-primary bg-primary/10"
										: "border-chart-5 bg-chart-5/10"
								: "border-border group-hover/choice:border-muted-foreground/30",
						)}
						style={{
							clipPath:
								"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
						}}
					/>

					<div className="relative z-10 flex items-center gap-4">
						<span
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-sm text-xs font-black tracking-tighter transition-colors",
								value === option
									? accentColor === "chart-2"
										? "bg-chart-2 text-primary-foreground"
										: accentColor === "primary"
											? "bg-primary text-primary-foreground"
											: "bg-chart-5 text-primary-foreground"
									: "bg-muted text-muted-foreground group-hover/choice:text-foreground",
							)}
						>
							{String.fromCharCode(65 + index)}
						</span>
						<span
							className={cn(
								"text-sm sm:text-base font-medium transition-colors",
								value === option
									? "text-foreground"
									: "text-muted-foreground group-hover/choice:text-foreground/80",
							)}
						>
							{option}
						</span>
					</div>
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
	accentColor: string;
}

function RankingInput({
	order,
	onOrderChange,
	onInitialize,
	disabled,
	accentColor,
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
						"flex items-center gap-4 p-3 transition-all duration-300 border-[0.5px] border-border bg-background/50",
						"hover:border-muted-foreground/30",
					)}
					style={{
						clipPath:
							"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
					}}
				>
					<span
						className={cn(
							"flex h-8 w-8 items-center justify-center rounded-sm text-xs font-black tracking-tighter",
							accentColor === "chart-2"
								? "bg-chart-2/20 text-chart-2"
								: accentColor === "primary"
									? "bg-primary/20 text-primary"
									: "bg-chart-5/20 text-chart-5",
						)}
					>
						{index + 1}
					</span>
					<span className="flex-1 text-sm sm:text-base text-foreground font-medium">
						{option}
					</span>
					<div className="flex gap-1">
						<button
							onClick={() => onOrderChange(option, "up")}
							disabled={disabled || index === 0}
							aria-label={`Mover ${option} hacia arriba`}
							className="h-8 w-8 flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30"
						>
							↑
						</button>
						<button
							onClick={() => onOrderChange(option, "down")}
							disabled={disabled || index === order.length - 1}
							aria-label={`Mover ${option} hacia abajo`}
							className="h-8 w-8 flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30"
						>
							↓
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
