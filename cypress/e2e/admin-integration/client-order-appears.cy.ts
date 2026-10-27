import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Integración: Pedido del Cliente Aparece en el Admin', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('Cuando un cliente genera un pedido, se visualiza en /admin/orders', () => {
    const { orders } = setupOrderMocks();

    // Simulate new client order inserted
    orders.unshift({
      id: 'ord-new-e2e',
      order_number: 'ORD-2026-9999',
      customer_name: 'Cliente Nuevo E2E',
      customer_email: 'nuevo@e2e.com',
      status: 'pending',
      payment_status: 'pending',
      subtotal: 75000,
      total: 75000,
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    cy.loginAsAdmin('/arecofix/admin/orders');

    cy.contains('Cliente Nuevo E2E').should('be.visible');
    cy.contains('ORD-2026-9999').should('be.visible');
  });
});

