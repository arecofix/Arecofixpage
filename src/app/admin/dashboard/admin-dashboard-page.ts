import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';
import { RouterLink } from '@angular/router';
import posthog from 'posthog-js';
import { environment } from '@env/environment';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Panel de Control</h1>
      
      @if (loading()) {
        <div class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Users Card -->
            <div class="stats shadow bg-white text-gray-800">
                <div class="stat">
                    <div class="stat-figure text-primary">
                        <i class="fas fa-users text-3xl"></i>
                    </div>
                    <div class="stat-title text-gray-600">Usuarios</div>
                    <div class="stat-value text-primary">{{ stats().users }}</div>
                    <div class="stat-desc text-gray-500">Registrados</div>
                </div>
            </div>

            <!-- Products Card -->
            <div class="stats shadow bg-white text-gray-800">
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <i class="fas fa-box text-3xl"></i>
                    </div>
                    <div class="stat-title text-gray-600">Productos</div>
                    <div class="stat-value text-secondary">{{ stats().products }}</div>
                    <div class="stat-desc text-gray-500">En catálogo</div>
                </div>
            </div>

            <!-- Sales Card -->
            <div class="stats shadow bg-white text-gray-800">
                <div class="stat">
                    <div class="stat-figure text-accent">
                        <i class="fas fa-shopping-cart text-3xl"></i>
                    </div>
                    <div class="stat-title text-gray-600">Ventas</div>
                    <div class="stat-value text-accent">{{ stats().sales }}</div>
                    <div class="stat-desc text-gray-500">Total realizadas</div>
                </div>
            </div>

            <!-- Revenue Card -->
            <div class="stats shadow bg-white text-gray-800">
                <div class="stat">
                    <div class="stat-figure text-success">
                        <i class="fas fa-dollar-sign text-3xl"></i>
                    </div>
                    <div class="stat-title text-gray-600">Ingresos</div>
                    <div class="stat-value text-success">{{ stats().revenue | currency }}</div>
                    <div class="stat-desc text-gray-500">Total facturado</div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Quick Actions -->
            <div class="card bg-white shadow text-gray-800">
                <div class="card-body">
                    <h2 class="card-title mb-4 text-gray-800">Acciones Rápidas</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <a routerLink="/admin/products/new" class="btn btn-outline btn-primary">
                            <i class="fas fa-plus mr-2"></i> Nuevo Producto
                        </a>
                        <a routerLink="/admin/sales" class="btn btn-outline btn-accent">
                            <i class="fas fa-cash-register mr-2"></i> Nueva Venta
                        </a>
                        <a routerLink="/admin/users" class="btn btn-outline">
                            <i class="fas fa-user-plus mr-2"></i> Gestionar Usuarios
                        </a>
                        <a routerLink="/admin/repairs" class="btn btn-outline btn-secondary">
                            <i class="fas fa-tools mr-2"></i> Taller
                        </a>
                    </div>
                </div>
            </div>

            <!-- Analytics & System Status -->
            <div class="card bg-white shadow text-gray-800">
                <div class="card-body">
                    <h2 class="card-title mb-4 text-gray-800">Analytics & Sistema</h2>
                    <div class="space-y-4">
                        <!-- System Status -->
                        <div class="flex justify-between items-center">
                            <span class="text-gray-700">Base de Datos</span>
                            <span class="badge badge-success">Conectado</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-700">Analytics (PostHog)</span>
                            <span class="badge badge-success">{{ posthogStatus() }}</span>
                        </div>
                        
                        <!-- PostHog Metrics -->
                        @if (analyticsStats().enabled) {
                          <div class="divider my-2"></div>
                          <div class="space-y-3">
                            <div class="flex justify-between items-center text-sm">
                              <span class="flex items-center gap-2">
                                <i class="fas fa-eye text-info"></i>
                                <span>Sesión Actual</span>
                              </span>
                              <span class="font-semibold">{{ analyticsStats().sessionId ? 'Activa' : 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                              <span class="flex items-center gap-2">
                                <i class="fas fa-user text-primary"></i>
                                <span>Usuario</span>
                              </span>
                              <span class="font-semibold text-xs">{{ analyticsStats().distinctId || 'Anónimo' }}</span>
                            </div>
                            <a 
                              href="https://us.posthog.com/project/253677/dashboard/791256" 
                              target="_blank" 
                              class="btn btn-sm btn-outline btn-info w-full mt-2"
                            >
                              <i class="fas fa-chart-line mr-2"></i>
                              Ver Dashboard Completo
                            </a>
                          </div>
                        } @else {
                          <div class="alert alert-warning text-xs mt-4">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>PostHog no está inicializado correctamente</span>
                          </div>
                        }
                    </div>
                </div>
            </div>
        </div>
      }
    </div>
  `
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
        .select('total_amount');

      const salesCount = salesData?.length || 0;
      const revenue = salesData?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;

      this.stats.set({
        users: usersCount || 0,
        products: productsCount || 0,
        sales: salesCount,
        revenue: revenue
      });

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
