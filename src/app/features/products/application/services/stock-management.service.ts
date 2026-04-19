import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { DatabaseError } from '@app/core/errors/application.error';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  /**
   * Updates stock for a specific product and branch atomically.
   * If the record doesn't exist, it creates it.
   */
  async updateStock(productId: string, branchId: string, quantity: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId();

    // Try focused update first
    const { data, error: updateError } = await this.supabase
      .from('product_stock_per_branch')
      .update({ 
        quantity, 
        updated_at: new Date().toISOString() 
      })
      .eq('product_id', productId)
      .eq('branch_id', branchId)
      .select('id')
      .maybeSingle();

    if (updateError) throw new DatabaseError(updateError.message, updateError);

    // If no row was updated, insert it
    if (!data) {
      const { error: insertError } = await this.supabase
        .from('product_stock_per_branch')
        .insert({
          product_id: productId,
          branch_id: branchId,
          tenant_id: tenantId === TENANT_CONSTANTS.FALLBACK_ID ? null : tenantId,
          quantity,
          updated_at: new Date().toISOString()
        });

      if (insertError) throw new DatabaseError(insertError.message, insertError);
    }
    
    // Also sync the global products.stock field (aggregated)
    await this.syncGlobalStock(productId);
  }

  /**
   * Aggregates stock from all branches and updates the main products table.
   * This ensures products.stock is always a sum of all branch stocks.
   */
  private async syncGlobalStock(productId: string): Promise<void> {
    const { data: stocks, error: fetchError } = await this.supabase
      .from('product_stock_per_branch')
      .select('quantity')
      .eq('product_id', productId);

    if (fetchError) return;

    const totalStock = (stocks || []).reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    await this.supabase
      .from('products')
      .update({ stock: totalStock })
      .eq('id', productId);
  }

  /**
   * Deducts stock atomically for a repair or sale.
   * Uses a server-side RPC to ensure data integrity.
   */
  async deductStock(productId: string, branchId: string, quantityToDeduct: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId();
    const cleanTenantId = tenantId === TENANT_CONSTANTS.FALLBACK_ID ? null : tenantId;

    const { error } = await this.supabase.rpc('deduct_product_stock_v3', {
      p_product_id: productId,
      p_branch_id: branchId,
      p_quantity_to_deduct: quantityToDeduct,
      p_tenant_id: cleanTenantId
    });

    if (error) {
       console.error('[StockManagementService] RPC Failed:', error);
       throw new DatabaseError(error.message, error);
    }
  }
}
