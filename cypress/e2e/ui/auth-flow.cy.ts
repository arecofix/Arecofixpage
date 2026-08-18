describe('Authentication Flow - Normal User', () => {
  const uniqueId = new Date().getTime();
  const testEmail = `testuser_${uniqueId}@arecofix.com`;
  const testPassword = 'TestPassword123!';

  before(() => {
    // We clean up any localStorage/sessionStorage state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('1. Debe poder registrarse un usuario común y ser redirigido a la página de inicio', () => {
    cy.visit('/register');
    cy.get('body').should('be.visible');

    // Fill registration form
    cy.get('input[formControlName="first_name"]').type('Test');
    cy.get('input[formControlName="last_name"]').type('User');
    cy.get('input[formControlName="email"]').type(testEmail);
    cy.get('input[formControlName="phone"]').type('1234567890');
    cy.get('input[formControlName="password"]').type(testPassword);
    cy.get('input[formControlName="confirmPassword"]').type(testPassword);

    // Accept terms
    cy.get('input[formControlName="terms"]').check({ force: true });

    // Submit form
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Verify success toast or UI feedback exists
    cy.get('.bg-emerald-50', { timeout: 10000 }).should('be.visible');

    // If it requires email confirmation, we can't test auto-login easily. 
    // We will assume it redirects if auto-login is enabled.
    // Let's just wait for 3 seconds to let any redirect happen if it does.
    cy.wait(3000);

    // After registration, depending on the implementation it might login automatically
    // Wait for redirect to home
    cy.url().should('not.include', '/admin');
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Verify user is logged in visually (avatar should appear instead of login button)
    cy.get('a[href="/login"]').should('not.exist');
  });

  it('2. Debe poder cerrar sesión', () => {
    // Open user menu
    cy.get('.dropdown.dropdown-end').first().click({ force: true });
    // Click logout
    cy.contains('Cerrar Sesión').click({ force: true });
    
    // Verify we are logged out
    cy.contains('Iniciar Sesion', { matchCase: false }).should('be.visible');
  });

  it('3. Debe poder iniciar sesión y ser redirigido a la página de inicio', () => {
    cy.visit('/login');
    cy.get('body').should('be.visible');

    cy.get('input[formControlName="email"]').type(testEmail);
    cy.get('input[formControlName="password"]').type(testPassword);

    cy.get('button[type="submit"]').click();

    // Verify success toast
    cy.contains('Inicio de sesión exitoso', { timeout: 10000 }).should('be.visible');

    // Verify redirect to home, NOT admin
    cy.url().should('not.include', '/admin');
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Verify user is logged in
    cy.get('a[href="/login"]').should('not.exist');
  });
});
