import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminBusinessDashboardService, BusinessDashboardData } from './admin-business-dashboard.service';
import { AuthService } from '@app/core/services/auth.service';

describe('AdminBusinessDashboardService', () => {
  let service: AdminBusinessDashboardService;
  let httpMock: HttpTestingController;
  let mockAuthService: any;

  const mockSession = {
    access_token: 'mock-jwt-token-xyz',
    user: { id: 'admin-user-id' }
  };

  const mockDashboardData: BusinessDashboardData = {
    period: {
      range: 'month',
      start_date: '2026-10-01T00:00:00Z',
      end_date: '2026-10-31T23:59:59Z'
    },
    kpis: {
      total_income: 144500,
      total_expense: 0,
      net_balance: 144500,
      ecommerce_orders_count: 8,
      ecommerce_amount: 240871,
      active_repairs_count: 17,
      delayed_repairs_count: 13,
      has_delayed_alert: true,
      active_subscriptions_count: 7,
      academy_revenue: 0,
      critical_stock_count: 2589
    },
    alerts: {
      critical_stock_items: [
        {
          id: 'prod-1',
          name: 'Abridor de celulares IFIX 360',
          sku: 'AF-HER-ABRIDOR-DE',
          stock: 0,
          min_stock_alert: 5,
          price: 208000
        }
      ],
      overdue_pickup_repairs: [
        {
          id: 'rep-1',
          tracking_code: 'AF-171',
          client_name: 'Daniel pereira',
          ready_since: '2026-10-04T01:10:01Z',
          hours_waiting: 354,
          final_cost: 30000
        }
      ],
      expiring_grace_subscriptions: []
    },
    charts: {
      trend_6_months: [
        { period: '2026-05', label: 'May', income: 1081, expense: 0, net_balance: 1081 },
        { period: '2026-10', label: 'Oct', income: 144500, expense: 0, net_balance: 144500 }
      ],
      revenue_by_origin: {
        ecommerce: 240871,
        repairs: 169400,
        academy: 0
      }
    }
  };

  beforeEach(() => {
    mockAuthService = {
      getSession: jest.fn().mockResolvedValue(mockSession)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminBusinessDashboardService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(AdminBusinessDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch business dashboard metrics successfully for default range', (done) => {
    service.getMetrics('month').subscribe((res) => {
      expect(res.success).toBe(true);
      expect(res.data?.kpis.net_balance).toBe(144500);
      expect(res.data?.kpis.active_repairs_count).toBe(17);
      expect(res.data?.kpis.active_subscriptions_count).toBe(7);
      expect(res.data?.alerts.critical_stock_items.length).toBe(1);
      done();
    });

    // Wait for promise headers resolution
    setTimeout(() => {
      const req = httpMock.expectOne((r) => r.url.includes('/api/admin/dashboard/metrics?range=month'));
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-jwt-token-xyz');
      req.flush({ success: true, data: mockDashboardData });
    }, 10);
  });

  it('should pass branch_id when specified', (done) => {
    service.getMetrics('year', 'branch-areco-01').subscribe((res) => {
      expect(res.success).toBe(true);
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne((r) =>
        r.url.includes('/api/admin/dashboard/metrics?range=year&branch_id=branch-areco-01')
      );
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockDashboardData });
    }, 10);
  });

  it('should gracefully handle HTTP errors by returning fallback contingency data and error message', (done) => {
    service.getMetrics('month').subscribe((res) => {
      expect(res.success).toBe(false);
      expect(res.error).toBe('Server error');
      expect(res.data?.kpis.net_balance).toBe(0);
      expect(res.partialErrors?.['system']).toBeTruthy();
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne((r) => r.url.includes('/api/admin/dashboard/metrics'));
      req.flush({ error: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    }, 10);
  });

  it('should generate empty default metrics structure correctly', () => {
    const empty = service.getDefaultEmptyMetrics('7days');
    expect(empty.period.range).toBe('7days');
    expect(empty.kpis.net_balance).toBe(0);
    expect(empty.alerts.critical_stock_items).toEqual([]);
    expect(empty.charts.trend_6_months).toEqual([]);
  });

  it('should fetch business analytics (top products, RFM, repairs) successfully', (done) => {
    const mockAnalytics = {
      top_products: [
        { product_name: 'Apple iPhone 16 128gb', sku: 'AF-IPH-16', units_sold: 1, revenue: 921, current_stock: 2, category_name: 'Smartphones' }
      ],
      customer_analytics: {
        total_customers: 5,
        repeat_customers: 3,
        repeat_purchase_rate: 60.0,
        top_customers: [
          { customer_name: 'Consumidor Final', customer_email: 'Sin Email', frequency: 2, monetary: 120921, last_order_date: '2026-07-10', segment: 'Campeón (LTV Alto)' }
        ]
      },
      repair_analytics: {
        by_brand: [{ brand_name: 'Samsung', repair_count: 8, percentage: 19.5 }],
        by_model: [{ model_name: 'a 02s', brand_name: 'Samsung', repair_count: 2 }],
        common_issues: [{ issue: 'Modulo', count: 6 }]
      }
    };

    service.getAnalytics('month').subscribe((res) => {
      expect(res.success).toBe(true);
      expect(res.data?.top_products.length).toBe(1);
      expect(res.data?.customer_analytics.repeat_purchase_rate).toBe(60.0);
      expect(res.data?.repair_analytics.by_brand[0].brand_name).toBe('Samsung');
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne((r) => r.url.includes('/api/admin/dashboard/analytics?range=month'));
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockAnalytics });
    }, 10);
  });

  it('should fetch database health metrics successfully', (done) => {
    const mockHealth = {
      status: 'healthy',
      connections: { active: 21, max: 100, percentage: 21.0, active_queries: 0, idle_in_transaction: 0 },
      performance: { cache_hit_ratio: 99.99, total_locks: 17, blocked_locks: 0, long_running_queries: 0 },
      table_stats: [
        { table_name: 'products', row_count: 2775, dead_tuples: 251, last_autovacuum: '2026-09-17', idx_scan_pct: 97.0, total_size: '6104 kB' }
      ],
      data_freshness: {
        last_order: '2026-10-16 10:16:01',
        last_repair: '2026-10-18 01:26:50',
        last_cash_movement: '2026-10-16 19:21:01',
        last_enrollment: '2026-09-24 09:51:25',
        last_product: '2026-10-13 20:25:03'
      },
      links: {
        studio_url: 'https://studio.arecofix.com.ar',
        db_host: 'db.arecofix.com.ar',
        posthog_url: 'https://us.posthog.com'
      },
      timestamp: '2026-10-18 16:09:51'
    };

    service.getDatabaseHealth().subscribe((res) => {
      expect(res.success).toBe(true);
      expect(res.data?.status).toBe('healthy');
      expect(res.data?.connections.active).toBe(21);
      expect(res.data?.performance.cache_hit_ratio).toBe(99.99);
      expect(res.data?.links.studio_url).toBe('https://studio.arecofix.com.ar');
      done();
    });

    setTimeout(() => {
      const req = httpMock.expectOne('/api/admin/dashboard/db-health');
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockHealth });
    }, 10);
  });
});
