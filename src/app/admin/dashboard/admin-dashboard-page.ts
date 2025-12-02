import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { RouterLink } from '@angular/router';
import posthog from 'posthog-js';
import { environment } from '@env/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: 'admin-dashboard-page.html'
})
export class AdminDashboardPage implements OnInit {
  private auth = inject(AuthService);

  stats = signal({
    users: 0,
    products: 0,
    sales: 0,
    revenue: 0
  });

  analyticsStats = signal({
    enabled: false,
    sessionId: '',
    distinctId: '',
  });

  loading = signal(true);

  // Sales over the Year Chart
  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'Ventas del Año' }
    }
  };
  public salesChartType: ChartType = 'line';
  public salesChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40, 70, 90, 100, 110, 120], label: 'Ventas ($)', borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.2)', fill: true },
    ]
  };

  // Top Products Chart
  public productsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Productos Más Vendidos' }
    }
  };
  public productsChartType: ChartType = 'bar';
  public productsChartData: ChartData<'bar'> = {
    labels: ['iPhone 11', 'Samsung A52', 'Modulo iPhone X', 'Cargador 20W', 'Funda Silicona'],
    datasets: [
      { data: [28, 48, 40, 19, 86], label: 'Unidades', backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'] }
    ]
  };

  // Sales by Category Chart
  public categoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
      title: { display: true, text: 'Ventas por Categoría' }
    }
  };
  public categoryChartType: ChartType = 'doughnut';
  public categoryChartData: ChartData<'doughnut'> = {
    labels: ['Repuestos', 'Accesorios', 'Servicios', 'Cursos'],
    datasets: [
      { data: [300, 500, 100, 50], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }
    ]
  };

  async ngOnInit() {
    await this.loadStats();
    this.loadAnalyticsInfo();
  }

  async loadStats() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();

    try {
      // Users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Sales count and revenue
      const { data: salesData } = await supabase
        .from('sales')
        .select('total_amount, created_at');

      const salesCount = salesData?.length || 0;
      const revenue = salesData?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

      this.stats.set({
        users: usersCount || 0,
        products: productsCount || 0,
        sales: salesCount,
        revenue: revenue
      });

      // TODO: Process real data for charts here
      // For now, we use the mock data defined in properties

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      this.loading.set(false);
    }
  }

  loadAnalyticsInfo() {
    try {
      // Check if PostHog is initialized
      const isEnabled = environment.posthogKey && environment.posthogKey !== '';

      if (isEnabled && posthog) {
        this.analyticsStats.set({
          enabled: true,
          sessionId: posthog.get_session_id() || '',
          distinctId: posthog.get_distinct_id() || 'Anónimo',
        });
      } else {
        this.analyticsStats.set({
          enabled: false,
          sessionId: '',
          distinctId: '',
        });
      }
    } catch (error) {
      console.error('Error loading analytics info:', error);
      this.analyticsStats.set({
        enabled: false,
        sessionId: '',
        distinctId: '',
      });
    }
  }

  posthogStatus(): string {
    return this.analyticsStats().enabled ? 'Activo' : 'Inactivo';
  }
}
