import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Actualizar Estado', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe permitir marcar como Pagado un pedido pendiente', () => {
    cy.get('button[title*="Cobrado"], button[title*="Pagado"]').first().click({ force: true });

    cy.wait('@updateOrder').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.status).to.equal('paid');
    });
  });
});

