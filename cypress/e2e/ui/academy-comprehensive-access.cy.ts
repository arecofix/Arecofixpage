import {
  CourseEnrollment,
} from '../../../src/app/features/academy/domain/models/academy.models';

const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk';

describe('Academy: Comprehensive Access Control', () => {
  const courseId = 'course-uuid-123';
  const courseSlug = 'carrera-completa-experto-en-reparacion-de-celulares-y-tablets';

  const studentUser = {
    id: 'student-user-456',
    email: 'student@test.com',
    role: 'customer',
    app_metadata: { provider: 'email' },
    user_metadata: { role: 'customer' }
  };

  const studentProfile = {
    id: 'student-user-456',
    email: 'student@test.com',
    first_name: 'Juan',
    last_name: 'Alumno',
    role: 'customer',
    is_active: true,
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: 'branch-1'
  };

  const studentSession = {
    access_token: VALID_JWT,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh',
    token_type: 'bearer',
    user: studentUser
  };

  const courseMock = {
    id: courseId,
    title: 'Carrera Completa Experto en Reparacion',
    slug: courseSlug,
    is_active: true,
    author_id: 'instructor-user-789',
    tenant_id: '00000000-0000-0000-0000-000000000000',
    description: 'Aprende todo sobre reparacion de celulares',
    price: 15000,
    thumbnail_url: null
  };

  const modulesMock = [
    { id: 'module-unlocked-1', course_id: courseId, title: 'Unidad 1 - Fundamentos', order_index: 1, unlock_date: '2020-01-01T00:00:00Z', is_locked: false },
    { id: 'module-locked-2', course_id: courseId, title: 'Unidad 2 - Avanzado', order_index: 2, unlock_date: '2035-01-01T00:00:00Z', is_locked: true }
  ];

  const lessonsMock = [
    { id: 'lesson-1', module_id: 'module-unlocked-1', title: 'Introduccion a la Reparacion', order_index: 1, type: 'video' },
    { id: 'lesson-secret', module_id: 'module-locked-2', title: 'Tecnicas Avanzadas Secreto', order_index: 1, type: 'video' }
  ];

  const confirmedEnrollment: CourseEnrollment = {
    id: 'enr-123',
    course_id: courseId,
    student_id: studentProfile.id,
    payment_status: 'confirmed',
    enrolled_at: new Date().toISOString(),
    expires_at: null,
    is_active: true,
    course: courseMock as any
  };

  const setupClassroomIntercepts = () => {
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: wantsObject ? courseMock : [courseMock] });
    }).as('getCourse');
    cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
    cy.intercept('GET', '**/rest/v1/course_lessons*', (req) => {
      const url = new URL(req.url);
      const modIdQuery = url.searchParams.get('module_id');
      let filtered = lessonsMock;
      if (modIdQuery && modIdQuery.startsWith('eq.')) {
         const id = modIdQuery.replace('eq.', '');
         filtered = lessonsMock.filter(l => l.module_id === id);
      }
      req.reply({ statusCode: 200, body: filtered });
    }).as('getLessons');
  };

  // ── Suite 1: Guest (No Auth) ──────────────────────────────────────────────
  describe('Guest (No Authentication)', () => {
    it('redirects /academy/mis-cursos to /login', () => {
      cy.visit('/academy/mis-cursos', { failOnStatusCode: false });
      cy.url().should('include', '/login');
    });

    it('redirects /aula to /login', () => {
      cy.visit(`/academy/${courseSlug}/aula`, { failOnStatusCode: false });
      cy.url().should('include', '/login');
    });

    it('shows academy catalog publicly without auth', () => {
      cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [courseMock] });
      cy.visit('/academy');
      cy.contains('Carrera Completa Experto en Reparacion').should('be.visible');
    });
  });

  // ── Suite 2: Enrolled Student ──────────────────────────────────────────────
  describe('Enrolled Student (Happy Path)', () => {
    beforeEach(() => {
      setupClassroomIntercepts();
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [confirmedEnrollment] }).as('getEnrollments');
    });

    it('shows enrolled courses in /academy/mis-cursos', () => {
      cy.loginAsUser('/academy/mis-cursos', studentSession, studentProfile);
      cy.wait('@getEnrollments', { timeout: 10000 });
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('can access the classroom /aula when enrolled', () => {
      cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession, studentProfile);
      cy.wait('@getCourse', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false }).should('not.exist');
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('shows unlocked module content in the classroom', () => {
      cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession, studentProfile);
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 1 - Fundamentos', { timeout: 10000 }).should('be.visible');
      cy.contains('Introduccion a la Reparacion').should('be.visible');
    });

    it('hides lessons inside locked modules for students', () => {
      cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession, studentProfile);
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 2 - Avanzado', { timeout: 10000 }).should('be.visible');
      cy.contains('Tecnicas Avanzadas Secreto').should('not.exist');
      cy.contains('Bloqueado (vista admin)').should('not.exist');
    });
  });

  // ── Suite 3: Unenrolled Student ────────────────────────────────────────────
  describe('Unenrolled Student (Access Denied)', () => {
    beforeEach(() => {
      setupClassroomIntercepts();
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] }).as('getEnrollmentEmpty');
    });

    it('shows "Acceso Restringido" when not enrolled', () => {
      cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession, studentProfile);
      cy.wait('@getEnrollmentEmpty', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.contains(/p[aá]gina del curso/i).should('be.visible');
    });

    it('shows empty state in /mis-cursos when not enrolled', () => {
      cy.loginAsUser('/academy/mis-cursos', studentSession, studentProfile);
      cy.wait('@getEnrollmentEmpty', { timeout: 10000 });
      cy.contains(/a[uú]n no tienes cursos/i, { timeout: 10000 }).should('be.visible');
    });
  });

  // ── Suite 4: Admin Bypass ────────────────────────────────────────────
  describe('Admin (Enrollment Bypass)', () => {
    beforeEach(() => {
      setupClassroomIntercepts();
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] }).as('getEnrollmentEmpty');
    });

    it('can access the classroom without enrollment', () => {
      cy.loginRealAdmin();
      cy.visit(`/academy/${courseSlug}/aula`);
      cy.wait('@getCourse', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false }).should('not.exist');
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('can see locked modules with "Bloqueado (vista admin)" badge', () => {
      cy.loginRealAdmin();
      cy.visit(`/academy/${courseSlug}/aula`);
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 2 - Avanzado', { timeout: 10000 }).should('be.visible');
      cy.contains('Tecnicas Avanzadas Secreto').should('be.visible');
      cy.contains('Bloqueado (vista admin)').should('be.visible');
    });
  });

  // ── Suite 5: Multiple Enrollments ────────────────────────────────────────
  describe('Multiple Enrollments in /mis-cursos', () => {
    it('shows all enrolled courses', () => {
      const courseMock2 = { ...courseMock, id: 'course-2', title: 'Curso Secundario', slug: 'curso-sec' };
      const enrollment2 = { ...confirmedEnrollment, id: 'enr-999', course_id: 'course-2', course: courseMock2 };

      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [confirmedEnrollment, enrollment2] }).as('getMultipleEnrollments');
      cy.loginAsUser('/academy/mis-cursos', studentSession, studentProfile);
      
      cy.wait('@getMultipleEnrollments', { timeout: 10000 });
      cy.contains('Carrera Completa Experto en Reparacion').should('be.visible');
      cy.contains('Curso Secundario').should('be.visible');
    });
  });
});
