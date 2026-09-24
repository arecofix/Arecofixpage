import { TestBed } from '@angular/core/testing';
import { SupabaseCustomerDeviceRepository } from './supabase-customer-device.repository';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from '@app/core/services/tenant.service';
import { of } from 'rxjs';

describe('SupabaseCustomerDeviceRepository', () => {
  let repository: SupabaseCustomerDeviceRepository;
  let mockSupabase: any;
  let mockTenantService: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null })
    };

    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue('tenant-1')
    };

    TestBed.configureTestingModule({
      providers: [
        SupabaseCustomerDeviceRepository,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: TenantService, useValue: mockTenantService }
      ]
    });

    repository = TestBed.inject(SupabaseCustomerDeviceRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('upsertDevice', () => {
    it('should create new device if deviceId is not provided', (done) => {
      repository.upsertDevice({ userId: 'u1', modelId: 'm1', passcode: '1234' }).subscribe(id => {
        expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
          user_id: 'u1',
          passcode: '1234',
          tenant_id: 'tenant-1'
        }));
        expect(id).toBe('test-id');
        done();
      });
    });

    it('should update device if deviceId is provided', (done) => {
      repository.upsertDevice({ deviceId: 'd1', userId: 'u1', modelId: 'm1', passcode: '5678' }).subscribe(id => {
        expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
          passcode: '5678'
        }));
        expect(id).toBe('d1');
        done();
      });
    });
  });
});
