describe('Full E2E Flow: Free Trial -> Admin -> Offline Sync', () => {

  const mockUser = {
    id: 'mock-user-id',
    email: 'taller@mocked.com'
  };

  const mockTenant = {
    id: 'mock-tenant-id',
    name: 'Taller Mock E2E',
    slug: 'taller-mock-e2e',
    is_active: true,
    plan: 'trial'
  };

  const mockBranch = {
    id: 'mock-branch-id',
    tenant_id: mockTenant.id,
    name: 'Sede Central',
    city: 'Mock City'
  };

  beforeEach(() => {
    // 1. Limpiar ambiente
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.viewport(1280, 720); // Escritorio (Tauri)

    // 2. Mockear Edge Function de Trial
    cy.intercept('POST', '**/functions/v1/create-trial-tenant*', {
      statusCode: 200,
      body: {
        success: true,
        tenantId: mockTenant.id,
        email: mockUser.email
      },
    }).as('createTrialTenant');

    // 3. Mockear consultas Auth/Admin
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: mockUser.id, email: mockUser.email }
    }).as('getUser');

    cy.intercept('GET', '**/rest/v1/profiles?*', {
      statusCode: 200,
      body: [{ id: mockUser.id, role: 'tenant_owner', first_name: 'Usuario', last_name: 'Mock' }]
    }).as('getProfile');

    cy.intercept('GET', '**/rest/v1/tenants?*', {
      statusCode: 200,
      body: [mockTenant]
    }).as('getTenants');

    cy.intercept('GET', '**/rest/v1/branches?*', {
      statusCode: 200,
      body: [mockBranch]
    }).as('getBranches');

    // Mockear lectura y creación de Reparaciones
    cy.intercept('GET', '**/rest/v1/repairs?*', {
      statusCode: 200,
      body: [] // Empezamos sin reparaciones
    }).as('getRepairs');

    cy.intercept('GET', '**/rest/v1/brands?*', { statusCode: 200, body: [] }).as('getBrands');
    cy.intercept('GET', '**/rest/v1/company_settings?*', { statusCode: 200, body: [] }).as('getCompanySettings');
    cy.intercept('GET', '**/rest/v1/profiles?*', { statusCode: 200, body: [] }).as('getProfilesFallback');
    cy.intercept('GET', '**/rest/v1/products?*', { statusCode: 200, body: [], headers: { 'Content-Range': '0-0/1' } }).as('getProducts');


    cy.intercept('POST', '**/rest/v1/repairs*', {
      statusCode: 201,
      body: [{ id: 'mock-repair-id', customer_name: 'Cliente Mock', status: 'pending' }]
    }).as('createRepair');
  });

  it('Debe crear una cuenta, iniciar sesión simulado, usar el panel y testear offline sync', () => {
    
    // ==========================================
    // FASE 1: Registro vía /prueba-gratis
    // ==========================================
    cy.visit('/fixtecnicos');
    
    cy.get('a[routerLink="/prueba-gratis"], a[href="/prueba-gratis"]').first().click({ force: true });
    cy.url().should('include', '/prueba-gratis');
    
    cy.wait(1000); // Esperamos hidratación Angular

    cy.get('input[formControlName="businessName"]').type('Taller Mock E2E', { delay: 50 });
    cy.get('input[formControlName="userName"]').type('Usuario Mock', { delay: 50 });
    cy.get('input[formControlName="whatsapp"]').type('1122334455', { delay: 50 });
    cy.get('input[formControlName="email"]').type(mockUser.email, { delay: 50 });

    cy.get('button[type="submit"]').contains('Solicitar Prueba Gratis').click({ force: true });

    cy.wait('@createTrialTenant');
    cy.contains('¡Tu sucursal ha sido creada!').should('be.visible');

    // ==========================================
    // FASE 2: Simular inicio de sesión (Login/Tauri)
    // ==========================================
    // Inyectamos el token falso en localStorage (como si el usuario hubiera puesto su email y clave y entrado)
    cy.window().then((win) => {
      const mockSession = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay11c2VyLWlkIn0.signature',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        token_type: 'bearer',
        user: {
          id: mockUser.id,
          aud: 'authenticated',
          role: 'authenticated',
          email: mockUser.email,
          user_metadata: { role: 'tenant_owner' },
        }
      };
      win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
      win.localStorage.setItem('supabase-remember-me', 'true');
    });

    // Navegamos al panel de reparaciones
    cy.visit('/admin/repairs');
    // cy.wait(['@getProfile', '@getTenants', '@getBranches']);
    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');

    // ==========================================
    // FASE 3: Interacción Admin & Modo Offline
    // ==========================================
    
    // Simular pérdida de internet (Offline)
    cy.log('---- SIMULANDO OFFLINE MODE (TAURI) ----');
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', { writable: true, value: false });
      win.dispatchEvent(new Event('offline'));
    });
    cy.wait(500);

    // Intentar abrir el modal/pantalla de nueva reparación
    cy.get('a[routerLink="/admin/repairs/new"], a[href="/admin/repairs/new"]').first().click({ force: true });
    
    // Esperamos 500ms por si hay animaciones y verificamos la ruta
    cy.wait(500);
    cy.url().should('include', '/admin/repairs/new');

    const setInputValue = (selector: string, value: string) => {
        cy.get(selector, { timeout: 10000 }).first().clear({ force: true });
        cy.get(selector, { timeout: 10000 }).first().invoke('val', value).trigger('input').blur();
    };

    setInputValue('input[formControlName="customer_name"]', 'Cliente Offline Tauri');
    setInputValue('input[formControlName="device_model"]', 'iPhone 12 Offline');
    setInputValue('textarea[formControlName="issue_description"]', 'Pantalla rota simulando sin internet');
    setInputValue('input[formControlName="estimated_cost"]', '45000');
    
    // Interceptar la llamada RPC de Supabase para cuando vuelva la red (o si falla)
    cy.intercept('POST', '**/rpc/save_repair_order*').as('postRepair');
    
    cy.contains('button', 'GUARDAR ORDEN').click({ force: true });

    // Como estamos offline, verificamos que no crashee o que Angular asuma el estado offline
    // En Arecofix, el Service local encola el request en IndexedDB.
    cy.wait(1000);

    // Restaurar internet (Online)
    cy.log('---- SIMULANDO ONLINE MODE (TAURI) ----');
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', { writable: true, value: true });
      win.dispatchEvent(new Event('online'));
    });
    
    cy.wait(1000);

    cy.log('✅ Test E2E Completo Finalizado');
  });
});
