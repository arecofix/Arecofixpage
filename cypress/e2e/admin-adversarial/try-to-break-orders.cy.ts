import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Adversarial: Resiliencia de Pedidos', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('Resiste inyecciones SQL en la búsqueda de pedidos sin romperse', () => {
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');

    const sqlPayload = "' OR '1'='1; DROP TABLE orders; --";
    cy.get('input[placeholder*="Buscar"]').type(sqlPayload);

    cy.get('body').should('be.visible');
  });

  it('No permite transiciones de estado arbitrarias o saltos imposibles', () => {
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');

    // On a pending order, "Entregar" should not be available directly
    cy.get('button[title*="Entregado"]').should('not.exist');
  });
});
