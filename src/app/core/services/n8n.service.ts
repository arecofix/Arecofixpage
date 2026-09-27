import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class N8nService {
  private readonly http = inject(HttpClient);
  
  // URL base de n8n
  private readonly n8nUrl = 'https://n8n.arecofix.com.ar';

  /**
   * Dispara un webhook en n8n
   * @param webhookPath El path del webhook (ej: 'webhook/nuevo-cliente' o 'webhook-test/nuevo-cliente')
   * @param payload Los datos a enviar en el body
   */
  public triggerWebhook(webhookPath: string, payload: any): Observable<any> {
    const url = `${this.n8nUrl}/${webhookPath}`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, payload, { headers });
  }
}
