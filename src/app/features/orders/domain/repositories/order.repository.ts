import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../entities/order.entity';

export interface OrderFilterParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | 'all';
  search?: string;
}

export abstract class OrderRepository {
  abstract createOrder(order: Order): Observable<Order>;
  abstract getOrders(params?: OrderFilterParams): Observable<Order[]>;
  abstract getOrderById(id: string): Observable<Order | null>;
  abstract updateOrder(id: string, order: Order): Observable<Order>;
  abstract updateOrderStatus(orderId: string, status: OrderStatus): Observable<void>;
  abstract getActiveCart(userId?: string, sessionId?: string): Observable<Order | null>;
}
