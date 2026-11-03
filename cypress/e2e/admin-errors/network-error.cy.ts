import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Manejo de Errores: Falla de Red', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
  });

  it('Maneja la falla de red mostrando un toast o alerta sin que la app crashee', () => {
    // Intercept PATCH product with 500 error
    cy.intercept('PATCH', '**/rest/v1/products*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('updateProductFail');

    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="price"]').clear().type('159000');
    cy.contains('button', 'Guardar').click({ force: true });

    cy.wait('@updateProductFail');

    // Verify app remains responsive and doesn't white-screen
    cy.get('form').should('be.visible');
  });
});

