import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoggerService } from '@app/core/services/logger.service';

export interface MpPreferenceResponse {
  init_point: string;
  id: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);

  /**
   * Creates a payment preference via the secure backend API.
   * Note: The backend recalculates prices, validates real stock from DB,
   * sets back_urls, auto_return, and notification_url with zero client tampering risk.
   */
  createPreference(
    orderId: string,
    _items?: unknown[],
    _shippingCost?: number,
    _customerName?: string
  ): Observable<MpPreferenceResponse> {
    this.logger.info(`Creating MP Preference for Order ${orderId}`);

    return this.http.post<MpPreferenceResponse>('/api/mercadopago/create-preference', {
      orderId
    }).pipe(
      map(res => {
        if (!res || !res.init_point) {
          throw new Error('No se pudo generar el enlace de pago de Mercado Pago.');
        }
        return res;
      }),
      catchError(err => {
        const errorMsg = err?.error?.error || err?.message || 'Error de conexión con la pasarela de pago';
        this.logger.error(`Error in MercadoPagoService: ${errorMsg}`);
        return throwError(() => new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
      })
    );
  }
}
