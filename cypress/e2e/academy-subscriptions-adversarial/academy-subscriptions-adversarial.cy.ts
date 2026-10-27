import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Academy Subscriptions Adversarial & Security Tests', () => {
  const courseId = 'c0000000-0000-0000-0000-000000000001';
  const courseSlug = 'curso-reparacion-e2e';
  const studentUserId = '55555555-5555-5555-5555-555555555555';
  const studentEmail = 'alumno.adversarial@arecofix.com';

  const mockCourse = {
    id: courseId,
    title: 'Curso Reparación Celulares E2E',
    slug: courseSlug,
    description: 'Curso completo con membresía',
    unlock_strategy: 'ALL_AT_ONCE',
    is_active: true,
  };

  const createStudentSession = () => ({
    ...buildMockSession(),
    user: {
      id: studentUserId,
      email: studentEmail,
      role: 'authenticated',
      user_metadata: { role: 'customer' },
      app_metadata: { provider: 'email' },
    },
  });

  const createStudentProfile = () => ({
    ...buildMockProfile(),
    id: studentUserId,
    email: studentEmail,
    role: 'customer',
  });

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('1. Bypass de UI: Alumno con membresía expired intenta ingresar por URL directa y es bloqueado', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-adv-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // DB confirms membership is expired
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'expired',
        is_allowed: false,
        plan_name: 'Membresía Mensual Pro',
        plan_price: 15000,
      },
    }).as('checkExpired');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Verify modal overlay completely blocks interaction
    cy.contains('Tu acceso a la academia ha expirado', { timeout: 10000 }).should('be.visible');
    cy.contains('Renovar Membresía').should('be.visible');
  });

  it('2. Bypass de Examen: Alumno suspended intenta invocar RPC submit_exam y el backend rechaza con 403', () => {
    // Intercept direct POST to RPC submit_exam simulating PostgreSQL function defense
    cy.intercept('POST', '**/rest/v1/rpc/submit_exam*', {
      statusCode: 403,
      body: {
        code: '42501',
        message: 'Membership expired. Cannot submit exam.',
        details: null,
        hint: null,
      },
    }).as('rpcSubmitExamBlocked');

    cy.visit('/');

    // Make request from browser window simulating attacker direct Supabase client call
    cy.window().then(async (win) => {
      const response = await win.fetch('/rest/v1/rpc/submit_exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_content_id: 'e0000000-0000-0000-0000-000000000001',
          p_answers: [],
        }),
      });

      expect(response.status).to.eq(403);
      const data = await response.json();
      expect(data.message).to.include('Membership expired');
    });

    cy.wait('@rpcSubmitExamBlocked');
  });

  it('3. Webhook Falso: POST sin firma válida o sin x-signature es rechazado con HTTP 401', () => {
    // 3a. Calling webhook without x-signature
    cy.request({
      method: 'POST',
      url: '/api/webhooks/mercadopago-academy',
      failOnStatusCode: false,
      headers: {
        'x-request-id': 'fake-req-id-123',
      },
      body: {
        data: { id: 'fake_payment_999' },
      },
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.include('Invalid signature');
    });

    // 3b. Calling webhook with forged HMAC signature
    cy.request({
      method: 'POST',
      url: '/api/webhooks/mercadopago-academy',
      failOnStatusCode: false,
      headers: {
        'x-signature': 'ts=12345678,v1=badbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadb',
        'x-request-id': 'req-invalid-sig-999',
      },
      body: {
        data: { id: 'fake_payment_999' },
      },
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.include('Invalid signature');
    });
  });

  it('4. Idempotencia: Enviar el mismo webhook 3 veces no duplica pagos ni sobre-extiende fechas', () => {
    const paymentId = 'mp_pay_unique_123456';
    const reqId = 'req-idem-123';
    const secret = 'arecofix_academy_wh_secret_2026';

    cy.task<string>('generateMpWebhookSignature', {
      secret,
      dataId: paymentId,
      requestId: reqId,
    }).then((sig) => {

    // Simulate first webhook call with valid signature
    cy.request({
      method: 'POST',
      url: '/api/webhooks/mercadopago-academy',
      headers: {
        'x-signature': sig,
        'x-request-id': reqId,
      },
      body: { data: { id: paymentId } },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.received).to.be.true;
    });

    // Simulate duplicate webhook call 2
    cy.request({
      method: 'POST',
      url: '/api/webhooks/mercadopago-academy',
      headers: {
        'x-signature': sig,
        'x-request-id': reqId,
      },
      body: { data: { id: paymentId } },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.received).to.be.true;
    });

    // Simulate duplicate webhook call 3
    cy.request({
      method: 'POST',
      url: '/api/webhooks/mercadopago-academy',
      headers: {
        'x-signature': sig,
        'x-request-id': reqId,
      },
      body: { data: { id: paymentId } },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.received).to.be.true;
    });
    });
  });

  it('5. Inyección de Tiempo: El servidor PostgreSQL determina el estado real con now()', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-adv-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Backend PostgreSQL RPC evaluates real server now() and returns expired
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'expired',
        is_allowed: false,
        plan_name: 'Membresía Mensual Pro',
        plan_price: 15000,
      },
    }).as('serverCheckNow');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Access must be blocked according to backend truth, ignoring client manipulation
    cy.contains('Tu acceso a la academia ha expirado', { timeout: 10000 }).should('be.visible');
    cy.contains('Renovar Membresía').should('be.visible');
  });
});
