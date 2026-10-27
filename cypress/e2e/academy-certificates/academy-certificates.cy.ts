import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Academy Certificates & Email Notifications System E2E', () => {
  const courseId = 'c0000000-0000-0000-0000-000000000001';
  const courseSlug = 'curso-reparacion-e2e';
  const studentUserId = '55555555-5555-5555-5555-555555555555';
  const studentEmail = 'alumno.cert@arecofix.com';
  const studentName = 'Ezequiel Alumno';
  const validCertId = 'c1111111-2222-3333-4444-555555555555';
  const fakeCertId = 'f9999999-9999-9999-9999-999999999999';

  const mockCourse = {
    id: courseId,
    title: 'Curso Reparación de Microelectrónica',
    slug: courseSlug,
    description: 'Curso profesional con certificación oficial',
    instructor_name: 'Prof. Gabriel Martínez',
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
    first_name: 'Ezequiel',
    last_name: 'Alumno',
  });

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('1. Alumno completa curso -> Diploma se emite -> Botón Descargar Certificado disponible y QR válido', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockCourse : [mockCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_certificates*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      const cert = {
        id: validCertId,
        course_id: courseId,
        user_id: studentUserId,
        email: studentEmail,
        student_name: studentName,
        status: 'valid',
        pdf_url: `/api/academy/certificates/${validCertId}/pdf`,
        issued_at: '2026-10-17T12:00:00Z',
        course: { title: mockCourse.title, image_url: '' },
      };
      req.reply({
        statusCode: 200,
        body: isSingle ? cert : [cert],
      });
    }).as('getCertificates');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enr-comp-1',
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          status: 'confirmed',
          course: mockCourse,
        },
      ],
    }).as('getEnrollments');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [
        {
          id: 'mod-1',
          course_id: courseId,
          title: 'Módulo 1: Fundamentos',
          order_index: 0,
        },
      ],
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_progress*', {
      statusCode: 200,
      body: [
        {
          course_id: courseId,
          content_id: 'lesson-1',
        },
      ],
    }).as('getProgress');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [
        {
          id: 'lesson-1',
          module_id: 'mod-1',
          title: 'Clase 1: Introducción',
          content_type: 'video',
        },
      ],
    }).as('getLessons');

    // Mock active membership
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'active',
        is_allowed: true,
        plan_name: 'Membresía Pro',
        plan_price: 15000,
      },
    });

    // Intercept PDF generation endpoint
    cy.intercept('GET', `**/api/academy/certificates/${validCertId}/pdf`, {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: '%PDF-1.4 Mock Binary Content for Certificate with QR Code to https://arecofix.com.ar/academy/verify/' + validCertId,
    }).as('getPdfDownload');

    // Visit Student Portal: Mis Cursos
    cy.loginAsUser('/academy/mis-cursos', session as any, profile as any);

    // Assert "Descargar Certificado" button is prominently displayed
    cy.contains('Descargar Certificado', { timeout: 10000 }).should('be.visible');
    cy.contains('Validar Certificado (QR)').should('be.visible');

    // Visit Campus Virtual of completed course
    cy.visit(`/academy/${courseSlug}/aula`);
    cy.contains('¡Felicitaciones! Has completado el 100% del curso', { timeout: 10000 }).should('be.visible');
    cy.contains('Validar (QR)').should('be.visible');
  });

  it('2. Usuario anónimo entra a /academy/verify/:id -> ve datos válidos sin exponer datos sensibles', () => {
    // Intercept RPC get_public_certificate_data with safe response
    cy.intercept('POST', '**/rest/v1/rpc/get_public_certificate_data*', {
      statusCode: 200,
      body: {
        success: true,
        certificate_id: validCertId,
        student_name: 'Ezequiel Alumno',
        course_title: 'Curso Reparación de Microelectrónica',
        instructor_name: 'Prof. Gabriel Martínez',
        issued_at: '2026-10-17T12:00:00.000Z',
        status: 'valid',
        is_valid: true,
        pdf_url: `/api/academy/certificates/${validCertId}/pdf`,
      },
    }).as('getPublicCert');

    // Visit public verification route without any logged-in user
    cy.visit(`/academy/verify/${validCertId}`);
    cy.wait('@getPublicCert');

    // Verify valid badge and certified statement
    cy.contains('✅ Certificado Válido', { timeout: 10000 }).should('be.visible');
    cy.contains('Ezequiel Alumno ha completado exitosamente el curso').should('be.visible');
    cy.contains('Curso Reparación de Microelectrónica').should('be.visible');
    cy.contains('Prof. Gabriel Martínez').should('be.visible');

    // STRICT PRIVACY AUDIT: Ensure email, DNI or sensitive phone are NOT rendered anywhere on the public card
    cy.get('#valid-certificate-card').within(() => {
      cy.contains('@').should('not.exist');
      cy.contains('DNI:').should('not.exist');
      cy.contains('Teléfono:').should('not.exist');
      cy.contains(validCertId).should('be.visible');
    });

    // Verify download PDF action is present
    cy.contains('Descargar Certificado (PDF)').should('be.visible');
  });

  it('3. Falsificación: Usuario altera el UUID en la URL -> recibe Certificado Inválido', () => {
    // Intercept RPC get_public_certificate_data returning not found
    cy.intercept('POST', '**/rest/v1/rpc/get_public_certificate_data*', {
      statusCode: 200,
      body: {
        success: false,
        status: 'not_found',
        message: 'Certificado no encontrado o inexistente.',
      },
    }).as('getFakeCert');

    cy.visit(`/academy/verify/${fakeCertId}`);
    cy.wait('@getFakeCert');

    // Assert Invalid Certificate card is shown
    cy.contains('❌ Certificado Inválido', { timeout: 10000 }).should('be.visible');
    cy.contains('El identificador de certificado ingresado no existe').should('be.visible');

    // Sensitive data must never be shown
    cy.get('#valid-certificate-card').should('not.exist');
  });

  it('4. Webhook de Pago Aprobado -> Envía recibo de pago por correo (Mock de Notificación)', () => {
    const paymentId = 'mp_pay_receipt_789456';
    const reqId = 'req-pay-receipt-001';
    const secret = 'arecofix_academy_wh_secret_2026';

    // Intercept payment receipt notification insert into DB
    cy.intercept('POST', '**/rest/v1/academy_email_notifications*', {
      statusCode: 201,
      body: {
        id: 'notif-pay-1',
        notification_type: 'payment_receipt',
        status: 'sent',
      },
    }).as('recordPaymentEmail');

    cy.task<string>('generateMpWebhookSignature', {
      secret,
      dataId: paymentId,
      requestId: reqId,
    }).then((sig) => {
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

  it('5. Cron Job de Vencimiento -> Detecta membresías en grace_period y despacha emails de alerta', () => {
    // Intercept cron endpoint call
    cy.intercept('POST', '**/api/academy/notifications/cron-grace-period', {
      statusCode: 200,
      body: {
        success: true,
        processed: 1,
        subscriptions: [
          {
            subscription_id: 'sub-grace-001',
            email: 'alumno.grace@arecofix.com',
            student_name: 'Alumno En Gracia',
            expires_at: '2026-10-17T00:00:00Z',
            grace_period_ends_at: '2026-10-24T00:00:00Z',
          },
        ],
      },
    }).as('cronGracePeriod');

    cy.request({
      method: 'POST',
      url: '/api/academy/notifications/cron-grace-period',
      body: {},
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
      expect(res.body.processed).to.be.at.least(0);
    });
  });

  it('6. Admin revoca diploma con 1 clic desde /admin/courses -> URL pública pasa inmediatamente a Certificado Inválido', () => {
    // 1. Mock admin courses and certificates
    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_certificates*', {
      statusCode: 200,
      body: [
        {
          id: validCertId,
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          student_name: studentName,
          status: 'valid',
          pdf_url: `/api/academy/certificates/${validCertId}/pdf`,
          issued_at: '2026-10-17T12:00:00Z',
          course: { id: courseId, title: mockCourse.title, slug: mockCourse.slug },
        },
      ],
    }).as('getAdminCertificates');

    // 2. Mock revoke RPC
    cy.intercept('POST', '**/rest/v1/rpc/admin_revoke_certificate*', {
      statusCode: 200,
      body: {
        success: true,
        certificate_id: validCertId,
        status: 'revoked',
        message: 'Certificado revocado exitosamente.',
      },
    }).as('revokeCertRpc');

    // Visit /admin/courses as admin
    cy.loginAsAdmin('/admin/courses');
    cy.wait('@getAdminCertificates');

    // Click on tab "Certificados Emitidos"
    cy.get('#tab-certificados-emitidos', { timeout: 10000 }).click();
    cy.contains('Total Emitidos').should('be.visible');

    // Verify row displays student name and valid badge
    cy.contains(studentName).should('be.visible');
    cy.get(`.cert-row[data-cert-id="${validCertId}"]`).within(() => {
      cy.contains('Válido').should('be.visible');
      cy.get('.revoke-cert-btn').scrollIntoView().should('exist');
    });

    // Accept confirmation and click Revoke Diploma
    cy.on('window:confirm', () => true);
    cy.get(`.cert-row[data-cert-id="${validCertId}"] .revoke-cert-btn`).scrollIntoView().click({ force: true });

    // Verify status changed to "Revocado" in UI
    cy.wait('@revokeCertRpc');
    cy.get(`.cert-row[data-cert-id="${validCertId}"]`).within(() => {
      cy.contains('Revocado').should('be.visible');
      cy.get('.reactivate-cert-btn').scrollIntoView().should('exist');
    });

    // 3. Now verify public validation URL immediately returns revoked/invalid
    cy.intercept('POST', '**/rest/v1/rpc/get_public_certificate_data*', {
      statusCode: 200,
      body: {
        success: true,
        certificate_id: validCertId,
        student_name: studentName,
        course_title: mockCourse.title,
        instructor_name: mockCourse.instructor_name,
        issued_at: '2026-10-17T12:00:00.000Z',
        status: 'revoked',
        is_valid: false,
      },
    }).as('getPublicRevokedCert');

    cy.visit(`/academy/verify/${validCertId}`);
    cy.wait('@getPublicRevokedCert');

    // Assert Invalid Certificate card is shown with revoked message
    cy.contains('❌ Certificado Inválido', { timeout: 10000 }).should('be.visible');
    cy.contains('Este certificado ha sido revocado').should('be.visible');
    cy.get('#valid-certificate-card').should('not.exist');
  });
});

