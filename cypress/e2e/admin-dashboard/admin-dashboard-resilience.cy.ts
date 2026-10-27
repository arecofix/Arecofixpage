describe('Admin Dashboard: Blindaje y Resiliencia a Fallos de Red', () => {
  const mockMetricsSuccess = {
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

  let capturedConsoleErrors: string[] = [];

  // Requisito FASE 4: Cypress.on('window:before:load', ...)
  Cypress.on('window:before:load', (win) => {
    const originalConsoleError = win.console.error;
    win.console.error = (...args: unknown[]) => {
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');
      capturedConsoleErrors.push(message);
      originalConsoleError.apply(win.console, args);
    };
  });

  beforeEach(() => {
    capturedConsoleErrors = [];
  });

  afterEach(() => {
    // Aserción de Consola: no debe haber errores fatales de 'reading net_balance' ni 'reading properties of undefined'
    const netBalanceErrors = capturedConsoleErrors.filter(
      (err) => err.includes("reading 'net_balance'") || err.includes('net_balance') && err.includes('undefined')
    );
    expect(netBalanceErrors, 'No deben existir excepciones fatales de net_balance en consola').to.have.length(0);
  });

  it('1. Test de Error de Red (500): Muestra panel de error con botón "Reintentar" y NO crashea en consola', () => {
    // Intercepta la llamada de red forzando error 500
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 500,
      body: { success: false, error: 'Database aggregation connection failure' },
    }).as('getMetricsError500');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsError500');

    // Debe mostrar el panel de error con el botón "Reintentar"
    cy.get('#dashboard-error-panel').should('be.visible').within(() => {
      cy.contains('Error al cargar las métricas').should('be.visible');
      cy.get('#btn-retry-dashboard').should('be.visible').and('contain.text', 'Reintentar');
    });

    // Las tarjetas reales y skeleton no deben mostrarse
    cy.get('#dashboard-skeleton-loader').should('not.exist');
    cy.get('#kpi-balance').should('not.exist');

    // Al hacer clic en "Reintentar", reintentamos con respuesta 200 exitosa
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsSuccess },
    }).as('getMetricsRetrySuccess');

    cy.get('#btn-retry-dashboard').click();
    cy.wait('@getMetricsRetrySuccess');

    // El panel de error desaparece y los KPIs se renderizan correctamente
    cy.get('#dashboard-error-panel').should('not.exist');
    cy.get('#kpi-balance').should('be.visible').within(() => {
      cy.contains('1.050.000').should('be.visible');
      cy.contains('+ Positivo').should('be.visible');
    });
  });

  it('2. Test de Datos Vacíos ({}): Fallback seguro con KPIs en 0 sin lanzar excepciones de undefined', () => {
    // Fuerza una respuesta vacía ({})
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: {},
    }).as('getMetricsEmpty');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsEmpty');

    // No debe mostrar panel de error fatal
    cy.get('#dashboard-error-panel').should('not.exist');
    cy.get('#dashboard-skeleton-loader').should('not.exist');

    // Los KPIs deben mostrarse en 0 o $0 sin crashear
    cy.get('#kpi-balance').should('be.visible').within(() => {
      cy.contains('Balance Neto').should('be.visible');
      cy.contains('$ 0').should('be.visible');
      cy.contains('+ Positivo').should('be.visible');
    });

    cy.get('#kpi-ventas-online').should('be.visible').within(() => {
      cy.contains('Ventas E-commerce').should('be.visible');
      cy.contains('$ 0').should('be.visible');
    });

    cy.get('#kpi-reparaciones-pendientes').should('be.visible').within(() => {
      cy.contains('Reparaciones Pendientes').should('be.visible');
      cy.contains('0').should('be.visible');
    });

    cy.get('#kpi-alumnos-academia').should('be.visible').within(() => {
      cy.contains('Alumnos en Academia').should('be.visible');
      cy.contains('0').should('be.visible');
    });
  });

  it('3. Test de Carga Exitosa: Fuerza respuesta mockeada y verifica renderizado de KPIs y gráficos', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsSuccess },
    }).as('getMetricsSuccess');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsSuccess');

    // Verificar tarjetas de KPI
    cy.get('#kpi-balance').should('be.visible').within(() => {
      cy.contains('Balance Neto').should('be.visible');
      cy.contains('1.050.000').should('be.visible');
      cy.contains('1.500.000').should('be.visible');
      cy.contains('450.000').should('be.visible');
    });

    cy.get('#kpi-ventas-online').should('be.visible').within(() => {
      cy.contains('850.000').should('be.visible');
      cy.contains('42').should('be.visible');
    });

    cy.get('#kpi-reparaciones-pendientes').should('be.visible').within(() => {
      cy.contains('18').should('be.visible');
      cy.get('#delayed-repairs-alert').should('be.visible').and('contain.text', '7 en retraso');
    });

    cy.get('#kpi-alumnos-academia').should('be.visible').within(() => {
      cy.contains('125').should('be.visible');
      cy.contains('350.000').should('be.visible');
    });

    // Verificar gráficos
    cy.get('#chart-trend-income-expense').scrollIntoView().should('be.visible').within(() => {
      cy.get('canvas').should('exist');
    });
    cy.get('#chart-revenue-origin').scrollIntoView().should('be.visible').within(() => {
      cy.get('canvas').should('exist');
    });

    // Verificar alertas operativas
    cy.get('#center-operational-alerts').scrollIntoView().should('exist');
    cy.get('#alert-critical-stock').should('be.visible').within(() => {
      cy.contains('Módulo Pantalla OLED iPhone 14 Pro').should('be.visible');
    });
  });

  it('4. Test de Consola: Valida que ninguna operación fatal de undefined haya ocurrido en el Dashboard', () => {
    cy.intercept('GET', '**/api/admin/dashboard/metrics?range=month*', {
      statusCode: 200,
      body: { success: true, data: mockMetricsSuccess },
    }).as('getMetricsConsole');

    cy.loginAsAdmin('/admin/dashboard');
    cy.wait('@getMetricsConsole');

    cy.wrap(capturedConsoleErrors).should((errors) => {
      const fatalErrors = errors.filter(
        (e) => e.includes('TypeError') && (e.includes('net_balance') || e.includes('reading'))
      );
      expect(fatalErrors, 'Cero excepciones fatales de TypeScript/JS en la consola del navegador').to.have.length(0);
    });
  });
});
