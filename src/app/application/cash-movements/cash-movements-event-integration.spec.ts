import { RxjsEventBusService } from '../../infrastructure/events/rxjs-event-bus.service';
import { CashMovementRepository, CreateCashMovementDto } from '../../domain/repositories/cash-movement.repository';
import { OnSaleCompletedHandler } from './handlers/on-sale-completed.handler';
import { OnPurchaseRegisteredCashHandler } from './handlers/on-purchase-registered.handler';
import { OnOrderDeliveredCashHandler } from './handlers/on-order-delivered.handler';
import { OnRepairDeliveredCashHandler } from './handlers/on-repair-delivered.handler';
import { OnInvoiceIssuedCashHandler } from './handlers/on-invoice-issued.handler';
import { OnSupplierPaymentMadeCashHandler } from './handlers/on-supplier-payment-made.handler';
import { SaleCompletedEvent } from '../../domain/events/sale-completed.event';
import { PurchaseRegisteredEvent } from '../../domain/events/purchase-registered.event';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event';
import { RepairOrderDeliveredEvent } from '../../domain/events/repair-order-delivered.event';
import { InvoiceIssuedEvent } from '../../domain/events/invoice-issued.event';
import { SupplierPaymentMadeEvent } from '../../domain/events/supplier-payment-made.event';

class MockCashMovementRepository extends CashMovementRepository {
  public movements: CreateCashMovementDto[] = [];
  public sourceIds = new Set<string>();

  async existsBySourceEventId(sourceEventId: string): Promise<boolean> {
    return this.sourceIds.has(sourceEventId);
  }

  async create(movement: CreateCashMovementDto): Promise<unknown> {
    this.movements.push(movement);
    this.sourceIds.add(movement.sourceEventId);
    return { id: `cash-${Date.now()}`, ...movement };
  }
}

describe('Flujos de Movimientos de Caja por Eventos', () => {
  let eventBus: RxjsEventBusService;
  let cashRepo: MockCashMovementRepository;
  let saleHandler: OnSaleCompletedHandler;
  let purchaseHandler: OnPurchaseRegisteredCashHandler;
  let orderHandler: OnOrderDeliveredCashHandler;
  let repairHandler: OnRepairDeliveredCashHandler;
  let invoiceHandler: OnInvoiceIssuedCashHandler;
  let supplierPaymentHandler: OnSupplierPaymentMadeCashHandler;

  beforeEach(() => {
    eventBus = new RxjsEventBusService();
    cashRepo = new MockCashMovementRepository();

    saleHandler = new OnSaleCompletedHandler(cashRepo, eventBus);
    purchaseHandler = new OnPurchaseRegisteredCashHandler(cashRepo, eventBus);
    orderHandler = new OnOrderDeliveredCashHandler(cashRepo, eventBus);
    repairHandler = new OnRepairDeliveredCashHandler(cashRepo, eventBus);
    invoiceHandler = new OnInvoiceIssuedCashHandler(cashRepo, eventBus);
    supplierPaymentHandler = new OnSupplierPaymentMadeCashHandler(cashRepo, eventBus);

    saleHandler.register();
    purchaseHandler.register();
    orderHandler.register();
    repairHandler.register();
    invoiceHandler.register();
    supplierPaymentHandler.register();
  });

  describe('5.2 Flujo Venta → Caja', () => {
    it('SaleCompletedEvent crea un ingreso en caja', async () => {
      const event = new SaleCompletedEvent(
        'sale-101',
        [{ description: 'Item 1', quantity: 1, unitPrice: 5000 }],
        5000,
        0,
        5000,
        'cash',
        { name: 'Juan Perez' },
        false,
        new Date('2026-10-12T10:00:00Z'),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('income');
      expect(cashRepo.movements[0].concept).toBe('Venta #sale-101');
    });

    it('Si el evento se publica dos veces, no crea duplicado (idempotencia)', async () => {
      const event = new SaleCompletedEvent(
        'sale-102',
        [],
        3000,
        0,
        3000,
        'cash',
        null,
        false,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();
      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
    });

    it('El monto y método del movimiento coinciden con el evento', async () => {
      const event = new SaleCompletedEvent(
        'sale-103',
        [],
        7500,
        500,
        7000,
        'transfer',
        null,
        false,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements[0].amount).toBe(7000);
      expect(cashRepo.movements[0].method).toBe('transfer');
    });
  });

  describe('5.4 Flujo Compra → Caja', () => {
    it('PurchaseRegisteredEvent crea un egreso en caja cuando paymentStatus === "paid"', async () => {
      const event = new PurchaseRegisteredEvent(
        'purch-201',
        'supp-1',
        'Distribuidora Central',
        [],
        10000,
        2100,
        12100,
        'cash',
        'paid',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('expense');
      expect(cashRepo.movements[0].concept).toBe('Compra a Distribuidora Central');
      expect(cashRepo.movements[0].amount).toBe(12100);
    });

    it('Si paymentStatus === "pending", no crea egreso (solo cuando se paga)', async () => {
      const event = new PurchaseRegisteredEvent(
        'purch-202',
        'supp-1',
        'Distribuidora Central',
        [],
        10000,
        2100,
        12100,
        'cash',
        'pending',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(0);
    });
  });

  describe('5.6 Flujo Orden → Caja', () => {
    it('OrderDeliveredEvent crea ingreso en caja', async () => {
      const event = new OrderDeliveredEvent(
        'order-301',
        { name: 'Maria Gomez' },
        [],
        15000,
        'card',
        false,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('income');
      expect(cashRepo.movements[0].concept).toBe('Pedido #order-301');
      expect(cashRepo.movements[0].amount).toBe(15000);
    });

    it('Idempotencia: dos entregas del mismo pedido no duplican el ingreso en caja', async () => {
      const event = new OrderDeliveredEvent(
        'order-302',
        { name: 'Pedro' },
        [],
        8000,
        'transfer',
        false,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();
      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
    });
  });

  describe('5.7 Flujo Reparación → Caja', () => {
    it('RepairOrderDeliveredEvent crea ingreso en caja', async () => {
      const event = new RepairOrderDeliveredEvent(
        'rep-401',
        { name: 'Carlos Tech' },
        25000,
        'cash',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('income');
      expect(cashRepo.movements[0].concept).toBe('Reparación #rep-401');
      expect(cashRepo.movements[0].amount).toBe(25000);
    });
  });

  describe('5.8 Flujo Factura → Caja y Pagos a Proveedores', () => {
    it('InvoiceIssuedEvent crea ingreso en caja para facturas manuales', async () => {
      const event = new InvoiceIssuedEvent(
        'inv-501',
        '0001-00000123',
        'B',
        'manual',
        { name: 'Empresa SA' },
        45000,
        'transfer',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('income');
      expect(cashRepo.movements[0].concept).toBe('Factura #0001-00000123');
      expect(cashRepo.movements[0].sourceEventId).toBe('inv-501');
    });

    it('No se duplica si ya había un ingreso por la venta origen (evitar doble contabilización)', async () => {
      const event = new InvoiceIssuedEvent(
        'inv-502',
        '0001-00000124',
        'B',
        'sale',
        { name: 'Cliente POS' },
        12000,
        'cash',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      // Because origin is 'sale', cash movement was already recorded during POS sale completion
      expect(cashRepo.movements.length).toBe(0);
    });

    it('SupplierPaymentMadeEvent crea egreso en caja con concepto Pago a proveedor', async () => {
      const event = new SupplierPaymentMadeEvent(
        'supp-99',
        'purch-10',
        30000,
        'transfer',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(cashRepo.movements.length).toBe(1);
      expect(cashRepo.movements[0].type).toBe('expense');
      expect(cashRepo.movements[0].concept).toBe('Pago a proveedor');
      expect(cashRepo.movements[0].amount).toBe(30000);
    });
  });
});
