import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Test endpoint for Resend email integration
 * GET /api/test-email?to=email@example.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to');

  if (!to) {
    return NextResponse.json(
      { error: 'Missing "to" query parameter' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Insight <onboarding@resend.dev>',
      to,
      subject: '🎉 ¡Prueba de Email desde Insight!',
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">✅ Email de Prueba</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="margin-top: 0;">¡Felicidades!</p>
    
    <p>La integración con <strong>Resend</strong> está funcionando correctamente. Este es un email de prueba del sistema de notificaciones de <strong>Insight</strong>.</p>
    
    <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #065f46;">
        <strong>✓ Conexión exitosa</strong><br>
        El sistema de feedback 360° está listo para enviar notificaciones.
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      Funcionalidades disponibles:
    </p>
    <ul style="color: #6b7280; font-size: 14px;">
      <li>Solicitudes de feedback</li>
      <li>Recordatorios automáticos</li>
      <li>Notificaciones de respuestas completadas</li>
      <li>Alertas de insights disponibles</li>
    </ul>
  </div>
  
  <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Insight. Todos los derechos reservados.</p>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${to}`,
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Failed to send test email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
