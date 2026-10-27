import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';
import { LoggerService } from './logger.service';
import { OfflineSyncService } from './offline-sync.service';

describe('SupabaseService (Destructive API Failures & Resilience Suite)', () => {
  let service: SupabaseService;
  let mockLogger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock; debug: jest.Mock };
  let mockSync: {
    getCachedRequest: jest.Mock;
    cacheGetRequest: jest.Mock;
    enqueueMutation: jest.Mock;
    clearCache: jest.Mock;
  };

  let originalFetch: typeof window.fetch;
  let originalNavigatorOnLine: PropertyDescriptor | undefined;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    originalFetch = window.fetch;
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    mockSync = {
      getCachedRequest: jest.fn().mockResolvedValue(null),
      cacheGetRequest: jest.fn().mockResolvedValue(undefined),
      enqueueMutation: jest.fn().mockResolvedValue(undefined),
      clearCache: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        SupabaseService,
        { provide: LoggerService, useValue: mockLogger },
        { provide: OfflineSyncService, useValue: mockSync }
      ]
    });

    service = TestBed.inject(SupabaseService);
  });

  afterEach(() => {
    window.fetch = originalFetch;
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Extreme HTTP Error Codes & Gateway Timeouts', () => {
    it('should catch 504/500 Server Errors and fallback to IndexedDB cache', async () => {
      let callCount = 0;
      window.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve(new Response('<html>504 Gateway Time-out</html>', {
          status: 504,
          statusText: 'Gateway Timeout'
        }));
      });

      mockSync.getCachedRequest.mockResolvedValueOnce({
        data: JSON.stringify([{ id: 'fallback-repair' }]),
        status: 200,
        statusText: 'OK (IDB)',
        headers: [['content-type', 'application/json']]
      });

      const customFetch = (service as any).client['fetch'];
      const response = await customFetch('https://db.arecofix.com.ar/rest/v1/repairs?select=*');

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK (IDB)');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Fallback to IndexedDB after fetch failure')
      );
    }, 15000);

    it('should immediately bypass retries on 402/429 Quota Exceeded without wasteful retry delays', async () => {
      let callCount = 0;
      window.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve(new Response('{"message": "rate limit exceeded"}', {
          status: 429,
          statusText: 'Too Many Requests'
        }));
      });

      const customFetch = (service as any).client['fetch'];
      // Transactional endpoint avoids D1 worker failover and throws immediately
      await expect(
        customFetch('https://db.arecofix.com.ar/rest/v1/orders?select=*')
      ).rejects.toThrow(/Quota Exceeded: 429/);

      expect(callCount).toBe(1); // Crucial: Zero retries wasted on quota exceed!
    });

    it('should purge corrupted JWT auth tokens from storage upon receiving 400 refresh token expiration', async () => {
      localStorage.setItem('supabase-auth-token', 'expired-legacy-token');
      localStorage.setItem('sb-test-auth-token', 'expired-sb-token');
      sessionStorage.setItem('supabase-auth-token', 'expired-session-token');

      window.fetch = jest.fn().mockResolvedValue(new Response('{"error":"invalid_grant"}', {
        status: 400,
        statusText: 'Bad Request'
      }));

      const customFetch = (service as any).client['fetch'];
      await customFetch('https://db.arecofix.com.ar/auth/v1/token?grant_type=refresh_token', {
        method: 'POST'
      });

      expect(localStorage.getItem('supabase-auth-token')).toBeNull();
      expect(localStorage.getItem('sb-test-auth-token')).toBeNull();
      expect(sessionStorage.getItem('supabase-auth-token')).toBeNull();
    });

    it('should detect 401 PGRST301/JWSError and wipe corrupted tokens immediately', async () => {
      localStorage.setItem('cypress-test', 'true'); // Prevents window.location.reload() in test
      localStorage.setItem('supabase-auth-token', 'tampered-corrupted-jwt');

      window.fetch = jest.fn().mockResolvedValue(new Response('{"code":"PGRST301","message":"JWSError (JWSInvalidSignature)"}', {
        status: 401,
        statusText: 'Unauthorized'
      }));

      const customFetch = (service as any).client['fetch'];
      const resp = await customFetch('https://db.arecofix.com.ar/rest/v1/profile?select=*');

      expect(resp.status).toBe(401);
    });
  });

  describe('Offline Sync & Mutation Queueing', () => {
    it('should serve from IndexedDB cache when navigator.onLine is false', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

      const cachedPayload = [{ id: 'p1', name: 'Pantalla OLED' }];
      mockSync.getCachedRequest.mockResolvedValue({
        data: JSON.stringify(cachedPayload),
        status: 200,
        statusText: 'OK (Cached)',
        headers: [['content-type', 'application/json']]
      });

      const customFetch = (service as any).client['fetch'];
      const response = await customFetch('https://db.arecofix.com.ar/rest/v1/products?select=*');
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(cachedPayload);
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Serving from IndexedDB cache')
      );
    });

    it('should queue mutations and return mock 201/200 when mutating offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

      const mutationPayload = { product_id: 'p123', quantity: 2 };
      const customFetch = (service as any).client['fetch'];
      
      const response = await customFetch('https://db.arecofix.com.ar/rest/v1/order_items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutationPayload)
      });

      expect(response.status).toBe(201);
      expect(response.statusText).toBe('OK (Offline Mock)');
      expect(mockSync.enqueueMutation).toHaveBeenCalledWith(
        expect.stringContaining('/rest/v1/order_items'),
        'POST',
        expect.any(Array),
        JSON.stringify(mutationPayload)
      );

      const returnedData = await response.json();
      expect(returnedData).toEqual([mutationPayload]);
    });
  });

  describe('Cache Epoch & State Invalidation Rigor', () => {
    it('should invalidate memory and sync cache upon successful mutation', async () => {
      window.fetch = jest.fn().mockResolvedValue(new Response('{"success": true}', {
        status: 200,
        statusText: 'OK',
        headers: new Headers([['content-type', 'application/json']])
      }));

      // Seed cache
      (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/products', {
        data: '[]', headers: [], status: 200, statusText: 'OK', expiresAt: Date.now() + 60000
      });
      expect((service as any).cacheMap.size).toBe(1);

      const customFetch = (service as any).client['fetch'];
      await customFetch('https://db.arecofix.com.ar/rest/v1/products', {
        method: 'PATCH',
        body: JSON.stringify({ price: 2000 })
      });

      expect((service as any).cacheMap.size).toBe(0);
      expect(mockSync.clearCache).toHaveBeenCalled();
    });

    it('should selectively clear only target table in clearCacheForTable without touching unrelated tables', () => {
      (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/repairs?id=1', { data: '{}', expiresAt: Date.now() + 60000 });
      (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/repairs?id=2', { data: '{}', expiresAt: Date.now() + 60000 });
      (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/customers?select=*', { data: '{}', expiresAt: Date.now() + 60000 });

      service.clearCacheForTable('repairs');

      expect((service as any).cacheMap.has('https://db.arecofix.com.ar/rest/v1/repairs?id=1')).toBe(false);
      expect((service as any).cacheMap.has('https://db.arecofix.com.ar/rest/v1/repairs?id=2')).toBe(false);
      expect((service as any).cacheMap.has('https://db.arecofix.com.ar/rest/v1/customers?select=*')).toBe(true);
    });
  });
});
