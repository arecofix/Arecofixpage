import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '@app/core/services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cash-movements',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-6 flex flex-col h-full">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl"
          >
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div>
            <h1
              class="text-2xl font-black text-gray-900 dark:text-white tracking-tight"
            >
              {{ t().finance.cashMovements.title || 'Movimientos de Caja' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Control de ingresos, egresos y conciliaciÃ³n.
            </p>
          </div>
        </div>
        <button
          class="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-xl font-bold shadow-lg shadow-indigo-500/30"
        >
          <i class="fas fa-plus mr-2"></i>
          {{ t().finance.cashMovements.newMovement || 'Nuevo Movimiento' }}
        </button>
      </div>

      <div
        class="flex-1 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col"
      >
        <div
          class="p-4 border-b border-gray-100 dark:border-slate-700 flex gap-4 bg-gray-50/50 dark:bg-slate-800/50"
        >
          <input
            type="date"
            class="input input-sm rounded-xl border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
          />
          <select
            class="select select-sm rounded-xl border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
          >
            <option>
              {{ t().finance.cashMovements.allTypes || 'Todos los tipos' }}
            </option>
            <option>{{ t().finance.cashMovements.income || 'Ingreso' }}</option>
            <option>{{ t().finance.cashMovements.expense || 'Egreso' }}</option>
          </select>
        </div>
        <div class="flex-1 overflow-auto">
          <table class="table w-full">
            <thead>
              <tr class="text-gray-400 dark:text-gray-500">
                <th>{{ t().finance.cashMovements.date || 'FECHA' }}</th>
                <th>{{ t().finance.cashMovements.concept || 'CONCEPTO' }}</th>
                <th>MÃ‰TODO</th>
                <th>{{ t().finance.cashMovements.type || 'TIPO' }}</th>
                <th class="text-right">
                  {{ t().finance.cashMovements.amount || 'MONTO' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colspan="5"
                  class="text-center text-gray-400 py-12 font-bold"
                >
                  <i
                    class="fas fa-folder-open text-4xl mb-3 opacity-20 block"
                  ></i>
                  {{
                    t().finance.cashMovements.noMovements ||
                      'No hay movimientos registrados en esta fecha'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class CashMovementsComponent {
  public t = inject(TranslationService).t;
}
