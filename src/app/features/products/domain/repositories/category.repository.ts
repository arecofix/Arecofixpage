
import { Observable } from 'rxjs';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
    abstract getAll(): Observable<Category[]>;
    abstract getById(id: string): Observable<Category>;
}
