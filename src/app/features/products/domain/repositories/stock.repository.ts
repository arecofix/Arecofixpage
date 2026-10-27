import { Observable } from 'rxjs';
import { StockHistory } from '../entities/stock-history.entity';

export interface AvailableStockInfo {
  totalStock: number;
  reservedStock: number;
  availableStock: number;
}

export abstract class StockRepository {
  abstract adjustStock(
    productId: string,
    delta: number,
    reason: string,
    orderId?: string,
    branchId?: string,
  ): Promise<StockHistory>;

  abstract recordMovement(
    productId: string,
    delta: number,
    previousStock: number,
    newStock: number,
    reason: string,
    orderId?: string,
    branchId?: string,
  ): Promise<StockHistory>;

  abstract getStockHistory(productId: string, limit?: number): Observable<StockHistory[]>;

  abstract getRecentMovements(limit?: number): Observable<StockHistory[]>;

  abstract getAvailableStock(productId: string): Promise<AvailableStockInfo>;
}
