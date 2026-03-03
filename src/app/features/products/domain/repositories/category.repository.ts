import { Observable } from 'rxjs';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
    abstract getAll(orderBy?: { column: string; ascending?: boolean }): Observable<Category[]>;
    abstract getById(id: string): Observable<Category>;
    abstract create(category: Partial<Category>): Observable<Category>;
    abstract update(id: string, category: Partial<Category>): Observable<Category>;
    abstract delete(id: string): Observable<void>;
}
