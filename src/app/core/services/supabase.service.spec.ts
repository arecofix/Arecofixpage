import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';
import { LoggerService } from './logger.service';
import { OfflineSyncService } from './offline-sync.service';

describe('SupabaseService', () => {
  let service: SupabaseService;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockOfflineSyncService: jest.Mocked<OfflineSyncService>;

  beforeEach(() => {
    mockLoggerService = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as any;

    mockOfflineSyncService = {
      getCachedRequest: jest.fn(),
      cacheGetRequest: jest.fn(),
      enqueueMutation: jest.fn(),
      clearCache: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SupabaseService,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: OfflineSyncService, useValue: mockOfflineSyncService }
      ]
    });
    
    // Assign fetch to a mock before instantiation if needed, or window.dispatchEvent
    (window as any).dispatchEvent = jest.fn();

    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return client', () => {
    expect(service.getClient()).toBeTruthy();
  });

  it('should clear cache and increment cacheEpoch on clearCache()', async () => {
    const initialEpoch = (service as any).cacheEpoch;
    (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/repairs', {
      data: '[]',
      headers: [],
      status: 200,
      statusText: 'OK',
      expiresAt: Date.now() + 60000
    });

    await service.clearCache();

    expect((service as any).cacheMap.size).toBe(0);
    expect((service as any).cacheEpoch).toBe(initialEpoch + 1);
    expect(mockOfflineSyncService.clearCache).toHaveBeenCalled();
  });

  it('should selectively clear entries for a specific table on clearCacheForTable()', () => {
    const initialEpoch = (service as any).cacheEpoch;
    (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/repairs?select=*', {
      data: '[]', headers: [], status: 200, statusText: 'OK', expiresAt: Date.now() + 60000
    });
    (service as any).cacheMap.set('https://db.arecofix.com.ar/rest/v1/products?select=*', {
      data: '[]', headers: [], status: 200, statusText: 'OK', expiresAt: Date.now() + 60000
    });

    service.clearCacheForTable('repairs');

    expect((service as any).cacheMap.has('https://db.arecofix.com.ar/rest/v1/repairs?select=*')).toBe(false);
    expect((service as any).cacheMap.has('https://db.arecofix.com.ar/rest/v1/products?select=*')).toBe(true);
    expect((service as any).cacheEpoch).toBe(initialEpoch + 1);
  });
});
