describe('Tauri Desktop App - Full Offline Flow', () => {

  beforeEach(() => {
    // Limpiamos la caché local para iniciar desde cero
    cy.clearLocalStorage();
    cy.clearCookies();
    // Limpiamos IndexedDB (Supabase custom cache)
    cy.window().then((win) => {
      const req = win.indexedDB.deleteDatabase('ArecofixOfflineDB');
      req.onsuccess = () => console.log('Deleted database successfully');
    });
    
    // Simular la ventana de escritorio inicial de Tauri
    cy.viewport(1280, 720);
  });

  it('Debe cargar datos online y mantenerlos funcionales al quedarse offline', () => {
    
    // ── Paso 1: Carga inicial ONLINE para popular IndexedDB ────────────────
    cy.log('---- ESTADO: ONLINE (Populando Caché) ----');
    
    // 1.a Login
    cy.loginRealAdmin('/login?returnUrl=/admin/dashboard');
    cy.wait(3000);
    cy.url({ timeout: 10000 }).should('include', '/admin/dashboard');

    // 1.b Visitar Productos
    cy.window().then(win => {
      win.history.pushState(null, '', '/productos');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });
    cy.wait(3000); // Esperar a que la petición a Supabase termine y se guarde en IndexedDB
    cy.get('body').should('contain', 'Productos');

    // 1.c Visitar Servicios
    cy.window().then(win => {
      win.history.pushState(null, '', '/servicios');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });
    cy.wait(3000);
    cy.get('body').should('contain', 'Servicios');



    // ── Paso 2: Simulación de pérdida de conexión (OFFLINE) ────────────────
    cy.log('---- ESTADO: OFFLINE (Desconectando) ----');
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: false
      });
      win.dispatchEvent(new Event('offline'));
    });
    cy.window().its('navigator.onLine').should('equal', false);

    // Interceptar peticiones a Supabase para simular falta de internet real hacia el backend
    cy.intercept('**/rest/v1/*', { forceNetworkError: true }).as('offlineSupabase');
    cy.intercept('**/auth/v1/*', { forceNetworkError: true }).as('offlineAuth');


    // ── Paso 3: Verificación de Flujo Offline ──────────────────────────────
    cy.log('---- VERIFICANDO FLUJO OFFLINE ----');

    // 3.a Navegar a Productos usando el Router SPA (pushState)
    cy.window().then(win => {
      win.history.pushState(null, '', '/productos');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });
    // Debería cargar desde IndexedDB a través del SupabaseService
    cy.get('body', { timeout: 8000 }).should('contain', 'Productos');
    // Verificar que un producto se renderiza
    cy.get('product-card', { timeout: 10000 }).should('exist');

    // 3.c Navegar a Servicios usando el Router SPA
    cy.window().then(win => {
      win.history.pushState(null, '', '/servicios');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });
    cy.get('body', { timeout: 8000 }).should('contain', 'Servicios');


    // ── Paso 4: Restaurar conexión ─────────────────────────────────────────
    cy.log('---- ESTADO: ONLINE (Restaurando) ----');
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: true
      });
      win.dispatchEvent(new Event('online'));
    });
    cy.wait(500);
    cy.log('✅ Prueba offline completada exitosamente.');
  });
});
