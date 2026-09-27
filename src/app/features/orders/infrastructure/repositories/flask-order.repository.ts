import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';

@Injectable({
    providedIn: 'root'
})
export class FlaskOrderRepository implements OrderRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/orders';

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    getOrders(params?: { page?: number; pageSize?: number }): Observable<Order[]> {
        return this.http.get<{ data: Order[]; total: number }>(this.apiUrl).pipe(
            map(res => {
                let data = res.data;
                if (params?.page && params?.pageSize) {
                    const start = (params.page - 1) * params.pageSize;
                    data = data.slice(start, start + params.pageSize);
                }
                return data;
            })
        );
    }

    getOrderById(id: string): Observable<Order | null> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    updateOrder(id: string, order: Order): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
    }

    updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${orderId}`, { status });
    }

    getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
        return of(null); // Offline cart handling could be simpler or fetch from local
    }
}
