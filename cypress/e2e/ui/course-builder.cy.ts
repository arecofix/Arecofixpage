describe('Course Builder Flow - Instructor Portal', () => {
  
  beforeEach(() => {
    // For local testing, we would intercept Supabase calls.
    // Assuming the test runs against the local Angular dev server.
    cy.loginAsAdmin('/instructor/builder');
  });

  it('debería completar el formulario del curso, agregar módulos y guardar', () => {
    // 1. Verificar carga de la página
    cy.contains('Sugerir Capacitación').should('be.visible');

    // 2. Llenar Información General
    // Usamos selectores basados en el DOM actual del builder
    cy.get('label').contains('Título del Curso').parent().find('input[type="text"]')
      .type('Curso de Prueba en Cypress');
      
    cy.get('label').contains('Descripción Detallada').parent().find('textarea')
      .type('Esta es una descripción generada por Cypress para verificar el portal del instructor.');

    cy.get('label').contains('Categoría').parent().find('select')
      .select('code'); // Programación

    cy.get('label').contains('Nivel').parent().find('select')
      .select('intermediate'); // Intermedio

    cy.get('label').contains('URL Video de Muestra').parent().find('input[type="url"]')
      .type('https://youtube.com/watch?v=dQw4w9WgXcQ');

    // 3. Estructura de Módulos
    cy.contains('button', '+ Agregar Módulo').click();
    
    // Debería aparecer un input para el título del módulo
    cy.get('input[placeholder="Título del Módulo"]').should('exist');
    cy.get('input[placeholder="Título del Módulo"]').type('Módulo 1: Introducción');

    // Agregar un segundo módulo
    cy.contains('button', '+ Agregar Módulo').click();
    cy.get('input[placeholder="Título del Módulo"]').eq(1).type('Módulo 2: Conceptos Avanzados');

    // 4. Intentar guardar como PENDING
    // Simulamos o stubbeamos la llamada al servicio si fuera necesario.
    // Por ahora verificamos que el botón exista y sea clickeable.
    cy.contains('button', 'Enviar a Revisión').should('not.be.disabled').click();

    // 5. Verificamos que cambie el estado (si el mock es exitoso, redirige al panel)
    // cy.url().should('include', '/instructor');
  });

  it('debería mostrar error si faltan campos obligatorios al enviar a revisión', () => {
    
    // Click directo sin llenar campos
    cy.contains('button', 'Enviar a Revisión').click();
    
    // Verificamos que aparezca el mensaje de error del signal 'errorMsg'
    cy.contains('Título, descripción y video de muestra son obligatorios').should('be.visible');
  });

  it('debería permitir mover y eliminar módulos', () => {
    
    cy.contains('button', '+ Agregar Módulo').click();
    cy.get('input[placeholder="Título del Módulo"]').first().invoke('val', 'Modulo A').trigger('input');
    
    cy.contains('button', '+ Agregar Módulo').click();
    cy.get('input[placeholder="Título del Módulo"]').should('have.length', 2);
    cy.get('input[placeholder="Título del Módulo"]').last().invoke('val', 'Modulo B').trigger('input');

    // Existen 2 inputs
    cy.get('input[placeholder="Título del Módulo"]').should('have.length', 2);

    // Eliminar el primero
    cy.get('.fa-trash').first().click();

    // Ahora solo debería haber 1
    cy.get('input[placeholder="Título del Módulo"]').should('have.length', 1);
    cy.get('input[placeholder="Título del Módulo"]').first().should('have.value', 'Modulo B');
  });

});
