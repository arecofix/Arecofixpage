import { TestBed } from '@angular/core/testing';
import { BranchRepository } from './branch.repository';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { LoggerService } from '../services/logger.service';
import { SupabaseStorageService } from '../services/supabase-storage.service';
import { firstValueFrom, of } from 'rxjs';

describe('BranchRepository - Public Fallback Security', () => {
  let repository: BranchRepository;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn()
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

  it('should fall back to public_branch_profile when branches table returns empty for getWhere', async () => {
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
      if (tableName === 'public_branch_profile') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [publicBranch], error: null })
          })
        };
      }
      return {};
    });

    const result = await firstValueFrom(repository.getWhere('slug', 'central'));
    expect(result).toEqual([publicBranch]);
    expect(mockSupabase.from).toHaveBeenCalledWith('branches');
    expect(mockSupabase.from).toHaveBeenCalledWith('public_branch_profile');
  });

  it('should fall back to public_branch_profile when branches table returns null for getById', async () => {
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
      if (tableName === 'public_branch_profile') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({ data: publicBranch, error: null })
            })
          })
        };
      }
      return {};
    });

    const result = await firstValueFrom(repository.getById('branch-2'));
    expect(result).toEqual(publicBranch);
    expect(mockSupabase.from).toHaveBeenCalledWith('branches');
    expect(mockSupabase.from).toHaveBeenCalledWith('public_branch_profile');
  });
});
