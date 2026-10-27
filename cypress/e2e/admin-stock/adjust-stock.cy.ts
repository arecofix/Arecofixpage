import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Stock: Ajuste Manual', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');
  });

  it('Debe permitir ajustar el stock manualmente desde el formulario', () => {
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="stock"]').clear().type('28');
    cy.contains('button', 'Guardar').click({ force: true });

    cy.wait('@updateProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.stock).to.equal(28);
    });

    cy.url().should('include', '/admin/products');
  });
});
