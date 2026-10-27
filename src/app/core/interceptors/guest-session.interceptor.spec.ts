import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { guestSessionInterceptor } from './guest-session.interceptor';
import { getOrCreateGuestSessionId } from '../utils/uuid.utils';

describe('guestSessionInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([guestSessionInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should attach x-guest-session header to Supabase /rest/v1/orders and /rest/v1/order_items requests', () => {
    const expectedSession = getOrCreateGuestSessionId();

    http.get('https://db.arecofix.com.ar/rest/v1/orders').subscribe();
    const req1 = httpMock.expectOne('https://db.arecofix.com.ar/rest/v1/orders');
    expect(req1.request.headers.has('x-guest-session')).toBe(true);
    expect(req1.request.headers.get('x-guest-session')).toBe(expectedSession);
    req1.flush([]);

    http.get('https://db.arecofix.com.ar/rest/v1/order_items').subscribe();
    const req2 = httpMock.expectOne('https://db.arecofix.com.ar/rest/v1/order_items');
    expect(req2.request.headers.has('x-guest-session')).toBe(true);
    expect(req2.request.headers.get('x-guest-session')).toBe(expectedSession);
    req2.flush([]);
  });

  it('should not attach x-guest-session header to Express /api/ requests', () => {
    http.get('https://arecofix.com.ar/api/admin/dashboard/metrics').subscribe();
    const req1 = httpMock.expectOne('https://arecofix.com.ar/api/admin/dashboard/metrics');
    expect(req1.request.headers.has('x-guest-session')).toBe(false);
    req1.flush({});

    http.get('https://arecofix.com.ar/api/public/services').subscribe();
    const req2 = httpMock.expectOne('https://arecofix.com.ar/api/public/services');
    expect(req2.request.headers.has('x-guest-session')).toBe(false);
    req2.flush({});
  });

  it('should not attach x-guest-session header to catalog Supabase endpoints like /rest/v1/categories', () => {
    http.get('https://db.arecofix.com.ar/rest/v1/categories').subscribe();

    const req = httpMock.expectOne('https://db.arecofix.com.ar/rest/v1/categories');
    expect(req.request.headers.has('x-guest-session')).toBe(false);
    req.flush([]);
  });

  it('should not attach x-guest-session header to external unrelated URLs', () => {
    http.get('https://external-service.com/data').subscribe();

    const req = httpMock.expectOne('https://external-service.com/data');
    expect(req.request.headers.has('x-guest-session')).toBe(false);
    req.flush({});
  });
});
