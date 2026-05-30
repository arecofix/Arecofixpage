import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-payment-required',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 text-center relative overflow-hidden">
        
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-500 to-orange-500"></div>

        <div class="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-lock text-2xl"></i>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">Acceso Suspendido</h2>
        
        <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Su sistema volverá a funcionar una vez que se normalice el pago del mismo. Por favor, regularice su situación para restaurar el acceso al panel administrativo.
        </p>

        <div class="space-y-3">
          <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <i class="fas fa-credit-card"></i>
            Regularizar Pago
          </button>
          
          <button (click)="logout()" class="w-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium py-2.5 rounded-lg transition-colors">
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  `
})
export class PaymentRequiredComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
