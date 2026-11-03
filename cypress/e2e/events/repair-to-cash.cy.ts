import { RepairOrderDeliveredEvent } from '../../../src/app/domain/events/repair-order-delivered.event';

describe('Event-Driven: Reparación -> Caja (RepairOrderDeliveredEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Pasar reparación a ENTREGADO crea ingreso en caja', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new RepairOrderDeliveredEvent(
        'rep-8801',
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

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(184000);
      expect(interception.request.body.notes || interception.request.body.concept).to.equal('Reparación #rep-8801');
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal('rep-8801');
    });
  });

  it('Idempotencia: entregar la misma reparación dos veces no duplica el ingreso en caja', () => {
    let callCount = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      callCount++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new RepairOrderDeliveredEvent(
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
        75000,
        'cash',
        new Date()
      );

      eventBus.publish(event);
      eventBus.publish(event);
    });

    cy.wait('@postCash').then(() => {
      cy.wait(400).then(() => {
        expect(callCount).to.equal(1);
      });
    });
  });
});
