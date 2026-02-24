import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairPart } from '../../domain/entities/repair.entity';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseRepairRepository extends RepairRepository {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);
    private supabase = this.auth.getSupabaseClient();
    
    protected useSoftDeletes = true;

    private applyTenantFilter(query: any) {
        let enhancedQuery = query.eq('tenant_id', this.tenantService.getTenantId());
        if (this.useSoftDeletes) {
            enhancedQuery = enhancedQuery.is('deleted_at', null);
        }
        return enhancedQuery;
    }

    getById(id: string): Observable<Repair> {
        let query = this.supabase.from('repairs')
            .select('*, parts:repair_parts_used(*)')
            .eq('id', id);

        return from(this.applyTenantFilter(query).single() as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    getAll(limit: number = 50, offset: number = 0): Observable<Repair[]> {
        let query = this.supabase
            .from('repairs')
            .select('*')
            .range(offset, offset + limit - 1);
            
        let filteredQuery = this.applyTenantFilter(query).order('created_at', { ascending: false });

        return from(filteredQuery as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return (data || []).map((item: any) => this.mapFromDb(item));
            })
        );
    }

    create(repair: CreateRepairDto): Observable<Repair> {
        const payload = this.mapToDb(repair);
        payload.tenant_id = this.tenantService.getTenantId(); // Inyectar tenant forzoso
        
        return from(this.supabase.from('repairs').insert(payload).select().single() as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    update(id: string, repair: UpdateRepairDto): Observable<void> {
        const { parts, ...baseRepair } = repair;
        const payload = this.mapToDb(baseRepair);
        
        let query = this.supabase.from('repairs').update(payload).eq('id', id);

        return from(this.applyTenantFilter(query) as any).pipe(
            map((res: any) => {
                const { error, data } = res;
                if (error) throw error;
                if (parts) {
                    this.syncParts(id, parts);
                }
            })
        );
    }

    private async syncParts(repairId: string, parts: RepairPart[]): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        await this.supabase.from('repair_parts_used').delete().eq('repair_id', repairId).eq('tenant_id', tenantId);
        
        if (parts.length > 0) {
            const partsToInsert = parts.map(p => ({
                repair_id: repairId,
                product_id: p.product_id,
                quantity: p.quantity,
                unit_price_at_time: p.unit_price_at_time,
                cost_at_time: p.cost_at_time,
                tenant_id: tenantId
            }));
            await this.supabase.from('repair_parts_used').insert(partsToInsert);
        }
    }

    delete(id: string): Observable<void> {
        let query = this.supabase.from('repairs').delete().eq('id', id);
        return from(this.applyTenantFilter(query) as any).pipe(
            map((res: any) => {
                const { error } = res;
                if (error) throw error;
            })
        );
    }

    getByTrackingCode(code: string): Observable<Repair> {
        // Since get_repair_by_tracking RPC might bypass RLS if using SECURITY DEFINER, or we aren't sending tenant id,
        // it's better to query directly for the scope of the tenant to avoid leakage.
        let query = this.supabase
            .from('repairs')
            .select('*, parts:repair_parts_used(*)')
            .eq('tracking_code', code);
            
        return from(this.applyTenantFilter(query).single() as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const tenantStr = this.tenantService.getTenantId();
        const fileName = `${tenantStr}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await this.supabase.storage
            .from('repair-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = this.supabase.storage
            .from('repair-images')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    }

    getAdminList(params: { branch_id?: string; limit?: number; offset?: number }): Observable<Repair[]> {
        const { branch_id, limit = 50, offset = 0 } = params;
        
        let query = this.supabase
            .from('repairs')
            .select('*')
            .range(offset, offset + limit - 1);

        if (branch_id) {
            query = query.eq('branch_id', branch_id);
        }

        let filteredQuery = this.applyTenantFilter(query).order('received_at', { ascending: false });

        return from(filteredQuery as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return (data || []).map((item: any) => this.mapFromDb(item));
            })
        );
    }

    private mapFromDb(data: any): Repair {
        return {
            ...data,
            device_brand: data.device_brand || 'generic', 
        } as Repair;
    }

    private mapToDb(entity: Partial<UpdateRepairDto>): any {
        const { device_brand, device_type, ...rest } = entity;
        const payload: any = { ...rest };
        
        // Handle device_model concatenation if brand/type provided externally
        if (device_brand || device_type) {
            let model = payload.device_model || '';
            if (device_brand && device_brand.toLowerCase() !== 'generic') {
                model = `${device_brand} ${model}`;
            }
            if (device_type && device_type !== 'smartphone') {
                model = `${model} (${device_type})`;
            }
            payload.device_model = model.trim();
        }

        return payload;
    }
}
