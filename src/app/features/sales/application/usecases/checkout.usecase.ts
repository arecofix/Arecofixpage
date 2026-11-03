import { Injectable, inject } from '@angular/core';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { TenantService } from '@app/core/services/tenant.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { SaleCompletedEvent } from '@app/domain/events/sale-completed.event';
import { PaymentMethod } from '@app/domain/events/types/payment-method';
import { CustomerSnapshot } from '@app/domain/events/types/customer-snapshot';
import { SaleItemSnapshot } from '@app/domain/events/types/sale-item-snapshot';
import { firstValueFrom } from 'rxjs';

export interface CheckoutCartItem {
  id?: string;
  name: string;
  currency?: string;
  price: number;
  cost_price?: number;
  quantity: number;
}

export interface CheckoutRequest {
  cartItems: CheckoutCartItem[];
  customerName: string;
  customer?: CustomerSnapshot | null;
  discount: number;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
  cartSubtotal: number;
  finalTotal: number;
  requestInvoice?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutUseCase {
  private orderService = inject(OrderService);
  private eventBus = inject(IEventBus);
  private tenantService = inject(TenantService);
  private branchContextService = inject(BranchContextService);

  /**
   * Executes the checkout process:
   * 1. Creates and persists the Order/Sale
   * 2. Publishes SaleCompletedEvent onto the domain EventBus
   * (Decoupled: Cash movements and invoice drafts are handled asynchronously by subscribers)
   */
  async execute(request: CheckoutRequest): Promise<string> {
    const branch_id = this.branchContextService.getBranchId() || undefined;

    // 1. Create Order
    const order: Order = {
      customer_name: request.customerName || request.customer?.name || 'Consumidor Final',
      customer_email: request.customer?.email,
      status: 'completed',
      subtotal: request.cartSubtotal,
      tax: 0,
      discount: request.discount,
      total: request.finalTotal,
      branch_id: branch_id,
      payment_method: request.paymentMethod
    };

    const rate = this.tenantService.currentTenant()?.usd_rate || 1;
    const items: OrderItem[] = request.cartItems.map((item) => {
      const finalUnitPrice = item.currency === 'USD' ? (item.price * rate) : item.price;
      return {
        product_id: item.id,
        product_name: item.name,
        unit_price: finalUnitPrice,
        cost_price: item.cost_price || 0,
        quantity: item.quantity,
        subtotal: finalUnitPrice * item.quantity
      };
    });

    order.items = items;

    const createdOrder = await firstValueFrom(this.orderService.createOrder(order));
    if (!createdOrder || !createdOrder.id) throw new Error('Order creation failed');

    // 2. Publish Domain Event
    const methodMap: Record<string, PaymentMethod> = {
      efectivo: 'cash',
      transferencia: 'transfer',
      tarjeta: 'card',
    };
    const paymentMethod: PaymentMethod = methodMap[request.paymentMethod] || 'cash';

    const saleItemsSnapshot: SaleItemSnapshot[] = items.map((item) => ({
      productId: item.product_id,
      description: item.product_name ?? 'Producto',
      quantity: item.quantity,
      unitPrice: item.unit_price,
      taxRate: 0.21,
      itemType: 'product',
    }));

    const customerSnapshot: CustomerSnapshot = request.customer || {
      name: request.customerName || 'Consumidor Final',
    };

    this.eventBus.publish(
      new SaleCompletedEvent(
        createdOrder.id,
        saleItemsSnapshot,
        request.cartSubtotal,
        request.discount,
        request.finalTotal,
        paymentMethod,
        customerSnapshot,
        request.requestInvoice ?? false,
        new Date(),
      )
    );

    return createdOrder.id;
  }
}
