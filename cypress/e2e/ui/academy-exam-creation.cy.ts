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

    cy.intercept('GET', '**/rest/v1/course_module_contents*', {
      statusCode: 200,
      body: []
    }).as('getContents');

    // Intercept Save Calls
    cy.intercept('POST', '**/rest/v1/course_module_contents*', {
      statusCode: 201,
      body: [{
        id: '33333333-3333-3333-3333-333333333333',
        lesson_id: moduleId,
        type: 'exam',
        title: 'Nuevo Examen',
        url: 'exam',
        metadata: { passing_score: 80, questions: [{ question_text: 'Test', options: ['A', 'B'], correct_option_index: 1 }] }
      }]
    }).as('saveContents');

    cy.intercept('POST', '**/rest/v1/rpc/save_exam_questions*', {
      statusCode: 200,
      body: { data: [], error: null }
    }).as('saveExamQuestionsRPC');

    // Mocks for saveExamQuestions logic
    cy.intercept('DELETE', '**/rest/v1/course_exam_questions*', { statusCode: 204 }).as('deleteExamQuestions');
    cy.intercept('POST', '**/rest/v1/course_exam_questions*', {
      statusCode: 201,
      body: [{ id: '44444444-4444-4444-4444-444444444444' }]
    }).as('insertExamQuestions');

    cy.visit(`/admin/courses/${courseId}/materials`);
  });

  it('should create an exam and correctly send the payload with correct_option_index', () => {
    cy.wait('@getModules');

    // Select Module
    cy.contains('Módulo 1').click();

    // Add Exam Resource
    cy.contains('Añadir Recurso').click();
    cy.contains('Examen').click();

    // Exam should appear in list
    cy.contains('Nuevo Examen').should('be.visible');

    // Open Config Modal
    cy.contains('Configurar Examen').click();
    cy.get('#exam_modal').should('be.visible');

    // Change passing score
    cy.get('input[type="number"]').clear().type('80', { delay: 0 });

    // Add a question
    cy.contains('Añadir Nueva Pregunta').click();

    // Type Question Text
    cy.get('input[placeholder="Ej: ¿Qué es HTML?"]').type('Pregunta de prueba', { delay: 0 });

    // Modify options and select the correct one
    cy.get('input[placeholder="Opción..."]').eq(0).clear().type('A', { delay: 0 });
    cy.get('input[placeholder="Opción..."]').eq(1).clear().type('B', { delay: 0 });
    
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
