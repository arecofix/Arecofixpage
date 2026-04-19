import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

/**
 * Brand Repository
 * Handles all database operations for brands
 */
@Injectable({ providedIn: 'root' })
export class SupabaseBrandRepository extends BaseRepository<Brand> implements BrandRepository {
    protected override tableName = 'brands';

    constructor() {
        const supabase = inject(SUPABASE_CLIENT);
        const logger = inject(LoggerService);
        super(supabase, logger);
    }
}
