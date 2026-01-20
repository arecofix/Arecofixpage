import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { AuthService } from '@app/core/services/auth.service';
import { Observable, from, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseOrderRepository extends OrderRepository {
  private authService = inject(AuthService);
  private supabase = this.authService.getSupabaseClient();

  createOrder(order: Order): Observable<Order> {
    return from(this._createOrderTransaction(order)).pipe(
      map(createdOrder => createdOrder)
    );
  }

  private async _createOrderTransaction(order: Order): Promise<Order> {
    const orderId = crypto.randomUUID();
    const orderNumber = `ORD-${Date.now()}`;

    // 1. Insert Order
    const { error: orderError } = await this.supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_name: order.customer_info.name,
        customer_email: order.customer_info.email,
        customer_phone: order.customer_info.phone,
        customer_address: order.customer_info.address,
        status: order.status, // 'A_PAGAR'
        total_amount: order.total,
        order_number: orderNumber,
        created_at: new Date().toISOString()
      });

    if (orderError) throw orderError;

    // 2. Insert Items
    const itemsPayload = order.cart_items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) throw itemsError;

    // Return the entity with the new ID
    order.id = orderId;
    return order;
  }

  getOrders(): Observable<Order[]> {
    return from(
      this.supabase.from('orders').select('*, order_items(*)')
      .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(this._mapToEntity);
      })
    );
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    return from(
      this.supabase.from('orders').update({ status }).eq('id', orderId)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  private _mapToEntity(dbRecord: any): Order {
    return new Order({
      id: dbRecord.id,
      customer_info: {
        name: dbRecord.customer_name,
        email: dbRecord.customer_email,
        phone: dbRecord.customer_phone,
        address: dbRecord.customer_address
      },
      status: dbRecord.status,
      total: dbRecord.total_amount,
      cart_items: dbRecord.order_items?.map((i: any) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal
      })) || [],
      created_at: new Date(dbRecord.created_at)
    });
  }
}
