describe('Formulario de Taller (Repair Form)', () => {
  beforeEach(() => {
    // Interceptar llamadas a Supabase Auth y REST API
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: {
        id: 'test-user-id',
        email: 'admin@arecofix.com',
        user_metadata: { role: 'superadmin' },
        app_metadata: { provider: 'email' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      }
    }).as('getUser');

    // Setup all mocks before visiting the page
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      const isSingle = req.headers.accept && String(req.headers.accept).includes('application/vnd.pgrst.object+json');
      const profileData = {
        id: 'test-user-id', 
        email: 'admin@arecofix.com', 
        role: 'super_admin', 
        is_active: true,
        tenant_id: 'default',
        branch_id: 'branch-1'
      };
      req.reply({
        statusCode: 200,
        body: isSingle ? profileData : [profileData]
      });
    }).as('getProfile');

    cy.intercept('GET', '**/rest/v1/companies*', {
      statusCode: 200,
      body: []
    });

    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      body: [{ id: 'branch-1', name: 'Central', is_active: true }]
    }).as('getBranch');

    // Intercept Auth to prevent session clearing
    cy.intercept('GET', '**/auth/v1/user*', {
      statusCode: 200,
      body: { id: 'test-user-id', email: 'admin@arecofix.com', role: 'authenticated' }
    });
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: { 
        access_token: 'fakeJwt', 
        refresh_token: 'mock-valid-refresh', 
        user: { id: 'test-user-id', email: 'admin@arecofix.com' } 
      }
    });

    cy.intercept('POST', '**/rest/v1/rpc/save_repair_order*', {
      statusCode: 201,
      body: { id: 'test-repair-123' }
    }).as('createRepair');

    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 200,
      body: [{
        id: 'test-repair-123',
        customer_name: 'Juan Perez',
        device_model: 'Galaxy S22',
        issue_description: 'No enciende',
        tracking_code: 'TRK-123'
      }]
    }).as('getRepair');

    cy.intercept('GET', '**/rest/v1/brands*', {
      statusCode: 200,
      body: [{ id: 'brand-1', name: 'Samsung' }]
    });

    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 200,
      body: []
    });
    
    // Inject mock auth token into localStorage
    cy.visit('/admin/repairs/new', {
      onBeforeLoad(win) {
        // Capture console output to debug form behavior
        (cy as any).on('window:console', (msg: any) => {
          cy.writeFile('cypress-console.log', `[${msg.type}] ${msg.args}\n`, { flag: 'a+' });
        });

        // A basic valid JWT structure: header.payload.signature
        const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

        const mockSession = {
          access_token: fakeJwt,
          refresh_token: 'mock-valid-refresh',
          user: { 
            id: 'test-user-id', 
            email: 'admin@arecofix.com', 
            aud: 'authenticated', 
            role: 'authenticated'
          },
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer'
        };
        // This key will be picked up by Supabase's default configuration
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
        win.localStorage.setItem(`arecofix_profile_test-user-id`, JSON.stringify({
          id: 'test-user-id', 
          email: 'admin@arecofix.com', 
          role: 'super_admin', 
          is_active: true,
          tenant_id: 'default',
          branch_id: 'branch-1'
        }));
      }
    });

    // Wait for auth and profile to initialize asynchronously from Supabase
    cy.wait(1000);
  });

  it('debería mostrar los errores de validación si se envía vacío', () => {
    // Forzar el envío sin llenar nada
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });

    cy.window().then((win) => {
      expect((win as any).saveCalled).to.be.true;
    });

    // Comprobar que aparecen los mensajes de validación visuales
    cy.contains('El nombre del cliente es obligatorio').should('exist');
    cy.contains('El modelo del equipo es obligatorio').should('exist');
    cy.contains('La falla declarada es obligatoria').should('exist');

    // Comprobar que los campos tienen los bordes rojos
    cy.get('input[formControlName="customer_name"]').should('have.class', 'border-red-500');
    cy.get('input[formControlName="device_model"]').should('have.class', 'border-red-500');
    cy.get('textarea[formControlName="issue_description"]').should('have.class', 'border-red-500');
  });

  it('debería poder llenar los campos requeridos y guardar correctamente', () => {
    cy.intercept('POST', '**/rest/v1/repairs*', {
      statusCode: 201,
      body: [{ id: 'new-repair-id', repair_number: 1001, tracking_code: 'TRK1001' }]
    }).as('createRepair');

    // Llenar formulario asegurando que Angular actualice el modelo
    cy.get('input[formControlName="customer_name"]').invoke('val', 'Juan Perez').trigger('input');
    cy.get('input[formControlName="customer_phone"]').invoke('val', '1122334455').trigger('input');
    cy.get('input[formControlName="device_model"]').invoke('val', 'Galaxy S22').trigger('input');
    cy.get('textarea[formControlName="issue_description"]').invoke('val', 'No enciende').trigger('input');

    // Enviar formulario
    cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });

    // Debería enviarse la petición
    cy.wait('@createRepair').its('request.body.p_payload').should('deep.include', {
      device_model: 'Galaxy S22',
      issue_description: 'No enciende'
    });
    
    // Ensure we are not redirected!
    cy.url().should('include', '/admin/repairs/new');
  });

  it('debería ser responsivo (mobile)', () => {
    cy.viewport('iphone-x');
    // Verificar que los campos no colapsan en mobile
    cy.get('input[formControlName="customer_name"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });
});
