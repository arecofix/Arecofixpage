export interface SaleItemSnapshot {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  itemType?: string;
}
