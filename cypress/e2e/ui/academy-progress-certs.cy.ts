describe('Academy Progress and Certificates', () => {
  const studentEmail = 'student@arecofix.com';
  const courseId = 'course-1';
  const moduleId = 'module-1';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Admin can add materials and edit exam without getting stuck or losing data', () => {
    // Intercepts
    cy.intercept('GET', '**/rest/v1/courses?*', {
      statusCode: 200,
      body: [{ id: courseId, title: 'Curso E2E Test', slug: 'curso-e2e-test' }]
    }).as('getCourses');
    
    cy.intercept('GET', '**/rest/v1/course_modules?*', {
      statusCode: 200,
      body: [{ id: moduleId, course_id: courseId, title: 'Modulo 1', order_index: 1 }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_module_contents?*', {
      statusCode: 200,
      body: []
    }).as('getContents');

    cy.intercept('POST', '**/rest/v1/course_module_contents*', {
      statusCode: 200,
      body: [
        { id: 'content-1', lesson_id: moduleId, type: 'document', title: 'Guía PDF E2E', url: 'https://example.com/file.pdf' },
        { id: 'content-2', lesson_id: moduleId, type: 'exam', title: 'Examen E2E', metadata: { questions: [{ question_text: '¿Qué es Cypress?', options: ['Un framework de testing', 'Un tipo de árbol'], correct_option_index: 0 }] } }
      ]
    }).as('saveContentsReq');
    
    cy.intercept('DELETE', '**/rest/v1/course_exam_questions*', { statusCode: 204 }).as('deleteExamQuestions');
    cy.intercept('POST', '**/rest/v1/course_exam_questions*', {
      statusCode: 201,
      body: [{ id: '44444444-4444-4444-4444-444444444444' }]
    }).as('saveQuestionsReq');

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
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
      }
    });

    cy.wait('@getModules', { timeout: 10000 });
    
    // Select the module
    cy.contains('Modulo 1').click();

    // Add Document
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Documento').click({ force: true });
    
    // Add Exam
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Examen').click({ force: true });
    
    // Fill Document Title and URL
    cy.get('input[placeholder="Título del recurso..."]').eq(0).clear().type('Guía PDF E2E');
    cy.get('input[placeholder="URL del archivo (o súbelo usando el botón)"]').eq(0).clear().type('https://example.com/file.pdf');
    
    // Exam Editor
    cy.get('input[placeholder="Título del recurso..."]').eq(1).clear().type('Examen E2E');
    cy.contains('Configurar Examen').click({ force: true });
    
    // Modal opens, add question
    cy.get('#exam_modal').should('have.class', 'modal-open');
    cy.contains('Añadir Nueva Pregunta').click();
    
    // Fill question
    cy.get('input[placeholder="Ej: ¿Qué es HTML?"]').invoke('val', '¿Qué es Cypress?').trigger('input');
    cy.get('input[placeholder="Opción..."]').eq(0).invoke('val', 'Un framework de testing').trigger('input');
    cy.get('input[placeholder="Opción..."]').eq(1).invoke('val', 'Un tipo de árbol').trigger('input');
    
    // Select first option as correct
    cy.get('input[type="radio"]').eq(0).click();
    
    cy.contains('Listo').click();

    cy.contains('Guardar Materiales').click();
    
    cy.wait('@saveContentsReq');
    cy.wait('@saveQuestionsReq');
    
    cy.contains('Materiales y exámenes guardados correctamente').should('be.visible');
    
    // Re-open exam editor to check if it tries to load from DB
    cy.intercept('POST', '**/rpc/get_exam_questions', {
      statusCode: 200,
      body: [
        { id: 'q-1', question_text: '¿Qué es Cypress?', options: ['Un framework de testing', 'Un tipo de árbol'], correct_option_index: 0, order_index: 0 }
      ]
    }).as('getQuestionsRpc');

    cy.contains('Configurar Examen').click({ force: true });
    cy.wait('@getQuestionsRpc');
    cy.wait(500); // Wait for modal to render questions
    cy.get('#exam_modal').should('have.class', 'modal-open');
    
    cy.get('input[placeholder="Ej: ¿Qué es HTML?"]').should('be.visible').and('have.value', '¿Qué es Cypress?');
    cy.get('input[type="radio"]').eq(0).should('be.checked');
  });

  it('Student can mark progress and view certificate', () => {
    // Setup Student Session
    const session = {
      provider_token: null,
      access_token: 'fake-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: {
        id: 'student-1',
        aud: 'authenticated',
        role: 'authenticated',
        email: studentEmail,
        user_metadata: { role: 'user' },
        app_metadata: { provider: 'email', providers: ['email'] },
        created_at: new Date().toISOString()
      }
    };
    
    const mockProfile = {
      id: 'student-1',
      email: studentEmail,
      role: 'user',
      first_name: 'Student',
      last_name: 'Test'
    };

    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockProfile : [mockProfile]
      });
    }).as('getStudentProfile');

    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: session.user
    }).as('getUser');
    cy.intercept('GET', '**/rest/v1/courses?*', {
      statusCode: 200,
      body: [{ id: courseId, title: 'Curso E2E Test', slug: 'curso-e2e-test' }]
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_modules?*', {
      statusCode: 200,
      body: [{ id: moduleId, course_id: courseId, title: 'Modulo 1', order_index: 1 }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_module_contents?*', {
      statusCode: 200,
      body: [
        { id: 'content-1', lesson_id: moduleId, type: 'video', title: 'Video 1', url: 'https://youtube.com', order_index: 1 }
      ]
    }).as('getContents');

    cy.intercept('POST', '**/rpc/get_course_progress*', {
      statusCode: 200,
      body: { progress: 0, completed_contents: [], certificate_id: null }
    }).as('getProgress');

    // Visit Campus directly while injecting token
    cy.visit('/academy/curso-e2e-test/aula', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('arecofix_profile_student-1', JSON.stringify(mockProfile));
      }
    });

    cy.wait('@getModules', { timeout: 10000 });

    // Check initial progress
    cy.contains('0% Completado').should('be.visible');

    // Mark as completed
    cy.intercept('POST', '**/rpc/mark_content_completed*', {
      statusCode: 200,
      body: { progress: 100, certificate_id: 'cert-123' }
    }).as('markCompleted');

    cy.get('.fa-circle').click();
    cy.wait('@markCompleted');

    // Check updated progress
    cy.contains('100% Completado').should('be.visible');
    cy.contains('¡Curso Finalizado!').should('be.visible');
    cy.contains('Ver Certificado').should('have.attr', 'href', '/academy/cert/cert-123');
  });

  it('Renders the certificate page properly', () => {
    cy.intercept('GET', '**/rest/v1/course_certificates*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
      body: {
        id: 'cert-123',
        student_id: 'mock-student',
        student_name: 'Estudiante Cypress',
        course_id: courseId,
        issued_at: new Date().toISOString(),
        courses: { title: 'Curso Cypress E2E' }
      }
    }).as('getCertificate');

    cy.visit('/academy/cert/cert-123', {
      onBeforeLoad: (win) => {
        // Mock a generic session for public cert viewing
        const mockCertProfile = { id: 'anon', role: 'user' };
        win.localStorage.setItem('arecofix_profile_anon', JSON.stringify(mockCertProfile));
      }
    });
    cy.wait('@getCertificate', { timeout: 10000 });

    cy.contains('Certificado de Finalización').should('be.visible');
    cy.contains('Estudiante Cypress').should('be.visible');
    cy.contains('Curso Cypress E2E').should('be.visible');
  });
});
