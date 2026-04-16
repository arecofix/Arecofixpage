import { TestBed } from '@angular/core/testing';
import { SupabaseAnalyticsRepository } from './supabase-analytics.repository';
import { TenantService } from '../../../../core/services/tenant.service';
import { SUPABASE_CLIENT } from '../../../../core/di/supabase-token';
import { firstValueFrom } from 'rxjs';

describe('SupabaseAnalyticsRepository (Financial Engine)', () => {
  let repository: SupabaseAnalyticsRepository;
  let mockSupabase: any;
  let mockTenantService: any;

  beforeEach(() => {
    mockSupabase = {
      rpc: jasmine.createSpy('rpc')
    };

    mockTenantService = {
      getTenantId: jasmine.createSpy('getTenantId').and.returnValue('mock-tenant-id')
    };

    TestBed.configureTestingModule({
      providers: [
        SupabaseAnalyticsRepository,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: TenantService, useValue: mockTenantService }
      ]
    });

    repository = TestBed.inject(SupabaseAnalyticsRepository);
    
    // Simulate current month to avoid "mes actual" mismatch in tests
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-04-10T12:00:00Z'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should format labels, map RPC data and calculate correct totals instead of defaulting to 100% margin', async () => {
    // Arrange: Mock financial DB response representing the bug scenario but fixed
    const mockFinanceData = [
      {
        period: '2026-04',
        gross_revenue: 34900,
        total_cost: 15000,
        net_profit: 19900,
        repair_revenue: 34900,
        sales_revenue: 0,
        repair_cost: 15000,
        sales_cost: 0
      }
    ];

    const mockLegacyData = {
      users: 5,
      products: 10
    };

    mockSupabase.rpc.and.callFake((fnName: string) => {
      if (fnName === 'get_financial_analytics_v2') return Promise.resolve({ data: mockFinanceData, error: null });
      if (fnName === 'get_dashboard_stats_v2') return Promise.resolve({ data: mockLegacyData, error: null });
    });

    // Act
    const stats = await firstValueFrom(repository.getDashboardStats());

    // Assert Data Mapping
    expect(stats.total_gross_revenue).withContext('Debe sumar ingresos brutos').toBe(34900);
    expect(stats.total_cost).withContext('Debe deducir costos de insumos correctamente').toBe(15000);
    expect(stats.total_net_profit).withContext('Debe devolver la ganancia neta real, no 100%').toBe(19900); 
    
    // Assert Current Month Extractions
    expect(stats.current_month_gross).toBe(34900);
    expect(stats.current_month_cost).toBe(15000);
    expect(stats.current_month_profit).toBe(19900);

    // Assert Formatter
    expect(stats.monthly_breakdown.length).toBe(1);
    expect(stats.monthly_breakdown[0].label).toBe('Abr 2026');
  });

  it('should handle missing DB rows safely with $0 fallback margins', async () => {
    // Arrange: No finance data provided
    mockSupabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null }));

    // Act
    const stats = await firstValueFrom(repository.getDashboardStats());

    // Assert Error Tolerance
    expect(stats.total_gross_revenue).toBe(0);
    expect(stats.total_cost).toBe(0);
    expect(stats.total_net_profit).toBe(0);
    expect(stats.monthly_breakdown.length).toBe(0);
  });
});
