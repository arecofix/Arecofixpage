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
      this.fetchAdditionalCosts(tenantId, branchId || null),
      this.fetchProductsAndCategoryStats(tenantId, branchId || null)
    ])).pipe(
      map(([financeRes, legacyDashRes, additionalCosts, statsData]: [any, any, any, any]) => {
        if (financeRes.error) throw financeRes.error;
        if (legacyDashRes.error) console.error('[RPC ERROR] legacy_stats:', legacyDashRes.error);

        const rawFinance = financeRes.data as any || {};
        const legacyData = legacyDashRes.data || {};

        const monthlyBreakdown: MonthlyRevenue[] = this.mapMonthlyBreakdown(rawFinance.monthly_breakdown);

        // Explicitly merge the highly-accurate additional costs (parts & expenses) into each month
        monthlyBreakdown.forEach(m => {
            const partsCost = additionalCosts.partsByMonth.get(m.period) || 0;
            const expenses = additionalCosts.expensesByMonth.get(m.period) || 0;
            const trueRepairsRev = additionalCosts.repairsRevenueByMonth.get(m.period) || 0;
            
            // Override repairs_revenue completely to ignore buggy RPC sum (which includes unfinished/cancelled repairs)
            m.repairs_revenue = trueRepairsRev;
            
            // Recalculate gross revenue explicitly
            m.gross_revenue = m.sales_revenue + m.repairs_revenue;
            
            // Override repairs_cost with our explicit parts calculation if it's higher (fallback if RPC missed it)
            if (partsCost > m.repairs_cost) {
                m.repairs_cost = partsCost;
            }
            
            // Recalculate total cost explicitly for the month
            m.cost = m.repairs_cost + m.sales_cost + expenses;
            
            // Recalculate net profit
            m.net_profit = m.gross_revenue - m.cost;
        });

        const cm = monthlyBreakdown.find(m => m.period === this.getCurrentPeriod());
        
        const safe_cm_gross = cm ? cm.gross_revenue : Number(rawFinance.current_month_gross || 0);
        const safe_cm_cost = cm ? cm.cost : 0;
        const safe_cm_net = safe_cm_gross - safe_cm_cost;

        // Recalculate global totals based on the corrected monthly breakdown
        const total_gross = monthlyBreakdown.reduce((sum, m) => sum + m.gross_revenue, 0);
        let total_cost_safe = Number(rawFinance.total_cost || 0);
        
        // Ensure total_cost_safe includes our explicit totals at minimum
        const explicit_total_cost = additionalCosts.partsTotal + additionalCosts.expensesTotal;
        if (total_cost_safe < explicit_total_cost) {
            // If the RPC completely missed parts/expenses, we fallback to the sum of all explicit costs + whatever sales costs we have in the breakdown
            const total_sales_cost = monthlyBreakdown.reduce((s, m) => s + m.sales_cost, 0);
            total_cost_safe = explicit_total_cost + total_sales_cost;
        }

        const safe_total_net = total_gross - total_cost_safe;

        return {
          users: legacyData.users || 0,
          products: legacyData.products || 0,
          sales: legacyData.sales || 0,
          revenue: total_gross,
          repairs_month: cm ? cm.repairs_revenue : 0,
          repairs_revenue: monthlyBreakdown.reduce((s, m) => s + m.repairs_revenue, 0),
          repairs_profit: monthlyBreakdown.reduce((s, m) => s + (m.repairs_revenue - m.repairs_cost), 0),
          devices_fixed: legacyData.devices_fixed || 0,
          total_gross_revenue: total_gross,
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

  private async fetchAdditionalCosts(tenantId: string, branchId: string | null): Promise<{ partsByMonth: Map<string, number>, partsTotal: number, expensesByMonth: Map<string, number>, expensesTotal: number, repairsRevenueByMonth: Map<string, number>, repairsRevenueTotal: number }> {
    const result = {
        partsByMonth: new Map<string, number>(),
        partsTotal: 0,
        expensesByMonth: new Map<string, number>(),
        expensesTotal: 0,
        repairsRevenueByMonth: new Map<string, number>(),
        repairsRevenueTotal: 0
    };
    try {
        let expQuery = this.supabase
            .from('cash_movements')
            .select('amount, created_at')
            .eq('tenant_id', tenantId)
            .eq('type', 'expense');
        if (branchId) expQuery = expQuery.eq('branch_id', branchId);

        let partsQuery = this.supabase
            .from('repairs')
            .select(`created_at, current_status_id, final_cost, completed_at, repair_parts_used(quantity, cost_at_time, unit_price_at_time)`)
            .eq('tenant_id', tenantId);
        if (branchId) partsQuery = partsQuery.eq('branch_id', branchId);

        const [expRes, partsRes] = await Promise.all([expQuery, partsQuery]);

        if (!expRes.error && expRes.data) {
            expRes.data.forEach((exp: any) => {
                const date = new Date(exp.created_at);
                const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const amount = Number(exp.amount || 0);
                result.expensesTotal += amount;
                result.expensesByMonth.set(period, (result.expensesByMonth.get(period) || 0) + amount);
            });
        }

        if (!partsRes.error && partsRes.data) {
            partsRes.data.forEach((repair: any) => {
                const sId = Number(repair.current_status_id);
                // Calculate true repairs revenue exactly like Inteligencia Financiera (only Lista or Entregada)
                if (sId === 5 || sId === 6) {
                    const revDate = repair.completed_at || repair.created_at || new Date().toISOString();
                    const date = new Date(revDate);
                    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    const rev = Number(repair.final_cost || 0);
                    result.repairsRevenueTotal += rev;
                    result.repairsRevenueByMonth.set(period, (result.repairsRevenueByMonth.get(period) || 0) + rev);
                }

                if (sId === 7) return; // Do not count costs for cancelled repairs
                if (!repair.repair_parts_used || repair.repair_parts_used.length === 0) return;
                const date = new Date(repair.created_at);
                const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                let cost = 0;
                repair.repair_parts_used.forEach((part: any) => {
                    const qty = Number(part.quantity || 1);
                    const unitCost = part.cost_at_time
                        ? (Number(part.cost_at_time) / qty)
                        : Number(part.unit_price_at_time || part.cost_price || 0);
                    cost += unitCost * qty;
                });
                result.partsTotal += cost;
                result.partsByMonth.set(period, (result.partsByMonth.get(period) || 0) + cost);
            });
        }
    } catch (e) {
        console.error('Error fetching additional costs', e);
    }
    return result;
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
