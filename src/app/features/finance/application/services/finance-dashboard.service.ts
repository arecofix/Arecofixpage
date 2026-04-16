import { Injectable, inject, signal, computed } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';

export interface CashMovement {
  id: string;
  tenant_id: string;
  branch_id?: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'sale' | 'purchase' | 'repair' | 'adjustment' | 'draw' | 'beca' | 'gasto_fijo' | 'gasto_hormiga' | string;
  payment_method: string;
  is_fixed?: boolean; // Nuevo campo sugerido
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export type FinanceScope = 'taller' | 'personal' | 'consolidado';

export interface InvestmentGoal {
  name: string;
  targetMonto: number;
  currency: 'USD' | 'ARS';
}

@Injectable({
  providedIn: 'root'
})
export class FinanceDashboardService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  // State
  public movements = signal<CashMovement[]>([]);
  public currentScope = signal<FinanceScope>('taller');
  public branchIds = signal<{ taller: string | null; personal: string | null }>({ taller: null, personal: null });
  
  // Meta de Inversión
  public investmentGoal = signal<InvestmentGoal>({ name: 'Terreno', targetMonto: 15000000, currency: 'ARS' });

  // 1. Filtrado General
  public filteredMovements = computed(() => {
    const scope = this.currentScope();
    const all = this.movements();
    const { taller, personal } = this.branchIds();

    if (scope === 'consolidado') return all;

    const targetBranchId = scope === 'taller' ? taller : personal;
    if (!targetBranchId) return all;

    return all.filter(m => m.branch_id === targetBranchId);
  });

  // 2. Métrica Central: Margen Neto Real vs Sensación de Riqueza
  public grossIncome = computed(() => {
    // Ingreso Bruto: Todo lo que entra
    return this.filteredMovements()
      .filter(m => m.type === 'income')
      .reduce((acc, m) => acc + Number(m.amount), 0);
  });

  public operativeCosts = computed(() => {
    // Costos operativos: Repuestos, insumos, envíos (todo gasto inherente a producir)
    return this.filteredMovements()
      .filter(m => m.type === 'expense' && ['purchase', 'repair', 'insumos'].includes(m.category))
      .reduce((acc, m) => acc + Number(m.amount), 0);
  });

  public netMargin = computed(() => {
    // Margen Neto (Lo que de verdad ganaste limpiando el costo de venta)
    return this.grossIncome() - this.operativeCosts();
  });

  // 3. Métrica de Descapitalización y Estilo de Vida (Gastos Hormiga)
  public personalExpenses = computed(() => {
    // Gastos que se filtran desde la vida personal
    return this.movements()
      .filter(m => m.branch_id === this.branchIds().personal && m.type === 'expense')
      .reduce((acc, m) => acc + Number(m.amount), 0);
  });

  public fixedPersonalExpenses = computed(() => {
    // Ej: Alquiler, cuota de la facultad
    return this.movements()
      .filter(m => m.branch_id === this.branchIds().personal && m.type === 'expense' && m.is_fixed)
      .reduce((acc, m) => acc + Number(m.amount), 0);
  });

  public antExpenses = computed(() => {
    // Gastos Hormiga: Todo egreso personal que no sea fijo
    return this.personalExpenses() - this.fixedPersonalExpenses();
  });

  // 4. Métrica de Ahorro y Metas
  public externalIncome = computed(() => {
    // Ingresos fuera del taller (Ej: Beca)
    return this.movements()
      .filter(m => m.branch_id === this.branchIds().personal && m.type === 'income' && String(m.category).toLowerCase() === 'beca')
      .reduce((acc, m) => acc + Number(m.amount), 0);
  });

  // Poder de Ahorro Neto = (Margen Taller + Beca) - Todos los gastos personales
  public netSavingsPower = computed(() => {
    const rawMargin = this.movements()
      .filter(m => m.branch_id === this.branchIds().taller)
      .reduce((acc, m) => m.type === 'income' ? acc + Number(m.amount) : acc - Number(m.amount), 0);
      
    // rawMargin representa la ganancia libre del taller
    return (rawMargin + this.externalIncome()) - this.personalExpenses();
  });

  public goalProgress = computed(() => {
    const currentSavings = this.netSavingsPower();
    const target = this.investmentGoal().targetMonto;
    if (target <= 0) return 0;
    
    let percentage = (currentSavings / target) * 100;
    if (percentage < 0) percentage = 0;
    return percentage;
  });

  public monthsToGoal = computed(() => {
     // Estima los meses asumiendo que el ahorro de los movimientos filtrados es el "promedio mensual".
     // Idealmente, esto se divide por el promedio de los últimos 3 meses.
     const savingRate = this.netSavingsPower();
     if (savingRate <= 0) return -1; // Si quema más plata de la que le entra, jamas llega
     
     const remainingTarget = this.investmentGoal().targetMonto - savingRate; // Dinero menos el pozo actual
     if (remainingTarget <= 0) return 0;

     return Math.ceil(remainingTarget / savingRate);
  });

  async initializeBranches() {
    const tenantId = this.tenantService.getTenantId();
    const { data: branches, error } = await this.supabase
      .from('branches')
      .select('id, slug')
      .eq('tenant_id', tenantId);

    if (!error && branches) {
      const taller = branches.find((b: any) => b.slug === 'taller')?.id || null;
      const personal = branches.find((b: any) => b.slug === 'personal')?.id || null;
      this.branchIds.set({ taller, personal });
    }
  }

  async loadMovements(startDate: Date, endDate: Date) {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase
      .from('cash_movements')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      this.movements.set(data as CashMovement[]);
    }
  }

  setScope(scope: FinanceScope) {
    this.currentScope.set(scope);
  }
  
  setInvestmentGoal(goal: InvestmentGoal) {
      this.investmentGoal.set(goal);
  }
}
