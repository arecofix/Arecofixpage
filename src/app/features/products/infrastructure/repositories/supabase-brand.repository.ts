import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import { LoggerService } from '@app/core/services/logger.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { Observable, from, firstValueFrom } from 'rxjs';

/**
 * Brand Repository
 * Handles all database operations for brands with safe storefront public fallback
 */
@Injectable({ providedIn: 'root' })
export class SupabaseBrandRepository extends BaseRepository<Brand> implements BrandRepository {
    protected override tableName = 'brands';
    protected override useSoftDeletes = true;
    protected override suppressAuthNotifications = true;
    protected override useBranchIsolation = true;

    constructor() {
        const supabase = inject(SUPABASE_CLIENT);
        const logger = inject(LoggerService);
        super(supabase, logger);
    }

    override getAll(orderBy?: { column: string; ascending?: boolean }): Observable<Brand[]> {
        return from(
            (async () => {
                const primary = await firstValueFrom(super.getAll(orderBy));
                if (primary && primary.length > 0) return primary;
                // Safe anonymous storefront fallback via public_brand_profile
                const { data, error } = await this.supabase
                    .from('public_brand_profile')
                    .select('*')
                    .order(orderBy?.column || 'name', { ascending: orderBy?.ascending ?? true });
                if (error || !data) return [];
                return data as unknown as Brand[];
            })()
        );
    }
}
