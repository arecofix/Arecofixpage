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
          { period: '2025-01', gross_revenue: 200000, cost: 50000, repairs_revenue: 150000, sales_revenue: 50000, repairs_cost: 20000, sales_cost: 30000 },
          { period: '2025-02', gross_revenue: 250000, cost: 60000, repairs_revenue: 180000, sales_revenue: 70000, repairs_cost: 25000, sales_cost: 35000 }
        ]
      }
    }).as('getFinanceStats');

    // 2. Visit Dashboard
    cy.visit('/admin/dashboard');

    // 3. Wait for data to load
    cy.wait('@getLegacyStats');
    cy.wait('@getFinanceStats');

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
          costo_repuesto: 2000,
          current_status_id: 5, // Lista (Counts as revenue)
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          upsell_vidrio: false,
          tenant_id: 'tenant-1'
        },
        {
          id: 'repair-2',
          final_cost: 20000,
          costo_repuesto: 5000,
          current_status_id: 6, // Entregada (Counts as revenue)
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          upsell_vidrio: true,
          tenant_id: 'tenant-1'
        },
        {
          id: 'repair-3',
          final_cost: 50000,
          costo_repuesto: 15000,
          current_status_id: 1, // Recibida/Pendiente (Does NOT count as revenue)
          created_at: new Date().toISOString(),
          completed_at: null,
          upsell_vidrio: false,
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
    cy.contains('30.000').should('exist'); 
    
    // Costo Insumos should be repair 1 + repair 2 = 7000
    cy.contains('7.000').should('exist'); 

    // Ganancia Real should be 30000 - 7000 = 23000
    cy.contains('23.000').should('exist');

    // Ticket Promedio = 30000 / 2 = 15000
    cy.contains('15.000').should('exist');

    // Ingresos Consolidados (Global) = Taller (30000) + Tienda Online (15000) = 45000
    cy.contains('45.000').should('exist');

    // Equipos Entregados = 1 (status 6)
    cy.contains('Equipos Entregados').parent().contains('1').should('exist');

    // Reparaciones con Vidrio = 1 (repair 2)
    cy.contains('Reparaciones con Vidrio').parent().contains('1').should('exist');
  });
});
