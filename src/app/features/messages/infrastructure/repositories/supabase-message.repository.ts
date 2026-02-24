import { Injectable, inject } from '@angular/core';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { CrmMessage } from '../../domain/entities/crm-message.entity';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseMessageRepository extends MessageRepository {
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private supabase = this.authService.getSupabaseClient();

  saveMessage(message: CrmMessage): Observable<void> {
    return from(this.supabase.from('contact_messages').insert({
        name: message.name,
        phone: message.phone || '',
        email: message.email,
        message: message.notes || `Dirección: ${message.address}`, // Mapping 'address' to message body or similar if usage requires
        address: message.address, // Assuming the table might have it, or it goes into 'message'
        created_at: message.date.toISOString(),
        is_read: false,
        tenant_id: this.tenantService.getTenantId()
    })).pipe(
      map(({ error }) => {
        if (error) {
             console.error('Error saving message', error);
             throw error;
        }
      })
    );
  }

  getMessages(): Observable<CrmMessage[]> {
    return from(
        this.supabase.from('contact_messages')
            .select('*')
            .eq('tenant_id', this.tenantService.getTenantId())
            .order('created_at', { ascending: false })
    ).pipe(
        map(({ data, error }) => {
            if (error) throw error;
            return (data || []).map((r: any) => new CrmMessage({
                id: r.id,
                name: r.name,
                phone: r.phone,
                email: r.email,
                address: r.address || '', // Fallback if column doesn't exist
                date: new Date(r.created_at),
                notes: r.message
            }));
        })
    );
  }
}
