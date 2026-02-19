import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import posthog from 'posthog-js';
import { environment } from '@env/environment';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsRepository, DashboardStats } from '@app/features/analytics/domain/repositories/analytics.repository';
import { CHART_COLORS } from './constants/chart-colors.constant';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: 'admin-dashboard-page.html'
})
export class AdminDashboardPage implements OnInit {
  private analyticsRepo = inject(AnalyticsRepository);

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
    labels: [],
    datasets: [
      { 
        data: [], 
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
    labels: [],
    datasets: [
      { data: [], backgroundColor: CHART_COLORS.paletteAlt }
    ]
  };

  ngOnInit() {
    this.loadStats();
    this.loadAnalyticsInfo();
  }

  loadStats() {
    this.loading.set(true);
    
    this.analyticsRepo.getDashboardStats().subscribe({
      next: (data) => {
        // Update Summary Stats
        this.stats.set({
          users: data.users,
          products: data.products,
          sales: data.sales,
          revenue: data.revenue
        });

        // Update Sales Chart (Line)
        if (data.sales_chart && data.sales_chart.length > 0) {
            const months = data.sales_chart.map(d => this.formatMonth(d.period));
            const totals = data.sales_chart.map(d => d.total);
            
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
            const productNames = data.products_chart.map(d => d.name);
            const quantities = data.products_chart.map(d => d.quantity);

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
            const catNames = data.category_chart.map(d => d.name);
            const catCounts = data.category_chart.map(d => d.count);

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
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading.set(false);
      }
    });
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
