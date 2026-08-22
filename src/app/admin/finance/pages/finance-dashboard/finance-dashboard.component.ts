import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '@app/core/services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl"
        >
          <i class="fas fa-chart-pie"></i>
        </div>
        <div>
          <h1
            class="text-2xl font-black text-gray-900 dark:text-white tracking-tight"
          >
            GestiÃ³n Contable
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Resumen financiero y situaciÃ³n patrimonial.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm"
        >
          <h3 class="text-sm font-bold text-gray-500 mb-1">
            {{ t().finance.dashboard.monthlyIncome || 'Ingresos del Mes' }}
          </h3>
          <p class="text-3xl font-black text-emerald-500">$0.00</p>
        </div>
        <div
          class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm"
        >
          <h3 class="text-sm font-bold text-gray-500 mb-1">
            {{ t().finance.dashboard.monthlyExpense || 'Egresos del Mes' }}
          </h3>
          <p class="text-3xl font-black text-red-500">$0.00</p>
        </div>
        <div
          class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm"
        >
          <h3 class="text-sm font-bold text-gray-500 mb-1">
            {{ t().finance.dashboard.balance || 'Balance' }}
          </h3>
          <p class="text-3xl font-black text-indigo-500">$0.00</p>
        </div>
      </div>
    </div>
  `,
})
export class FinanceDashboardComponent {
  public t = inject(TranslationService).t;
}
