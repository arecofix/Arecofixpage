describe('Academy Exam Creation', () => {
  const courseId = '11111111-1111-1111-1111-111111111111';
  const moduleId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    // Intercept courses API
    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [{
        id: courseId,
        title: 'Curso de Prueba',
        slug: 'curso-de-prueba',
        is_active: true
      }]
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [{
        id: moduleId,
        course_id: courseId,
        title: 'Módulo 1',
        order_index: 0
      }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: []
    }).as('getContents');

    // Intercept Save Calls
    cy.intercept('POST', '**/rest/v1/course_lessons*', {
      statusCode: 201,
      body: [{
        id: '33333333-3333-3333-3333-333333333333',
        lesson_id: moduleId,
        type: 'exam',
        title: 'Nuevo Examen',
        url: 'exam',
        metadata: { passing_score: 80, questions: [{ question_text: 'Pregunta de prueba', options: ['A', 'B'], correct_option_index: 1 }] }
      }]
    }).as('saveContents');

    cy.intercept('POST', '**/rest/v1/rpc/save_exam_questions*', {
      statusCode: 200,
      body: { data: [], error: null }
    }).as('saveExamQuestionsRPC');

    cy.intercept('POST', '**/rest/v1/course_exam_questions*', {
      statusCode: 201,
      body: [{ id: '44444444-4444-4444-4444-444444444444' }]
    }).as('insertExamQuestions');

    // Inline login logic so it doesn't override our intercepts
    const mockProfile = { id: 'mock-admin-id', email: 'admin@arecofix.com', role: 'super_admin' };
    const session = {
      provider_token: null, access_token: 'fake-token', expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'fake', token_type: 'bearer',
      user: { id: 'mock-admin-id', aud: 'authenticated', role: 'authenticated', email: 'admin@arecofix.com' }
    };
    cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: session.user }).as('getUser');
    cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [mockProfile] }).as('getProfile');

    cy.visit(`/admin/courses/${courseId}/materials`, {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
      }
    });
  });

  it('should create an exam and correctly send the payload with correct_option_index', () => {
    cy.wait('@getModules');
    cy.wait('@getContents');

    // Wait for auto-selection and Angular render
    cy.contains('Módulo 1').should('be.visible');

    // Add Exam Resource
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Examen').click({ force: true });

    // Exam should appear in list
    cy.get('input[placeholder="Título del recurso..."]').should('exist');

    // Open Config Modal
    cy.contains('Configurar Examen').click({ force: true });
    cy.get('#exam_modal').should('be.visible');

    // Change passing score
    cy.get('input[type="number"]').invoke('val', '80').trigger('input');

    // Add a question
    cy.contains('Añadir Nueva Pregunta').click();

    // Type Question Text
    cy.get('input[placeholder="Ej: ¿Qué es HTML?"]').invoke('val', 'Pregunta de prueba').trigger('input');

    // Modify options and select the correct one
    cy.get('input[placeholder="Opción..."]').eq(0).invoke('val', 'A').trigger('input');
    cy.get('input[placeholder="Opción..."]').eq(1).invoke('val', 'B').trigger('input');
    
    // Select Option 2 (index 1) as correct
    cy.get('input[type="radio"]').eq(1).click();

    // Close Modal
    cy.contains('Listo').click();
    
    // Save
    cy.contains('Guardar Materiales').click();

    // Wait for the insert query to ensure correct payload is sent
    cy.wait('@insertExamQuestions').then((interception) => {
      const body = interception.request.body;
      expect(body).to.be.an('array');
      expect(body.length).to.eq(1);
      
      const question = body[0];
      expect(question.question_text).to.eq('Pregunta de prueba');
      expect(question.options).to.deep.eq(['A', 'B']);
      
      // THIS IS THE CRITICAL ASSERTION: The bug was that correct_option_index was missing
      expect(question.correct_option_index).to.eq(1);
    });

  });
});
