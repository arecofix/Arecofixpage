/**
 * Academy Comprehensive Access Tests
 *
 * Strategy: All intercepts are defined AFTER cy.loginAsUser/cy.loginAsAdmin
 * to ensure they take priority. Then we navigate to the actual URL.
 * This avoids ordering conflicts with loginAsUser's own intercepts.
 */

describe('Academy: Comprehensive Access Control', () => {
  const courseSlug = 'carrera-completa-experto-en-reparacion-de-celulares-y-tablets';
  const courseId = 'course-abc-123';

  // Valid JWT (same one used in loginAsAdmin to pass Supabase local token check)
  const VALID_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk';

  const studentUser = {
    id: 'student-user-456',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'student@test.com',
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email' },
    user_metadata: { role: 'customer' },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
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
    { id: 'module-unlocked-1', course_id: courseId, title: 'Unidad 1 - Fundamentos', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' },
    { id: 'module-locked-2', course_id: courseId, title: 'Unidad 2 - Avanzado', order_index: 2, unlock_date: '2035-01-01T00:00:00Z' }
  ];

  const lessonsMock = [
    { id: 'lesson-1', module_id: 'module-unlocked-1', title: 'Introduccion a la Reparacion', order_index: 1, type: 'video' },
    { id: 'lesson-secret', module_id: 'module-locked-2', title: 'Tecnicas Avanzadas Secreto', order_index: 1, type: 'video' }
  ];

  const confirmedEnrollment = {
    id: 'enrollment-1',
    course_id: courseId,
    user_id: 'student-user-456',
    email: 'student@test.com',
    status: 'confirmed',
    course: courseMock
  };

  // Helper: visit a URL as a student user (bypasses authGuard via localStorage + intercepts)
  const visitAsStudent = (url: string) => {
    // Set up all REST intercepts FIRST, before visit
    cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAllRest');
    cy.intercept('**/rpc/**', { statusCode: 200, body: [] }).as('catchAllRpc');
    cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser }).as('getAuthUser');
    cy.intercept('POST', '**/auth/v1/token*', { statusCode: 200, body: { ...studentSession, user: studentUser } }).as('refreshToken');
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: wantsObject ? studentProfile : [studentProfile] });
    }).as('getProfile');
    cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] }).as('getTenants');
    cy.intercept('GET', '**/rest/v1/branches*', { statusCode: 200, body: [{ id: 'branch-1', name: 'Sede Central' }] }).as('getBranches');

    cy.visit(url, {
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
        win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
        win.localStorage.setItem('supabase-remember-me', 'true');
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
        win.localStorage.setItem('cypress-test', 'true');
        if ((win as any).indexedDB) {
          (win as any).indexedDB.deleteDatabase('ArecofixOfflineDB');
        }
      }
    });
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
      cy.intercept('GET', '**/rest/v1/courses*', { statusCode: 200, body: [courseMock] }).as('getPublicCourses');
      cy.visit('/academy', { failOnStatusCode: false });
      cy.url().should('include', '/academy');
      cy.get('body').should('not.contain', 'Error 500');
    });
  });

  // ── Suite 2: Enrolled Student — Happy Path ─────────────────────────────────

  describe('Enrolled Student (Happy Path)', () => {
    it('shows enrolled courses in /academy/mis-cursos', () => {
      // Override specific intercepts AFTER setting catch-all
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAllRest');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', {
        statusCode: 200,
        body: [confirmedEnrollment]
      }).as('getEnrollments');
      cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
        req.reply({ statusCode: 200, body: [studentProfile] });
      }).as('getProfileOverride');
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser }).as('getAuthUserOverride');
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/branches*', { statusCode: 200, body: [{ id: 'branch-1', name: 'Sede Central' }] });
      cy.intercept('POST', '**/auth/v1/token*', { statusCode: 200, body: { ...studentSession } });

      cy.visit('/academy/mis-cursos', {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getEnrollments', { timeout: 10000 });
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('can access the classroom /aula when enrolled', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAllRest');
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
        req.reply({ statusCode: 200, body: wantsObject ? courseMock : [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [confirmedEnrollment] }).as('getEnrollments');
      cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
      cy.intercept('GET', '**/rest/v1/course_lessons*', { statusCode: 200, body: lessonsMock }).as('getLessons');
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/branches*', { statusCode: 200, body: [{ id: 'branch-1', name: 'Sede Central' }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit(`/academy/${courseSlug}/aula`, {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getCourse', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false }).should('not.exist');
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('shows unlocked module content in the classroom', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        req.reply({ statusCode: 200, body: [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [confirmedEnrollment] }).as('getEnrollments');
      cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
      cy.intercept('GET', '**/rest/v1/course_lessons*', { statusCode: 200, body: lessonsMock });
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit(`/academy/${courseSlug}/aula`, {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getCourse', { timeout: 10000 });
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 1 - Fundamentos', { timeout: 10000 }).should('be.visible');
      cy.contains('Introduccion a la Reparacion').should('be.visible');
    });

    it('hides lessons inside locked modules for students', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        req.reply({ statusCode: 200, body: [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [confirmedEnrollment] }).as('getEnrollments');
      cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
      cy.intercept('GET', '**/rest/v1/course_lessons*', { statusCode: 200, body: lessonsMock });
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit(`/academy/${courseSlug}/aula`, {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getCourse', { timeout: 10000 });
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 2 - Avanzado', { timeout: 10000 }).should('be.visible');
      cy.contains('Tecnicas Avanzadas Secreto').should('not.exist');
      cy.contains('Bloqueado (vista admin)').should('not.exist');
    });
  });

  // ── Suite 3: Unenrolled Student ────────────────────────────────────────────

  describe('Unenrolled Student (Access Denied)', () => {
    it('shows "Acceso Restringido" when not enrolled', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
        req.reply({ statusCode: 200, body: wantsObject ? courseMock : [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] }).as('getEnrollmentEmpty');
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit(`/academy/${courseSlug}/aula`, {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getCourse', { timeout: 10000 });
      cy.wait('@getEnrollmentEmpty', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false, timeout: 10000 }).should('be.visible');
      cy.contains('Ir a la pagina del Curso', { matchCase: false }).should('be.visible');
    });

    it('shows empty state in /mis-cursos when not enrolled', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] }).as('getEnrollmentEmpty');
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit('/academy/mis-cursos', {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getEnrollmentEmpty', { timeout: 10000 });
      cy.contains(/aun no tienes cursos/i, { timeout: 10000 }).should('be.visible');
    });
  });

  // ── Suite 4: Admin — Enrollment Bypass ─────────────────────────────────────

  describe('Admin (Enrollment Bypass)', () => {
    it('can access the classroom without enrollment', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
        req.reply({ statusCode: 200, body: wantsObject ? courseMock : [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] }).as('getEnrollmentEmpty');
      cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
      cy.intercept('GET', '**/rest/v1/course_lessons*', { statusCode: 200, body: lessonsMock });

      cy.loginAsAdmin(`/academy/${courseSlug}/aula`);
      cy.wait('@getCourse', { timeout: 10000 });
      cy.contains('Acceso Restringido', { matchCase: false }).should('not.exist');
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
    });

    it('can see locked modules with "Bloqueado (vista admin)" badge', () => {
      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/courses*', (req) => {
        req.reply({ statusCode: 200, body: [courseMock] });
      }).as('getCourse');
      cy.intercept('GET', '**/rest/v1/course_enrollments*', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/course_modules*', { statusCode: 200, body: modulesMock }).as('getModules');
      cy.intercept('GET', '**/rest/v1/course_lessons*', { statusCode: 200, body: lessonsMock });

      cy.loginAsAdmin(`/academy/${courseSlug}/aula`);
      cy.wait('@getCourse', { timeout: 10000 });
      cy.wait('@getModules', { timeout: 10000 });
      cy.contains('Unidad 2 - Avanzado', { timeout: 10000 }).should('be.visible');
      cy.contains('Tecnicas Avanzadas Secreto').should('exist');
      cy.contains('Bloqueado (vista admin)').should('exist');
    });
  });

  // ── Suite 5: Multiple Enrollments ──────────────────────────────────────────

  describe('Multiple Enrollments in /mis-cursos', () => {
    it('shows all enrolled courses', () => {
      const course2 = { id: 'course-second-456', title: 'Curso de Soldadura Electronica', slug: 'soldadura-electronica', is_active: true, author_id: 'instructor-789', tenant_id: '00000000-0000-0000-0000-000000000000', thumbnail_url: null, price: 8000 };

      cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] });
      cy.intercept('GET', '**/rest/v1/course_enrollments*', {
        statusCode: 200,
        body: [
          { id: 'enrollment-1', course_id: courseId, user_id: 'student-user-456', email: 'student@test.com', status: 'confirmed', course: courseMock },
          { id: 'enrollment-2', course_id: 'course-second-456', user_id: 'student-user-456', email: 'student@test.com', status: 'confirmed', course: course2 }
        ]
      }).as('getMultipleEnrollments');
      cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: studentUser });
      cy.intercept('GET', '**/rest/v1/tenants*', { statusCode: 200, body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }] });
      cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [studentProfile] });

      cy.visit('/academy/mis-cursos', {
        failOnStatusCode: false,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('sb-db-auth-token', JSON.stringify(studentSession));
          win.localStorage.setItem('arecofix_profile_student-user-456', JSON.stringify(studentProfile));
          win.localStorage.setItem('supabase-remember-me', 'true');
          win.localStorage.setItem('cypress-test', 'true');
        }
      });

      cy.wait('@getMultipleEnrollments', { timeout: 10000 });
      cy.contains('Carrera Completa Experto en Reparacion', { timeout: 10000 }).should('be.visible');
      cy.contains('Curso de Soldadura Electronica').should('be.visible');
    });
  });
});
