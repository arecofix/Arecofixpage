describe('Academy Full Flow: Exams and Enrollments', () => {
  const courseId = 'test-course-id';

  const mockAdminSession = {
      access_token: 'fake-jwt',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh',
      token_type: 'bearer',
      user: { id: 'admin-123', role: 'authenticated', email: 'admin@arecofix.com' }
  };

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
        access_token: 'fake-jwt',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh',
        token_type: 'bearer',
        user: { id: 'student-123', role: 'authenticated', email: 'student@example.com' }
    };
    
    cy.intercept('GET', '**/rest/v1/profiles*', {
        statusCode: 200,
        body: [{ id: 'student-123', first_name: 'Estudiante', last_name: 'Test', role: 'customer' }]
    }).as('getProfile');

    cy.intercept('GET', '**/rest/v1/course_enrollments?*', {
      statusCode: 200,
      body: [{ id: 'enrollment-1', course_id: courseId, user_id: 'student-123', email: 'student@example.com', status: 'confirmed' }]
    }).as('getEnrollment');

    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [{ id: courseId, title: 'Curso de Reparación', slug: 'curso-reparacion-celulares', is_active: true }]
    });

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [{ id: 'module-1', course_id: courseId, title: 'Unidad 1', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' }]
    });

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200, 
      body: [{
        id: 'content-1',
        lesson_id: 'module-1',
        type: 'exam',
        title: 'Nuevo Examen',
        metadata: { passing_score: 70 }
      }]
    });

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

    cy.intercept('POST', '**/rest/v1/rpc/get_course_progress*', {
      statusCode: 200,
      body: { progress: 0, completed_contents: [], certificate_id: null }
    });

    cy.visit('/academy/curso-reparacion-celulares/aula', {
        onBeforeLoad: (win) => {
            win.localStorage.setItem('sb-db-auth-token', JSON.stringify(mockStudentSession));
        }
    });

    cy.get('.collapse-title').first().click({ force: true });
    cy.contains('Examen').should('be.visible');
    cy.get('button').contains('Comenzar').click({ force: true });

    cy.contains('¿Qué voltaje tiene una batería cargada?').should('be.visible');
    cy.contains('4.2V').click({ force: true });

    cy.get('button').contains('Entregar Examen').click({ force: true });

    cy.contains('¡Aprobado!').should('be.visible');
    cy.contains('100%').should('be.visible');
  });
});
