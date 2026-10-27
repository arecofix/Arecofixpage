import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { globalErrorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

describe('globalErrorInterceptor (Destructive HTTP & Edge-Case Battery)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockNotification: { showError: jest.Mock };
  let mockLogger: { error: jest.Mock; warn: jest.Mock };

  beforeEach(() => {
    mockNotification = { showError: jest.fn() };
    mockLogger = { error: jest.fn(), warn: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotification },
        { provide: LoggerService, useValue: mockLogger },
        provideHttpClient(
          withXhr(),
          withInterceptors([globalErrorInterceptor]),
        ),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('Extreme Gateways & Server Crashes (504, 502, 500)', () => {
    it('should catch 504 Gateway Timeout with HTML body without crashing or printing undefined', () => {
      const html504Body = '<!DOCTYPE html><html><head><title>504 Gateway Time-out</title></head><body><center><h1>504 Gateway Time-out</h1></center></body></html>';

      http.get('/api/analytics').subscribe({
        next: () => fail('Should have failed with 504'),
        error: (err) => {
          expect(mockLogger.error).toHaveBeenCalled();
          expect(mockNotification.showError).toHaveBeenCalledWith(
            'Fallo crítico en el servidor de destino.'
          );
        }
      });

      const req = httpMock.expectOne('/api/analytics');
      req.flush(html504Body, { status: 504, statusText: 'Gateway Timeout' });
    });

    it('should handle circular object references inside error payload without JSON circular error crash', () => {
      const circularError: any = { code: 'CIRCULAR_ERR' };
      circularError.self = circularError;

      http.get('/api/circular-test').subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          expect(mockLogger.error).toHaveBeenCalled();
          expect(mockNotification.showError).toHaveBeenCalledWith(
            'Fallo crítico en el servidor de destino.'
          );
        }
      });

      const req = httpMock.expectOne('/api/circular-test');
      req.flush(circularError, { status: 500, statusText: 'Internal Error' });
    });

    it('should preserve custom error messages from structured JSON backend responses', () => {
      http.post('/api/checkout', {}).subscribe({
        next: () => fail('Should have failed with 400'),
        error: (err) => {
          expect(mockNotification.showError).toHaveBeenCalledWith(
            'El cupón de descuento ha vencido.'
          );
        }
      });

      const req = httpMock.expectOne('/api/checkout');
      req.flush(
        { message: 'El cupón de descuento ha vencido.', code: 'COUPON_EXPIRED' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should suppress notifications and error logging for registered silent endpoints (fire-and-forget)', () => {
      http.post('/functions/v1/send-whatsapp', { to: '123456789' }).subscribe({
        next: () => fail('Should have failed'),
        error: (err) => {
          // Notification must NOT be shown to user for silent background notifications
          expect(mockNotification.showError).not.toHaveBeenCalled();
          expect(mockLogger.error).not.toHaveBeenCalled();
          expect(mockLogger.warn).toHaveBeenCalledWith(
            expect.stringContaining('[SilentEndpoint] Error HTTP suprimido')
          );
        }
      });

      const req = httpMock.expectOne('/functions/v1/send-whatsapp');
      req.flush('Gateway Timeout', { status: 504, statusText: 'Gateway Timeout' });
    });
  });
});
