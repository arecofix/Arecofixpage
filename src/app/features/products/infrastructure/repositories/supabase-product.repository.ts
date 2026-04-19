import { Injectable, inject } from '@angular/core';
import { Observable, from, of, firstValueFrom } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { ProductRepository, ImportProductSummary, BulkPriceUpdate } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';
import { SearchUtils } from '@app/shared/utils/search.utils';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { ProductMapper } from '../mappers/product.mapper';
import { SupabaseErrorHandlerService } from '@app/core/services/supabase-error-handler.service';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseProductRepository extends BaseRepository<Product> implements ProductRepository {
  protected override tableName = 'products';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = true;

  private stockService = inject(StockManagementService);

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  findWithFilters(params: ProductsParams = {}): Observable<ProductsResponse> {
    const {
      _page = 1,
      _per_page = 10,
      category_id,
      brand_id,
      description,
      featured,
      id,
      name,
      price,
      slug,
      min_price,
      max_price,
      minimal = true,
      branch_id: paramBranchId
    } = params;
    
    const branch_id = paramBranchId;

    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;

    let selectFields = `
      id, name, slug, description, price, currency, unit_cost_at_time, image_url, category_id, brand_id, 
      is_active, is_featured, sku, barcode, stock, created_at, updated_at, is_global, branch_id,
      media_metadata,
      branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert),
      branches(name)
    `;

    if (!minimal) {
      selectFields += ', gallery_urls';
    }

    let baseQuery = this.supabase
      .from('products')
      .select(selectFields, { count: 'exact' });
      
    let query = this.applyTenantFilter(baseQuery);

    if (params.is_active !== undefined) {
      query = query.eq('is_active', params.is_active);
    } else if (!params.include_inactive) {
      query = query.eq('is_active', true);
    }

    if (params.category_ids && params.category_ids.length > 0) {
      query = query.in('category_id', params.category_ids);
    } else if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (branch_id) {
        query = query.or(`branch_id.eq.${branch_id},is_global.is.true`);
    }
    if (description) query = query.ilike('description', `%${description}%`);
    if (featured !== null && featured !== undefined) query = query.eq('is_featured', featured);
    if (id) query = query.eq('id', id);
    if (params.ids && params.ids.length > 0) query = query.in('id', params.ids);
    if (name) query = query.ilike('name', `%${name}%`);
    if (price) query = query.eq('price', price);
    if (slug) query = query.eq('slug', slug);
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    
    if (params.stock_status) {
      if (params.stock_status === 'out_of_stock') {
        query = query.eq('stock', 0);
      } else if (params.stock_status === 'low_stock') {
        query = query.gt('stock', 0).lte('stock', 5);
      }
    }
    
    if (params.q) {
      const queryStr = params.q.trim();
      if (queryStr) {
        // Use PostgreSQL Full Text Search for better performance and ranking
        // This requires 'search_tsv' column in the database
        query = query.textSearch('search_tsv', queryStr, { 
          config: 'spanish', 
          type: 'websearch' 
        });
      }
    }

    query = query.order(params._sort || 'created_at', { ascending: params._order === 'asc' });
    query = query.range(start, end);

    return from(query as any).pipe(
      map((res: any) => {
        const { data, count, error } = res;
        if (error) this.errorHandler.handleError(error, 'findWithFilters');

        const totalItems = count || 0;
        const pages = Math.max(1, Math.ceil(totalItems / _per_page));

        let products = (data || []).map((p: any) => ProductMapper.mapFromDb(p));
        
        if (params.q) {
          products = products.sort((a: Product, b: Product) => {
              const scoreA = SearchUtils.getRelevanceScore(a.name, params.q!);
              const scoreB = SearchUtils.getRelevanceScore(b.name, params.q!);
              return scoreB - scoreA;
          });
        }

        return {
          pages,
          items: totalItems,
          data: products,
        } as unknown as ProductsResponse;
      })
    );
  }

  findLowStock(threshold: number = 5): Observable<Product[]> {
    const selectFields = `
      id, name, slug, description, price, currency, unit_cost_at_time, image_url, category_id, brand_id, 
      is_active, is_featured, sku, barcode, stock, created_at, updated_at, is_global, 
      branch_stock:product_stock_per_branch(quantity, branch_id)
    `;

    const query = this.applyTenantFilter(
      this.supabase.from(this.tableName).select(selectFields)
    );

    return from(query as any).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) this.errorHandler.handleError(error, 'findLowStock');
        return (data || [])
            .map((p: any) => ProductMapper.mapFromDb(p))
            .filter((p: Product) => p.stock < threshold);
      })
    );
  }

  findAvailable(): Observable<Product[]> {
    const fetchAll = async (): Promise<Product[]> => {
      let allData: Product[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;
      const select = `id, name, slug, price, stock, is_active, is_global`;

      while (hasMore) {
        const query = this.applyTenantFilter(this.supabase.from('products').select(select))
          .eq('is_active', true)
          .range(fromIdx, fromIdx + CHUNK - 1);
        
        const { data, error } = await (query as any);
        if (error) this.errorHandler.handleError(error, 'findAvailable');
        
        const products = (data || []).map((p: any) => ProductMapper.mapFromDb(p));
        allData = [...allData, ...products];
        hasMore = products.length === CHUNK;
        fromIdx += CHUNK;
      }
      return allData;
    };
    return from(fetchAll());
  }

  override getAll(params?: any): Observable<Product[]> {
    const branch_id = typeof params === 'string' ? params : undefined;
    const fetchAll = async (): Promise<Product[]> => {
      let allData: Product[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;
      const select = `*, branch_stock:product_stock_per_branch(quantity, branch_id)`;

      while (hasMore) {
        let query = this.applyTenantFilter(this.supabase.from('products').select(select));
        const { data, error } = await (query.order('created_at', { ascending: false }).range(fromIdx, fromIdx + CHUNK - 1) as any);
        if (error) this.errorHandler.handleError(error, 'getAll (Products)');
        
        const products = (data || []).map((p: any) => ProductMapper.mapFromDb(p, branch_id));
        allData = [...allData, ...products];
        hasMore = products.length === CHUNK;
        fromIdx += CHUNK;
      }
      return allData;
    };
    return from(fetchAll());
  }

  getAllForImport(): Observable<ImportProductSummary[]> {
    const fetchAll = async (): Promise<ImportProductSummary[]> => {
      let allData: ImportProductSummary[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;

      while (hasMore) {
        const query = this.applyTenantFilter(
          this.supabase.from('products').select('id, name, slug, sku, price')
        ).range(fromIdx, fromIdx + CHUNK - 1);
        
        const { data, error } = await (query as any);
        if (error) this.errorHandler.handleError(error, 'getAllForImport');
        allData = [...allData, ...(data || [])];
        hasMore = (data || []).length === CHUNK;
        fromIdx += CHUNK;
      }
      return allData;
    };
    return from(fetchAll());
  }

  bulkUpdatePrices(updates: BulkPriceUpdate[]): Observable<{ updated: number; errors: number }> {
    const processUpdates = async () => {
      let updated = 0;
      let errors = 0;
      for (const item of updates) {
        const { error } = await this.supabase
          .from('products')
          .update({ price: item.price, name: item.newName, updated_at: new Date().toISOString() })
          .eq('id', item.id);
        if (error) errors++; else updated++;
      }
      return { updated, errors };
    };
    return from(processUpdates());
  }

  private storageService = inject(SupabaseStorageService);

  async uploadImage(file: File): Promise<string> {
    return this.storageService.uploadFile(file, 'products', 'public-assets', { context: 'LegacyProductUpload' });
  }

  upsertMany(products: Partial<Product>[]): Observable<Product[]> {
    const dataToUpsert = products.map(p => ({ ...p, tenant_id: this.tenantService.getTenantId(), updated_at: new Date().toISOString() }));
    return from((this.supabase.from('products').upsert(dataToUpsert).select() as any)).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'upsertMany');
        return (data || []).map((p: any) => ProductMapper.mapFromDb(p));
      })
    );
  }

  updateMany(products: Partial<Product>[]): Observable<void> {
    const processPromise = async () => {
      for (const p of products) {
        if (p.id) await firstValueFrom(this.update(p.id, p));
      }
    };
    return from(processPromise()).pipe(map(() => void 0));
  }

  bulkUpdateCategory(ids: string[], categoryId: string): Observable<void> {
    return from(this.supabase.from('products').update({ category_id: categoryId }).in('id', ids)).pipe(map(() => void 0));
  }

  bulkDelete(ids: string[]): Observable<void> {
    return from(this.supabase.from('products').update({ deleted_at: new Date().toISOString() }).in('id', ids)).pipe(map(() => void 0));
  }

  search(query: string, categoryId?: string): Observable<Product[]> {
    const queryStr = query.trim();
    if (!queryStr) return of([]);

    let supabaseQuery = this.applyTenantFilter(this.supabase.from(this.tableName).select('*'))
      .eq('is_active', true);
    
    if (categoryId) {
      supabaseQuery = supabaseQuery.eq('category_id', categoryId);
    }

    // Use PostgreSQL Full Text Search for high-performance search
    supabaseQuery = supabaseQuery.textSearch('search_tsv', queryStr, { 
      config: 'spanish', 
      type: 'websearch' 
    });

    return from(supabaseQuery as any).pipe(
      map(({ data, error }: any) => {
        if (error) this.errorHandler.handleError(error, 'search');
        return (data || []).map((p: any) => ProductMapper.mapFromDb(p));
      })
    );
  }

  getPendingApprovals(): Observable<Product[]> {
    let query = this.applyTenantFilter(
      this.supabase.from(this.tableName)
        .select(`*, branches(name)`)
        .eq('is_active', false)
        .not('branch_id', 'is', null)
    );
    return from(query as any).pipe(map(({ data }: any) => (data || []).map((p: any) => ProductMapper.mapFromDb(p))));
  }

  approveProduct(id: string): Observable<void> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({ is_active: true, is_global: true }))
      .eq('id', id);
    return from(query).pipe(map(() => void 0));
  }

  rejectProduct(id: string): Observable<void> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).delete())
      .eq('id', id);
    return from(query).pipe(map(() => void 0));
  }

  getPendingApprovalsCount(): Observable<number> {
    let query = this.applyTenantFilter(
      this.supabase.from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false)
        .not('branch_id', 'is', null)
    );
    return from(query as any).pipe(map(({ count }: any) => count || 0));
  }

  getInventorySummary(branch_id?: string): Observable<{ totalItems: number, totalValue: number, lowStockCount: number }> {
    const fetchSummary = async () => {
        // We select all items with stock > 0 for calculation or just all active items.
        // For performance in large catalogs, a specialized RPC would be better, 
        // but let's use a select with aggregations if possible or a simple sum logic.
        let query = this.supabase.from(this.tableName)
            .select('price, stock');
        
        query = this.applyTenantFilter(query);
        if (branch_id) query = query.eq('branch_id', branch_id);

        const { data, error } = await (query as any);
        if (error) throw error;

        const results = data || [];
        const totalItems = results.length;
        const totalValue = results.reduce((acc: number, p: any) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
        const lowStockCount = results.filter((p: any) => p.stock > 0 && p.stock <= 5).length;

        return { totalItems, totalValue, lowStockCount };
    };
    return from(fetchSummary());
  }
}

