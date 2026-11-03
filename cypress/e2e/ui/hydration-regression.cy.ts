describe('Regresión de Hidratación SSR — No Pérdida de Caracteres', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('no pierde caracteres al tipear rápido', () => {
    cy.visit('/register');
    cy.get('input[formControlName="email"]').type('testuser@example.com', { delay: 5 });
    cy.get('input[formControlName="email"]').should('have.value', 'testuser@example.com');
  });
});

