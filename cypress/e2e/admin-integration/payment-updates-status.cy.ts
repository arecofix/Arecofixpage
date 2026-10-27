import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Integración: Aprobación de Pago Actualiza Estado', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('Al aprobarse el pago, el pedido se muestra como Pagado en el panel admin', () => {
    const { orders } = setupOrderMocks([
      {
        id: 'ord-pay-1',
        order_number: 'ORD-PAY-100',
        customer_name: 'Comprador MP',
        status: 'paid',
        payment_status: 'approved',
        payment_method: 'mercadopago',
        subtotal: 50000,
        total: 50000,
        tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
        branch_id: 'branch-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);

    cy.loginAsAdmin('/arecofix/admin/orders');

    cy.contains('ORD-PAY-100').should('exist');
    cy.contains('Comprador MP').should('exist');
    cy.contains(/Pagado|Cobrado/i).should('exist');
  });
});

