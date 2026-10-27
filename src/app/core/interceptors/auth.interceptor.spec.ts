import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  HttpContext,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  authInterceptor,
  AuthInterceptorHandler,
  IS_RETRY_REQUEST,
} from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let mockAuthService: any;
  let mockRouter: any;
  let mockLogger: any;

  beforeEach(() => {
    mockAuthService = {
      getStoredAccessToken: jest.fn().mockReturnValue('initial-valid-token-123'),
      refreshSession: jest.fn().mockResolvedValue({
        access_token: 'refreshed-fresh-token-456',
        user: { id: 'user-1' },
      }),
      signOut: jest.fn().mockResolvedValue(null),
    };

    mockRouter = {
      url: '/admin/dashboard',
      navigate: jest.fn().mockResolvedValue(true),
    };

    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptorHandler,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLogger },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach Bearer token to relative protected API endpoints', (done) => {
    http.get('/api/admin/dashboard/metrics?range=month').subscribe((res: any) => {
      expect(res.success).toBe(true);
      done();
    });

    const req = httpMock.expectOne('/api/admin/dashboard/metrics?range=month');
    expect(req.request.headers.get('Authorization')).toBe('Bearer initial-valid-token-123');
    req.flush({ success: true });
  });

  it('should attach Bearer token to absolute protected API endpoints', (done) => {
    http.get('https://arecofix.com.ar/api/admin/dashboard/metrics?range=month').subscribe((res: any) => {
      expect(res.success).toBe(true);
      done();
    });

    const req = httpMock.expectOne('https://arecofix.com.ar/api/admin/dashboard/metrics?range=month');
    expect(req.request.headers.get('Authorization')).toBe('Bearer initial-valid-token-123');
    req.flush({ success: true });
  });

  it('should NOT attach Bearer token to public endpoints', (done) => {
    http.get('/api/public/leads').subscribe((res: any) => {
      expect(res.ok).toBe(true);
      done();
    });

    const req = httpMock.expectOne('/api/public/leads');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ ok: true });
  });

  it('should NOT attach Bearer token to external 3rd-party domains', (done) => {
    http.get('https://api.mercadopago.com/checkout/preferences').subscribe((res: any) => {
      expect(res.ok).toBe(true);
      done();
    });

    const req = httpMock.expectOne('https://api.mercadopago.com/checkout/preferences');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ ok: true });
  });

  it('should handle 401, refresh token once, and retry request with new token and HttpContextToken (no X-Auth-Retry header)', (done) => {
    http.get('/api/admin/dashboard/metrics').subscribe((res: any) => {
      expect(res.success).toBe(true);
      expect(mockAuthService.refreshSession).toHaveBeenCalledTimes(1);
      done();
    });

    // 1st attempt: responds with 401
    const req1 = httpMock.expectOne('/api/admin/dashboard/metrics');
    expect(req1.request.headers.get('Authorization')).toBe('Bearer initial-valid-token-123');
    expect(req1.request.context.get(IS_RETRY_REQUEST)).toBe(false);
    req1.flush({ error: 'jwt expired' }, { status: 401, statusText: 'Unauthorized' });

    // 2nd attempt (replayed): should use refreshed token and HttpContextToken IS_RETRY_REQUEST=true, NO X-Auth-Retry header
    setTimeout(() => {
      const req2 = httpMock.expectOne('/api/admin/dashboard/metrics');
      expect(req2.request.headers.get('Authorization')).toBe('Bearer refreshed-fresh-token-456');
      expect(req2.request.headers.has('X-Auth-Retry')).toBe(false);
      expect(req2.request.context.get(IS_RETRY_REQUEST)).toBe(true);
      req2.flush({ success: true });
    }, 10);
  });

  it('should queue multiple concurrent 401 requests and trigger only ONE refresh call', (done) => {
    let completedRequests = 0;

    const checkDone = () => {
      completedRequests++;
      if (completedRequests === 3) {
        expect(mockAuthService.refreshSession).toHaveBeenCalledTimes(1);
        done();
      }
    };

    // Three simultaneous requests
    http.get('/api/admin/dashboard/metrics').subscribe(checkDone);
    http.get('/api/admin/dashboard/analytics').subscribe(checkDone);
    http.get('/api/admin/dashboard/db-health').subscribe(checkDone);

    // Initial 401 for all three
    const reqMetrics1 = httpMock.expectOne('/api/admin/dashboard/metrics');
    const reqAnalytics1 = httpMock.expectOne('/api/admin/dashboard/analytics');
    const reqDbHealth1 = httpMock.expectOne('/api/admin/dashboard/db-health');

    reqMetrics1.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    reqAnalytics1.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    reqDbHealth1.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });

    // After refresh completes, all three replayed with fresh token
    setTimeout(() => {
      const reqMetrics2 = httpMock.expectOne('/api/admin/dashboard/metrics');
      const reqAnalytics2 = httpMock.expectOne('/api/admin/dashboard/analytics');
      const reqDbHealth2 = httpMock.expectOne('/api/admin/dashboard/db-health');

      expect(reqMetrics2.request.headers.get('Authorization')).toBe('Bearer refreshed-fresh-token-456');
      expect(reqAnalytics2.request.headers.get('Authorization')).toBe('Bearer refreshed-fresh-token-456');
      expect(reqDbHealth2.request.headers.get('Authorization')).toBe('Bearer refreshed-fresh-token-456');

      expect(reqMetrics2.request.context.get(IS_RETRY_REQUEST)).toBe(true);
      expect(reqAnalytics2.request.context.get(IS_RETRY_REQUEST)).toBe(true);
      expect(reqDbHealth2.request.context.get(IS_RETRY_REQUEST)).toBe(true);

      reqMetrics2.flush({ success: true });
      reqAnalytics2.flush({ success: true });
      reqDbHealth2.flush({ success: true });
    }, 15);
  });

  // ─── SECURITY TESTS ────────────────────────────────────────────────────────

  it('[Security 1] should prevent infinite loops when a request already marked with IS_RETRY_REQUEST gets 401', (done) => {
    // Request explicitly sent with IS_RETRY_REQUEST context token = true
    const context = new HttpContext().set(IS_RETRY_REQUEST, true);

    http.get('/api/admin/dashboard/metrics', { context }).subscribe({
      next: () => fail('Request should fail immediately on persistent 401'),
      error: (err) => {
        expect(err.status).toBe(401);
        expect(mockAuthService.refreshSession).not.toHaveBeenCalled();
        expect(mockAuthService.signOut).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/admin/dashboard' },
        });
        done();
      },
    });

    const req = httpMock.expectOne('/api/admin/dashboard/metrics');
    req.flush({ error: 'Unauthorized retry' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('[Security 2] should gracefully handle "refresh caído" (network error during refreshSession)', (done) => {
    mockAuthService.refreshSession.mockRejectedValue(new Error('Network failure: Supabase Auth Unreachable'));

    http.get('/api/admin/dashboard/metrics').subscribe({
      next: () => fail('Request should fail when refresh endpoint crashes'),
      error: (err) => {
        expect(mockAuthService.signOut).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/admin/dashboard' },
        });
        done();
      },
    });

    const req = httpMock.expectOne('/api/admin/dashboard/metrics');
    req.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('[Security 3] should handle logout during refresh (refreshSession returns null session)', (done) => {
    mockAuthService.refreshSession.mockResolvedValue(null);

    http.get('/api/admin/dashboard/metrics').subscribe({
      next: () => fail('Request should fail when user is logged out during refresh'),
      error: (err) => {
        expect(err.status).toBe(401);
        expect(mockAuthService.signOut).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
          queryParams: { returnUrl: '/admin/dashboard' },
        });
        done();
      },
    });

    const req = httpMock.expectOne('/api/admin/dashboard/metrics');
    req.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('[Security 4] should immediately notify queued concurrent requests when refresh fails without waiting timeout', (done) => {
    mockAuthService.refreshSession.mockRejectedValue(new Error('Refresh network error'));

    let errorsCount = 0;
    const startTime = Date.now();

    const handleError = (err: any) => {
      errorsCount++;
      if (errorsCount === 2) {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeLessThan(1000); // Must fail immediately, not wait 10s
        expect(mockAuthService.refreshSession).toHaveBeenCalledTimes(1);
        done();
      }
    };

    http.get('/api/admin/dashboard/metrics').subscribe({
      next: () => fail('Should fail'),
      error: handleError,
    });
    http.get('/api/admin/dashboard/analytics').subscribe({
      next: () => fail('Should fail'),
      error: handleError,
    });

    const req1 = httpMock.expectOne('/api/admin/dashboard/metrics');
    const req2 = httpMock.expectOne('/api/admin/dashboard/analytics');

    req1.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
    req2.flush({ error: 'expired' }, { status: 401, statusText: 'Unauthorized' });
  });
});
