import { Request, Response, Router } from 'express';
import crypto from 'node:crypto';
import { environment } from '../../src/environments/environment';
import {
  getMpAccessToken,
  getMpWebhookSecret,
  verifyMpSignature
} from './mercadopago.routes';
import {
  sendPaymentReceiptEmail,
  sendGracePeriodWarningEmail,
  sendCourseCompletedEmail
} from '../services/academy-email.service';
import { generateCertificatePdf } from '../services/academy-certificate.service';

export const academySubscriptionRoutes = Router();

interface SubscribeRequestBody {
  userId: string;
  planId?: string;
  payerEmail?: string;
  payerName?: string;
  backUrl?: string; // Discarded server-side to prevent Open Redirect (H-12)
}

/**
 * Helper: Build Safe Mercado Pago Subscription Redirect URLs
 * Strictly derives URLs from trusted baseUrl to prevent Open Redirect attacks.
 */
export function buildSubscriptionBackUrls(baseUrl: string, subscriptionId: string, _userBackUrl?: string): { success: string; failure: string; pending: string } {
  const safeBase = baseUrl.replace(/\/+$/, '');
  const redirectBase = `${safeBase}/academy`;
  return {
    success: `${redirectBase}?payment=approved&subscription_id=${subscriptionId}`,
    failure: `${redirectBase}?payment=rejected&subscription_id=${subscriptionId}`,
    pending: `${redirectBase}?payment=pending&subscription_id=${subscriptionId}`
  };
}

interface PlanRecord {
  id: string;
  name?: string;
  description?: string;
  price: number | string;
  interval_days?: number;
  grace_days?: number;
  is_active?: boolean;
}

interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id?: string;
  status: string;
  started_at?: string;
  expires_at?: string;
  grace_period_ends_at?: string;
  mp_preference_id?: string;
  plan?: PlanRecord;
}

/**
 * Helper to get Supabase service headers
 */
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
 * Middleware: Verify Admin Access for Certificates Management
 * Restricts access strictly to super_admin or admin roles.
 */
async function requireAdminAuth(req: Request, res: Response, next: () => void): Promise<void> {
  // Test mode: strictly restricted to test environment with explicit secret
  if (
    process.env['NODE_ENV'] === 'test' &&
    process.env['TEST_SECRET'] &&
    req.headers['x-test-secret'] === process.env['TEST_SECRET']
  ) {
    (req as any).user = { id: '00000000-0000-0000-0000-000000000001', email: 'test-admin@arecofix.com.ar' };
    (req as any).profile = { id: '00000000-0000-0000-0000-000000000001', role: 'admin', is_active: true };
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Token de autorización ausente. Se requiere inicio de sesión administrativo.'
    });
    return;
  }

  try {
    const supabaseUrl = process.env['SUPABASE_URL'] || environment.supabaseUrl;
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_KEY'] || environment.supabaseKey;

    // 1. Fetch user from Supabase auth using caller token
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!userRes.ok) {
      res.status(401).json({ success: false, error: 'Sesión no válida o expirada.' });
      return;
    }
    const user = await userRes.json();
    if (!user?.id) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
      return;
    }

    // 2. Fetch profile from Supabase profiles using serviceKey
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=id,role,is_active`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!profileRes.ok) {
      res.status(403).json({ success: false, error: 'Error al verificar perfil de usuario.' });
      return;
    }

    const profiles = await profileRes.json();
    const profile = profiles?.[0];

    if (!profile || profile.is_active === false) {
      res.status(403).json({ success: false, error: 'Usuario inactivo o perfil inexistente.' });
      return;
    }

    if (profile.role !== 'admin' && profile.role !== 'super_admin') {
      res.status(403).json({
        success: false,
        error: 'Acceso denegado: rol administrativo requerido.'
      });
      return;
    }

    (req as any).user = user;
    (req as any).profile = profile;
    next();
  } catch (err: unknown) {
    console.error('[requireAdminAuth:Certificates] Error verificando autenticación:', err);
    res.status(500).json({ success: false, error: 'Error interno en autenticación.' });
  }
}

/**
 * POST /api/academy/subscribe
 * Creates or updates an academy subscription record and generates a Mercado Pago Checkout Pro Preference.
 */
academySubscriptionRoutes.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  const correlationId = crypto.randomUUID();
  try {
    const { userId, planId, payerEmail, payerName, backUrl } = req.body as SubscribeRequestBody;

    if (!userId) {
      res.status(400).json({ success: false, error: 'Falta el parámetro requerido userId.' });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig();

    // 1. Fetch Plan details from database (Prevents Price Tampering)
    let planQuery = `${supabaseUrl}/rest/v1/academy_plans?is_active=eq.true&select=*`;
    if (planId) {
      planQuery += `&id=eq.${planId}`;
    } else {
      planQuery += `&limit=1`;
    }

    const planRes = await fetch(planQuery, { headers });
    if (!planRes.ok) {
      res.status(500).json({ success: false, error: 'Error al consultar planes en la base de datos.' });
      return;
    }

    const plans = (await planRes.json()) as PlanRecord[];
    if (!plans || plans.length === 0) {
      res.status(404).json({ success: false, error: 'No se encontró un plan de suscripción activo.' });
      return;
    }

    const plan = plans[0];
    const planPrice = Number(plan.price);
    if (isNaN(planPrice) || planPrice <= 0) {
      res.status(400).json({ success: false, error: 'El precio del plan configurado es inválido.' });
      return;
    }

    // 2. Fetch or create subscription in academy_subscriptions
    let subRes = await fetch(`${supabaseUrl}/rest/v1/academy_subscriptions?user_id=eq.${userId}&select=*`, { headers });
    let existingSubs = subRes.ok ? ((await subRes.json()) as SubscriptionRecord[]) : [];
    let subscription: SubscriptionRecord;

    const now = new Date();
    const intervalDays = Number(plan.interval_days) || 30;
    const graceDays = Number(plan.grace_days) || 7;

    const expiresAt = new Date(now.getTime() + intervalDays * 86400000);
    const gracePeriodEndsAt = new Date(expiresAt.getTime() + graceDays * 86400000);

    if (existingSubs && existingSubs.length > 0) {
      subscription = existingSubs[0];
      // Update plan_id if changed
      if (subscription.plan_id !== plan.id) {
        await fetch(`${supabaseUrl}/rest/v1/academy_subscriptions?id=eq.${subscription.id}`, {
          method: 'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ plan_id: plan.id, updated_at: now.toISOString() })
        });
      }
    } else {
      // Create initial subscription with status 'expired' until payment is approved
      const createSubRes = await fetch(`${supabaseUrl}/rest/v1/academy_subscriptions`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({
          user_id: userId,
          plan_id: plan.id,
          status: 'expired',
          started_at: now.toISOString(),
          expires_at: now.toISOString(), // Expired until paid
          grace_period_ends_at: now.toISOString(),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        })
      });

      if (!createSubRes.ok) {
        const errText = await createSubRes.text();
        console.error(`[AcademySub][${correlationId}] Error creating subscription:`, errText);
        res.status(500).json({ success: false, error: 'Error al registrar suscripción en la base de datos.' });
        return;
      }
      const created = await createSubRes.json();
      subscription = created[0];
    }

    // 3. Build Mercado Pago Checkout Pro Preference
    const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';
    const email = payerEmail || 'alumno@arecofix.com.ar';
    const name = payerName || 'Alumno Arecofix';
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'Alumno';
    const lastName = nameParts.slice(1).join(' ') || 'Arecofix';

    const backUrls = buildSubscriptionBackUrls(baseUrl, subscription.id, backUrl);

    const notificationUrl = `${baseUrl}/api/webhooks/mercadopago-academy`;

    const mpPayload = {
      items: [
        {
          id: String(plan.id),
          title: String(plan.name || 'Membresía Academia Pro'),
          description: plan.description ? String(plan.description).slice(0, 255) : 'Acceso completo a la Academia Arecofix',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(planPrice.toFixed(2))
        }
      ],
      payer: {
        name: firstName,
        surname: lastName,
        email
      },
      back_urls: backUrls,
      auto_return: 'approved',
      notification_url: notificationUrl,
      external_reference: `academy_${subscription.id}`,
      statement_descriptor: 'ARECOFIX ACADEMIA',
      binary_mode: false
    };

    // 4. Invoke Mercado Pago API with Idempotency Key
    const accessToken = getMpAccessToken();
    if (!accessToken) {
      console.error(`[AcademySub][${correlationId}] MP_ACCESS_TOKEN is missing in server environment`);
      res.status(500).json({ success: false, error: 'Mercado Pago access token no está configurado.' });
      return;
    }

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `academy_sub_${subscription.id}_${now.getTime()}`
      },
      body: JSON.stringify(mpPayload)
    });

    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      console.error(`[AcademySub][${correlationId}] Mercado Pago preference error:`, mpData);
      res.status(mpRes.status).json({ success: false, error: mpData });
      return;
    }

    // 5. Save preference_id in subscription
    await fetch(`${supabaseUrl}/rest/v1/academy_subscriptions?id=eq.${subscription.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        mp_preference_id: mpData.id,
        updated_at: new Date().toISOString()
      })
    });

    res.status(200).json({
      success: true,
      init_point: mpData.init_point,
      preference_id: mpData.id,
      subscription_id: subscription.id,
      correlation_id: correlationId
    });

  } catch (err: unknown) {
    console.error(`[AcademySub][${correlationId}] Unexpected subscribe error:`, err);
    res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error interno al generar suscripción de Academia.'
    });
  }
});

/**
 * POST /api/webhooks/mercadopago-academy
 * Webhook specifically dedicated to Academy subscriptions with signature validation and idempotency.
 */
academySubscriptionRoutes.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  const correlationId = crypto.randomUUID();
  const webhookSecret = getMpWebhookSecret() || 'arecofix_academy_wh_secret_2026';

  const dataId = String(req.body?.data?.id || req.query?.['data.id'] || req.query?.['id'] || '');
  const xSignature = req.headers['x-signature'] as string | undefined;
  const xRequestId = req.headers['x-request-id'] as string | undefined;

  // 1. Signature validation (Mandatory per security specifications)
  const isValid = verifyMpSignature(xSignature, xRequestId, dataId, webhookSecret);
  if (!isValid) {
    console.warn(`[AcademyWebhook][${correlationId}] Invalid or missing HMAC signature rejected.`);
    res.status(401).send('Invalid signature');
    return;
  }

  // 2. Immediate 200 OK response to satisfy Mercado Pago SLA
  res.status(200).json({ received: true });

  if (!dataId) {
    console.info(`[AcademyWebhook][${correlationId}] Ping received without data ID.`);
    return;
  }

  // 3. Process asynchronously in background
  setImmediate(async () => {
    try {
      await processAcademyPaymentWebhook(dataId, correlationId);
    } catch (err) {
      console.error(`[AcademyWebhook][${correlationId}] Background processing error:`, err);
    }
  });
});

/**
 * Processes payment and activates subscription
 */
export async function processAcademyPaymentWebhook(paymentId: string, correlationId: string): Promise<void> {
  const accessToken = getMpAccessToken();
  const { supabaseUrl, headers } = getSupabaseConfig();

  // 1. Fetch real payment from Mercado Pago API
  const mpPaymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!mpPaymentRes.ok) {
    console.warn(`[AcademyWebhook][${correlationId}] Payment ${paymentId} not found in MP API.`);
    return;
  }

  const payment = await mpPaymentRes.json();
  const externalRef = String(payment.external_reference || '');

  if (!externalRef.startsWith('academy_')) {
    console.info(`[AcademyWebhook][${correlationId}] External reference "${externalRef}" is not an academy subscription. Skipping.`);
    return;
  }

  const subscriptionId = externalRef.replace('academy_', '');

  // 2. Idempotency Check: check if payment ID already recorded in academy_payments
  const existingPaymentRes = await fetch(
    `${supabaseUrl}/rest/v1/academy_payments?mp_payment_id=eq.${paymentId}&status=eq.${payment.status}&select=id`,
    { headers }
  );

  if (existingPaymentRes.ok) {
    const existing = await existingPaymentRes.json();
    if (existing && existing.length > 0) {
      console.info(`[AcademyWebhook][${correlationId}] Academy payment ${paymentId} already processed with status ${payment.status}. Skipping.`);
      return;
    }
  }

  // 3. Fetch subscription details from Supabase
  const subRes = await fetch(
    `${supabaseUrl}/rest/v1/academy_subscriptions?id=eq.${subscriptionId}&select=*,plan:academy_plans(*)`,
    { headers }
  );

  if (!subRes.ok) return;
  const subs = (await subRes.json()) as SubscriptionRecord[];
  if (!subs || subs.length === 0) {
    console.warn(`[AcademyWebhook][${correlationId}] Academy subscription ${subscriptionId} not found in DB.`);
    return;
  }

  const subscription = subs[0];
  const plan = subscription.plan;
  const paidAmount = Number(payment.transaction_amount) || 0;

  // 4. Record transaction in academy_payments table
  await fetch(`${supabaseUrl}/rest/v1/academy_payments`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      subscription_id: subscription.id,
      user_id: subscription.user_id,
      plan_id: subscription.plan_id,
      amount: paidAmount,
      currency_id: payment.currency_id || 'ARS',
      status: payment.status,
      status_detail: payment.status_detail || null,
      mp_payment_id: String(payment.id),
      payment_method_id: payment.payment_method_id || null,
      payment_type_id: payment.payment_type_id || null,
      paid_at: new Date().toISOString(),
      raw_payload: payment
    })
  });

  // 5. If approved, activate or renew subscription
  if (payment.status === 'approved') {
    const intervalDays = Number(plan?.interval_days) || 30;
    const graceDays = Number(plan?.grace_days) || 7;

    const now = new Date();
    // If currently active, extend from expires_at; otherwise extend from now
    const currentExpires = new Date(subscription.expires_at || 0);
    const baseDate = (currentExpires > now) ? currentExpires : now;

    const newExpiresAt = new Date(baseDate.getTime() + intervalDays * 86400000);
    const newGraceEndsAt = new Date(newExpiresAt.getTime() + graceDays * 86400000);

    await fetch(`${supabaseUrl}/rest/v1/academy_subscriptions?id=eq.${subscription.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        status: 'active',
        started_at: subscription.status === 'active' ? subscription.started_at : now.toISOString(),
        expires_at: newExpiresAt.toISOString(),
        grace_period_ends_at: newGraceEndsAt.toISOString(),
        updated_at: now.toISOString()
      })
    });

    console.info(`[AcademyWebhook][${correlationId}] Subscription ${subscription.id} ACTIVATED until ${newExpiresAt.toISOString()}.`);

    // 6. Send Payment Receipt Email (Async)
    try {
      const payerEmail = payment.payer?.email || 'alumno@arecofix.com.ar';
      const payerName = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(' ') || 'Alumno Arecofix';
      await sendPaymentReceiptEmail({
        to: payerEmail,
        studentName: payerName,
        planName: plan?.name || 'Membresía Pro Academia',
        amount: paidAmount,
        currency: payment.currency_id || 'ARS',
        expiresAt: newExpiresAt,
        paymentId: String(payment.id),
        subscriptionId: subscription.id,
        userId: subscription.user_id
      });
    } catch (emailErr) {
      console.warn(`[AcademyWebhook][${correlationId}] Error sending payment email:`, emailErr);
    }
  }
}

/**
 * POST /api/academy/notifications/cron-grace-period
 * Triggered by cron job (pg_cron or external scheduler).
 * Evaluates expiring subscriptions and dispatches warning emails.
 */
academySubscriptionRoutes.post('/notifications/cron-grace-period', async (req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/check_and_notify_expiring_subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      res.status(500).json({ success: false, error: errText });
      return;
    }

    const result = await rpcRes.json();
    const subscriptions = result.subscriptions || [];

    // Send emails for newly queued items
    for (const sub of subscriptions) {
      try {
        await sendGracePeriodWarningEmail({
          to: sub.email,
          studentName: sub.student_name,
          expiresAt: sub.expires_at,
          graceEndsAt: sub.grace_period_ends_at,
          subscriptionId: sub.subscription_id,
          userId: sub.user_id
        });
      } catch (err) {
        console.error(`[AcademyCron] Failed to send email for sub ${sub.subscription_id}:`, err);
      }
    }

    res.status(200).json({
      success: true,
      processed: subscriptions.length,
      result
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error processing grace period cron.'
    });
  }
});

/**
 * GET /api/academy/certificates/:id/public
 * Public endpoint to fetch safe certificate data (No sensitive user info).
 */
academySubscriptionRoutes.get('/certificates/:id/public', async (req: Request, res: Response): Promise<void> => {
  try {
    const certId = req.params['id'];
    if (!certId) {
      res.status(400).json({ success: false, error: 'Falta el parámetro ID de certificado.' });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig();
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_public_certificate_data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_cert_id: certId })
    });

    if (!rpcRes.ok) {
      res.status(500).json({ success: false, error: 'Error al consultar datos del certificado.' });
      return;
    }

    const data = await rpcRes.json();
    if (!data || !data.success) {
      res.status(404).json(data || { success: false, status: 'not_found' });
      return;
    }

    res.status(200).json(data);
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error interno al consultar certificado.'
    });
  }
});

/**
 * GET /api/academy/certificates/:id/pdf
 * Generates or downloads the official Certificate PDF.
 */
academySubscriptionRoutes.get('/certificates/:id/pdf', async (req: Request, res: Response): Promise<void> => {
  try {
    const certId = req.params['id'];
    const { supabaseUrl, headers } = getSupabaseConfig();

    // Fetch safe certificate data
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_public_certificate_data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_cert_id: certId })
    });

    if (!rpcRes.ok) {
      res.status(404).send('Certificado no encontrado');
      return;
    }

    const certData = await rpcRes.json();
    if (!certData || !certData.success) {
      res.status(404).send('Certificado inválido o no encontrado');
      return;
    }

    // Generate dynamic PDF
    const pdfBytes = await generateCertificatePdf({
      certificateId: certData.certificate_id,
      studentName: certData.student_name,
      courseTitle: certData.course_title,
      instructorName: certData.instructor_name,
      issuedAt: certData.issued_at
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="certificado-${certId}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err: unknown) {
    console.error(`[AcademyCert] Error generating certificate PDF:`, err);
    res.status(500).send('Error interno al generar el diploma en PDF.');
  }
});

/**
 * POST /api/academy/certificates/issue
 * Issues a diploma upon course completion (100%) and notifies student by email.
 */
academySubscriptionRoutes.post('/certificates/issue', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, userId, studentName, studentEmail } = req.body;
    if (!courseId || (!userId && !studentEmail)) {
      res.status(400).json({ success: false, error: 'Faltan datos requeridos (courseId, userId o studentEmail).' });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig();
    const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';

    // 1. Fetch course title and instructor
    const courseRes = await fetch(`${supabaseUrl}/rest/v1/courses?id=eq.${courseId}&select=title,instructor_name`, { headers });
    const courses = courseRes.ok ? await courseRes.json() : [];
    const course = courses[0] || { title: 'Curso de Academia', instructor_name: 'Arecofix Academy' };

    // 2. Fetch existing certificate or insert new one
    let emailFilter = studentEmail ? `&email=eq.${encodeURIComponent(studentEmail)}` : '';
    let userFilter = userId ? `&user_id=eq.${userId}` : '';
    const existingCertRes = await fetch(`${supabaseUrl}/rest/v1/course_certificates?course_id=eq.${courseId}${userFilter || emailFilter}&select=*`, { headers });
    const existingCerts = existingCertRes.ok ? await existingCertRes.json() : [];

    let certificate;
    if (existingCerts && existingCerts.length > 0) {
      certificate = existingCerts[0];
    } else {
      const newCertId = crypto.randomUUID();
      const pdfUrl = `${baseUrl}/api/academy/certificates/${newCertId}/pdf`;
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/course_certificates`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({
          id: newCertId,
          course_id: courseId,
          user_id: userId || null,
          email: studentEmail || 'alumno@arecofix.com.ar',
          student_name: studentName || 'Alumno Arecofix',
          status: 'valid',
          pdf_url: pdfUrl
        })
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        res.status(500).json({ success: false, error: `Error creando certificado: ${errText}` });
        return;
      }

      const created = await insertRes.json();
      certificate = created[0];
    }

    // 3. Send Course Completed Email
    const verifyUrl = `${baseUrl}/academy/verify/${certificate.id}`;
    const downloadUrl = certificate.pdf_url || `${baseUrl}/api/academy/certificates/${certificate.id}/pdf`;

    await sendCourseCompletedEmail({
      to: certificate.email,
      studentName: certificate.student_name,
      courseTitle: course.title,
      certificateId: certificate.id,
      verifyUrl,
      downloadUrl,
      userId: certificate.user_id
    });

    res.status(200).json({
      success: true,
      certificate_id: certificate.id,
      verify_url: verifyUrl,
      pdf_url: downloadUrl
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error emitiendo certificado.'
    });
  }
});

/**
 * GET /api/academy/certificates
 * Admin endpoint: List all certificates with course info.
 */
academySubscriptionRoutes.get('/certificates', requireAdminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const queryRes = await fetch(
      `${supabaseUrl}/rest/v1/course_certificates?select=id,course_id,tenant_id,email,student_dni,student_name,status,pdf_url,issued_at,course:courses(id,title,slug)&order=issued_at.desc`,
      { headers }
    );

    if (!queryRes.ok) {
      const errText = await queryRes.text();
      res.status(500).json({ success: false, error: errText });
      return;
    }

    const data = await queryRes.json();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

/**
 * PATCH /api/academy/certificates/:id/revoke
 * Admin action: Revokes a certificate by ID with 1 click.
 */
academySubscriptionRoutes.patch('/certificates/:id/revoke', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reason = (req.body?.reason as string) || 'Revocado por el administrador';
    const { supabaseUrl, headers } = getSupabaseConfig();

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_revoke_certificate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_cert_id: id, p_reason: reason })
    });

    if (!rpcRes.ok) {
      // Fallback direct update
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/course_certificates?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status: 'revoked', updated_at: new Date().toISOString() })
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        res.status(500).json({ success: false, error: errText });
        return;
      }
    }

    res.status(200).json({
      success: true,
      certificate_id: id,
      status: 'revoked',
      message: 'Certificado revocado exitosamente. La validación pública ahora es inválida.'
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

/**
 * PATCH /api/academy/certificates/:id/reactivate
 * Admin action: Reactivates a certificate by ID.
 */
academySubscriptionRoutes.patch('/certificates/:id/reactivate', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig();

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/admin_reactivate_certificate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_cert_id: id })
    });

    if (!rpcRes.ok) {
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/course_certificates?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status: 'valid', updated_at: new Date().toISOString() })
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        res.status(500).json({ success: false, error: errText });
        return;
      }
    }

    res.status(200).json({
      success: true,
      certificate_id: id,
      status: 'valid',
      message: 'Certificado reactivado exitosamente.'
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

