describe('Academy Full Flow: Exams and Enrollments', () => {
  const courseId = 'test-course-id';

  it('Admin can add an exam and enroll a student', () => {

    // 1. Log in to a safe route that has all global mocks covered by loginAsAdmin
    cy.loginAsAdmin('/admin/dashboard');

    // 2. Specific Mocks for this test. These will override the catch-all
    // defined in loginAsAdmin because they are defined last.
    const mockProfile = { id: 'admin-123', email: 'admin@arecofix.com', first_name: 'Admin', last_name: 'Test', role: 'super_admin' };
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
        req.reply({
            statusCode: 200,
            body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockProfile : [mockProfile]
        });
    }).as('getProfile');

    const courseMock = { id: courseId, title: 'Curso de Reparación', slug: 'curso-reparacion-celulares', is_active: true };
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? courseMock : [courseMock]
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [{ id: 'module-1', course_id: courseId, title: 'Unidad 1', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' }]
    }).as('getModules');

    let currentContents: any[] = [];
    cy.intercept('GET', '**/rest/v1/course_lessons*', (req) => {
      req.reply({ statusCode: 200, body: currentContents });
    }).as('getContents');

    cy.intercept('POST', '**/rest/v1/course_lessons*', (req) => {
      currentContents = req.body.map((item: any) => ({ ...item, id: 'content-1' }));
      req.reply({ statusCode: 200, body: currentContents });
    }).as('saveContents');

    let currentQuestions: any[] = [];
    cy.intercept('POST', '**/rest/v1/rpc/get_exam_questions*', (req) => {
      req.reply({ statusCode: 200, body: currentQuestions });
    }).as('getExamQuestions');

    cy.intercept('POST', '**/rest/v1/course_exam_questions*', (req) => {
      currentQuestions = req.body;
      req.reply({ statusCode: 200, body: currentQuestions });
    }).as('saveQuestions');

    cy.intercept('DELETE', '**/rest/v1/course_exam_questions*', {
      statusCode: 200, body: null
    });

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200, body: []
    }).as('getEnrollments');
    
    // Auth User mock just in case
    cy.intercept('GET', '**/auth/v1/user', {
        statusCode: 200,
        body: { id: 'admin-123', role: 'authenticated', email: 'admin@arecofix.com' }
    }).as('getAuthUser');

    // 3. Navigate via UI to avoid a second cy.visit (which can mess up Angular/TenantService state)
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Cursos').click({ force: true, multiple: true });
    
    // We are now on /admin/courses. Click the materials button for our mocked course.
    cy.get(`a[href="/admin/courses/${courseId}/materials"]`).click({ force: true, multiple: true });
    
    // Now we are on the materials page!
    cy.wait('@getModules');

    cy.wait('@getContents');
    

    // UI Interactions
    // The first module is automatically selected by loadData().
    
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Examen (Cuestionario)').click({ force: true });

    // The button to open the modal is 'Configurar Examen'
    cy.get('button').contains('Configurar Examen').click({ force: true });
    
    // Now the modal should be visible
    cy.get('#exam_modal').should('have.class', 'modal-open');

    cy.get('#exam_modal input[type="number"]').clear().type('70');
    
    cy.get('#exam_modal button').contains('Añadir Nueva Pregunta').click({ force: true });
    cy.get('#exam_modal input[placeholder*="Ej: ¿Qué es HTML?"]').type('¿Qué voltaje tiene una batería cargada?');
    cy.get('#exam_modal input[placeholder*="Opción..."]').eq(0).clear().type('3.8V');
    cy.get('#exam_modal input[placeholder*="Opción..."]').eq(1).clear().type('4.2V');
    cy.get('input[type="radio"]').eq(1).check({ force: true });

    cy.get('button').contains('Listo').click({ force: true });

    cy.get('button').contains('Guardar Materiales').click({ force: true });
    cy.contains('Materiales y exámenes guardados correctamente').should('be.visible');
  });

  it('Student can take the exam and pass', () => {

    const mockStudentSession = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh',
      token_type: 'bearer',
      user: {
        id: 'student-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'student@example.com',
        email_confirmed_at: new Date().toISOString(),
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: { role: 'customer' },
        identities: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    const mockProfile = {
      id: 'student-123',
      email: 'student@example.com',
      first_name: 'Estudiante',
      last_name: 'Test',
      role: 'customer',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
      is_active: true
    };

    cy.intercept('GET', '**/rest/v1/course_enrollments?*', {
      statusCode: 200,
      body: [{ id: 'enrollment-1', course_id: courseId, user_id: 'student-123', email: 'student@example.com', status: 'confirmed' }]
    }).as('getEnrollment');

    const courseData = { id: courseId, title: 'Curso de Reparación', slug: 'curso-reparacion-celulares', is_active: true };
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? courseData : [courseData]
      });
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [{ id: 'module-1', course_id: courseId, title: 'Unidad 1', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200, 
      body: [{
        id: 'content-1',
        lesson_id: 'module-1',
        type: 'exam',
        title: 'Nuevo Examen',
        metadata: { passing_score: 70 }
      }]
    }).as('getLessons');

    cy.intercept('GET', '**/rest/v1/course_progress*', {
      statusCode: 200,
      body: []
    }).as('getProgress');

    cy.intercept('POST', '**/rest/v1/rpc/get_exam_questions*', {
      statusCode: 200, 
      body: [{
        id: 'q-1',
        question_text: '¿Qué voltaje tiene una batería cargada?',
        options: ['3.8V', '4.2V']
      }]
    });

    cy.intercept('POST', '**/rest/v1/rpc/submit_exam*', {
      statusCode: 200,
      body: { score: 100, passed: true, correct_answers: 1, total_questions: 1 }
    });

    cy.loginAsUser('/academy/curso-reparacion-celulares/aula', mockStudentSession, mockProfile);

    cy.wait('@getCourse');
    cy.wait('@getEnrollment');
    cy.wait('@getModules');

    cy.get('.collapse-title').first().click({ force: true });
    cy.get('button').contains('Comenzar').click({ force: true });

    cy.contains('¿Qué voltaje tiene una batería cargada?').should('be.visible');
    cy.contains('4.2V').click({ force: true });

    cy.get('button').contains('Entregar Examen').click({ force: true });

    cy.contains('¡Aprobado!').should('be.visible');
    cy.contains('100%').should('be.visible');
  });
});
