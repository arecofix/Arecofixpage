import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Manejo de Errores: Datos Inválidos en Servidor', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
  });

  it('Maneja error 400 por payload inválido de Supabase sin crashear', () => {
    cy.intercept('POST', '**/rest/v1/products*', {
      statusCode: 400,
      body: { message: 'check constraint violation: price must be positive' }
    }).as('createProductError');

    cy.loginAsAdmin('/arecofix/admin/products/new');

    cy.get('input[name="name"]').type('Producto Con Error');
    cy.get('input[name="price"]').clear().type('1000');
    cy.get('input[name="stock"]').clear().type('5');
    cy.contains('button', 'Guardar').click({ force: true });

    cy.wait('@createProductError');
    cy.get('form').should('be.visible');
  });
});
