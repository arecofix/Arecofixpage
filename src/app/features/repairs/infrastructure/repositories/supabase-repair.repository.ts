import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto } from '../../domain/entities/repair.entity';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseRepairRepository extends RepairRepository {
    private auth = inject(AuthService);
    private supabase = this.auth.getSupabaseClient();

    getById(id: string): Observable<Repair> {
        return from(this.supabase.from('repairs').select('*').eq('id', id).single()).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    getAll(limit: number = 50, offset: number = 0): Observable<Repair[]> {
        return from(
            this.supabase
                .from('repairs')
                .select('*')
                .range(offset, offset + limit - 1)
                .order('created_at', { ascending: false })
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return (data || []).map(item => this.mapFromDb(item));
            })
        );
    }

    create(repair: CreateRepairDto): Observable<Repair> {
        const payload = this.mapToDb(repair);
        return from(this.supabase.from('repairs').insert(payload).select().single()).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    update(id: string, repair: UpdateRepairDto): Observable<void> {
        const payload = this.mapToDb(repair);
        return from(this.supabase.from('repairs').update(payload).eq('id', id)).pipe(
            map(({ error }) => {
                if (error) throw error;
            })
        );
    }

    delete(id: string): Observable<void> {
        return from(this.supabase.from('repairs').delete().eq('id', id)).pipe(
            map(({ error }) => {
                if (error) throw error;
            })
        );
    }

    getByTrackingCode(code: string): Observable<Repair> {
        return from(this.supabase.from('repairs').select('*').eq('tracking_code', code).single()).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return this.mapFromDb(data);
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
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

    private mapFromDb(data: any): Repair {
        return {
            ...data,
            // Fallback: if device_brand is missing in DB but brand exists, use brand. 
            // If device_brand is in DB, use it.
            device_brand: data.device_brand || data.brand || 'generic', 
        } as Repair;
    }

    private mapToDb(entity: Partial<CreateRepairDto>): any {
        // Destructure fields that do NOT exist in the 'repairs' table
        const { device_brand, device_type, notes, ...rest } = entity;
        
        const payload: any = { ...rest };
        
        // Preserve Brand and Type by prepending to device_model if valid
        // Schema only has 'device_model'
        let model = payload.device_model || '';
        if (device_brand && device_brand.toLowerCase() !== 'generic') {
            model = `${device_brand} ${model}`;
        }
        if (device_type && device_type !== 'smartphone') {
            model = `${model} (${device_type})`;
        }
        payload.device_model = model.trim();

        // Ensure 'brand' is NOT in payload (in case it was added by previous logic)
        delete payload.brand; 
        
        return payload;
    }
}
