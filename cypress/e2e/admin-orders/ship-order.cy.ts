import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Despachar Pedido', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe abrir modal de despacho para un pedido pagado y permitir ingresar tracking', () => {
    cy.get('button[title*="Despachar"]').first().click({ force: true });

    // Verify tracking modal
    cy.get('.fixed.inset-0').should('be.visible');
    cy.contains('Despachar Pedido').should('be.visible');

    // Enter tracking info
    cy.get('input[placeholder*="AR123456789"]').type('TRACK-TEST-1234');

    // Confirm dispatch
    cy.contains('button', 'Confirmar Despacho').click({ force: true });

    cy.wait('@updateOrder').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.status).to.equal('shipped');
      expect(body.tracking_code).to.equal('TRACK-TEST-1234');
    });
  });
});


