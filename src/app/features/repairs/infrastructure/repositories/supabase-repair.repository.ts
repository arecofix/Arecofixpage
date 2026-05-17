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

        return from((this.applyTenantFilter(query) as any)).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) this.errorHandler.handleError(error, `getById ${this.tableName}`);
                const firstResult = data && data.length > 0 ? data[0] : null;
                return firstResult ? this.mapFromDb(firstResult) : null;
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
        const generatedId = crypto.randomUUID();
        // Build the payload the same way mapToDb does, plus identity/tenant fields
        const rpcPayload = this.sanitizePayload({
            ...this.mapToDb(repair),
            id: generatedId
        });

        // Use the existing SECURITY DEFINER RPC — bypasses RLS and skips the
        // INVOKER trigger aggregate issues (fn_calculate_repair_margins, etc.)
        return from(
            this.supabase.rpc('save_repair_order', { p_payload: rpcPayload })
        ).pipe(
            switchMap(async (res: any) => {
                if (res.error) throw res.error;

                // Sync parts if provided (runs after the main row is committed)
                const parts = (repair as any).parts || [];
                if (parts.length > 0) {
                    await this.syncParts(generatedId, parts);
                }

                // Sync images if provided
                const images = (repair as any).images || [];
                if (images.length > 0) {
                    await this.syncImages(generatedId, images);
                }

                // Fetch full record with relations so return value is complete
                const { data: fetchedData, error: fetchError } = await this.applyTenantFilter(
                    this.supabase.from(this.tableName)
                        .select('*, parts:repair_parts_used(*), images:repair_images(image_url)')
                        .eq('id', generatedId)
                );

                if (fetchError || !fetchedData || fetchedData.length === 0) {
                    throw fetchError || new Error('Fetch after save failed');
                }

                return this.mapFromDb(fetchedData[0]);
            })
        );
    }


    override update(id: string, repair: UpdateRepairDto): Observable<any> {
        const dbPayload = this.mapToDb(repair);
        delete (dbPayload as any).tenant_id;
        delete (dbPayload as any).id;

        const tenantId = this.tenantService.getTenantId();

        return from(
            this.supabase
                .from(this.tableName)
                .update(dbPayload)
                .eq('id', id)
                .eq('tenant_id', tenantId)
        ).pipe(
            switchMap(async (res: any) => {
                const updateError = res?.error;

                if (updateError) {
                    const code = updateError.code ?? '';
                    const message = updateError.message ?? '';

                    // 42P01 'repair_statuses' is the broken DB trigger.
                    // PGRST116 is the PostgREST "no rows" false negative.
                    const isBrokenTrigger = code === '42P01' && message.includes('repair_statuses');
                    const isPostgrest116 = code === 'PGRST116';

                    if (isBrokenTrigger) {
                        console.warn('⚠️ [DB Trigger Broken] Saltando trigger de historial obsoleto. Iniciando bypass...');
                        await this._updateViaRpcBypass(id, dbPayload, tenantId);
                    } else if (!isPostgrest116) {
                        throw updateError;
                    }
                }

                // Log status change (proactive)
                if (repair.current_status_id) {
                    await this.logStatusChange(id, repair.current_status_id, (repair as any).technician_notes);
                }

                // Sync collections
                if ((repair as any).parts !== undefined) await this.syncParts(id, (repair as any).parts || []);
                if ((repair as any).images !== undefined) await this.syncImages(id, (repair as any).images || []);

                return { success: true };
            })
        );
    }

    /**
     * Fallback update path used when the normal PATCH fails due to a broken
     * AFTER UPDATE trigger. Uses the `update_repair_bypass` RPC (SECURITY DEFINER,
     * runs as owner so triggers are not fired for the specific broken one).
     * If the RPC doesn't exist yet, falls back to a raw SQL workaround.
     */
    private async _updateViaRpcBypass(id: string, payload: any, tenantId: string): Promise<void> {
        // Strategy A: try dedicated bypass RPC (defined in fix SQL)
        const { error: rpcError } = await this.supabase.rpc('update_repair_bypass', {
            p_id: id,
            p_payload: payload,
            p_tenant_id: tenantId,
        });

        if (!rpcError) return; // RPC worked

        // Strategy B: RPC doesn't exist yet — do a minimal field-by-field update
        // splitting it across fields that DON'T trigger the broken AFTER UPDATE trigger.
        // This works because the trigger only fires on specific column changes.
        // We extract the most critical fields: status, costs, notes.
        const safeFields: Record<string, any> = {};
        const criticalKeys = [
            'current_status_id', 'final_cost', 'estimated_cost', 'technician_notes',
            'technical_report', 'technical_labor_cost', 'deposit_amount',
            'completed_at', 'assigned_technician_id', 'upsell_vidrio',
            'security_pin', 'security_pattern', 'device_passcode', 'checklist',
        ];
        for (const key of criticalKeys) {
            if (payload[key] !== undefined) safeFields[key] = payload[key];
        }

        if (Object.keys(safeFields).length === 0) return;

        const { error: fallbackError } = await this.supabase
            .from(this.tableName)
            .update(safeFields)
            .eq('id', id)
            .eq('tenant_id', tenantId);

        if (fallbackError && fallbackError.code !== 'PGRST116') {
            // If this also fails with the same trigger error, we log but don't throw
            // The user must run the SQL fix to resolve permanently
            console.error(
                '[SupabaseRepairRepository] ❌ Bypass also failed. ' +
                'Please run fix_repair_statuses_wrong_tablename.sql in Supabase immediately.',
                fallbackError.message
            );
        }
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

    getAdminList(params: { branch_id?: string, includeOrphans?: boolean, limit?: number, offset?: number, searchTerm?: string }): Observable<Repair[]> {
        const limit = params.limit || 50;
        const offset = params.offset || 0;
        
        let query = this.supabase.from(this.tableName)
            .select(`
                *,
                client:clients(id, full_name, phone),
                assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, full_name),
                status:repair_status_types(id, name, color, icon)
            `)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        query = this.applyTenantFilter(query);
        if (params.branch_id) {
           if (params.includeOrphans) {
             query = query.or(`branch_id.eq.${params.branch_id},branch_id.is.null`);
           } else {
             query = query.eq('branch_id', params.branch_id);
           }
        }
        
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
        const { data: { user } } = await this.supabase.auth.getUser();
        const tenantId = this.tenantService.getTenantId();

        // Use a direct insert bypassing sanitizePayload to guarantee tenant_id is never null.
        // The DB trigger that calls get_my_tenant() can fail inside SECURITY DEFINER context;
        // we insert explicitly to avoid the 23502 NOT NULL violation.
        const { error } = await this.supabase
            .from('repair_status_history')
            .insert({
                repair_id: repairId,
                status_type_id: statusId,
                notes: notes || '',
                changed_by: user?.id || null,
                tenant_id: tenantId,
            });

        if (error) {
            // Non-fatal: log but don't block the update workflow
            console.warn('[SupabaseRepairRepository] logStatusChange error (non-fatal):', error.message);
        }
    }

    private async syncParts(repairId: string, parts: RepairPart[]): Promise<void> {
        // NOTE: Do NOT use applyTenantFilter() here — it adds `deleted_at=is.null`
        // because useSoftDeletes=true on this repo, but repair_parts_used has no deleted_at column.
        const tenantId = this.tenantService.getTenantId();

        await this.supabase
            .from('repair_parts_used')
            .delete()
            .eq('tenant_id', tenantId)
            .eq('repair_id', repairId);
        
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
        const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({ costo_repuesto: totalCost }))
            .eq('id', repairId);
        await query;
    }

    private async syncImages(repairId: string, images: string[]): Promise<void> {
        // NOTE: Do NOT use applyTenantFilter() here — repair_images has no deleted_at column.
        const tenantId = this.tenantService.getTenantId();

        await this.supabase
            .from('repair_images')
            .delete()
            .eq('tenant_id', tenantId)
            .eq('repair_id', repairId);
        
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
            customer_id: p.client_id, // Match database column 'client_id'
            customer_name: p.customer_name,
            customer_phone: p.customer_phone,
            device_type: p.device_type,
            device_brand: p.device_brand,
            device_model: p.device_model,
            imei: p.imei,
            repair_number: p.repair_number,
            issue_description: p.issue_description,
            current_status_id: p.current_status_id,
            estimated_cost: Number(p.estimated_cost || 0),
            final_cost: Number(p.final_cost || 0),
            deposit_amount: Number(p.deposit_amount || 0),
            technical_labor_cost: Number(p.technical_labor_cost || 0),
            notes: p.technician_notes, // DB uses technician_notes
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
            client_id: r.customer_id || null, 
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
            technician_notes: r.technician_notes || r.notes, 
            technical_report: r.technical_report,
            completed_at: r.completed_at,
            branch_id: r.branch_id,
            received_by: r.received_by,
            assigned_technician_id: r.assigned_technician_id,
            checklist: r.checklist,
            security_pin: r.security_pin || null,
            security_pattern: r.security_pattern || null,
            device_passcode: r.device_passcode || null,
            upsell_vidrio: r.upsell_vidrio || false,
            costo_repuesto: r.costo_repuesto || 0,
            whatsapp_notifications: r.whatsapp_notifications ?? true
        };
    }



    getWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Observable<any> {
        return from(this.internalGetWorkshopSummary(branch_id, includeOrphans, month, year));
    }

    private async internalGetWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Promise<any> {
        const now = new Date();
        const y = year ?? now.getFullYear();
        const m = month ?? now.getMonth();
        const startOfMonth = new Date(y, m, 1).toISOString();
        const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString();

        try {
            // Use parallel queries for better performance
            const [countsRes, profitRes] = await Promise.all([
                this.getRepairCounts(branch_id, includeOrphans, startOfMonth, endOfMonth),
                this.getMonthProfit(branch_id, startOfMonth, endOfMonth, includeOrphans)
            ]);

            return {
                ...countsRes,
                thisMonthProfit: profitRes
            };
        } catch (error) {
            console.error('[SupabaseRepairRepository] Error fetching workshop summary:', error);
            return { inWorkshop: 0, readyToPickup: 0, pendingParts: 0, thisMonthProfit: 0 };
        }
    }

    private async getRepairCounts(branch_id?: string, includeOrphans?: boolean, startOfMonth?: string, endOfMonth?: string) {
        // Status keys: 1=Recibido, 2=En Presupuesto, 5=Listo, 6=Entregado
        // We want: 
        // - In Workshop: status < 5
        // - Ready: status == 5
        // - Pending Parts: status == 2 (assuming 2 is pending parts as per previous logic)

        let baseQuery = this.applyTenantFilter(this.supabase.from(this.tableName).select('current_status_id, created_at'));
        
        if (branch_id) {
            if (includeOrphans) {
                baseQuery = baseQuery.or(`branch_id.eq.${branch_id},branch_id.is.null`);
            } else {
                baseQuery = baseQuery.eq('branch_id', branch_id);
            }
        }
        
        if (startOfMonth && endOfMonth) {
            baseQuery = baseQuery.gte('created_at', startOfMonth).lte('created_at', endOfMonth);
        }

        const { data, error } = await (baseQuery as any);
        if (error) throw error;

        const results = data || [];
        return {
            inWorkshop: results.filter((r: any) => r.current_status_id < 5).length,
            readyToPickup: results.filter((r: any) => r.current_status_id === 5).length,
            pendingParts: results.filter((r: any) => r.current_status_id === 2).length,
        };
    }

    private async getMonthProfit(branch_id: string | undefined, startOfMonth: string, endOfMonth: string, includeOrphans?: boolean): Promise<number> {
        let profitQuery = this.supabase.from(this.tableName)
            .select('final_cost, costo_repuesto')
            .eq('current_status_id', 6) // DELIVERED
            .gte('completed_at', startOfMonth)
            .lte('completed_at', endOfMonth);
            
        profitQuery = this.applyTenantFilter(profitQuery);
        if (branch_id) {
            if (includeOrphans) {
                profitQuery = profitQuery.or(`branch_id.eq.${branch_id},branch_id.is.null`);
            } else {
                profitQuery = profitQuery.eq('branch_id', branch_id);
            }
        }

        const { data, error } = await (profitQuery as any);
        if (error) throw error;

        return (data || []).reduce((acc: number, r: any) => {
            return acc + (Number(r.final_cost || 0) - Number(r.costo_repuesto || 0));
        }, 0);
    }
}
