import { OrderDeliveredEvent } from '../../../src/app/domain/events/order-delivered.event';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Event-Driven: Pedido Online -> Facturación (OrderDeliveredEvent -> InvoiceDraft)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Orden con requestInvoice: true crea borrador en estado draft', () => {
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new OrderDeliveredEvent(
        'ord-inv-1',
        {
          id: 'cust-002',
          name: 'María González',
          taxId: '27359876542',
          taxCondition: 'CONSUMIDOR_FINAL',
          address: 'Av. Santa Fe 2500',
          email: 'maria@example.com',
          phone: '456789',
        },
        [
          {
            productId: 'prod-004',
            description: 'Cable Lightning 1m Original',
            quantity: 2,
            unitPrice: 18000,
            taxRate: 0.21,
            subtotal: 36000,
          },
        ],
        36000,
        'mercadopago',
        true, // requestInvoice
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.order_id).to.equal('ord-inv-1');
      expect(interception.request.body.origin).to.equal('order');
      expect(interception.request.body.total_amount).to.equal(36000);
    });
  });

  it('Idempotencia: entregar dos veces la misma orden no duplica el borrador', () => {
    let calls = 0;
    cy.intercept('POST', '**/rest/v1/invoices*', () => {
      calls++;
    }).as('postInvoice');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new OrderDeliveredEvent(
        'ord-inv-idemp-1',
        {
          id: 'cust-002',
          name: 'María González',
          taxId: '27359876542',
          taxCondition: 'CONSUMIDOR_FINAL',
          address: 'Av. Santa Fe 2500',
          email: 'maria@example.com',
          phone: '456789',
        },
        [],
        15000,
        'cash',
        true,
        new Date()
      );

      eventBus.publish(event);
      eventBus.publish(event);
    });

    cy.wait('@postInvoice').then(() => {
      cy.wait(400).then(() => {
        expect(calls).to.equal(1);
      });
    });
  });
});
