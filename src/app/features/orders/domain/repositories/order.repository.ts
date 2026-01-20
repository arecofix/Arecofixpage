import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../entities/order.entity';

export abstract class OrderRepository {
    abstract createOrder(order: Order): Observable<Order>;
    abstract getOrders(): Observable<Order[]>;
    abstract updateOrderStatus(orderId: string, status: OrderStatus): Observable<void>;
}
