import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcademySubscriptionService } from '@app/core/services/academy-subscription.service';
import {
  AcademySubscription,
  AcademySubscriptionStatus
} from '@app/features/courses/domain/entities/academy-subscription.entity';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-admin-academy-subscriptions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
            <a routerLink="/admin/courses" class="hover:text-blue-500 transition-colors">Academia</a>
            <span>/</span>
            <span>Membresías</span>
          </div>
          <h1 class="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <i class="fas fa-id-card text-blue-600 dark:text-blue-400"></i>
            Control de Membresías y Pagos
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Administra suscripciones, monitorea períodos de gracia y gestiona accesos manuales.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="loadSubscriptions()" class="btn btn-sm btn-outline rounded-xl" [disabled]="loading()">
            <i class="fas fa-sync-alt" [class.animate-spin]="loading()"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Suscripciones</div>
          <div class="text-3xl font-black text-slate-800 dark:text-white">{{ stats().total }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">Activas</div>
          <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ stats().active }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">En Gracia (7 Días)</div>
          <div class="text-3xl font-black text-amber-600 dark:text-amber-400">{{ stats().grace }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Suspendidas / Expiradas</div>
          <div class="text-3xl font-black text-rose-600 dark:text-rose-400">{{ stats().suspended + stats().expired }}</div>
        </div>
      </div>

      <!-- Filter Tabs & Search -->
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            [class.bg-white]="selectedFilter() === 'all'"
            [class.dark:bg-slate-800]="selectedFilter() === 'all'"
            [class.shadow-sm]="selectedFilter() === 'all'"
            [class.text-blue-600]="selectedFilter() === 'all'"
            [class.text-slate-600]="selectedFilter() !== 'all'"
            (click)="selectedFilter.set('all')"
          >
            Todas ({{ subscriptions().length }})
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            [class.bg-white]="selectedFilter() === 'active'"
            [class.dark:bg-slate-800]="selectedFilter() === 'active'"
            [class.shadow-sm]="selectedFilter() === 'active'"
            [class.text-emerald-600]="selectedFilter() === 'active'"
            [class.text-slate-600]="selectedFilter() !== 'active'"
            (click)="selectedFilter.set('active')"
          >
            Activas
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            [class.bg-white]="selectedFilter() === 'grace_period'"
            [class.dark:bg-slate-800]="selectedFilter() === 'grace_period'"
            [class.shadow-sm]="selectedFilter() === 'grace_period'"
            [class.text-amber-600]="selectedFilter() === 'grace_period'"
            [class.text-slate-600]="selectedFilter() !== 'grace_period'"
            (click)="selectedFilter.set('grace_period')"
          >
            En Gracia
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            [class.bg-white]="selectedFilter() === 'suspended'"
            [class.dark:bg-slate-800]="selectedFilter() === 'suspended'"
            [class.shadow-sm]="selectedFilter() === 'suspended'"
            [class.text-rose-600]="selectedFilter() === 'suspended'"
            [class.text-slate-600]="selectedFilter() !== 'suspended'"
            (click)="selectedFilter.set('suspended')"
          >
            Suspendidas
          </button>
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            [class.bg-white]="selectedFilter() === 'expired'"
            [class.dark:bg-slate-800]="selectedFilter() === 'expired'"
            [class.shadow-sm]="selectedFilter() === 'expired'"
            [class.text-slate-900]="selectedFilter() === 'expired'"
            [class.text-slate-600]="selectedFilter() !== 'expired'"
            (click)="selectedFilter.set('expired')"
          >
            Expiradas
          </button>
        </div>

        <div class="relative w-full md:w-72">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Buscar por email o nombre..."
            class="input input-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 w-full pl-9 rounded-xl"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>
      </div>

      <!-- Subscriptions Table -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        @if (loading()) {
          <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-blue-500"></span>
          </div>
        } @else if (filteredSubscriptions().length === 0) {
          <div class="text-center py-16 px-4">
            <i class="fas fa-id-card text-5xl text-slate-300 dark:text-slate-600 mb-3 block"></i>
            <h3 class="font-bold text-slate-700 dark:text-slate-200 text-lg">No se encontraron suscripciones</h3>
            <p class="text-sm text-slate-400 max-w-sm mx-auto mt-1">
              No hay registros que coincidan con el filtro seleccionado.
            </p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr class="border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400 uppercase">
                  <th>Alumno</th>
                  <th>Plan Contratado</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                  <th>Período Gracia</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                @for (sub of filteredSubscriptions(); track sub.id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td>
                      <div class="font-bold text-slate-900 dark:text-white">
                        {{ sub.profile?.first_name ? sub.profile?.first_name + ' ' + (sub.profile?.last_name || '') : 'Alumno' }}
                      </div>
                      <div class="text-xs text-slate-500">{{ sub.profile?.email || 'Sin email registrado' }}</div>
                    </td>
                    <td>
                      <div class="font-medium text-sm text-slate-800 dark:text-slate-200">
                        {{ sub.plan?.name || 'Membresía Pro' }}
                      </div>
                      <div class="text-xs text-slate-400">
                        \${{ (sub.plan?.price || 15000) | number }} ARS
                      </div>
                    </td>
                    <td>
                      @if (sub.status === 'active') {
                        <span class="badge badge-success badge-sm font-bold gap-1 py-2 px-3 text-white">
                          <i class="fas fa-check-circle text-xs"></i> Activa
                        </span>
                      } @else if (sub.status === 'grace_period') {
                        <span class="badge badge-warning badge-sm font-bold gap-1 py-2 px-3">
                          <i class="fas fa-clock text-xs"></i> En Gracia
                        </span>
                      } @else if (sub.status === 'suspended') {
                        <span class="badge badge-error badge-sm font-bold gap-1 py-2 px-3 text-white">
                          <i class="fas fa-ban text-xs"></i> Suspendida
                        </span>
                      } @else {
                        <span class="badge badge-ghost badge-sm font-bold gap-1 py-2 px-3 text-slate-500">
                          <i class="fas fa-times-circle text-xs"></i> Expirada
                        </span>
                      }
                    </td>
                    <td class="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {{ sub.expires_at | date:'mediumDate' }}
                    </td>
                    <td class="text-sm text-slate-500">
                      {{ sub.grace_period_ends_at | date:'mediumDate' }}
                    </td>
                    <td class="text-right">
                      <div class="flex items-center justify-end gap-2">
                        @if (sub.status !== 'active') {
                          <button
                            (click)="forceRenew(sub)"
                            [disabled]="actionLoading() === sub.id"
                            class="btn btn-xs btn-success text-white rounded-lg font-bold"
                            title="Forzar Renovación manual por 30 días"
                          >
                            @if (actionLoading() === sub.id) {
                              <span class="loading loading-spinner loading-xs"></span>
                            } @else {
                              <i class="fas fa-redo-alt mr-1"></i> Forzar Renovación
                            }
                          </button>
                        } @else {
                          <button
                            (click)="suspend(sub)"
                            [disabled]="actionLoading() === sub.id"
                            class="btn btn-xs btn-outline btn-error rounded-lg font-bold"
                            title="Suspender acceso inmediatamente"
                          >
                            @if (actionLoading() === sub.id) {
                              <span class="loading loading-spinner loading-xs"></span>
                            } @else {
                              <i class="fas fa-ban mr-1"></i> Suspender
                            }
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminAcademySubscriptionsPage implements OnInit {
  private subscriptionService = inject(AcademySubscriptionService);
  private toast = inject(NotificationService);

  loading = signal(true);
  actionLoading = signal<string | null>(null);
  subscriptions = signal<AcademySubscription[]>([]);
  selectedFilter = signal<string>('all');
  searchQuery = '';

  filteredSubscriptions = computed(() => {
    let list = this.subscriptions();
    const filter = this.selectedFilter();
    if (filter !== 'all') {
      list = list.filter(s => s.status === filter);
    }
    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(s =>
        (s.profile?.email || '').toLowerCase().includes(q) ||
        (s.profile?.first_name || '').toLowerCase().includes(q) ||
        (s.profile?.last_name || '').toLowerCase().includes(q)
      );
    }
    return list;
  });

  stats = computed(() => {
    const list = this.subscriptions();
    return {
      total: list.length,
      active: list.filter(s => s.status === 'active').length,
      grace: list.filter(s => s.status === 'grace_period').length,
      suspended: list.filter(s => s.status === 'suspended').length,
      expired: list.filter(s => s.status === 'expired').length,
    };
  });

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.loading.set(true);
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (subs) => {
        this.subscriptions.set(subs);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.showError('Error al cargar suscripciones de la academia.');
      }
    });
  }

  async forceRenew(sub: AcademySubscription) {
    this.actionLoading.set(sub.id);
    const res = await this.subscriptionService.forceRenewSubscription(sub.id);
    this.actionLoading.set(null);

    if (res.error) {
      this.toast.showError('No se pudo renovar la membresía.');
    } else {
      this.toast.showSuccess('Membresía renovada por 30 días.');
      this.loadSubscriptions();
    }
  }

  async suspend(sub: AcademySubscription) {
    this.actionLoading.set(sub.id);
    const res = await this.subscriptionService.suspendSubscription(sub.id);
    this.actionLoading.set(null);

    if (res.error) {
      this.toast.showError('No se pudo suspender la membresía.');
    } else {
      this.toast.showWarning('Membresía suspendida.');
      this.loadSubscriptions();
    }
  }
}
