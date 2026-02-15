import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    // Use Supabase Edge Function URL
    private functionUrl = `${environment.supabaseUrl}/functions/v1/send-whatsapp`;
    private supabaseKey = environment.supabaseKey;

    /**
     * Send a WhatsApp message using Supabase Edge Function
     */
    sendTemplateMessage(
        to: string,
        templateName: string,
        languageCode: string = 'es_AR',
        components: WhatsAppComponent[] = []
    ): Observable<unknown> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json'
        });

        const body = {
            to: to,
            type: 'template',
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
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json'
        });

        const body = {
            to: to,
            type: 'text',
            text: {
                preview_url: false,
                body: message
            }
        };

        return this.http.post(this.functionUrl, body, { headers });
    }
}
