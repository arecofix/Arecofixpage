describe('Failover Resiliency (Supabase 402 to D1)', () => {
  beforeEach(() => {
    // Limpiar IndexedDB para asegurar que el cache esté vacío y forzar el failover
    cy.clearLocalStorage();
    cy.window().then((win) => {
      return new Promise<void>((resolve) => {
        const req = win.indexedDB.deleteDatabase('arecofix_offline_sync');
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    });

    // Interceptar llamadas a Supabase y forzar un error 402 (Payment Required)
    cy.intercept('GET', '**/rest/v1/*', {
      statusCode: 402,
      body: { error: 'Payment Required', message: 'Quota exceeded' }
    }).as('supabaseFail');

    // Interceptar llamadas al Worker D1 para verificar que el Failover actúa
    cy.intercept('GET', 'https://arecofix-d1-failover.ezequielenrico15.workers.dev/*').as('d1Failover');
  });

  it('debería cargar la página principal usando D1 cuando Supabase falla por cuota (402)', () => {
    cy.visit('http://arecofix.com.ar.localhost:4200/');

    // Verificar que la llamada a Supabase falló
    cy.wait('@supabaseFail');

    // Verificar que el Failover a D1 se activó exitosamente
    cy.wait('@d1Failover').its('response.statusCode').should('eq', 200);

    // Verificar que la página no está en blanco y renderizó componentes
    cy.get('app-root').should('be.visible');
    // Asumiendo que hay un header o titulo
    cy.get('h1, h2, .navbar').should('exist');
  });
});
