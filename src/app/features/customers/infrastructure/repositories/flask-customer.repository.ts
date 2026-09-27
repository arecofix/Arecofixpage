import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { UserProfile } from '@app/features/authentication/domain/entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class FlaskCustomerRepository implements CustomerRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/clientes';

    getAll(): Observable<UserProfile[]> {
        return this.http.get<{ data: UserProfile[]; total: number }>(this.apiUrl).pipe(
            map(res => res.data)
        );
    }

    getById(id: string): Observable<UserProfile | null> {
        return this.getAll().pipe(
            map(profiles => profiles.find(p => p.id === id) || null)
        );
    }

    create(profile: Partial<UserProfile>): Observable<UserProfile> {
        return this.http.post<UserProfile>(this.apiUrl, profile);
    }

    update(id: string, profile: Partial<UserProfile>): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, profile);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createClient(item: any): Observable<UserProfile> {
        return this.create({
            first_name: item.first_name,
            last_name: item.last_name || '',
            email: item.email || '',
            phone: item.phone || '',
            dni: item.dni || ''
        });
    }

    findByEmailOrPhone(email?: string, phone?: string): Observable<UserProfile | null> {
        return this.getAll().pipe(
            map(profiles => profiles.find(p => p.email === email || p.phone === phone) || null)
        );
    }

    searchClients(query: string, limit: number = 20): Observable<UserProfile[]> {
        return this.getAll().pipe(
            map(profiles => profiles.filter(p => (p.first_name || '').includes(query) || p.last_name?.includes(query) || p.email?.includes(query)))
        );
    }

    getRecentClients(limit: number = 20): Observable<UserProfile[]> {
        return this.getAll().pipe(map(profiles => profiles.slice(0, limit)));
    }

    getUnifiedClients(): Observable<any[]> {
        return this.getAll().pipe(
            map(profiles => profiles.map(p => ({
                ...p,
                source: 'profile',
                repair_count: 0,
                order_count: 0
            })))
        );
    }

    getPaginatedUnifiedClients(page: number, limit: number, searchTerm?: string): Observable<{ data: any[], total: number }> {
        return this.getAll().pipe(
            map(profiles => {
                let data = profiles;
                if (searchTerm) {
                    const q = searchTerm.toLowerCase();
                    data = data.filter(p => (p.first_name || '').toLowerCase().includes(q) || p.last_name?.toLowerCase().includes(q));
                }
                const start = (page - 1) * limit;
                return {
                    data: data.slice(start, start + limit).map(p => ({ ...p, repair_count: 0, order_count: 0 })),
                    total: data.length
                };
            })
        );
    }
}
