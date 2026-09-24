describe('Security: Ghost Authentication (Token Deletion)', () => {
  beforeEach(() => {
    cy.loginAsAdmin('/admin/dashboard');
    cy.get('h1').should('contain', 'Panel de Control'); // Verificar que estamos dentro
  });

  it('debería expulsar al usuario si el token se corrompe o elimina en tiempo de ejecución', () => {
    // Simulamos que un atacante o error borra el token de localStorage
    cy.clearLocalStorage();
    cy.clearCookies();

    // Disparamos una acción que requiera auth
    cy.visit('/admin/repairs/new');

    // El sistema debería interceptar la falta de token (o el token invalido)
    // y expulsar al usuario automáticamente al login
    cy.url().should('include', '/login');
  });
});
