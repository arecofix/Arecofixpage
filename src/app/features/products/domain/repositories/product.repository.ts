
import { Observable } from 'rxjs';
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
    abstract findLowStock(threshold?: number): Observable<Product[]>;
    abstract findAvailable(): Observable<Product[]>;

    abstract getAll(): Observable<Product[]>;
    abstract getById(id: string): Observable<Product>;
    abstract create(product: Product): Observable<Product>;
    abstract update(id: string, product: Partial<Product>): Observable<Product>;
    abstract delete(id: string): Observable<void>;
}
