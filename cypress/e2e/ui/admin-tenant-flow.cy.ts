function visitWithAuth(url: string) {
  cy.visit(url, {
    onBeforeLoad: (win) => {
      const mockSession = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoic3VwZXItYWRtaW4taWQifQ.signature',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        token_type: 'bearer',
        user: {
          id: 'super-admin-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'admin@arecofix.com',
          email_confirmed_at: new Date().toISOString(),
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: { role: 'super_admin' },
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
      win.localStorage.setItem('supabase-remember-me', 'true');
    }
  });
}

describe('Admin Tenant Flow (Multi-tenant & RLS Isolation)', () => {
  beforeEach(() => {
    // Mock the session
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: 'super-admin-id', email: 'admin@arecofix.com' }
    }).as('getUser');

    cy.intercept('GET', '**/rest/v1/profiles?*', {
      statusCode: 200,
      body: [{ id: 'super-admin-id', role: 'super_admin', full_name: 'Super Admin' }]
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
      body: { success: true, message: 'Tenant created successfully' }
    }).as('createTenant');

    visitWithAuth('/admin/branches');
    cy.wait(['@getProfile', '@getTenants', '@getBranches']);
    cy.wait(1000);

    cy.contains(/nueva sucursal/i, { matchCase: false }).click();
    
    // Fill general tab fields
    cy.contains('Nombre Comercial').parent().find('input').invoke('val', 'Nueva Empresa S.A.').trigger('input').should('have.value', 'Nueva Empresa S.A.');
    cy.contains('Razón Social').parent().find('input').invoke('val', 'Nueva Empresa Subtitle').trigger('input').should('have.value', 'Nueva Empresa Subtitle');
    cy.contains('Plan Actual').parent().find('select').select('premium');

    // Click Contact tab
    cy.contains('Contacto').click({ force: true });
    
    // Fill contact tab fields
    cy.contains('Email Público').parent().find('input').invoke('val', 'contacto@nuevaempresa.com').trigger('input').should('have.value', 'contacto@nuevaempresa.com');
    cy.contains('Línea de Atención WhatsApp').parent().find('input').invoke('val', '+5491122334455').trigger('input').should('have.value', '+5491122334455');

    // Submit
    cy.get('button').contains(/Aplicar Cambios/i, { matchCase: false }).click();

    cy.wait('@createTenant').its('request.body').should('contain', {
      businessName: 'Nueva Empresa S.A.',
      email: 'contacto@nuevaempresa.com'
    });

    cy.contains(/creado con éxito/i, { matchCase: false }).should('exist');
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
    visitWithAuth('/admin/orders');
    
    // Verificamos que la interfaz maneja el error de permisos sin romperse
    // (Por ejemplo mostrando un toast o mensaje)
    cy.contains(/no tienes permisos/i, { matchCase: false, timeout: 5000 }).should('exist');
  });

  it('debería permitir cambiar el plan de un tenant y afectar la UI', () => {
    visitWithAuth('/admin/branches');
    cy.wait(['@getProfile', '@getTenants', '@getBranches']);
    cy.wait(1000);

    // Find card for Sede Secundaria and click adjustments (Ajustes) cog button
    cy.contains('Sede Secundaria').parents('.group').find('button[data-tip="Ajustes"]').click({ force: true });
    
    // Mock the update
    cy.intercept('PATCH', '**/rest/v1/branches?*', {
      statusCode: 200,
      body: [{ id: 'branch-2', plan_id: 'premium' }]
    }).as('updateBranch');

    cy.contains('Plan Actual').parent().find('select').select('premium');
    cy.get('button').contains(/Aplicar Cambios/i, { matchCase: false }).click();

    cy.wait('@updateBranch').its('request.body').should('contain', {
      plan_id: 'premium'
    });
  });
});
