describe('Supabase Resilience', () => {
  it('should dispatch supabase-down event on repeated 500 errors', () => {
    // Intercept API calls to simulate 500 Internal Server Error
    cy.intercept('GET', '**/rest/v1/*', {
      statusCode: 500,
      body: 'Internal Server Error'
    }).as('supabaseFail');

    // Also fail D1 worker so it doesn't mask the failure
    cy.intercept('GET', 'https://arecofix-d1-failover.ezequielenrico15.workers.dev/**', {
      statusCode: 500,
      body: 'D1 Failover Error'
    }).as('d1Fail');

    const stub = cy.stub().as('supabaseDownEvent');

    // Visit the home page (or any page that loads data)
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__cypressTest = true;
        win.addEventListener('supabase-down', (e) => {
          win.__eventHandled = true;
          stub(e);
        });
      }
    });

    // Wait for the failing requests to finish
    cy.wait('@supabaseFail', { timeout: 15000 });

    // Assert that the supabase-down event or flag was fired
    cy.window({ timeout: 20000 }).should((win) => {
      expect(win.__supabaseDownDispatched || win.__eventHandled).to.be.true;
    });
  });
});
