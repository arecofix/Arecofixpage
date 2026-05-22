import { Observable } from 'rxjs';
import { AppServiceEntity } from '../entities/app-service.entity';

export abstract class AppServiceRepository {
    abstract getAll(options?: { column?: string; ascending?: boolean; select?: string }): Observable<AppServiceEntity[]>;
    abstract getById(id: string): Observable<AppServiceEntity | null>;
    abstract create(service: Partial<AppServiceEntity>): Observable<AppServiceEntity>;
    abstract update(id: string, service: Partial<AppServiceEntity>): Observable<AppServiceEntity>;
    abstract delete(id: string): Observable<void>;
}
