import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseError } from '../errors/application.error';
import { LoggerService } from '../services/logger.service';
import { Observable, from, map } from 'rxjs';

/**
 * Base Repository
 * Provides common CRUD operations for all entities using Observables
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
    getAll(orderBy?: { column: string; ascending?: boolean }): Observable<T[]> {
        let query = this.supabase.from(this.tableName).select('*');

        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.logger.error(`Error fetching all ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }
                return (data as T[]) || [];
            })
        );
    }

    /**
     * Find record by ID
     */
    getById(id: string): Observable<T> {
        return from(
            this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    if (error.code === 'PGRST116') throw new Error('Not found'); // Simplified error for now
                    this.logger.error(`Error fetching ${this.tableName} by ID`, error);
                    throw new DatabaseError(error.message, error);
                }
                return data as T;
            })
        );
    }

    /**
     * Create new record
     */
    create(item: Partial<T>): Observable<T> {
        return from(
            this.supabase
                .from(this.tableName)
                .insert(item)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.logger.error(`Error creating ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }
                return data as T;
            })
        );
    }

    /**
     * Update existing record
     */
    update(id: string, item: Partial<T>): Observable<T> {
        return from(
            this.supabase
                .from(this.tableName)
                .update(item)
                .eq('id', id)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                     this.logger.error(`Error updating ${this.tableName}`, error);
                     throw new DatabaseError(error.message, error);
                }
                return data as T;
            })
        );
    }

    /**
     * Delete record
     */
    delete(id: string): Observable<void> {
        return from(
            this.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id)
        ).pipe(
            map(({ error }) => {
                if (error) {
                    this.logger.error(`Error deleting ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }
            })
        );
    }

    /**
     * Find records with filter
     */
    getWhere(
        column: string,
        value: string | number | boolean | null,
        orderBy?: { column: string; ascending?: boolean }
    ): Observable<T[]> {
        let query = this.supabase
            .from(this.tableName)
            .select('*')
            .eq(column, value);

        if (orderBy) {
            query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.logger.error(`Error fetching ${this.tableName} with filter`, error);
                    throw new DatabaseError(error.message, error);
                }
                return (data as T[]) || [];
            })
        );
    }

    /**
     * Count records
     */
    count(): Observable<number> {
        return from(
             this.supabase
                .from(this.tableName)
                .select('*', { count: 'exact', head: true })
        ).pipe(
            map(({ count, error }) => {
                if (error) {
                    this.logger.error(`Error counting ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }
                return count || 0;
            })
        );
    }
}
