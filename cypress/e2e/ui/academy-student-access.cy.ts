describe('Student Academy Access Flow', () => {
  const courseSlug = 'carrera-completa-experto-en-reparacion-de-celulares-y-tablets';
  const courseId = 'course-123';
  
  const mockStudentSession = {
    access_token: 'fake-jwt-student',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh',
    token_type: 'bearer',
    user: { id: 'student-456', role: 'authenticated', email: 'student@test.com' }
  };

  const mockProfile = { 
    id: 'student-456', 
    email: 'student@test.com', 
    first_name: 'Student', 
    last_name: 'Test', 
    role: 'customer' 
  };

  const courseMock = { 
    id: courseId, 
    title: 'Carrera Completa', 
    slug: courseSlug, 
    is_active: true,
    author_id: 'admin-123'
  };

  beforeEach(() => {
    // Intercepts
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: mockStudentSession.user
    }).as('getAuthUser');

    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockProfile : [mockProfile]
      });
    }).as('getProfile');

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
      body: [{ id: 'lesson-1', module_id: 'module-1', title: 'Introducción', order_index: 1, type: 'video' }]
    }).as('getLessons');

    cy.intercept('GET', '**/rest/v1/course_progress*', {
      statusCode: 200,
      body: []
    }).as('getProgress');
  });

  it('Blocks access to unauthenticated or un-enrolled users', () => {
    // 1. Simulate un-enrolled status
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [] // Empty = not enrolled
    }).as('getEnrollmentEmpty');

    cy.loginAsAdmin('/academy/' + courseSlug + '/aula', mockStudentSession);
    cy.wait('@getCourse');
    cy.wait('@getEnrollmentEmpty');

    // Should display access denied or redirect
    cy.contains('Acceso Denegado', { matchCase: false }).should('exist');
  });

  it('Allows access to the campus when the admin has granted permissions (enrollment exists)', () => {
    // 2. Simulate enrolled status
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enroll-1', course_id: courseId, user_id: 'student-456', email: 'student@test.com', status: 'confirmed' }]
    }).as('getEnrollmentConfirmed');

    cy.loginAsAdmin('/academy/' + courseSlug + '/aula', mockStudentSession);
    
    cy.wait('@getCourse');
    cy.wait('@getEnrollmentConfirmed');
    cy.wait('@getModules');
    
    // The campus should load, verifying access
    cy.contains('Carrera Completa').should('exist');
    cy.contains('Unidad 1').should('exist');
    cy.contains('Introducción').should('exist');
  });
});
