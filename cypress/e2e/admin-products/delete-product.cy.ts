import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Eliminar / Soft Delete', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe abrir modal de confirmación antes de eliminar un producto', () => {
    // Click delete icon button
    cy.get('button:has(i.fa-trash-alt), button[data-tip="Eliminar"]').first().click({ force: true });

    // Verify confirmation modal appears
    cy.get('.modal-open, dialog[open], .fixed.inset-0').should('be.visible');
    cy.contains('¿Eliminar producto?').should('be.visible');

    // Confirm action
    cy.contains('button', 'eliminar').click({ force: true });

    // Should update is_active: false
    cy.wait('@updateProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.is_active).to.equal(false);
    });
  });
});
