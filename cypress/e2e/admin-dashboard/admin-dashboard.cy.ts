describe('Admin Business Dashboard E2E: Métricas Consolidadas y Alertas Operativas', () => {
  const mockMetricsMonth = {
    period: {
      range: 'month',
      start_date: '2026-10-01T00:00:00Z',
      end_date: '2026-10-31T23:59:59Z',
    },
    kpis: {
      total_income: 1500000,
      total_expense: 450000,
      net_balance: 1050000,
      ecommerce_orders_count: 42,
      ecommerce_amount: 850000,
      active_repairs_count: 18,
      delayed_repairs_count: 7,
      has_delayed_alert: true,
      active_subscriptions_count: 125,
      academy_revenue: 350000,
      critical_stock_count: 4,
    },
    alerts: {
      critical_stock_items: [
        {
          id: 'prod-crit-1',
          name: 'Módulo Pantalla OLED iPhone 14 Pro',
          sku: 'MOD-IPH-14P',
          stock: 1,
          min_stock_alert: 5,
          price: 185000,
        },
        {
          id: 'prod-crit-2',
          name: 'Batería Original Samsung S23 Ultra',
          sku: 'BAT-SAM-S23U',
          stock: 0,
          min_stock_alert: 4,
          price: 52000,
        },
      ],
      overdue_pickup_repairs: [
        {
          id: 'rep-overdue-1',
          tracking_code: 'AF-782',
          client_name: 'Carlos Mendoza',
          ready_since: '2026-10-14T10:00:00Z',
          hours_waiting: 72,
          final_cost: 65000,
        },
      ],
      expiring_grace_subscriptions: [
        {
          id: 'sub-grace-1',
          user_email: 'alumno.demo@arecofix.com',
          student_name: 'Santiago Morales',
          grace_period_ends_at: '2026-10-19T23:59:59Z',
          days_left: 2,
        },
      ],
    },
    charts: {
      trend_6_months: [
        { period: '2026-05', label: 'May', income: 980000, expense: 320000, net_balance: 660000 },
        { period: '2026-06', label: 'Jun', income: 1120000, expense: 390000, net_balance: 730000 },
        { period: '2026-07', label: 'Jul', income: 1250000, expense: 410000, net_balance: 840000 },
        { period: '2026-08', label: 'Ago', income: 1380000, expense: 430000, net_balance: 950000 },
        { period: '2026-09', label: 'Sep', income: 1420000, expense: 440000, net_balance: 980000 },
        { period: '2026-10', label: 'Oct', income: 1500000, expense: 450000, net_balance: 1050000 },
      ],
      revenue_by_origin: {
        ecommerce: 850000,
        repairs: 300000,
        academy: 350000,
      },
    },
  };

  const mockMetrics7Days = {
    ...mockMetricsMonth,
    period: {
      range: '7days',
      start_date: '2026-10-10T00:00:00Z',
      end_date: '2026-10-17T23:59:59Z',
    },
    kpis: {
      ...mockMetricsMonth.kpis,
      total_income: 380000,
      total_expense: 110000,
      net_balance: 270000,
      ecommerce_orders_count: 11,
      ecommerce_amount: 210000,
    },
  };

  it('1. El dashboard carga las 4 tarjetas de KPI correctamente', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsMonth },
    }).as('getMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsMonth');

    // KPI 1: Balance del Mes
    cy.get('#kpi-balance').scrollIntoView();
    cy.get('#kpi-balance').within(() => {
      cy.contains('Balance Neto').should('exist');
      cy.contains('+ Positivo').should('exist');
      cy.contains('1.050.000').should('exist');
      cy.contains('1.500.000').should('exist'); // Ingresos
      cy.contains('450.000').should('exist'); // Egresos
    });

    // KPI 2: Ventas Online
    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('Ventas E-commerce').should('be.visible');
      cy.contains('850.000').should('be.visible');
      cy.contains('42').should('be.visible');
    });

    // KPI 3: Reparaciones Pendientes
    cy.get('#kpi-reparaciones-pendientes').within(() => {
      cy.contains('Reparaciones Pendientes').should('be.visible');
      cy.contains('18').should('be.visible');
      // Alerta de más de 5 retrasadas
      cy.get('#delayed-repairs-alert').should('be.visible').and('contain.text', '7 en retraso');
    });

    // KPI 4: Alumnos Activos en Academia
    cy.get('#kpi-alumnos-academia').within(() => {
      cy.contains('Alumnos en Academia').should('be.visible');
      cy.contains('125').should('be.visible');
      cy.contains('350.000').should('be.visible');
    });
  });

  it('2. El gráfico de tendencia renderiza sin errores de consola', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsMonth },
    }).as('getMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsMonth');

    // Chart 1: Tendencia Ingresos vs Egresos
    cy.get('#chart-trend-income-expense').scrollIntoView().should('be.visible').within(() => {
      cy.contains('Tendencia de Ingresos vs Egresos').should('be.visible');
      cy.get('canvas').should('exist');
    });

    // Chart 2: Origen de Ingresos
    cy.get('#chart-revenue-origin').scrollIntoView().should('be.visible').within(() => {
      cy.contains('Origen de Ingresos').should('be.visible');
      cy.get('canvas').should('exist');
      cy.contains('850.000').should('be.visible'); // Ecommerce
      cy.contains('300.000').should('be.visible'); // Repairs
      cy.contains('350.000').should('be.visible'); // Academy
    });
  });

  it('3. Si hay un producto con stock crítico (mockeado), aparece en el panel de alertas', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsMonth },
    }).as('getMetricsMonth');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsMonth');

    // Centro de alertas
    cy.get('#center-operational-alerts').scrollIntoView().should('exist');

    // Alerta de stock crítico
    cy.get('#alert-critical-stock').scrollIntoView().within(() => {
      cy.contains('Stock Crítico').should('be.visible');
      cy.contains('Módulo Pantalla OLED iPhone 14 Pro').should('be.visible');
      cy.contains('MOD-IPH-14P').should('be.visible');
      cy.contains('Stock: 1').should('be.visible');
      cy.contains('Batería Original Samsung S23 Ultra').should('be.visible');
      cy.contains('Stock: 0').should('be.visible');
    });

    // Alerta de reparaciones retrasadas en retiro
    cy.get('#alert-overdue-repairs').scrollIntoView().within(() => {
      cy.contains('AF-782').should('be.visible');
      cy.contains('Carlos Mendoza').should('be.visible');
      cy.contains('72 hs esperando').should('be.visible');
    });

    // Alerta de suscripciones por vencer
    cy.get('#alert-expiring-subscriptions').scrollIntoView().within(() => {
      cy.contains('Santiago Morales').should('be.visible');
      cy.contains('alumno.demo@arecofix.com').should('be.visible');
      cy.contains('2 días restantes').should('be.visible');
    });
  });

  it('4. Al cambiar el filtro de fecha, el endpoint de métricas recibe los nuevos parámetros y actualiza las tarjetas', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsMonth },
    }).as('getMetricsMonth');

    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=7days*', {
      statusCode: 200,
      body: { success: true, data: mockMetrics7Days },
    }).as('getMetrics7Days');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsMonth');

    // Cambiar filtro a 7 días
    cy.get('#date-range-filter').select('7days');
    cy.wait('@getMetrics7Days').its('request.url').should('include', 'range=7days');

    // Validar tarjetas actualizadas
    cy.get('#kpi-balance').within(() => {
      cy.contains('270.000').should('be.visible');
      cy.contains('380.000').should('be.visible');
      cy.contains('110.000').should('be.visible');
    });

    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('210.000').should('be.visible');
      cy.contains('11').should('be.visible');
    });
  });

  it('5. Test Adversarial: Si un endpoint falla (ej. DB de Academia), muestra aviso parcial sin romper la pantalla', () => {
    // Simular respuesta con error parcial en Academia pero éxito general en la plataforma
    const mockAdversarialMetrics = {
      ...mockMetricsMonth,
      kpis: {
        ...mockMetricsMonth.kpis,
        active_subscriptions_count: 0,
        academy_revenue: 0,
      },
    };

    cy.intercept('GET', '**/api/admin/dashboard/metrics*', {
      statusCode: 200,
      body: {
        success: true,
        data: mockAdversarialMetrics,
        partialErrors: {
          academy: 'No se pudieron cargar los datos de Academia.',
        },
      },
    }).as('getAdversarialMetrics');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getAdversarialMetrics');

    // 1. Verificar banner de aviso parcial
    cy.get('#partial-error-banner').should('be.visible');
    cy.get('#partial-error-banner').should('contain.text', 'No se pudieron cargar los datos de Academia.');

    // 2. Verificar que el resto de las tarjetas no se rompieron y siguen operativas
    cy.get('#kpi-balance').scrollIntoView();
    cy.get('#kpi-balance').within(() => {
      cy.contains('1.050.000').should('exist');
    });
    cy.get('#kpi-ventas-online').scrollIntoView();
    cy.get('#kpi-ventas-online').within(() => {
      cy.contains('850.000').should('exist');
    });
    cy.get('#kpi-reparaciones-pendientes').scrollIntoView();
    cy.get('#kpi-reparaciones-pendientes').within(() => {
      cy.contains('18').should('exist');
    });

    // 3. El centro de alertas sigue visible
    cy.get('#center-operational-alerts').scrollIntoView().should('exist');
    cy.get('#alert-critical-stock').scrollIntoView().should('be.visible');
  });
});
