describe('SaaS Architecture Audit: Tenant Isolation and Plan Security', () => {

  const MOCK_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

  beforeEach(() => {
    // Definimos los interceptores ANTES del login personalizado
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: [{ 
          id: 'mock-admin-id',
          email: 'admin@arecofix.com',
          role: 'admin', // Clave para probar los Planes
          first_name: 'Admin',
          last_name: 'Test',
          is_active: true
        }]
      });
    }).as('getAdminProfile');

    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: MOCK_TENANT_ID, name: 'Arecofix', slug: 'arecofix', is_active: true }]
    }).as('getTenants');

    const session = {
      provider_token: null,
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh',
      token_type: 'bearer',
      user: {
        id: 'mock-admin-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'admin@arecofix.com',
        user_metadata: { role: 'admin' }, // IMPORTANT: NOT super_admin
      }
    };

    cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: session.user });
    
    // Set custom session
    cy.visit('/', { 
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
        win.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(session));
        win.localStorage.setItem('supabase-remember-me', 'true');
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-isolation-1');
        win.localStorage.setItem('arecofix_admin_branch_id', 'branch-isolation-1');
      }
    });
  });

  context('1. Data Isolation (Aislamiento Total entre Sucursales)', () => {
    
    beforeEach(() => {
      // Mock de sucursal activa con TODO habilitado para no ser bloqueado por el moduleGuard
      cy.intercept('GET', '**/rest/v1/branches*', {
        statusCode: 200,
        body: [{ 
          id: 'branch-isolation-1',
          name: 'Sucursal Aislada',
          tenant_id: MOCK_TENANT_ID,
          is_active: true,
          modules_config: { dashboard: true, repairs: true, inventory: true, customers: true }
        }]
      }).as('getActiveBranch');
    });

    it('Aislamiento de Lectura: Debería forzar el filtro de TenantID en los GETs (Reparaciones e Inventario)', () => {
      // Interceptamos peticiones a Reparaciones y Productos
      cy.intercept('GET', '**/rest/v1/repairs*').as('getRepairs');
      cy.intercept('GET', '**/rest/v1/products*').as('getProducts');

      cy.visit('/admin/repairs', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-isolation-1');
        }
      });
      cy.wait('@getRepairs').then((interception) => {
        expect(interception.request.url).to.include(`tenant_id=eq.${MOCK_TENANT_ID}`);
      });

      cy.visit('/admin/inventory');
      cy.wait('@getProducts').then((interception) => {
        expect(interception.request.url).to.include(`tenant_id=eq.${MOCK_TENANT_ID}`);
      });
    });

    it('Aislamiento de Escritura: Debería inyectar obligatoriamente el TenantID en POSTs', () => {
      cy.intercept('GET', '**/rest/v1/products*', { statusCode: 200, body: [] }).as('getProducts');
      cy.visit('/admin/inventory', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-isolation-1');
        }
      });
      cy.wait('@getProducts');
      
      // Interceptamos la creación del producto
      cy.intercept('POST', '**/rest/v1/products*', {
        statusCode: 201,
        body: [{ id: 'new-product-id' }]
      }).as('postProduct');

      // Intercept categories because it's required for creating a product
      cy.intercept('GET', '**/rest/v1/categories*', { statusCode: 200, body: [] }).as('getCategories');

      // Simulamos la interacción de usuario
      cy.contains('Nuevo Producto').click();
      
      // Esperar a que cargue la página del formulario
      cy.url().should('include', '/admin/products/new');
      
      // Rellenamos datos básicos usando los selectores correctos de admin-product-form-page.html
      cy.get('input[name="name"]').type('Producto SaaS Test Isolation');
      cy.get('input[name="price"]').type('1500');
      
      // Enviamos el formulario (el boton no es type=submit, es un (click))
      cy.contains('button', 'Guardar').click();
      
      // Aserción crítica: El payload DEBE contener el tenant_id de la sucursal activa
      cy.wait('@postProduct').then((interception) => {
        const body = interception.request.body;
        // Dependiendo de Supabase-js, puede ser un objeto o un array de objetos
        const payload = Array.isArray(body) ? body[0] : body;
        
        expect(payload).to.have.property('tenant_id');
        expect(payload.tenant_id).to.eq(MOCK_TENANT_ID);
      });
    });
  });

  context('2. SaaS Plan Security (Verificación de Restricciones por Plan)', () => {
    
    it('Suscripción Básica: Debería denegar acceso a inventario y redirigir', () => {
      // Simular Sucursal con Plan Básico (solo tiene repairs habilitado)
      cy.intercept('GET', '**/rest/v1/branches?*id=eq.branch-basic*', {
        statusCode: 200,
        body: [{ 
          id: 'branch-basic',
          tenant_id: MOCK_TENANT_ID,
          is_active: true,
          modules_config: { repairs: true, inventory: false, dashboard: false }
        }]
      }).as('getBasicBranch');

      // Intentar acceder a un módulo prohibido
      cy.visit('/admin/inventory', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-basic');
        }
      });
      
      cy.wait('@getBasicBranch');
      cy.url().should('include', '/upgrade-required');
      cy.contains('Módulo no incluido').should('exist');
    });

    it('Suscripción Estándar: Debería permitir Inventario pero denegar Dashboard Global', () => {
      cy.intercept('GET', '**/rest/v1/branches?*id=eq.branch-standard*', {
        statusCode: 200,
        body: [{ 
          id: 'branch-standard',
          tenant_id: MOCK_TENANT_ID,
          is_active: true,
          modules_config: { repairs: true, inventory: true, dashboard: false }
        }]
      }).as('getStandardBranch');

      // Módulo permitido
      cy.visit('/admin/inventory', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-standard');
        }
      });
      cy.wait('@getStandardBranch');
      cy.url().should('include', '/admin/inventory');

      // Módulo prohibido en el plan estándar
      cy.visit('/admin/dashboard', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-standard');
        }
      });
      cy.wait('@getStandardBranch');
      cy.url().should('include', '/upgrade-required');
      cy.contains('Módulo no incluido').should('exist');
    });

    it('Suscripción Premium: Debería permitir acceso total a todas las rutas', () => {
      cy.intercept('GET', '**/rest/v1/branches?*id=eq.branch-premium*', {
        statusCode: 200,
        body: [{ 
          id: 'branch-premium',
          tenant_id: MOCK_TENANT_ID,
          is_active: true,
          modules_config: { dashboard: true, repairs: true, inventory: true, customers: true }
        }]
      }).as('getPremiumBranch');

      cy.visit('/admin/dashboard', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('arecofix_admin_branch_id', 'branch-premium');
        }
      });
      cy.wait('@getPremiumBranch');
      cy.url().should('include', '/admin/dashboard');

      cy.visit('/admin/inventory');
      cy.url().should('include', '/admin/inventory');

      cy.visit('/admin/repairs');
      cy.url().should('include', '/admin/repairs');
    });
  });

});
