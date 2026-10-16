import { PurchaseRegisteredEvent } from '../../../src/app/domain/events/purchase-registered.event';

describe('Event-Driven: Compra -> Caja (PurchaseRegisteredEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Registrar compra con paymentStatus: paid crea egreso en caja con concepto y monto correcto', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus, 'EventBus must be initialized').to.exist;

      const event = new PurchaseRegisteredEvent(
        'pur-101',
        'sup-001',
        'Distribuidora Repuestos Express',
        [],
        50000,
        10500,
        60500,
        'transfer',
        'paid',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('expense');
      expect(interception.request.body.amount).to.equal(60500);
      expect(interception.request.body.notes || interception.request.body.description).to.include('Distribuidora Repuestos Express');
    });
  });

  it('Registrar compra con paymentStatus: pending NO crea egreso en caja', () => {
    let called = false;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      called = true;
    });

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new PurchaseRegisteredEvent(
        'pur-102',
        'sup-001',
        'Distribuidora Repuestos Express',
        [],
        30000,
        6300,
        36300,
        'transfer',
        'pending',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait(500).then(() => {
      expect(called).to.be.false;
    });
  });

  it('Idempotencia: registrar la misma compra dos veces no duplica el egreso', () => {
    let callCount = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      callCount++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new PurchaseRegisteredEvent(
        'pur-duplicate-1',
        'sup-001',
        'Distribuidora Repuestos Express',
        [],
        10000,
        2100,
        12100,
        'cash',
        'paid',
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
