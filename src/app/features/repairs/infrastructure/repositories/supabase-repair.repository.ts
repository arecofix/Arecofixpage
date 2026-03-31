import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairPart } from '../../domain/entities/repair.entity';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { DatabaseError } from '@app/core/errors/application.error';

@Injectable({
    providedIn: 'root'
})
export class SupabaseRepairRepository extends RepairRepository {
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);
    private supabase = this.auth.getSupabaseClient();
    
    protected useSoftDeletes = true;

    private applyTenantFilter(query: any) {
        const tenantId = this.tenantService.getTenantId();
        let enhancedQuery = query;

        // If tenantId is our fallback (zeros), bypass direct eq filter 
        // and allow Supabase RLS policies to handle identification.
        if (tenantId !== '00000000-0000-0000-0000-000000000000') {
            enhancedQuery = enhancedQuery.eq('tenant_id', tenantId);
        }

        if (this.useSoftDeletes) {
            enhancedQuery = enhancedQuery.is('deleted_at', null);
        }
        return enhancedQuery;
    }

    getById(id: string): Observable<Repair | null> {
        let query = this.supabase.from('repairs')
            .select('*, parts:repair_parts_used(*), images:repair_images(image_url)')
            .eq('id', id);

        return from((this.applyTenantFilter(query) as any).maybeSingle()).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw new DatabaseError(error.message, error);
                return data ? this.mapFromDb(data) : null;
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
        const { parts, images, ...baseRepair } = repair as any;
        const payload = this.mapToDb(baseRepair);
        payload.tenant_id = this.tenantService.getTenantId(); // Inyectar tenant forzoso
        
        return from(this.supabase.from('repairs').insert(payload).select().single() as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                return data;
            }),
            switchMap(async (data: any) => {
                if (parts && parts.length > 0) {
                    await this.syncParts(data.id, parts);
                }
                if (images && images.length > 0) {
                    await this.syncImages(data.id, images);
                }
                const repairWithParts = { ...data, parts: parts || [], images: images || [] };
                return this.mapFromDb(repairWithParts);
            })
        );
    }

    update(id: string, repair: UpdateRepairDto): Observable<void> {
        const { parts, images, ...baseRepair } = repair as any;
        const payload = this.mapToDb(baseRepair);
        
        let query = this.supabase.from('repairs').update(payload).eq('id', id).select();

        return from(this.applyTenantFilter(query) as any).pipe(
            map((res: any) => {
                const { error, data } = res;
                if (error) throw error;
                return data;
            }),
            switchMap(async () => {
                if (parts) {
                    await this.syncParts(id, parts);
                }
                if (images) {
                    await this.syncImages(id, images);
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

    private async syncImages(repairId: string, images: string[]): Promise<void> {
        const tenantId = this.tenantService.getTenantId();
        await this.supabase.from('repair_images').delete().eq('repair_id', repairId).eq('tenant_id', tenantId);
        
        if (images && images.length > 0) {
            const imagesToInsert = images.map(img => ({
                repair_id: repairId,
                image_url: typeof img === 'string' ? img : (img as any).image_url,
                tenant_id: tenantId
            }));
            await this.supabase.from('repair_images').insert(imagesToInsert);
        }
    }

    delete(id: string): Observable<void> {
        let query = this.supabase.from('repairs').update({ deleted_at: new Date().toISOString() }).eq('id', id);
        return from(this.applyTenantFilter(query) as any).pipe(
            map((res: any) => {
                const { error } = res;
                if (error) throw error;
            })
        );
    }

    getByTrackingCode(code: string): Observable<Repair | null> {
        // Use RPC function to bypass RLS for public tracking access
        return from(this.supabase.rpc('get_repair_by_tracking', { t_code: code }) as any).pipe(
            map((res: any) => {
                const { data, error } = res;
                if (error) throw error;
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    return null;
                }
                const repairData = Array.isArray(data) ? data[0] : data;
                return this.mapFromDb(repairData);
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
            .select('*, parts:repair_parts_used(*)')
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
            customer_id: data.client_id, // Mapear client_id de DB a customer_id de Entidad
            device_brand: data.device_brand || 'generic', 
            device_type: data.device_type || 'smartphone',
            images: data.images 
                ? data.images.map((img: any) => typeof img === 'string' ? img : (img.image_url || img)) 
                : []
        } as Repair;
    }

    private mapToDb(entity: Partial<UpdateRepairDto>): any {
        const { images, parts, customer_id, ...payload } = entity as any;
        
        // Mapear customer_id de Entidad a client_id de DB
        if (customer_id) {
            payload.client_id = customer_id;
        }

        // Asegurar que device_brand y device_type tengan valores si faltan
        payload.device_brand = payload.device_brand || 'generic';
        payload.device_type = payload.device_type || 'smartphone';

        // Ensure device_model doesn't end up with duplicate brands
        if (payload.device_brand && payload.device_brand.toLowerCase() !== 'generic' && payload.device_model) {
            const brand = payload.device_brand.toLowerCase();
            const model = payload.device_model.toLowerCase();
            
            if (!model.startsWith(brand)) {
                payload.device_model = `${payload.device_brand} ${payload.device_model}`.trim();
            }
        }

        return payload;
    }
}
