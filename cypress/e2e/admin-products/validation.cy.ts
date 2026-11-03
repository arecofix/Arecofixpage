import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Validación', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/new');
  });

  it('No permite enviar el formulario sin nombre', () => {
    cy.get('input[name="name"]').clear();
    cy.get('input[name="price"]').clear().type('15000');
    cy.get('input[name="stock"]').clear().type('5');
    cy.get('button[type="submit"]').click();

    // Verify submission is blocked or error message appears
    cy.get('@createProduct.all').should('have.length', 0);
  });

  it('No permite precio negativo o cero', () => {
    cy.get('input[name="name"]').type('Producto Inválido');
    cy.get('input[name="price"]').clear().type('-500');
    cy.get('button[type="submit"]').click();

    cy.get('@createProduct.all').should('have.length', 0);
  });

  it('No permite stock negativo', () => {
    cy.get('input[name="name"]').type('Producto Inválido');
    cy.get('input[name="price"]').clear().type('1000');
    cy.get('input[name="stock"]').clear().type('-10');
    cy.get('button[type="submit"]').click();

    cy.get('@createProduct.all').should('have.length', 0);
  });
});
