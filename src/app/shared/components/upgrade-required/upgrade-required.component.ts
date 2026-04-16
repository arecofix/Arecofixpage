import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upgrade-required',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <div class="max-w-lg w-full bg-white dark:bg-slate-800 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-700 animate-fade-in">
        <div class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-crown text-4xl text-indigo-600 dark:text-indigo-400 animate-bounce"></i>
        </div>
        
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4 italic">
            Módulo no incluido
        </h2>
        
        <p class="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
            El módulo de <strong>{{ moduleName }}</strong> está disponible exclusivamente en el Plan Premium. 
            Contáctate con el soporte central para actualizar tu plan y desbloquear esta funcionalidad.
        </p>

        <div class="flex flex-col gap-4">
            <a href="https://wa.me/541125960900?text=Hola,%20quiero%20actualizar%20mi%20plan%20de%20Arecofix" 
               target="_blank"
               class="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-700 text-white font-black transition-all shadow-xl shadow-indigo-500/20">
                <i class="fab fa-whatsapp mr-2"></i>
                Solicitar Upgrade
            </a>
            
            <button (click)="goBack()" 
               class="px-8 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold hover:bg-slate-100 transition-all">
                Volver
            </button>
        </div>

        <p class="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Arecofix SaaS Enterprise
        </p>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class UpgradeRequiredComponent {
    private route = inject(ActivatedRoute);
    moduleName = 'este módulo';

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['module']) {
                const maps: any = {
                    'inventory': 'Inventario y Stock',
                    'repairs': 'Gestión de Taller',
                    'customers': 'Base de Clientes',
                    'dashboard': 'Dashboard de Ventas'
                };
                this.moduleName = maps[params['module']] || params['module'];
            }
        });
    }

    goBack() {
        window.history.back();
    }
}
