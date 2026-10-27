import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { assertUuid } from '../utils/uuid.utils';
import { SupabaseCartRepository } from '@app/features/orders/infrastructure/repositories/supabase-cart.repository';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { LoggerService } from '../services/logger.service';
import { TenantService } from '../services/tenant.service';
import { SupabaseErrorHandlerService } from '../services/supabase-error-handler.service';
import { BranchContextService } from '../services/branch-context.service';

describe('Resilience against undefined UUIDs (Incident Fix)', () => {
  describe('assertUuid contract', () => {
    it("returns null for 'undefined', 'null', and malformed values", () => {
      expect(assertUuid('undefined')).toBeNull();
      expect(assertUuid('null')).toBeNull();
      expect(assertUuid(null)).toBeNull();
      expect(assertUuid(undefined)).toBeNull();
      expect(assertUuid('')).toBeNull();
    });

    it('returns lowercase valid canonical UUID', () => {
      const canonical = '550e8400-e29b-41d4-a716-446655440000';
      expect(assertUuid(canonical)).toBe(canonical);
      expect(assertUuid('BBA26CCD-59CE-471C-AAC0-4C1F5513DE3B')).toBe('bba26ccd-59ce-471c-aac0-4c1f5513de3b');
    });
  });

  describe('SupabaseCartRepository.getActiveCart', () => {
    let mockSupabase: any;
    let mockLogger: any;
    let repo: SupabaseCartRepository;

    beforeEach(() => {
      mockSupabase = {
        from: jest.fn(),
      };
      mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      };

      TestBed.configureTestingModule({
        providers: [
          SupabaseCartRepository,
          { provide: SUPABASE_CLIENT, useValue: mockSupabase },
          { provide: LoggerService, useValue: mockLogger },
          { provide: TenantService, useValue: { getTenantId: () => '00000000-0000-0000-0000-000000000000' } },
          { provide: SupabaseErrorHandlerService, useValue: { handleError: jest.fn() } },
          { provide: BranchContextService, useValue: { getBranchId: () => null } },
        ],
      });

      repo = TestBed.inject(SupabaseCartRepository);
    });

    it('returns null immediately without querying Supabase when userId and sessionId are undefined or invalid', async () => {
      const result1 = await firstValueFrom(repo.getActiveCart(undefined, undefined));
      expect(result1).toBeNull();
      expect(mockSupabase.from).not.toHaveBeenCalled();

      const result2 = await firstValueFrom(repo.getActiveCart('undefined', 'undefined'));
      expect(result2).toBeNull();
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });
});
