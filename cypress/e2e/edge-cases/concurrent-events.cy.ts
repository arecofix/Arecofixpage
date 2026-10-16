import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';

describe('Casos Borde: Concurrencia en Bus de Eventos', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('10 ventas simultáneas generan 10 ingresos en caja sin pérdidas ni mezclas', () => {
    const receivedIds: string[] = [];
    cy.intercept('POST', '**/rest/v1/cash_movements*', (req) => {
      receivedIds.push(req.body.reference_id || req.body.sourceEventId);
      req.reply({
        statusCode: 201,
        body: { id: 'mock-' + (req.body.reference_id || req.body.sourceEventId), ...req.body },
      });
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      for (let i = 1; i <= 10; i++) {
        const event = new SaleCompletedEvent(
          `sale-concurrent-${i}`,
          [],
          1000 * i,
          0,
          1000 * i,
          'cash',
          null,
          false,
          new Date()
        );
        eventBus.publish(event);
      }
    });

    cy.wait(1500).then(() => {
      expect(receivedIds).to.have.length(10);
      const uniqueIds = new Set(receivedIds);
      expect(uniqueIds.size).to.equal(10);
    });
  });

  it('Un handler que falla NO interrumpe el procesamiento de los demás handlers ni del bus', () => {
    const executed: string[] = [];
    cy.intercept('POST', '**/rest/v1/cash_movements*', (req) => {
      executed.push(req.body.reference_id || req.body.sourceEventId);
      req.reply({
        statusCode: 201,
        body: { id: 'mock-' + (req.body.reference_id || req.body.sourceEventId), ...req.body },
      });
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;

      // Register a failing subscriber
      eventBus.subscribe(SaleCompletedEvent, (evt: any) => {
        if (evt.saleId === 'sale-fail-test') {
          throw new Error('Simulated Handler Crash!');
        }
      });

      // Publish failing event and subsequent normal event
      eventBus.publish(new SaleCompletedEvent('sale-fail-test', [], 500, 0, 500, 'cash', null, false, new Date()));
      eventBus.publish(new SaleCompletedEvent('sale-after-fail', [], 800, 0, 800, 'cash', null, false, new Date()));
    });

    cy.wait(800).then(() => {
      expect(executed).to.include('sale-after-fail');
    });
  });
});
