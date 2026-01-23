import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { Observable, from, map } from 'rxjs';

/**
 * Product Repository Implementation
 * Handles all database operations for products using Supabase
 */
@Injectable({ providedIn: 'root' })
export class SupabaseProductRepository extends BaseRepository<Product> implements ProductRepository {
    protected tableName = 'products';

    constructor() {
        const authService = inject(AuthService);
        const logger = inject(LoggerService);
        super(authService.getSupabaseClient(), logger);
    }

    /**
     * Find products with low stock
     */
    findLowStock(threshold: number = 10): Observable<Product[]> {
        return from(
            this.supabase
                .from(this.tableName)
                .select('*')
                .lte('stock', threshold)
                .order('stock', { ascending: true })
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.logger.error('Error fetching low stock products', error);
                    throw error;
                }
                return (data as Product[]) || [];
            })
        );
    }

    /**
     * Find active products with stock
     */
    findAvailable(): Observable<Product[]> {
        return from(
            this.supabase
                .from(this.tableName)
                .select('*')
                .eq('is_active', true)
                .gt('stock', 0)
                .order('name')
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                     this.logger.error('Error fetching available products', error);
                     throw error;
                }
                return (data as Product[]) || [];
            })
        );
    }
}
