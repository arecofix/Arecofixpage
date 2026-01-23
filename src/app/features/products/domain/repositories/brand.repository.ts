
import { Observable } from 'rxjs';
import { Brand } from '../entities/brand.entity';

export abstract class BrandRepository {
    abstract getAll(orderBy?: { column: string; ascending?: boolean }): Observable<Brand[]>;
    abstract getById(id: string): Observable<Brand>;
    abstract create(brand: Partial<Brand>): Observable<Brand>;
    abstract update(id: string, brand: Partial<Brand>): Observable<Brand>;
    abstract delete(id: string): Observable<void>;
}
