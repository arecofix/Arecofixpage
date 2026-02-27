import { SupabaseClient } from '@supabase/supabase-js';
import { inject } from '@angular/core';
import { DatabaseError } from '../errors/application.error';
import { LoggerService } from '../services/logger.service';
import { TenantService } from '../services/tenant.service';
import { Observable, from, map } from 'rxjs';

/**
 * Base Repository (SaaS Architecture)
 * Proporciona métodos CRUD genéricos mutados. Automáticamente inyecta 
 * y aísla métricas y datos por "tenant_id" sin que Frontend deba pensarlo.
 */
export abstract class BaseRepository<T extends { id?: string; tenant_id?: string }> {
    protected abstract tableName: string;
    
    // Lista de tablas globales del sistema (Ejemplo). Para estas NO aplicamos Tenant Filter.
    // Configura aquí si alguna tabla (ej. planes de precios base) es global para toda la app.
    protected isGlobalTable: boolean = false;

    // Define si la tabla utiliza la columna "deleted_at" para borrado lógico (Soft Deletes)
    protected useSoftDeletes: boolean = false;

    // Se inyecta al vuelo. Evita tener que pasarlo a mano en constructores hijos 
    protected tenantService = inject(TenantService);

    constructor(
        protected supabase: SupabaseClient,
        protected logger: LoggerService
    ) { }

    /**
     * Aplica el contexto SaaS automáticamente si la tabla no es global.
     * También aplica el filtro de Soft Deletes si la tabla lo soporta.
     */
    protected applyTenantFilter(query: any) {
        let enhancedQuery = query;

        if (!this.isGlobalTable) {
            const tenantId = this.tenantService.getTenantId();
            enhancedQuery = enhancedQuery.eq('tenant_id', tenantId);
        }

        if (this.useSoftDeletes) {
            enhancedQuery = enhancedQuery.is('deleted_at', null);
        }

        return enhancedQuery;
    }

    /**
     * Find all records for the current Tenant
     */
    getAll(orderBy?: { column: string; ascending?: boolean }): Observable<T[]> {
        const fetchAll = async (): Promise<T[]> => {
            let allData: T[] = [];
            let fromIdx = 0;
            let hasMore = true;
            const CHUNK = 1000;

            while (hasMore) {
                let query = this.supabase.from(this.tableName).select('*');
                query = this.applyTenantFilter(query);

                if (orderBy) {
                    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
                }

                const { data, error } = await (query.range(fromIdx, fromIdx + CHUNK - 1) as any);

                if (error) {
                    this.logger.error(`Error fetching all ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }

                const batch = (data as T[]) || [];
                allData = [...allData, ...batch];

                if (batch.length < CHUNK) {
                    hasMore = false;
                } else {
                    fromIdx += CHUNK;
                }
            }
            return allData;
        };

        return from(fetchAll());
    }

    /**
     * Find record by ID (safely isolated within current Tenant)
     */
    getById(id: string): Observable<T> {
        let query = this.supabase.from(this.tableName).select('*').eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query.single()).pipe(
            map(({ data, error }) => {
                if (error) {
                    if (error.code === 'PGRST116') throw new Error('Not found'); // Simplificado para componente que usa catchError
                    this.logger.error(`Error fetching ${this.tableName} by ID`, error);
                    throw new DatabaseError(error.message, error);
                }
                return data as T;
            })
        );
    }

    /**
     * Create new record (Automáticamente empaca el Tenant ID)
     */
    create(item: Partial<T>): Observable<T> {
        const payload = this.isGlobalTable 
            ? item 
            : { ...item, tenant_id: this.tenantService.getTenantId() };

        return from(
            this.supabase
                .from(this.tableName)
                .insert(payload as any)
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
     * Update existing record (Safely within tenant isolation)
     */
    update(id: string, item: Partial<T>): Observable<T> {
        // En una actualización, Supabase bloquea cambiar IDs seguros (no re-mandar tenant_id es buena práctica)
        const payload = { ...item };
        delete payload.tenant_id; // Evita error de modificación inmutable SQL
        delete payload.id;

        let query = this.supabase.from(this.tableName).update(payload).eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query.select().single()).pipe(
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
     * Delete record (Aislado fuertemente)
     */
    delete(id: string): Observable<void> {
        let query = this.supabase.from(this.tableName).delete().eq('id', id);
        query = this.applyTenantFilter(query);

        return from(query).pipe(
            map(({ error }) => {
                if (error) {
                    this.logger.error(`Error deleting ${this.tableName}`, error);
                    throw new DatabaseError(error.message, error);
                }
            })
        );
    }

    /**
     * Find records with custom filter (Aislado)
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
        
        query = this.applyTenantFilter(query);

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
     * Count records natively at database level
     */
    count(): Observable<number> {
        let query = this.supabase
            .from(this.tableName)
            .select('*', { count: 'exact', head: true });
            
        query = this.applyTenantFilter(query);

        return from(query).pipe(
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
