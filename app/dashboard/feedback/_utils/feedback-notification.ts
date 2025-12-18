/**
 * Feedback Notification Utility
 *
 * Handles sending email and in-app notifications for feedback requests.
 * Uses template-based emails based on research.md specifications.
 *
 * @module feedback-notification
 */

import { Resend } from "resend";

import { prisma } from "@/lib/prisma.db";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const EMAIL_FROM = process.env.EMAIL_FROM || "Insight <onboarding@resend.dev>";

/**
 * Email configuration for notifications
 */
export interface EmailConfig {
	to: string;
	subject: string;
	body: string;
	html?: string;
}

/**
 * Notification result
 */
export interface NotificationResult {
	success: boolean;
	method: "email" | "in-app" | "both";
	error?: string;
}

/**
 * Feedback request details for notification context
 */
export interface FeedbackRequestNotificationContext {
	requestId: string;
	requesterName: string;
	respondentName: string;
	respondentEmail: string;
	isAnonymous: boolean;
	expiresAt: Date | null;
}

/**
 * Base URL for the application
 * In production, this should come from environment variables
 */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Generates the feedback request email content
 *
 * @param context - Notification context with requester/respondent details
 * @returns Email configuration object
 */
export function generateFeedbackRequestEmail(
	context: FeedbackRequestNotificationContext,
): EmailConfig {
	const { requestId, requesterName, respondentName, isAnonymous } = context;

	const anonymityText = isAnonymous
		? "Tu respuesta será anónima."
		: `Tu respuesta será compartida con ${requesterName}.`;

	const surveyUrl = `${BASE_URL}/dashboard/feedback/respond/${requestId}`;

	const subject = `${requesterName} te ha solicitado feedback (2 minutos)`;

	const body = `Hola ${respondentName},

${requesterName} valora tu perspectiva y te ha pedido un breve feedback sobre sus fortalezas. Esta encuesta toma aproximadamente 2 minutos y le ayudará a entender cómo se manifiestan sus fortalezas en el trabajo en equipo.

Enlace: ${surveyUrl}

${anonymityText}

Esto es completamente opcional—no hay obligación de responder. Si decides participar, tus observaciones pueden ayudar a ${requesterName} a crecer.

Gracias por ser parte de un equipo solidario,
El equipo de Insight`;

	const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Solicitud de Feedback</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">Hola <strong>${respondentName}</strong>,</p>
    
    <p><strong>${requesterName}</strong> valora tu perspectiva y te ha pedido un breve feedback sobre sus fortalezas. Esta encuesta toma aproximadamente <strong>2 minutos</strong> y le ayudará a entender cómo se manifiestan sus fortalezas en el trabajo en equipo.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Iniciar Encuesta de Feedback</a>
    </div>
    
    <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
      ${anonymityText}
    </p>
    
    <p style="color: #6b7280; font-size: 14px;">Esto es completamente opcional—no hay obligación de responder. Si decides participar, tus observaciones pueden ayudar a ${requesterName} a crecer.</p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="margin-bottom: 0; color: #6b7280; font-size: 14px;">Gracias por ser parte de un equipo solidario,<br><strong>El equipo de Insight</strong></p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`;

	return {
		to: context.respondentEmail,
		subject,
		body,
		html,
	};
}

/**
 * Generates the reminder email content (for future use)
 *
 * @param context - Notification context
 * @param daysRemaining - Days until request expires
 * @returns Email configuration object
 */
export function generateReminderEmail(
	context: FeedbackRequestNotificationContext,
	daysRemaining: number,
): EmailConfig {
	const { requestId, requesterName, respondentName } = context;

	const surveyUrl = `${BASE_URL}/dashboard/feedback/respond/${requestId}`;

	const subject = `Recordatorio: Solicitud de feedback de ${requesterName}`;

	const body = `Hola ${respondentName},

Solo un recordatorio amistoso de que ${requesterName} espera tu feedback. Esta encuesta de 2 minutos expirará en ${daysRemaining} días.

Enlace: ${surveyUrl}

Si no puedes proporcionar feedback, está completamente bien—no se requiere ninguna acción.

Gracias,
El equipo de Insight`;

	const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Recordatorio de Feedback</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">Hola <strong>${respondentName}</strong>,</p>
    
    <p>Solo un recordatorio amistoso de que <strong>${requesterName}</strong> espera tu feedback. Esta encuesta de 2 minutos expirará en <strong>${daysRemaining} días</strong>.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${surveyUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Completar Encuesta</a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Si no puedes proporcionar feedback, está completamente bien—no se requiere ninguna acción.</p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`;

	return {
		to: context.respondentEmail,
		subject,
		body,
		html,
	};
}

/**
 * Generates the notification email when feedback is completed
 *
 * @param requesterName - Name of the requester
 * @param requesterEmail - Email of the requester
 * @param respondentName - Name of the respondent (only shown if not anonymous)
 * @param isAnonymous - Whether the response was anonymous
 * @param totalResponses - Total number of responses received
 * @param minimumRequired - Minimum responses needed for insights
 * @returns Email configuration object
 */
export function generateFeedbackCompletedEmail(
	requesterName: string,
	requesterEmail: string,
	respondentName: string | null,
	isAnonymous: boolean,
	totalResponses: number,
	minimumRequired: number = 3,
): EmailConfig {
	const insightsUrl = `${BASE_URL}/dashboard/feedback/insights`;
	const hasEnoughResponses = totalResponses >= minimumRequired;

	const responderText = isAnonymous
		? "Uno de tus compañeros de equipo"
		: respondentName;

	const subject = hasEnoughResponses
		? "🎉 ¡Ya puedes ver tus insights de feedback!"
		: `${responderText} completó tu solicitud de feedback`;

	const body = hasEnoughResponses
		? `Hola ${requesterName},

¡Buenas noticias! Has recibido ${totalResponses} respuestas de feedback, suficientes para generar tus insights personalizados.

Ver Insights: ${insightsUrl}

Tus compañeros de equipo han compartido observaciones valiosas sobre tus fortalezas. Explora cómo te perciben y descubre oportunidades de crecimiento.

El equipo de Insight`
		: `Hola ${requesterName},

${responderText} ha completado tu solicitud de feedback. Has recibido ${totalResponses} de ${minimumRequired} respuestas necesarias para generar insights.

Cuando tengas ${minimumRequired} respuestas, podrás ver tus insights personalizados.

El equipo de Insight`;

	const html = hasEnoughResponses
		? `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 ¡Insights Disponibles!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">Hola <strong>${requesterName}</strong>,</p>
    
    <p>¡Buenas noticias! Has recibido <strong>${totalResponses} respuestas</strong> de feedback, suficientes para generar tus insights personalizados.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${insightsUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Ver Mis Insights</a>
    </div>
    
    <p>Tus compañeros de equipo han compartido observaciones valiosas sobre tus fortalezas. Explora cómo te perciben y descubre oportunidades de crecimiento.</p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`
		: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Feedback Recibido</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">Hola <strong>${requesterName}</strong>,</p>
    
    <p><strong>${responderText}</strong> ha completado tu solicitud de feedback.</p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Progreso de respuestas</p>
      <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #4f46e5;">${totalResponses} / ${minimumRequired}</p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">Cuando tengas ${minimumRequired} respuestas, podrás ver tus insights personalizados.</p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`;

	return {
		to: requesterEmail,
		subject,
		body,
		html,
	};
}

/**
 * Generates the notification email when a request is declined
 *
 * @param requesterName - Name of the requester
 * @param requesterEmail - Email of the requester
 * @param respondentName - Name of the respondent
 * @returns Email configuration object
 */
export function generateDeclineNotificationEmail(
	requesterName: string,
	requesterEmail: string,
	respondentName: string,
): EmailConfig {
	const subject = `${respondentName} no puede proporcionarte feedback en este momento`;

	const body = `Hola ${requesterName},

${respondentName} ha indicado que no puede proporcionarte feedback en este momento. Esto puede ser por varias razones y es completamente normal.

Considera solicitar feedback a otro compañero de equipo para obtener la cantidad necesaria de respuestas.

El equipo de Insight`;

	const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Actualización de Solicitud</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">Hola <strong>${requesterName}</strong>,</p>
    
    <p><strong>${respondentName}</strong> ha indicado que no puede proporcionarte feedback en este momento. Esto puede ser por varias razones y es completamente normal.</p>
    
    <p>Considera solicitar feedback a otro compañero de equipo para obtener la cantidad necesaria de respuestas.</p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`;

	return {
		to: requesterEmail,
		subject,
		body,
		html,
	};
}

/**
 * Sends an email notification using Resend
 *
 * @param config - Email configuration
 * @returns Promise resolving to notification result
 */
export async function sendEmail(
	config: EmailConfig,
): Promise<NotificationResult> {
	try {
		// Log for debugging in development
		if (process.env.NODE_ENV === "development") {
			console.log("📧 Sending Email via Resend:", {
				to: config.to,
				subject: config.subject,
				bodyPreview: config.body.substring(0, 100) + "...",
			});
		}

		// Send email via Resend
		const { data, error } = await resend.emails.send({
			from: EMAIL_FROM,
			to: config.to,
			subject: config.subject,
			text: config.body,
			html: config.html,
		});

		if (error) {
			console.error("Resend API error:", error);
			return {
				success: false,
				method: "email",
				error: error.message,
			};
		}

		console.log("✅ Email sent successfully:", data?.id);

		return {
			success: true,
			method: "email",
		};
	} catch (error) {
		console.error("Failed to send email notification:", error);
		return {
			success: false,
			method: "email",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Creates an in-app notification record
 *
 * @param userId - User ID to notify
 * @param type - Notification type
 * @param title - Notification title
 * @param message - Notification message
 * @param link - Optional link to navigate to
 * @returns Promise resolving to notification result
 */
export async function createInAppNotification(
	userId: string,
	type:
		| "feedback_request"
		| "feedback_received"
		| "insights_available"
		| "feedback_declined",
	title: string,
	message: string,
	link?: string,
): Promise<NotificationResult> {
	try {
		// TODO: Create notification in database when Notification model is added
		// For now, log to console for development
		console.log("🔔 In-App Notification:", {
			userId,
			type,
			title,
			message,
			link,
		});

		// In production with Notification model:
		// await prisma.notification.create({
		//   data: {
		//     userId,
		//     type,
		//     title,
		//     message,
		//     link,
		//     read: false,
		//   },
		// });

		return {
			success: true,
			method: "in-app",
		};
	} catch (error) {
		console.error("Failed to create in-app notification:", error);
		return {
			success: false,
			method: "in-app",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Sends feedback request notifications to all respondents
 *
 * @param requesterId - ID of the user requesting feedback
 * @param requestIds - Array of created feedback request IDs
 * @returns Promise resolving to array of notification results
 */
export async function sendFeedbackRequestNotifications(
	requesterId: string,
	requestIds: string[],
): Promise<NotificationResult[]> {
	const results: NotificationResult[] = [];

	// Get requester info
	const requester = await prisma.user.findUnique({
		where: { id: requesterId },
		select: { name: true },
	});

	if (!requester) {
		return [{ success: false, method: "email", error: "Requester not found" }];
	}

	// Get all request details
	const requests = await prisma.feedbackRequest.findMany({
		where: { id: { in: requestIds } },
		include: {
			respondent: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	for (const request of requests) {
		const context: FeedbackRequestNotificationContext = {
			requestId: request.id,
			requesterName: requester.name || "Un compañero de equipo",
			respondentName: request.respondent.name || "Compañero",
			respondentEmail: request.respondent.email,
			isAnonymous: request.isAnonymous,
			expiresAt: request.expiresAt,
		};

		// Send email notification
		const emailConfig = generateFeedbackRequestEmail(context);
		const emailResult = await sendEmail(emailConfig);
		results.push(emailResult);

		// Create in-app notification
		const inAppResult = await createInAppNotification(
			request.respondent.id,
			"feedback_request",
			`${requester.name || "Un compañero"} te ha solicitado feedback`,
			"Toma 2 minutos completar esta encuesta breve.",
			`/dashboard/feedback/respond/${request.id}`,
		);
		results.push(inAppResult);
	}

	return results;
}

/**
 * Sends notification when feedback is completed
 *
 * @param requestId - The feedback request ID that was completed
 * @param respondentId - The ID of the respondent
 * @returns Promise resolving to notification results
 */
export async function sendFeedbackCompletedNotification(
	requestId: string,
	respondentId: string,
): Promise<NotificationResult[]> {
	const results: NotificationResult[] = [];

	// Respondent ID logged for audit trail
	if (process.env.NODE_ENV === "development") {
		console.debug(
			`[Notification] Feedback completed by ${respondentId} for request ${requestId}`,
		);
	}

	// Get request and requester info
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		include: {
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			respondent: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!request) {
		return [{ success: false, method: "email", error: "Request not found" }];
	}

	// Count total completed responses for this requester
	const totalResponses = await prisma.feedbackRequest.count({
		where: {
			requesterId: request.requester.id,
			status: "COMPLETED",
		},
	});

	const emailConfig = generateFeedbackCompletedEmail(
		request.requester.name || "Usuario",
		request.requester.email,
		request.isAnonymous ? null : request.respondent.name,
		request.isAnonymous,
		totalResponses,
	);

	const emailResult = await sendEmail(emailConfig);
	results.push(emailResult);

	// Create in-app notification
	const inAppType =
		totalResponses >= 3 ? "insights_available" : "feedback_received";
	const inAppTitle =
		totalResponses >= 3 ? "🎉 ¡Insights disponibles!" : "Feedback recibido";
	const inAppMessage =
		totalResponses >= 3
			? "Ya puedes ver los insights generados a partir del feedback de tu equipo."
			: `Has recibido ${totalResponses} de 3 respuestas necesarias para ver tus insights.`;
	const inAppLink =
		totalResponses >= 3
			? "/dashboard/feedback/insights"
			: "/dashboard/feedback";

	const inAppResult = await createInAppNotification(
		request.requester.id,
		inAppType,
		inAppTitle,
		inAppMessage,
		inAppLink,
	);
	results.push(inAppResult);

	return results;
}

/**
 * Sends notification when a feedback request is declined
 *
 * @param requestId - The feedback request ID that was declined
 * @returns Promise resolving to notification results
 */
export async function sendDeclineNotification(
	requestId: string,
): Promise<NotificationResult[]> {
	const results: NotificationResult[] = [];

	// Get request info
	const request = await prisma.feedbackRequest.findUnique({
		where: { id: requestId },
		include: {
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			respondent: {
				select: {
					name: true,
				},
			},
		},
	});

	if (!request) {
		return [{ success: false, method: "email", error: "Request not found" }];
	}

	const emailConfig = generateDeclineNotificationEmail(
		request.requester.name || "Usuario",
		request.requester.email,
		request.respondent.name || "Un compañero",
	);

	const emailResult = await sendEmail(emailConfig);
	results.push(emailResult);

	// Create in-app notification
	const inAppResult = await createInAppNotification(
		request.requester.id,
		"feedback_declined",
		`${request.respondent.name || "Un compañero"} no puede dar feedback`,
		"Considera solicitar feedback a otro compañero de equipo.",
		"/dashboard/feedback/request",
	);
	results.push(inAppResult);

	return results;
}
