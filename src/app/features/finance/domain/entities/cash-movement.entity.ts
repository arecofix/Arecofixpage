export type MovementType = 'income' | 'expense';
export type MovementCategory = 'sale' | 'purchase' | 'repair' | 'adjustment' | 'draw';

export interface CashMovement {
  id?: string;
  tenant_id?: string;
  branch_id?: string | null;
  amount: number;
  type: MovementType;
  category: MovementCategory;
  payment_method: string;
  reference_id?: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}
