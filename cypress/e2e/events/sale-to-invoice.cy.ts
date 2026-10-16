import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Event-Driven: Venta -> Facturación (SaleCompletedEvent -> InvoiceDraft)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Venta con requestInvoice: true crea borrador en draft con sourceId e ítems', () => {
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new SaleCompletedEvent(
        'sale-inv-1',
        [
          {
            productId: 'prod-001',
            description: 'Módulo Pantalla iPhone 13 OLED',
            quantity: 1,
            unitPrice: 149000,
            taxRate: 0.21,
            subtotal: 149000,
          },
        ],
        149000,
        0,
        149000,
        'cash',
        {
          id: 'cust-001',
          name: 'Juan Pérez',
          taxId: '20301234567',
          taxCondition: 'RESPONSABLE_INSCRIPTO',
          address: 'Calle Falsa 123',
          email: 'juan@example.com',
          phone: '123456',
        },
        true, // requestInvoice
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.order_id).to.equal('sale-inv-1');
      expect(interception.request.body.origin).to.equal('sale');
      expect(interception.request.body.total_amount).to.equal(149000);
    });
  });

  it('Venta con requestInvoice: false NO crea borrador de factura', () => {
    let invoiceCreated = false;
    cy.intercept('POST', '**/rest/v1/invoices*', () => {
      invoiceCreated = true;
    });

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new SaleCompletedEvent(
        'sale-no-inv',
        [],
        5000,
        0,
        5000,
        'cash',
        null,
        false, // requestInvoice false
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait(500).then(() => {
      expect(invoiceCreated).to.be.false;
    });
  });
});
