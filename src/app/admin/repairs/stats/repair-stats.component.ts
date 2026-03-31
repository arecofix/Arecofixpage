import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepairStatsService, RepairStatsDto } from './repair-stats.service';

@Component({
  selector: 'app-admin-repair-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="px-6 py-8 animate-fade-in-up">
        
        <!-- Header & Filters -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                 <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                     <span class="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                         <i class="fas fa-chart-pie"></i>
                     </span>
                     Inteligencia Financiera
                 </h2>
                 <p class="text-sm text-gray-500 mt-1">Análisis de rentabilidad real: Ingresos Brutos vs Costo de Insumos</p>
            </div>
            
            <div class="flex gap-2 w-full md:w-auto">
                <select [ngModel]="period()" (ngModelChange)="period.set($event)" class="select select-bordered w-full md:w-auto rounded-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                    <option value="this_month">Este Mes</option>
                    <option value="last_month">Mes Anterior</option>
                    <option value="all_time">Histórico Total</option>
                </select>
            </div>
        </div>

        @if (loading()) {
            <div class="flex flex-col justify-center items-center py-20 animate-pulse">
                <span class="loading loading-spinner text-indigo-500 w-12 h-12 mb-4"></span>
                <span class="text-sm font-medium text-gray-500">Calculando rentabilidad cruzada...</span>
            </div>
        } @else if (error()) {
            <div class="alert alert-error shadow-sm rounded-2xl">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ error() }}</span>
                <button class="btn btn-sm" (click)="loadStats()"><i class="fas fa-sync"></i> Reintentar</button>
            </div>
        } @else if (stats(); as s) {
            
            <!-- KPIs Principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                <!-- Ingreso Bruto -->
                <div class="bg-white dark:bg-gray-800/80 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500">Ingreso Bruto</div>
                        <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fas fa-cash-register"></i></div>
                    </div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{{ s.total_facturado | currency:'ARS':'symbol':'1.0-0' }}</div>
                    <div class="text-xs text-gray-400 mt-2 font-medium">Facturación total al cliente</div>
                </div>

                <!-- Costo de Insumos -->
                <div class="bg-white dark:bg-gray-800/80 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500">Costo Insumos</div>
                        <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><i class="fas fa-box-open"></i></div>
                    </div>
                    <div class="text-3xl font-black text-rose-500 tracking-tight">-{{ s.costo_repuestos | currency:'ARS':'symbol':'1.0-0' }}</div>
                    <div class="text-xs text-gray-400 mt-2 font-medium">Inversión en repuestos utilizados</div>
                </div>

                <!-- Ganancia Neta -->
                <div class="bg-gray-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group border border-emerald-900/50">
                    <div class="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-400">Ganancia Neta (Profit)</div>
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><i class="fas fa-sack-dollar text-xl relative z-10"></i></div>
                    </div>
                    <div class="text-4xl font-black text-white tracking-tighter relative z-10">{{ s.ganancia_neta | currency:'ARS':'symbol':'1.0-0' }}</div>
                    <div class="flex items-center gap-2 mt-2 relative z-10">
                        <span class="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                            Margen: {{ s.margen_porcentaje | number:'1.0-1' }}%
                        </span>
                        <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Líquido</span>
                    </div>
                </div>

                <!-- Ticket Promedio -->
                <div class="bg-white dark:bg-gray-800/80 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500">Ticket Promedio Bruto</div>
                        <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><i class="fas fa-receipt"></i></div>
                    </div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{{ s.ticket_promedio | currency:'ARS':'symbol':'1.0-0' }}</div>
                    <div class="text-xs text-gray-400 mt-2 font-medium">Sobre {{ s.total_reparaciones }} equipos reparados</div>
                </div>

            </div>

            <!-- Nuevos KPIs de Taller Avanzados -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                
                <!-- Productos y Servicios Vendidos (Venta Total) -->
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
                     <div class="absolute right-0 top-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
                     <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">Venta Total Global</div>
                     <div class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ s.venta_total_global | currency:'ARS':'symbol':'1.0-0' }}</div>
                     <div class="text-[10px] text-gray-400 mt-1 font-medium">Reparaciones + Ventas (Órdenes)</div>
                </div>

                <!-- Equipos Recibidos / Entregados -->
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
                     <div class="absolute right-0 top-0 w-16 h-16 bg-purple-500/5 rounded-bl-full"></div>
                     <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">Recibidos / Entregados</div>
                     <div class="text-2xl font-black text-purple-600 dark:text-purple-400">
                         {{ s.equipos_recibidos }} <span class="text-gray-300 dark:text-gray-600">/</span> {{ s.equipos_entregados }}
                     </div>
                     <div class="text-[10px] text-gray-400 mt-1 font-medium">Flujo de taller activo</div>
                </div>

                <!-- Garantías Efectivas -->
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
                     <div class="absolute right-0 top-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full"></div>
                     <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">Garantías Efectivas</div>
                     <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ s.garantias_efectivas }}</div>
                     <div class="text-[10px] text-gray-400 mt-1 font-medium">Re-ingresos por garantía</div>
                </div>

                <!-- Equipos Espera Ingreso -->
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
                     <div class="absolute right-0 top-0 w-16 h-16 bg-amber-500/5 rounded-bl-full"></div>
                     <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">En Espera / Pendiente</div>
                     <div class="text-2xl font-black text-amber-600 dark:text-amber-400">{{ s.equipos_espera }}</div>
                     <div class="text-[10px] text-gray-400 mt-1 font-medium">Equipos sin diagnóstico o espera rep.</div>
                </div>

                <!-- Devoluciones -->
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden">
                     <div class="absolute right-0 top-0 w-16 h-16 bg-rose-500/5 rounded-bl-full"></div>
                     <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">Devoluciones ( {{ s.devoluciones_cantidad }} )</div>
                     <div class="text-2xl font-black text-rose-600 dark:text-rose-400">{{ s.devoluciones_monto | currency:'ARS':'symbol':'1.0-0' }}</div>
                     <div class="text-[10px] text-gray-400 mt-1 font-medium">Capital devuelto total</div>
                </div>

            </div>

            <!-- Panel Secundario -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Upsell Vidrio Métrica Especial -->
                <div class="bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-between relative overflow-hidden group">
                    <div class="absolute -right-6 -top-6 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors transform group-hover:rotate-12 duration-500">
                        <i class="fas fa-mobile-alt text-9xl"></i>
                    </div>
                    
                    <div class="relative z-10">
                        <div class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-4">
                            <i class="fas fa-star text-amber-500"></i>
                            Rendimiento Estrategia Upsell
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">Venta Adicional de Vidrios Templados vía App</h3>
                        
                        <div class="mt-6 flex flex-col gap-4">
                            <div>
                                <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Equipos con Vidrio</div>
                                <div class="text-3xl font-black text-indigo-600 dark:text-indigo-400">{{ s.reparaciones_vidrio }} <span class="text-base text-gray-400 font-medium tracking-normal">+{{(s.reparaciones_vidrio / (s.total_reparaciones || 1) * 100) | number:'1.0-0'}}% conversión</span></div>
                            </div>
                            
                            <div>
                                <div class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Ingreso Extra Bruto (Estimado)</div>
                                <div class="text-2xl font-black text-gray-900 dark:text-white">{{ s.ingreso_extra_vidrio | currency:'ARS':'symbol':'1.0-0' }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabla de Rendimiento Mensual Simple (Angular Native) -->
                <div class="lg:col-span-2 bg-white dark:bg-gray-800/50 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 class="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-6 flex items-center gap-2">
                         <i class="fas fa-chart-line text-emerald-500"></i> Ratio de Gastos sobre Ingresos (Por Mes)
                    </h3>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th class="pb-3">Período</th>
                                    <th class="pb-3 text-right text-blue-500">Ingreso Bruto</th>
                                    <th class="pb-3 text-right text-rose-500">Costo Repuestos</th>
                                    <th class="pb-3 text-right text-emerald-500">GANANCIA NETA</th>
                                    <th class="pb-3 text-right">Margen</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50 dark:divide-gray-800/40 text-sm font-medium">
                                @for(month of s.monthly_data; track month.mes) {
                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-default">
                                        <td class="py-4 text-gray-900 dark:text-white font-bold">{{ month.mes }}</td>
                                        <td class="py-4 text-right text-gray-700 dark:text-gray-300 font-mono">{{ month.ingreso | currency:'ARS':'symbol':'1.0-0' }}</td>
                                        <td class="py-4 text-right text-rose-500 font-mono">-{{ month.costo | currency:'ARS':'symbol':'1.0-0' }}</td>
                                        <td class="py-4 text-right text-emerald-600 dark:text-emerald-400 font-mono font-black">{{ month.ganancia | currency:'ARS':'symbol':'1.0-0' }}</td>
                                        <td class="py-4 text-right text-gray-500 font-mono">
                                            {{ (month.ganancia / (month.ingreso || 1) * 100) | number:'1.0-1' }}%
                                        </td>
                                    </tr>
                                }
                                @if(s.monthly_data.length === 0) {
                                    <tr>
                                        <td colspan="5" class="py-8 text-center text-gray-400 italic font-normal">No hay datos para estructurar este período</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        }
    </div>
  `
})
export class AdminRepairStatsComponent implements OnInit {
    private statsService = inject(RepairStatsService);

    period = signal('this_month');
    stats = signal<RepairStatsDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    constructor() {
        effect(() => {
            const p = this.period();
            this.loadStats(p); // Reload whenever the period changes
        });
    }

    ngOnInit(): void {
        this.loadStats(this.period());
    }

    async loadStats(periodValue: string = this.period()) {
        if (!periodValue) return;
        this.loading.set(true);
        this.error.set(null);

        this.statsService.getStats(periodValue).subscribe({
            next: (data) => {
                this.stats.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error("Error loading stats", err);
                this.error.set("No se pudo compilar el Dashboard contable. Refresque la base de datos.");
                this.loading.set(false);
            }
        });
    }
}
