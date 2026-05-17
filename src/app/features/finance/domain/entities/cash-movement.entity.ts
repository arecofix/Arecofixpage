export type MovementType = 'income' | 'expense';
export type MovementCategory = 'sale' | 'purchase' | 'repair' | 'adjustment' | 'draw' | 'beca' | 'sueldo_externo' | 'gasto_fijo' | 'gasto_hormiga' | 'inversion' | 'otros';

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
