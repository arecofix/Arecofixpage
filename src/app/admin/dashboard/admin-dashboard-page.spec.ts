import { AdminDashboardPage, DEFAULT_DASHBOARD_METRICS } from './admin-dashboard-page';

describe('AdminDashboardPage Data Mapping & Resilience Unit Tests', () => {
  let component: AdminDashboardPage;

  beforeEach(() => {
    // Instantiate component prototype methods for testing sanitizeData and prepareBusinessCharts
    component = Object.create(AdminDashboardPage.prototype);
  });

  describe('sanitizeData', () => {
    it('should correctly map canonical backend data', () => {
      const canonicalData = {
        period: {
          range: 'month' as const,
          start_date: '2026-10-01T00:00:00Z',
          end_date: '2026-10-31T23:59:59Z'
        },
        kpis: {
          total_income: 144500,
          total_expense: 15000,
          net_balance: 129500,
          ecommerce_orders_count: 8,
          ecommerce_amount: 240871,
          active_repairs_count: 17,
          delayed_repairs_count: 13,
          has_delayed_alert: true,
          active_subscriptions_count: 7,
          academy_revenue: 60000,
          critical_stock_count: 2589
        },
        alerts: {
          critical_stock_items: [
            {
              id: 'p-1',
              name: 'Abridor KAISI',
              sku: 'AF-KAISI',
              stock: 0,
              min_stock_alert: 5,
              price: 28600
            }
          ],
          overdue_pickup_repairs: [
            {
              id: 'r-1',
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
            { period: '2026-10', label: 'Oct', income: 144500, expense: 15000, net_balance: 129500 }
          ],
          revenue_by_origin: {
            ecommerce: 240871,
            repairs: 169400,
            academy: 60000
          }
        }
      };

      const result = (component as any).sanitizeData(canonicalData, 'month');

      expect(result.kpis.net_balance).toBe(129500);
      expect(result.kpis.total_income).toBe(144500);
      expect(result.kpis.ecommerce_orders_count).toBe(8);
      expect(result.kpis.ecommerce_amount).toBe(240871);
      expect(result.kpis.active_repairs_count).toBe(17);
      expect(result.kpis.has_delayed_alert).toBe(true);
      expect(result.kpis.active_subscriptions_count).toBe(7);
      expect(result.alerts.critical_stock_items.length).toBe(1);
      expect(result.alerts.overdue_pickup_repairs.length).toBe(1);
      expect(result.charts.trend_6_months.length).toBe(1);
      expect(result.charts.revenue_by_origin.repairs).toBe(169400);
    });

    it('should seamlessly handle legacy/alternative field aliases (metrics, net_cashflow, ecommerce_paid_count, trend)', () => {
      const aliasData = {
        metrics: {
          total_income: 997244,
          total_expense: 0,
          net_cashflow: 997244,
          ecommerce_paid_count: 8,
          ecommerce_paid_revenue: 240871,
          active_repairs_count: 17,
          delayed_repairs_count: 13,
          active_subscriptions_count: 7,
          academy_revenue: 0
        },
        alerts: {
          critical_stock_count: 2589,
          critical_stock_items: [],
          overdue_pickup_repairs: [
            {
              id: 'rep-legacy-1',
              repair_number: 'AF-999',
              customer_name: 'Juan Perez',
              completed_at: '2026-10-01T00:00:00Z',
              days_waiting: 15,
              final_cost: 15000
            }
          ],
          expiring_grace_subscriptions: [
            {
              id: 'sub-legacy-1',
              student_email: 'alumno@test.com',
              first_name: 'Martin',
              last_name: 'Fierro',
              grace_period_until: '2026-10-20T00:00:00Z',
              days_left: 2
            }
          ]
        },
        trend: [
          { month: '2026-10', income: 997244, expense: 0 }
        ],
        revenue_by_origin: {
          ecommerce: 240871,
          repairs: 1686445,
          academy: 0
        }
      };

      const result = (component as any).sanitizeData(aliasData, 'year');

      expect(result.kpis.net_balance).toBe(997244);
      expect(result.kpis.ecommerce_orders_count).toBe(8);
      expect(result.kpis.ecommerce_amount).toBe(240871);
      expect(result.kpis.active_repairs_count).toBe(17);
      expect(result.alerts.overdue_pickup_repairs[0].tracking_code).toBe('AF-999');
      expect(result.alerts.overdue_pickup_repairs[0].client_name).toBe('Juan Perez');
      expect(result.alerts.overdue_pickup_repairs[0].hours_waiting).toBe(360); // 15 days * 24
      expect(result.alerts.expiring_grace_subscriptions[0].user_email).toBe('alumno@test.com');
      expect(result.alerts.expiring_grace_subscriptions[0].student_name).toBe('Martin Fierro');
      expect(result.charts.trend_6_months[0].period).toBe('2026-10');
      expect(result.charts.revenue_by_origin.repairs).toBe(1686445);
    });

    it('should return safe zero defaults when receiving null, undefined or empty object', () => {
      const emptyNull = (component as any).sanitizeData(null, 'today');
      expect(emptyNull.kpis.net_balance).toBe(0);
      expect(emptyNull.kpis.total_income).toBe(0);
      expect(emptyNull.alerts.critical_stock_items).toEqual([]);
      expect(emptyNull.charts.trend_6_months).toEqual([]);

      const emptyObj = (component as any).sanitizeData({}, 'month');
      expect(emptyObj.kpis.net_balance).toBe(0);
      expect(emptyObj.kpis.active_repairs_count).toBe(0);
      expect(emptyObj.alerts.overdue_pickup_repairs).toEqual([]);
    });
  });

  describe('prepareBusinessCharts', () => {
    it('should configure trend and revenue origin chart datasets properly when data exists', () => {
      const mockData = {
        ...DEFAULT_DASHBOARD_METRICS,
        charts: {
          trend_6_months: [
            { period: '2026-09', label: 'Sep', income: 100000, expense: 20000, net_balance: 80000 },
            { period: '2026-10', label: 'Oct', income: 150000, expense: 30000, net_balance: 120000 }
          ],
          revenue_by_origin: {
            ecommerce: 50000,
            repairs: 70000,
            academy: 30000
          }
        }
      };

      (component as any).prepareBusinessCharts(mockData);

      expect(component.trendChartData).toBeDefined();
      expect(component.trendChartData?.labels).toEqual(['Sep', 'Oct']);
      expect(component.trendChartData?.datasets[0].data).toEqual([100000, 150000]);
      expect(component.trendChartData?.datasets[1].data).toEqual([20000, 30000]);

      expect(component.revenueOriginChartData).toBeDefined();
      expect(component.revenueOriginChartData?.labels).toEqual(['E-commerce', 'Reparaciones', 'Academia']);
      expect(component.revenueOriginChartData?.datasets[0].data).toEqual([50000, 70000, 30000]);
    });

    it('should set charts to undefined when no trend data exists to show empty state', () => {
      const emptyData = {
        ...DEFAULT_DASHBOARD_METRICS,
        charts: {
          trend_6_months: [],
          revenue_by_origin: { ecommerce: 0, repairs: 0, academy: 0 }
        }
      };

      (component as any).prepareBusinessCharts(emptyData);

      expect(component.trendChartData).toBeUndefined();
    });
  });

  describe('View Tabs Navigation', () => {
    it('should switch between dashboard tabs correctly', () => {
      // Mock signal for testing
      let currentTab = 'general';
      (component as any).activeViewTab = {
        set: (tab: string) => { currentTab = tab; },
        $val: () => currentTab
      };
      (component as any).analyticsData = () => ({ top_products: [] });
      (component as any).dbHealthData = () => ({ status: 'healthy' });
      (component as any).loadAnalytics = jest.fn();
      (component as any).loadDatabaseHealth = jest.fn();

      component.setActiveViewTab('products');
      expect(currentTab).toBe('products');

      component.setActiveViewTab('customers');
      expect(currentTab).toBe('customers');

      component.setActiveViewTab('repairs');
      expect(currentTab).toBe('repairs');

      component.setActiveViewTab('health');
      expect(currentTab).toBe('health');

      component.setActiveViewTab('general');
      expect(currentTab).toBe('general');
    });
  });
});

