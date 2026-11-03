import { setupRepairMocks } from '../../support/helpers/repair.helper';
import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';
import { RepairOrderReadyForInvoicingEvent } from '../../../src/app/domain/events/repair-order-ready-for-invoicing.event';
import { RepairOrderDeliveredEvent } from '../../../src/app/domain/events/repair-order-delivered.event';

describe('Flujo de Integración Completo: Orden de Reparación E2E', () => {
  beforeEach(() => {
    setupRepairMocks();
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/repairs');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Ciclo completo: Orden -> Listo para Entregar (Borrador) -> Entregado (Caja sin duplicados)', () => {
    cy.intercept('POST', '**/rest/v1/invoices*').as('postInvoice');
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    const repairId = 'rep-flow-101';

    // 1. Estado Listo para Entregar -> Genera borrador
    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const readyEvent = new RepairOrderReadyForInvoicingEvent(
        repairId,
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
            description: 'Mano de Obra Cambio de Pantalla',
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
      eventBus.publish(readyEvent);
    });

    cy.wait('@postInvoice').then((interception) => {
      expect(interception.request.body.status).to.equal('draft');
      expect(interception.request.body.total_amount).to.equal(184000);
    });

    // 2. Estado Entregado -> Genera ingreso en caja
    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const deliveredEvent = new RepairOrderDeliveredEvent(
        repairId,
        {
          id: 'cust-002',
          name: 'María González',
          taxId: '27359876542',
          taxCondition: 'CONSUMIDOR_FINAL',
          address: 'Av. Santa Fe 2500',
          email: 'maria@example.com',
          phone: '456789',
        },
        184000,
        'cash',
        new Date()
      );
      eventBus.publish(deliveredEvent);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(184000);
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal(repairId);
    });
  });
});
