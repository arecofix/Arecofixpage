describe('Soft Delete Integrity Tests', () => {
  beforeEach(() => {
    // Intercepts to mock Supabase responses for our specific soft-delete actions
    cy.intercept('GET', '**/rest/v1/profiles?*', {
      statusCode: 200,
      body: [{ count: 0 }]
    }).as('getProfilesCount');

    cy.intercept('PATCH', '**/rest/v1/branches?*', {
      statusCode: 200,
      body: []
    }).as('softDeleteBranch');

    cy.intercept('PATCH', '**/rest/v1/profiles?*', {
      statusCode: 200,
      body: []
    }).as('softDeleteProfile');
    
    // Login as Super Admin using custom command directly to the route
    cy.loginAsAdmin('/admin/branches');
  });

  it('Debería mostrar modal de advertencia al eliminar sucursal y realizar Soft Delete', () => {
    cy.visit('/admin/branches');
    
    // Esperar a que carguen las sucursales (asumimos que hay mock o red real)
    cy.get('table').should('exist');
    
    // Spy on window.confirm
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true).as('confirmDialog');
    });

    // Encontrar botón de eliminar de la primera sucursal
    cy.get('button[title="Eliminar"]').first().click({ force: true });
    
    // Verificar que se haya llamado a la consulta de count de perfiles
    cy.wait('@getProfilesCount');

    // Verificar que el confirm de la advertencia se haya disparado
    cy.get('@confirmDialog').should('have.been.calledOnce');
    
    // Verificar que se haya disparado el PATCH (Soft Delete) a branches
    cy.wait('@softDeleteBranch').its('request.body').should('include', {
      is_active: false
    });
    
    // Verificar mensaje de éxito
    cy.contains('Sucursal desactivada con éxito (Soft Delete)').should('be.visible');
  });

  it('Debería mostrar modal de advertencia al eliminar cliente y realizar Soft Delete', () => {
    cy.visit('/admin/users');
    
    // Esperar a que cargue la pestaña de clientes
    cy.get('button#tab-clients').should('have.class', 'tab-active');
    cy.get('table').should('exist');
    
    // Encontrar botón de dar de baja del primer cliente
    cy.get('button[title="Dar de baja"]').first().click({ force: true });
    
    // Verificar que el modal DaisyUI de confirmación de borrado se muestre
    cy.contains('Confirmar baja').should('be.visible');
    cy.contains('¿Estás seguro de que deseas dar de baja al cliente').should('be.visible');
    
    // Hacer clic en "Sí, dar de baja"
    cy.contains('Sí, dar de baja').click();
    
    // Verificar que se haya disparado el PATCH (Soft Delete) a profiles
    cy.wait('@softDeleteProfile').its('request.body').should('include', {
      is_active: false
    });
    
    // Verificar mensaje de éxito
    cy.contains('ha sido dado de baja correctamente.').should('be.visible');
  });
});
