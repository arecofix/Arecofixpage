import { Injectable, inject } from '@angular/core';
import { AnalyticsRepository, DashboardStats, MonthlyRevenue } from '../../domain/repositories/analytics.repository';
import { Observable, from } from 'rxjs';
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
    return from(
      (async () => {
        const tenantId = this.tenantService.getTenantId();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const startDate = twelveMonthsAgo.toISOString();

        // 1. Ejecutamos el motor financiero unificado en SQL (con soporte opcional de branch)
        // 2. Ejecutamos el legacy RPC para contadores de base (con soporte opcional de branch)
        const [financeRes, legacyDashRes] = await Promise.all([
          this.supabase.rpc('get_financial_analytics_v3', {
            p_tenant_id: tenantId,
            p_start_date: startDate,
            p_branch_id: branchId || null
          }),
          this.supabase.rpc('get_dashboard_stats_v2', {
             p_branch_id: branchId || null
          })
        ]);

        if (financeRes.error) {
          console.error('[RPC ERROR] get_financial_analytics:', financeRes.error);
          throw financeRes.error;
        }

        if (legacyDashRes.error) {
          console.error('[RPC ERROR] get_dashboard_stats:', legacyDashRes.error);
        }

        // El nuevo RPC devuelve un objeto con un campo monthly_breakdown
        const rawFinanceObj = financeRes.data as any || {};
        const legacyData = legacyDashRes.data || {};

        // ── Mapeo a DTO MonthlyRevenue ──────────────────────────────────────
        const monthly_breakdown: MonthlyRevenue[] = (Array.isArray(rawFinanceObj.monthly_breakdown) ? rawFinanceObj.monthly_breakdown : []).map((d: any) => ({
          period: d.period || '',
          label: d.label || (d.period ? formatPeriodLabel(d.period) : 'N/A'),
          gross_revenue: Number(d.gross_revenue || 0),
          cost: Number(d.cost || 0),
          net_profit: Number(d.net_profit || 0),
          repairs_revenue: Number(d.repairs_revenue || 0),
          sales_revenue: Number(d.sales_revenue || 0),
          repairs_cost: Number(d.repairs_cost || 0),
          sales_cost: Number(d.sales_cost || 0)
        })).sort((a: MonthlyRevenue, b: MonthlyRevenue) => a.period.localeCompare(b.period));

        return {
          users: legacyData.users || 0,
          products: legacyData.products || 0,
          sales: legacyData.sales || 0,
          revenue: Number(rawFinanceObj.total_gross_revenue || 0),
          repairs_month: Number(rawFinanceObj.current_month_gross / 2 || 0), // Aproximación si no hay deglose exacto
          repairs_revenue: monthly_breakdown.reduce((s, m) => s + m.repairs_revenue, 0),
          repairs_profit: monthly_breakdown.reduce((s, m) => s + (m.repairs_revenue - m.repairs_cost), 0),
          devices_fixed: legacyData.devices_fixed || 0,
          total_gross_revenue: Number(rawFinanceObj.total_gross_revenue || 0),
          total_cost: Number(rawFinanceObj.total_cost || 0),
          total_net_profit: Number(rawFinanceObj.total_net_profit || 0),
          current_month_gross: Number(rawFinanceObj.current_month_gross || 0),
          current_month_cost: Number(rawFinanceObj.current_month_cost || 0),
          current_month_profit: Number(rawFinanceObj.current_month_profit || 0),
          monthly_breakdown,
          sales_chart: monthly_breakdown.map(m => ({ period: m.period, total: m.gross_revenue })),
          products_chart: legacyData.products_chart || [],
          category_chart: legacyData.category_chart || [],
          profit_chart: monthly_breakdown.map(m => ({ period: m.period, total: m.net_profit }))
        } as DashboardStats;
      })()
    );
  }
}
