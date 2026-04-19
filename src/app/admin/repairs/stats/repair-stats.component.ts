import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepairStatsService, RepairStatsDto } from './repair-stats.service';
import { AuthService } from '@app/core/services/auth.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { TenantService } from '@app/core/services/tenant.service';
import { BranchService } from '@app/core/services/branch.service';

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
                     <span class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                         <i class="fas fa-chart-line"></i>
                     </span>
                     Inteligencia Financiera
                 </h2>
                 <p class="text-sm text-gray-500 mt-1">Rentabilidad real de su taller: Mano de Obra vs Repuestos</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button (click)="downloadClientsCsv()" [disabled]="downloadingCsv()" class="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-200 rounded-2xl shadow-sm transition-all h-auto min-h-12 font-bold px-6">
                    @if(downloadingCsv()) {
                        <span class="loading loading-spinner loading-sm"></span>
                    } @else {
                        <i class="fas fa-file-csv mr-2 text-lg"></i> Base Clientes (CSV)
                    }
                </button>
                <select [ngModel]="period()" (ngModelChange)="period.set($event)" class="select select-bordered w-full md:w-auto rounded-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 min-h-12">
                    <option value="this_month">Este Mes</option>
                    <option value="last_month">Mes Anterior</option>
                    <option value="all_time">Histórico Total</option>
                </select>
            </div>
        </div>

        @if (loading()) {
            <div class="flex flex-col justify-center items-center py-20 animate-pulse">
                <span class="loading loading-spinner text-indigo-600 w-12 h-12 mb-4"></span>
                <span class="text-sm font-medium text-gray-500">Compilando tablero contable...</span>
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
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 dark:text-gray-400">Ingresos Totales (Taller)</div>
                        <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center"><i class="fas fa-cash-register"></i></div>
                    </div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatARS(s.total_facturado) }}</div>
                    <div class="text-xs text-gray-500 mt-2 font-medium">Equipos cobrados en caja</div>
                </div>

                <!-- Costo de Insumos -->
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 dark:text-gray-400">Costo Insumos</div>
                        <div class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center"><i class="fas fa-microchip"></i></div>
                    </div>
                    <div class="text-3xl font-black text-rose-500 tracking-tighter">-{{ formatARS(s.costo_repuestos) }}</div>
                    <div class="text-xs text-gray-500 mt-2 font-medium">Inversión en repuestos utilizados</div>
                </div>

                <!-- Ganancia Neta -->
                <div class="bg-gray-900 dark:bg-black rounded-3xl p-6 shadow-xl relative overflow-hidden border border-emerald-900/50">
                    <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-400 flex items-center gap-1">
                            Ganancia Real (Técnica)
                            <div class="tooltip tooltip-info" data-tip="Lógica validada: Solo servicio técnico">
                                <i class="fas fa-info-circle text-indigo-400 cursor-help"></i>
                            </div>
                        </div>
                        <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><i class="fas fa-hand-holding-usd text-lg"></i></div>
                    </div>
                    <div class="text-4xl font-black text-white tracking-tighter">{{ formatARS(s.ganancia_neta) }}</div>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-lg">
                            Margen: {{ s.margen_porcentaje | number:'1.0-0' }}%
                        </span>
                        <span class="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">Neto Líquido</span>
                    </div>
                </div>

                <!-- Ticket Promedio -->
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="text-[10px] font-black tracking-widest uppercase text-gray-500 dark:text-gray-400">Ticket Promedio</div>
                        <div class="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center"><i class="fas fa-receipt"></i></div>
                    </div>
                    <div class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatARS(s.ticket_promedio) }}</div>
                    <div class="text-xs text-gray-500 mt-2 font-medium">Sobre {{ s.total_reparaciones }} reparaciones finalizadas</div>
                </div>
            </div>

            <!-- Gráfico de Rendimiento Mensual -->
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden group">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h3 class="text-lg font-black text-gray-900 dark:text-white">Rendimiento Mensual</h3>
                        <p class="text-xs text-gray-500">Comparativa histórica de ingresos vs. costos operativos</p>
                    </div>
                    <div class="flex items-center gap-5">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-indigo-600"></span>
                            <span class="text-[10px] font-black uppercase text-gray-500">Ingresos</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                            <span class="text-[10px] font-black uppercase text-gray-500">Costos</span>
                        </div>
                    </div>
                </div>

                <!-- Chart Container with dynamic scaling -->
                <div class="relative pt-8 pb-4">
                    <!-- Grid Lines (Horizontal Background Axis) -->
                    <div class="absolute inset-x-0 top-8 bottom-12 flex flex-col justify-between pointer-events-none px-2 md:px-6">
                        <div class="border-t border-gray-300 dark:border-gray-600 w-full"></div>
                        <div class="border-t border-gray-200 dark:border-gray-700/50 w-full"></div>
                        <div class="border-t border-gray-200 dark:border-gray-700/50 w-full"></div>
                        <div class="border-t border-gray-200 dark:border-gray-700/50 w-full"></div>
                        <div class="border-t border-gray-400 dark:border-gray-500 w-full opacity-30"></div>
                    </div>

                    <div class="relative flex items-end justify-between h-64 md:h-80 gap-2 md:gap-8 px-2 md:px-6 z-10">
                        @for(month of s.monthly_data.slice().reverse(); track month.mes) {
                            <div class="flex-1 flex flex-col items-center group/bar relative">
                                <!-- Bars Container -->
                                <div class="w-full flex items-end justify-center gap-1.5 md:gap-3 h-full pb-2">
                                    <!-- Revenue Bar -->
                                    <div class="w-2.5 md:w-5 bg-indigo-600 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-indigo-600/20" 
                                         [style.height.%]="getPercentage(month.ingreso, maxMonthlyValue())">
                                        <div class="opacity-0 group-hover/bar:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] py-1.5 px-3 rounded-xl font-bold whitespace-nowrap z-50 shadow-xl transition-all pointer-events-none">
                                            Ingreso: {{ formatARS(month.ingreso) }}
                                        </div>
                                    </div>
                                    <!-- Cost Bar -->
                                    <div class="w-2.5 md:w-5 bg-rose-500 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-rose-500/20" 
                                         [style.height.%]="getPercentage(month.costo, maxMonthlyValue())">
                                         <div class="opacity-0 group-hover/bar:opacity-100 absolute -top-20 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] py-1.5 px-3 rounded-xl font-bold whitespace-nowrap z-50 shadow-xl transition-all pointer-events-none">
                                            Insumos: {{ formatARS(month.costo) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{{ month.label }}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <!-- Panel Secundario (Venta Global & Upsell) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div class="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                     <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                     <div class="relative z-10">
                        <div class="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Ingresos Consolidados (Global)</div>
                        <h3 class="text-4xl font-black mb-2">{{ formatARS(s.venta_total_global) }}</h3>
                        <p class="text-xs text-indigo-100 font-medium">Facturación sumada de Taller + Tienda Online</p>
                        
                        <div class="mt-8 flex items-center gap-10">
                            <div>
                                <div class="text-[10px] font-black uppercase text-indigo-300 mb-1">Equipos Entregados</div>
                                <div class="text-2xl font-black">{{ s.equipos_entregados }}</div>
                            </div>
                            <div>
                                <div class="text-[10px] font-black uppercase text-indigo-300 mb-1">Reparaciones con Vidrio</div>
                                <div class="text-2xl font-black">{{ s.reparaciones_vidrio }} <span class="text-xs text-indigo-400 ml-1">+{{ s.ingreso_extra_vidrio | currency:'ARS':'symbol':'1.0-0' }}</span></div>
                            </div>
                        </div>
                     </div>
                 </div>

                 <!-- Recent Activity / Monthly Stats Table -->
                 <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <i class="fas fa-history text-indigo-600"></i> Historial de Rentabilidad
                    </h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="text-[10px] uppercase font-black text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th class="pb-3 px-2">Período</th>
                                    <th class="pb-3 text-right">Ingresos</th>
                                    <th class="pb-3 text-right">Insumos</th>
                                    <th class="pb-3 text-right">Ganancia</th>
                                    <th class="pb-3 text-right">Margen</th>
                                </tr>
                            </thead>
                            <tbody class="text-xs font-bold text-gray-700 dark:text-gray-300">
                                @for(m of s.monthly_data; track m.mes) {
                                    <tr class="border-b border-gray-50 dark:border-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td class="py-4 px-2 font-black text-gray-900 dark:text-white uppercase">{{ m.label }}</td>
                                        <td class="py-4 text-right text-indigo-600">{{ formatARS(m.ingreso) }}</td>
                                        <td class="py-4 text-right text-rose-500">-{{ formatARS(m.costo) }}</td>
                                        <td class="py-4 text-right text-emerald-600">{{ formatARS(m.ganancia) }}</td>
                                        <td class="py-4 text-right">
                                            <span class="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px]">
                                                {{ (m.ganancia / (m.ingreso || 1) * 100) | number:'1.0-0' }}%
                                            </span>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>

        }
    </div>
  `,
  styleUrl: './repair-stats.component.css'
})
export class AdminRepairStatsComponent implements OnInit {
    private statsService = inject(RepairStatsService);
    private customerService = inject(CustomerService);
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    period = signal('this_month');
    stats = signal<RepairStatsDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    downloadingCsv = signal(false);

    // Computed to find the maximum value among all months to scale the chart bars relatively
    maxMonthlyValue = computed(() => {
        const data = this.stats()?.monthly_data || [];
        if (data.length === 0) return 100;
        return Math.max(...data.map(m => Math.max(m.ingreso, m.costo)));
    });

    constructor() {
        effect(() => {
            const p = this.period();
            this.loadStats(p);
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

    formatARS(amount: number): string {
        if (amount === undefined || amount === null) return 'ARS 0';
        const formatted = new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
        return `ARS ${formatted}`;
    }

    getPercentage(value: number, total: number): number {
        if (!total || !value) return 0;
        const p = (value / total) * 100;
        return p > 100 ? 100 : p;
    }

    async downloadClientsCsv() {
        if (this.downloadingCsv()) return;
        this.downloadingCsv.set(true);
        try {
            const supabase = this.auth.getSupabaseClient();
            const tenantId = this.tenantService.getTenantId();
            const profiles = await this.customerService.getAll();
            const { data: repairs } = await supabase.from('repairs').select('client_id, customer_name, customer_phone').eq('tenant_id', tenantId);
            const { data: orders } = await supabase.from('orders').select('customer_name, customer_email, customer_phone').eq('tenant_id', tenantId);

            const clientMap = new Map<string, any>();
            profiles.forEach(p => {
                const name = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim();
                const key = (p.email || p.phone || name).toLowerCase().replace(/\s/g, '');
                if (key) clientMap.set(key, { name, email: p.email, phone: p.phone, dni: p.dni, address: p.address });
            });
            (repairs || []).forEach(r => {
                const key = (r.customer_phone || r.customer_name || '').toLowerCase().replace(/\s/g, '');
                if (key && !clientMap.has(key)) clientMap.set(key, { name: r.customer_name, email: '', phone: r.customer_phone, dni: '', address: '' });
            });
            (orders || []).forEach(o => {
                const key = (o.customer_email || o.customer_phone || o.customer_name || '').toLowerCase().replace(/\s/g, '');
                if (key && !clientMap.has(key)) clientMap.set(key, { name: o.customer_name, email: o.customer_email, phone: o.customer_phone, dni: '', address: '' });
            });

            const data = Array.from(clientMap.values());
            if (data.length === 0) {
                alert('No hay clientes para exportar.');
                return;
            }

            const headers = ['Nombre Completo', 'DNI', 'Teléfono', 'Email', 'Dirección'];
            const rows = data.map((c: any) => [
                `"${(c.name || '').replace(/"/g, '""')}"`,
                `"${(c.dni || '').replace(/"/g, '""')}"`,
                `"${(c.phone || '').replace(/"/g, '""')}"`,
                `"${(c.email || '').replace(/"/g, '""')}"`,
                `"${(c.address || '').replace(/"/g, '""')}"`
            ].join(','));
            
            const csvContent = [headers.join(','), ...rows].join('\n');
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Arecofix_Master_Clientes_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e: any) {
            console.error('Error descargando CSV:', e);
            alert('Ocurrió un error al generar el CSV de clientes.');
        } finally {
            this.downloadingCsv.set(false);
        }
    }
}
