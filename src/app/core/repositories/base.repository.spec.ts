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

  describe('update() - Safe Partial Updates', () => {
    it('should send only provided fields to Supabase update, omitting undefined', (done) => {
      const updatedRecord = { id: 'uuid-1', name: 'Updated Entity' };
      const mockQueryBuilder: any = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue(Promise.resolve({ data: updatedRecord, error: null }))
      };
      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      repository.update('uuid-1', {
        name: 'Updated Entity',
        tenant_id: 'injected-tenant-id' as any
      }).subscribe({
        next: (result) => {
          expect(result).toEqual(updatedRecord);
          expect(mockQueryBuilder.update).toHaveBeenCalledWith({ name: 'Updated Entity' });
          expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', 'uuid-1');
          done();
        },
        error: (err) => done.fail(err)
      });
    });

    it('should NOT perform a DB update if the payload is empty, and instead fetch via getById', (done) => {
      const existingRecord = { id: 'uuid-1', name: 'Existing Entity' };
      const mockQueryBuilder: any = {
        update: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue(Promise.resolve({ data: existingRecord, error: null })),
        maybeSingle: jest.fn().mockReturnValue(Promise.resolve({ data: existingRecord, error: null }))
      };
      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      repository.update('uuid-1', {}).subscribe({
        next: (result) => {
          expect(result).toEqual(existingRecord);
          // Crucial check: .update() must NEVER have been called on empty payload
          expect(mockQueryBuilder.update).not.toHaveBeenCalled();
          done();
        },
        error: (err) => done.fail(err)
      });
    });

    it('should preserve explicit null when field is intentionally set to null', (done) => {
      const updatedRecord = { id: 'uuid-1', name: null };
      const mockQueryBuilder: any = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue(Promise.resolve({ data: updatedRecord, error: null }))
      };
      mockSupabase.from.mockReturnValue(mockQueryBuilder);

      repository.update('uuid-1', {
        name: null as unknown as string
      }).subscribe({
        next: (result) => {
          expect(mockQueryBuilder.update).toHaveBeenCalledWith({ name: null });
          done();
        },
        error: (err) => done.fail(err)
      });
    });
  });
});
