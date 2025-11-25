import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseError } from '../errors/application.error';
import { LoggerService } from '../services/logger.service';

/**
 * Base Repository
 * Provides common CRUD operations for all entities
 * Eliminates code duplication across admin pages
 */
export abstract class BaseRepository<T> {
    protected abstract tableName: string;

    constructor(
        protected supabase: SupabaseClient,
        protected logger: LoggerService
    ) { }

    /**
     * Find all records
     */
    async findAll(orderBy?: { column: string; ascending?: boolean }): Promise<T[]> {
        try {
            let query = this.supabase.from(this.tableName).select('*');

            if (orderBy) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
            }

            const { data, error } = await query;

            if (error) throw new DatabaseError(error.message, error);
            return (data as T[]) || [];
        } catch (error) {
            this.logger.error(`Error fetching all ${this.tableName}`, error);
            throw error;
        }
    }

    /**
     * Find record by ID
     */
    async findById(id: string): Promise<T | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null; // Not found
                throw new DatabaseError(error.message, error);
            }

            return data as T;
        } catch (error) {
            this.logger.error(`Error fetching ${this.tableName} by ID`, error);
            throw error;
        }
    }

    /**
     * Create new record
     */
    async create(item: Partial<T>): Promise<T> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert(item)
                .select()
                .single();

            if (error) throw new DatabaseError(error.message, error);
            return data as T;
        } catch (error) {
            this.logger.error(`Error creating ${this.tableName}`, error);
            throw error;
        }
    }

    /**
     * Update existing record
     */
    async update(id: string, item: Partial<T>): Promise<T> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(item)
                .eq('id', id)
                .select()
                .single();

            if (error) throw new DatabaseError(error.message, error);
            return data as T;
        } catch (error) {
            this.logger.error(`Error updating ${this.tableName}`, error);
            throw error;
        }
    }

    /**
     * Delete record
     */
    async delete(id: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) throw new DatabaseError(error.message, error);
        } catch (error) {
            this.logger.error(`Error deleting ${this.tableName}`, error);
            throw error;
        }
    }

    /**
     * Toggle active status
     */
    async toggleStatus(id: string, currentStatus: boolean): Promise<T> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update({ is_active: !currentStatus })
                .eq('id', id)
                .select()
                .single();

            if (error) throw new DatabaseError(error.message, error);
            return data as T;
        } catch (error) {
            this.logger.error(`Error toggling ${this.tableName} status`, error);
            throw error;
        }
    }

    /**
     * Find records with filter
     */
    async findWhere(
        column: string,
        value: any,
        orderBy?: { column: string; ascending?: boolean }
    ): Promise<T[]> {
        try {
            let query = this.supabase
                .from(this.tableName)
                .select('*')
                .eq(column, value);

            if (orderBy) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
            }

            const { data, error } = await query;

            if (error) throw new DatabaseError(error.message, error);
            return (data as T[]) || [];
        } catch (error) {
            this.logger.error(`Error fetching ${this.tableName} with filter`, error);
            throw error;
        }
    }

    /**
     * Count records
     */
    async count(): Promise<number> {
        try {
            const { count, error } = await this.supabase
                .from(this.tableName)
                .select('*', { count: 'exact', head: true });

            if (error) throw new DatabaseError(error.message, error);
            return count || 0;
        } catch (error) {
            this.logger.error(`Error counting ${this.tableName}`, error);
            throw error;
        }
    }
}
