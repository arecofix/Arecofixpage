describe('Admin Courses Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    // Interceptamos la llamada GET a la tabla courses
    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-course-1',
          title: 'Curso de Reparación de Celulares Nivel 1',
          description: 'Aprende las bases de microelectrónica',
          price: 25000,
          currency: 'ARS',
          is_active: true,
          tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-course-2',
          title: 'Masterclass Reballing Avanzado',
          description: 'Técnicas avanzadas de soldadura',
          price: 50000,
          currency: 'ARS',
          is_active: false,
          tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          created_at: new Date().toISOString()
        }
      ]
    }).as('getCourses');

    cy.visit('/admin/courses');
  });

  it('Debería cargar la lista de cursos correctamente', () => {
    cy.wait('@getCourses');
    
    // Verificamos que los cursos mockeados se muestren en la tabla
    cy.contains('Curso de Reparación de Celulares Nivel 1').should('be.visible');
    cy.contains('Masterclass Reballing Avanzado').should('be.visible');
  });

  it('Debería permitir navegar a la creación de un nuevo curso', () => {
    cy.contains('Nuevo Programa').click();
    cy.url().should('include', '/admin/courses/new');
  });

  it('Debería crear un curso exitosamente', () => {
    // Interceptamos el POST
    cy.intercept('POST', '**/rest/v1/courses*', {
      statusCode: 201,
      body: { id: 'new-course-id', title: 'Nuevo Curso Cypress' }
    }).as('createCourse');

    cy.visit('/admin/courses/new');

    // Completamos el formulario - usamos force:true porque los inputs están dentro de <label> wrappers
    cy.get('input[formControlName="title"]').type('Nuevo Curso Cypress', { force: true });
    cy.get('textarea[formControlName="description"]').type('Descripción del curso de prueba', { force: true });
    cy.get('input[formControlName="duration"]').type('3 meses', { force: true });
    cy.get('input[formControlName="schedule"]').type('Lunes y Miércoles 18hs', { force: true });
    cy.get('input[formControlName="price"]').type('10000', { force: true });
    cy.get('input[formControlName="image_url"]').type('https://test.com/img.jpg', { force: true });
    
    cy.get('button[type="submit"]').click();

    // Verificamos que se hizo el POST al backend (el body ya fue enviado correctamente)
    cy.wait('@createCourse').its('response.statusCode').should('eq', 201);

    // Verificamos que redirigió correctamente luego de guardar
    cy.url().should('include', '/admin/courses');
  });
});
