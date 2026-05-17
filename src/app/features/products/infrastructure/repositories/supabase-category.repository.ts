import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

/**
 * Category Repository
 * Handles all database operations for categories
 */
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

/**
 * Category Repository
 * Handles all database operations for categories
 */
@Injectable({ providedIn: 'root' })
export class SupabaseCategoryRepository extends BaseRepository<Category> implements CategoryRepository {
    protected override tableName = 'categories';
    protected override suppressAuthNotifications = true;

    constructor() {
        const supabase = inject(SUPABASE_CLIENT);
        const logger = inject(LoggerService);
        super(supabase, logger);
    }
}
