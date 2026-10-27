import { Injectable, inject } from '@angular/core';
import { StockRepository, AvailableStockInfo } from '../../domain/repositories/stock.repository';
import { StockHistory } from '../../domain/entities/stock-history.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private repository = inject(StockRepository);

  async adjustStock(
    productId: string,
    delta: number,
    reason: string,
    orderId?: string,
    branchId?: string,
  ): Promise<StockHistory> {
    if (!productId) {
      throw new Error('ID de producto requerido para el ajuste de stock');
    }
    if (isNaN(delta) || !Number.isInteger(delta)) {
      throw new Error('El valor del ajuste debe ser un número entero');
    }
    return this.repository.adjustStock(productId, delta, reason, orderId, branchId);
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
    return this.repository.recordMovement(productId, delta, previousStock, newStock, reason, orderId, branchId);
  }

  getStockHistory(productId: string, limit?: number): Observable<StockHistory[]> {
    return this.repository.getStockHistory(productId, limit);
  }

  getRecentMovements(limit?: number): Observable<StockHistory[]> {
    return this.repository.getRecentMovements(limit);
  }

  async getAvailableStock(productId: string): Promise<AvailableStockInfo> {
    return this.repository.getAvailableStock(productId);
  }
}
