import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';

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
  private authService = inject(AuthService);

  getMetrics(range: string = 'month', branchId?: string, simulateFailure?: string): Observable<DashboardMetricsResponse> {
    return from(this.buildHeaders()).pipe(
      switchMap((headers) => {
        let params = `?range=${encodeURIComponent(range)}`;
        if (branchId && branchId !== 'global') {
          params += `&branch_id=${encodeURIComponent(branchId)}`;
        }
        if (simulateFailure) {
          params += `&simulate_failure=${encodeURIComponent(simulateFailure)}`;
        }
        return this.http.get<DashboardMetricsResponse>(`/api/admin/dashboard/metrics${params}`, { headers });
      }),
      catchError((err) => {
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

  getAnalytics(range: string = 'month', branchId?: string): Observable<AnalyticsResponse> {
    return from(this.buildHeaders()).pipe(
      switchMap((headers) => {
        let params = `?range=${encodeURIComponent(range)}`;
        if (branchId && branchId !== 'global') {
          params += `&branch_id=${encodeURIComponent(branchId)}`;
        }
        return this.http.get<AnalyticsResponse>(`/api/admin/dashboard/analytics${params}`, { headers });
      }),
      catchError((err) => {
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

  getDatabaseHealth(): Observable<DatabaseHealthResponse> {
    return from(this.buildHeaders()).pipe(
      switchMap((headers) => {
        return this.http.get<DatabaseHealthResponse>('/api/admin/dashboard/db-health', { headers });
      }),
      catchError((err) => {
        console.error('[AdminBusinessDashboardService] Error fetching db health:', err);
        return of({
          success: false,
          error: err?.error?.error || err?.message || 'Error al conectar con el estado de la base de datos.',
          data: undefined
        } as DatabaseHealthResponse);
      })
    );
  }


  private async buildHeaders(): Promise<HttpHeaders> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const currentSession = this.authService.getCurrentSession();
      const session = currentSession?.access_token ? currentSession : await this.authService.getSession();
      if (session?.access_token) {
        headers = headers.set('Authorization', `Bearer ${session.access_token}`);
      }
    } catch (e) {
      // Ignore if session can't be fetched
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
