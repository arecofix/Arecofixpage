import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { OrdersStore } from './orders.store';
import { tap } from 'rxjs/operators';
import { IEventBus } from '@app/domain/events/event-bus.interface';
import { OrderDeliveredEvent } from '@app/domain/events/order-delivered.event';
import { PaymentMethod } from '@app/domain/events/types/payment-method';
import { CustomerSnapshot } from '@app/domain/events/types/customer-snapshot';
import { SaleItemSnapshot } from '@app/domain/events/types/sale-item-snapshot';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private repository = inject(OrderRepository);
  private ordersStore = inject(OrdersStore);
  private eventBus = inject(IEventBus);

  getOrders(params?: { page?: number; pageSize?: number }): Observable<Order[]> {
    return this.ordersStore.getOrdersList(params);
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.ordersStore.getOrderDetail(id);
  }

  createOrder(order: Order): Observable<Order> {
    return this.repository.createOrder(order).pipe(
      tap(() => this.ordersStore.clearCache())
    );
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.repository.updateOrder(id, order).pipe(
      tap(() => {
        this.ordersStore.clearCache();
      })
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return this.repository.updateOrderStatus(orderId, status).pipe(
      tap(async () => {
        this.ordersStore.clearCache();
        if (status === 'completed') {
          await this.publishDeliveredEvent(orderId);
        }
      })
    );
  }

  async markAsDelivered(orderId: string, requestInvoice = false): Promise<void> {
    await firstValueFrom(this.repository.updateOrderStatus(orderId, 'completed'));
    this.ordersStore.clearCache();
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
        )
      );
    } catch (err) {
      console.error('[OrderService] Error publishing OrderDeliveredEvent:', err);
    }
  }

  getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
    return this.repository.getActiveCart(userId, sessionId);
  }
}
