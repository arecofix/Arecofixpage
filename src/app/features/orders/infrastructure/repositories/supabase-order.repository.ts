import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { AuthService } from '@app/core/services/auth.service';
import { Observable, from, map, throwError } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseOrderRepository extends OrderRepository {
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
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
        customer_name: order.clienteInfo.name,
        customer_email: order.clienteInfo.email,
        customer_phone: order.clienteInfo.phone,
        shipping_address: { address: order.clienteInfo.address },
        status: order.status,
        total_amount: order.total,
        order_number: orderNumber,
        tenant_id: this.tenantService.getTenantId(),
        created_at: new Date().toISOString()
      });

    if (orderError) throw orderError;

    // 2. Insert Items
    const itemsPayload = order.items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
      tenant_id: this.tenantService.getTenantId()
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
      this.supabase.from('orders')
      .select('*, order_items(*)')
      .eq('tenant_id', this.tenantService.getTenantId())
      .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return ((data as unknown) as OrderDbRecord[] || []).map(record => this._mapToEntity(record));
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

  private _mapToEntity(dbRecord: OrderDbRecord): Order {
    return new Order({
      id: dbRecord.id,
      clienteInfo: {
        name: dbRecord.customer_name,
        email: dbRecord.customer_email,
        phone: dbRecord.customer_phone,
        address: (dbRecord.shipping_address as any)?.address || ''
      },
      status: dbRecord.status,
      total: dbRecord.total_amount,
      items: dbRecord.order_items?.map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        subtotal: i.subtotal
      })) || [],
      createdAt: new Date(dbRecord.created_at),
      invoiceUrl: dbRecord.invoiceUrl // Assuming we also fetch invoiceUrl
    });
  }
}

interface OrderItemDbRecord {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDbRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  order_items: OrderItemDbRecord[];
  invoiceUrl?: string;
}
