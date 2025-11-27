import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WhatsappService {
    private http = inject(HttpClient);
    private apiUrl = environment.whatsappApiUrl;
    private token = environment.whatsappToken;
    private defaultPhoneNumberId = environment.whatsappPhoneNumberId;

    /**
     * Send a WhatsApp message using the Meta Cloud API
     * @param to The recipient's phone number
     * @param templateName The name of the template to send
     * @param languageCode The language code (e.g., 'es_AR')
     * @param components Optional components for the template
     * @param phoneNumberId Optional ID of the phone number sending the message (defaults to env config)
     */
    sendTemplateMessage(
        to: string,
        templateName: string,
        languageCode: string = 'es_AR',
        components: any[] = [],
        phoneNumberId: string = this.defaultPhoneNumberId
    ): Observable<any> {
        const url = `${this.apiUrl}/${phoneNumberId}/messages`;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        });

        const body = {
            messaging_product: 'whatsapp',
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

        return this.http.post(url, body, { headers });
    }

    /**
     * Send a text message (only allowed within 24h window)
     */
    sendTextMessage(to: string, message: string, phoneNumberId: string = this.defaultPhoneNumberId): Observable<any> {
        const url = `${this.apiUrl}/${phoneNumberId}/messages`;

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        });

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
                preview_url: false,
                body: message
            }
        };

        return this.http.post(url, body, { headers });
    }
}
