import { Injectable, inject } from '@angular/core';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { Product } from '../../domain/entities/product.entity';
import { AuthService } from '@app/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';

/**
 * Product Repository
 * Handles all database operations for products
 */
@Injectable({ providedIn: 'root' })
export class ProductRepository extends BaseRepository<Product> {
    protected tableName = 'products';

    constructor() {
        const authService = inject(AuthService);
        const logger = inject(LoggerService);
        super(authService.getSupabaseClient(), logger);
    }

    /**
     * Find products with low stock
     */
    async findLowStock(threshold: number = 10): Promise<Product[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .lte('stock', threshold)
                .order('stock', { ascending: true });

            if (error) throw error;
            return (data as Product[]) || [];
        } catch (error) {
            this.logger.error('Error fetching low stock products', error);
            throw error;
        }
    }

    /**
     * Find active products with stock
     */
    async findAvailable(): Promise<Product[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('is_active', true)
                .gt('stock', 0)
                .order('name');

            if (error) throw error;
            return (data as Product[]) || [];
        } catch (error) {
            this.logger.error('Error fetching available products', error);
            throw error;
        }
    }
}
