import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { globalErrorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

describe('globalErrorInterceptor (QA Network Protection)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockNotification: any;
  let mockLogger: any;

  beforeEach(() => {
    mockNotification = { showError: jasmine.createSpy('showError') };
    mockLogger = { error: jasmine.createSpy('error') };

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotification },
        { provide: LoggerService, useValue: mockLogger },
        provideHttpClient(withInterceptors([globalErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should intercept 401 status code and gracefully notify session expiration', () => {
    http.get('/api/secure-data').subscribe({
      next: () => fail('request should have failed with 401'),
      error: (err) => {
        expect(mockLogger.error).toHaveBeenCalled();
        expect(mockNotification.showError).toHaveBeenCalledWith('Tu sesión ha expirado.');
      }
    });

    const req = httpMock.expectOne('/api/secure-data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should intercept 403 status code and alert insufficient permissions', () => {
    http.get('/api/admin-data').subscribe({
      next: () => fail('request should have failed with 403'),
      error: (err) => {
        expect(mockLogger.error).toHaveBeenCalled();
        expect(mockNotification.showError).toHaveBeenCalledWith('No tienes permisos suficientes.');
      }
    });

    const req = httpMock.expectOne('/api/admin-data');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });

  it('should intercept Server 500 Errors and trigger critical notification', () => {
    http.get('/api/metrics').subscribe({
      next: () => fail('request should have failed with 500'),
      error: (err) => {
        expect(mockLogger.error).toHaveBeenCalled();
        expect(mockNotification.showError).toHaveBeenCalledWith('Fallo crítico en el servidor de destino.');
      }
    });

    const req = httpMock.expectOne('/api/metrics');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should pass transparent JSON payload messages when provided', () => {
    http.get('/api/validate').subscribe({
      next: () => fail('request should have failed with 400'),
      error: (err) => {
        expect(mockLogger.error).toHaveBeenCalled();
        // Since backend JSON sends a specific "message", it overrides generic messages
        expect(mockNotification.showError).toHaveBeenCalledWith('El ticket promedio ya fue calculado.');
      }
    });

    const req = httpMock.expectOne('/api/validate');
    req.flush({ message: 'El ticket promedio ya fue calculado.' }, { status: 400, statusText: 'Bad Request' });
  });
});
