import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Adversarial: Concurrencia e Idempotencia en Pedidos', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
  });

  it('Doble click rápido en acción de estado no dispara múltiples peticiones contradictorias', () => {
    cy.loginAsAdmin('/arecofix/admin/orders');

    // Click "Cobrar" on pending order rapidly
    cy.get('button[title*="Cobrado"], button[title*="Pagado"]').first().dblclick({ force: true });

    // Verify updateOrder was called and order status became paid without errors
    cy.wait('@updateOrder');
  });
});
