import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/services/auth.service';
import { RouterLink } from '@angular/router';
import posthog from 'posthog-js';
import { environment } from '@env/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { CHART_COLORS } from './constants/chart-colors.constant';

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
      { 
        data: [65, 59, 80, 81, 56, 55, 40, 70, 90, 100, 110, 120], 
        label: 'Ventas ($)', 
        borderColor: CHART_COLORS.primary, 
        backgroundColor: CHART_COLORS.primaryTransparent, 
        fill: true 
      },
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
      { 
        data: [28, 48, 40, 19, 86], 
        label: 'Unidades', 
        backgroundColor: CHART_COLORS.palette
      }
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
      { data: [300, 500, 100, 50], backgroundColor: CHART_COLORS.paletteAlt }
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
      const { data, error } = await supabase.rpc('get_dashboard_stats');

      if (error) throw error;

      if (data) {
        // Update Summary Stats
        this.stats.set({
          users: data.users || 0,
          products: data.products || 0,
          sales: data.sales || 0,
          revenue: data.revenue || 0
        });

        // Update Sales Chart (Line)
        if (data.sales_chart && data.sales_chart.length > 0) {
            const months = data.sales_chart.map((d: any) => this.formatMonth(d.period));
            const totals = data.sales_chart.map((d: any) => d.total);
            
            this.salesChartData = {
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
            };
        }

        // Update Products Chart (Bar)
        if (data.products_chart && data.products_chart.length > 0) {
            const productNames = data.products_chart.map((d: any) => d.name);
            const quantities = data.products_chart.map((d: any) => d.quantity);

            this.productsChartData = {
                labels: productNames,
                datasets: [
                    { 
                        data: quantities, 
                        label: 'Unidades', 
                        backgroundColor: CHART_COLORS.palette 
                    }
                ]
            };
        }

        // Update Category Chart (Doughnut)
        if (data.category_chart && data.category_chart.length > 0) {
            const catNames = data.category_chart.map((d: any) => d.name);
            const catCounts = data.category_chart.map((d: any) => d.count);

            this.categoryChartData = {
                labels: catNames,
                datasets: [
                    { 
                        data: catCounts, 
                        backgroundColor: CHART_COLORS.paletteAlt
                    }
                ]
            };
        }
      }

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private formatMonth(yearMonth: string): string {
      const [year, month] = yearMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('es-ES', { month: 'short' }); // e.g. "ene", "feb"
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
