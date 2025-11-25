import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Category } from '../../domain/entities/category.entity';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

/**
 * Category Repository
 * Handles all database operations for categories
 */
@Injectable({ providedIn: 'root' })
export class CategoryRepository extends BaseRepository<Category> {
    protected tableName = 'categories';

    constructor() {
        const authService = inject(AuthService);
        const logger = inject(LoggerService);
        super(authService.getSupabaseClient(), logger);
    }
}
