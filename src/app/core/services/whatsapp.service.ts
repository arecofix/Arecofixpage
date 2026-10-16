import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TenantService } from './tenant.service';
import { LoggerService } from './logger.service';

interface WhatsAppComponent {
    type: string;
    parameters: Array<{
        type: string;
        text?: string;
        image?: { link: string };
        video?: { link: string };
        document?: { link: string; filename: string };
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    private http = inject(HttpClient);
    private tenantService = inject(TenantService);
    private logger = inject(LoggerService);
    // Use Supabase Edge Function URL
    private functionUrl = `${environment.supabaseUrl}/functions/v1/send-whatsapp`;
    private supabaseKey = environment.supabaseKey;

    private isLocalDev(): boolean {
        if (typeof window === 'undefined') return false;
        const host = window.location.hostname;
        return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    }

    /**
     * Send a WhatsApp message using Supabase Edge Function
     */
    sendTemplateMessage(
        to: string,
        templateName: string,
        languageCode: string = 'es_AR',
        components: WhatsAppComponent[] = []
    ): Observable<unknown> {
        if (this.isLocalDev()) {
            this.logger.info(`[WhatsApp] Dev mode: simulated template "${templateName}" to ${to}`);
            return of({ success: true, simulated: true });
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json'
        });

        const body = {
            to: to,
            type: 'template',
            tenant_id: this.tenantService.getTenantId(),
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
            }
        };

        return this.http.post(this.functionUrl, body, { headers });
    }

    /**
     * Send a text message (only allowed within 24h window)
     */
    sendTextMessage(to: string, message: string): Observable<unknown> {
        if (this.isLocalDev()) {
            this.logger.info(`[WhatsApp] Dev mode: simulated message to ${to}`);
            return of({ success: true, simulated: true });
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json'
        });

        const body = {
            to: to,
            type: 'text',
            tenant_id: this.tenantService.getTenantId(),
            text: {
                preview_url: false,
                body: message
            }
        };

        return this.http.post(this.functionUrl, body, { headers });
    }
}
