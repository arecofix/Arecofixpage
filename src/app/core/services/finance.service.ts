import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';

export interface CashMovement {
  id?: string;
  tenant_id?: string;
  branch_id?: string | null;
  amount: number;
  type: 'income' | 'expense';
  category: 'sale' | 'purchase' | 'repair' | 'adjustment' | 'draw';
  payment_method: string;
  reference_id?: string;
  notes?: string;
  created_at?: string;
  created_by?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);

  async recordMovement(movement: CashMovement): Promise<any> {
    const supabase = this.auth.getSupabaseClient();
    const user = this.auth.getCurrentUser();
    const tenantId = this.tenantService.getTenantId();
    
    // Auto-fetch branch_id if not provided
    let branchId = movement.branch_id;
    if (branchId === undefined && user) {
        const profile = await this.auth.getUserProfile(user.id);
        branchId = profile?.branch_id;
    }

    const payload = {
      ...movement,
      tenant_id: tenantId,
      branch_id: branchId,
      created_by: user?.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('cash_movements')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error recording cash movement:', error);
      throw error;
    }

    return data;
  }

  async getBalance(): Promise<number> {
    const supabase = this.auth.getSupabaseClient();
    const tenantId = this.tenantService.getTenantId();

    const { data, error } = await supabase
      .from('cash_movements')
      .select('amount, type')
      .eq('tenant_id', tenantId)
      .eq('payment_method', 'cash'); // We usually care about physical cash balance

    if (error) return 0;

    return data.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  }
}
