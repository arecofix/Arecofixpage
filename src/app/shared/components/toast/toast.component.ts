import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-20 right-2 z-9999 flex flex-col gap-2 pointer-events-none max-w-[85vw] sm:max-w-sm w-auto items-end">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto transform transition-all duration-300 animate-slide-in-down cursor-pointer"
             (click)="onToastClick(toast)">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border-l-4 overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ring-1 ring-black/5"
               [ngClass]="{
                 'border-l-green-500': toast.type === 'success',
                 'border-l-red-500': toast.type === 'error',
                 'border-l-blue-500': toast.type === 'info'
               }">
             
             <!-- Icon -->
             <div class="shrink-0">
               @if(toast.type === 'success') {
                 <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <i class="fas fa-check text-sm"></i>
                 </div>
               } @else if(toast.type === 'error') {
                 <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <i class="fas fa-exclamation text-sm"></i>
                 </div>
               } @else {
                 <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <i class="fas fa-info text-sm"></i>
                 </div>
               }
             </div>

             <!-- Message -->
             <div class="flex flex-col flex-1 min-w-0">
               <span class="font-bold text-xs uppercase tracking-wider" 
                 [ngClass]="{
                   'text-green-700 dark:text-green-400': toast.type === 'success',
                   'text-red-700 dark:text-red-400': toast.type === 'error',
                   'text-blue-700 dark:text-blue-400': toast.type === 'info'
                 }">
                 @if(toast.type === 'success') { Producto Agregado }
                 @else if(toast.type === 'error') { Error }
                 @else { Aviso }
               </span>
               <span class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{{ toast.message }}</span>
             </div>

             <!-- Close Button -->
             <button class="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               <i class="fas fa-times text-sm"></i>
             </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in-down {
      animation: slideInDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `]
})
export class ToastComponent {
  public toastService = inject(ToastService);

  onToastClick(toast: Toast) {
    if (toast.action) {
      toast.action();
    }
    this.toastService.remove(toast.id);
  }
}
