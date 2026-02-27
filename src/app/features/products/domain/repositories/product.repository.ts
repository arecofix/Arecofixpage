
import { Observable } from 'rxjs';
import { Product } from '../entities/product.entity';

import { ProductsParams, ProductsResponse } from '@app/public/products/interfaces';

export interface ImportProductSummary {
    id: string;
    name: string;
    slug: string;
    sku?: string;
    price: number;
    image_url?: string;
    gallery_urls?: string[];
    description?: string;
    category_id?: string;
    brand_id?: string;
}

export interface BulkPriceUpdate {
    id: string;
    price: number;
    /** Optional: if provided, replaces the name only when current name matches 'repuesto' */
    newName?: string;
}

export abstract class ProductRepository {
    abstract findWithFilters(params: ProductsParams): Observable<ProductsResponse>;

    abstract findLowStock(threshold?: number): Observable<Product[]>;
    abstract findAvailable(): Observable<Product[]>;

    abstract getAll(branch_id?: string): Observable<Product[]>;
    abstract getAllForImport(): Observable<ImportProductSummary[]>;
    abstract getById(id: string): Observable<Product>;
    abstract create(product: Product): Observable<Product>;
    abstract update(id: string, product: Partial<Product>): Observable<Product>;
    abstract delete(id: string): Observable<void>;
    
    abstract uploadImage(file: File): Promise<string>;
    abstract upsertMany(products: Partial<Product>[]): Observable<Product[]>;
    abstract updateMany(products: Partial<Product>[]): Observable<void>;
    abstract bulkUpdatePrices(updates: BulkPriceUpdate[]): Observable<{ updated: number; errors: number }>;
    abstract bulkDelete(ids: string[]): Observable<void>;
}
