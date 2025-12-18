/**
 * Feedback Questionnaire Component
 *
 * 5-question behavioral survey for peer feedback
 * Shows progress, allows navigation between questions, and submits all answers
 * Includes localStorage backup for draft answers
 */

"use client";

import {
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Send,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from "react";
import { toast } from "sonner";
import { BadgeUnlockModal, XpGainToast } from "@/components/gamification";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FeedbackQuestion } from "@/generated/prisma/client";
import { cn } from "@/lib/cn";
import type { UnlockedBadge } from "@/lib/types/gamification.types";
import {
	declineFeedbackAction,
	saveProgressAction,
	submitFeedbackAction,
} from "../_actions/feedback-response.actions";
import {
	type AnswerOption,
	parseFeedbackQuestion,
} from "../_utils/question-mapper";

/**
 * Genera la clave de localStorage para borradores
 */
function getDraftKey(requestId: string): string {
	return `feedback-draft-${requestId}`;
}

/**
 * Guarda borrador en localStorage
 */
function saveDraftToLocalStorage(
	requestId: string,
	answers: Map<string, string>,
): void {
	try {
		const draft = Object.fromEntries(answers);
		localStorage.setItem(getDraftKey(requestId), JSON.stringify(draft));
	} catch {
		// Ignorar errores de localStorage (quota exceeded, etc.)
	}
}

/**
 * Carga borrador desde localStorage
 */
function loadDraftFromLocalStorage(requestId: string): Map<string, string> {
	try {
		const draft = localStorage.getItem(getDraftKey(requestId));
		if (draft) {
			const parsed = JSON.parse(draft) as Record<string, string>;
			return new Map(Object.entries(parsed));
		}
	} catch {
		// Ignorar errores de parsing
	}
	return new Map();
}

/**
 * Limpia borrador de localStorage
 */
function clearDraftFromLocalStorage(requestId: string): void {
	try {
		localStorage.removeItem(getDraftKey(requestId));
	} catch {
		// Ignorar errores
	}
}

interface FeedbackQuestionnaireProps {
	requestId: string;
	requesterName: string;
	questions: FeedbackQuestion[];
	savedAnswers: Array<{ questionId: string; answer: string }>;
}

export function FeedbackQuestionnaire({
	requestId,
	requesterName,
	questions,
	savedAnswers,
}: FeedbackQuestionnaireProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Parse questions once
	const parsedQuestions = useMemo(
		() => questions.map(parseFeedbackQuestion),
		[questions],
	);

	const [answers, setAnswers] = useState<Map<string, string>>(() => {
		// Primero intentar cargar desde localStorage (borrador local)
		const localDraft = loadDraftFromLocalStorage(requestId);

		// Luego sobrescribir con respuestas guardadas del servidor (si hay)
		const map = new Map<string, string>(localDraft);
		savedAnswers.forEach(({ questionId, answer }) => {
			map.set(questionId, answer);
		});
		return map;
	});

	// Find first unanswered question for initial index
	const [currentIndex, setCurrentIndex] = useState(() => {
		const answeredIds = new Set(savedAnswers.map((a) => a.questionId));
		const firstUnanswered = parsedQuestions.findIndex(
			(q) => !answeredIds.has(q.id),
		);
		return firstUnanswered !== -1 ? firstUnanswered : 0;
	});

	// Badge unlock modal state
	const [unlockedBadges, setUnlockedBadges] = useState<UnlockedBadge[]>([]);
	const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
	const [showBadgeModal, setShowBadgeModal] = useState(false);
	const [shouldRedirect, setShouldRedirect] = useState(false);

	// Redirect after badge modals are shown
	useEffect(() => {
		if (shouldRedirect && !showBadgeModal) {
			router.push("/dashboard/feedback/success");
		}
	}, [shouldRedirect, showBadgeModal, router]);

	// Handle badge modal close - show next badge or redirect
	const handleBadgeModalClose = (open: boolean) => {
		if (!open) {
			if (currentBadgeIndex < unlockedBadges.length - 1) {
				setCurrentBadgeIndex((prev) => prev + 1);
			} else {
				setShowBadgeModal(false);
			}
		}
	};

	// Guardar borrador en localStorage cuando cambian las respuestas
	const saveToLocalStorage = useCallback(() => {
		saveDraftToLocalStorage(requestId, answers);
	}, [requestId, answers]);

	// Efecto para guardar borrador cuando el usuario navega fuera
	useEffect(() => {
		// Guardar cuando cambian las respuestas
		saveToLocalStorage();

		// También guardar cuando el usuario cierra/navega fuera
		const handleBeforeUnload = () => {
			saveDraftToLocalStorage(requestId, answers);
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [saveToLocalStorage, requestId, answers]);

	const currentQuestion = parsedQuestions[currentIndex];
	const totalQuestions = parsedQuestions.length;
	const progress = (answers.size / totalQuestions) * 100;
	const allAnswered = answers.size === totalQuestions;

	const selectAnswer = (answerId: string) => {
		const newAnswers = new Map(answers);
		newAnswers.set(currentQuestion.id, answerId);
		setAnswers(newAnswers);

		// Auto-save progress (servidor y localStorage)
		startTransition(async () => {
			await saveProgressAction(requestId, currentQuestion.id, answerId);
		});

		// Auto-advance after short delay
		if (currentIndex < totalQuestions - 1) {
			setTimeout(() => {
				setCurrentIndex(currentIndex + 1);
			}, 300);
		}
	};

	const handleSubmit = () => {
		if (!allAnswered) {
			toast.error("Completa todas las preguntas", {
				description: "Debes responder las 5 preguntas antes de enviar.",
			});
			return;
		}

		startTransition(async () => {
			const answersArray = Array.from(answers.entries()).map(
				([questionId, answer]) => ({
					questionId,
					answer,
				}),
			);

			const result = await submitFeedbackAction(requestId, answersArray);

			if (result.success) {
				// Limpiar borrador de localStorage al enviar exitosamente
				clearDraftFromLocalStorage(requestId);

				// Get XP result data
				const xpResult = result.data?.xpResult;

				// Redirect to success page with XP data for celebration
				if (xpResult?.success && xpResult.xpResult) {
					const xpData = encodeURIComponent(JSON.stringify(xpResult.xpResult));
					const badges = xpResult.unlockedBadges
						? encodeURIComponent(JSON.stringify(xpResult.unlockedBadges))
						: undefined;

					const url = badges
						? `/dashboard/feedback/success?xp=${xpData}&badges=${badges}`
						: `/dashboard/feedback/success?xp=${xpData}`;

					router.push(url);
				} else if (xpResult?.alreadyAwarded) {
					// XP was already awarded (edge case), show simple success
					toast.info("Feedback enviado", {
						description: "XP ya fue otorgado anteriormente.",
					});
					router.push("/dashboard/feedback/success");
				} else {
					// Progressive enhancement: No XP data, show simple success (T018)
					toast.success("¡Feedback enviado!", {
						description: "Gracias por ayudar a tu compañero a crecer.",
					});
					router.push("/dashboard/feedback/success");
				}
			} else {
				// Error handling for XP award failure (T018)
				toast.error("Error al enviar", {
					description: result.error || "Ocurrió un error inesperado.",
				});
			}
		});
	};

	const handleDecline = () => {
		startTransition(async () => {
			const result = await declineFeedbackAction(requestId);

			if (result.success) {
				toast.info("Solicitud rechazada");
				router.push("/dashboard/feedback");
			} else {
				toast.error("Error", {
					description: result.error || "No se pudo rechazar la solicitud.",
				});
			}
		});
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Progress Header */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium">
							Pregunta {currentIndex + 1} de {totalQuestions}
						</span>
						<span className="text-sm text-muted-foreground">
							{answers.size} respondidas
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</CardContent>
			</Card>

			{/* Question Card */}
			<Card>
				<CardHeader>
					<CardDescription>
						Piensa en cómo {requesterName} actúa habitualmente...
					</CardDescription>
					<CardTitle className="text-xl leading-relaxed">
						{currentQuestion.text}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{currentQuestion.answerOptions.map((option: AnswerOption) => (
							<AnswerOptionButton
								key={option.id}
								option={option}
								selected={answers.get(currentQuestion.id) === option.id}
								onClick={() => selectAnswer(option.id)}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
					disabled={currentIndex === 0 || isPending}
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					Anterior
				</Button>

				<div className="flex gap-1">
					{parsedQuestions.map((q, i) => (
						<button
							key={q.id}
							type="button"
							onClick={() => setCurrentIndex(i)}
							className={cn(
								"w-3 h-3 rounded-full transition-colors",
								i === currentIndex && "bg-primary",
								i !== currentIndex && answers.has(q.id) && "bg-primary/50",
								i !== currentIndex && !answers.has(q.id) && "bg-muted",
							)}
							aria-label={`Ir a pregunta ${i + 1}`}
						/>
					))}
				</div>

				{currentIndex < totalQuestions - 1 ? (
					<Button
						onClick={() => setCurrentIndex(currentIndex + 1)}
						disabled={isPending}
					>
						Siguiente
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				) : (
					<Button onClick={handleSubmit} disabled={!allAnswered || isPending}>
						<Send className="h-4 w-4 mr-1" />
						Enviar
					</Button>
				)}
			</div>

			{/* Decline Option */}
			<div className="text-center">
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-destructive"
					onClick={handleDecline}
					disabled={isPending}
				>
					<XCircle className="h-4 w-4 mr-1" />
					No puedo dar feedback ahora
				</Button>
			</div>

			{/* Badge Unlock Modal */}
			{unlockedBadges.length > 0 && unlockedBadges[currentBadgeIndex] && (
				<BadgeUnlockModal
					badge={{
						name: unlockedBadges[currentBadgeIndex].badge.name,
						description: unlockedBadges[currentBadgeIndex].badge.description,
						tier: unlockedBadges[currentBadgeIndex].badge.tier,
						xpReward: unlockedBadges[currentBadgeIndex].badge.xpReward,
						iconUrl: unlockedBadges[currentBadgeIndex].badge.iconUrl,
					}}
					open={showBadgeModal}
					onOpenChange={handleBadgeModalClose}
				/>
			)}
		</div>
	);
}

/**
 * Individual answer option button
 */
interface AnswerOptionButtonProps {
	option: AnswerOption;
	selected: boolean;
	onClick: () => void;
}

function AnswerOptionButton({
	option,
	selected,
	onClick,
}: AnswerOptionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-full text-left p-4 rounded-lg border transition-all",
				selected && "border-primary bg-primary/5 ring-2 ring-primary/20",
				!selected && "hover:border-primary/50 hover:bg-muted/50",
			)}
		>
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
						selected && "border-primary bg-primary",
						!selected && "border-muted-foreground",
					)}
				>
					{selected && (
						<CheckCircle2 className="h-3 w-3 text-primary-foreground" />
					)}
				</div>
				<span className={cn(selected && "font-medium")}>{option.text}</span>
			</div>
		</button>
	);
}
