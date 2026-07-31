import { Injectable, inject } from '@angular/core';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Order, OrderItem, OrderStatus } from '../../domain/entities/order.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable({
  providedIn: 'root',
})
export class SupabaseOrderRepository extends BaseRepository<Order> implements OrderRepository {
  protected override tableName = 'orders';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = true;
  protected override useStrictBranchIsolation = true;

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
    const persistence = OrderMapper.toPersistence({
      ...order,
      id: orderId,
      order_number: orderNumber,
    });

    const tenantId = this.tenantService.getTenantId();
    const branchId = this.branchContextService?.getBranchId();
    
    const payload = this.sanitizePayload({
      ...persistence,
      created_at: order.created_at ?? new Date().toISOString(),
    });
    
    // Bypass DEFAULT get_my_tenant() evaluation which throws "Usuario sin tenant asignado"
    payload.tenant_id = tenantId;
    if (branchId && !payload.branch_id) {
      payload.branch_id = branchId;
    }

    const { error: orderError } = await this.supabase
      .from(this.tableName)
      .insert(payload);

    if (orderError) {
      this.errorHandler.handleError(orderError, 'createOrder');
      throw orderError;
    }

    if (order.items?.length) {
      await this._upsertOrderItems(orderId, order.items);
    }

    return OrderMapper.toDomain({
      ...order,
      id: orderId,
      order_number: orderNumber,
    });
  }

  getOrders(params?: { page?: number; pageSize?: number }): Observable<Order[]> {
    let query = this.applyTenantFilter(
      this.supabase.from(this.tableName).select('*, items:order_items(*)')
    ).order('created_at', { ascending: false });

    if (params?.page !== undefined && params?.pageSize !== undefined) {
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize - 1;
      query = query.range(start, end);
    }

    return from(query as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getOrders');
        return (data || []).map((row: any) => OrderMapper.toDomain(row));
      })
    );
  }

  getOrderById(id: string): Observable<Order | null> {
    const query = this.applyTenantFilter(
      this.supabase.from(this.tableName).select('*, items:order_items(*)')
    ).eq('id', id);

    return from((query as any).maybeSingle()).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'getOrderById');
        return data ? OrderMapper.toDomain(data) : null;
      })
    );
  }

  updateOrder(id: string, order: Order): Observable<Order> {
    return from(this._updateOrderTransaction(id, order));
  }

  private async _updateOrderTransaction(id: string, order: Order): Promise<Order> {
    const persistence = OrderMapper.toPersistence(order);
    delete (persistence as any).id;

    const query = this.applyTenantFilter(
      this.supabase.from(this.tableName).update(persistence).eq('id', id)
    );

    const { error: orderError } = await (query as any);
    if (orderError) this.errorHandler.handleError(orderError, 'updateOrder');

    if (order.items) {
      await this.applyTenantFilter(
        this.supabase.from('order_items').delete()
      ).eq('order_id', id);
      await this._upsertOrderItems(id, order.items);
    }

    // Mantenemos los items originales (que incluyen los objetos product)
    const domainOrder = OrderMapper.toDomain({ ...order, id });
    if (order.items) {
        domainOrder.items = [...order.items];
    }
    return domainOrder;
  }

  private async _upsertOrderItems(orderId: string, items: OrderItem[]): Promise<void> {
    const tenantId = this.tenantService.getTenantId();
    const branchId = this.branchContextService?.getBranchId();
    
    const itemsPayload = items.map((item) => {
      const sanitized = this.sanitizePayload({
        order_id: orderId,
        product_id: item.product_id || null,
        course_id: item.course_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        cost_price: item.cost_price || 0,
        subtotal: item.subtotal,
      } as any);
      sanitized.tenant_id = tenantId;
      if (branchId && !sanitized.branch_id) {
        sanitized.branch_id = branchId;
      }
      return sanitized;
    });

    const { error: itemsError } = await this.supabase.from('order_items').insert(itemsPayload);
    if (itemsError) {
      this.errorHandler.handleError(itemsError, 'upsertOrderItems');
      throw itemsError;
    }
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    const payload = {
      status,
      updated_at: new Date().toISOString(),
    };
    return from(this.update(orderId, payload as any)).pipe(map(() => void 0));
  }

  getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
    if (!userId && !sessionId) {
      return from(Promise.resolve(null));
    }

    let query = this.supabase
      .from(this.tableName)
      .select('*, items:order_items(*, product:products(id, name, slug, price, currency, image_url))')
      .eq('status', 'cart');

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_id', sessionId!);
    }

    query = this.applyTenantFilter(query);

    return from((query as any).maybeSingle()).pipe(
      map(({ data, error }: any) => {
        if (error) {
          this.errorHandler.handleError(error, 'getActiveCart');
        }
        return data ? OrderMapper.toDomain(data) : null;
      })
    );
  }
}
