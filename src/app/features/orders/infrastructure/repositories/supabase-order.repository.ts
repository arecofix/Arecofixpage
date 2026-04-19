import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Order, OrderStatus, OrderItem } from '../../domain/entities/order.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { SupabaseErrorHandlerService } from '@app/core/services/supabase-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseOrderRepository extends BaseRepository<Order> implements OrderRepository {
  protected override tableName = 'orders';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = false;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  createOrder(order: Order): Observable<Order> {
    return from(this._createOrderTransaction(order));
  }

  private async _createOrderTransaction(order: Order): Promise<Order> {
    const orderId = order.id || crypto.randomUUID();
    const orderNumber = order.order_number || `ORD-${Date.now().toString(36).toUpperCase()}`;

    // 1. Insert Order
    const { error: orderError } = await this.supabase
      .from(this.tableName)
      .insert(this.sanitizePayload({
        id: orderId,
        customer_name: order.customer_name,
        customer_email: order.customer_email || null,
        customer_phone: order.customer_phone || null,
        shipping_address: order.shipping_address || null,
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total || order.total_amount,
        total_amount: order.total || order.total_amount,
        notes: order.notes || null,
        payment_method: order.payment_method || null,
        order_number: orderNumber,
        user_id: order.user_id || null,
        branch_id: order.branch_id || null,
        created_at: new Date().toISOString()
      }));

    if (orderError) this.errorHandler.handleError(orderError, 'createOrder');

    if (order.items && order.items.length > 0) {
      await this._upsertOrderItems(orderId, order.items);
    }

    return { ...order, id: orderId, order_number: orderNumber };
  }

  getOrders(): Observable<Order[]> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*, items:order_items(*)'))
      .order('created_at', { ascending: false });

    return from(query as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getOrders');
        return (data || []) as Order[];
      })
    );
  }

  getOrderById(id: string): Observable<Order | null> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*, items:order_items(*)'))
      .eq('id', id);

    return from((query as any).maybeSingle()).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getOrderById');
        return data as Order | null;
      })
    );
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return from(this._updateOrderTransaction(id, order));
  }

  private async _updateOrderTransaction(id: string, order: Order): Promise<Order> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({
        customer_name: order.customer_name,
        customer_email: order.customer_email || null,
        customer_phone: order.customer_phone || null,
        shipping_address: order.shipping_address || null,
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total || order.total_amount,
        total_amount: order.total || order.total_amount,
        notes: order.notes || null,
        payment_method: order.payment_method || null,
        updated_at: new Date().toISOString()
      })).eq('id', id);

    const { error: orderError } = await (query as any);
    
    if (orderError) this.errorHandler.handleError(orderError, 'updateOrder');

    if (order.items) {
      // Delete old items and insert new ones (replace strategy)
      await this.applyTenantFilter(this.supabase.from('order_items').delete())
        .eq('order_id', id);
      await this._upsertOrderItems(id, order.items);
    }

    return order;
  }

  private async _upsertOrderItems(orderId: string, items: OrderItem[]): Promise<void> {
    const itemsPayload = items.map(item => this.sanitizePayload({
      order_id: orderId,
      product_id: item.product_id || null,
      course_id: item.course_id || null,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      unit_cost_at_time: item.unit_cost_at_time || 0,
      subtotal: item.subtotal
    }));

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .insert(itemsPayload);

    if (itemsError) this.errorHandler.handleError(itemsError, 'upsertOrderItems');
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    const payload = { status, updated_at: new Date().toISOString() };
    return from(this.update(orderId, payload as any)).pipe(
      map(() => void 0)
    );
  }
}
