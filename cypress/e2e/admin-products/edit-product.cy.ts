import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Editar', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');
  });

  it('Debe cargar los datos del producto en el formulario y permitir editar', () => {
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    
    // Edit price and stock
    cy.get('input[name="price"]').clear().type('159000');
    cy.get('input[name="stock"]').clear().type('20');

    cy.contains('button', 'Guardar').click({ force: true });
    cy.wait('@updateProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.price).to.equal(159000);
      expect(body.stock).to.equal(20);
    });

    cy.url().should('include', '/admin/products');
  });
});
