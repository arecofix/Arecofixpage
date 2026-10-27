import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Stock: Visualización', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe mostrar la columna de stock con sus valores actuales', () => {
    cy.get('th').should('contain.text', 'Stock');
    cy.get('tbody tr').first().within(() => {
      cy.get('.radial-progress, .badge, span').should('contain.text', '15');
    });
  });
});
