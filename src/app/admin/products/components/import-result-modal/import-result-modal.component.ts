import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportReport } from '../../services/admin-product.service';

@Component({
    selector: 'app-import-result-modal',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="modal modal-open">
      <div class="modal-box max-w-lg relative overflow-hidden">
        <!-- Gradient accent line -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-500"></div>

        <!-- Header -->
        <div class="flex items-center gap-3 mb-6 pt-2">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
               [class.bg-green-100]="!hasErrors"
               [class.dark:bg-green-900]="!hasErrors"
               [class.bg-amber-100]="hasErrors"
               [class.dark:bg-amber-900]="hasErrors">
            <i class="fas text-2xl"
               [class.fa-check-circle]="!hasErrors"
               [class.text-green-600]="!hasErrors"
               [class.fa-exclamation-triangle]="hasErrors"
               [class.text-amber-500]="hasErrors"></i>
          </div>
          <div>
            <h3 class="font-bold text-xl">Importación completada</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Resumen del procesamiento del CSV</p>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="stat bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 border border-green-100 dark:border-green-800/30">
            <div class="stat-title text-xs text-green-700 dark:text-green-400">Nuevos productos</div>
            <div class="stat-value text-2xl text-green-600 dark:text-green-400">{{ report.inserted }}</div>
          </div>
          <div class="stat bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800/30">
            <div class="stat-title text-xs text-blue-700 dark:text-blue-400">Precios actualizados</div>
            <div class="stat-value text-2xl text-blue-600 dark:text-blue-400">{{ report.priceUpdated }}</div>
          </div>
          <div class="stat bg-purple-50 dark:bg-purple-900/20 rounded-xl px-4 py-3 border border-purple-100 dark:border-purple-800/30">
            <div class="stat-title text-xs text-purple-700 dark:text-purple-400">Repuestos renombrados</div>
            <div class="stat-value text-2xl text-purple-600 dark:text-purple-400">{{ report.renamed }}</div>
          </div>
          <div class="stat rounded-xl px-4 py-3 border"
               [class.bg-red-50]="report.skipped > 0"
               [class.dark:bg-red-900/20]="report.skipped > 0"
               [class.border-red-100]="report.skipped > 0"
               [class.dark:border-red-800/30]="report.skipped > 0"
               [class.bg-gray-50]="report.skipped === 0"
               [class.dark:bg-gray-800/50]="report.skipped === 0"
               [class.border-gray-100]="report.skipped === 0"
               [class.dark:border-gray-700]="report.skipped === 0">
            <div class="stat-title text-xs"
                 [class.text-red-700]="report.skipped > 0"
                 [class.dark:text-red-400]="report.skipped > 0"
                 [class.text-gray-500]="report.skipped === 0">Omitidas</div>
            <div class="stat-value text-2xl"
                 [class.text-red-600]="report.skipped > 0"
                 [class.dark:text-red-400]="report.skipped > 0"
                 [class.text-gray-400]="report.skipped === 0">{{ report.skipped }}</div>
          </div>
        </div>

        <!-- Detail lines -->
        @if (report.details.length > 0) {
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 space-y-1.5">
            @for (line of report.details; track $index) {
              <p class="text-sm text-gray-700 dark:text-gray-300">{{ line }}</p>
            }
          </div>
        }

        <!-- Actions -->
        <div class="modal-action mt-4">
          <button class="btn btn-primary btn-block" (click)="close.emit()">
            <i class="fas fa-check mr-2"></i>
            Listo, actualizar inventario
          </button>
        </div>
      </div>
      <label class="modal-backdrop" (click)="close.emit()"></label>
    </div>
    `
})
export class ImportResultModalComponent {
    @Input({ required: true }) report!: ImportReport;
    @Output() close = new EventEmitter<void>();

    get hasErrors(): boolean {
        return this.report.skipped > 0;
    }
}
