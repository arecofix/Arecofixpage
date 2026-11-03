import { SaleCompletedEvent } from '../../../src/app/domain/events/sale-completed.event';

describe('Adversarial Testing: Intentar Romper el Event Bus', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Publicar evento con payload null o undefined no crashea el bus', () => {
    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      expect(() => {
        eventBus.publish(null);
        eventBus.publish(undefined);
      }).not.to.throw();
    });
  });

  it('Publicar 100 eventos en ráfaga no colapsa el bus de eventos', () => {
    let processed = 0;

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;

      const sub = eventBus.subscribe(SaleCompletedEvent, () => {
        processed++;
      });

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        eventBus.publish(new SaleCompletedEvent(`burst-${i}`, [], 100, 0, 100, 'cash', null, false, new Date()));
      }
      const duration = performance.now() - startTime;

      expect(processed).to.equal(100);
      expect(duration).to.be.lessThan(500); // Super fast synchronous stream dispatch

      sub.unsubscribe();
    });
  });

  it('Suscribirse DESPUÉS de publicar NO recibe eventos pasados (semántica broadcast desacoplada)', () => {
    let receivedOld = false;

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;

      // Publish first
      eventBus.publish(new SaleCompletedEvent('old-event', [], 100, 0, 100, 'cash', null, false, new Date()));

      // Subscribe after
      const sub = eventBus.subscribe(SaleCompletedEvent, () => {
        receivedOld = true;
      });

      expect(receivedOld).to.be.false;
      sub.unsubscribe();
    });
  });
});
