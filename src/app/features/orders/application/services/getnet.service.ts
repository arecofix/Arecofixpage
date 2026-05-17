import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';

export interface PaymentIntentResponse {
    paymentUrl: string;
    transactionId: string;
}

@Injectable({
    providedIn: 'root'
})
export class GetnetService {
    private supabase = inject(SUPABASE_CLIENT);
    private logger = inject(LoggerService);

    /**
     * Initializes a payment intent with Santander Getnet.
     * In a production environment, this calls a Supabase Edge Function to avoid exposing secret keys.
     */
    createPaymentIntent(orderId: string, amount: number, customerName: string): Observable<PaymentIntentResponse> {
        this.logger.info(`Creating Getnet Payment Intent for Order ${orderId} - Amount: $${amount}`);

        // --- GETNET INTEGRATION (MOCKED UNTIL EDGE FUNCTION IS READY) ---
        // In the future, this will be:
        /*
        return from(
            this.supabase.functions.invoke('getnet-payment-intent', {
                body: { orderId, amount, customerName }
            })
        ).pipe(
            map(res => {
                if (res.error) throw res.error;
                return res.data as PaymentIntentResponse;
            })
        );
        */

        // For now, we simulate a successful link generation
        // Normally, Getnet returns a secure hosted checkout page URL
        const mockTransactionId = `GETNET-${Date.now().toString(36).toUpperCase()}`;
        
        return of({
            paymentUrl: `https://checkout.getnet.com.ar/pay/${mockTransactionId}`,
            transactionId: mockTransactionId
        });
    }

    /**
     * This method would be used to poll the payment status or handle the callback
     */
    verifyPaymentStatus(transactionId: string): Observable<boolean> {
        // Mock successful verification
        return of(true);
    }
}
