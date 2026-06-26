describe('Admin Branches Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    // El guard tenantOwnerGuard requiere que el profile tenga role='super_admin'
    // Aseguramos que tanto GET como POST del profile devuelvan el rol correcto
    const superAdminProfile = [{
      id: 'mock-admin-id',
      email: 'admin@arecofix.com',
      role: 'super_admin',
      first_name: 'Admin',
      last_name: 'Test',
      is_active: true
    }];

    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: superAdminProfile
    }).as('getProfile');

    cy.intercept('POST', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: superAdminProfile
    }).as('upsertProfile');

    // Intercept de la sucursal activa
    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      body: [{
        id: 'branch-1',
        name: 'Sede Central',
        slug: 'sede-central',
        address: 'Av. Principal 1234',
        is_active: true,
        plan_id: 'premium',
        tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
        branding_settings: { logo_url: null, primary_color: '#0d9488', owner_name: '' },
        bank_info: { alias: '', cbu: '', bank: '' },
        modules_config: { dashboard: true, repairs: true, inventory: true, customers: true }
      }]
    }).as('getBranches');

    cy.visit('/admin/branches');
  });

  it('Debería cargar la lista de sucursales correctamente', () => {
    cy.wait('@getBranches');
    // Para super_admin sin branch activa, el componente muestra la lista de sucursales
    cy.contains('Sede Central').should('exist');
  });

  it('Debería abrir el formulario de configuración al hacer click en Ajustes', () => {
    cy.wait('@getBranches');
    cy.contains('Sede Central').should('exist');
    // El botón de edición tiene data-tip="Ajustes"
    cy.get('[data-tip="Ajustes"]').first().click();
    cy.contains('Preferencias Generales').should('exist');
  });

  it('Debería guardar cambios en la sucursal correctamente', () => {
    cy.intercept('PATCH', '**/rest/v1/branches*', {
      statusCode: 200,
      body: { id: 'branch-1', name: 'Sede Central Actualizada' }
    }).as('updateBranch');

    cy.wait('@getBranches');
    cy.contains('Sede Central').should('exist');

    // Abrimos el formulario de edición vía el botón Ajustes
    cy.get('[data-tip="Ajustes"]').first().click();
    cy.contains('Preferencias Generales').should('exist');

    // Modificamos el nombre (primer input visible del tab General)
    cy.get('input').filter(':visible').first().clear().type('Sede Central Actualizada');

    cy.contains('Aplicar Cambios').click();
    cy.wait('@updateBranch').its('response.statusCode').should('eq', 200);
  });
});
