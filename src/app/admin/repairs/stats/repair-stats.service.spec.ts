import { TestBed } from '@angular/core/testing';
import { RepairStatsService, RepairStatsDto } from './repair-stats.service';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';

describe('RepairStatsService', () => {
  let service: RepairStatsService;
  let mockAuthService: any;
  let mockTenantService: any;
  let mockSupabase: any;

  // Mock historical repairs:
  // - 1 repair completed in Oct 2026 ($238,400, delivered [status 6], with glass_upsell)
  // - 1 repair completed in Sep 2026 ($54,800, ready [status 5])
  // - 1 repair completed in Aug 2026 ($199,200, delivered [status 6])
  // - 1 repair completed in Jul 2026 ($69,800, delivered [status 6])
  // - 0 repairs completed in Nov 2026 (current month)
  const mockRepairs = [
    {
      id: 'rep-jul',
      final_cost: 69800,
      current_status_id: 6,
      created_at: '2026-07-05T10:00:00Z',
      completed_at: '2026-07-06T15:00:00Z',
      glass_upsell: false,
      repair_parts_used: [],
      spare_part_cost: 0
    },
    {
      id: 'rep-aug',
      final_cost: 199200,
      current_status_id: 6,
      created_at: '2026-08-10T10:00:00Z',
      completed_at: '2026-08-12T15:00:00Z',
      glass_upsell: true,
      repair_parts_used: [
        { quantity: 1, cost_at_time: 66699, unit_price_at_time: 75000, created_at: '2026-08-10T10:00:00Z' }
      ],
      spare_part_cost: 66699
    },
    {
      id: 'rep-sep',
      final_cost: 54800,
      current_status_id: 5,
      created_at: '2026-09-02T10:00:00Z',
      completed_at: '2026-09-05T15:00:00Z',
      glass_upsell: false,
      repair_parts_used: [],
      spare_part_cost: 25900
    },
    {
      id: 'rep-oct',
      final_cost: 238400,
      current_status_id: 6,
      created_at: '2026-10-15T10:00:00Z',
      completed_at: '2026-10-18T15:00:00Z',
      glass_upsell: true,
      repair_parts_used: [],
      spare_part_cost: 112300
    }
  ];

  const mockOrders = [
    { total_amount: 15000, created_at: '2026-08-20T12:00:00Z' },
    { total_amount: 25000, created_at: '2026-10-25T12:00:00Z' }
  ];

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn((table: string) => {
        if (table === 'repairs') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation((col: string, val: any) => {
              return Promise.resolve({ data: mockRepairs, error: null });
            })
          };
        }
        if (table === 'orders') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            in: jest.fn().mockImplementation((col: string, val: any) => {
              return Promise.resolve({ data: mockOrders, error: null });
            })
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: [], error: null })
        };
      })
    };

    mockAuthService = {
      getSupabaseClient: jest.fn().mockReturnValue(mockSupabase)
    };

    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue('tenant-test-id')
    };

    TestBed.configureTestingModule({
      providers: [
        RepairStatsService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: TenantService, useValue: mockTenantService }
      ]
    });

    service = TestBed.inject(RepairStatsService);
  });

  it('should calculate global consolidated revenue correctly even when "this_month" has 0 repairs', (done) => {
    service.getStats('this_month').subscribe((stats: RepairStatsDto) => {
      // Historical taller sum: 69800 + 199200 + 54800 + 238400 = 562,200
      // Historical orders sum: 15000 + 25000 = 40,000
      // Expected venta_total_global: 562200 + 40000 = 602,200
      expect(stats.venta_total_global).toBe(602200);

      // Period (this_month = Nov 2026): 0 repairs, 0 orders
      expect(stats.total_facturado).toBe(0);
      expect(stats.venta_total_periodo).toBe(0);
      expect(stats.equipos_entregados).toBe(0);
      expect(stats.reparaciones_vidrio).toBe(0);

      // Global equipment and glass metrics must reflect historical counts
      // 3 delivered repairs in history (jul: 6, aug: 6, oct: 6)
      expect(stats.equipos_entregados_global).toBe(3);
      // 2 glass upsells in history (aug, oct)
      expect(stats.reparaciones_vidrio_global).toBe(2);
      expect(stats.ingreso_extra_vidrio_global).toBe(2 * 2500);

      // Monthly data must contain historical 6-month bars
      expect(stats.monthly_data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should calculate period metrics properly when "all_time" is selected', (done) => {
    service.getStats('all_time').subscribe((stats: RepairStatsDto) => {
      expect(stats.total_facturado).toBe(562200);
      expect(stats.equipos_entregados).toBe(3);
      expect(stats.reparaciones_vidrio).toBe(2);
      expect(stats.venta_total_global).toBe(602200);
      expect(stats.venta_total_periodo).toBe(602200);
      done();
    });
  });
});

