import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';
import { InvoiceIssuedEvent } from '../../../src/app/domain/events/invoice-issued.event';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Flujo de Integración Completo: Venta Mostrador E2E', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Venta con factura: Cobro crea ingreso en caja + borrador; Factura emitida no duplica caja', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');

    const saleId = 'sale-full-flow-1';

    // 1. Cobrar venta con requestInvoice: true
    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const saleEvent = new SaleCompletedEvent(
        saleId,
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
          address: 'Calle 123',
          email: 'juan@test.com',
          phone: '123456',
        },
        true, // requestInvoice
        new Date()
      );

      eventBus.publish(saleEvent);
    });

    // Ingreso en caja creado
    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(149000);
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal(saleId);
    });

    // Borrador de factura creado
    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.order_id).to.equal(saleId);
    });

    // 2. Ahora se emite la factura originada en venta (origin: 'sale')
    let cashCalledAgain = false;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      cashCalledAgain = true;
    });

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const invoiceEvent = new InvoiceIssuedEvent(
        'inv-from-sale-1',
        '0001-00000088',
        'B',
        'sale', // origin is sale
        {
          id: 'cust-001',
          name: 'Juan Pérez',
          taxId: '20301234567',
          taxCondition: 'RESPONSABLE_INSCRIPTO',
          address: 'Calle 123',
          email: 'juan@test.com',
          phone: '123456',
        },
        149000,
        'cash',
        new Date()
      );

      eventBus.publish(invoiceEvent);
    });

    // Previene doble contabilización: cash NO es llamado de nuevo
    cy.wait(400).then(() => {
      expect(cashCalledAgain).to.be.false;
    });
  });
});
