import { TestBed } from '@angular/core/testing';
import { BranchRepository } from './branch.repository';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { LoggerService } from '../services/logger.service';
import { SupabaseStorageService } from '../services/supabase-storage.service';
import { firstValueFrom } from 'rxjs';

describe('BranchRepository - Public Fallback Security', () => {
  let repository: BranchRepository;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
      rpc: jest.fn(),
      auth: {
        onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        getUser: jest.fn().mockResolvedValue({ data: { user: null } })
      }
    };

    const mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn()
    };

    const mockStorage = {
      uploadFile: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        BranchRepository,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: LoggerService, useValue: mockLogger },
        { provide: SupabaseStorageService, useValue: mockStorage }
      ]
    });

    repository = TestBed.inject(BranchRepository);
  });

  it('should fall back to get_public_branch RPC when branches table returns empty for slug query', async () => {
    const publicBranch = {
      id: 'branch-1',
      name: 'Central',
      slug: 'central',
      address: 'Calle 123',
      is_active: true
    };

    mockSupabase.from.mockImplementation((tableName: string) => {
      if (tableName === 'branches') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                range: jest.fn().mockResolvedValue({ data: [], count: 0, error: null })
              }),
              range: jest.fn().mockResolvedValue({ data: [], count: 0, error: null })
            })
          })
        };
      }
      return {};
    });

    mockSupabase.rpc.mockImplementation((fnName: string) => {
      if (fnName === 'get_public_branch') {
        return {
          maybeSingle: jest.fn().mockResolvedValue({ data: publicBranch, error: null })
        };
      }
      return { maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }) };
    });

    const result = await firstValueFrom(repository.getWhere('slug', 'central'));
    expect(result).toEqual([publicBranch]);
    expect(mockSupabase.from).toHaveBeenCalledWith('branches');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_public_branch', { p_slug: 'central' });
  });

  it('should fall back to get_public_branch_by_id RPC when branches table returns null for getById', async () => {
    const publicBranch = {
      id: 'branch-2',
      name: 'Sucursal 2',
      is_active: true
    };

    mockSupabase.from.mockImplementation((tableName: string) => {
      if (tableName === 'branches') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null })
            })
          })
        };
      }
      return {};
    });

    mockSupabase.rpc.mockImplementation((fnName: string) => {
      if (fnName === 'get_public_branch_by_id') {
        return {
          maybeSingle: jest.fn().mockResolvedValue({ data: publicBranch, error: null })
        };
      }
      return { maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }) };
    });

    const result = await firstValueFrom(repository.getById('branch-2'));
    expect(result).toEqual(publicBranch);
    expect(mockSupabase.from).toHaveBeenCalledWith('branches');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_public_branch_by_id', { p_id: 'branch-2' });
  });
});
