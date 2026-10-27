import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  effect,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  PLATFORM_ID,
} from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, catchError, takeUntil, finalize } from 'rxjs/operators';
import { CommonModule, DecimalPipe, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { SkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  AnalyticsRepository,
  DashboardStats,
  MonthlyRevenue,
} from '@app/features/analytics/domain/repositories/analytics.repository';
import { CHART_COLORS } from './constants/chart-colors.constant';
import { AuthService } from '@app/core/services/auth.service';
import { TranslationService } from '@app/core/services/translation.service';
import { TenantService } from '@app/core/services/tenant.service';
import { AnalyticsService } from '@app/core/services/analytics.service';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { FinanceReportService } from '@app/features/analytics/application/services/finance-report.service';
import { NumberUtils } from '@app/shared/utils/number.utils';
import { Branch, BranchService } from '@app/core/services/branch.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { NotificationService } from '@app/core/services/notification.service';
import {
  AdminBusinessDashboardService,
  BusinessDashboardData,
  CriticalStockItem,
  OverduePickupRepair,
  ExpiringGraceSubscription,
  TrendMonth,
  BusinessAnalyticsData,
  DatabaseHealthData,
  TopSellingProduct,
  CustomerRfmItem,
  RepairBrandStat,
  RepairModelStat
} from './services/admin-business-dashboard.service';


export const DEFAULT_DASHBOARD_METRICS: BusinessDashboardData = {
  period: {
    range: 'month',
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

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BaseChartDirective,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-dashboard-page.html',
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private analyticsRepo = inject(AnalyticsRepository);
  private analyticsService = inject(AnalyticsService);
  private authService = inject(AuthService);
  public t = inject(TranslationService).t;
  private tenantService = inject(TenantService);
  private adminProductService = inject(AdminProductService);
  private reportService = inject(FinanceReportService);
  private router = inject(Router);
  private financeService = inject(FinanceService);
  private notificationService = inject(NotificationService);
  private businessDashboardService = inject(AdminBusinessDashboardService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  // ── Consolidated Business Dashboard Signals ──
  selectedRange = signal<'today' | '7days' | 'month' | 'year'>('month');
  dashboardData = signal<BusinessDashboardData>(DEFAULT_DASHBOARD_METRICS);
  partialErrors = signal<Record<string, string> | null>(null);

  // Active navigation tab for dashboard drilldown
  activeViewTab = signal<'general' | 'products' | 'customers' | 'repairs' | 'health'>('general');

  // Analytics & DB Health Signals
  analyticsData = signal<BusinessAnalyticsData | null>(null);
  loadingAnalytics = signal<boolean>(false);
  analyticsError = signal<string | null>(null);

  dbHealthData = signal<DatabaseHealthData | null>(null);
  loadingDbHealth = signal<boolean>(false);
  dbHealthError = signal<string | null>(null);

  // Resilient loading & error states
  isLoading = signal<boolean>(true);
  loadingBusinessMetrics = computed(() => this.isLoading());
  error = signal<string | null>(null);


  // Safe computed metrics for direct and legacy template access
  metrics = computed(() => ({
    ...this.dashboardData()?.kpis,
    net_balance: this.dashboardData()?.kpis?.net_balance ?? 0,
    total_sales: this.dashboardData()?.kpis?.ecommerce_orders_count ?? 0,
    pending_repairs: this.dashboardData()?.kpis?.active_repairs_count ?? 0,
    active_students: this.dashboardData()?.kpis?.active_subscriptions_count ?? 0,
    charts: this.dashboardData()?.charts?.trend_6_months ?? []
  }));
  businessMetrics = computed(() => this.dashboardData() ?? DEFAULT_DASHBOARD_METRICS);

  activeAlertTab = signal<'stock' | 'repairs' | 'subscriptions'>('stock');

  // Trend Charts
  public trendChartData?: ChartData<'bar'>;
  public trendChartType: 'bar' = 'bar';
  public trendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { size: 12, weight: 'bold' }, usePointStyle: true, boxWidth: 8 }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  public revenueOriginChartData?: ChartData<'doughnut'>;
  public revenueOriginChartType: 'doughnut' = 'doughnut';
  public revenueOriginChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { font: { size: 11, weight: 'bold' }, padding: 14, usePointStyle: true, boxWidth: 8 }
      }
    },
    cutout: '65%'
  };

  // ── Manual Finance Modal Signals ──
  showFinanceModal = signal(false);
  financeForm = signal({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    category: 'gasto_fijo' as any,
    payment_method: 'cash',
    notes: '',
  });
  savingFinance = signal(false);

  availableCategories = computed(() => {
    const type = this.financeForm().type;
    if (type === 'income') {
      return [
        { value: 'sale', label: '🛒 Ventas de Tienda' },
        { value: 'repair', label: '🛠️ Reparación / Taller' },
        {
          value: 'sueldo_externo',
          label: '💼 Inyección Capital / Sueldo Externo',
        },
        { value: 'beca', label: '🎓 Becas / Subsidios' },
        { value: 'adjustment', label: '📊 Ajuste de Caja (Ingreso)' },
        { value: 'otros', label: '➕ Otros Ingresos' },
      ];
    } else {
      return [
        { value: 'purchase', label: '📦 Compra de Repuestos / Insumos' },
        {
          value: 'gasto_fijo',
          label: '🏠 Gastos Fijos (Alquiler, Luz, Internet)',
        },
        { value: 'gasto_hormiga', label: '☕ Gastos Hormiga (Café, Limpieza)' },
        { value: 'inversion', label: '📈 Inversión (Herramientas, Marketing)' },
        { value: 'draw', label: '💸 Retiro de Socios / Socias' },
        { value: 'adjustment', label: '📊 Ajuste de Caja (Egreso)' },
        { value: 'otros', label: '➖ Otros Egresos' },
      ];
    }
  });

  stats = signal<DashboardStats>({
    users: 0,
    products: 0,
    sales: 0,
    revenue: 0,
    repairs_month: 0,
    repairs_revenue: 0,
    repairs_profit: 0,
    devices_fixed: 0,
    pending_approvals: 0,
    total_gross_revenue: 0,
    total_cost: 0,
    total_net_profit: 0,
    current_month_gross: 0,
    current_month_cost: 0,
    current_month_profit: 0,
    monthly_breakdown: [],
    sales_chart: [],
    products_chart: [],
    category_chart: [],
    profit_chart: [],
  });

  totalProfitMargin = computed(() => {
    return NumberUtils.calculateMargin(
      this.stats().total_gross_revenue,
      this.stats().total_net_profit,
    );
  });

  selectedPeriod = signal<string>(this.getCurrentPeriod());

  selectedMonthData = computed(() => {
    const period = this.selectedPeriod();
    const breakdown = this.stats().monthly_breakdown || [];
    return (
      breakdown.find((m) => m.period === period) ||
      ({
        period: period,
        label: 'Mes Seleccionado',
        gross_revenue: 0,
        cost: 0,
        net_profit: 0,
        repairs_revenue: 0,
        sales_revenue: 0,
        repairs_cost: 0,
        sales_cost: 0,
      } as MonthlyRevenue)
    );
  });

  selectedMonthGross = computed(() => this.selectedMonthData().gross_revenue);
  selectedMonthCost = computed(() => this.selectedMonthData().cost);
  selectedMonthProfit = computed(() => this.selectedMonthData().net_profit);
  selectedMonthRepairsProfit = computed(
    () =>
      this.selectedMonthData().repairs_revenue -
      this.selectedMonthData().repairs_cost,
  );

  currentMonthMargin = computed(() => {
    return NumberUtils.calculateMargin(
      this.selectedMonthGross(),
      this.selectedMonthProfit(),
    );
  });

  private getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  analyticsStats = signal({
    enabled: false,
    sessionId: '',
    distinctId: '',
    eventsCount: 0,
  });

  loading = signal(true);
  isSuperAdmin = signal(false);
  pendingProductsCount = signal(0);

  private branchService = inject(BranchService);

  // Branches for SuperAdmin
  branches = signal<Branch[]>([]);

  // Chart Properties (Legacy fallback)
  public salesChartData?: ChartData<'line'>;
  public salesChartType: ChartType = 'line';
  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { display: false },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#9ca3af' },
      },
    },
  };

  private branchContextService = inject(BranchContextService);
  private loadStats$ = new Subject<string | undefined>();

  constructor() {
    this.loadStats$
      .pipe(
        switchMap((branchId) => {
          this.loading.set(true);
          return this.analyticsRepo.getDashboardStats(branchId).pipe(
            catchError((err) => {
              console.error('Error loading dashboard stats:', err);
              this.loading.set(false);
              return [];
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((stats: any) => {
        if (stats && !Array.isArray(stats)) {
          this.stats.set(stats);
          this.prepareLegacyCharts(stats);
        }
        this.loading.set(false);
        this.loadPendingProductsCount();
      });

    // React to branch changes globally
    effect(() => {
      const branchId = this.branchContextService.currentBranchId();
      if (!isPlatformBrowser(this.platformId)) return;
      this.loadStats$.next(branchId || undefined);
      this.loadBusinessMetrics(this.selectedRange(), branchId || undefined);
    });
  }

  async ngOnInit() {
    this.isSuperAdmin.set(this.authService.isSuperAdmin());

    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading.set(false);
      return;
    }

    if (this.isSuperAdmin()) {
      await this.loadBranches();
    }

    await this.loadPendingProductsCount();
    this.loadBusinessMetrics();
    this.loadAnalytics();
    this.loadDatabaseHealth();

    // Analytics monitor
    this.analyticsStats.set({
      enabled: this.analyticsService.isEnabled(),
      sessionId: this.analyticsService.getSessionId() || 'N/A',
      distinctId: (this.analyticsService as any).getDistinctId?.() || 'N/A',
      eventsCount: 0,
    });
  }

  objectEntries(obj: Record<string, string>): [string, string][] {
    return Object.entries(obj);
  }

  private sanitizeData(
    raw: Partial<BusinessDashboardData> | Record<string, unknown> | null | undefined,
    range: 'today' | '7days' | 'month' | 'year' = 'month'
  ): BusinessDashboardData {
    if (!raw || typeof raw !== 'object') {
      return {
        period: {
          range,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString()
        },
        kpis: { ...DEFAULT_DASHBOARD_METRICS.kpis },
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

    const rawObj = raw as Record<string, unknown>;
    const rawKpis = (rawObj['kpis'] && typeof rawObj['kpis'] === 'object'
      ? rawObj['kpis']
      : (rawObj['metrics'] && typeof rawObj['metrics'] === 'object' ? rawObj['metrics'] : rawObj)) as Record<string, unknown>;

    const rawAlerts = (rawObj['alerts'] && typeof rawObj['alerts'] === 'object'
      ? rawObj['alerts']
      : {}) as Record<string, unknown>;

    const rawCharts = (rawObj['charts'] && typeof rawObj['charts'] === 'object'
      ? rawObj['charts']
      : {}) as Record<string, unknown>;

    const rawPeriod = (rawObj['period'] && typeof rawObj['period'] === 'object'
      ? rawObj['period']
      : {}) as Record<string, unknown>;

    const netBalance = Number(rawKpis['net_balance'] ?? rawKpis['net_cashflow'] ?? 0);
    const totalIncome = Number(rawKpis['total_income'] ?? 0);
    const totalExpense = Number(rawKpis['total_expense'] ?? 0);
    const ecommerceCount = Number(rawKpis['ecommerce_orders_count'] ?? rawKpis['ecommerce_paid_count'] ?? rawKpis['total_sales'] ?? 0);
    const ecommerceAmount = Number(rawKpis['ecommerce_amount'] ?? rawKpis['ecommerce_paid_revenue'] ?? 0);
    const activeRepairs = Number(rawKpis['active_repairs_count'] ?? rawKpis['pending_repairs'] ?? 0);
    const delayedRepairs = Number(rawKpis['delayed_repairs_count'] ?? 0);
    const hasDelayedAlert = Boolean(rawKpis['has_delayed_alert'] ?? (delayedRepairs > 5));
    const activeSubs = Number(rawKpis['active_subscriptions_count'] ?? rawKpis['active_students'] ?? 0);
    const academyRev = Number(rawKpis['academy_revenue'] ?? 0);

    const critItems = Array.isArray(rawAlerts['critical_stock_items'])
      ? (rawAlerts['critical_stock_items'] as CriticalStockItem[])
      : [];

    const critStockCount = Number(rawKpis['critical_stock_count'] ?? rawAlerts['critical_stock_count'] ?? critItems.length);

    const overdueRepairs = Array.isArray(rawAlerts['overdue_pickup_repairs'])
      ? (rawAlerts['overdue_pickup_repairs'] as any[]).map((r) => ({
          id: r.id || '',
          tracking_code: r.tracking_code || r.repair_number || 'S/N',
          client_name: r.client_name || r.customer_name || 'Cliente',
          ready_since: r.ready_since || r.completed_at || '',
          hours_waiting: Number(r.hours_waiting !== undefined ? r.hours_waiting : (Number(r.days_waiting || 0) * 24)),
          final_cost: Number(r.final_cost || 0)
        }))
      : [];

    const expiringSubs = Array.isArray(rawAlerts['expiring_grace_subscriptions'])
      ? (rawAlerts['expiring_grace_subscriptions'] as any[]).map((s) => ({
          id: s.id || '',
          user_email: s.user_email || s.student_email || s.email || '',
          student_name: s.student_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Alumno',
          grace_period_ends_at: s.grace_period_ends_at || s.grace_period_until || '',
          days_left: Number(s.days_left || 0)
        }))
      : [];

    let trend6Months: TrendMonth[] = [];
    const rawTrend = rawCharts['trend_6_months'] || rawObj['trend'] || rawObj['charts'];
    if (Array.isArray(rawTrend)) {
      trend6Months = (rawTrend as any[]).map((t) => ({
        period: String(t.period || t.month || ''),
        label: String(t.label || t.period || t.month || ''),
        income: Number(t.income || 0),
        expense: Number(t.expense || 0),
        net_balance: Number(t.net_balance !== undefined ? t.net_balance : (Number(t.income || 0) - Number(t.expense || 0)))
      }));
    }

    const rawOrigin = (rawCharts['revenue_by_origin'] || rawObj['revenue_by_origin'] || {}) as Record<string, unknown>;

    return {
      period: {
        range: (rawPeriod['range'] as 'today' | '7days' | 'month' | 'year' | 'custom') || range,
        start_date: String(rawPeriod['start_date'] || new Date().toISOString()),
        end_date: String(rawPeriod['end_date'] || new Date().toISOString())
      },
      kpis: {
        total_income: isNaN(totalIncome) ? 0 : totalIncome,
        total_expense: isNaN(totalExpense) ? 0 : totalExpense,
        net_balance: isNaN(netBalance) ? 0 : netBalance,
        ecommerce_orders_count: isNaN(ecommerceCount) ? 0 : ecommerceCount,
        ecommerce_amount: isNaN(ecommerceAmount) ? 0 : ecommerceAmount,
        active_repairs_count: isNaN(activeRepairs) ? 0 : activeRepairs,
        delayed_repairs_count: isNaN(delayedRepairs) ? 0 : delayedRepairs,
        has_delayed_alert: hasDelayedAlert,
        active_subscriptions_count: isNaN(activeSubs) ? 0 : activeSubs,
        academy_revenue: isNaN(academyRev) ? 0 : academyRev,
        critical_stock_count: isNaN(critStockCount) ? 0 : critStockCount
      },
      alerts: {
        critical_stock_items: critItems,
        overdue_pickup_repairs: overdueRepairs,
        expiring_grace_subscriptions: expiringSubs
      },
      charts: {
        trend_6_months: trend6Months,
        revenue_by_origin: {
          ecommerce: Number(rawOrigin['ecommerce'] ?? 0),
          repairs: Number(rawOrigin['repairs'] ?? 0),
          academy: Number(rawOrigin['academy'] ?? 0)
        }
      }
    };
  }

  loadBusinessMetrics(range?: 'today' | '7days' | 'month' | 'year', branchId?: string, simulateFailure?: string) {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading.set(false);
      return;
    }

    const targetRange = range || this.selectedRange();
    this.isLoading.set(true);
    this.error.set(null);

    const activeBranchId = branchId !== undefined ? branchId : this.branchContextService.currentBranchId();

    this.businessDashboardService.getMetrics(targetRange, activeBranchId || undefined, simulateFailure).pipe(
      finalize(() => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (res) => {
        // Fallback if null, undefined or empty object {}
        if (!res || (typeof res === 'object' && Object.keys(res).length === 0)) {
          this.error.set(null);
          const safeData = this.sanitizeData(null, targetRange);
          this.dashboardData.set(safeData);
          this.prepareBusinessCharts(safeData);
          return;
        }

        // Check if backend returned structured failure
        if (res.success === false && res.error) {
          this.error.set(res.error);
          const safeData = this.sanitizeData(res.data, targetRange);
          this.dashboardData.set(safeData);
          return;
        }

        this.error.set(null);
        const safeData = this.sanitizeData(res.data ?? (res.kpis ? res : null), targetRange);
        this.dashboardData.set(safeData);
        this.partialErrors.set(res.partialErrors || null);
        this.prepareBusinessCharts(safeData);
      },
      error: (err) => {
        console.error('Error loading business metrics:', err);
        const errMsg = err?.error?.error || err?.message || 'Error de conexión con el servidor al cargar las métricas.';
        this.error.set(errMsg);
        const safeData = this.sanitizeData(null, targetRange);
        this.dashboardData.set(safeData);
      }
    });
  }

  prepareBusinessCharts(data: BusinessDashboardData) {
    // 1. Trend 6 Months (Ingresos vs Egresos)
    const trend = data.charts?.trend_6_months || [];
    if (trend.length > 0) {
      this.trendChartData = {
        labels: trend.map((t) => t.label || t.period),
        datasets: [
          {
            data: trend.map((t) => t.income),
            label: 'Ingresos',
            backgroundColor: '#1e40af', // Brand Navy Blue
            borderRadius: 6
          },
          {
            data: trend.map((t) => t.expense),
            label: 'Egresos',
            backgroundColor: '#f97316', // Brand Orange
            borderRadius: 6
          }
        ]
      };
    } else {
      this.trendChartData = undefined;
    }

    // 2. Revenue Origin (E-commerce, Reparaciones, Academia)
    const origin = data.charts?.revenue_by_origin;
    if (origin) {
      this.revenueOriginChartData = {
        labels: ['E-commerce', 'Reparaciones', 'Academia'],
        datasets: [
          {
            data: [
              Number(origin.ecommerce || 0),
              Number(origin.repairs || 0),
              Number(origin.academy || 0)
            ],
            backgroundColor: ['#2563eb', '#f59e0b', '#10b981'],
            hoverBackgroundColor: ['#1d4ed8', '#d97706', '#059669'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      };
    } else {
      this.revenueOriginChartData = undefined;
    }
  }

  onRangeChange(range: 'today' | '7days' | 'month' | 'year') {
    this.selectedRange.set(range);
    const branchId = this.branchContextService.currentBranchId();
    this.loadBusinessMetrics(range, branchId || undefined);
    this.loadAnalytics(range, branchId || undefined);
  }

  setActiveViewTab(tab: 'general' | 'products' | 'customers' | 'repairs' | 'health') {
    this.activeViewTab.set(tab);
    if ((tab === 'products' || tab === 'customers' || tab === 'repairs') && !this.analyticsData()) {
      this.loadAnalytics();
    } else if (tab === 'health' && !this.dbHealthData()) {
      this.loadDatabaseHealth();
    }
  }

  loadAnalytics(range?: 'today' | '7days' | 'month' | 'year', branchId?: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const targetRange = range || this.selectedRange();
    const activeBranchId = branchId !== undefined ? branchId : this.branchContextService.currentBranchId();
    this.loadingAnalytics.set(true);
    this.analyticsError.set(null);

    this.businessDashboardService.getAnalytics(targetRange, activeBranchId || undefined).pipe(
      finalize(() => {
        this.loadingAnalytics.set(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (res) => {
        if (res?.data) {
          this.analyticsData.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.analyticsError.set('Error al cargar datos analíticos.');
      }
    });
  }

  loadDatabaseHealth() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadingDbHealth.set(true);
    this.dbHealthError.set(null);

    this.businessDashboardService.getDatabaseHealth().pipe(
      finalize(() => {
        this.loadingDbHealth.set(false);
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (res) => {
        if (res?.data) {
          this.dbHealthData.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading db health:', err);
        this.dbHealthError.set('Error al verificar estado de la base de datos.');
      }
    });
  }


  dismissPartialError(key: string) {
    this.partialErrors.update((curr) => {
      if (!curr) return null;
      const next = { ...curr };
      delete next[key];
      return Object.keys(next).length > 0 ? next : null;
    });
  }

  async loadBranches() {
    try {
      const data = await this.branchService.getAllAdminBranches();
      this.branches.set(data || []);
    } catch (e) {
      console.error('Error loading branches:', e);
    }
  }

  async loadStats(branchId?: string) {
    this.loadStats$.next(branchId);
    this.loadBusinessMetrics(this.selectedRange(), branchId);
  }

  forceRetryStats() {
    this.loading.set(false);
    const branchId = this.branchContextService.currentBranchId();
    this.loadStats$.next(branchId || undefined);
    this.loadBusinessMetrics(this.selectedRange(), branchId || undefined);
  }

  async loadPendingProductsCount() {
    try {
      const products = await this.adminProductService.getPendingApprovals();
      this.pendingProductsCount.set(products?.length || 0);
    } catch (e) {
      console.error('Error loading pending products:', e);
    }
  }

  onBranchChange(event: any) {
    const branchId = event.target.value;
    const realBranchId = branchId === 'global' ? null : branchId;
    this.branchService.setBranchById(realBranchId);
  }

  onPeriodChange(event: any) {
    this.selectedPeriod.set(event.target.value);
  }

  goToBranch(branchId?: string) {
    if (!branchId) return;
    const realBranchId = branchId === 'global' ? null : branchId;
    this.branchService.setBranchById(realBranchId);
  }

  private prepareLegacyCharts(stats: DashboardStats) {
    if (stats.sales_chart?.length > 0) {
      this.salesChartData = {
        labels: stats.sales_chart.map((s) => s.period),
        datasets: [
          {
            data: stats.sales_chart.map((s) => s.total),
            label: 'Ventas',
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primaryLight,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      };
    } else {
      this.salesChartData = undefined;
    }
  }

  posthogStatus(): string {
    return this.analyticsStats().enabled ? 'Activo' : 'Inactivo';
  }

  formatCurrency(amount: number): string {
    return NumberUtils.formatCurrency(amount);
  }

  downloadMonthlyPDF(month: MonthlyRevenue): void {
    this.reportService.downloadMonthlyPDF(month);
  }

  downloadTotalPDF(): void {
    this.reportService.downloadTotalPDF(this.stats(), this.totalProfitMargin());
  }

  downloadCSV(): void {
    this.reportService.downloadCSV(this.stats(), this.totalProfitMargin());
  }

  openFinanceModal() {
    this.financeForm.set({
      type: 'expense',
      amount: 0,
      category: 'gasto_fijo',
      payment_method: 'cash',
      notes: '',
    });
    this.showFinanceModal.set(true);
  }

  changeFinanceType(type: 'income' | 'expense') {
    this.financeForm.update((form) => ({
      ...form,
      type,
      category: type === 'income' ? 'sale' : 'gasto_fijo',
    }));
  }

  updateFinanceField(field: string, value: any) {
    this.financeForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  async saveManualMovement() {
    const form = this.financeForm();
    if (!form.amount || form.amount <= 0) {
      this.notificationService.showError('El monto debe ser mayor que 0');
      return;
    }

    this.savingFinance.set(true);
    try {
      const activeBranchId = this.branchContextService.currentBranchId();

      const payload = {
        amount: form.amount,
        type: form.type,
        category: form.category,
        payment_method: form.payment_method,
        notes: form.notes || null,
        branch_id: activeBranchId || null,
      };

      await this.financeService.recordMovement(payload as any);
      this.notificationService.showSuccess('¡Movimiento financiero registrado!');
      this.showFinanceModal.set(false);

      this.loadStats$.next(activeBranchId || undefined);
      this.loadBusinessMetrics(this.selectedRange(), activeBranchId || undefined);
    } catch (e: any) {
      console.error('Error saving manual finance movement:', e);
      this.notificationService.showError('Error al guardar: ' + e.message);
    } finally {
      this.savingFinance.set(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
