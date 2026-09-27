describe('Admin Statistics computational and rendering audit', () => {
  beforeEach(() => {
    // We start each test with an empty catch-all to prevent 401 leaks from the fake session
    cy.loginAsAdmin();
  });

  it('1. should render Global Dashboard stats correctly using mocked RPC data', () => {
    // 1. Setup RPC Mocks for Dashboard
    cy.intercept('POST', '**/rest/v1/rpc/get_dashboard_stats_v2*', {
      statusCode: 200,
      body: {
        users: 15,
        products: 120,
        sales: 45,
        devices_fixed: 89,
        products_chart: [
          { name: 'Módulo iPhone 11', quantity: 12 },
          { name: 'Batería Samsung S20', quantity: 8 }
        ],
        category_chart: [
          { name: 'Reparaciones', count: 45 },
          { name: 'Accesorios', count: 30 }
        ]
      }
    }).as('getLegacyStats');

    cy.intercept('POST', '**/rest/v1/rpc/get_financial_analytics_v3*', {
      statusCode: 200,
      body: {
        total_gross_revenue: 1500000,
        total_cost: 400000,
        current_month_gross: 250000,
        current_month_cost: 60000,
        monthly_breakdown: [
          { period: '2025-01', gross_revenue: 0, cost: 0, repairs_revenue: 0, sales_revenue: 570000, repairs_cost: 0, sales_cost: 0 },
          { period: '2025-02', gross_revenue: 0, cost: 0, repairs_revenue: 0, sales_revenue: 600000, repairs_cost: 0, sales_cost: 0 }
        ]
      }
    }).as('getFinanceStats');

    // Add mocks for the new local calculations
    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 200,
      body: [
        {
          id: 'r1', current_status_id: 6, final_cost: 150000, created_at: '2025-01-10T00:00:00Z', completed_at: '2025-01-10T00:00:00Z', 
          repair_parts_used: [{ quantity: 1, cost_at_time: 20000 }]
        },
        {
          id: 'r2', current_status_id: 6, final_cost: 180000, created_at: '2025-02-10T00:00:00Z', completed_at: '2025-02-10T00:00:00Z', 
          repair_parts_used: [{ quantity: 1, cost_at_time: 25000 }]
        }
      ]
    }).as('getRepairs');

    cy.intercept('GET', '**/rest/v1/cash_movements*', { statusCode: 200, body: [] }).as('getExpenses');
    cy.intercept('GET', '**/rest/v1/orders*', { statusCode: 200, body: [] }).as('getOrders');
    cy.intercept('GET', '**/rest/v1/order_items*', { statusCode: 200, body: [] }).as('getOrderItems');

    // 2. Visit Dashboard
    cy.visit('/admin/dashboard');

    // 3. Wait for data to load
    cy.wait('@getLegacyStats');
    cy.wait('@getFinanceStats');
    cy.wait('@getRepairs');

    // 4. Assert KPI Cards render exact numbers from mock (Formatted)
    // - Ingresos Tienda (revenue = 1.500.000)
    // - Ventas Taller (repairs_revenue = 150000 + 180000 = 330000)
    // - Ganancia Estimada (repairs_profit = (150k-20k) + (180k-25k) = 285000)
    // - Equipos Fix (89)
    cy.contains('1.500.000').should('exist'); 
    cy.contains('330.000').should('exist'); 
    cy.contains('285.000').should('exist'); 
    cy.contains('89').should('exist'); 
    
    // 5. Assert Charts section renders correctly
    cy.contains('Ventas por Categoría').should('exist');
    cy.contains('Resumen Financiero').should('exist');
  });

  it('2. should accurately compute Tech Service statistics in Angular from raw repairs/orders data', () => {
    // 1. Mock raw repairs table data
    // Supabase query filters by eq('tenant_id', ...) 
    cy.intercept('GET', '**/rest/v1/repairs*', {
      statusCode: 200,
      body: [
        {
          id: 'repair-1',
          final_cost: 10000,
          spare_part_cost: 2000,
          current_status_id: 5, // Lista (Counts as revenue)
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          glass_upsell: false,
          tenant_id: 'tenant-1'
        },
        {
          id: 'repair-2',
          final_cost: 20000,
          spare_part_cost: 5000,
          current_status_id: 6, // Entregada (Counts as revenue)
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          glass_upsell: true,
          tenant_id: 'tenant-1'
        },
        {
          id: 'repair-3',
          final_cost: 50000,
          spare_part_cost: 15000,
          current_status_id: 1, // Recibida/Pendiente (Does NOT count as revenue)
          created_at: new Date().toISOString(),
          completed_at: null,
          glass_upsell: false,
          tenant_id: 'tenant-1'
        }
      ]
    }).as('getRepairs');

    // 2. Mock raw orders table data (for global comparison)
    cy.intercept('GET', '**/rest/v1/orders*', {
      statusCode: 200,
      body: [
        {
          id: 'order-1',
          total_amount: 15000,
          status: 'completed',
          created_at: new Date().toISOString(),
          tenant_id: 'tenant-1'
        }
      ]
    }).as('getOrders');

    // 3. Visit Repairs Stats page
    cy.visit('/admin/repairs/stats');

    // 4. Wait for Angular to fetch raw data and perform local computational logic
    cy.wait('@getRepairs');
    cy.wait('@getOrders');

    // 5. Assert Mathematical Computations on the UI
    // Revenue should be only repair 1 + repair 2 = 30000
    cy.contains('$30k').should('exist'); 
    
    // Costo Insumos should be repair 1 + repair 2 = 7000
    cy.contains('$7k').should('exist'); 

    // Ganancia Real should be 30000 - 7000 = 23000
    cy.contains('$23k').should('exist');

    // Ticket Promedio = 30000 / 2 = 15000
    cy.contains('$15k').should('exist');

    // Ingresos Consolidados (Global) = Taller (30000) + Tienda Online (15000) = 45000
    cy.contains('$45k').should('exist');

    // Equipos Entregados = 1 (status 6)
    cy.contains('Equipos Entregados').parent().contains('1').should('exist');

    // Reparaciones con Vidrio = 1 (repair 2)
    cy.contains('Reparaciones con Vidrio').parent().contains('1').should('exist');
  });
});
