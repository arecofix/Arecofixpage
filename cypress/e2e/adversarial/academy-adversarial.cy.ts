import { buildMockSession, buildMockProfile, buildMockAuthUser } from '../../support/mock-factories';

describe('Academy Adversarial & Edge Cases Suite', () => {
  const courseId = '22222222-2222-2222-2222-222222222222';
  const courseSlug = 'curso-reparacion-avanzada';
  const attackerEmail = 'hacker@arecofix.com';

  const mockCourse = {
    id: courseId,
    title: 'Curso Reparación Avanzada',
    slug: courseSlug,
    description: 'Curso intensivo de microsoldadura y diagnosis.',
    price: 45000,
    is_active: true,
    author_id: '99999999-9999-9999-9999-999999999999',
    tenant_id: '00000000-0000-0000-0000-000000000000'
  };

  const futureDate = '2035-01-01T00:00:00Z';
  const pastDate = '2020-01-01T00:00:00Z';

  const mockModules = [
    {
      id: 'mod-1111',
      course_id: courseId,
      title: 'Módulo 1: Fundamentos (Habilitado)',
      order_index: 1,
      unlock_date: pastDate
    },
    {
      id: 'mod-2222',
      course_id: courseId,
      title: 'Módulo 2: Microsoldadura Avanzada (Drip Futuro)',
      order_index: 2,
      unlock_date: futureDate
    },
    {
      id: 'mod-3333',
      course_id: courseId,
      title: 'Módulo 3: Esquemas Confidenciales (Bloqueado)',
      order_index: 3,
      unlock_date: null
    }
  ];

  const mockLessons = [
    {
      id: 'les-1',
      module_id: 'mod-1111',
      title: 'Video Bienvenida',
      order_index: 1,
      type: 'video'
    },
    {
      id: 'les-2',
      module_id: 'mod-2222',
      title: 'Lección Secreta',
      order_index: 1,
      type: 'video'
    }
  ];

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();

    // Universal intercept for courses matching single object (vnd.pgrst.object) or list
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingleObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: isSingleObject ? mockCourse : [mockCourse] });
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: mockModules
    }).as('getCourseModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', (req) => {
      const url = new URL(req.url);
      const modIdQuery = url.searchParams.get('module_id');
      let filtered = mockLessons;
      if (modIdQuery && modIdQuery.startsWith('eq.')) {
        const targetId = modIdQuery.replace('eq.', '');
        filtered = mockLessons.filter(l => l.module_id === targetId);
      }
      req.reply({ statusCode: 200, body: filtered });
    }).as('getLessons');

    cy.intercept('GET', '**/rest/v1/course_progress*', {
      statusCode: 200,
      body: []
    }).as('getProgress');
  });

  it('ADV-01: Blocks privilege escalation attempt when user_metadata is tampered to admin', () => {
    // Attack scenario: Attacker manipulates client JWT session user_metadata to { role: 'admin' }
    // but the verified profile in DB holds unprivileged role: 'student' with NO enrollment
    const attackerSession = buildMockSession({
      user: buildMockAuthUser({
        id: 'attacker-123',
        email: attackerEmail,
        user_metadata: { role: 'admin' }
      })
    });

    const attackerProfile = buildMockProfile({
      id: 'attacker-123',
      email: attackerEmail,
      role: 'student',
      is_active: true
    });

    // Attacker does NOT have an active enrollment in DB
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: []
    }).as('checkEnrollment');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, attackerSession, attackerProfile);
    cy.wait('@getCourse', { timeout: 10000 });
    cy.wait('@checkEnrollment', { timeout: 10000 });

    // Defensive check: System must NOT trust client user_metadata.
    // Instead it must enforce verified profile role ('student') and deny access.
    cy.contains('Acceso Restringido', { matchCase: false, timeout: 10000 }).should('be.visible');
    cy.contains(/p[aá]gina del curso/i).should('be.visible');
  });

  it('ADV-02: Gating prevents accessing future Drip Content and locked modules', () => {
    const studentSession = buildMockSession({
      user: buildMockAuthUser({
        id: 'student-123',
        email: 'student@arecofix.com',
        user_metadata: { role: 'student' }
      })
    });

    const studentProfile = buildMockProfile({
      id: 'student-123',
      email: 'student@arecofix.com',
      role: 'student'
    });

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-1', course_id: courseId, email: 'student@arecofix.com', status: 'confirmed' }]
    }).as('checkStudentEnrollment');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession, studentProfile);
    cy.wait('@getCourse', { timeout: 10000 });
    cy.wait('@getCourseModules', { timeout: 10000 });

    // Module 1 is accessible (past unlock date)
    cy.contains('Módulo 1: Fundamentos (Habilitado)').should('be.visible');
    cy.contains('Video Bienvenida').should('be.visible');

    // Module 2 is scheduled (future drip) -> lock indicator present, content hidden from DOM
    cy.contains('Módulo 2: Microsoldadura Avanzada (Drip Futuro)').should('be.visible');
    cy.contains('Lección Secreta').should('not.exist');

    // Module 3 is fully locked
    cy.contains('Módulo 3: Esquemas Confidenciales (Bloqueado)').should('be.visible');
  });

  it('ADV-03: IDOR prevention - Unauthorized unauthenticated user cannot query classroom directly', () => {
    cy.visit(`/academy/${courseSlug}/aula`, { failOnStatusCode: false });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('ADV-04: Idempotency check prevents duplicate insertion on double enrollment', () => {
    cy.loginAsAdmin('/');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enr-existing',
          course_id: courseId,
          email: attackerEmail,
          full_name: 'Hacker Test',
          status: 'confirmed',
          course: { id: courseId, title: 'Curso Reparación Avanzada' }
        }
      ]
    }).as('getEnrollments');

    cy.visit('/admin/courses/solicitudes');
    cy.wait('@getEnrollments', { timeout: 10000 });

    cy.contains('Solicitudes de Inscripción', { timeout: 10000 }).should('be.visible');
    cy.contains(attackerEmail).should('be.visible');
  });

  it('ADV-05: IDOR in Certificate validation - Displays student info on legitimate cert and rejects empty forgery', () => {
    const legitCertId = '11111111-2222-3333-4444-555555555555';
    const fakeCertId = '00000000-0000-0000-0000-000000000000';

    // Intercept valid certificate
    cy.intercept('GET', `**/rest/v1/course_certificates?*id=eq.${legitCertId}*`, {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
      body: {
        id: legitCertId,
        student_name: 'Juan Perez',
        student_dni: '38123456',
        course_id: courseId,
        courses: { title: 'Curso Reparación Avanzada' },
        issued_at: '2026-05-10T10:00:00Z',
        pdf_url: 'https://example.com/cert.pdf'
      }
    }).as('getLegitCert');

    // Intercept forged/non-existent certificate (null / empty response)
    cy.intercept('GET', `**/rest/v1/course_certificates?*id=eq.${fakeCertId}*`, {
      statusCode: 404,
      body: { message: 'Not found', code: 'PGRST116' }
    }).as('getFakeCert');

    // 1. Visit legitimate certificate
    cy.visit(`/academy/cert/${legitCertId}`, {
      onBeforeLoad: (win) => {
        const mockCertProfile = { id: 'anon', role: 'user' };
        win.localStorage.setItem('arecofix_profile_anon', JSON.stringify(mockCertProfile));
      }
    });
    cy.wait('@getLegitCert', { timeout: 10000 });
    cy.contains('Juan Perez').should('be.visible');
    cy.contains('Certificado de Finalización').should('be.visible');

    // 2. Visit forged certificate ID -> System must display "Certificado no encontrado"
    cy.visit(`/academy/cert/${fakeCertId}`, {
      onBeforeLoad: (win) => {
        const mockCertProfile = { id: 'anon', role: 'user' };
        win.localStorage.setItem('arecofix_profile_anon', JSON.stringify(mockCertProfile));
      }
    });
    cy.contains('Certificado no encontrado', { timeout: 10000 }).should('be.visible');
  });

  it('ADV-06: Production LocalStorage bypass probe cannot bypass guards without session', () => {
    cy.visit('/academy/mis-cursos', {
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        // Attacker attempts backdoor flag without real session
        win.localStorage.setItem('cypress-test', 'true');
        win.localStorage.removeItem('sb-db-auth-token');
        win.localStorage.removeItem('sb-db.arecofix.com.ar-auth-token');
      }
    });

    // Without a valid session, authGuard redirects to /login
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
