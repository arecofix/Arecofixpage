import { RxjsEventBusService } from '../../infrastructure/events/rxjs-event-bus.service';
import { OnSaleCompletedInvoiceHandler } from './handlers/on-sale-completed.handler';
import { OnOrderDeliveredInvoiceHandler } from './handlers/on-order-delivered.handler';
import { OnRepairReadyHandler } from './handlers/on-repair-ready.handler';
import { SaleCompletedEvent } from '../../domain/events/sale-completed.event';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event';
import { RepairOrderReadyForInvoicingEvent } from '../../domain/events/repair-order-ready-for-invoicing.event';
import { InvoiceRepository } from '../../features/sales/domain/repositories/invoice.repository';
import { TenantService } from '@app/core/services/tenant.service';
import { CreateInvoiceDraftFromRepairOrderUseCase } from '../../features/sales/domain/usecases/create-invoice-draft-from-repair-order.usecase';
import { Invoice } from '../../features/sales/domain/entities/invoice.entity';

class MockInvoiceRepository extends InvoiceRepository {
  public invoices: any[] = [];

  async getByOrderId(orderId: string, tenantId?: string): Promise<Invoice | null> {
    return this.invoices.find((i) => i.order_id === orderId) || null;
  }

  async getByRepairId(repairId: string, tenantId?: string): Promise<Invoice | null> {
    return this.invoices.find((i) => i.repair_order_id === repairId || i.repair_id === repairId) || null;
  }

  async create(payload: any): Promise<{ data: Invoice | null; error: unknown }> {
    const invoice = { id: `inv-${Date.now()}-${Math.random()}`, ...payload };
    this.invoices.push(invoice);
    return { data: invoice, error: null };
  }

  async update(id: string, partial: Partial<Invoice>): Promise<{ data: Invoice | null; error: unknown }> {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index >= 0) {
      this.invoices[index] = { ...this.invoices[index], ...partial };
      return { data: this.invoices[index], error: null };
    }
    return { data: null, error: new Error('Not found') };
  }

  async getById(id: string): Promise<Invoice | null> {
    return this.invoices.find((i) => i.id === id) || null;
  }
  async getAll(): Promise<Invoice[]> { return this.invoices; }
  async getCount(): Promise<number> { return this.invoices.length; }
  async getDraftCount(): Promise<number> { return this.invoices.filter((i) => i.status === 'draft').length; }
}

describe('Flujos de Facturación por Eventos', () => {
  let eventBus: RxjsEventBusService;
  let invoiceRepo: MockInvoiceRepository;
  let tenantService: Partial<TenantService>;
  let saleInvoiceHandler: OnSaleCompletedInvoiceHandler;
  let orderInvoiceHandler: OnOrderDeliveredInvoiceHandler;
  let repairReadyHandler: OnRepairReadyHandler;
  let createDraftUseCase: CreateInvoiceDraftFromRepairOrderUseCase;

  beforeEach(() => {
    eventBus = new RxjsEventBusService();
    invoiceRepo = new MockInvoiceRepository();
    tenantService = { getTenantId: () => 'tenant-test' };
    createDraftUseCase = new CreateInvoiceDraftFromRepairOrderUseCase(invoiceRepo);

    saleInvoiceHandler = new OnSaleCompletedInvoiceHandler(invoiceRepo, tenantService as TenantService, eventBus);
    orderInvoiceHandler = new OnOrderDeliveredInvoiceHandler(invoiceRepo, tenantService as TenantService, eventBus);
    repairReadyHandler = new OnRepairReadyHandler(createDraftUseCase, eventBus);

    saleInvoiceHandler.register();
    orderInvoiceHandler.register();
    repairReadyHandler.register();
  });

  describe('5.3 Flujo Venta → Facturación', () => {
    it('SaleCompletedEvent con requestInvoice: true crea un borrador', async () => {
      const event = new SaleCompletedEvent(
        'sale-bill-1',
        [{ description: 'Repuesto Pantalla', quantity: 1, unitPrice: 12000 }],
        12000,
        0,
        12000,
        'cash',
        { name: 'Lautaro', taxId: '20334445551' },
        true, // requestInvoice
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices.length).toBe(1);
      const created = invoiceRepo.invoices[0];
      expect(created.status).toBe('draft');
      expect(created.order_id).toBe('sale-bill-1');
      expect(created.origin).toBe('sale');
    });

    it('SaleCompletedEvent con requestInvoice: false no crea nada', async () => {
      const event = new SaleCompletedEvent(
        'sale-bill-2',
        [],
        5000,
        0,
        5000,
        'cash',
        null,
        false, // NO requestInvoice
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices.length).toBe(0);
    });

    it('El borrador tiene estado draft y referencia la venta (sourceId)', async () => {
      const event = new SaleCompletedEvent(
        'sale-bill-3',
        [{ description: 'Batería', quantity: 1, unitPrice: 8500 }],
        8500,
        0,
        8500,
        'transfer',
        { name: 'Consumidor' },
        true,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      const draft = invoiceRepo.invoices[0];
      expect(draft.status).toBe('draft');
      expect(draft.order_id).toBe('sale-bill-3');
    });
  });

  describe('5.6 Flujo Orden → Facturación', () => {
    it('OrderDeliveredEvent con requestInvoice: true crea borrador', async () => {
      const event = new OrderDeliveredEvent(
        'order-bill-1',
        { name: 'Cliente Online', email: 'cliente@mail.com' },
        [{ description: 'Accesorio', quantity: 2, unitPrice: 3000 }],
        6000,
        'card',
        true,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices.length).toBe(1);
      expect(invoiceRepo.invoices[0].order_id).toBe('order-bill-1');
      expect(invoiceRepo.invoices[0].status).toBe('draft');
    });

    it('Idempotencia: dos entregas del mismo pedido no duplican el borrador', async () => {
      const event = new OrderDeliveredEvent(
        'order-bill-2',
        { name: 'Cliente Repetido' },
        [],
        4000,
        'cash',
        true,
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();
      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices.length).toBe(1);
    });
  });

  describe('5.7 Flujo Reparación → Facturación', () => {
    it('RepairOrderReadyForInvoicingEvent crea borrador de factura en estado draft', async () => {
      const event = new RepairOrderReadyForInvoicingEvent(
        'rep-order-1',
        { name: 'Juan Reparacion', taxId: '20304050607' },
        [
          { description: 'Cambio de pantalla iPhone', quantity: 1, unitPrice: 20000, itemType: 'part' },
          { description: 'Mano de obra técnica', quantity: 1, unitPrice: 10000, itemType: 'labor' }
        ],
        { subtotal: 30000, surcharge: 0, advancePayment: 5000, total: 30000 },
        'cash',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices.length).toBe(1);
      const draft = invoiceRepo.invoices[0];
      expect(draft.status).toBe('draft');
      expect(draft.repair_order_id).toBe('rep-order-1');
    });

    it('Si la orden se cancela después de generar el borrador, el borrador se anula', async () => {
      const event = new RepairOrderReadyForInvoicingEvent(
        'rep-order-cancel',
        { name: 'Cliente a Cancelar' },
        [{ description: 'Repuesto', quantity: 1, unitPrice: 15000, itemType: 'part' }],
        { subtotal: 15000, surcharge: 0, advancePayment: 0, total: 15000 },
        'cash',
        new Date(),
      );

      eventBus.publish(event);
      await Promise.resolve();

      expect(invoiceRepo.invoices[0].status).toBe('draft');

      // Now cancel the repair order using the useCase cancellation handler
      await createDraftUseCase.handleOrderCancelled({
        repairOrderId: 'rep-order-cancel',
        cancelledAt: new Date().toISOString(),
        reason: 'Cancelado por cliente',
      });

      expect(invoiceRepo.invoices[0].status).toBe('voided');
    });
  });
});
