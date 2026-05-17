import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { LoggerService } from './logger.service';
import { TenantService } from './tenant.service';

export interface CreateMessageDto {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private authService = inject(AuthService);
    private logger = inject(LoggerService);
    private tenantService = inject(TenantService);
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = this.authService.getSupabaseClient();
    }

    async createMessage(msg: CreateMessageDto): Promise<{ error: PostgrestError | null }> {
        try {
            const payload = { 
                name: msg.name,
                email: msg.email,
                phone: msg.phone || null,
                subject: msg.subject || null,
                message: msg.message,
                is_read: false,
                tenant_id: this.tenantService.getTenantId()
            };

            const { error } = await this.supabase
                .from('contact_messages' as any)
                .insert(payload);
            
            if (error) {
                this.logger.error('Supabase ContactService Error:', error);
            }

            return { error };
        } catch (e: unknown) {
            this.logger.error('ContactService Exception:', e);
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            
            const pgError: PostgrestError = {
                message: errorMessage,
                details: '',
                hint: '',
                code: 'UNKNOWN',
                name: 'PostgrestError',
                toJSON: function() {
                    return {
                        name: this.name,
                        message: this.message,
                        details: this.details,
                        hint: this.hint,
                        code: this.code
                    };
                }
            };
            return { error: pgError };
        }
    }

    async getMessages(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('contact_messages')
            .select('*')
            .eq('tenant_id', this.tenantService.getTenantId())
            .order('created_at', { ascending: false });
        
        if (error) {
            this.logger.error('Error fetching messages:', error);
            throw error;
        }
        return data || [];
    }

    async markAsRead(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId());

        if (error) {
            this.logger.error('Error marking message as read:', error);
            throw error;
        }
    }

    async deleteMessage(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('contact_messages')
            .delete()
            .eq('id', id)
            .eq('tenant_id', this.tenantService.getTenantId());

        if (error) {
            this.logger.error('Error deleting message:', error);
            throw error;
        }
    }
}
