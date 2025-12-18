"use client";

/**
 * Error Display Component
 *
 * Muestra errores de forma amigable en el flujo de feedback
 */

import { AlertCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export interface FeedbackErrorProps {
	title?: string;
	message: string;
	errorCode?: string;
	canRetry?: boolean;
	onRetry?: () => void;
	backUrl?: string;
	helpText?: string;
}

/**
 * Map error codes to user-friendly messages
 */
export function getErrorMessage(errorCode: string): {
	title: string;
	message: string;
	helpText?: string;
} {
	const errorMessages: Record<
		string,
		{ title: string; message: string; helpText?: string }
	> = {
		// Request errors
		RATE_LIMITED: {
			title: "Límite de solicitudes alcanzado",
			message:
				"Has enviado demasiadas solicitudes hoy. Por favor, intenta mañana.",
			helpText: "Puedes enviar hasta 10 solicitudes de feedback por día.",
		},
		COOLDOWN_ACTIVE: {
			title: "Período de espera activo",
			message: "Ya has solicitado feedback a esta persona recientemente.",
			helpText: "Debes esperar 30 días entre solicitudes al mismo compañero.",
		},
		NO_TEAM_MEMBERS: {
			title: "Sin compañeros disponibles",
			message:
				"No hay compañeros de equipo disponibles para solicitar feedback.",
			helpText:
				"Únete a un equipo o espera a que otros miembros estén disponibles.",
		},
		REQUEST_NOT_FOUND: {
			title: "Solicitud no encontrada",
			message:
				"La solicitud de feedback que buscas no existe o ha sido eliminada.",
		},
		REQUEST_EXPIRED: {
			title: "Solicitud expirada",
			message: "Esta solicitud de feedback ha expirado.",
			helpText: "Las solicitudes expiran después de 14 días sin respuesta.",
		},
		REQUEST_ALREADY_COMPLETED: {
			title: "Ya completado",
			message: "Ya has respondido a esta solicitud de feedback.",
		},

		// Response errors
		INVALID_ANSWERS: {
			title: "Respuestas incompletas",
			message: "Por favor, responde todas las preguntas antes de enviar.",
		},
		SAVE_FAILED: {
			title: "Error al guardar",
			message:
				"No pudimos guardar tus respuestas. Por favor, intenta de nuevo.",
		},

		// Insight errors
		INSUFFICIENT_DATA: {
			title: "Datos insuficientes",
			message: "Necesitas al menos 3 respuestas para generar insights.",
			helpText:
				"Solicita feedback a más compañeros para obtener insights personalizados.",
		},
		AI_GENERATION_FAILED: {
			title: "Error generando insights",
			message:
				"Hubo un problema al generar tus insights. Usando análisis alternativo.",
		},

		// General errors
		UNAUTHORIZED: {
			title: "Acceso denegado",
			message: "No tienes permiso para acceder a esta página.",
		},
		NOT_FOUND: {
			title: "No encontrado",
			message: "El recurso que buscas no existe.",
		},
		SERVER_ERROR: {
			title: "Error del servidor",
			message: "Algo salió mal. Por favor, intenta más tarde.",
			helpText: "Si el problema persiste, contacta al soporte.",
		},
		NETWORK_ERROR: {
			title: "Error de conexión",
			message:
				"No pudimos conectarnos al servidor. Verifica tu conexión a internet.",
		},
		UNKNOWN: {
			title: "Error inesperado",
			message: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
		},
	};

	return errorMessages[errorCode] || errorMessages.UNKNOWN;
}

/**
 * Feedback Error Display Component
 */
export function FeedbackError({
	title,
	message,
	errorCode,
	canRetry = true,
	onRetry,
	backUrl,
	helpText,
}: FeedbackErrorProps) {
	const router = useRouter();

	// Use error code to get default messages if not provided
	const errorInfo = errorCode ? getErrorMessage(errorCode) : null;
	const displayTitle = title || errorInfo?.title || "Error";
	const displayMessage =
		message || errorInfo?.message || "Ocurrió un error inesperado.";
	const displayHelpText = helpText || errorInfo?.helpText;

	return (
		<Card className="mx-auto max-w-md border-destructive/50">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="bg-destructive/10 text-destructive flex h-10 w-10 items-center justify-center rounded-full">
						<AlertCircle className="h-5 w-5" />
					</div>
					<div>
						<CardTitle className="text-lg">{displayTitle}</CardTitle>
						{errorCode && (
							<CardDescription className="text-muted-foreground text-xs font-mono">
								Código: {errorCode}
							</CardDescription>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-foreground/80">{displayMessage}</p>

				{displayHelpText && (
					<div className="bg-muted/50 flex items-start gap-2 rounded-lg p-3">
						<HelpCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
						<p className="text-muted-foreground text-sm">{displayHelpText}</p>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex gap-2">
				{backUrl && (
					<Button
						variant="outline"
						onClick={() => router.push(backUrl)}
						className="flex-1"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
				)}
				{canRetry && onRetry && (
					<Button onClick={onRetry} className="flex-1">
						<RefreshCw className="mr-2 h-4 w-4" />
						Reintentar
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

/**
 * Inline error message for form fields
 */
export function InlineError({ message }: { message: string }) {
	return (
		<div className="text-destructive flex items-center gap-1.5 text-sm">
			<AlertCircle className="h-3.5 w-3.5" />
			<span>{message}</span>
		</div>
	);
}

/**
 * Toast-style error for transient errors
 */
export function getErrorToastMessage(errorCode: string): string {
	const messages: Record<string, string> = {
		RATE_LIMITED: "Has alcanzado el límite de solicitudes diarias",
		COOLDOWN_ACTIVE: "Debes esperar antes de solicitar feedback a esta persona",
		SAVE_FAILED: "Error al guardar. Por favor, intenta de nuevo.",
		NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
		SERVER_ERROR: "Error del servidor. Intenta más tarde.",
		UNKNOWN: "Ocurrió un error inesperado",
	};

	return messages[errorCode] || messages.UNKNOWN;
}
