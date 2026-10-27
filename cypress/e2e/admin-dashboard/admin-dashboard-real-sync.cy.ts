describe('Admin Business Dashboard E2E: Sincronización con Datos Reales y Auditoría Forense', () => {
  // Datos reales sincronizados de la base de datos de producción (auditoría forense)
  const realMonthPayload = {
    period: {
      range: 'month',
      start_date: '2026-10-01T00:00:00.000Z',
      end_date: '2026-10-18T23:59:59.000Z'
    },
    kpis: {
      total_income: 144500,
      total_expense: 0,
      net_balance: 144500,
      ecommerce_orders_count: 0,
      ecommerce_amount: 0,
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
          id: 'd61382a0-96cd-46e0-97e8-d109e914a844',
          name: 'Abridor de celulares IFIX 360',
          sku: 'AF-HER-ABRIDOR-DE',
          stock: 0,
          min_stock_alert: 5,
          price: 208000
        },
        {
          id: '55bfcdbc-b971-4248-ac85-ddd50c9c2eef',
          name: 'Abridor de celulares KAISI 1200',
          sku: 'AF-HER-ABRIDOR-DE',
          stock: 0,
          min_stock_alert: 5,
          price: 28600
        }
      ],
      overdue_pickup_repairs: [
        {
          id: 'f2eaa368-e535-453b-8f35-9e5daae14701',
          tracking_code: 'LA6KXN8R-MMDR0XCH',
          client_name: 'Cliente',
          ready_since: '2026-03-05T17:37:54.721Z',
          hours_waiting: 5449,
          final_cost: 49800
        },
        {
          id: '2eff9ae8-dd0e-4eda-8d34-fd7e489ad1b8',
          tracking_code: 'AF-171',
          client_name: 'Daniel pereira',
          ready_since: '2026-10-04T01:10:01.580Z',
          hours_waiting: 354,
          final_cost: 30000
        }
      ],
      expiring_grace_subscriptions: []
    },
    charts: {
      trend_6_months: [
        { period: '2026-05', label: 'May', income: 1081, expense: 0, net_balance: 1081 },
        { period: '2026-06', label: 'Jun', income: 99668, expense: 0, net_balance: 99668 },
        { period: '2026-07', label: 'Jul', income: 280521, expense: 0, net_balance: 280521 },
        { period: '2026-08', label: 'Ago', income: 329000, expense: 0, net_balance: 329000 },
        { period: '2026-09', label: 'Sep', income: 104600, expense: 0, net_balance: 104600 },
        { period: '2026-10', label: 'Oct', income: 144500, expense: 0, net_balance: 144500 }
      ],
      revenue_by_origin: {
        ecommerce: 0,
        repairs: 169400,
        academy: 0
      }
    }
  };

  const realYearPayload = {
    ...realMonthPayload,
    period: {
      range: 'year',
      start_date: '2026-01-01T00:00:00.000Z',
      end_date: '2026-10-18T23:59:59.000Z'
    },
    kpis: {
      ...realMonthPayload.kpis,
      total_income: 997244,
      total_expense: 0,
      net_balance: 997244,
      ecommerce_orders_count: 8,
      ecommerce_amount: 240871.4,
      academy_revenue: 0
    },
    charts: {
      ...realMonthPayload.charts,
      revenue_by_origin: {
        ecommerce: 240871.4,
        repairs: 1686445,
        academy: 0
      }
    }
  };

  it('1. Línea Base del Bug: Demuestra que el bug anterior mostraba ceros cuando fallaba el RPC', () => {
    // Simular el bug previo donde el RPC devolvía {"error": "Tenant context required"}
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          error: 'Tenant context required'
        }
      }
    }).as('getBuggyMetrics');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getBuggyMetrics');

    // Comprobar que en el estado defectuoso, todos los KPIs se mostraban en 0
    cy.get('#kpi-balance').within(() => {
      cy.contains('$ 0').should('be.visible');
    });
    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('$ 0').should('be.visible');
      cy.contains('0').should('be.visible');
    });
    cy.get('#kpi-reparaciones-pendientes').within(() => {
      cy.contains('0').should('be.visible');
    });
    cy.get('#kpi-alumnos-academia').within(() => {
      cy.contains('0').should('be.visible');
    });
  });

  it('2. Solución Aplicada: Valida que los datos reales de la base de datos se reflejan correctamente en todas las tarjetas de KPI', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {
        success: true,
        data: realMonthPayload
      }
    }).as('getRealMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // KPI 1: Balance Neto del Mes
    cy.get('#kpi-balance').within(() => {
      cy.contains('Balance Neto').should('be.visible');
      cy.contains('+ Positivo').should('be.visible');
      cy.contains('144.500').should('be.visible'); // $ 144.500
      cy.contains('Ingresos:').should('be.visible');
    });

    // KPI 2: Ventas E-commerce
    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('Ventas E-commerce').should('be.visible');
      cy.contains('$ 0').should('be.visible');
      cy.contains('0').should('be.visible');
    });

    // KPI 3: Reparaciones Pendientes en Taller
    cy.get('#kpi-reparaciones-pendientes').within(() => {
      cy.contains('Reparaciones Pendientes').should('be.visible');
      cy.contains('17').should('be.visible');
      // Alerta de más de 5 demoradas (13 en demora)
      cy.get('#delayed-repairs-alert').should('be.visible').and('contain.text', '13 en retraso');
    });

    // KPI 4: Alumnos en Academia
    cy.get('#kpi-alumnos-academia').within(() => {
      cy.contains('Alumnos en Academia').should('be.visible');
      cy.contains('7').should('be.visible');
      cy.contains('membresías activas').should('be.visible');
    });
  });

  it('3. Valida que las alertas operativas muestran los productos y reparaciones reales en conflicto', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {
        success: true,
        data: realMonthPayload
      }
    }).as('getRealMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // Alerta de Stock Crítico
    cy.get('#alert-critical-stock').scrollIntoView().within(() => {
      cy.contains('Stock Crítico').should('be.visible');
      cy.contains('Abridor de celulares IFIX 360').should('be.visible');
      cy.contains('AF-HER-ABRIDOR-DE').should('be.visible');
      cy.contains('Stock: 0').should('be.visible');
      cy.contains('Mín: 5').should('be.visible');
    });

    // Alerta de Retiros Demorados > 48hs
    cy.get('#alert-overdue-repairs').scrollIntoView().within(() => {
      cy.contains('Retiros > 48hs').should('be.visible');
      cy.contains('AF-171').should('be.visible');
      cy.contains('Daniel pereira').should('be.visible');
      cy.contains('354 hs esperando').should('be.visible');
      cy.contains('Saldo: $30.000').should('be.visible');
    });
  });

  it('4. Valida que el cambio de filtro de rango (Este Año) recalcula ventas históricas y balance acumulado', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {
        success: true,
        data: realMonthPayload
      }
    }).as('getRealMetricsMonth');

    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=year*', {
      statusCode: 200,
      body: {
        success: true,
        data: realYearPayload
      }
    }).as('getRealMetricsYear');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // Cambiar a "Este Año"
    cy.get('#date-range-filter').select('year');
    cy.wait('@getRealMetricsYear').its('request.url').should('include', 'range=year');

    // Verificar que los datos del año se reflejan
    cy.get('#kpi-balance').within(() => {
      cy.contains('997.244').should('be.visible'); // Balance anual
    });

    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('240.871').should('be.visible'); // Ventas anuales e-commerce
      cy.contains('8').should('be.visible'); // 8 pedidos
    });
  });

  it('5. Valida que los gráficos de tendencia y origen renderizan correctamente los 6 meses de datos', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {
        success: true,
        data: realMonthPayload
      }
    }).as('getRealMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // Gráfico de barra de tendencia
    cy.get('#chart-trend-income-expense').scrollIntoView().should('be.visible').within(() => {
      cy.contains('Tendencia de Ingresos vs Egresos').should('be.visible');
      cy.get('canvas').should('exist');
    });

    // Gráfico de dona de origen
    cy.get('#chart-revenue-origin').scrollIntoView().should('be.visible').within(() => {
      cy.contains('Origen de Ingresos').should('be.visible');
      cy.get('canvas').should('exist');
      cy.contains('169.400').should('be.visible'); // Taller
    });
  });

  it('6. Valida que los enlaces directos a Supabase Studio (pgAdmin) y PostHog están presentes y son seguros', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: realMonthPayload }
    }).as('getRealMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // Enlace a Supabase Studio / pgAdmin
    cy.get('#btn-open-supabase-studio')
      .should('be.visible')
      .and('have.attr', 'href', 'https://studio.arecofix.com.ar')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');

    // Enlace a PostHog
    cy.get('#btn-open-posthog')
      .should('be.visible')
      .and('have.attr', 'href', 'https://us.posthog.com')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer');
  });

  it('7. Valida la navegación por pestañas: Top Productos, Clientes RFM, Taller (Marcas/Modelos) y Salud de Base de Datos', () => {
    const mockAnalytics = {
      top_products: [
        { product_id: 'p1', product_name: 'Apple iPhone 16 128gb', sku: 'AF-IPH-16', units_sold: 1, revenue: 921, current_stock: 2, category_name: 'Smartphones' },
        { product_id: 'p2', product_name: 'Modulo Samsung A31 Gold Edition', sku: 'AF-MOD-A31', units_sold: 1, revenue: 46585, current_stock: 0, category_name: 'Repuestos' }
      ],
      customer_analytics: {
        total_customers: 5,
        repeat_customers: 3,
        repeat_purchase_rate: 60.0,
        top_customers: [
          { customer_name: 'Consumidor Final', customer_email: 'Sin Email', frequency: 2, monetary: 120921, last_order_date: '2026-07-10', segment: 'Campeón (LTV Alto)' },
          { customer_name: 'Tobias ivan marchi', customer_email: 'info@arecofix.com.ar', frequency: 1, monetary: 28023, last_order_date: '2026-02-26', segment: 'En Riesgo de Churn' }
        ]
      },
      repair_analytics: {
        by_brand: [
          { brand_name: 'Samsung', repair_count: 8, percentage: 19.5 },
          { brand_name: 'Motorola', repair_count: 6, percentage: 14.6 }
        ],
        by_model: [
          { model_name: 'a 02s', brand_name: 'Samsung', repair_count: 2 },
          { model_name: 'moto G60s', brand_name: 'Motorola', repair_count: 1 }
        ],
        common_issues: [
          { issue: 'Modulo', count: 6 },
          { issue: 'Cambio de modulo', count: 5 }
        ]
      }
    };

    const mockDbHealth = {
      status: 'healthy',
      connections: { active: 21, max: 100, percentage: 21.0, active_queries: 0, idle_in_transaction: 0 },
      performance: { cache_hit_ratio: 99.99, total_locks: 17, blocked_locks: 0, long_running_queries: 0 },
      table_stats: [
        { table_name: 'products', row_count: 2775, dead_tuples: 251, last_autovacuum: '2026-09-17', idx_scan_pct: 97.0, total_size: '6104 kB' },
        { table_name: 'repairs', row_count: 41, dead_tuples: 42, last_autovacuum: '2026-10-12', idx_scan_pct: 57.9, total_size: '360 kB' }
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

    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: realMonthPayload }
    }).as('getRealMetricsMonth');

    cy.intercept('GET', '**/api/admin/dashboard/analytics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockAnalytics }
    }).as('getAnalytics');

    cy.intercept('GET', '**/api/admin/dashboard/db-health*', {
      statusCode: 200,
      body: { success: true, data: mockDbHealth }
    }).as('getDbHealth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getRealMetricsMonth');

    // 1. Pestaña: Top Productos
    cy.get('#tab-view-products').click();
    cy.wait('@getAnalytics');
    cy.get('#view-top-products').should('be.visible').within(() => {
      cy.contains('Top 10 Productos Más Vendidos').should('be.visible');
      cy.get('#table-top-products').within(() => {
        cy.contains('Apple iPhone 16 128gb').should('be.visible');
        cy.contains('Modulo Samsung A31 Gold Edition').should('be.visible');
      });
    });

    // 2. Pestaña: Clientes & RFM
    cy.get('#tab-view-customers').click();
    cy.get('#view-customers-rfm').should('be.visible').within(() => {
      cy.contains('Análisis de Clientes y Segmentación RFM').should('be.visible');
      cy.get('#customer-repeat-rate').should('contain.text', '60%');
      cy.get('#table-customers-rfm').within(() => {
        cy.contains('Consumidor Final').should('be.visible');
        cy.contains('Campeón (LTV Alto)').should('be.visible');
      });
    });

    // 3. Pestaña: Taller (Marcas & Modelos)
    cy.get('#tab-view-repairs').click();
    cy.get('#view-repairs-analytics').should('be.visible').within(() => {
      cy.contains('Estadísticas del Taller: Marcas, Modelos y Fallas').should('be.visible');
      cy.get('#list-repairs-by-brand').within(() => {
        cy.contains('Samsung').should('be.visible');
        cy.contains('Motorola').should('be.visible');
      });
      cy.get('#list-repairs-by-model').within(() => {
        cy.contains('a 02s').should('be.visible');
      });
      cy.get('#list-common-issues').within(() => {
        cy.contains('Modulo').should('be.visible');
      });
    });

    // 4. Pestaña: Salud de Base de Datos
    cy.get('#tab-view-health').click();
    cy.wait('@getDbHealth');
    cy.get('#view-database-health').should('be.visible').within(() => {
      cy.contains('Monitor de Salud de PostgreSQL').should('be.visible');
      cy.get('#health-status-badge').should('contain.text', 'Saludable');
      cy.get('#health-connections-count').should('contain.text', '21 / 100');
      cy.get('#health-cache-hit').should('contain.text', '99.99%');
      cy.get('#table-db-stats').within(() => {
        cy.contains('public.products').should('be.visible');
        cy.contains('public.repairs').should('be.visible');
      });
      cy.get('#btn-health-open-studio')
        .should('be.visible')
        .and('have.attr', 'href', 'https://studio.arecofix.com.ar');
    });

    // 5. Regresar a Resumen General
    cy.get('#tab-view-general').click();
    cy.get('#kpi-balance').should('be.visible');
  });
});

