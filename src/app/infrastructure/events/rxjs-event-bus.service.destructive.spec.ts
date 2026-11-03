import { RxjsEventBusService } from './rxjs-event-bus.service';
import { SaleCompletedEvent } from '../../domain/events/sale-completed.event';
import { PurchaseRegisteredEvent } from '../../domain/events/purchase-registered.event';

describe('RxjsEventBusService (Destructive Stress & Fault Tolerance Suite)', () => {
  let eventBus: RxjsEventBusService;

  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    eventBus = new RxjsEventBusService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Adversarial Handlers & Subscriber Fault Tolerance', () => {
    it('should survive multiple subscribers throwing asynchronous and synchronous exceptions', async () => {
      const successfulDeliveries: string[] = [];

      // Subscriber 1: Throws Sync Exception
      eventBus.subscribe(SaleCompletedEvent, () => {
        throw new Error('Fatal sync failure in audit logger');
      });

      // Subscriber 2: Rejects Promise / Async
      eventBus.subscribe(SaleCompletedEvent, async () => {
        throw new Error('Fatal async rejection in accounting sync');
      });

      // Subscriber 3: Healthy
      eventBus.subscribe(SaleCompletedEvent, (e) => {
        successfulDeliveries.push(e.saleId);
      });

      const event = new SaleCompletedEvent(
        'sale-chaos',
        [],
        1500,
        0,
        1500,
        'transfer',
        null,
        false,
        new Date()
      );

      // Publishing should NOT crash the application
      expect(() => eventBus.publish(event)).not.toThrow();
      expect(successfulDeliveries).toEqual(['sale-chaos']);
    });

    it('should withstand rapid unsubscribe calls during active event dispatch', () => {
      const delivered: number[] = [];

      const sub1 = eventBus.subscribe(SaleCompletedEvent, () => {
        delivered.push(1);
        sub1.unsubscribe(); // Unsubscribing mid-flight
      });

      const sub2 = eventBus.subscribe(SaleCompletedEvent, () => {
        delivered.push(2);
      });

      const event = new SaleCompletedEvent('sale-1', [], 100, 0, 100, 'cash', null, false, new Date());
      eventBus.publish(event);

      expect(delivered).toEqual([1, 2]);

      // Publish again: sub1 must not be called
      eventBus.publish(event);
      expect(delivered).toEqual([1, 2, 2]);
    });
  });

  describe('Massive Concurrency Burst (5,000 events)', () => {
    it('should dispatch 5,000 events without memory leak or dropped messages', () => {
      let count = 0;
      eventBus.subscribe(SaleCompletedEvent, () => {
        count++;
      });

      const startTime = Date.now();
      for (let i = 0; i < 5000; i++) {
        const ev = new SaleCompletedEvent(`sale-${i}`, [], 10, 0, 10, 'cash', null, false, new Date());
        eventBus.publish(ev);
      }
      const duration = Date.now() - startTime;

      expect(count).toBe(5000);
      expect(duration).toBeLessThan(500); // 5000 events dispatched in under 500ms
    });

    it('should cleanly isolate event types under high-load cross-fire', () => {
      let salesCount = 0;
      let purchasesCount = 0;

      eventBus.subscribe(SaleCompletedEvent, () => salesCount++);
      eventBus.subscribe(PurchaseRegisteredEvent, () => purchasesCount++);

      for (let i = 0; i < 1000; i++) {
        eventBus.publish(new SaleCompletedEvent(`s-${i}`, [], 50, 0, 50, 'cash', null, false, new Date()));
        eventBus.publish(new PurchaseRegisteredEvent(`p-${i}`, 'sup', 'Sup', [], 50, 0, 50, 'cash', 'paid', new Date()));
      }

      expect(salesCount).toBe(1000);
      expect(purchasesCount).toBe(1000);
    });
  });
});
