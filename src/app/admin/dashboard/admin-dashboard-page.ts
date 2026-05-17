import { Component, inject, OnInit, OnDestroy, signal, computed, effect, DestroyRef } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, catchError, takeUntil } from 'rxjs/operators';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsRepository, DashboardStats, MonthlyRevenue } from '@app/features/analytics/domain/repositories/analytics.repository';
import { CHART_COLORS } from './constants/chart-colors.constant';
import { AuthService } from '@app/core/services/auth.service';
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

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective, SkeletonComponent, FormsModule],
  templateUrl: './admin-dashboard-page.html',
  providers: [provideCharts(withDefaultRegisterables())]
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private analyticsRepo = inject(AnalyticsRepository);
  private analyticsService = inject(AnalyticsService);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private adminProductService = inject(AdminProductService);
  private reportService = inject(FinanceReportService);
  private router = inject(Router);
  private financeService = inject(FinanceService);
  private notificationService = inject(NotificationService);

  showFinanceModal = signal(false);
  financeForm = signal({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    category: 'gasto_fijo' as any,
    payment_method: 'cash',
    notes: ''
  });
  savingFinance = signal(false);

  availableCategories = computed(() => {
    const type = this.financeForm().type;
    if (type === 'income') {
      return [
        { value: 'sale', label: '🛒 Ventas de Tienda' },
        { value: 'repair', label: '🛠️ Reparación / Taller' },
        { value: 'sueldo_externo', label: '💼 Inyección Capital / Sueldo Externo' },
        { value: 'beca', label: '🎓 Becas / Subsidios' },
        { value: 'adjustment', label: '📊 Ajuste de Caja (Ingreso)' },
        { value: 'otros', label: '➕ Otros Ingresos' }
      ];
    } else {
      return [
        { value: 'purchase', label: '📦 Compra de Repuestos / Insumos' },
        { value: 'gasto_fijo', label: '🏠 Gastos Fijos (Alquiler, Luz, Internet)' },
        { value: 'gasto_hormiga', label: '☕ Gastos Hormiga (Café, Limpieza)' },
        { value: 'inversion', label: '📈 Inversión (Herramientas, Marketing)' },
        { value: 'draw', label: '💸 Retiro de Socios / Socias' },
        { value: 'adjustment', label: '📊 Ajuste de Caja (Egreso)' },
        { value: 'otros', label: '➖ Otros Egresos' }
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
    profit_chart: []
  });

  totalProfitMargin = computed(() => {
    return NumberUtils.calculateMargin(this.stats().total_gross_revenue, this.stats().total_net_profit);
  });

  selectedPeriod = signal<string>(this.getCurrentPeriod());

  selectedMonthData = computed(() => {
    const period = this.selectedPeriod();
    const breakdown = this.stats().monthly_breakdown || [];
    return breakdown.find(m => m.period === period) || {
      period: period,
      label: 'Mes Seleccionado',
      gross_revenue: 0,
      cost: 0,
      net_profit: 0,
      repairs_revenue: 0,
      sales_revenue: 0,
      repairs_cost: 0,
      sales_cost: 0
    } as MonthlyRevenue;
  });

  selectedMonthGross = computed(() => this.selectedMonthData().gross_revenue);
  selectedMonthCost = computed(() => this.selectedMonthData().cost);
  selectedMonthProfit = computed(() => this.selectedMonthData().net_profit);

  currentMonthMargin = computed(() => {
    return NumberUtils.calculateMargin(this.selectedMonthGross(), this.selectedMonthProfit());
  });

  private getCurrentPeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  analyticsStats = signal({
    enabled: false,
    sessionId: '',
    distinctId: '',
    eventsCount: 0
  });

  loading = signal(true);
  isSuperAdmin = signal(false);
  pendingProductsCount = signal(0);
  
  private branchService = inject(BranchService);

  // Branches for SuperAdmin
  branches = signal<Branch[]>([]);

  // Chart Properties
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
      }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9ca3af' } }
    }
  };

  public productsChartData?: ChartData<'bar'>;
  public productsChartType: ChartType = 'bar';
  public productsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } }
    }
  };

  public categoryChartData?: ChartData<'doughnut'>;
  public categoryChartType: ChartType = 'doughnut';
  public categoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20, font: { size: 11 } } } },
    // @ts-ignore
    cutout: '70%'
  };

  private branchContextService = inject(BranchContextService);
  private loadStats$ = new Subject<string | undefined>();

  constructor() {
    // Escudo RxJS contra Race Conditions y Fugas de Memoria
    this.loadStats$.pipe(
      switchMap(branchId => {
        this.loading.set(true);
        return this.analyticsRepo.getDashboardStats(branchId).pipe(
          catchError(err => {
            console.error('Error loading dashboard stats:', err);
            this.loading.set(false);
            return [];
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((stats: any) => {
      if (stats && !Array.isArray(stats)) {
        this.stats.set(stats);
        this.prepareCharts(stats);
      }
      this.loading.set(false);
    });

    // React to branch changes globally
    effect(() => {
      const branchId = this.branchContextService.currentBranchId();
      this.loadStats$.next(branchId || undefined);
    });
  }

  async ngOnInit() {
    this.isSuperAdmin.set(this.authService.isSuperAdmin());
    
    if (this.isSuperAdmin()) {
      await this.loadBranches();
    }

    // Initial load happens via the effect above

    await this.loadPendingProductsCount();
    
    // Analytics monitor
    this.analyticsStats.set({
      enabled: this.analyticsService.isEnabled(),
      sessionId: this.analyticsService.getSessionId() || 'N/A',
      distinctId: (this.analyticsService as any).getDistinctId?.() || 'N/A',
      eventsCount: 0
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
    this.branchContextService.setBranchId(realBranchId);
  }

  onPeriodChange(event: any) {
    this.selectedPeriod.set(event.target.value);
  }

  goToBranch(branchId?: string) {
    if (!branchId) return;
    const realBranchId = branchId === 'global' ? null : branchId;
    this.branchContextService.setBranchId(realBranchId);
  }

  private prepareCharts(stats: DashboardStats) {
    // Sales Chart
    if (stats.sales_chart?.length > 0) {
      this.salesChartData = {
        labels: stats.sales_chart.map(s => s.period),
        datasets: [{
          data: stats.sales_chart.map(s => s.total),
          label: 'Ventas',
          borderColor: CHART_COLORS.primary,
          backgroundColor: CHART_COLORS.primaryLight,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      };
    }

    // Category Chart
    if (stats.category_chart?.length > 0) {
      this.categoryChartData = {
        labels: stats.category_chart.map(c => c.name),
        datasets: [{
          data: stats.category_chart.map(c => c.count),
          backgroundColor: [
            CHART_COLORS.primary,
            CHART_COLORS.success,
            CHART_COLORS.warning,
            CHART_COLORS.error,
            CHART_COLORS.info
          ]
        }]
      };
    }

    // Products Chart
    if (stats.products_chart?.length > 0) {
      this.productsChartData = {
        labels: stats.products_chart.map(p => p.name),
        datasets: [{
          data: stats.products_chart.map(p => p.quantity),
          label: 'Unidades',
          backgroundColor: CHART_COLORS.primary,
          borderRadius: 8
        }]
      };
    }
  }

  posthogStatus(): string {
    return this.analyticsStats().enabled ? 'Activo' : 'Inactivo';
  }

  formatCurrency(amount: number): string {
    return NumberUtils.formatCurrency(amount);
  }

  // ── Report Generation (Delegated to Service) ──────────────────────────
  downloadMonthlyPDF(month: MonthlyRevenue): void {
    this.reportService.downloadMonthlyPDF(month);
  }

  downloadTotalPDF(): void {
    this.reportService.downloadTotalPDF(this.stats(), this.totalProfitMargin());
  }

  downloadCSV(): void {
    this.reportService.downloadCSV(this.stats(), this.totalProfitMargin());
  }

  // ── Inteligencia Financiera Personal: Registro Manual de Ingresos/Gastos ──
  openFinanceModal() {
    this.financeForm.set({
      type: 'expense',
      amount: 0,
      category: 'gasto_fijo',
      payment_method: 'cash',
      notes: ''
    });
    this.showFinanceModal.set(true);
  }

  changeFinanceType(type: 'income' | 'expense') {
    this.financeForm.update(form => ({
      ...form,
      type,
      category: type === 'income' ? 'sale' : 'gasto_fijo'
    }));
  }

  updateFinanceField(field: string, value: any) {
    this.financeForm.update(form => ({
      ...form,
      [field]: value
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
        branch_id: activeBranchId || null
      };

      await this.financeService.recordMovement(payload as any);
      this.notificationService.showSuccess('¡Movimiento financiero registrado!');
      this.showFinanceModal.set(false);
      
      // Forzar recarga del dashboard
      this.loadStats$.next(activeBranchId || undefined);
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
