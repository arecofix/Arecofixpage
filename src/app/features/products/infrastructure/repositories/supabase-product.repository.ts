import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { LoggerService } from '@app/core/services/logger.service';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SupabaseProductRepository extends ProductRepository {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);
  private supabase: SupabaseClient = this.authService.getSupabaseClient();

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

    let query = this.supabase
      .from('products')
      .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at', { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (params.category_ids && params.category_ids.length > 0) {
      query = query.in('category_id', params.category_ids);
    } else if (category_id !== undefined && category_id !== null) {
      query = query.eq('category_id', category_id);
    }
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (description) query = query.ilike('description', `%${description}%`);
    if (featured !== null && featured !== undefined) query = query.eq('is_featured', featured);
    if (id) query = query.eq('id', id);
    if (name) query = query.ilike('name', `%${name}%`);
    if (price) query = query.eq('price', price);
    if (slug) query = query.eq('slug', slug);
    if (min_price !== undefined) query = query.gte('price', min_price);
    if (max_price !== undefined) query = query.lte('price', max_price);
    
    // Search query
    if (params.q) {
      query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

    // Apply sorting
    if (params._sort) {
      query = query.order(params._sort, { ascending: params._order === 'asc' });
    } else {
      // Default sort
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(start, end);

    return from(query).pipe(
      map(({ data, count, error }) => {
        if (error) throw error;

        const totalItems = count || 0;
        const pages = Math.max(1, Math.ceil(totalItems / _per_page));

        // Use any to bypass rigorous structure check between Entity and Interface Product types
        // The _mapToEntity returns an object that satisfies the Interface (with 'featured')
        const products = (data || []).map((p: any) => this._mapToEntity(p));

        return {
          first: 1,
          prev: _page > 1 ? _page - 1 : undefined,
          next: _page < pages ? _page + 1 : undefined,
          last: pages,
          pages,
          items: totalItems,
          data: products, // This is any[], which is assignable to Product[] (Interface)
        } as unknown as ProductsResponse; // Force cast to satisfy signature
      }),
      catchError((err) => {
        this.logger.error('Supabase product query error', err);
        return of({
          first: 1,
          prev: undefined,
          next: undefined,
          last: 1,
          pages: 1,
          items: 0,
          data: [],
        } as unknown as ProductsResponse);
      })
    );
  }

  findLowStock(threshold: number = 5): Observable<Product[]> {
    return from(
      this.supabase.from('products')
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .lt('stock', threshold)
    ).pipe(map(({ data, error }) => {
      if (error) throw error;
      return (data || []).map((p: any) => this._mapToEntity(p));
    }));
  }

  findAvailable(): Observable<Product[]> {
    return from(
      this.supabase.from('products')
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .gt('stock', 0)
        .eq('is_active', true)
    ).pipe(map(({ data, error }) => {
      if (error) throw error;
      return (data || []).map((p: any) => this._mapToEntity(p));
    }));
  }

  getAll(): Observable<Product[]> {
     return from(
      this.supabase.from('products')
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .order('created_at', { ascending: false })
    ).pipe(map(({ data, error }) => {
      if (error) throw error;
      return (data || []).map((p: any) => this._mapToEntity(p));
    }));
  }

  getById(id: string): Observable<Product> {
    return from(
      this.supabase.from('products')
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .eq('id', id)
        .single()
    ).pipe(map(({ data, error }) => {
      if (error) throw error;
      return this._mapToEntity(data);
    }));
  }

  create(product: Product): Observable<Product> {
    const productData = {
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return from(
      this.supabase
        .from('products')
        .insert(productData)
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error('Error creating product', error);
          throw error;
        }
        return this._mapToEntity(data);
      }),
      catchError((err) => {
        this.logger.error('Failed to create product', err);
        throw err;
      })
    );
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    const updateData = {
      ...product,
      updated_at: new Date().toISOString()
    };

    return from(
      this.supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select('id, name, slug, description, price, image_url, gallery_urls, category_id, brand_id, stock, is_active, is_featured, sku, barcode, created_at, updated_at')
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error('Error updating product', error);
          throw error;
        }
        return this._mapToEntity(data);
      }),
      catchError((err) => {
        this.logger.error('Failed to update product', err);
        throw err;
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('products')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) {
          this.logger.error('Error deleting product', error);
          throw error;
        }
        return void 0;
      }),
      catchError((err) => {
        this.logger.error('Failed to delete product', err);
        throw err;
      })
    );
  }

  private _mapToEntity(p: any): any {
    const isFeatured = Boolean(p['featured'] ?? p['is_featured'] ?? false);
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
          stock: Number(p['stock']),
          is_active: Boolean(p['is_active']),
          is_featured: isFeatured,
          featured: isFeatured,
          sku: p['sku'] as string || '',
          barcode: p['barcode'] as string || '',
          // currency removed as it causes errors and is implicitly ARS
          condition: p['condition'] as string,
          warranty: p['warranty'] as string,
          min_stock_alert: p['min_stock_alert'] ? Number(p['min_stock_alert']) : undefined,
          created_at: p['created_at'] as string,
          updated_at: p['updated_at'] as string,
    };
  }
}
