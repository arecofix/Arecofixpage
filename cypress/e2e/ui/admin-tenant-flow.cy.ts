describe('Admin Tenant Flow (Multi-tenant & RLS Isolation)', () => {
  beforeEach(() => {
    // Mock the session
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: 'super-admin-id', email: 'admin@arecofix.com' }
    }).as('getUser');

    cy.intercept('GET', '**/rest/v1/profiles?*', {
      statusCode: 200,
      body: [{ id: 'super-admin-id', role: 'admin', full_name: 'Super Admin' }]
    }).as('getProfile');

    cy.intercept('GET', '**/rest/v1/tenants?*', {
      statusCode: 200,
      body: [
        { id: 'tenant-1', name: 'Arecofix Central', slug: 'arecofix', is_active: true, plan: 'premium' },
        { id: 'tenant-2', name: 'Sucursal Secundaria', slug: 'sucursal-dos', is_active: true, plan: 'basic' }
      ]
    }).as('getTenants');

    cy.intercept('GET', '**/rest/v1/branches?*', {
      statusCode: 200,
      body: [
        { id: 'branch-1', tenant_id: 'tenant-1', name: 'Sede Central', city: 'Buenos Aires' },
        { id: 'branch-2', tenant_id: 'tenant-2', name: 'Sede Secundaria', city: 'Rosario' }
      ]
    }).as('getBranches');
  });

  it('debería permitir al Super Admin crear un nuevo tenant', () => {
    cy.intercept('POST', '**/functions/v1/create-trial-tenant', {
      statusCode: 200,
      body: { message: 'Tenant created successfully' }
    }).as('createTenant');

    cy.visit('/admin/branches');
    cy.wait(['@getUser', '@getProfile', '@getTenants']);

    cy.contains(/nueva sucursal/i, { matchCase: false }).click();
    
    // Fill the form
    cy.get('input[formControlName="name"]').type('Nueva Empresa S.A.', { force: true });
    cy.get('input[formControlName="email"]').type('contacto@nuevaempresa.com', { force: true });
    cy.get('input[formControlName="phone"]').type('1122334455', { force: true });
    cy.get('input[formControlName="city"]').type('Córdoba', { force: true });
    cy.get('input[formControlName="address"]').type('Calle Falsa 123', { force: true });
    cy.get('select[formControlName="plan"]').select('premium');

    // Submit
    cy.get('button').contains(/guardar/i, { matchCase: false }).click();

    cy.wait('@createTenant').its('request.body').should('contain', {
      companyName: 'Nueva Empresa S.A.',
      email: 'contacto@nuevaempresa.com'
    });

    cy.contains(/creada exitosamente/i, { matchCase: false }).should('be.visible');
  });

  it('debería manejar errores de RLS asegurando aislamiento (Isolation)', () => {
    // Simular que el usuario intenta acceder a una ruta protegida y RLS devuelve 403
    cy.intercept('GET', '**/rest/v1/orders?*', {
      statusCode: 403,
      body: {
        code: '42501',
        message: 'new row violates row-level security policy',
        details: 'Tenant ID mismatch'
      }
    }).as('getOrdersFail');

    // Visitamos una página que dispararía la consulta de órdenes
    cy.visit('/admin/orders');
    
    // Verificamos que la interfaz maneja el error de permisos sin romperse
    // (Por ejemplo mostrando un toast o mensaje)
    cy.contains(/no tienes permisos/i, { matchCase: false, timeout: 5000 }).should('exist');
  });

  it('debería permitir cambiar el plan de un tenant y afectar la UI', () => {
    cy.visit('/admin/branches');
    cy.wait(['@getTenants']);

    cy.contains('Sucursal Secundaria').parents('tr').find('button.edit-btn').click();
    
    // Mock the update
    cy.intercept('PATCH', '**/rest/v1/tenants?*', {
      statusCode: 200,
      body: [{ id: 'tenant-2', plan: 'premium' }]
    }).as('updateTenant');

    cy.get('select[formControlName="plan"]').select('premium');
    cy.get('button').contains(/guardar/i, { matchCase: false }).click();

    cy.wait('@updateTenant').its('request.body').should('contain', {
      plan: 'premium'
    });
  });
});
