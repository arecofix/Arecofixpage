import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProductRepository, ImportProductSummary, BulkPriceUpdate } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';

@Injectable({
    providedIn: 'root'
})
export class FlaskProductRepository implements ProductRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/productos';

    findWithFilters(params: ProductsParams): Observable<ProductsResponse> {
        return this.http.get<{ data: Product[]; total: number }>(this.apiUrl).pipe(
            map(res => {
                let data = res.data;
                if (params.q) {
                    const q = params.q.toLowerCase();
                    data = data.filter(p => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
                }
                if (params.category_id) {
                    data = data.filter(p => p.category_id === params.category_id);
                }
                const limit = params._per_page || 12;
                const page = params._page || 1;
                const start = (page - 1) * limit;
                const items = data.slice(start, start + limit);
                const totalCount = data.length;
                const pages = Math.ceil(totalCount / limit);
                
                return {
                    first: 1,
                    last: pages,
                    pages: pages,
                    items: totalCount,
                    data: items
                };
            })
        );
    }

    findLowStock(threshold: number = 5): Observable<Product[]> {
        return this.getAll().pipe(map(products => products.filter(p => p.stock <= threshold)));
    }

    findAvailable(): Observable<Product[]> {
        return this.getAll().pipe(map(products => products.filter(p => p.is_active && p.stock > 0)));
    }

    getTopSellers(limit: number = 10, branch_id?: string): Observable<Product[]> {
        return this.getAll().pipe(map(products => products.slice(0, limit)));
    }

    getAll(branch_id?: string): Observable<Product[]> {
        return this.http.get<{ data: Product[]; total: number }>(this.apiUrl).pipe(map(res => res.data));
    }

    getAllForImport(): Observable<ImportProductSummary[]> {
        return this.getAll().pipe(map(products => products as any));
    }

    getById(id: string): Observable<Product | null> {
        return this.getAll().pipe(map(products => products.find(p => p.id === id) || null));
    }

    create(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    update(id: string, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            return data.url || '';
        } catch (e) {
            console.error('Error uploading image', e);
            return '';
        }
    }

    upsertMany(products: Partial<Product>[]): Observable<Product[]> {
        return of([] as Product[]); // Placeholder
    }

    updateMany(products: Partial<Product>[]): Observable<void> {
        return of(void 0); // Placeholder
    }

    bulkUpdatePrices(updates: BulkPriceUpdate[]): Observable<{ updated: number; errors: number }> {
        return of({ updated: 0, errors: 0 }); // Placeholder
    }

    bulkUpdateCategory(ids: string[], categoryId: string): Observable<void> {
        return of(void 0); // Placeholder
    }

    bulkDelete(ids: string[]): Observable<void> {
        return of(void 0); // Placeholder
    }

    search(query: string, categoryId?: string): Observable<Product[]> {
        return this.getAll().pipe(map(products => {
            let data = products;
            if (query) {
                const q = query.toLowerCase();
                data = data.filter(p => p.name.toLowerCase().includes(q) || (p.sku && p.sku.includes(q)));
            }
            if (categoryId) data = data.filter(p => p.category_id === categoryId);
            return data;
        }));
    }

    getPendingApprovals(): Observable<Product[]> {
        return of([]);
    }

    approveProduct(id: string): Observable<void> {
        return of(void 0);
    }

    rejectProduct(id: string): Observable<void> {
        return of(void 0);
    }

    getPendingApprovalsCount(): Observable<number> {
        return of(0);
    }

    getInventorySummary(branch_id?: string): Observable<{ totalItems: number, totalValue: number, lowStockCount: number }> {
        return this.getAll().pipe(map(products => ({
            totalItems: products.length,
            totalValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
            lowStockCount: products.filter(p => p.stock <= 5).length
        })));
    }
}
