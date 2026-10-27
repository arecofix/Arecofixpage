import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Crear', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/new');
  });

  it('Debe renderizar el formulario de creación de producto', () => {
    cy.get('form').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="price"]').should('be.visible');
    cy.get('input[name="stock"]').should('be.visible');
  });

  it('Debe crear un producto correctamente con datos válidos', () => {
    cy.get('select[name="category_id"] option').should('have.length.at.least', 2);
    cy.get('input[name="name"]').should('be.visible').clear().type('Cargador Rápido 20W USB-C');
    cy.get('input[name="price"]').clear().type('25000');
    cy.get('input[name="stock"]').clear().type('10');
    cy.get('input[name="min_stock_alert"]').clear().type('3');
    cy.get('input[name="sku"]').type('CHG-20W-USBC');
    cy.get('select[name="category_id"]').select('cat-001');

    cy.contains('button', 'Guardar').click({ force: true });
    cy.wait('@createProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.name).to.equal('Cargador Rápido 20W USB-C');
      expect(body.price).to.equal(25000);
      expect(body.stock).to.equal(10);
    });

    cy.url().should('include', '/admin/products');
  });
});
