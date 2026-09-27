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
});
