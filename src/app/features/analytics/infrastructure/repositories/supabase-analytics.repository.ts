import { Injectable, inject } from '@angular/core';
import { AnalyticsRepository, DashboardStats, MonthlyRevenue } from '../../domain/repositories/analytics.repository';
import { Observable, from, map } from 'rxjs';
import { TenantService } from '@app/core/services/tenant.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  const monthName = new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(date);
  // Capitalize first letter (e.g., ene. -> Ene)
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  return `${capitalized.replace('.', '')} ${year}`;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);

  getDashboardStats(branchId?: string): Observable<DashboardStats> {
    const tenantId = this.tenantService.getTenantId();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const startDate = twelveMonthsAgo.toISOString();

    return from(Promise.all([
      this.supabase.rpc('get_financial_analytics_v3', {
        p_tenant_id: tenantId,
        p_start_date: startDate,
        p_branch_id: branchId || null
      }),
      this.supabase.rpc('get_dashboard_stats_v2', {
        p_branch_id: branchId || null
      })
    ])).pipe(
      map(([financeRes, legacyDashRes]: [any, any]) => {
        if (financeRes.error) throw financeRes.error;
        if (legacyDashRes.error) console.error('[RPC ERROR] legacy_stats:', legacyDashRes.error);

        const rawFinance = financeRes.data as any || {};
        const legacyData = legacyDashRes.data || {};

        const monthlyBreakdown: MonthlyRevenue[] = this.mapMonthlyBreakdown(rawFinance.monthly_breakdown);

        // Fallback explicit verification to ensure parts costs are properly deducted
        const cm = monthlyBreakdown.find(m => m.period === this.getCurrentPeriod());
        
        let safe_cm_gross = Number(rawFinance.current_month_gross || cm?.gross_revenue || 0);
        let safe_cm_cost = Number(rawFinance.current_month_cost || 0);
        
        // Auto-fix if the RPC failed to aggregate repairs_cost into the global cost
        if (cm && safe_cm_cost === 0 && (cm.repairs_cost > 0 || cm.sales_cost > 0)) {
            safe_cm_cost = cm.repairs_cost + cm.sales_cost;
        }

        let total_cost_safe = Number(rawFinance.total_cost || 0);
        if (total_cost_safe === 0) {
            total_cost_safe = monthlyBreakdown.reduce((s, m) => s + m.repairs_cost + m.sales_cost, 0);
        }

        const safe_total_net = Number(rawFinance.total_gross_revenue || 0) - total_cost_safe;
        const safe_cm_net = safe_cm_gross - safe_cm_cost;

        // Ensure the breakdown objects themselves accurately reflect the explicit deductions
        monthlyBreakdown.forEach(m => {
            const explicit_cost = m.repairs_cost + m.sales_cost;
            if (m.cost === 0 && explicit_cost > 0) {
                m.cost = explicit_cost;
            }
            m.net_profit = m.gross_revenue - m.cost;
        });

        return {
          users: legacyData.users || 0,
          products: legacyData.products || 0,
          sales: legacyData.sales || 0,
          revenue: Number(rawFinance.total_gross_revenue || 0),
          repairs_month: cm ? cm.repairs_revenue : 0,
          repairs_revenue: monthlyBreakdown.reduce((s, m) => s + m.repairs_revenue, 0),
          repairs_profit: monthlyBreakdown.reduce((s, m) => s + (m.repairs_revenue - m.repairs_cost), 0),
          devices_fixed: legacyData.devices_fixed || 0,
          total_gross_revenue: Number(rawFinance.total_gross_revenue || 0),
          total_cost: total_cost_safe,
          total_net_profit: safe_total_net,
          current_month_gross: safe_cm_gross,
          current_month_cost: safe_cm_cost,
          current_month_profit: safe_cm_net,
          monthly_breakdown: monthlyBreakdown,
          sales_chart: monthlyBreakdown.map(m => ({ period: m.period, total: m.gross_revenue })),
          products_chart: legacyData.products_chart || [],
          category_chart: legacyData.category_chart || [],
          profit_chart: monthlyBreakdown.map(m => ({ period: m.period, total: m.net_profit }))
        } as DashboardStats;
      })
    );
  }

  private mapMonthlyBreakdown(data: any[]): MonthlyRevenue[] {
    if (!Array.isArray(data)) return [];
    
    return data.map((d: any) => ({
      period: d.period || '',
      label: d.label || (d.period ? formatPeriodLabel(d.period) : 'N/A'),
      gross_revenue: Number(d.gross_revenue || 0),
      cost: Number(d.cost || 0),
      net_profit: Number(d.net_profit || 0),
      repairs_revenue: Number(d.repairs_revenue || 0),
      sales_revenue: Number(d.sales_revenue || 0),
      repairs_cost: Number(d.repairs_cost || 0),
      sales_cost: Number(d.sales_cost || 0)
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  private getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}
