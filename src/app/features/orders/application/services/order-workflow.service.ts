import { Injectable, inject } from '@angular/core';
import { Observable, from, firstValueFrom } from 'rxjs';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { BranchService } from '@app/core/services/branch.service';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

@Injectable({
  providedIn: 'root'
})
export class OrderWorkflowService {
  private orderRepository = inject(OrderRepository);
  private stockService = inject(StockManagementService);
  private branchService = inject(BranchService);

  /**
   * Orchestrates the creation of an order and deducts stock from inventory securely.
   * Centralizes business workflow away from the persistence layer.
   */
  async processCheckout(order: Order): Promise<Order> {
    // 1. Enforce branch context at the application level
    if (!order.branch_id) {
      order.branch_id = this.branchService.getCurrentBranchId() || TENANT_CONSTANTS.DEFAULT_BRANCH_ID;
    }

    // 2. Persist the Order and Items
    const createdOrder = await firstValueFrom(this.orderRepository.createOrder(order));

    // 2. Perform Stock Deductions Business Logics
    if (createdOrder.items && createdOrder.items.length > 0) {
      await this.deductInventoryForOrder(createdOrder.items, createdOrder.branch_id);
    }

    return createdOrder;
  }

  private async deductInventoryForOrder(items: OrderItem[], orderBranchId?: string): Promise<void> {
    for (const item of items) {
      if (item.product_id) {
        // Enforce branch priority: order branch -> global context branch -> default fallback
        const targetBranchId = orderBranchId || this.branchService.getCurrentBranchId() || TENANT_CONSTANTS.DEFAULT_BRANCH_ID;
        await this.stockService.deductStock(item.product_id, targetBranchId, item.quantity);
      }
    }
  }
}
