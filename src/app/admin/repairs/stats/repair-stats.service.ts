import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

export interface RepairStatsDto {
    total_facturado: number;
    costo_repuestos: number;
    ganancia_neta: number;
    margen_porcentaje: number;
    ticket_promedio: number;
    total_reparaciones: number;
    reparaciones_vidrio: number;
    ingreso_extra_vidrio: number;
    equipos_recibidos: number;
    equipos_entregados: number;
    garantias_efectivas: number;
    equipos_espera: number;
    devoluciones_cantidad: number;
    devoluciones_monto: number;
    venta_total_global: number;
    monthly_data: {
        mes: string;
        label: string;
        ingreso: number;
        costo: number;
        ganancia: number;
        ratio: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class RepairStatsService {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    getStats(dateRange: string, branchId?: string): Observable<RepairStatsDto> {
        return from(this.calculateStatsInternal(dateRange, branchId));
    }

    private async calculateStatsInternal(dateRange: string, branchId?: string): Promise<RepairStatsDto> {
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();

        // 1. Fetch repairs with parts - REMOVED created_at constraint from main query 
        // to allow calculating costs of parts used this month on older repairs.
        let allRepairsQuery = supabase
            .from('repairs')
            .select(`
                id,
                final_cost,
                current_status_id,
                created_at,
                completed_at,
                upsell_vidrio,
                repair_parts_used (
                    quantity,
                    unit_cost_at_time,
                    unit_price_at_time,
                    cost_at_time,
                    created_at
                ),
                costo_repuesto
            `)
            .eq('tenant_id', tenantId);

        if (branchId) {
            allRepairsQuery = allRepairsQuery.eq('branch_id', branchId);
        }

        const { data: allRepairs, error: repairsError } = await (allRepairsQuery as any);

        if (repairsError) throw repairsError;

        // 2. Fetch orders
        let ordersQuery = supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('tenant_id', tenantId)
            .in('status', ['paid', 'completed', 'shipped', 'paid']);

        if (branchId) {
            ordersQuery = ordersQuery.eq('branch_id', branchId);
        }

        const { data: orders } = await ordersQuery;

        // 3. Process calculations
        let total_facturado = 0;
        let costo_repuestos = 0;
        let reparaciones_vidrio = 0;
        let equipos_entregados = 0;
        let equipos_espera = 0;
        let garantias_efectivas = 0;

        const monthlyMap = new Map<string, { ingreso: number, costo: number }>();
        const now = new Date();
        const thisMonth = now.toISOString().slice(0, 7);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);

        // Define filtering logic based on dateRange
        const isPeriodMatch = (dateStr: string) => {
            if (dateRange === 'all_time') return true;
            const itemPeriod = (dateStr || '').slice(0, 7);
            if (dateRange === 'this_month') return itemPeriod === thisMonth;
            if (dateRange === 'last_month') return itemPeriod === lastMonth;
            return false;
        };

        for (const r of (allRepairs as any[] || [])) {
            const revenueDate = r.completed_at || r.created_at;
            const revenuePeriod = revenueDate.slice(0, 7);
            
            if (!monthlyMap.has(revenuePeriod)) monthlyMap.set(revenuePeriod, { ingreso: 0, costo: 0 });

            // Solo contabilizamos ingreso y costo cuando la reparación está facturada (Lista o Entregada)
            if (r.current_status_id === 5 || r.current_status_id === 6) {
                const pIngreso = Number(r.final_cost || 0);
                const pCosto = Number(r.costo_repuesto || 0);

                monthlyMap.get(revenuePeriod)!.ingreso += pIngreso;
                monthlyMap.get(revenuePeriod)!.costo += pCosto;

                if (isPeriodMatch(revenueDate)) {
                    total_facturado += pIngreso;
                    costo_repuestos += pCosto;
                    if (r.current_status_id === 6) equipos_entregados++;
                }
            }

            if (r.current_status_id === 1 || r.current_status_id === 2) {
                if (isPeriodMatch(r.created_at)) equipos_espera++;
            }
            
            if (r.upsell_vidrio && isPeriodMatch(r.created_at)) reparaciones_vidrio++;
        }

        const filteredOrders = (orders || []).filter((o: any) => isPeriodMatch(o.created_at));
        const total_orders_revenue = filteredOrders.reduce((acc: number, o: any) => acc + Number(o.total_amount), 0);
        const total_reparaciones = (allRepairs || []).filter((r: any) => isPeriodMatch(r.completed_at || r.created_at) && (r.current_status_id === 6 || r.current_status_id === 5)).length;
        
        const equipos_recibidos = (allRepairs || []).filter((r: any) => isPeriodMatch(r.created_at)).length;

        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthly_data = Array.from(monthlyMap.entries())
            .map(([mes, data]) => {
                const [year, month] = mes.split('-');
                return {
                    mes,
                    label: `${monthNames[parseInt(month)-1]} ${year.slice(2)}`,
                    ingreso: data.ingreso,
                    costo: data.costo,
                    ganancia: data.ingreso - data.costo,
                    ratio: data.ingreso > 0 ? (data.costo / data.ingreso) * 100 : 0
                };
            })
            .sort((a, b) => b.mes.localeCompare(a.mes));

        return {
            total_facturado,
            costo_repuestos,
            ganancia_neta: total_facturado - costo_repuestos,
            margen_porcentaje: total_facturado > 0 ? ((total_facturado - costo_repuestos) / total_facturado) * 100 : 0,
            ticket_promedio: total_reparaciones > 0 ? total_facturado / total_reparaciones : 0,
            total_reparaciones,
            reparaciones_vidrio,
            ingreso_extra_vidrio: reparaciones_vidrio * 2500,
            equipos_recibidos,
            equipos_entregados,
            garantias_efectivas,
            equipos_espera,
            devoluciones_cantidad: 0,
            devoluciones_monto: 0,
            venta_total_global: total_facturado + total_orders_revenue,
            monthly_data: monthly_data.slice(0, 6) // Últimos 6 meses
        };
    }
}
