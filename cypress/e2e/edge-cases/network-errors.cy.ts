import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';

describe('Casos Borde: Tolerancia a Fallos de Red y Backend', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Si la API de Supabase devuelve 500 al guardar un movimiento, el error se captura y no rompe la UI ni el bus', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*', {
      statusCode: 500,
      body: { message: 'Internal Database Server Error' },
    }).as('postCashError');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      // Event should be attempted
      const event = new SaleCompletedEvent(
        'sale-err-500',
        [],
        10000,
        0,
        10000,
        'cash',
        null,
        false,
        new Date()
      );

      // Should not throw an unhandled exception to window
      expect(() => eventBus.publish(event)).not.to.throw();
    });

    cy.wait('@postCashError');
  });
});
