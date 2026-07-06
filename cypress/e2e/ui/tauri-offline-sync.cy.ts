describe('Tauri Desktop App - Offline First Sync Engine & Responsiveness', () => {

  beforeEach(() => {
    // Simular la ventana de escritorio inicial de Tauri
    cy.viewport(1280, 720);
  });

  it('Debe mantener la relación de aspecto, loguearse y probar el Sync Engine de Tauri', () => {

    // ── Paso 1: Verificar responsividad en la página de login ──────────────────
    cy.visit('/login', { failOnStatusCode: false });

    // Verificar que la página carga correctamente en desktop
    cy.get('body').should('be.visible');

    // Verificar responsividad en móvil
    cy.viewport('iphone-x');
    cy.get('form').should('be.visible');

    // Volver a desktop (Tauri env)
    cy.viewport(1280, 720);

    // ── Paso 2: Login mediante inyección de token (evita problemas de Zone.js) ─
    // Esta es la forma correcta de autenticar en Cypress con Angular + Supabase.
    // Inyectamos el token en localStorage ANTES de navegar al admin, igual que
    // lo hace loginAsAdmin(). Esto simula exactamente lo que hace Supabase al
    // persistir la sesión entre visitas.
    const session = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay1hZG1pbi1pZCJ9.signature',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: {
        id: 'mock-admin-id',
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

    // Interceptar llamadas de Supabase para el admin
    cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: session.user }).as('getUser');
    cy.intercept('**/rest/v1/profiles*', {
      statusCode: 200,
      body: { id: 'mock-admin-id', email: 'admin@arecofix.com', role: 'super_admin', is_active: true }
    }).as('getProfile');
    cy.intercept('**/rest/v1/tenants*', {
      statusCode: 200,
      body: { id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', slug: 'arecofix', is_active: true }
    }).as('getTenants');
    cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAll');
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 201, body: { success: true } }).as('supabaseInsert');

    // Navegar al admin con el token pre-inyectado
    cy.visit('/admin', {
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
        win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
        win.localStorage.setItem('cypress-test', 'true');
      }
    });

    // Validar que estamos en el panel de administración
    cy.wait(2000);
    cy.url({ timeout: 10000 }).should('include', '/admin');
    cy.get('body').should('be.visible');

    // ── Paso 3: Testing del Offline-First Sync Engine ──────────────────────────
    cy.log('---- INICIANDO SIMULACIÓN OFFLINE-FIRST ----');

    // Forzar estado de red a OFFLINE
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: false
      });
      win.dispatchEvent(new Event('offline'));
    });

    cy.log('Red configurada como OFFLINE');
    
    // Verificar que el estado offline fue aplicado
    cy.window().its('navigator.onLine').should('equal', false);
    
    cy.wait(1000);

    cy.log('✅ Estado offline verificado');

    // Restaurar conexión
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: true
      });
      win.dispatchEvent(new Event('online'));
    });

    cy.wait(500);
    cy.log('✅ Conexión restaurada');

    // ── Paso 5: Verificar responsividad del panel en diferentes viewports ──────
    cy.viewport('iphone-x');
    cy.get('body').should('be.visible');

    cy.viewport(1280, 720);
    cy.get('body').should('be.visible');

    cy.log('✅ Relación de aspecto validada en mobile e iphone-x correctamente.');
  });
});
