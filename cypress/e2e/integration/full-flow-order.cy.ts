import { OrderDeliveredEvent } from '../../../src/app/domain/events/order-delivered.event';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Flujo de Integración Completo: Orden Tienda Online E2E', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/orders');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Entregar orden online con factura solicitada crea ingreso en caja y borrador fiscal', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');

    const orderId = 'ord-online-flow-1';

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new OrderDeliveredEvent(
        orderId,
        {
          id: 'cust-003',
          name: 'Tech Corp SA',
          taxId: '30710000009',
          taxCondition: 'RESPONSABLE_INSCRIPTO',
          address: 'Av. Corrientes 1000',
          email: 'admin@techcorp.com',
          phone: '1199990000',
        },
        [
          {
            productId: 'prod-004',
            description: 'Cable Lightning 1m Original',
            quantity: 3,
            unitPrice: 18000,
            taxRate: 0.21,
            subtotal: 54000,
          },
        ],
        54000,
        'mercadopago',
        true, // requestInvoice
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(54000);
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal(orderId);
    });

    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.order_id).to.equal(orderId);
      expect(interception.request.body.origin).to.equal('order');
    });
  });
});
