describe('Admin - Control de Acceso: Sin Rol Admin', () => {
  it('Un usuario sin rol de administrador es bloqueado de acceder al panel', () => {
    // Intercept user profile with customer role
    const customerUser = {
      id: 'cust-user-1',
      email: 'customer@test.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'customer' }
    };

    const customerProfile = {
      id: 'cust-user-1',
      email: 'customer@test.com',
      role: 'customer',
      is_active: true
    };

    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: customerUser
    }).as('getCustomerUser');

    cy.intercept('**/rest/v1/profiles*', (req) => {
      const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: wantsObject ? customerProfile : [customerProfile]
      });
    }).as('getCustomerProfile');

    // Visit admin products directly
    cy.visit('/arecofix/admin/products', { failOnStatusCode: false });

    // Should redirect away from /admin or show access denied / login
    cy.url().should('not.match', /\/admin\/products$/);
  });
});
