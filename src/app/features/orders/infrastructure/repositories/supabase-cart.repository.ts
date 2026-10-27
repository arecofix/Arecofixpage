import { Injectable, inject } from '@angular/core';
import { Observable, from, map, retry, timer } from 'rxjs';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { OrderMapper, OrderRow } from '../mappers/order.mapper';
import { assertUuid } from '@app/core/utils/uuid.utils';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';


const ORDER_SELECT_COLUMNS = 'id, order_number, user_id, session_id, customer_name, customer_email, customer_phone, shipping_address, status, subtotal, tax, discount, total, total_amount, payment_method, payment_proof_url, notes, invoice_url, tracking_code, tenant_id, branch_id, created_at, updated_at, items:order_items(id, order_id, cart_item_id, product_id, quantity, unit_price, subtotal, tenant_id, product:products(id, name, slug, price, currency, image_url, stock))';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCartRepository extends BaseRepository<Order> implements CartRepository {
  protected override tableName = 'orders';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = true;
  protected override useStrictBranchIsolation = false;

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  getActiveCart(userId?: string, sessionId?: string): Observable<Order | null> {
    const validUserId = assertUuid(userId);
    const validSessionId = assertUuid(sessionId);

    if (!validUserId && !validSessionId) {
      return from(Promise.resolve(null));
    }

    const fetchCart = async (): Promise<Order | null> => {
      let query = this.supabase
        .from(this.tableName)
        .select(ORDER_SELECT_COLUMNS)
        .eq('status', 'cart');

      if (validUserId) {
        query = query.eq('user_id', validUserId);
      } else if (validSessionId) {
        query = query.eq('session_id', validSessionId);
      }

      query = this.applyTenantFilter(query);

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        this.errorHandler.handleError(error, 'getActiveCart');
        throw error;
      }

      if (data && data.length > 0) {
        return OrderMapper.toDomain(data[0] as unknown as OrderRow);
      }
      return null;
    };

    return from(fetchCart()).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(retryCount * 500),
      })
    );
  }

  createCart(cart: Order): Observable<Order> {
    return from(this._createCartTransaction(cart)).pipe(
      retry({
        count: 1,
        delay: 500,
      })
    );
  }

  private async _createCartTransaction(cart: Order): Promise<Order> {
    const orderId = cart.id || crypto.randomUUID();
    const orderNumber = cart.order_number || `CART-${Date.now().toString(36).toUpperCase()}`;
    const persistence = OrderMapper.toPersistence({
      ...cart,
      id: orderId,
      order_number: orderNumber,
      status: 'cart',
    });

    const tenantId = this.tenantService.getTenantId();
    const branchId = this.branchContextService?.getBranchId();

    const payload = this.sanitizePayload({
      ...persistence,
      created_at: cart.created_at ?? new Date().toISOString(),
    });

    payload.tenant_id = tenantId;
    if (branchId && !payload.branch_id) {
      payload.branch_id = branchId;
    }

    const { error: orderError } = await this.supabase
      .from(this.tableName)
      .insert(payload);

    if (orderError) {
      const itemsContext = cart.items?.map((i) => ({
        sku: i.product?.id || i.product_id || 'unknown',
        qty: i.quantity || 1,
      })) ?? [];

      const errorCode = (orderError as any)?.code;
      const isSchemaOrFunctionMissing =
        errorCode === '42883' ||
        errorCode === 'PGRST202' ||
        Boolean(orderError.message?.toLowerCase().includes('does not exist'));

      this.logger.error('[SupabaseCartRepository] createCart failed', {
        tenantId,
        branchId,
        items: itemsContext,
        errorCode,
        errorMessage: orderError.message,
      });

      if (isSchemaOrFunctionMissing) {
        const sanitizedError = new Error('No se pudo inicializar el carrito en este momento. Por favor, reintenta en unos instantes.');
        (sanitizedError as any).code = errorCode;
        (sanitizedError as any).originalError = orderError;
        this.errorHandler.handleError(sanitizedError, 'createCart');
        throw sanitizedError;
      }

      this.errorHandler.handleError(orderError, 'createCart');
      throw orderError;
    }

    if (cart.items?.length) {
      await this._upsertCartItems(orderId, cart.items);
    }

    return OrderMapper.toDomain({
      ...cart,
      id: orderId,
      order_number: orderNumber,
      status: 'cart',
    });
  }

  updateCart(id: string, cart: Order | Partial<Order>): Observable<Order> {
    return from(this._updateCartTransaction(id, cart));
  }

  private async _updateCartTransaction(id: string, cart: Order | Partial<Order>): Promise<Order> {
    const updatePayload = OrderMapper.mapUpdateToDb(cart);
    delete updatePayload['id'];
    delete updatePayload['tenant_id'];
    delete updatePayload['items'];

    if (Object.keys(updatePayload).length > 0) {
      const query = this.applyTenantFilter(
        this.supabase.from(this.tableName).update(updatePayload).eq('id', id)
      );

      const { error: orderError } = await query;
      if (orderError) {
        this.errorHandler.handleError(orderError, 'updateCart');
        throw orderError;
      }
    }

    // ARCH-002: Differential Cart Items Persistence (Eradicating destructive delete-all)
    if (cart.items && Array.isArray(cart.items)) {
      if (cart.items.length === 0) {
        // Cart cleared completely
        const deleteQuery = this.applyTenantOnlyFilter(
          this.supabase.from('order_items').delete().eq('order_id', id)
        );
        const { error: deleteError } = await deleteQuery;
        if (deleteError) {
          this.errorHandler.handleError(deleteError, 'updateCart.clearItems');
          throw deleteError;
        }
      } else {
        // Query existing items to delete only removed cart_item_ids
        const { data: existingRows, error: fetchError } = await this.applyTenantOnlyFilter(
          this.supabase.from('order_items').select('id, cart_item_id').eq('order_id', id)
        );

        if (fetchError) {
          this.errorHandler.handleError(fetchError, 'updateCart.fetchExistingItems');
          throw fetchError;
        }

        const activeCartItemIds = new Set(
          cart.items
            .map(i => i.cart_item_id)
            .filter((cid): cid is string => Boolean(cid))
        );

        const itemsToDelete = ((existingRows as Array<{ id: string; cart_item_id?: string | null }>) || []).filter(
          row => row.cart_item_id && !activeCartItemIds.has(row.cart_item_id)
        );

        if (itemsToDelete.length > 0) {
          const idsToDelete = itemsToDelete.map(i => i.id);
          const { error: removeError } = await this.applyTenantOnlyFilter(
            this.supabase.from('order_items').delete().in('id', idsToDelete)
          );
          if (removeError) {
            this.errorHandler.handleError(removeError, 'updateCart.deleteRemovedItems');
            throw removeError;
          }
        }

        await this._upsertCartItems(id, cart.items);
      }
    }

    const { data, error } = await this.applyTenantFilter(
      this.supabase.from(this.tableName).select(ORDER_SELECT_COLUMNS)
    ).eq('id', id).maybeSingle();

    if (error) {
      this.errorHandler.handleError(error, 'updateCart.refresh');
      throw error;
    }

    return data ? OrderMapper.toDomain(data as unknown as OrderRow) : OrderMapper.toDomain({ ...(cart as Order), id });
  }

  deleteCart(id: string): Observable<void> {
    const deleteOp = async (): Promise<void> => {
      // First delete associated order_items
      await this.applyTenantFilter(
        this.supabase.from('order_items').delete().eq('order_id', id)
      );

      // Then delete the order header
      const { error } = await this.applyTenantFilter(
        this.supabase.from(this.tableName).delete().eq('id', id)
      );

      if (error) {
        this.errorHandler.handleError(error, 'deleteCart');
        throw error;
      }
    };

    return from(deleteOp()).pipe(map(() => void 0));
  }

  private async _upsertCartItems(orderId: string, items: OrderItem[]): Promise<void> {
    const tenantId = this.tenantService.getTenantId();

    const itemsPayload = items.map((item) => {
      const cartItemId = item.cart_item_id || crypto.randomUUID();
      item.cart_item_id = cartItemId;

      const sanitized: Record<string, unknown> = {
        order_id: orderId,
        cart_item_id: cartItemId,
        product_id: item.product_id || null,
        course_id: item.course_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
        tenant_id: tenantId,
      };
      if (item.id) {
        sanitized['id'] = item.id;
      }
      return sanitized;
    });

    const { error: itemsError } = await this.supabase
      .from('order_items')
      .upsert(itemsPayload, { onConflict: 'cart_item_id' });

    if (itemsError) {
      this.errorHandler.handleError(itemsError, 'upsertCartItems');
      throw itemsError;
    }
  }

  private applyTenantOnlyFilter<Q extends { eq?: Function }>(query: Q): Q {
    const rawTenantId = this.tenantService.getTenantId();
    const validTenantId = assertUuid(rawTenantId);
    if (validTenantId && validTenantId !== TENANT_CONSTANTS.FALLBACK_ID && query && typeof query.eq === 'function') {
      return query.eq('tenant_id', validTenantId);
    }
    return query;
  }
}
