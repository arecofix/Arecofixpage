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
                return data as unknown as Repair;
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
                return (data || []) as unknown as Repair[];
            })
        );
    }

    create(repair: CreateRepairDto): Observable<Repair> {
        return from(this.supabase.from('repairs').insert(repair).select().single()).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as unknown as Repair;
            })
        );
    }

    update(id: string, repair: UpdateRepairDto): Observable<void> {
        return from(this.supabase.from('repairs').update(repair).eq('id', id)).pipe(
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
        // Option A: Use RPC if secure access needed (like public tracking)
        // Option B: Direct query for admin usage
        // Since this repository might be used by admin, direct query is fine if logged in.
        // For public tracking we already have a specialized RPC call in TrackingService (which could be refactored here too, but let's keep separation of concerns: Public vs Admin Repo, or Unified Repo).
        // Let's implement direct query for now.
        return from(this.supabase.from('repairs').select('*').eq('tracking_code', code).single()).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as unknown as Repair;
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await this.supabase.storage
            .from('repair-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = this.supabase.storage
            .from('repair-images')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    }
}
