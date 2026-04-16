import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairPart } from '../../domain/entities/repair.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

@Injectable({
    providedIn: 'root'
})
export class SupabaseRepairRepository extends BaseRepository<Repair> implements RepairRepository {
    protected override tableName = 'repairs';
    protected override isGlobalTable = false;
    protected override useSoftDeletes = true;

    constructor() {
        const supabase = inject(SUPABASE_CLIENT);
        const logger = inject(LoggerService);
        super(supabase, logger);
    }

    override getById(id: string): Observable<Repair | null> {
        let query = this.supabase.from(this.tableName)
            .select('*, parts:repair_parts_used(*), images:repair_images(image_url)')
            .eq('id', id);

        return from((this.applyTenantFilter(query) as any).maybeSingle()).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) this.errorHandler.handleError(error, `getById ${this.tableName}`);
                return data ? this.mapFromDb(data) : null;
            })
        );
    }

    override getAll(params?: any): Observable<Repair[]> {
        const branchId = typeof params === 'string' ? params : (params?.branchId);
        const limit = params?.limit || 50;
        const offset = params?.offset || 0;

        let query = this.supabase.from(this.tableName)
            .select('*, parts:repair_parts_used(*), images:repair_images(image_url)')
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        query = this.applyTenantFilter(query);
        if (branchId) query = query.eq('branch_id', branchId);

        return from(query as any).pipe(
            map(({ data, error }: any) => {
                if (error) this.errorHandler.handleError(error, `getAll ${this.tableName}`);
                return (data || []).map((d: any) => this.mapFromDb(d));
            })
        );
    }

    override create(repair: CreateRepairDto): Observable<Repair> {
        const { parts, images, ...baseRepair } = repair as any;
        const payload = this.mapToDb(baseRepair);
        
        // BaseRepository.create automatically adds tenant_id, but here we need custom logic for parts/images
        return from(this.supabase.from(this.tableName).insert(this.applyTenantFilterPayload(payload)).select().single() as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return data;
            }),
            switchMap(async (data: any) => {
                if (parts && parts.length > 0) await this.syncParts(data.id, parts);
                if (images && images.length > 0) await this.syncImages(data.id, images);

                await this.logStatusChange(data.id, data.current_status_id, 'Ingreso inicial');

                const repairWithParts = { ...data, parts: parts || [], images: images || [] };
                return this.mapFromDb(repairWithParts);
            })
        );
    }

    override update(id: string, repair: UpdateRepairDto): Observable<any> {
        const { parts, images, ...baseRepair } = repair as any;
        const payload = this.mapToDb(baseRepair);
        
        return from(this.supabase.from(this.tableName).select('current_status_id').eq('id', id).single() as any).pipe(
            switchMap((res: any) => {
                const prevStatus = res.data?.current_status_id;
                let query = this.supabase.from(this.tableName).update(payload).eq('id', id).select();

                return from(this.applyTenantFilter(query) as any).pipe(
                    map((innerRes: any) => {
                        if (innerRes.error) throw innerRes.error;
                        return { data: innerRes.data, prevStatus };
                    }),
                    switchMap(async (result) => {
                        if (parts) await this.syncParts(id, parts);
                        if (images) await this.syncImages(id, images);

                        if (payload.current_status_id && payload.current_status_id !== result.prevStatus) {
                            await this.logStatusChange(id, payload.current_status_id, payload.technical_report || 'Cambio de estado');
                        }
                    })
                );
            })
        );
    }

    getByTrackingCode(code: string): Observable<Repair | null> {
        return from(
            // Utilizamos la RPC segura sin maybeSingle() para evitar el error 406 de PostgREST
            this.supabase.rpc('get_repair_tracking', { p_code: code })
        ).pipe(
            map(({ data, error }) => {
                if (error) return null;
                // Extraemos el primer resultado del array si existe
                return data && data.length > 0 ? this.mapFromDb(data[0]) : null;
            })
        );
    }

    getAdminList(params: { branch_id?: string, limit?: number, offset?: number, searchTerm?: string }): Observable<Repair[]> {
        const limit = params.limit || 50;
        const offset = params.offset || 0;
        
        let query = this.supabase.from(this.tableName)
            .select(`
                *,
                client:profiles!repairs_client_id_fkey(id, full_name, phone),
                assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, full_name),
                status:repair_status_types(id, name, color, icon)
            `)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        query = this.applyTenantFilter(query);
        if (params.branch_id) query = query.eq('branch_id', params.branch_id);
        
        if (params.searchTerm) {
            query = query.or(`customer_name.ilike.%${params.searchTerm}%,tracking_code.ilike.%${params.searchTerm}%,device_model.ilike.%${params.searchTerm}%`);
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) return [];
                return (data || []).map(d => this.mapFromDb(d));
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `repairs/${fileName}`;

        const { error: uploadError } = await this.supabase.storage
            .from('repair-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = this.supabase.storage
            .from('repair-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    private async logStatusChange(repairId: string, statusId: number, notes?: string): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        const { data: { user } } = await this.supabase.auth.getUser();
        
        await this.supabase.from('repair_status_history').insert({
            repair_id: repairId,
            status_type_id: statusId,
            notes: notes || '',
            changed_by: user?.id,
            tenant_id: tenantId
        });
    }

    private async syncParts(repairId: string, parts: RepairPart[]): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        await this.supabase.from('repair_parts_used').delete().eq('repair_id', repairId).eq('tenant_id', tenantId);
        
        if (parts.length > 0) {
            const partsToInsert = parts.map(p => ({
                repair_id: repairId,
                product_id: p.product_id,
                quantity: Number(p.quantity) || 1,
                unit_price_at_time: Number(p.unit_price_at_time) || 0,
                cost_at_time: Number(p.cost_at_time) || 0,
                unit_cost_at_time: (Number(p.cost_at_time) || 0) / (Number(p.quantity) || 1), 
                tenant_id: tenantId
            }));
            await this.supabase.from('repair_parts_used').insert(partsToInsert);
        }

        const totalCost = parts.reduce((acc: number, p: RepairPart) => acc + (Number(p.cost_at_time || 0)), 0);
        await this.supabase.from(this.tableName)
            .update({ costo_repuesto: totalCost })
            .eq('id', repairId)
            .eq('tenant_id', tenantId);
    }

    private async syncImages(repairId: string, images: string[]): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        await this.supabase.from('repair_images').delete().eq('repair_id', repairId).eq('tenant_id', tenantId);
        
        if (images && images.length > 0) {
            const imagesToInsert = images.map((img: any) => ({
                repair_id: repairId,
                image_url: typeof img === 'string' ? img : (img as any).image_url,
                tenant_id: tenantId
            }));
            await this.supabase.from('repair_images').insert(imagesToInsert);
        }
    }

    private mapFromDb(p: any): Repair {
        return {
            id: p.id,
            tracking_code: p.tracking_code,
            customer_name: p.customer_name,
            customer_phone: p.customer_phone,
            device_type: p.device_type,
            device_brand: p.device_brand,
            device_model: p.device_model,
            imei: p.imei,
            repair_number: p.repair_number,
            issue_description: p.issue_description,
            current_status_id: p.current_status_id,
            estimated_cost: Number(p.estimated_cost),
            final_cost: Number(p.final_cost),
            deposit_amount: Number(p.deposit_amount),
            technical_labor_cost: Number(p.technical_labor_cost),
            notes: p.notes,
            technician_notes: p.technician_notes,
            technical_report: p.technical_report,
            received_at: p.received_at,
            created_at: p.created_at,
            updated_at: p.updated_at,
            completed_at: p.completed_at,
            images: p.images?.map((img: any) => img.image_url) || [],
            parts: p.parts || [],
            branch_id: p.branch_id,
            received_by: p.received_by,
            assigned_technician_id: p.assigned_technician_id,
            checklist: p.checklist,
            security_pin: p.security_pin,
            security_pattern: p.security_pattern,
            device_passcode: p.device_passcode,
            upsell_vidrio: p.upsell_vidrio,
            costo_repuesto: Number(p.costo_repuesto || 0)
        };
    }

    private mapToDb(r: any): any {
        return {
            customer_name: r.customer_name,
            customer_phone: r.customer_phone,
            device_type: r.device_type,
            device_brand: r.device_brand,
            device_model: r.device_model,
            imei: r.imei,
            issue_description: r.issue_description,
            current_status_id: r.current_status_id,
            estimated_cost: r.estimated_cost,
            final_cost: r.final_cost,
            deposit_amount: r.deposit_amount,
            technical_labor_cost: r.technical_labor_cost,
            notes: r.notes,
            technician_notes: r.technician_notes,
            technical_report: r.technical_report,
            completed_at: r.completed_at,
            branch_id: r.branch_id,
            received_by: r.received_by,
            assigned_technician_id: r.assigned_technician_id,
            checklist: r.checklist,
            security_pin: r.security_pin,
            security_pattern: r.security_pattern,
            device_passcode: r.device_passcode,
            upsell_vidrio: r.upsell_vidrio,
            costo_repuesto: r.costo_repuesto
        };
    }

    private applyTenantFilterPayload(payload: any) {
        const tenantId = this.tenantService.getTenantId();
        if (tenantId !== TENANT_CONSTANTS.FALLBACK_ID) {
            payload.tenant_id = tenantId;
        }
        return payload;
    }

    getWorkshopSummary(branch_id?: string): Observable<any> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        return from(this.fetchSummaryData(branch_id, startOfMonth)).pipe(
            map(data => data)
        );
    }

    private async fetchSummaryData(branch_id: string | undefined, startOfMonth: string) {
        // 1. Get Active Repairs logic
        let query = this.supabase.from(this.tableName)
            .select('current_status_id, final_cost, costo_repuesto', { count: 'exact' });
        
        query = this.applyTenantFilter(query);
        if (branch_id) query = query.eq('branch_id', branch_id);

        const { data, error } = await (query as any);
        if (error) {
            this.errorHandler.handleError(error, 'getWorkshopSummary');
            return { inWorkshop: 0, readyToPickup: 0, pendingParts: 0, thisMonthProfit: 0 };
        }

        const repairs = data || [];
        
        // Workshop logic: anything not delivered or cancelled
        const inWorkshop = repairs.filter((r: any) => r.current_status_id < 5).length;
        const readyToPickup = repairs.filter((r: any) => r.current_status_id === 5).length;
        const pendingParts = repairs.filter((r: any) => r.current_status_id === 2).length;

        // Profit logic: Delivered status (6) in this month
        // We'll need a separate query or just filter if delivered are in the result
        // BUT wait, getAll returns all non-soft-deleted. 
        // For profit we specifically need delivered this month.
        
        let profitQuery = this.supabase.from(this.tableName)
            .select('final_cost, costo_repuesto')
            .eq('current_status_id', 6) // DELIVERED
            .gte('completed_at', startOfMonth);
            
        profitQuery = this.applyTenantFilter(profitQuery);
        if (branch_id) profitQuery = profitQuery.eq('branch_id', branch_id);

        const { data: profitData } = await (profitQuery as any);
        const thisMonthProfit = (profitData || []).reduce((acc: number, r: any) => {
            return acc + (Number(r.final_cost || 0) - Number(r.costo_repuesto || 0));
        }, 0);

        return {
            inWorkshop,
            readyToPickup,
            pendingParts,
            thisMonthProfit
        };
    }
}
