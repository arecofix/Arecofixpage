import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
        ingreso: number;
        costo: number;
        ganancia: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class RepairStatsService {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    getStats(dateRange: string): Observable<RepairStatsDto> {
        const supabase = this.auth.getSupabaseClient();
        const tenantId = this.tenantService.getTenantId();

        // Llamamos a la RPC que calcula todo de forma eficiente en la DB
        return from(
            supabase.rpc('get_repair_financial_stats', {
                p_tenant_id: tenantId,
                p_date_range: dateRange // 'this_month', 'last_month', 'all_time'
            })
        ).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return (data || this.getEmptyStats()) as RepairStatsDto;
            })
        );
    }

    private getEmptyStats(): RepairStatsDto {
        return {
            total_facturado: 0,
            costo_repuestos: 0,
            ganancia_neta: 0,
            margen_porcentaje: 0,
            ticket_promedio: 0,
            total_reparaciones: 0,
            reparaciones_vidrio: 0,
            ingreso_extra_vidrio: 0,
            equipos_recibidos: 0,
            equipos_entregados: 0,
            garantias_efectivas: 0,
            equipos_espera: 0,
            devoluciones_cantidad: 0,
            devoluciones_monto: 0,
            venta_total_global: 0,
            monthly_data: []
        };
    }
}
