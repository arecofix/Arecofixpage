import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';
import { SupabaseClient } from '@supabase/supabase-js';

export interface DashboardMetricsPeriod {
  range: 'today' | '7days' | 'month' | 'year' | 'custom';
  start_date: string;
  end_date: string;
}

export interface DashboardKPIs {
  total_income: number;
  total_expense: number;
  net_balance: number;
  ecommerce_orders_count: number;
  ecommerce_amount: number;
  active_repairs_count: number;
  delayed_repairs_count: number;
  has_delayed_alert: boolean;
  active_subscriptions_count: number;
  academy_revenue: number;
  critical_stock_count: number;
}

export interface CriticalStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  min_stock_alert: number;
  price: number;
}

export interface OverduePickupRepair {
  id: string;
  tracking_code: string;
  client_name: string;
  ready_since: string;
  hours_waiting: number;
  final_cost: number;
}

export interface ExpiringGraceSubscription {
  id: string;
  user_email: string;
  student_name: string;
  grace_period_ends_at: string;
  days_left: number;
}

export interface DashboardAlerts {
  critical_stock_items: CriticalStockItem[];
  overdue_pickup_repairs: OverduePickupRepair[];
  expiring_grace_subscriptions: ExpiringGraceSubscription[];
}

export interface TrendMonth {
  period: string;
  label: string;
  income: number;
  expense: number;
  net_balance: number;
}

export interface RevenueByOrigin {
  ecommerce: number;
  repairs: number;
  academy: number;
}

export interface DashboardCharts {
  trend_6_months: TrendMonth[];
  revenue_by_origin: RevenueByOrigin;
}

export interface BusinessDashboardData {
  period: DashboardMetricsPeriod;
  kpis: DashboardKPIs;
  alerts: DashboardAlerts;
  charts: DashboardCharts;
}

export interface TopSellingProduct {
  product_id?: string;
  product_name: string;
  sku: string;
  category_name: string;
  units_sold: number;
  revenue: number;
  current_stock: number;
}

export interface CustomerRfmItem {
  customer_name: string;
  customer_email: string;
  frequency: number;
  monetary: number;
  last_order_date: string;
  segment: string;
}

export interface CustomerAnalytics {
  total_customers: number;
  repeat_customers: number;
  repeat_purchase_rate: number;
  top_customers: CustomerRfmItem[];
}

export interface RepairBrandStat {
  brand_name: string;
  repair_count: number;
  percentage: number;
}

export interface RepairModelStat {
  model_name: string;
  brand_name: string;
  repair_count: number;
}

export interface RepairCommonIssue {
  issue: string;
  count: number;
}

export interface RepairAnalytics {
  by_brand: RepairBrandStat[];
  by_model: RepairModelStat[];
  common_issues: RepairCommonIssue[];
}

export interface BusinessAnalyticsData {
  period?: DashboardMetricsPeriod;
  top_products: TopSellingProduct[];
  customer_analytics: CustomerAnalytics;
  repair_analytics: RepairAnalytics;
}

export interface AnalyticsResponse {
  success?: boolean;
  data?: BusinessAnalyticsData;
  error?: string;
}

export interface TableHealthStat {
  table_name: string;
  row_count: number;
  dead_tuples: number;
  last_autovacuum: string | null;
  idx_scan_pct: number;
  total_size: string;
}

export interface DatabaseHealthData {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  connections: {
    active: number;
    max: number;
    percentage: number;
    active_queries: number;
    idle_in_transaction: number;
  };
  performance: {
    cache_hit_ratio: number;
    total_locks: number;
    blocked_locks: number;
    long_running_queries: number;
  };
  table_stats: TableHealthStat[];
  data_freshness: {
    last_order: string | null;
    last_repair: string | null;
    last_cash_movement: string | null;
    last_enrollment: string | null;
    last_product: string | null;
  };
  links: {
    studio_url: string;
    db_host: string;
    posthog_url: string;
  };
}

export interface DatabaseHealthResponse {
  success?: boolean;
  data?: DatabaseHealthData;
  error?: string;
}

export interface DashboardMetricsResponse {
  success?: boolean;
  data?: BusinessDashboardData;
  partialErrors?: Record<string, string>;
  error?: string;
  period?: DashboardMetricsPeriod;
  kpis?: DashboardKPIs;
  alerts?: DashboardAlerts;
  charts?: DashboardCharts;
}


@Injectable({
  providedIn: 'root'
})
export class AdminBusinessDashboardService {
  private http = inject(HttpClient);
  private supabase: SupabaseClient = inject(SUPABASE_CLIENT, { optional: true }) as SupabaseClient;
  private tenantService = inject(TenantService, { optional: true });
  private authService = inject(AuthService, { optional: true });

  getMetrics(range: string = 'month', branchId?: string, simulateFailure?: string): Observable<DashboardMetricsResponse> {
    const headers = this.buildHeaders();
    let params = `?range=${encodeURIComponent(range)}`;
    if (branchId && branchId !== 'global') {
      params += `&branch_id=${encodeURIComponent(branchId)}`;
    }
    if (simulateFailure) {
      params += `&simulate_failure=${encodeURIComponent(simulateFailure)}`;
    }
    return this.http.get<DashboardMetricsResponse>(`/api/admin/dashboard/metrics${params}`, { headers }).pipe(
      catchError((err) => {
        if (this.supabase) {
          return from(this.fetchMetricsViaRpc(range, branchId, simulateFailure)).pipe(
            catchError((rpcErr) => {
              console.error('[AdminBusinessDashboardService] Both HTTP and RPC failed for metrics:', rpcErr);
              return of({
                success: false,
                error: err?.error?.error || err?.message || rpcErr?.message || 'Error al conectar con el servidor.',
                data: this.getDefaultEmptyMetrics(range),
                partialErrors: { system: 'Error de red al consultar métricas del negocio.' }
              } as DashboardMetricsResponse);
            })
          );
        }
        console.error('[AdminBusinessDashboardService] Error fetching metrics:', err);
        return of({
          success: false,
          error: err?.error?.error || err?.message || 'Error al conectar con el servidor.',
          data: this.getDefaultEmptyMetrics(range),
          partialErrors: { system: 'Error de red al consultar métricas del negocio.' }
        } as DashboardMetricsResponse);
      })
    );
  }

  private async fetchMetricsViaRpc(range: string, branchId?: string, simulateFailure?: string): Promise<DashboardMetricsResponse> {
    const tenantId = this.tenantService?.getTenantId();
    const effectiveBranchId = (branchId && branchId !== 'global') ? branchId : null;
    const partialErrors: Record<string, string> = {};

    if (simulateFailure === 'academy') {
      partialErrors['academy'] = 'No se pudieron cargar los datos de Academia.';
    }

    const { data, error } = await this.supabase.rpc('get_admin_business_dashboard_metrics', {
      p_tenant_id: tenantId || null,
      p_range: range,
      p_branch_id: effectiveBranchId
    });

    if (error) {
      throw error;
    }

    const typedData = data as unknown as BusinessDashboardData;

    if (simulateFailure === 'academy' && typedData?.kpis) {
      typedData.kpis.active_subscriptions_count = 0;
      typedData.kpis.academy_revenue = 0;
      if (typedData.charts?.revenue_by_origin) {
        typedData.charts.revenue_by_origin.academy = 0;
      }
    }

    return {
      success: true,
      data: typedData,
      partialErrors: Object.keys(partialErrors).length > 0 ? partialErrors : undefined
    };
  }

  getAnalytics(range: string = 'month', branchId?: string): Observable<AnalyticsResponse> {
    const headers = this.buildHeaders();
    let params = `?range=${encodeURIComponent(range)}`;
    if (branchId && branchId !== 'global') {
      params += `&branch_id=${encodeURIComponent(branchId)}`;
    }
    return this.http.get<AnalyticsResponse>(`/api/admin/dashboard/analytics${params}`, { headers }).pipe(
      catchError((err) => {
        if (this.supabase) {
          return from(this.fetchAnalyticsViaRpc(range, branchId)).pipe(
            catchError((rpcErr) => {
              console.error('[AdminBusinessDashboardService] Both HTTP and RPC failed for analytics:', rpcErr);
              return of({
                success: false,
                error: err?.error?.error || err?.message || rpcErr?.message || 'Error al cargar analítica de negocio.',
                data: {
                  top_products: [],
                  customer_analytics: {
                    total_customers: 0,
                    repeat_customers: 0,
                    repeat_purchase_rate: 0,
                    top_customers: []
                  },
                  repair_analytics: {
                    by_brand: [],
                    by_model: [],
                    common_issues: []
                  }
                }
              } as AnalyticsResponse);
            })
          );
        }
        console.error('[AdminBusinessDashboardService] Error fetching analytics:', err);
        return of({
          success: false,
          error: err?.error?.error || err?.message || 'Error al cargar analítica de negocio.',
          data: {
            top_products: [],
            customer_analytics: {
              total_customers: 0,
              repeat_customers: 0,
              repeat_purchase_rate: 0,
              top_customers: []
            },
            repair_analytics: {
              by_brand: [],
              by_model: [],
              common_issues: []
            }
          }
        } as AnalyticsResponse);
      })
    );
  }

  private async fetchAnalyticsViaRpc(range: string, branchId?: string): Promise<AnalyticsResponse> {
    const effectiveBranchId = (branchId && branchId !== 'global') ? branchId : null;
    const { data, error } = await this.supabase.rpc('get_admin_dashboard_analytics', {
      p_range: range,
      p_branch_id: effectiveBranchId
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data as unknown as BusinessAnalyticsData
    };
  }

  getDatabaseHealth(): Observable<DatabaseHealthResponse> {
    const headers = this.buildHeaders();
    return this.http.get<DatabaseHealthResponse>('/api/admin/dashboard/db-health', { headers }).pipe(
      catchError((err) => {
        if (this.supabase) {
          return from(this.fetchDatabaseHealthViaRpc()).pipe(
            catchError((rpcErr) => {
              console.warn('[AdminBusinessDashboardService] Both HTTP and RPC failed for db health:', rpcErr);
              return of({
                success: false,
                error: err?.error?.error || err?.message || rpcErr?.message || 'Error al conectar con el estado de la base de datos.',
                data: undefined
              } as DatabaseHealthResponse);
            })
          );
        }
        console.warn('[AdminBusinessDashboardService] Error fetching db health:', err);
        return of({
          success: false,
          error: err?.error?.error || err?.message || 'Error al conectar con el estado de la base de datos.',
          data: undefined
        } as DatabaseHealthResponse);
      })
    );
  }

  private async fetchDatabaseHealthViaRpc(): Promise<DatabaseHealthResponse> {
    const { data, error } = await this.supabase.rpc('get_admin_database_health', {});
    if (error) {
      throw error;
    }
    return {
      success: true,
      data: data as unknown as DatabaseHealthData
    };
  }

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.authService?.getStoredAccessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getDefaultEmptyMetrics(range: string = 'month'): BusinessDashboardData {
    return {
      period: {
        range: range as any,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString()
      },
      kpis: {
        total_income: 0,
        total_expense: 0,
        net_balance: 0,
        ecommerce_orders_count: 0,
        ecommerce_amount: 0,
        active_repairs_count: 0,
        delayed_repairs_count: 0,
        has_delayed_alert: false,
        active_subscriptions_count: 0,
        academy_revenue: 0,
        critical_stock_count: 0
      },
      alerts: {
        critical_stock_items: [],
        overdue_pickup_repairs: [],
        expiring_grace_subscriptions: []
      },
      charts: {
        trend_6_months: [],
        revenue_by_origin: { ecommerce: 0, repairs: 0, academy: 0 }
      }
    };
  }
}
