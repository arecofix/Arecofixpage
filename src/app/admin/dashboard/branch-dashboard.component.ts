import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { CHART_COLORS } from './constants/chart-colors.constant';
import { TenantIsolatedDashboardService, TenantDashboardStats } from './services/tenant-isolated-dashboard.service';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/shared/services/tenant.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-branch-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './branch-dashboard.component.html',
  styleUrls: ['./branch-dashboard.component.scss']
})
export class BranchDashboardComponent implements OnInit {
  private dashboardService = inject(TenantIsolatedDashboardService);
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals para el estado reactivo
  stats = signal<TenantDashboardStats>({
    users: 0,
    products: 0,
    sales: 0,
    revenue: 0,
    repairs_month: 0,
    repairs_revenue: 0,
    devices_fixed: 0,
    pending_approvals: 0, // Agregada propiedad faltante
    sales_chart: [],
    products_chart: [],
    category_chart: [],
    tenantId: '',
    isBranchAdmin: false,
    branchName: ''
  });

  loading = signal(true);
  error = signal<string | null>(null);

  // Computed properties para permisos
  isSuperAdmin = computed(() => this.authService.isSuperAdmin());
  isBranchAdmin = computed(() => this.stats().isBranchAdmin);
  canViewGlobalStats = computed(() => this.dashboardService.canViewGlobalStats());
  canViewOtherBranches = computed(() => this.dashboardService.canViewOtherBranches());
  currentBranchId = computed(() => this.dashboardService.getCurrentUserBranchId());

  // Información de la sucursal actual
  branchInfo = computed(() => {
    const stats = this.stats();
    return {
      name: stats.branchName || 'Sucursal',
      id: stats.branchId || '',
      tenantId: stats.tenantId
    };
  });

  // Configuración de gráficos
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Ventas del Año' }
    }
  };

  salesChartType: ChartType = 'line';
  salesChartData = signal<ChartData<'line'>>({
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Ventas ($)', 
        borderColor: CHART_COLORS.primary, 
        backgroundColor: CHART_COLORS.primaryTransparent, 
        fill: true 
      },
    ]
  });

  productsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Productos Más Vendidos' }
    }
  };

  productsChartType: ChartType = 'bar';
  productsChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Unidades', 
        backgroundColor: CHART_COLORS.palette
      }
    ]
  });

  categoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      title: { display: true, text: 'Ventas por Categoría' }
    }
  };

  categoryChartType: ChartType = 'doughnut';
  categoryChartData = signal<ChartData<'doughnut'>>({
    labels: [],
    datasets: [
      { data: [], backgroundColor: CHART_COLORS.paletteAlt }
    ]
  });

  async ngOnInit() {
    await this.validateAccess();
    this.loadDashboardStats();
  }

  /**
   * Valida que el usuario tenga acceso a este dashboard
   */
  private async validateAccess(): Promise<void> {
    const branchSlug = this.route.snapshot.paramMap.get('branch-slug');
    const currentProfile = this.authService.getCurrentProfile();
    
    if (!currentProfile) {
      this.router.navigate(['/login']);
      return;
    }

    // Si es Super Admin, puede acceder a cualquier sucursal
    if (this.authService.isSuperAdmin()) {
      return;
    }

    // Si es Branch Admin, solo puede acceder a su propia sucursal
    if (branchSlug && currentProfile.branch_id !== branchSlug) {
      console.error('Acceso denegado: El usuario no tiene permiso para acceder a esta sucursal');
      this.router.navigate(['/unauthorized']);
      return;
    }
  }

  /**
   * Carga las estadísticas del dashboard
   */
  private loadDashboardStats(): void {
    this.loading.set(true);
    this.error.set(null);

    const branchSlug = this.route.snapshot.paramMap.get('branch-slug');
    
    this.dashboardService.getDashboardStats(branchSlug || undefined).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.updateCharts(stats);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error.set('No se pudieron cargar las estadísticas. Por favor, intente nuevamente.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Actualiza los gráficos con los datos recibidos
   */
  private updateCharts(stats: TenantDashboardStats): void {
    // Actualizar gráfico de ventas
    if (stats.sales_chart && stats.sales_chart.length > 0) {
      const months = stats.sales_chart.map(d => this.formatMonth(d.period));
      const totals = stats.sales_chart.map(d => d.total);
      
      this.salesChartData.set({
        labels: months,
        datasets: [
          { 
            data: totals, 
            label: 'Ventas ($)', 
            borderColor: CHART_COLORS.primary, 
            backgroundColor: CHART_COLORS.primaryTransparent, 
            fill: true 
          }
        ]
      });
    }

    // Actualizar gráfico de productos
    if (stats.products_chart && stats.products_chart.length > 0) {
      const productNames = stats.products_chart.map(d => d.name);
      const quantities = stats.products_chart.map(d => d.quantity);

      this.productsChartData.set({
        labels: productNames,
        datasets: [
          { 
            data: quantities, 
            label: 'Unidades', 
            backgroundColor: CHART_COLORS.palette 
          }
        ]
      });
    }

    // Actualizar gráfico de categorías
    if (stats.category_chart && stats.category_chart.length > 0) {
      const catNames = stats.category_chart.map(d => d.name);
      const catCounts = stats.category_chart.map(d => d.count);

      this.categoryChartData.set({
        labels: catNames,
        datasets: [
          { 
            data: catCounts, 
            backgroundColor: CHART_COLORS.paletteAlt
          }
        ]
      });
    }
  }

  /**
   * Formatea el mes para mostrar en los gráficos
   */
  private formatMonth(yearMonth: string): string {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'short' });
  }

  /**
   * Recarga las estadísticas
   */
  refreshStats(): void {
    this.loadDashboardStats();
  }

  /**
   * Navega a la gestión de productos de la sucursal
   */
  goToProducts(): void {
    const branchSlug = this.route.snapshot.paramMap.get('branch-slug');
    if (branchSlug) {
      this.router.navigate([`/${branchSlug}/admin/products`]);
    }
  }

  /**
   * Navega a la gestión de órdenes de la sucursal
   */
  goToOrders(): void {
    const branchSlug = this.route.snapshot.paramMap.get('branch-slug');
    if (branchSlug) {
      this.router.navigate([`/${branchSlug}/admin/orders`]);
    }
  }

  /**
   * Navega a la configuración de la sucursal
   */
  goToSettings(): void {
    const branchSlug = this.route.snapshot.paramMap.get('branch-slug');
    if (branchSlug) {
      this.router.navigate([`/${branchSlug}/admin/settings`]);
    }
  }

  /**
   * Formatea valores monetarios
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Obtiene el color según el estado de las estadísticas
   */
  getStatColor(value: number, threshold: number = 0): string {
    if (value === 0) return 'text-gray-500';
    if (value < threshold) return 'text-yellow-600';
    return 'text-green-600';
  }

  /**
   * Verifica si hay datos para mostrar
   */
  hasData(): boolean {
    const s = this.stats();
    return s.users > 0 || s.products > 0 || s.sales > 0 || s.revenue > 0;
  }

  /**
   * Obtiene mensaje según el rol y los datos
   */
  getDashboardMessage(): string {
    const s = this.stats();
    
    if (this.isBranchAdmin()) {
      if (!this.hasData()) {
        return `Bienvenido a ${s.branchName}. Aún no tienes ventas o productos registrados.`;
      }
      return `Estadísticas de ${s.branchName}`;
    }
    
    if (this.isSuperAdmin()) {
      return s.branchId ? `Viendo estadísticas de: ${s.branchName}` : 'Estadísticas Globales';
    }
    
    return 'Panel de Administración';
  }
}
