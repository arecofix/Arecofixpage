import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairPart, RepairChecklist } from '../../domain/entities/repair.entity';
import { LoggerService } from '@app/core/services/logger.service';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';
import { RepairOrderMapper } from '../mappers/repair-order.mapper';

@Injectable({
    providedIn: 'root'
})
export class SupabaseRepairRepository extends BaseRepository<Repair> implements RepairRepository {
    protected override tableName = 'repairs';
    protected override isGlobalTable = false;
    protected override useSoftDeletes = true;
    protected override useStrictBranchIsolation = true;

    private storageService = inject(SupabaseStorageService);

    constructor() {
        const supabase = inject(SUPABASE_CLIENT);
        const logger = inject(LoggerService);
        super(supabase, logger);
    }

    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    override getById(id: string): Observable<Repair | null> {
        if (!id || !SupabaseRepairRepository.UUID_REGEX.test(id)) {
            return of(null);
        }

        let query = this.supabase.from(this.tableName)
            .select('*, parts:repair_parts_used(*, product:products(name)), images:repair_images(image_url), client:profiles!repairs_client_id_fkey(id, first_name, last_name, phone, email, dni), assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, first_name, last_name), status:repair_status_types(id, name, color, icon), device:customer_devices!device_id(id, type, imei, passcode, model:models(name, brand_id))')
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

    /**
     * Override de BaseRepository.getAll — compatible con la firma base.
     * Para queries específicas con limit/offset/branch, usar getAdminList().
     */
    override getAll(_options?: { column?: string; ascending?: boolean; select?: string }): Observable<Repair[]> {
        return this.getAdminList({});
    }

    /**
     * Obtiene reparaciones con paginación y filtro de sucursal.
     */
    getRepairs(limit?: number, offset?: number, branchId?: string): Observable<Repair[]> {
        const resolvedLimit = limit || 50;
        const resolvedOffset = offset || 0;

        let query = this.supabase.from(this.tableName)
            .select('*, parts:repair_parts_used(*, product:products(name)), images:repair_images(image_url), client:profiles!repairs_client_id_fkey(id, first_name, last_name, phone, email), assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, first_name, last_name), status:repair_status_types(id, name, color, icon), device:customer_devices!device_id(id, type, imei, passcode, model:models(name, brand_id))')
            .range(resolvedOffset, resolvedOffset + resolvedLimit - 1)
            .order('created_at', { ascending: false });

        query = this.applyTenantFilter(query);
        if (branchId) query = query.eq('branch_id', branchId);

        return from(query as unknown as PromiseLike<{ data: Record<string, unknown>[], error: unknown }>).pipe(
            map(({ data, error }) => {
                if (error) this.errorHandler.handleError(error, `getRepairs ${this.tableName}`);
                return (data || []).map((d: Record<string, unknown>) => this.mapFromDb(d));
            })
        );
    }

    override create(repair: CreateRepairDto): Observable<Repair> {
        const generatedId = crypto.randomUUID();
        const dbPayload = this.mapToDb(repair as unknown as Record<string, unknown>);
        const rpcPayload = this.sanitizePayload({
            ...dbPayload,
            id: generatedId
        });

        // Use the existing SECURITY DEFINER RPC — bypasses RLS and skips the
        // INVOKER trigger aggregate issues (fn_calculate_repair_margins, etc.)
        return from(
            this.supabase.rpc('save_repair_order', { p_payload: rpcPayload })
        ).pipe(
            switchMap(async (res: { error?: unknown }) => {
                if (res.error) throw res.error;

                // Sync parts if provided (runs after the main row is committed)
                const parts = (repair as unknown as Record<string, unknown>)['parts'] as RepairPart[] || [];
                if (parts.length > 0) {
                    await this.syncParts(generatedId, parts);
                }

                // Ensure new fields are saved just in case RPC ignores them
                const extraFields: Record<string, unknown> = {};
                if (dbPayload['supplier_id'] !== undefined) {
                    extraFields['supplier_id'] = dbPayload['supplier_id'];
                }
                if (dbPayload['warranty'] !== undefined) {
                    extraFields['warranty'] = dbPayload['warranty'];
                }
                if (Object.keys(extraFields).length > 0) {
                    await this.supabase.from('repairs').update(extraFields).eq('id', generatedId);
                }

                // Sync images if provided
                const images = (repair as unknown as Record<string, unknown>)['images'] as string[] || [];
                if (images.length > 0) {
                    await this.syncImages(generatedId, images);
                }

                // Fetch full record with relations so return value is complete
                const { data: fetchedData, error: fetchError } = await this.applyTenantFilter(
                    this.supabase.from(this.tableName)
                        .select('*, parts:repair_parts_used(*, product:products(name)), images:repair_images(image_url)')
                        .eq('id', generatedId)
                );

                if (fetchError || !fetchedData || fetchedData.length === 0) {
                    throw fetchError || new Error('Fetch after save failed');
                }

                return this.mapFromDb(fetchedData[0]);
            })
        );
    }


    /**
     * Override de BaseRepository.update — compatible con la firma base.
     * Internamente aplica la lógica específica de reparaciones (bypass RPC, sync parts/images, log status).
     */
    override update(id: string, repair: Partial<Repair>): Observable<Repair> {
        const dbPayload = RepairOrderMapper.mapUpdateToDb(repair);
        const tenantId = this.tenantService.getTenantId();

        return from(
            this.supabase
                .from(this.tableName)
                .update(dbPayload)
                .eq('id', id)
                .eq('tenant_id', tenantId)
        ).pipe(
            switchMap(async (res: { error?: unknown }) => {
                const updateError = (res as { error?: { code?: string; message?: string } })?.error;

                if (updateError) {
                    const code = (updateError as { code?: string }).code ?? '';
                    const message = (updateError as { message?: string }).message ?? '';

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
                const repairRecord = repair as unknown as Record<string, unknown>;
                if ((repair as Partial<Repair>).current_status_id) {
                    await this.logStatusChange(id, (repair as Partial<Repair>).current_status_id!, repairRecord['technician_notes'] as string);
                }

                // Sync collections
                if (repairRecord['parts'] !== undefined) await this.syncParts(id, repairRecord['parts'] as RepairPart[] || []);
                if (repairRecord['images'] !== undefined) await this.syncImages(id, repairRecord['images'] as string[] || []);

                // Return the updated entity (required by BaseRepository contract)
                return repair as Repair;
            })
        );
    }

    /**
     * Fallback update path used when the normal PATCH fails due to a broken
     * AFTER UPDATE trigger. Uses the `update_repair_bypass` RPC (SECURITY DEFINER,
     * runs as owner so triggers are not fired for the specific broken one).
     * If the RPC doesn't exist yet, falls back to a raw SQL workaround.
     */
    private async _updateViaRpcBypass(id: string, payload: Record<string, unknown>, tenantId: string): Promise<void> {
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
        const safeFields: Record<string, unknown> = {};
        const criticalKeys = [
            'current_status_id', 'final_cost', 'estimated_cost', 'technician_notes',
            'technical_report', 'technical_labor_cost', 'deposit_amount',
            'completed_at', 'assigned_technician_id', 'glass_upsell',
            'security_pin', 'security_pattern', 'checklist',
            'issue_description', 'spare_part_cost', 'warranty', 'supplier_id',
            'whatsapp_notifications', 'branch_id', 'client_id', 'device_id', 'received_by'
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
        const cleanCode = code ? code.trim().toUpperCase() : '';
        return from(
            // Utilizamos la RPC segura sin maybeSingle() para evitar el error 406 de PostgREST
            this.supabase.rpc('get_repair_tracking', { p_code: cleanCode })
        ).pipe(
            map(({ data, error }) => {
                if (error) return null;
                // Extraemos el primer resultado del array si existe y validamos coincidencia exacta
                const record = data && data.length > 0 ? this.mapFromDb(data[0]) : null;
                if (record && record.tracking_code?.toLowerCase() !== cleanCode.toLowerCase()) {
                    return null;
                }
                return record;
            })
        );
    }

    getAdminList(params: { branch_id?: string, includeOrphans?: boolean, limit?: number, offset?: number, searchTerm?: string }): Observable<Repair[]> {
        const limit = params.limit || 50;
        const offset = params.offset || 0;
        
        let query = this.supabase.from(this.tableName)
            .select(`
                *,
                client:profiles!repairs_client_id_fkey(id, first_name, last_name, phone),
                assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, first_name, last_name),
                status:repair_status_types(id, name, color, icon),
                device:customer_devices!device_id(id, type, imei, passcode, model:models(name, brand_id))
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
            query = query.or(`tracking_code.ilike.%${params.searchTerm}%`);
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) {
                    console.error('[SupabaseRepairRepository] getAdminList error:', error);
                    return [];
                }
                return data ? data.map(r => this.mapFromDb(r)) : [];
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        return this.storageService.uploadFile(file, 'repairs', 'repair-images');
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
                product_id: p.product_id || null,
                quantity: Number(p.quantity) || 1,
                unit_price_at_time: Number(p.unit_price_at_time) || 0,
                cost_at_time: Number(p.cost_at_time) || 0,
                tenant_id: tenantId
            }));
            const { error: insertError } = await this.supabase.from('repair_parts_used').insert(partsToInsert);
            if (insertError) {
                console.error('❌ [syncParts] Error inserting repair parts:', insertError);
            }
        }

        const totalCost = parts.reduce((acc: number, p: RepairPart) => acc + (Number(p.cost_at_time || 0)), 0);
        const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({ spare_part_cost: totalCost }))
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
            const imagesToInsert = images.map((img: string | { image_url: string }) => ({
                repair_id: repairId,
                image_url: typeof img === 'string' ? img : img.image_url,
                tenant_id: tenantId
            }));
            await this.supabase.from('repair_images').insert(imagesToInsert);
        }
    }

    private mapFromDb(p: Record<string, unknown>): Repair {
        return RepairOrderMapper.mapFromDb(p);
    }

    private mapToDb(r: Record<string, unknown>): Record<string, unknown> {
        return RepairOrderMapper.mapCreateToDb(r);
    }



    getWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Observable<Record<string, unknown>> {
        return from(this.internalGetWorkshopSummary(branch_id, includeOrphans, month, year));
    }

    private async internalGetWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Promise<Record<string, unknown>> {
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

        const { data, error } = await (baseQuery as unknown as PromiseLike<{ data: Record<string, unknown>[], error: unknown }>);
        if (error) throw error;

        const results = data || [];
        return {
            inWorkshop: results.filter((r: Record<string, unknown>) => (r['current_status_id'] as number) < 5).length,
            readyToPickup: results.filter((r: Record<string, unknown>) => (r['current_status_id'] as number) === 5).length,
            pendingParts: results.filter((r: Record<string, unknown>) => (r['current_status_id'] as number) === 2).length,
        };
    }

    private async getMonthProfit(branch_id: string | undefined, startOfMonth: string, endOfMonth: string, includeOrphans?: boolean): Promise<number> {
        let profitQuery = this.supabase.from(this.tableName)
            .select('final_cost, spare_part_cost')
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

        const { data, error } = await (profitQuery as unknown as PromiseLike<{ data: Record<string, unknown>[], error: unknown }>);
        if (error) throw error;

        return (data || []).reduce((acc: number, r: Record<string, unknown>) => {
            return acc + (Number(r['final_cost'] || 0) - Number(r['spare_part_cost'] || 0));
        }, 0);
    }
}
