import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { Purchase } from '@app/features/sales/domain/entities/purchase.entity';
import { AuthService } from '@app/core/services/auth.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';
import { LoggerService } from '@app/core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPurchaseService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private financeService = inject(FinanceService);
  private productRepository = inject(ProductRepository);
  private authService = inject(AuthService);
  private branchContextService = inject(BranchContextService);
  private supplierService = inject(SupplierService);
  private logger = inject(LoggerService);

  async getPurchases(): Promise<Purchase[]> {
    const tenantId = this.tenantService.getTenantId();
    let query = this.supabase
      .from('purchases')
      .select('id, supplier_id, branch_id, date, status, total_amount, payment_method, created_at, updated_at, suppliers(name)')
      .eq('tenant_id', tenantId);

    // Si el usuario NO es un administrador global en la sucursal central, filtramos obligatoriamente por la sucursal activa
    const profile = this.authService.getCurrentProfile();
    const isGlobalAdmin = this.authService.isSuperAdmin() || profile?.role === 'tenant_owner';
    const contextBranchId = this.branchContextService.getBranchId();
    const isCentralBranch = contextBranchId === 'de967f68-7b15-44c0-bc98-952ccf06e1e5' || !contextBranchId;

    if (!(isGlobalAdmin && isCentralBranch)) {
      const branchId = contextBranchId || profile?.branch_id;
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      this.logger.error('[AdminPurchaseService] Error fetching purchases:', error);
      throw new Error(`Error al cargar compras: ${error.message}`);
    }
    return (data as unknown) as Purchase[];
  }

  /**
   * Obtiene proveedores usando SupplierService (fuente única de verdad)
   * en lugar de una query Supabase directa, garantizando coherencia con el resto de la app.
   */
  async getSuppliers(): Promise<Supplier[]> {
    try {
      return await this.supplierService.getAll();
    } catch (e: unknown) {
      this.logger.error('[AdminPurchaseService] Error fetching suppliers:', e);
      return [];
    }
  }

  async createPurchase(form: any, items: any[], total: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId()!;

    // Normalize branch_id: treat empty string as undefined to avoid FK constraint errors
    const branchId = form.branch_id && form.branch_id.trim() !== '' ? form.branch_id : undefined;

    // ── STEP 1: Create Purchase ────────────────────────────────────────────────
    const purchasePayload: Record<string, unknown> = {
      supplier_id: form.supplier_id,
      date: form.purchase_date,
      status: form.status,
      total_amount: total,
      payment_method: form.payment_method,
      tenant_id: tenantId
    };
    // Only include branch_id if it has a value — avoids NOT NULL constraint violations
    if (branchId) purchasePayload['branch_id'] = branchId;

    const { data: purchase, error: purchaseError } = await this.supabase
      .from('purchases')
      .insert(purchasePayload)
      .select()
      .single();

    if (purchaseError) {
      this.logger.error('[AdminPurchaseService] STEP 1 - Purchase insert failed:', purchaseError);
      throw new Error(`Error al crear la compra: ${purchaseError.message} (code: ${purchaseError.code})`);
    }

    // ── STEP 2: Create Purchase Items ──────────────────────────────────────────
    if (items.length === 0) {
      throw new Error('No se pueden registrar compras sin items.');
    }

    const purchaseItems = items.map(item => ({
      purchase_id: purchase.id,
      product_id: item.product_id,
      quantity: Number(item.quantity),
      unit_cost: Number(item.unit_cost),
      tenant_id: tenantId
    }));

    const { error: itemsError } = await this.supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsError) {
      this.logger.error('[AdminPurchaseService] STEP 2 - Purchase items insert failed:', itemsError);
      throw new Error(`Error al registrar los items de la compra: ${itemsError.message} (code: ${itemsError.code})`);
    }

    // ── STEP 3: Update Stock (only if status = received) ──────────────────────
    if (form.status === 'received') {
      for (const item of items) {
        try {
          const { data: currentProduct } = await this.supabase
            .from('products')
            .select('stock')
            .eq('id', item.product_id)
            .eq('tenant_id', tenantId)
            .single();

          if (currentProduct) {
            this.productRepository.update(item.product_id, {
              stock: (currentProduct.stock ?? 0) + Number(item.quantity)
            }).subscribe({
              error: (e) => this.logger.warn(`[AdminPurchaseService] STEP 3 - Stock update failed for product ${item.product_id}`, e)
            });
          }
        } catch (stockErr) {
          // Log but don't fail the whole purchase — stock discrepancy is recoverable
          this.logger.warn('[AdminPurchaseService] STEP 3 - Could not update stock for item', { item, error: String(stockErr) });
        }
      }
    }

    // ── STEP 4: Record Cash Movement if applicable ─────────────────────────────
    if (form.payment_method === 'efectivo') {
      try {
        await this.financeService.recordMovement({
          amount: total,
          type: 'expense',
          category: 'purchase',
          branch_id: branchId || null,
          payment_method: 'cash',
          reference_id: purchase.id,
          notes: `Compra a proveedor #${purchase.id.substring(0, 8)}`
        });
      } catch (finErr) {
        // Log but don't rollback — finance movement is non-critical
        this.logger.warn('[AdminPurchaseService] STEP 4 - Finance movement failed (purchase was saved):', finErr);
      }
    }
  }
}

