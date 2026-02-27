import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { TenantService } from '@app/core/services/tenant.service';
import { ProductRepository, ImportProductSummary, BulkPriceUpdate } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';


@Injectable({
  providedIn: 'root'
})
export class SupabaseProductRepository extends ProductRepository {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  private tenantService = inject(TenantService);
  private supabase: SupabaseClient = this.authService.getSupabaseClient();
  
  protected useSoftDeletes = true;

  private applyTenantFilter(query: any) {
      let enhancedQuery = query.eq('tenant_id', this.tenantService.getTenantId());
      if (this.useSoftDeletes) {
          enhancedQuery = enhancedQuery.is('deleted_at', null);
      }
      return enhancedQuery;
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
    } = params;

    const start = (_page - 1) * _per_page;
    const end = start + _per_page - 1;

    let baseQuery = this.supabase
      .from('products')
      .select(`
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)
      `, { count: 'exact' });
      
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
    
    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

    if (params._sort) {
      query = query.order(params._sort, { ascending: params._order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(start, end);

    return from(query as any).pipe(
      map((res: any) => {
        const { data, count, error } = res;
        if (error) throw error;

        const totalItems = count || 0;
        const pages = Math.max(1, Math.ceil(totalItems / _per_page));

        const products = (data || []).map((p: any) => this._mapToEntity(p));

        return {
          first: 1,
          prev: _page > 1 ? _page - 1 : undefined,
          next: _page < pages ? _page + 1 : undefined,
          last: pages,
          pages,
          items: totalItems,
          data: products,
        } as unknown as ProductsResponse;
      })
    );
  }

  findLowStock(threshold: number = 5): Observable<Product[]> {
    let query = this.supabase.from('products')
        .select(`
          id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
          is_active, is_featured, sku, barcode, stock, created_at, updated_at,
          branch_stock:product_stock_per_branch(quantity, branch_id)
        `);

    return from(this.applyTenantFilter(query) as any).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) throw error;
        return (data || [])
            .map((p: any) => this._mapToEntity(p))
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
      const select = `
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id)
      `;

      while (hasMore) {
        const query = this.applyTenantFilter(this.supabase.from('products').select(select))
          .eq('is_active', true)
          .order('name')
          .range(fromIdx, fromIdx + CHUNK - 1);
        
        const { data, error } = await (query as any);
        if (error) throw error;
        
        const products = (data || []).map((p: any) => this._mapToEntity(p));
        allData = [...allData, ...products];
        
        if (products.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };

    return from(fetchAll());
  }

  getAll(branch_id?: string): Observable<Product[]> {
    const fetchAll = async (): Promise<Product[]> => {
      let allData: Product[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;
      const select = `
        id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
        is_active, is_featured, sku, barcode, stock, created_at, updated_at,
        branch_stock:product_stock_per_branch(quantity, branch_id)
      `;

      while (hasMore) {
        let query = this.supabase.from('products').select(select);
        query = this.applyTenantFilter(query);
        // branch_id filter removed: column doesn't exist on 'products'. Mapping handles it.
        
        const { data, error } = await (query.order('created_at', { ascending: false }).range(fromIdx, fromIdx + CHUNK - 1) as any);
        if (error) throw error;
        
        const products = (data || []).map((p: any) => this._mapToEntity(p, branch_id));
        allData = [...allData, ...products];
        
        if (products.length < CHUNK) {
          hasMore = false;
        } else {
          fromIdx += CHUNK;
        }
      }
      return allData;
    };

    return from(fetchAll());
  }



  getById(id: string): Observable<Product> {
    let query = this.supabase.from('products')
        .select(`
          id, name, slug, description, price, currency, image_url, gallery_urls, category_id, brand_id, 
          is_active, is_featured, sku, barcode, stock, created_at, updated_at,
          branch_stock:product_stock_per_branch(quantity, branch_id, min_stock_alert)
        `)
        .eq('id', id);

    let filteredQuery = this.applyTenantFilter(query).single();

    return from(filteredQuery as any).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) throw error;
        return this._mapToEntity(data);
      })
    );
  }

  /** Lean projection for import deduplication - fetches all products in batches to avoid limits */
  getAllForImport(): Observable<ImportProductSummary[]> {
    const fetchAll = async (): Promise<ImportProductSummary[]> => {
      let allData: ImportProductSummary[] = [];
      let fromIdx = 0;
      let hasMore = true;
      const CHUNK = 1000;

      while (hasMore) {
        const query = this.applyTenantFilter(
          this.supabase.from('products').select(
            'id, name, slug, sku, price, image_url, gallery_urls, description, category_id, brand_id'
          )
        ).range(fromIdx, fromIdx + CHUNK - 1);
        
        const { data, error } = await (query as any);
        if (error) throw error;
        
        const products = data || [];
        allData = [...allData, ...products];
        
        if (products.length < CHUNK) {
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
   * Safe bulk price update - only modifies `price` (and optionally `name` for repuesto items).
   * Processes in batches of 50 to avoid overloading the DB.
   */
  bulkUpdatePrices(updates: BulkPriceUpdate[]): Observable<{ updated: number; errors: number }> {
    const CHUNK_SIZE = 50;
    const chunks: BulkPriceUpdate[][] = [];
    for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
      chunks.push(updates.slice(i, i + CHUNK_SIZE));
    }

    const processChunks = async (): Promise<{ updated: number; errors: number }> => {
      let updated = 0;
      let errors = 0;

      for (const chunk of chunks) {
        const promises = chunk.map(async (item) => {
          const payload: Record<string, any> = {
            price: item.price,
            updated_at: new Date().toISOString()
          };
          // Only update name if provided (i.e. was a 'repuesto' product needing renaming)
          if (item.newName) {
            payload['name'] = item.newName;
          }

          const { error } = await this.supabase
            .from('products')
            .update(payload)
            .eq('id', item.id)
            .eq('tenant_id', this.tenantService.getTenantId());

          if (error) {
            this.logger.error('bulkUpdatePrices', `Failed for product ${item.id}: ${error.message}`);
            errors++;
          } else {
            updated++;
          }
        });
        await Promise.all(promises);
      }
      return { updated, errors };
    };

    return from(processChunks());
  }

  async uploadImage(file: File): Promise<string> {
    const filePath = `products/${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage.from('public-assets').upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = this.supabase.storage.from('public-assets').getPublicUrl(data.path);
    return publicUrl.publicUrl;
  }

  private async syncBranchStock(productId: string, quantity: number): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const profile = await this.authService.getUserProfile(user.id);
    if (!profile || !profile.branch_id) return;

    await this.supabase
        .from('product_stock_per_branch')
        .upsert({
            product_id: productId,
            branch_id: profile.branch_id,
            tenant_id: this.tenantService.getTenantId(),
            quantity: quantity,
            updated_at: new Date().toISOString()
        }, { onConflict: 'product_id,branch_id' });
  }

  create(product: Product): Observable<Product> {
    const { stock, ...productData } = product;
    const payload = {
      ...productData,
      tenant_id: this.tenantService.getTenantId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return from(
      (this.supabase
        .from('products')
        .insert(payload)
        .select('*')
        .single() as any)
    ).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) throw error;
        if (stock !== undefined) {
            this.syncBranchStock(data.id, stock);
        }
        return this._mapToEntity(data);
      })
    );
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    const { stock, ...productData } = product;
    
    // Evita error de modificación inmutable SQL
    delete productData.tenant_id;
    delete productData.id;

    const payload = {
      ...productData,
      updated_at: new Date().toISOString()
    };

    let query = this.supabase.from('products').update(payload).eq('id', id);
    let filteredQuery = this.applyTenantFilter(query).select('*').single();

    return from(filteredQuery as any).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) throw error;
        if (stock !== undefined) {
            this.syncBranchStock(id, stock);
        }
        return this._mapToEntity(data);
      })
    );
  }

  delete(id: string): Observable<void> {
    let query = this.supabase.from('products').delete().eq('id', id);
    let filteredQuery = this.applyTenantFilter(query);

    return from(filteredQuery as any).pipe(
      map((res: any) => {
        const { error } = res;
        if (error) throw error;
        return void 0;
      })
    );
  }

  upsertMany(products: Partial<Product>[]): Observable<Product[]> {
    if (!products.length) return of([]);

    const dataToUpsert = products.map(p => {
        const { stock, ...rest } = p;
        return {
            ...rest,
            tenant_id: this.tenantService.getTenantId(),
            updated_at: new Date().toISOString()
        };
    });

    return from(
      (this.supabase.from('products').upsert(dataToUpsert).select() as any)
    ).pipe(
      map((res: any) => {
        const { data, error } = res;
        if (error) throw error;
        return (data || []).map((p: any) => this._mapToEntity(p));
      })
    );
  }

  updateMany(products: Partial<Product>[]): Observable<void> {
    if (!products.length) return of(void 0);

    // Strip every field that is NOT a real DB column before sending
    const DB_COLUMNS = new Set([
      'id', 'name', 'slug', 'description', 'price', 'sale_price',
      'stock', 'min_stock_alert', 'category_id', 'brand_id', 'model_id',
      'image_url', 'gallery_urls', 'specifications', 'is_featured',
      'is_active', 'sku', 'barcode', 'currency', 'is_global',
      'created_at', 'updated_at', 'deleted_at', 'tenant_id'
    ]);

    const updates = products.map(p => {
        if (!p.id) return Promise.resolve({ error: { message: 'Missing ID' } });
        const { id, tenant_id, ...rest } = p as any;

        // Keep only known DB columns
        const cleanPayload: Record<string, any> = {};
        for (const key of Object.keys(rest)) {
          if (DB_COLUMNS.has(key)) cleanPayload[key] = (rest as any)[key];
        }
        cleanPayload['updated_at'] = new Date().toISOString();

        let query = this.supabase.from('products').update(cleanPayload).eq('id', id);
        return this.applyTenantFilter(query);
    });

    return from(Promise.all(updates)).pipe(
      map((results) => {
        const errors = results.filter((r: any) => r && r.error);
        if (errors.length > 0) {
             throw new Error(`Failed to update ${errors.length} products`);
        }
        return void 0;
      })
    );
  }

  /** Soft-delete multiple products at once (sets deleted_at timestamp) */
  bulkDelete(ids: string[]): Observable<void> {
    if (!ids.length) return of(void 0);
    const CHUNK_SIZE = 100;
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      chunks.push(ids.slice(i, i + CHUNK_SIZE));
    }
    const tenantId = this.tenantService.getTenantId();
    const processChunks = async () => {
      for (const chunk of chunks) {
        const { error } = await (this.supabase
          .from('products')
          .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .in('id', chunk)
          .eq('tenant_id', tenantId) as any);
        if (error) throw error;
      }
    };
    return from(processChunks()).pipe(map(() => void 0));
  }

  private _mapToEntity(p: any, branch_id?: string): Product {
    const isFeatured = Boolean(p['featured'] ?? p['is_featured'] ?? false);
    let displayedStock = 0;
    const branchStockList = p.branch_stock && Array.isArray(p.branch_stock) ? p.branch_stock : [];
    
    if (branch_id) {
       const specificBranch = branchStockList.find((b: any) => b.branch_id === branch_id);
       displayedStock = specificBranch ? Number(specificBranch.quantity) : 0;
    } else if (branchStockList.length > 0) {
       displayedStock = branchStockList.reduce((acc: number, curr: any) => acc + (Number(curr.quantity) || 0), 0);
    } else {
       displayedStock = Number(p['stock'] || 0);
    }

    return {
          id: p['id'] as string,
          name: p['name'] as string,
          slug: p['slug'] as string,
          description: p['description'] as string,
          price: Number(p['price']),
          image_url: p['image_url'] as string,
          gallery_urls: p['gallery_urls'] || (p['image_url'] ? [p['image_url']] : []),
          category_id: p['category_id'] as string,
          brand_id: p['brand_id'] as string,
          stock: displayedStock,
          is_active: Boolean(p['is_active']),
          is_featured: isFeatured,
          sku: p['sku'] as string || '',
          barcode: p['barcode'] as string || '',
          currency: p['currency'] as 'ARS' | 'USD' || 'ARS',
          min_stock_alert: p['min_stock_alert'] ? Number(p['min_stock_alert']) : undefined,
          created_at: p['created_at'] as string,
          updated_at: p['updated_at'] as string,
          branch_stock: p.branch_stock
    };
  }
}
