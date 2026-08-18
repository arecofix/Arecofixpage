describe('Instructor Builder Component', () => {
  const courseId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    cy.loginAsAdmin(`/instructor/builder`);

    // Intercept auth
    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: [{ id: 'user-123', role: 'instructor', email: 'test@example.com' }]
    }).as('getProfile');

    // Intercept get course
    cy.intercept('GET', `**/rest/v1/courses*`, {
      statusCode: 200,
      body: {
        id: courseId,
        title: 'Curso Original',
        description: 'Descripcion original',
        short_description: 'Corto',
        price: 1000,
        is_active: true,
        author_id: 'user-123'
      }
    }).as('getCourse');

    // Intercept get modules
    cy.intercept('GET', `**/rest/v1/course_modules*`, {
      statusCode: 200,
      body: [{
        id: 'mod-1',
        course_id: courseId,
        title: 'Módulo 1',
        description: 'Intro',
        order_index: 1
      }]
    }).as('getModules');

    // Intercept module contents
    cy.intercept('GET', `**/rest/v1/course_module_contents*`, {
      statusCode: 200,
      body: [{
        id: 'content-1',
        lesson_id: 'mod-1',
        title: 'video.mp4',
        type: 'video',
        url: 'http://test.com/video.mp4'
      }]
    }).as('getContents');

    // Intercept update course
    cy.intercept('PATCH', `**/rest/v1/courses*`, {
      statusCode: 200,
      body: []
    }).as('updateCourse');

    // Intercept save modules
    cy.intercept('POST', `**/rest/v1/course_modules*`, {
      statusCode: 200,
      body: [{
        id: 'mod-1',
        course_id: courseId,
        title: 'Módulo Editado',
        description: 'Intro',
        order_index: 1
      }]
    }).as('saveModules');
    
    cy.intercept('POST', `**/rest/v1/course_module_contents*`, {
        statusCode: 200,
        body: []
    }).as('saveContents');
  });

  it('Debería cargar los datos del curso, editar la info y enviar actualización', () => {
    cy.visit(`/instructor/builder/${courseId}`);

    // Verificar UI renderizada (Cypress esperará automáticamente hasta 4s)
    cy.get('h1').should('contain.text', 'Curso Original');
    
    // Cambiar Título en la pestaña General
    cy.get('input[placeholder="Ej: Reparación de Celulares desde Cero"]').clear().type('Curso Editado', { delay: 50 }).blur();
    
    // Cambiar a pestaña de módulos
    cy.contains('Módulos y Clases').click();
    
    // Verificar que el módulo cargó
    cy.get('input[placeholder="Ej: Módulo 1: Introducción"]').should('have.value', 'Módulo 1');
    
    // Editar módulo
    cy.get('input[placeholder="Ej: Módulo 1: Introducción"]').clear().type('Módulo Editado', { delay: 50 }).blur();
    
    // Clic en Guardar
    cy.contains('Guardar Cambios').click();

    // Validar llamadas de red
    cy.wait('@updateCourse').then((interception) => {
      expect(interception.request.body.title).to.eq('Curso Editado');
    });

    cy.wait('@saveModules').then((interception) => {
      expect(interception.request.body[0].title).to.eq('Módulo Editado');
    });
    
    // Mensaje de éxito
    cy.contains('¡Curso guardado exitosamente!').should('be.visible');
  });
});
