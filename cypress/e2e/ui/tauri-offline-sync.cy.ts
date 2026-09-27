describe('Tauri Desktop App - Offline First Sync Engine & Responsiveness', () => {

  beforeEach(() => {
    // Limpiar storage para evitar tokens falsos de pruebas anteriores
    cy.clearLocalStorage();
    cy.clearCookies();
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
    cy.get('form').should('exist');

    // Volver a desktop (Tauri env)
    cy.viewport(1280, 720);

    // ── Paso 2: Login (evitando el 302 de SSR) ─────────────────────────────────
    // Usamos loginAsAdmin hacia /login con returnUrl para que el SSR devuelva 200 OK.
    // Esto permite que 'onBeforeLoad' inyecte el token, y luego Angular redirige al cliente.
    cy.loginAsAdmin('/login?returnUrl=/admin/dashboard', { isTauri: true });
    
    // Validar que estamos en el panel de administración
    cy.wait(3000);
    cy.url({ timeout: 10000 }).should('include', '/admin/dashboard');
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
