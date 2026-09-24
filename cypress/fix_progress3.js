const fs = require('fs');

function fixAcademyProgressCerts() {
  const file = 'cypress/e2e/ui/academy-progress-certs.cy.ts';
  let c = `describe('Academy Progress and Certificates', () => {
  const studentEmail = 'student@arecofix.com';
  const courseId = '22222222-2222-2222-2222-222222222222';
  const moduleId = '33333333-3333-3333-3333-333333333333';

  it('Admin can add materials and edit exam without getting stuck or losing data', () => {
    // Intercepts set BEFORE visit
    cy.intercept('GET', '**/rest/v1/courses?*', {
      statusCode: 200,
      body: [{ id: courseId, title: 'Curso E2E Test', slug: 'curso-e2e-test' }]
    }).as('getCourses');
    
    cy.intercept('GET', '**/rest/v1/course_modules?*', {
      statusCode: 200,
      body: [{ id: moduleId, course_id: courseId, title: 'Modulo 1', order_index: 1 }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: []
    }).as('getContents');

    cy.intercept('POST', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [
        { id: '44444444-4444-4444-4444-444444444444', lesson_id: moduleId, type: 'document', title: 'Guía PDF E2E', url: 'https://example.com/file.pdf' },
        { id: '55555555-5555-5555-5555-555555555555', lesson_id: moduleId, type: 'exam', title: 'Examen E2E', metadata: { questions: [{ question_text: '¿Qué es Cypress?', options: ['Un framework de testing', 'Un tipo de árbol'], correct_option_index: 0 }] } }
      ]
    }).as('saveContentsReq');
    
    cy.intercept('DELETE', '**/rest/v1/course_exam_questions*', { statusCode: 204 }).as('deleteExamQuestions');
    cy.intercept('POST', '**/rest/v1/course_exam_questions*', {
      statusCode: 201,
      body: [{ id: '44444444-4444-4444-4444-444444444444' }]
    }).as('saveQuestionsReq');

    // Override profile for this specific test
    const mockProfile = { id: '66666666-6666-6666-6666-666666666666', email: 'admin@arecofix.com', role: 'super_admin' };
    cy.intercept('GET', '**/rest/v1/profiles*', { statusCode: 200, body: [mockProfile] }).as('getProfile');

    // Ensure state is clean, login with a generic URL, then visit the actual URL
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginAsAdmin('/');
    cy.visit(\`/admin/courses/\${courseId}/materials\`);
    
    cy.wait('@getModules', { timeout: 10000 });
    cy.wait('@getContents', { timeout: 10000 });
    
    // Select the module
    cy.contains('Modulo 1').should('be.visible');

    // Add Document
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Documento').click({ force: true });
    
    // Add Exam
    cy.contains('Agregar Recurso').click({ force: true });
    cy.contains('Examen').click({ force: true });
    
    // Fill Document Title and URL
    cy.get('input[placeholder="Título del recurso..."]').eq(0).clear().type('Guía PDF E2E', { force: true });
    cy.get('input[placeholder*="URL del archivo"]').eq(0).clear().type('https://example.com/file.pdf', { force: true });
    
    // Exam Editor
    cy.get('input[placeholder="Título del recurso..."]').eq(1).clear().type('Examen E2E', { force: true });
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
        { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', question_text: '¿Qué es Cypress?', options: ['Un framework de testing', 'Un tipo de árbol'], correct_option_index: 0, order_index: 0 }
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
    cy.clearLocalStorage();
    cy.clearCookies();
    
    const session = {
      provider_token: null,
      access_token: 'fake-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: {
        id: '77777777-7777-7777-7777-777777777777',
        aud: 'authenticated',
        role: 'authenticated',
        email: studentEmail,
        user_metadata: { role: 'user' },
        app_metadata: { provider: 'email', providers: ['email'] },
        created_at: new Date().toISOString()
      }
    };
    
    const mockProfile = {
      id: '77777777-7777-7777-7777-777777777777',
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

    cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: session.user }).as('getUser');
    cy.intercept('GET', '**/rest/v1/courses?*', {
      statusCode: 200,
      body: [{ id: courseId, title: 'Curso E2E Test', slug: 'curso-e2e-test' }]
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_enrollments?*', {
      statusCode: 200,
      body: [{ id: '99999999-9999-9999-9999-999999999999', course_id: courseId, user_id: '77777777-7777-7777-7777-777777777777', email: studentEmail, status: 'confirmed' }]
    }).as('getEnrollment');

    cy.intercept('GET', '**/rest/v1/course_modules?*', {
      statusCode: 200,
      body: [{ id: moduleId, course_id: courseId, title: 'Modulo 1', order_index: 1, unlock_date: '2020-01-01T00:00:00Z' }]
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [
        { id: '44444444-4444-4444-4444-444444444444', lesson_id: moduleId, type: 'video', title: 'Video 1', url: 'https://youtube.com', order_index: 1 }
      ]
    }).as('getContents');

    cy.intercept('POST', '**/rpc/get_course_progress*', {
      statusCode: 200,
      body: { progress: 0, completed_contents: [], certificate_id: null }
    }).as('getProgress');

    // Simulate login for this user
    cy.window().then((win) => {
      win.localStorage.setItem('sb-hszcwwbshkzzhfrpmlng-auth-token', JSON.stringify(session));
      win.localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    });

    cy.visit(\`/academy/curso-e2e-test/aula\`);

    cy.wait('@getModules', { timeout: 10000 });
    cy.wait('@getProgress', { timeout: 10000 });

    // Check initial progress
    cy.contains('0% Completado', { timeout: 10000 }).should('be.visible');

    // Mark as completed
    cy.intercept('POST', '**/rpc/mark_content_completed*', {
      statusCode: 200,
      body: { progress: 100, certificate_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' }
    }).as('markCompleted');

    cy.get('.fa-circle').click();
    cy.wait('@markCompleted');

    // Check updated progress
    cy.contains('100% Completado').should('be.visible');
    cy.contains('¡Curso Finalizado!').should('be.visible');
    cy.contains('Ver Certificado').should('have.attr', 'href', '/academy/cert/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  });

  it('Renders the certificate page properly', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    cy.intercept('GET', '**/rest/v1/course_certificates*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
      body: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        student_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        student_name: 'Estudiante Cypress',
        course_id: courseId,
        issued_at: new Date().toISOString(),
        courses: { title: 'Curso Cypress E2E' }
      }
    }).as('getCertificate');

    cy.visit('/academy/cert/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', {
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
});`;
  fs.writeFileSync(file, c);
  console.log('Fixed academy progress certs');
}
fixAcademyProgressCerts();
