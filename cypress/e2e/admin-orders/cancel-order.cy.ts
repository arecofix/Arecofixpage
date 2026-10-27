import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Cancelar Pedido', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe abrir modal de cancelación, requerir motivo y actualizar a cancelado', () => {
    cy.get('button[title*="Cancelar"]').first().click({ force: true });

    // Verify modal
    cy.get('.fixed.inset-0').should('be.visible');
    cy.contains('Cancelar Pedido').should('be.visible');

    // Enter reason
    cy.get('input[placeholder*="Solicitado"]').type('Cancelado a solicitud del cliente');

    // Confirm cancel
    cy.contains('button', /cancelar pedido/i).click({ force: true });

    cy.wait('@updateOrder').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;
      expect(body.status).to.equal('cancelled');
    });
  });
});

