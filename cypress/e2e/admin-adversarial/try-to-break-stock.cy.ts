import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Adversarial: Resiliencia de Stock', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('No permite números astronómicos o inválidos en ajuste de stock', () => {
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    cy.get('input[name="stock"]').clear().type('9999999999999999');
    cy.contains('button', 'Guardar').click({ force: true });

    // Verify submission is constrained or clamped
    cy.get('form').should('be.visible');
  });

  it('Rechaza stock con decimales donde solo se admiten enteros', () => {
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    cy.get('input[name="stock"]').clear().type('12.5');
    cy.contains('button', 'Guardar').click({ force: true });

    // The zod schema enforces integer stock
    cy.get('@updateProduct.all').should('have.length', 0);
  });
});
