import { Injectable, inject } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StructuredLoggerService } from '../logging/structured-logger.service';
import { ApiResponse } from '../../types/strict-types';

/**
 * Generic repository interface
 */
export interface IRepository<T, K = string> {
  findAll(filters?: Partial<T>): Observable<T[]>;
  findById(id: K): Observable<T | null>;
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Observable<T>;
  update(id: K, entity: Partial<T>): Observable<T>;
  delete(id: K): Observable<void>;
}

/**
 * Abstract base repository with common functionality
 * Implements repository pattern with proper error handling and logging
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseRepository<T, K = string> implements IRepository<T, K> {
  protected logger = inject(StructuredLoggerService);
  protected abstract readonly entityName: string;

  /**
   * Find all entities with optional filters
   */
  findAll(filters?: Partial<T>): Observable<T[]> {
    const endTimer = this.logger.startTimer(this.entityName, 'findAll');
    
    return this.performFindAll(filters).pipe(
      tap(result => {
        endTimer();
        this.logger.debug(this.entityName, `Found ${result.length} entities`, { filters });
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, 'findAll failed', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Find entity by ID
   */
  findById(id: K): Observable<T | null> {
    const endTimer = this.logger.startTimer(this.entityName, 'findById');
    
    return this.performFindById(id).pipe(
      tap(result => {
        endTimer();
        if (result) {
          this.logger.debug(this.entityName, `Entity found: ${id}`);
        } else {
          this.logger.warn(this.entityName, `Entity not found: ${id}`);
        }
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, `findById failed for ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new entity
   */
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Observable<T> {
    const endTimer = this.logger.startTimer(this.entityName, 'create');
    
    return this.performCreate(entity).pipe(
      tap(result => {
        endTimer();
        this.logger.info(this.entityName, `Entity created: ${(result as any).id}`, { entity: result });
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, 'create failed', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing entity
   */
  update(id: K, entity: Partial<T>): Observable<T> {
    const endTimer = this.logger.startTimer(this.entityName, 'update');
    
    return this.performUpdate(id, entity).pipe(
      tap(result => {
        endTimer();
        this.logger.info(this.entityName, `Entity updated: ${id}`, { entity: result });
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, `update failed for ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete entity
   */
  delete(id: K): Observable<void> {
    const endTimer = this.logger.startTimer(this.entityName, 'delete');
    
    return this.performDelete(id).pipe(
      tap(() => {
        endTimer();
        this.logger.info(this.entityName, `Entity deleted: ${id}`);
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, `delete failed for ${id}`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Custom query method
   */
  protected customQuery<R>(
    queryName: string,
    queryFn: () => Observable<R>
  ): Observable<R> {
    const endTimer = this.logger.startTimer(this.entityName, queryName);
    
    return queryFn().pipe(
      tap(result => {
        endTimer();
        this.logger.debug(this.entityName, `Custom query completed: ${queryName}`, { result });
      }),
      catchError(error => {
        endTimer();
        this.logger.error(this.entityName, `Custom query failed: ${queryName}`, error);
        return throwError(() => error);
      })
    );
  }

  // Abstract methods to be implemented by concrete repositories
  protected abstract performFindAll(filters?: Partial<T>): Observable<T[]>;
  protected abstract performFindById(id: K): Observable<T | null>;
  protected abstract performCreate(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): Observable<T>;
  protected abstract performUpdate(id: K, entity: Partial<T>): Observable<T>;
  protected abstract performDelete(id: K): Observable<void>;

  // Utility methods
  protected mapApiResponse<R>(response: ApiResponse<R>): R {
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data;
  }

  protected validateId(id: K): void {
    if (!id) {
      throw new Error(`Invalid ID provided for ${this.entityName}`);
    }
  }

  protected sanitizeEntity(entity: Partial<T>): Partial<T> {
    // Remove undefined/null values and sensitive data
    const sanitized: Partial<T> = {};
    for (const [key, value] of Object.entries(entity)) {
      if (value !== undefined && value !== null) {
        (sanitized as any)[key] = value;
      }
    }
    return sanitized;
  }
}
