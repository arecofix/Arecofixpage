import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Stock: Alertas Visuales de Bajo Stock', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe mostrar badges de alerta (amarillo/rojo) para stock bajo y sin stock', () => {
    // Badge for low stock (e.g. badge-warning or yellow)
    cy.get('.badge-warning, .text-warning, .bg-amber-100, .bg-yellow-100, [class*="warning"]').should('exist');

    // Badge for out of stock (e.g. badge-error or red)
    cy.get('.badge-error, .text-error, .bg-red-100, [class*="error"]').should('exist');
  });
});
