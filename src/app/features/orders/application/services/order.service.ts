import { Injectable, inject } from '@angular/core';
import { OrderRepository, OrderFilterParams } from '../../domain/repositories/order.repository';
import { Order, OrderStatus, VALID_TRANSITIONS, isValidTransition } from '../../domain/entities/order.entity';
import { Observable, from, firstValueFrom } from 'rxjs';
import { OrdersStore } from './orders.store';
import { tap, map } from 'rxjs/operators';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { OrderDeliveredEvent } from '@app/domain/events/order-delivered.event';
import { OrderShippedEvent } from '@app/domain/events/order-shipped.event';
import { OrderCancelledEvent } from '@app/domain/events/order-cancelled.event';
import { OrderRefundedEvent } from '@app/domain/events/order-refunded.event';
import { PaymentMethod } from '@app/domain/events/types/payment-method';
import { CustomerSnapshot } from '@app/domain/events/types/customer-snapshot';
import { SaleItemSnapshot } from '@app/domain/events/types/sale-item-snapshot';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private repository = inject(OrderRepository);
  private ordersStore = inject(OrdersStore);
  private eventBus = inject(IEventBus);

  getOrders(params?: OrderFilterParams): Observable<Order[]> {
    return this.ordersStore.getOrdersList(params);
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.ordersStore.getOrderDetail(id);
  }

  createOrder(order: Order): Observable<Order> {
    return this.repository.createOrder(order).pipe(
      tap(() => this.ordersStore.clearCache()),
    );
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.repository.updateOrder(id, order).pipe(
      tap(() => {
        this.ordersStore.clearCache();
      }),
    );
  }

  /**
   * Safe status transition respecting finite state machine and emitting domain events.
   * Enforces idempotency: multiple calls with the same target status return early.
   */
  async transitionOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    trackingCode?: string,
    reason?: string,
  ): Promise<Order> {
    const order = await firstValueFrom(this.getOrderById(orderId));
    if (!order) {
      throw new Error(`Pedido no encontrado (ID: ${orderId})`);
    }

    // 1. Idempotency guard: if order is already in the requested status, do nothing
    if (order.status === newStatus) {
      return order;
    }

    // 2. State machine validation
    if (!isValidTransition(order.status, newStatus)) {
      throw new Error(
        `Transición de estado inválida: no se puede pasar de "${order.status}" a "${newStatus}"`,
      );
    }

    // 3. Persist status update
    if (trackingCode) {
      await firstValueFrom(
        this.repository.updateOrder(orderId, {
          ...order,
          status: newStatus,
          tracking_code: trackingCode,
        }),
      );
    } else {
      await firstValueFrom(this.repository.updateOrderStatus(orderId, newStatus));
    }

    this.ordersStore.clearCache();

    // 4. Emit domain events based on destination state
    try {
      if (newStatus === 'shipped') {
        this.eventBus.publish(new OrderShippedEvent(orderId, new Date(), trackingCode));
      } else if (newStatus === 'completed' || newStatus === 'delivered') {
        await this.publishDeliveredEvent(orderId);
      } else if (newStatus === 'cancelled') {
        this.eventBus.publish(
          new OrderCancelledEvent(
            orderId,
            'admin',
            reason || 'Cancelado por el administrador',
            new Date(),
          ),
        );
      } else if (newStatus === 'refunded') {
        this.eventBus.publish(new OrderRefundedEvent(orderId, order.total, new Date()));
      }
    } catch (evtErr) {
      console.error('[OrderService] Error al publicar evento de dominio tras cambio de estado:', evtErr);
    }

    const updated = await firstValueFrom(this.getOrderById(orderId));
    return updated || { ...order, status: newStatus };
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return from(this.transitionOrderStatus(orderId, status)).pipe(map(() => void 0));
  }

  async markAsShipped(orderId: string, trackingCode?: string): Promise<Order> {
    return this.transitionOrderStatus(orderId, 'shipped', trackingCode);
  }

  async markAsPaid(orderId: string): Promise<Order> {
    return this.transitionOrderStatus(orderId, 'paid');
  }

  async markAsCancelled(orderId: string, reason?: string): Promise<Order> {
    return this.transitionOrderStatus(orderId, 'cancelled', undefined, reason);
  }

  async markAsRefunded(orderId: string): Promise<Order> {
    return this.transitionOrderStatus(orderId, 'refunded');
  }

  async markAsDelivered(orderId: string, requestInvoice = false): Promise<void> {
    await this.transitionOrderStatus(orderId, 'completed');
    await this.publishDeliveredEvent(orderId, requestInvoice);
  }

  private async publishDeliveredEvent(orderId: string, requestInvoice = false): Promise<void> {
    try {
      const order = await firstValueFrom(this.getOrderById(orderId));
      if (!order) return;

      const methodMap: Record<string, PaymentMethod> = {
        efectivo: 'cash',
        transferencia: 'transfer',
        tarjeta: 'card',
        cash: 'cash',
        transfer: 'transfer',
        card: 'card',
      };
      const paymentMethod: PaymentMethod = methodMap[order.payment_method ?? ''] ?? 'cash';

      const itemsSnapshot: SaleItemSnapshot[] = (order.items ?? []).map((item) => ({
        productId: item.product_id,
        description: item.product_name ?? 'Producto',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        taxRate: 0.21,
        itemType: 'product',
      }));

      const customerSnapshot: CustomerSnapshot = {
        name: order.customer_name ?? 'Consumidor Final',
        email: order.customer_email,
        phone: order.customer_phone,
      };

      this.eventBus.publish(
        new OrderDeliveredEvent(
          order.id ?? orderId,
          customerSnapshot,
          itemsSnapshot,
          order.total ?? 0,
          paymentMethod,
          requestInvoice,
          new Date(),
        ),
      );
    } catch (err) {
      console.error('[OrderService] Error publishing OrderDeliveredEvent:', err);
    }
  }

  getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
    return this.repository.getActiveCart(userId, sessionId);
  }
}
