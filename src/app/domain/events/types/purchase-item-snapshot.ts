export interface PurchaseItemSnapshot {
  productId?: string;
  description: string;
  quantity: number;
  unitCost: number;
  taxRate?: number;
}
