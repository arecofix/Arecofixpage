import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { StockRepository, AvailableStockInfo } from '../../domain/repositories/stock.repository';
import { StockHistory } from '../../domain/entities/stock-history.entity';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';

interface StockHistoryRow {
  id: string;
  product_id: string;
  delta: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  order_id?: string | null;
  branch_id?: string | null;
  tenant_id?: string | null;
  created_by?: string | null;
  created_at: string;
  product?: { name: string } | null;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseStockRepository implements StockRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  async adjustStock(
    productId: string,
    delta: number,
    reason: string,
    orderId?: string,
    branchId?: string,
  ): Promise<StockHistory> {
    const tenantId = this.tenantService.getTenantId();
    const currentUser = this.authService.getCurrentUser();

    // 1. Fetch current stock
    const { data: product, error: fetchErr } = await this.supabase
      .from('products')
      .select('id, name, stock')
      .eq('id', productId)
      .maybeSingle();

    if (fetchErr || !product) {
      throw new Error(fetchErr?.message || `Producto no encontrado (ID: ${productId})`);
    }

    const previousStock = Number(product.stock) || 0;
    const newStock = previousStock + delta;

    if (newStock < 0) {
      throw new Error(`El stock no puede ser negativo. Stock actual: ${previousStock}, ajuste: ${delta}`);
    }

    // 2. Update stock on products table
    const { error: updateErr } = await this.supabase
      .from('products')
      .update({
        stock: newStock,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateErr) {
      throw updateErr;
    }

    // 3. Update branch stock if branchId is provided
    if (branchId) {
      const { data: branchStock } = await this.supabase
        .from('product_stock_per_branch')
        .select('id, quantity')
        .eq('product_id', productId)
        .eq('branch_id', branchId)
        .maybeSingle();

      if (branchStock) {
        await this.supabase
          .from('product_stock_per_branch')
          .update({
            quantity: Math.max(0, (branchStock.quantity || 0) + delta),
            updated_at: new Date().toISOString(),
          })
          .eq('id', branchStock.id);
      } else {
        await this.supabase
          .from('product_stock_per_branch')
          .insert({
            product_id: productId,
            branch_id: branchId,
            tenant_id: tenantId,
            quantity: Math.max(0, newStock),
            updated_at: new Date().toISOString(),
          });
      }
    }

    // 4. Record history
    return this.recordMovement(productId, delta, previousStock, newStock, reason, orderId, branchId);
  }

  async recordMovement(
    productId: string,
    delta: number,
    previousStock: number,
    newStock: number,
    reason: string,
    orderId?: string,
    branchId?: string,
  ): Promise<StockHistory> {
    const tenantId = this.tenantService.getTenantId();
    const currentUser = this.authService.getCurrentUser();

    const historyPayload = {
      product_id: productId,
      delta,
      previous_stock: previousStock,
      new_stock: newStock,
      reason,
      order_id: orderId || null,
      branch_id: branchId || null,
      tenant_id: tenantId,
      created_by: currentUser?.id || null,
      created_at: new Date().toISOString(),
    };

    const { data: historyRow, error: historyErr } = await this.supabase
      .from('stock_history')
      .insert(historyPayload)
      .select()
      .single();

    if (historyErr || !historyRow) {
      console.warn('[SupabaseStockRepository] Error al insertar en stock_history:', historyErr);
      return {
        id: crypto.randomUUID(),
        productId,
        delta,
        previousStock,
        newStock,
        reason,
        orderId,
        branchId,
        tenantId,
        createdBy: currentUser?.id,
        createdAt: new Date().toISOString(),
      };
    }

    return this.mapToDomain(historyRow as StockHistoryRow);
  }

  getStockHistory(productId: string, limit = 20): Observable<StockHistory[]> {
    const query = this.supabase
      .from('stock_history')
      .select('*, product:products(name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('[SupabaseStockRepository] Error getStockHistory:', error);
          return [];
        }
        return (data as StockHistoryRow[] || []).map((row) =>
          this.mapToDomain(row, row.product?.name),
        );
      }),
    );
  }

  getRecentMovements(limit = 50): Observable<StockHistory[]> {
    const query = this.supabase
      .from('stock_history')
      .select('*, product:products(name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('[SupabaseStockRepository] Error getRecentMovements:', error);
          return [];
        }
        return (data as StockHistoryRow[] || []).map((row) =>
          this.mapToDomain(row, row.product?.name),
        );
      }),
    );
  }

  async getAvailableStock(productId: string): Promise<AvailableStockInfo> {
    // 1. Get physical stock
    const { data: prod } = await this.supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .maybeSingle();

    const totalStock = Number(prod?.stock) || 0;

    // 2. Calculate reserved stock in active carts created in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: reservedRows } = await this.supabase
      .from('order_items')
      .select('quantity, order:orders!inner(status, updated_at)')
      .eq('product_id', productId)
      .eq('order.status', 'cart')
      .gte('order.updated_at', twoHoursAgo);

    const reservedStock = (reservedRows || []).reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );

    const availableStock = Math.max(0, totalStock - reservedStock);

    return {
      totalStock,
      reservedStock,
      availableStock,
    };
  }

  private mapToDomain(row: StockHistoryRow, productName?: string): StockHistory {
    return {
      id: row.id,
      productId: row.product_id,
      delta: row.delta,
      previousStock: row.previous_stock,
      newStock: row.new_stock,
      reason: row.reason,
      orderId: row.order_id,
      branchId: row.branch_id,
      tenantId: row.tenant_id,
      createdBy: row.created_by,
      createdAt: row.created_at,
      productName: productName || row.product?.name,
    };
  }
}
