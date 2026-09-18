describe('Supabase Resilience', () => {
  it('should dispatch supabase-down event on repeated 500 errors', () => {
    // Intercept API calls to simulate 500 Internal Server Error
    cy.intercept('GET', '**/rest/v1/*', {
      statusCode: 500,
      body: 'Internal Server Error'
    }).as('supabaseFail');

    // Visit the home page (or any page that loads data)
    cy.visit('/', {
      onBeforeLoad(win) {
        // Stub the event listener to assert it was called
        cy.stub(win, 'dispatchEvent').as('dispatchEvent');
      }
    });

    // Wait for the failing requests to finish (max retries = 3)
    // The timeout should be enough to cover the retry backoffs (1500 * 1, 1500 * 2...)
    cy.wait('@supabaseFail', { timeout: 15000 });
    cy.wait('@supabaseFail', { timeout: 15000 });
    cy.wait('@supabaseFail', { timeout: 15000 });

    // Assert that the supabase-down event was fired
    cy.get('@dispatchEvent').should('have.been.calledWithMatch', Cypress.sinon.match.has('type', 'supabase-down'));
  });
});
