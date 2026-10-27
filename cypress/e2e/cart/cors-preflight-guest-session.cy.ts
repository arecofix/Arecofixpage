describe('CORS Preflight and Guest Session E2E Verification', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('validates that preflight OPTIONS allows x-guest-session header on orders requests', () => {
    // Intercept OPTIONS preflight to verify browser access-control-request-headers
    cy.intercept('OPTIONS', '**/rest/v1/orders*', (req) => {
      const requestedHeaders = req.headers['access-control-request-headers'] || '';
      expect(requestedHeaders.toLowerCase()).to.include('x-guest-session');
      req.reply({
        statusCode: 200,
        headers: {
          'access-control-allow-origin': 'https://arecofix.com.ar',
          'access-control-allow-headers':
            'Accept,Content-Type,Authorization,apikey,x-guest-session,x-supabase-api-version,Prefer',
          'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
          'access-control-allow-credentials': 'true',
        },
      });
    }).as('ordersPreflight');

    // Intercept orders GET to ensure x-guest-session is sent in request headers
    cy.intercept('GET', '**/rest/v1/orders*', (req) => {
      expect(req.headers['x-guest-session']).to.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      req.reply({
        statusCode: 200,
        body: [],
        headers: {
          'access-control-allow-origin': 'https://arecofix.com.ar',
          'access-control-allow-credentials': 'true',
        },
      });
    }).as('ordersRequest');

    // Intercept categories to ensure it does NOT send x-guest-session
    cy.intercept('GET', '**/rest/v1/categories*', (req) => {
      expect(req.headers['x-guest-session']).to.be.undefined;
      req.reply({
        statusCode: 200,
        body: [],
        headers: {
          'access-control-allow-origin': 'https://arecofix.com.ar',
        },
      });
    }).as('categoriesRequest');

    cy.visit('/productos');
  });
});
