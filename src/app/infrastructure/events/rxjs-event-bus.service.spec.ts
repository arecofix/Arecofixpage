import { RxjsEventBusService } from './rxjs-event-bus.service';
import { SaleCompletedEvent } from '../../domain/events/sale-completed.event';
import { PurchaseRegisteredEvent } from '../../domain/events/purchase-registered.event';

describe('5.1 RxjsEventBusService', () => {
  let eventBus: RxjsEventBusService;

  beforeEach(() => {
    eventBus = new RxjsEventBusService();
  });

  it('publish emite el evento a todos los suscriptores', () => {
    const received: SaleCompletedEvent[] = [];
    const event = new SaleCompletedEvent(
      'sale-1',
      [],
      1000,
      0,
      1000,
      'cash',
      null,
      false,
      new Date(),
    );

    eventBus.subscribe(SaleCompletedEvent, (e) => received.push(e));
    eventBus.publish(event);

    expect(received.length).toBe(1);
    expect(received[0].saleId).toBe('sale-1');
  });

  it('Un suscriptor recibe solo los eventos del tipo que le interesa', () => {
    const salesReceived: SaleCompletedEvent[] = [];
    const purchasesReceived: PurchaseRegisteredEvent[] = [];

    eventBus.subscribe(SaleCompletedEvent, (e) => salesReceived.push(e));
    eventBus.subscribe(PurchaseRegisteredEvent, (e) => purchasesReceived.push(e));

    const saleEvent = new SaleCompletedEvent(
      'sale-1',
      [],
      500,
      0,
      500,
      'cash',
      null,
      false,
      new Date(),
    );
    const purchaseEvent = new PurchaseRegisteredEvent(
      'purch-1',
      'supp-1',
      'Supplier',
      [],
      400,
      0,
      400,
      'cash',
      'paid',
      new Date(),
    );

    eventBus.publish(saleEvent);
    eventBus.publish(purchaseEvent);

    expect(salesReceived.length).toBe(1);
    expect(salesReceived[0].saleId).toBe('sale-1');

    expect(purchasesReceived.length).toBe(1);
    expect(purchasesReceived[0].purchaseId).toBe('purch-1');
  });

  it('Si un suscriptor falla, los demás siguen funcionando', () => {
    const successfulSubscriberCalls: string[] = [];

    // Failing subscriber
    eventBus.subscribe(SaleCompletedEvent, () => {
      throw new Error('Subscriber intentional error');
    });

    // Healthy subscriber
    eventBus.subscribe(SaleCompletedEvent, (e) => {
      successfulSubscriberCalls.push(e.saleId);
    });

    const event = new SaleCompletedEvent(
      'sale-resilient',
      [],
      200,
      0,
      200,
      'cash',
      null,
      false,
      new Date(),
    );

    expect(() => {
      eventBus.publish(event);
    }).not.toThrow();

    expect(successfulSubscriberCalls).toEqual(['sale-resilient']);
  });

  it('Múltiples suscriptores al mismo evento reciben el evento', () => {
    let count1 = 0;
    let count2 = 0;

    eventBus.subscribe(SaleCompletedEvent, () => count1++);
    eventBus.subscribe(SaleCompletedEvent, () => count2++);

    eventBus.publish(
      new SaleCompletedEvent('sale-multi', [], 100, 0, 100, 'cash', null, false, new Date())
    );

    expect(count1).toBe(1);
    expect(count2).toBe(1);
  });
});
