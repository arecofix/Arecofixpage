import { Injectable, inject } from '@angular/core';
import { ProductStockRepository } from '../../domain/repositories/product-stock.repository';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
  private stockRepo = inject(ProductStockRepository);
  private tenantService = inject(TenantService);

  /**
   * Updates stock for a specific product and branch atomically.
   * If the record doesn't exist, it creates it.
   */
  async updateStock(productId: string, branchId: string, quantity: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId();
    await this.stockRepo.updateBranchStock(productId, branchId, quantity, tenantId);
  }

  /**
   * Deducts stock atomically for a repair or sale.
   * Uses a server-side RPC to ensure data integrity.
   */
  async deductStock(productId: string, branchId: string, quantityToDeduct: number): Promise<void> {
    const tenantId = this.tenantService.getTenantId();
    await this.stockRepo.deductStock(productId, branchId, quantityToDeduct, tenantId);
  }
}
