import { OrderDeliveredEvent } from '../../../src/app/domain/events/order-delivered.event';

describe('Event-Driven: Pedido Online -> Caja (OrderDeliveredEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Entregar orden crea ingreso en caja', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new OrderDeliveredEvent(
        'ord-9901',
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
        38000,
        'mercadopago',
        false,
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(38000);
      expect(interception.request.body.notes || interception.request.body.concept).to.equal('Pedido #ord-9901');
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal('ord-9901');
    });
  });

  it('Idempotencia: entregar la misma orden dos veces no duplica el ingreso', () => {
    let callCount = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      callCount++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new OrderDeliveredEvent(
        'ord-idemp-1',
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
        12000,
        'cash',
        false,
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
