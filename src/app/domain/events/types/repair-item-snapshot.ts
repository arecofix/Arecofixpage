export type RepairItemType = 'labor' | 'part' | 'product' | 'service';

export interface RepairItemSnapshot {
  description: string;
  quantity: number;
  unitPrice: number;
  itemType: RepairItemType;
}
