import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private repository = inject(OrderRepository);

  getOrders(): Observable<Order[]> {
    return this.repository.getOrders();
  }

  getOrderById(id: string): Observable<Order | null> {
    return this.repository.getOrderById(id);
  }

  createOrder(order: Order): Observable<Order> {
    return this.repository.createOrder(order);
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return this.repository.updateOrder(id, order);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return this.repository.updateOrderStatus(orderId, status);
  }
}
