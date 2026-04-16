import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-repair-finance-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-8">
        <!-- Tarjeta: Estado Maestro -->
        <div class="bg-white dark:bg-gray-800/50 rounded-4xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <i class="fas fa-sync-alt"></i>
                </div>
                <h3 class="font-bold text-gray-800 dark:text-white">Ciclo de Reparación</h3>
            </div>
            
            <div class="form-control">
                <label class="label pb-1.5"><span class="label-text font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">Cambiar Estado</span></label>
                <div class="relative">
                    <select [ngModel]="currentStatusId()" (ngModelChange)="onStatusChange.emit($event)" name="current_status_id" class="select select-bordered w-full rounded-xl bg-gray-50 dark:bg-gray-800/50 font-bold border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-100 h-14 pl-12 text-sm appearance-none transition-all shadow-sm"
                            [ngClass]="{
                                'text-yellow-600': currentStatusId() === 1 || currentStatusId() === 2,
                                'text-blue-600': currentStatusId() === 3,
                                'text-purple-600': currentStatusId() === 4,
                                'text-green-600': currentStatusId() === 5 || currentStatusId() === 6,
                                'text-red-600': currentStatusId() === 7
                            }">
                        <option [value]="1">📌 PENDIENTE DE DIAGNÓSTICO</option>
                        <option [value]="2">📦 ESPERANDO REPUESTOS</option>
                        <option [value]="3">⚙️ EN REPARACIÓN</option>
                        <option [value]="4">🧪 CONTROL DE CALIDAD</option>
                        <option [value]="5">✅ LISTO PARA RETIRAR</option>
                        <option [value]="6">🤝 ENTREGADO AL CLIENTE</option>
                        <option [value]="7">❌ CANCELADO / DEVOLUCIÓN</option>
                    </select>
                    <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <div class="w-4 h-4 rounded-full shadow-sm"
                            [ngClass]="{
                                'bg-yellow-400': currentStatusId() === 1 || currentStatusId() === 2,
                                'bg-blue-400': currentStatusId() === 3,
                                'bg-purple-400': currentStatusId() === 4,
                                'bg-emerald-400': currentStatusId() === 5 || currentStatusId() === 6,
                                'bg-red-400': currentStatusId() === 7
                            }"></div>
                    </div>
                    <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400"><i class="fas fa-chevron-down"></i></div>
                </div>
            </div>
        </div>

        <!-- Tarjeta: Finanzas y Costos -->
        <div class="bg-gray-900 rounded-4xl p-1 shadow-xl relative overflow-hidden group">
            <!-- Neon Glow effect -->
            <div class="absolute -inset-1 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div class="relative bg-gray-900 rounded-[calc(2rem-4px)] p-6 z-10">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <h3 class="font-bold text-white tracking-wide">Presupuesto Final</h3>
                </div>

                <div class="space-y-4">
                    <div class="form-control">
                        <label class="label pb-1"><span class="label-text text-gray-400 text-[10px] uppercase tracking-widest font-bold">Base Presupuesto ($)</span></label>
                        <input type="number" [ngModel]="estimatedCost()" (ngModelChange)="onEstimatedCostChange.emit($event)" name="estimated_cost" class="input input-bordered w-full rounded-xl bg-gray-800 border-gray-700 text-gray-300 focus:bg-gray-800 focus:border-emerald-500 font-mono text-lg" min="0" />
                    </div>

                    <div class="form-control">
                        <label class="label pb-1"><span class="label-text text-gray-400 text-[10px] uppercase tracking-widest font-bold">Labor Técnica (M.O)</span></label>
                        <input type="number" [ngModel]="technicalLaborCost()" (ngModelChange)="onLaborCostChange.emit($event)" name="technical_labor_cost" class="input input-bordered w-full rounded-xl bg-gray-800 border-gray-700 text-gray-300 focus:bg-gray-800 focus:border-emerald-500 font-mono text-lg" min="0" />
                    </div>
                    
                    <div class="border-t border-gray-700/50 my-2 shadow-[0_-1px_0_rgba(255,255,255,0.05)]"></div>

                    <div>
                        <div class="flex justify-between items-end mb-1">
                             <span class="text-gray-400 text-sm">Costo Subtotal</span>
                             <span class="text-gray-300 font-mono font-medium">{{ finalCost() | currency:'ARS':'symbol':'1.0-0' }}</span>
                        </div>
                    </div>

                    <div class="form-control mt-4">
                        <label class="label pb-1"><span class="label-text text-emerald-400 text-[10px] uppercase tracking-widest font-bold">Seña / Recibido a Cuenta ($)</span></label>
                        <input type="number" [ngModel]="depositAmount()" (ngModelChange)="onDepositChange.emit($event)" name="deposit_amount" class="input input-bordered w-full rounded-xl bg-emerald-900/30 border-emerald-500/50 text-emerald-400 focus:bg-emerald-900/40 focus:border-emerald-400 font-mono text-lg" min="0" />
                    </div>

                    <div class="bg-black/40 rounded-xl p-4 mt-6 border border-white/5 backdrop-blur-sm">
                        <div class="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">TOTAL A COBRAR</div>
                        <div class="text-4xl font-black text-white tracking-tighter flex items-start gap-1">
                            <span class="text-2xl text-emerald-500 mt-1">$</span>
                            {{ (finalCost() - (depositAmount() || 0)) | number:'1.0-0' }}
                        </div>
                        <div class="text-emerald-500/80 text-[10px] uppercase font-bold mt-2">
                            <i class="fas fa-info-circle mr-1"></i> (Impuestos / IVA Incluido)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class RepairFinanceSectionComponent {
  currentStatusId = input.required<number>();
  estimatedCost = input<number>(0);
  technicalLaborCost = input<number>(0);
  finalCost = input<number>(0);
  depositAmount = input<number>(0);

  onStatusChange = output<number>();
  onEstimatedCostChange = output<number>();
  onLaborCostChange = output<number>();
  onDepositChange = output<number>();
}
