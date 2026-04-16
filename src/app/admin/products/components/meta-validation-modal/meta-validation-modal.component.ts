import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meta-validation-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <i class="fas fa-shield-check text-green-500"></i>
              Resultado de Auditoría Meta Catalog
            </h3>
            <p class="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Resumen de problemas detectados</p>
          </div>
          <button (click)="close.emit()" class="btn btn-sm btn-circle btn-ghost">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          @if (results.length === 0) {
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <h4 class="text-2xl font-bold text-gray-900 dark:text-white">¡Catálogo Perfecto!</h4>
              <p class="text-gray-500 max-w-md mt-2">Todos tus productos cumplen con los requisitos mínimos para ser subidos a Meta sin errores.</p>
            </div>
          } @else {
            <div class="alert alert-warning shadow-sm mb-6 border-none bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
              <i class="fas fa-exclamation-circle text-xl"></i>
              <div>
                <h4 class="font-bold">Se encontraron problemas en {{ results.length }} productos.</h4>
                <p class="text-sm opacity-90">Para evitar errores en Meta Business Suite, corrige los siguientes puntos antes del próximo export.</p>
              </div>
            </div>

            <div class="space-y-4">
              @for (res of results; track res.id) {
                <div class="group border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all hover:shadow-md bg-white dark:bg-gray-800">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                         <i class="fas fa-box text-gray-400"></i>
                      </div>
                      <div>
                        <h4 class="font-bold text-gray-900 dark:text-white">{{ res.name }}</h4>
                        <span class="text-xs font-mono opacity-50">ID: {{ res.id }}</span>
                      </div>
                    </div>
                    <a [routerLink]="['/admin/products', res.id]" (click)="close.emit()" class="btn btn-xs btn-primary btn-outline">
                      <i class="fas fa-pen mr-1"></i> Corregir
                    </a>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    @for (issue of res.issues; track issue) {
                      <span class="badge badge-error badge-outline gap-1 text-[10px] font-bold py-2">
                        <i class="fas fa-times-circle text-[10px]"></i> {{ issue }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-end gap-3">
          <button (click)="close.emit()" class="btn btn-ghost px-8">Cerrar</button>
          @if (results.length > 0) {
            <button (click)="close.emit()" class="btn btn-primary px-8 shadow-lg shadow-indigo-500/20">Entendido, iré a corregir</button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class MetaValidationModalComponent {
  @Input() results: { id: string, name: string, issues: string[] }[] = [];
  @Output() close = new EventEmitter<void>();
}
