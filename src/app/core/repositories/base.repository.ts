import { SupabaseClient } from '@supabase/supabase-js';
import { inject } from '@angular/core';
import { SupabaseErrorHandlerService } from '../services/supabase-error-handler.service';
import { TenantService } from '../services/tenant.service';
import { Observable, from, map } from 'rxjs';
import { TENANT_CONSTANTS } from '../constants/tenant.constants';
import { LoggerService } from '../services/logger.service';

/**
 * Base Repository (SaaS Architecture)
 * Provides centralized CRUD logic with automatic multi-tenant isolation.
 * Implements DRY principle for pagination and error handling.
 */
export abstract class BaseRepository<T extends { id?: string; tenant_id?: string }> {
    protected abstract tableName: string;
    
    protected isGlobalTable: boolean = false;
    protected useSoftDeletes: boolean = false;

    protected tenantService = inject(TenantService);
    protected errorHandler = inject(SupabaseErrorHandlerService);

    constructor(
        protected supabase: SupabaseClient,
        protected logger: LoggerService
    ) { }

    /**
     * Applies SaaS context and soft-delete filters to a query.
     */
    protected applyTenantFilter<U>(query: any): any {
        let enhancedQuery = query;

        if (!this.isGlobalTable) {
            const tenantId = this.tenantService.getTenantId();
            if (tenantId !== TENANT_CONSTANTS.FALLBACK_ID) {
                if (enhancedQuery && typeof enhancedQuery.eq === 'function') {
                    enhancedQuery = enhancedQuery.eq('tenant_id', tenantId);
                } else if (enhancedQuery) {
                    console.warn(`[BaseRepository] applyTenantFilter: .eq() missing on query for ${this.tableName}`);
                }
            }
        }

        if (this.useSoftDeletes) {
            if (enhancedQuery && typeof enhancedQuery.is === 'function') {
                enhancedQuery = enhancedQuery.is('deleted_at', null);
            }
        }

        return enhancedQuery;
    }

    /**
     * Adds tenant_id to a payload for inserts/upserts if not a global table.
     */
    protected sanitizePayload(item: any): any {
        if (this.isGlobalTable) return { ...item };
        
        const tenantId = this.tenantService.getTenantId();
        if (tenantId === TENANT_CONSTANTS.FALLBACK_ID) return { ...item };
        
        return { ...item, tenant_id: tenantId };
    }

    /**
     * Internal helper to fetch data in chunks (Supabase 1000 row limit workaround).
     */
    private async fetchPaginated(
        queryBuilder: () => any,
        options?: { column?: string; ascending?: boolean; select?: string }
    ): Promise<T[]> {
        let allData: T[] = [];
        let fromIdx = 0;
        let hasMore = true;
        const CHUNK = 1000;

        while (hasMore) {
            let query = queryBuilder();
            query = this.applyTenantFilter(query);

            if (options?.column) {
                query = query.order(options.column, { ascending: options.ascending ?? true });
            }

            const { data, error } = await query.range(fromIdx, fromIdx + CHUNK - 1);

            if (error) {
                this.errorHandler.handleError(error, `PaginatedFetch ${this.tableName}`);
                throw error;
            }

            const batch = data || [];
            allData = [...allData, ...batch];
            
            if (batch.length < CHUNK) {
                hasMore = false;
            } else {
                fromIdx += CHUNK;
            }
        }
        return allData;
    }

    getAll(options?: { column?: string; ascending?: boolean; select?: string }): Observable<T[]> {
        return from(this.fetchPaginated(
            () => this.supabase.from(this.tableName).select(options?.select || '*'),
            options
        ));
    }

    getById(id: string): Observable<T | null> {
        let query = this.supabase.from(this.tableName).select('*').eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query.maybeSingle()).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.errorHandler.handleError(error, `getById ${this.tableName}`);
                }
                return data as T | null;
            })
        );
    }

    create(item: Partial<T>): Observable<T> {
        const payload = this.sanitizePayload(item);

        return from(
            this.supabase
                .from(this.tableName)
                .insert(payload as any)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.errorHandler.handleError(error, `create ${this.tableName}`);
                }
                return data as T;
            })
        );
    }

    update(id: string, item: Partial<T>): Observable<T> {
        const payload = { ...item };
        delete (payload as any).tenant_id;
        delete (payload as any).id;

        let query = this.supabase.from(this.tableName).update(payload as any).eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query.select().single()).pipe(
            map(({ data, error }) => {
                if (error) {
                    this.errorHandler.handleError(error, `update ${this.tableName}`);
                }
                return data as T;
            })
        );
    }

    delete(id: string): Observable<void> {
        let query = this.supabase.from(this.tableName).delete().eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query).pipe(
            map(({ error }) => {
                if (error) {
                    this.errorHandler.handleError(error, `delete ${this.tableName}`);
                }
            })
        );
    }

    getWhere(
        column: string,
        value: string | number | boolean | null,
        orderBy?: { column: string; ascending?: boolean }
    ): Observable<T[]> {
        return from(this.fetchPaginated(
            () => this.supabase.from(this.tableName).select('*').eq(column, value),
            orderBy
        ));
    }

    count(): Observable<number> {
        let query = this.supabase
            .from(this.tableName)
            .select('*', { count: 'exact', head: true });
            
        query = this.applyTenantFilter(query);

        return from(query).pipe(
            map(({ count, error }) => {
                if (error) {
                    this.errorHandler.handleError(error, `count ${this.tableName}`);
                }
                return count || 0;
            })
        );
    }
}
