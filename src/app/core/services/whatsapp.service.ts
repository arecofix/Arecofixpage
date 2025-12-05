import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
        components: any[] = []
    ): Observable<any> {
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
    sendTextMessage(to: string, message: string): Observable<any> {
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
