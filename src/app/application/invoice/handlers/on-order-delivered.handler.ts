import { Injectable } from '@angular/core';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { OrderDeliveredEvent } from '@app/domain/events/order-delivered.event';
import { InvoiceRepository } from '@app/features/sales/domain/repositories/invoice.repository';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({ providedIn: 'root' })
export class OnOrderDeliveredInvoiceHandler {
  constructor(
    private readonly invoiceRepo: InvoiceRepository,
    private readonly tenantService: TenantService,
    private readonly eventBus: IEventBus,
  ) {}

  register(): void {
    this.eventBus.subscribe(OrderDeliveredEvent, (event) => {
      this.handle(event).catch((err) =>
        console.error('[Facturación] Error procesando OrderDeliveredEvent', err),
      );
    });
  }

  async handle(event: OrderDeliveredEvent): Promise<void> {
    // 1. Only proceed if customer requested invoice
    if (!event.requestInvoice) {
      return;
    }

    const tenantId = this.tenantService.getTenantId();

    // 2. Idempotency guard: avoid duplicating drafts on repeated delivery events
    const existing = await this.invoiceRepo.getByOrderId(event.orderId, tenantId);
    if (existing) {
      return;
    }

    // 3. Create draft invoice
    const customer = event.customer;
    await this.invoiceRepo.create({
      tenant_id: tenantId,
      order_id: event.orderId,
      origin: 'order',
      type: customer?.taxId && customer.taxId.length === 11 ? 'A' : 'B',
      status: 'draft',
      customer_id: customer?.id ?? null,
      customer_name: customer?.name ?? 'Consumidor Final',
      customer_tax_id: customer?.taxId ?? null,
      customer_email: customer?.email ?? null,
      customer_address: customer?.address ?? null,
      subtotal: event.total,
      discount: 0,
      total_amount: event.total,
      payment_method: event.paymentMethod,
      items: event.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax_rate: item.taxRate ?? 0.21,
        subtotal: item.unitPrice * item.quantity,
        total: item.unitPrice * item.quantity,
      })),
      notes: `Borrador generado automáticamente desde Pedido #${event.orderId}`,
      issued_at: typeof event.deliveredAt === 'string' ? event.deliveredAt : event.deliveredAt.toISOString(),
    });
  }
}
