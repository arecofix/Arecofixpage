describe('Tauri Desktop App - Full Offline Flow', () => {

  beforeEach(() => {
    // Limpiamos la caché local para iniciar desde cero
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Simular la ventana de escritorio inicial de Tauri
    cy.viewport(1280, 720);
  });

  it('Debe cargar datos online y mantenerlos funcionales al quedarse offline', () => {
    
    // ── Paso 1: Carga inicial ────────────────

    cy.log('---- ESTADO: INICIANDO ENTORNO FLASK/TAURI ----');
    
    // 1.a Login
    cy.loginAsAdmin('/#/admin/dashboard', { isTauri: true });
    
    cy.get('body').then($body => {
       if ($body.find('#debug-crash').length > 0) {
          throw new Error('APP CRASHED: ' + $body.find('#debug-crash').text());
       }
    });

    // 1.b Validar que se llegue al dashboard
    cy.url({ timeout: 10000 }).should('include', 'admin/dashboard');

    // 1.b Visitar Productos
    cy.window().then(win => {
      win.location.hash = '#/productos';
    });
    cy.wait(3000); // Esperar a que la petición a Flask termine
    cy.get('body').should('contain', 'Productos');

    // 1.c Visitar Servicios
    cy.window().then(win => {
      win.location.hash = '#/servicios';
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

    // Interceptar peticiones a Supabase para simular falta de internet real hacia el backend de la nube
    cy.intercept('**/rest/v1/*', { forceNetworkError: true }).as('offlineSupabase');
    cy.intercept('**/auth/v1/*', { forceNetworkError: true }).as('offlineAuth');
    
    // Validar que se está usando el puerto local (Flask) de Tauri
    cy.intercept('GET', 'http://localhost:5000/api/productos*').as('flaskProducts');


    // ── Paso 3: Verificación de Flujo Offline ──────────────────────────────
    cy.log('---- VERIFICANDO FLUJO OFFLINE ----');

    // 3.a Navegar a Productos usando el Router SPA (pushState)
    cy.window().then(win => {
      win.location.hash = '#/productos';
    });
    
    // Debería cargar desde Flask (http://localhost:5000)
    cy.wait('@flaskProducts', { timeout: 10000 });
    cy.get('body', { timeout: 8000 }).should('contain', 'Productos');
    // Verificar que un producto se renderiza
    cy.get('product-card', { timeout: 10000 }).should('exist');

    // 3.c Navegar a Servicios usando el Router SPA
    cy.window().then(win => {
      win.location.hash = '#/servicios';
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
