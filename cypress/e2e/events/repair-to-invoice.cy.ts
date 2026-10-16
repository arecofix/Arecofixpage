import { RepairOrderReadyForInvoicingEvent } from '../../../src/app/domain/events/repair-order-ready-for-invoicing.event';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Event-Driven: Reparación -> Facturación (RepairOrderReady -> InvoiceDraft)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Pasar a LISTO_PARA_ENTREGAR crea siempre un borrador de factura', () => {
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new RepairOrderReadyForInvoicingEvent(
        'rep-001',
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
            description: 'Módulo Pantalla iPhone 13 OLED',
            quantity: 1,
            unitPrice: 149000,
            itemType: 'part',
          },
          {
            description: 'Mano de Obra Cambio de Módulo',
            quantity: 1,
            unitPrice: 35000,
            itemType: 'labor',
          },
        ],
        {
          subtotal: 184000,
          discount: 0,
          surcharge: 0,
          advancePayment: 0,
          total: 184000,
        },
        'cash',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.repair_order_id || interception.request.body.order_id).to.include('rep-001');
      expect(interception.request.body.total_amount).to.equal(184000);
    });
  });

  it('Idempotencia: recibir el evento de reparación repetidas veces no crea facturas duplicadas', () => {
    let count = 0;
    cy.intercept('POST', '**/rest/v1/invoices*', () => {
      count++;
    }).as('postInvoice');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new RepairOrderReadyForInvoicingEvent(
        'rep-idemp-1',
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
        {
          subtotal: 50000,
          discount: 0,
          surcharge: 0,
          advancePayment: 0,
          total: 50000,
        },
        'cash',
        new Date()
      );

      eventBus.publish(event);
      eventBus.publish(event);
    });

    cy.wait('@postInvoice').then(() => {
      cy.wait(400).then(() => {
        expect(count).to.equal(1);
      });
    });
  });
});
