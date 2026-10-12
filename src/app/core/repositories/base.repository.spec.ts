import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { BaseRepository } from './base.repository';
import { LoggerService } from '../services/logger.service';
import { TenantService } from '../services/tenant.service';
import { SupabaseErrorHandlerService } from '../services/supabase-error-handler.service';

interface TestItem {
  id: string;
  tenant_id?: string;
  name: string;
}

class TestRepository extends BaseRepository<TestItem> {
  protected override tableName = 'test_entities';
  protected override isGlobalTable = true;
  protected override useSoftDeletes = false;
  protected override useStrictBranchIsolation = false;
}

describe('BaseRepository', () => {
  let repository: TestRepository;
  let mockSupabase: any;
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    mockSupabase = {
      from: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: LoggerService, useValue: mockLogger },
        { provide: TenantService, useValue: { getTenantId: () => 'tenant-1' } },
        { provide: SupabaseErrorHandlerService, useValue: { handleError: jest.fn() } }
      ]
    });

    const injector = TestBed.inject(EnvironmentInjector);
    runInInjectionContext(injector, () => {
      repository = new TestRepository(mockSupabase, mockLogger);
    });
  });

  it('create() should insert entity and return it without calling console.error', (done) => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    const createdRecord = { id: 'uuid-1', name: 'Test Entity' };
    const mockQueryBuilder: any = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnValue(Promise.resolve({ data: createdRecord, error: null }))
    };

    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    repository.create({ name: 'Test Entity' }).subscribe({
      next: (result) => {
        expect(result).toEqual(createdRecord);
        expect(mockSupabase.from).toHaveBeenCalledWith('test_entities');
        expect(mockQueryBuilder.insert).toHaveBeenCalled();
        // Crucial regression check: verify [CYPRESS DEBUG] console.error was not called
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
        done();
      },
      error: (err) => {
        consoleErrorSpy.mockRestore();
        done.fail(err);
      }
    });
  });
});
