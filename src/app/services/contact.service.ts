import { Injectable, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import { LoggerService } from '../core/services/logger.service';

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
                is_read: false 
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
            const pgError: PostgrestError = {
                message: (e as Error)?.message || 'Unknown error',
                details: '',
                hint: '',
                code: 'UNKNOWN',
                name: 'PostgrestError'
            };
            return { error: pgError };
        }
    }
}
