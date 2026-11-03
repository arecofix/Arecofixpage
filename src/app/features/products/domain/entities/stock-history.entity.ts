export type StockMovementReason =
  | 'manual_adjustment'
  | 'sale'
  | 'cancellation'
  | 'restock'
  | 'return'
  | string;

export interface StockHistory {
  id: string;
  productId: string;
  delta: number;
  previousStock: number;
  newStock: number;
  reason: StockMovementReason;
  orderId?: string | null;
  branchId?: string | null;
  tenantId?: string | null;
  createdBy?: string | null;
  createdAt: string;
  productName?: string;
}
