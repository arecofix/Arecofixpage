import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';
import { PurchaseRegisteredEvent } from '../../../src/app/domain/events/purchase-registered.event';

describe('Idempotencia Global del Bus de Eventos', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Publicar el mismo evento 2, 5, 10 veces genera un solo registro en caja', () => {
    let cashPostCount = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      cashPostCount++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new SaleCompletedEvent(
        'sale-stress-idemp-1',
        [],
        10000,
        0,
        10000,
        'cash',
        null,
        false,
        new Date()
      );

      // Publish 10 times consecutively
      for (let i = 0; i < 10; i++) {
        eventBus.publish(event);
      }
    });

    cy.wait('@postCash').then(() => {
      cy.wait(500).then(() => {
        expect(cashPostCount).to.equal(1);
      });
    });
  });

  it('El sourceEventId se guarda en cada movimiento', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new PurchaseRegisteredEvent(
        'pur-source-check-99',
        'sup-001',
        'Distribuidora Repuestos Express',
        [],
        20000,
        4200,
        24200,
        'cash',
        'paid',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      const body = interception.request.body;
      const refId = body.reference_id || body.sourceEventId;
      expect(refId).to.equal('pur-source-check-99');
    });
  });
});
