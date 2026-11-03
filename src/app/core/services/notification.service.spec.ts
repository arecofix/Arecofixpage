import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';
import { ToastService } from '../../shared/services/toast.service';
import { environment } from '@env/environment';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockSupabase: any;
  let mockAuth: any;
  let mockTenant: any;
  let mockToast: any;

  beforeEach(() => {
    mockSupabase = {
      channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((cb) => {
          cb('SUBSCRIBED');
          return this;
        })
      }),
      removeChannel: jest.fn(),
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null })
      }),
      realtime: {
        disconnect: jest.fn()
      }
    };

    mockAuth = {
      getCurrentUser: jest.fn().mockReturnValue({ id: 'user-123' }),
      getCurrentProfile: jest.fn().mockReturnValue({ role: 'admin' })
    };

    mockTenant = {
      getTenantId: jest.fn().mockReturnValue('tenant-abc')
    };

    mockToast = {
      show: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: AuthService, useValue: mockAuth },
        { provide: TenantService, useValue: mockTenant },
        { provide: ToastService, useValue: mockToast }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    service.unsubscribe();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fallback to polling when enableRealtime is false', fakeAsync(() => {
    environment.enableRealtime = false;
    const loadSpy = jest.spyOn(service, 'loadNotifications').mockResolvedValue();

    service.subscribeToRealtime();

    // Verify it did not attempt to open a realtime channel
    expect(mockSupabase.channel).not.toHaveBeenCalled();

    // Fast-forward 60s
    tick(60000);
    expect(loadSpy).toHaveBeenCalled();
  }));

  it('should subscribe to realtime channel when enableRealtime is true', () => {
    environment.enableRealtime = true;
    service.subscribeToRealtime();
    expect(mockSupabase.channel).toHaveBeenCalledWith('public:notifications:tenant-abc');
  });

  it('should remove channel and clear polling on unsubscribe', () => {
    environment.enableRealtime = true;
    service.subscribeToRealtime();
    service.unsubscribe();
    expect(mockSupabase.removeChannel).toHaveBeenCalled();
  });
});
