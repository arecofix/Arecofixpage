import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';

describe('Event-Driven: Venta -> Caja (SaleCompletedEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Cerrar venta crea ingreso en caja con concepto "Venta #[id]" y monto coincidente', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new SaleCompletedEvent(
        'sale-4501',
        [],
        15000,
        0,
        15000,
        'cash',
        null,
        false,
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(15000);
      expect(interception.request.body.notes || interception.request.body.concept).to.equal('Venta #sale-4501');
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal('sale-4501');
    });
  });

  it('Idempotencia: cerrar la misma venta dos veces no duplica el movimiento en caja', () => {
    let calls = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      calls++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new SaleCompletedEvent(
        'sale-idemp-1',
        [],
        20000,
        0,
        20000,
        'cash',
        null,
        false,
        new Date()
      );

      eventBus.publish(event);
      eventBus.publish(event);
    });

    cy.wait('@postCash').then(() => {
      cy.wait(400).then(() => {
        expect(calls).to.equal(1);
      });
    });
  });
});
