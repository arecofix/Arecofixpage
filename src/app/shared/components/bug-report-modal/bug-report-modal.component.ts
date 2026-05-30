import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugReportService } from '@app/core/services/bug-report.service';

@Component({
  selector: 'app-bug-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-700">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="text-xl">🛟</span> Reportar un Problema
          </h3>
          <button (click)="close.emit()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5">
          @if (success) {
            <div class="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-800 dark:text-emerald-300 flex flex-col items-center justify-center py-8 text-center gap-3">
              <i class="fas fa-check-circle text-4xl text-emerald-500"></i>
              <div>
                <p class="font-medium text-lg">¡Reporte enviado!</p>
                <p class="text-sm opacity-80 mt-1">Gracias por ayudarnos a mejorar el sistema.</p>
              </div>
              <button (click)="close.emit()" class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors">
                Cerrar
              </button>
            </div>
          } @else {
            @if (error) {
              <div class="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-red-800 dark:text-red-300 text-sm flex items-center gap-2">
                <i class="fas fa-exclamation-circle"></i> {{ error }}
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Área afectada (Opcional)</label>
              <select [(ngModel)]="category" class="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="general">Problema General</option>
                <option value="billing">Facturación y Ventas</option>
                <option value="inventory">Stock e Inventario</option>
                <option value="repairs">Servicio Técnico</option>
                <option value="ui">Error Visual / Pantalla</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Descripción del problema</label>
              <textarea 
                [(ngModel)]="description" 
                rows="4" 
                placeholder="Por favor, contanos qué sucedió o qué intentabas hacer..."
                class="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                (click)="close.emit()" 
                [disabled]="loading"
                class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                (click)="submit()"
                [disabled]="loading || !description.trim()"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                @if (loading) {
                  <i class="fas fa-circle-notch fa-spin"></i> Enviando...
                } @else {
                  <i class="fas fa-paper-plane"></i> Enviar Reporte
                }
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BugReportModalComponent {
  @Output() close = new EventEmitter<void>();
  
  category = 'general';
  description = '';
  
  loading = false;
  error = '';
  success = false;

  private reportService = inject(BugReportService);

  async submit() {
    if (!this.description.trim()) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      await this.reportService.submitReport({
        description: this.description,
        category: this.category
      });
      this.success = true;
    } catch (err: any) {
      this.error = err?.message || 'Ocurrió un error al enviar el reporte. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
