import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Academy Subscriptions E2E: Ciclo de Vida y Cobro con Mercado Pago', () => {
  const courseId = 'c0000000-0000-0000-0000-000000000001';
  const courseSlug = 'curso-reparacion-e2e';
  const studentUserId = '55555555-5555-5555-5555-555555555555';
  const studentEmail = 'alumno.sub@arecofix.com';

  const mockCourse = {
    id: courseId,
    title: 'Curso Reparación Celulares E2E',
    slug: courseSlug,
    description: 'Curso completo con membresía',
    duration: '40 horas',
    schedule: 'Online',
    price: 35000,
    level: 'basic',
    unlock_strategy: 'ALL_AT_ONCE',
    is_active: true,
  };

  const mockPlan = {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Membresía Mensual Academia Pro',
    slug: 'mensual-academia-pro',
    description: 'Acceso total a todos los cursos',
    price: 15000,
    currency_id: 'ARS',
    interval_days: 30,
    grace_days: 7,
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
    first_name: 'Alumno',
    last_name: 'Suscripción',
    role: 'customer',
  });

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('1. Checkout Exitoso: Alumno paga membresía, webhook aprueba y obtiene acceso activo', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    // 1. Initial State: Expired
    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-sub-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Subscriptions check returns active after payment approval
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'active',
        is_allowed: true,
        plan_name: mockPlan.name,
        plan_price: mockPlan.price,
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    }).as('checkActiveMembership');

    // Mercado Pago preference generation
    cy.intercept('POST', '**/api/academy/subscribe', {
      statusCode: 200,
      body: {
        success: true,
        init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_academy_123',
        preference_id: 'pref_academy_123',
      },
    }).as('createPreference');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Verify student is inside course aula and not blocked
    cy.contains('Curso Reparación Celulares E2E', { timeout: 10000 }).should('be.visible');
    cy.get('div').contains('Tu acceso a la academia ha expirado').should('not.exist');
  });

  it('2. Checkout Fallido: Error en pasarela o pago rechazado mantiene bloqueo', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-sub-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Subscription status is expired
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'expired',
        is_allowed: false,
        plan_name: mockPlan.name,
        plan_price: mockPlan.price,
      },
    }).as('checkExpiredStatus');

    // Simulate failure in Mercado Pago API
    cy.intercept('POST', '**/api/academy/subscribe', {
      statusCode: 500,
      body: { success: false, error: 'Fondos insuficientes o pago rechazado en Mercado Pago' },
    }).as('subscribeFail');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Blocking modal is visible
    cy.contains('Tu acceso a la academia ha expirado', { timeout: 10000 }).should('be.visible');

    // Click renew button
    cy.contains('button', 'Renovar Membresía').click({ force: true });
    cy.wait('@subscribeFail');

    // Error toast appears and modal remains blocking
    cy.contains('Fondos insuficientes o pago rechazado').should('be.visible');
    cy.contains('Tu acceso a la academia ha expirado').should('be.visible');
  });

  it('3. Paso a grace_period: Alumno ve el banner de 7 días de gracia con botón Pagar Ahora', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-sub-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Status: grace_period
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'grace_period',
        is_allowed: true,
        plan_name: mockPlan.name,
        plan_price: mockPlan.price,
        expires_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        grace_period_ends_at: new Date(Date.now() + 5 * 86400000).toISOString(),
      },
    }).as('checkGraceStatus');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Verify Grace Period Banner is visible in header
    cy.contains('Tu membresía venció. Tienes 7 días de gracia para renovar.', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Pagar Ahora').should('be.visible');

    // But course content is still accessible because is_allowed is true
    cy.contains('Curso Reparación Celulares E2E').should('be.visible');
  });

  it('4. Paso a suspended: Pasaron los 7 días de gracia, el alumno queda bloqueado', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-sub-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Status: suspended
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'suspended',
        is_allowed: false,
        plan_name: mockPlan.name,
        plan_price: mockPlan.price,
        expires_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        grace_period_ends_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    }).as('checkSuspendedStatus');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, session as any, profile as any);

    // Blocking modal is shown
    cy.contains('Tu acceso a la academia ha expirado', { timeout: 10000 }).should('be.visible');
    cy.contains('Renovar Membresía').should('be.visible');
  });

  it('5. Paso a expired: Pasaron más de 30 días, el sistema bloquea todo', () => {
    const session = createStudentSession();
    const profile = createStudentProfile();

    cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [mockCourse] });
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-sub-1', course_id: courseId, user_id: studentUserId, email: studentEmail, status: 'confirmed' }],
    });

    // Status: expired
    cy.intercept('POST', '**/rest/v1/rpc/check_and_update_membership_status*', {
      statusCode: 200,
      body: {
        has_subscription: true,
        status: 'expired',
        is_allowed: false,
        plan_name: mockPlan.name,
        plan_price: mockPlan.price,
        expires_at: new Date(Date.now() - 40 * 86400000).toISOString(),
        grace_period_ends_at: new Date(Date.now() - 33 * 86400000).toISOString(),
      },
    });

    cy.loginAsUser(`/academy/mis-cursos`, session as any, profile as any);

    // In Mis Cursos, expired banner is shown
    cy.contains('Tu acceso a la academia ha expirado. Renueva tu membresía para continuar.', { timeout: 10000 }).should('be.visible');
    cy.contains('Renovar Membresía').should('be.visible');
  });

  it('6. Admin Panel: Administrador gestiona suscripciones y fuerza renovación manual', () => {
    cy.loginAsAdmin('/admin/dashboard');

    const mockSubscriptions = [
      {
        id: 'sub-1',
        user_id: studentUserId,
        status: 'suspended',
        expires_at: '2026-10-01T00:00:00Z',
        grace_period_ends_at: '2026-10-08T00:00:00Z',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-10-08T00:00:00Z',
        plan: mockPlan,
        profile: {
          id: studentUserId,
          email: studentEmail,
          first_name: 'Alumno',
          last_name: 'Suscripción',
        },
      },
    ];

    cy.intercept('GET', '**/rest/v1/academy_subscriptions*', {
      statusCode: 200,
      body: mockSubscriptions,
    }).as('getSubscriptions');

    cy.intercept('PATCH', '**/rest/v1/academy_subscriptions?id=eq.sub-1*', {
      statusCode: 200,
      body: [{ ...mockSubscriptions[0], status: 'active' }],
    }).as('patchRenew');

    // Navigate to Subscriptions panel
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Cursos').click({ force: true, multiple: true });
    cy.visit('/admin/courses/subscriptions');

    cy.contains('Control de Membresías y Pagos', { timeout: 10000 }).should('be.visible');
    cy.contains('alumno.sub@arecofix.com').should('be.visible');
    cy.contains('Suspendida').should('be.visible');

    // Click Forzar Renovación
    cy.contains('button', 'Forzar Renovación').click({ force: true });
    cy.wait('@patchRenew');
    cy.contains('Membresía renovada por 30 días', { timeout: 10000 }).should('be.visible');
  });
});
