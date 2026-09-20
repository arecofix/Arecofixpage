/**
 * Academy Student Access Flow
 * Tests the student-specific access flows using the loginAsUser command.
 * Complementary to academy-comprehensive-access.cy.ts
 */

describe('Student Academy Access Flow', () => {
  const courseSlug = 'carrera-completa-experto-en-reparacion-de-celulares-y-tablets';
  const courseId = 'course-123';

  const mockStudentSession = {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh',
    token_type: 'bearer',
    user: {
      id: 'student-456',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'student@test.com',
      email_confirmed_at: new Date().toISOString(),
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { role: 'customer' },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  const mockProfile = {
    id: 'student-456',
    email: 'student@test.com',
    first_name: 'Student',
    last_name: 'Test',
    role: 'customer',
    is_active: true,
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: 'branch-1'
  };

  const courseMock = {
    id: courseId,
    title: 'Carrera Completa',
    slug: courseSlug,
    is_active: true,
    author_id: 'admin-123',
    tenant_id: '00000000-0000-0000-0000-000000000000'
  };

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? courseMock : [courseMock]
      });
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [{ id: 'module-1', course_id: courseId, title: 'Unidad 1', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [{ id: 'lesson-1', module_id: 'module-1', title: 'Introduccion', order_index: 1, type: 'video' }]
    }).as('getLessons');

    cy.intercept('GET', '**/rest/v1/course_progress*', { statusCode: 200, body: [] }).as('getProgress');
  });

  it('Blocks access and shows "Acceso Restringido" for unenrolled students', () => {
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: []
    }).as('getEnrollmentEmpty');

    cy.loginAsUser('/academy/' + courseSlug + '/aula', mockStudentSession, mockProfile);
    cy.wait('@getCourse');
    cy.wait('@getEnrollmentEmpty');

    cy.contains('Acceso Restringido', { matchCase: false, timeout: 10000 }).should('exist');
  });

  it('Allows access to the classroom when the student has confirmed enrollment', () => {
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enroll-1', course_id: courseId, user_id: 'student-456', email: 'student@test.com', status: 'confirmed' }]
    }).as('getEnrollmentConfirmed');

    cy.loginAsUser('/academy/' + courseSlug + '/aula', mockStudentSession, mockProfile);

    cy.wait('@getCourse');
    cy.wait('@getEnrollmentConfirmed');
    cy.wait('@getModules');

    cy.contains('Acceso Restringido', { matchCase: false }).should('not.exist');
    cy.contains('Carrera Completa', { timeout: 10000 }).should('exist');
    cy.contains('Unidad 1').should('exist');
    cy.contains('Introduccion').should('exist');
  });
});

