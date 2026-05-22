import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { Observable } from 'rxjs';
import { OrdersStore } from './orders.store';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private repository = inject(OrderRepository);
  private ordersStore = inject(OrdersStore);

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
      tap(() => {
        this.ordersStore.clearCache();
      })
    );
  }

  getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
    return this.repository.getActiveCart(userId, sessionId);
  }
}
