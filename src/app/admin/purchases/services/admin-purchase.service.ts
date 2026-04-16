import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { Purchase } from '@app/features/sales/domain/entities/purchase.entity';

@Injectable({
  providedIn: 'root'
})
export class AdminPurchaseService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private financeService = inject(FinanceService);
  private productRepository = inject(ProductRepository);

  async getPurchases(): Promise<Purchase[]> {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase
      .from('purchases')
      .select('*, suppliers(name)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Purchase[];
  }

  async getSuppliers(): Promise<any[]> {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .eq('tenant_id', tenantId);

    if (error) throw error;
    return data || [];
  }

  async createPurchase(form: any, items: any[], total: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId()!;

    // 1. Create Purchase
    const { data: purchase, error: purchaseError } = await this.supabase
      .from('purchases')
      .insert({
        supplier_id: form.supplier_id,
        branch_id: form.branch_id || null,
        date: form.purchase_date,
        status: form.status,
        total_amount: total,
        payment_method: form.payment_method,
        tenant_id: tenantId
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    // 2. Create Purchase Items
    const purchaseItems = items.map(item => ({
      purchase_id: purchase.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      tenant_id: tenantId
    }));

    const { error: itemsError } = await this.supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsError) throw itemsError;

    // 3. Update Stock handling branch natively via our repository patch previously created
    if (form.status === 'received') {
      for (const item of items) {
        const { data: currentProduct } = await this.supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .eq('tenant_id', tenantId)
          .single();

        if (currentProduct) {
          this.productRepository.update(item.product_id, { stock: currentProduct.stock + item.quantity }).subscribe();
        }
      }
    }

    // 4. Record Cash Movement if applicable
    if (form.payment_method === 'efectivo') {
      await this.financeService.recordMovement({
        amount: total,
        type: 'expense',
        category: 'purchase',
        branch_id: form.branch_id || null,
        payment_method: 'cash',
        reference_id: purchase.id,
        notes: `Compra a proveedor #${purchase.id.substring(0, 8)}`
      });
    }
  }
}
