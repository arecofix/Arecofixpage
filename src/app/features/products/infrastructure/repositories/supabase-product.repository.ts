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
import { BranchContextService } from '@app/core/services/branch-context.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseProductRepository extends BaseRepository<Product> implements ProductRepository {
  protected override tableName = 'products';
  protected override isGlobalTable = false;
  protected override useSoftDeletes = true;
  protected override suppressAuthNotifications = true;
  protected override useStrictBranchIsolation = true;

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
      minimal = true
    } = params;
    
    const hasExplicitBranch = 'branch_id' in params;
    const branch_id = hasExplicitBranch ? params.branch_id : (this.branchContextService?.getBranchId() || undefined);

    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;

    let selectFields = `
      id, name, slug, price, currency, unit_cost_at_time, image_url, category_id, brand_id, 
      is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id`;

    selectFields += `, branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)`;

    if (!minimal) {
      selectFields += ', description, media_metadata, gallery_urls';
    }

    // 👇 EQUIVALENTE A POSTMAN (PETICIÓN GET para buscar/listar):
    // GET https://<TU_SUPABASE_URL>/rest/v1/products?select=...
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
    
    if (description) query = query.ilike('description', `%${description}%`);
    if (featured !== null && featured !== undefined) query = query.eq('is_featured', featured);
    if (id) query = query.eq('id', id);
    if (params.ids && params.ids.length > 0) query = query.in('id', params.ids);
    if (name) query = query.ilike('name', `%${name}%`);
    if (price) query = query.eq('price', price);
    if (slug) query = query.eq('slug', slug);
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    
    // Filtrado de stock removido temporalmente del query de Supabase ya que 
    // la tabla products no tiene la columna stock. 
    // Si se requiere filtro de stock, se debe consultar a view_products_inventory.
    
    if (params.q) {
      const queryStr = params.q.trim();
      if (queryStr) {
        const safeQuery = queryStr.replace(/[^\p{L}\p{N}\s-]/gu, '');
        const words = safeQuery.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 1) {
          query = query.or(`name.ilike.%${words[0]}%,description.ilike.%${words[0]}%,sku.ilike.%${words[0]}%,barcode.ilike.%${words[0]}%`);
        } else if (words.length > 1) {
          words.forEach(w => {
            query = query.ilike('name', `%${w}%`);
          });
        }
      }
    }

    query = query.order(params._sort || 'created_at', { ascending: params._order === 'asc' });
    
    if (params.is_paginated !== false) {
      query = query.range(start, end);
    }

    return from(query as any).pipe(
      map((res: any) => {
        const { data, count, error } = res;
        if (error) this.errorHandler.handleError(error, 'findWithFilters');

        const totalItems = count || 0;
        const pages = Math.max(1, Math.ceil(totalItems / _per_page));

        let products = (data || []).map((p: any) => ProductMapper.mapFromDb(p, branch_id || undefined));
        
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
      id, name, slug, price, currency, unit_cost_at_time, image_url, category_id, brand_id, 
      is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id,
      branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)
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
      const select = `id, name, slug, price, is_active, is_global, stock, branch_id`;

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

  getTopSellers(limit: number = 10, branch_id?: string): Observable<Product[]> {
    const activeBranchId = branch_id || (this.branchContextService ? this.branchContextService.getBranchId() : undefined);
    const selectFields = `id, name, slug, price, currency, unit_cost_at_time, image_url, category_id, brand_id, is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id, total_units_sold, branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)`;

    let query = this.applyTenantFilter(this.supabase.from(this.tableName).select(selectFields))
      .eq('is_active', true)
      .gt('total_units_sold', 0)
      .order('total_units_sold', { ascending: false })
      .limit(limit * 2);

    return from(query as any).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) this.errorHandler.handleError(error, 'getTopSellers');

        let products = (data || []).map((p: any) => ProductMapper.mapFromDb(p, activeBranchId || undefined));
        products = products.filter((p: Product) => (p.stock || 0) > 0);
        
        return products.slice(0, limit);
      })
    );
  }

    override getAll(params?: any): Observable<Product[]> {
    const paramBranchId = typeof params === 'string' ? params : (params?.branch_id || undefined);
    const branch_id = paramBranchId || (this.branchContextService ? this.branchContextService.getBranchId() : undefined);
    const fetchAll = async (): Promise<Product[]> => {
      let allData: Product[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;
      const select = `id, name, slug, description, price, currency, unit_cost_at_time, image_url, category_id, brand_id, is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id, media_metadata, gallery_urls, branch_stock:product_stock_per_branch(quantity, branch_id)`;

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
          this.supabase.from('products').select('id, name, slug, sku, price, stock, branch_id')
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
        // 👇 EQUIVALENTE A POSTMAN (PETICIÓN PATCH/PUT para actualizar datos):
        // PATCH https://<TU_SUPABASE_URL>/rest/v1/products?id=eq.<id>
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
    const dataToUpsert = products.map(p => {
        const copy: any = { ...p, tenant_id: this.tenantService.getTenantId(), updated_at: new Date().toISOString() };
        delete copy.branch_id;
        delete copy.min_stock_alert;
        delete copy.convertedPrice;
        delete copy.category_name;
        delete copy.branch_stock;
        delete copy.branches;
        return copy;
    });
    // 👇 EQUIVALENTE A POSTMAN (PETICIÓN POST para crear/upsert):
    // POST https://<TU_SUPABASE_URL>/rest/v1/products
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
    return this.bulkUpdateByIds(ids, { category_id: categoryId } as Partial<Product>);
  }

  bulkDelete(ids: string[]): Observable<void> {
    return this.bulkSoftDeleteByIds(ids);
  }

  search(query: string, categoryId?: string): Observable<Product[]> {
    const queryStr = query.trim();
    if (!queryStr) return of([]);
    
    const safeQuery = queryStr.replace(/[^\p{L}\p{N}\s]/gu, '');
    const words = safeQuery.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return of([]);
    
    const tsQuery = words.map(w => `'${w}':*`).join(' & ');

    const selectFields = 'id, name, slug, description, price, currency, unit_cost_at_time, image_url, category_id, brand_id, is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id, media_metadata, gallery_urls';
    let supabaseQuery = this.applyTenantFilter(this.supabase.from(this.tableName).select(selectFields))
      .eq('is_active', true);
    
    if (categoryId) {
      supabaseQuery = supabaseQuery.eq('category_id', categoryId);
    }

    // Use PostgreSQL Full Text Search for high-performance search with prefix wildcard
    supabaseQuery = supabaseQuery.textSearch('search_tsv', tsQuery, { config: 'spanish' });

    return new Observable<Product[]>(subscriber => {
      let isSubscribed = true;
      
      Promise.resolve(supabaseQuery).then(({ data, error }: any) => {
        if (!isSubscribed) return;
        
        if (error) {
          try {
            this.errorHandler.handleError(error, 'search');
          } catch (e) {
            subscriber.error(e);
          }
        } else {
          subscriber.next((data || []).map((p: any) => ProductMapper.mapFromDb(p)));
          subscriber.complete();
        }
      }).catch((err: any) => {
        if (!isSubscribed) return;
        subscriber.error(err);
      });

      return () => {
        isSubscribed = false;
      };
    });
  }

  getPendingApprovals(): Observable<Product[]> {
    const selectFields = 'id, name, slug, description, price, currency, unit_cost_at_time, image_url, category_id, brand_id, is_active, is_featured, sku, barcode, created_at, updated_at, is_global, stock, branch_id, media_metadata, gallery_urls';
    let query = this.applyTenantFilter(
      this.supabase.from(this.tableName)
        .select(selectFields)
        .eq('is_active', false)
    );
    return from(query as any).pipe(map(({ data }: any) => (data || []).map((p: any) => ProductMapper.mapFromDb(p))));
  }

  approveProduct(id: string): Observable<void> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({ is_active: true, is_global: true }))
      .eq('id', id);
    return from(query).pipe(map(() => void 0));
  }

  rejectProduct(id: string): Observable<void> {
    // 👇 EQUIVALENTE A POSTMAN (PETICIÓN DELETE para eliminar/rechazar):
    // DELETE https://<TU_SUPABASE_URL>/rest/v1/products?id=eq.<id>
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).delete())
      .eq('id', id);
    return from(query).pipe(map(() => void 0));
  }

  getPendingApprovalsCount(): Observable<number> {
    let query = this.applyTenantFilter(
      this.supabase.from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false)
    );
    return from(query as any).pipe(map(({ count }: any) => count || 0));
  }

  getInventorySummary(branch_id?: string): Observable<{ totalItems: number, totalValue: number, lowStockCount: number }> {
    const fetchSummary = async () => {
        if (branch_id) {
            let query = this.applyTenantFilter(
                this.supabase.from('products')
                    .select('price, is_active, deleted_at, branch_id, is_global, branch_stock:product_stock_per_branch(quantity, min_stock_alert, branch_id)')
            )
            .eq('is_active', true)
            .is('deleted_at', null);

            const { data, error } = await (query as any);
            if (error) throw error;

            const results = data || [];
            
            // Un producto se considera "en inventario de la sucursal" si tiene stock asociado o si pertenece nativamente a la sucursal
            const branchProducts = results.filter((item: any) => {
                const hasStockEntry = item.branch_stock && Array.isArray(item.branch_stock) && item.branch_stock.some((s: any) => s.branch_id === branch_id);
                return item.branch_id === branch_id || hasStockEntry;
            });

            const totalItems = branchProducts.length;
            const totalValue = branchProducts.reduce((acc: number, item: any) => {
                const price = Number(item.price || 0);
                const stockList = item.branch_stock && Array.isArray(item.branch_stock) ? item.branch_stock : [];
                const branchStock = stockList.find((s: any) => s.branch_id === branch_id);
                const quantity = branchStock ? Number(branchStock.quantity || 0) : 0;
                return acc + (price * quantity);
            }, 0);

            const lowStockCount = branchProducts.filter((item: any) => {
                const stockList = item.branch_stock && Array.isArray(item.branch_stock) ? item.branch_stock : [];
                const branchStock = stockList.find((s: any) => s.branch_id === branch_id);
                if (!branchStock) return false;
                const quantity = Number(branchStock.quantity || 0);
                const threshold = Number(branchStock.min_stock_alert ?? 5);
                return quantity > 0 && quantity <= threshold;
            }).length;

            return { totalItems, totalValue, lowStockCount };
        } else {
            let query = this.supabase.from('view_products_inventory')
                .select('price, stock, min_stock_alert');
            
            // Note: view_products_inventory does not have tenant_id or is_active exposed.
            // If the view handles RLS, it filters automatically.

            const { data, error } = await (query as any);
            if (error) throw error;

            const results = data || [];
            const totalItems = results.length;
            const totalValue = results.reduce((acc: number, p: any) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);
            const lowStockCount = results.filter((p: any) => {
                const stockVal = Number(p.stock || 0);
                const threshold = Number(p.min_stock_alert ?? 5);
                return stockVal > 0 && stockVal <= threshold;
            }).length;

            return { totalItems, totalValue, lowStockCount };
        }
    };
    return from(fetchSummary());
  }
}

