import { Observable } from 'rxjs';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
    abstract getPaginated(page: number, limit: number, options?: { column?: string; ascending?: boolean; select?: string }): Observable<{ data: Category[]; total: number }>;
    abstract getAll(options?: { column?: string; ascending?: boolean; select?: string }): Observable<Category[]>;
    abstract getById(id: string): Observable<Category | null>;
    abstract create(category: Partial<Category>): Observable<Category>;
    abstract update(id: string, category: Partial<Category>): Observable<Category>;
    abstract delete(id: string): Observable<void>;
}
