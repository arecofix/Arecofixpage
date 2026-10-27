import { environment } from '../../src/environments/environment';

export interface PaymentReceiptEmailOptions {
  to: string;
  studentName: string;
  planName: string;
  amount: number;
  currency?: string;
  expiresAt: string | Date;
  paymentId: string;
  subscriptionId: string;
  userId?: string;
}

export interface GracePeriodWarningEmailOptions {
  to: string;
  studentName: string;
  expiresAt: string | Date;
  graceEndsAt: string | Date;
  subscriptionId: string;
  userId?: string;
}

export interface CourseCompletedEmailOptions {
  to: string;
  studentName: string;
  courseTitle: string;
  certificateId: string;
  verifyUrl: string;
  downloadUrl?: string;
  userId?: string;
}

function getSupabaseConfig() {
  const supabaseUrl = process.env['SUPABASE_URL'] || environment.supabaseUrl;
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_KEY'] || environment.supabaseKey;
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };
  return { supabaseUrl, supabaseKey, headers };
}

/**
 * Sends an email via Resend API if configured, otherwise simulates sending.
 * Always records the notification in public.academy_email_notifications for audit and idempotency.
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  notificationType: 'payment_receipt' | 'grace_period_warning' | 'course_completed',
  referenceId: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; simulated?: boolean; messageId?: string }> {
  const resendApiKey = process.env['RESEND_API_KEY'];
  const fromEmail = process.env['EMAIL_FROM'] || 'Arecofix Academy <no-reply@arecofix.com.ar>';
  let sentStatus: 'sent' | 'failed' = 'sent';
  let messageId: string | undefined;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[AcademyEmail] Error sending email via Resend:`, errorText);
        sentStatus = 'failed';
      } else {
        const resData = (await res.json()) as { id?: string };
        messageId = resData.id;
        console.info(`[AcademyEmail] Email "${subject}" sent to ${to} (MessageId: ${messageId})`);
      }
    } catch (err) {
      console.error(`[AcademyEmail] Exception sending email:`, err);
      sentStatus = 'failed';
    }
  } else {
    console.info(`[AcademyEmail][SIMULATED] "${subject}" to: ${to} (Type: ${notificationType})`);
  }

  // Record in database
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    await fetch(`${supabaseUrl}/rest/v1/academy_email_notifications`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        user_id: userId || null,
        recipient_email: to,
        notification_type: notificationType,
        subject,
        status: sentStatus,
        reference_id: referenceId,
        metadata: {
          ...metadata,
          simulated: !resendApiKey,
          messageId
        }
      })
    });
  } catch (dbErr) {
    console.warn(`[AcademyEmail] Failed to log email record in DB:`, dbErr);
  }

  return { success: sentStatus === 'sent', simulated: !resendApiKey, messageId };
}

/**
 * 1. Payment Receipt Email
 */
export async function sendPaymentReceiptEmail(opts: PaymentReceiptEmailOptions) {
  const { to, studentName, planName, amount, currency = 'ARS', expiresAt, paymentId, subscriptionId, userId } = opts;
  const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';
  const formattedDate = new Date(expiresAt).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const subject = '¡Pago Aprobado! Tu Membresía Arecofix Academy está Activa';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 28px 24px; text-align: center; }
        .header h1 { color: #f8fafc; margin: 0; font-size: 24px; font-weight: 700; }
        .header p { color: #f59e0b; margin: 6px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 32px 24px; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
        .detail-row:last-child { border-bottom: none; font-weight: 700; color: #0f172a; font-size: 16px; }
        .btn { display: block; text-align: center; background: #0284c7; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 24px; }
        .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ARECOFIX ACADEMY</h1>
          <p>Comprobante Oficial de Pago</p>
        </div>
        <div class="content">
          <div class="badge">✓ Pago Aprobado</div>
          <h2>¡Hola ${studentName}!</h2>
          <p>Tu pago ha sido procesado exitosamente a través de Mercado Pago y tu membresía en la Academia Arecofix ya se encuentra <strong>activa</strong>.</p>
          
          <div class="details-box">
            <div class="detail-row"><span>Plan de Acceso:</span> <strong>${planName}</strong></div>
            <div class="detail-row"><span>ID Transacción:</span> <code>${paymentId}</code></div>
            <div class="detail-row"><span>Válido hasta:</span> <strong>${formattedDate}</strong></div>
            <div class="detail-row"><span>Monto Total:</span> <strong>$${amount.toLocaleString('es-AR')} ${currency}</strong></div>
          </div>

          <p>Ya puedes acceder al Campus Virtual, ver las clases, participar en los foros y rendir tus exámenes.</p>
          <a href="${baseUrl}/academy" class="btn">Ingresar al Campus Virtual</a>
        </div>
        <div class="footer">
          <p>Arecofix • Reparaciones, Cursos y Tecnología</p>
          <p>Este correo electrónico sirve como comprobante digital de suscripción.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html, 'payment_receipt', paymentId, userId, {
    planName,
    amount,
    currency,
    expiresAt,
    subscriptionId
  });
}

/**
 * 2. Grace Period Warning Email (7 days remaining)
 */
export async function sendGracePeriodWarningEmail(opts: GracePeriodWarningEmailOptions) {
  const { to, studentName, expiresAt, graceEndsAt, subscriptionId, userId } = opts;
  const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';
  const formattedGraceEnd = new Date(graceEndsAt).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const subject = '⚠️ Tu membresía de Arecofix Academy venció — Tienes 7 días de gracia';

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #fde68a; }
        .header { background: #78350f; padding: 28px 24px; text-align: center; }
        .header h1 { color: #fef3c7; margin: 0; font-size: 24px; font-weight: 700; }
        .header p { color: #fde68a; margin: 6px 0 0 0; font-size: 14px; }
        .content { padding: 32px 24px; }
        .alert-box { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 18px; margin: 20px 0; color: #92400e; font-size: 15px; }
        .btn { display: block; text-align: center; background: #d97706; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 24px; }
        .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ARECOFIX ACADEMY</h1>
          <p>Aviso de Vencimiento de Membresía</p>
        </div>
        <div class="content">
          <h2>Estimado/a ${studentName},</h2>
          <div class="alert-box">
            <strong>⚠️ Período de Gracia Activado:</strong><br/>
            Tu ciclo de facturación ha expirado, pero tienes <strong>7 días de gracia</strong> para regularizar tu cuota antes de que tu acceso a las clases y exámenes sea suspendido.
          </div>
          
          <p>Tu plazo de gracia finaliza el <strong>${formattedGraceEnd}</strong>.</p>
          <p>Para mantener tu progreso y acceso ininterrumpido a tus cursos y diplomas, puedes renovar ahora con un solo clic:</p>

          <a href="${baseUrl}/academy?renew=true&sub=${subscriptionId}" class="btn">Renovar Membresía Ahora</a>
        </div>
        <div class="footer">
          <p>Arecofix • Plataforma de Capacitación Técnica</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html, 'grace_period_warning', subscriptionId, userId, {
    expiresAt,
    graceEndsAt
  });
}

/**
 * 3. Course Completed & Diploma Email
 */
export async function sendCourseCompletedEmail(opts: CourseCompletedEmailOptions) {
  const { to, studentName, courseTitle, certificateId, verifyUrl, downloadUrl, userId } = opts;

  const subject = `🎓 ¡Felicitaciones! Has completado el curso "${courseTitle}"`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 28px 24px; text-align: center; }
        .header h1 { color: #f8fafc; margin: 0; font-size: 24px; font-weight: 700; }
        .header p { color: #38bdf8; margin: 6px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; }
        .content { padding: 32px 24px; text-align: center; }
        .icon { font-size: 48px; margin-bottom: 12px; }
        .course-title { font-size: 20px; font-weight: 700; color: #0284c7; margin: 16px 0; }
        .cert-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 13px; color: #475569; }
        .btn-group { margin-top: 24px; display: flex; gap: 12px; justify-content: center; }
        .btn { display: inline-block; text-align: center; background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        .btn-secondary { background: #0f172a; }
        .footer { text-align: center; font-size: 12px; color: #64748b; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>ARECOFIX ACADEMY</h1>
          <p>Emisión Oficial de Diploma</p>
        </div>
        <div class="content">
          <div class="icon">🎓</div>
          <h2>¡Felicitaciones, ${studentName}!</h2>
          <p>Has completado el 100% de los módulos y aprobado los exámenes del curso:</p>
          <div class="course-title">"${courseTitle}"</div>

          <p>Tu diploma ha sido generado oficialmente con firma digital y código QR de verificación pública.</p>

          <div class="cert-box">
            <strong>ID de Verificación:</strong> <code>${certificateId}</code><br/>
            Cualquier empleador o institución puede verificar la autenticidad de tu certificación escaneando el código QR o ingresando al portal público.
          </div>

          <div class="btn-group">
            <a href="${verifyUrl}" class="btn">Verificar Certificado en Línea</a>
            ${downloadUrl ? `<a href="${downloadUrl}" class="btn btn-secondary">Descargar PDF</a>` : ''}
          </div>
        </div>
        <div class="footer">
          <p>Arecofix Academy • Certificaciones con Validez Técnica</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, subject, html, 'course_completed', certificateId, userId, {
    courseTitle,
    verifyUrl,
    downloadUrl
  });
}
