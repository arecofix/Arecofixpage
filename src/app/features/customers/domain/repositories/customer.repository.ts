import { Observable } from 'rxjs';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

export abstract class CustomerRepository {
    abstract getAll(): Observable<UserProfile[]>;
    abstract getById(id: string): Observable<UserProfile | null>;
    abstract create(profile: Partial<UserProfile>): Observable<UserProfile>;
    abstract update(id: string, profile: Partial<UserProfile>): Observable<UserProfile>;
    abstract delete(id: string): Observable<void>;
    abstract createClient(item: any): Observable<UserProfile>;
    abstract findByEmailOrPhone(email?: string, phone?: string): Observable<UserProfile | null>;
    abstract searchClients(query: string, limit?: number): Observable<UserProfile[]>;
    abstract getRecentClients(limit?: number): Observable<UserProfile[]>;
    abstract getUnifiedClients(): Observable<any[]>;
    abstract getPaginatedUnifiedClients(page: number, limit: number, searchTerm?: string): Observable<{ data: any[], total: number }>;
}
