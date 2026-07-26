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

interface ChartItem {
  name: string;
  count?: number;
  quantity?: number;
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
      }),
      this.fetchManualExpenses(tenantId, branchId || null),
      this.fetchProductsAndCategoryStats(tenantId, branchId || null)
    ])).pipe(
      map(([financeRes, legacyDashRes, manualExpenses, statsData]: [any, any, number, any]) => {
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

        // Add manual expenses (cash_movements of type expense) to costs
        safe_cm_cost += manualExpenses;

        let total_cost_safe = Number(rawFinance.total_cost || 0);
        if (total_cost_safe === 0) {
            total_cost_safe = monthlyBreakdown.reduce((s, m) => s + m.repairs_cost + m.sales_cost, 0);
        }
        
        total_cost_safe += manualExpenses;

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
          products_chart: statsData.products_chart.length > 0 ? statsData.products_chart : (legacyData.products_chart || []),
          category_chart: statsData.category_chart.length > 0 ? statsData.category_chart : (legacyData.category_chart || []),
          profit_chart: monthlyBreakdown.map(m => ({ period: m.period, total: m.net_profit }))
        } as DashboardStats;
      })
    );
  }

  private async fetchManualExpenses(tenantId: string, branchId: string | null): Promise<number> {
    try {
      let query = this.supabase
        .from('cash_movements')
        .select('amount, type')
        .eq('tenant_id', tenantId)
        .eq('type', 'expense');
        
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      if (error) return 0;
      
      return (data || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    } catch (e) {
      console.error('Error fetching manual expenses', e);
      return 0;
    }
  }

  private async fetchProductsAndCategoryStats(tenantId: string, branchId: string | null): Promise<{products_chart: ChartItem[], category_chart: ChartItem[]}> {
    try {
      // First, get all orders that are completed or paid
      let ordersQuery = this.supabase
        .from('orders')
        .select('id')
        .eq('tenant_id', tenantId)
        .in('status', ['pending', 'pending_payment', 'awaiting_verification', 'paid', 'preparing', 'shipped', 'completed', 'delivered']);
        
      if (branchId) {
        ordersQuery = ordersQuery.eq('branch_id', branchId);
      }
      
      const { data: orders, error: ordersError } = await ordersQuery;
      
      if (ordersError || !orders || orders.length === 0) {
        return { products_chart: [], category_chart: [] };
      }
      
      const orderIds = orders.map(o => o.id);
      
      // Get all order items for these orders with product and category details
      const { data: orderItems, error: itemsError } = await this.supabase
        .from('order_items')
        .select('quantity, product_id, product_name, products(category_id, categories(name))')
        .eq('tenant_id', tenantId)
        .in('order_id', orderIds);
        
      if (itemsError || !orderItems || orderItems.length === 0) {
        return { products_chart: [], category_chart: [] };
      }
      
      const productStats = new Map<string, number>();
      const categoryStats = new Map<string, number>();
      
      orderItems.forEach((item: any) => {
        const qty = item.quantity || 1;
        const pName = item.product_name || 'Desconocido';
        
        productStats.set(pName, (productStats.get(pName) || 0) + qty);
        
        // Handle category
        let cName = 'Otros';
        if (item.products && item.products.categories && item.products.categories.name) {
            cName = item.products.categories.name;
        }
        
        categoryStats.set(cName, (categoryStats.get(cName) || 0) + qty);
      });
      
      // Sort and take top 5 products
      const products_chart = Array.from(productStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));
        
      // Sort and take top 5 categories
      const category_chart = Array.from(categoryStats.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
        
      return { products_chart, category_chart };
    } catch (e) {
      console.error('Error fetching stats data', e);
      return { products_chart: [], category_chart: [] };
    }
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
