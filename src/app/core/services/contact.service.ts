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
            } else {
                // Insert explicit notification for admins
                await this.supabase.from('notifications').insert({
                    title: '✉️ Nuevo Mensaje de Contacto',
                    message: `${msg.name} ha enviado un mensaje: ${msg.subject ? '(' + msg.subject + ')' : ''} ${msg.message.substring(0, 50)}...`,
                    type: 'info',
                    scope: 'admin',
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
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
            .neq('subject', 'Solicitud de Turno: Reparación') // filter out reservations
            .order('created_at', { ascending: false });
        
        if (error) {
            this.logger.error('Error fetching messages:', error);
            throw error;
        }
        return data || [];
    }

    async getReservations(): Promise<any[]> {
        const { data, error } = await this.supabase
            .from('contact_messages')
            .select('*')
            .eq('tenant_id', this.tenantService.getTenantId())
            .eq('subject', 'Solicitud de Turno: Reparación')
            .order('created_at', { ascending: false });
        
        if (error) {
            this.logger.error('Error fetching reservations:', error);
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

    async createReservation(reservation: any): Promise<{ error: PostgrestError | null }> {
        try {
            // Save reservation as a formatted contact message for simplicity and Admin visibility
            const payload = { 
                name: reservation.name,
                email: reservation.email || 'N/A',
                phone: reservation.phone,
                subject: 'Solicitud de Turno: Reparación',
                message: `Se ha solicitado un nuevo turno.\nFecha: ${reservation.date}\nHora: ${reservation.slot}\nCliente: ${reservation.name}\nTeléfono: ${reservation.phone}\nEquipo: ${reservation.deviceModel || 'N/A'}\nFalla: ${reservation.issueDescription || 'N/A'}\nDescuento aplicado: ${reservation.discount}%`,
                is_read: false,
                tenant_id: this.tenantService.getTenantId()
            };

            const { error } = await this.supabase
                .from('contact_messages' as any)
                .insert(payload);
            
            if (error) {
                this.logger.error('Supabase ContactService Error (Reservation):', error);
            } else {
                // Insert explicit notification for admins
                await this.supabase.from('notifications').insert({
                    title: '🔧 Nuevo Turno Solicitado',
                    message: `${reservation.name} solicitó un turno el ${reservation.date} a las ${reservation.slot} para reparar un ${reservation.deviceModel || 'equipo'}.`,
                    type: 'info',
                    scope: 'admin',
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
            }

            return { error };
        } catch (e: unknown) {
            this.logger.error('ContactService Exception (Reservation):', e);
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
}
