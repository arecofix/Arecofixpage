describe('Adversarial Testing: Intentar Romper las Pestañas (AdminTabBarComponent)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Abrir múltiples pestañas consecutivas no crashea el componente ni la memoria', () => {
    const mockTabs = [
      { title: 'Facturación', url: '/admin/sales/invoices', active: false },
      { title: 'Dashboard', url: '/admin/dashboard', active: false },
      { title: 'Ventas', url: '/admin/sales', active: false },
      { title: 'Reparaciones', url: '/admin/repairs', active: false },
      { title: 'Proveedores', url: '/admin/suppliers', active: false },
      { title: 'Compras', url: '/admin/purchases', active: false },
      { title: 'Pedidos', url: '/admin/orders', active: false },
      { title: 'Usuarios', url: '/admin/users', active: false },
      { title: 'Sucursales', url: '/admin/branches', active: false },
      { title: 'Caja', url: '/admin/finance/cash-movements', active: true },
    ];

    cy.window().then((win) => {
      win.sessionStorage.setItem('arecofix_admin_tabs', JSON.stringify(mockTabs));
    });

    cy.visit('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('[role="tablist"]').should('be.visible');
    cy.get('[role="tab"]').should('have.length.at.least', 10);
  });

  it('Tap rápido repetido en la misma pestaña no rompe el estado de la aplicación', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);

    // Rapid double click / tap on first tab
    cy.get('[role="tab"]').first().click().click().click();

    cy.url().should('include', '/admin/sales/invoices');
    cy.get('[role="tab"][aria-selected="true"]').should('have.length', 1);
  });

  it('Cerrar todas las pestañas mediante botón "Limpiar" no rompe la aplicación y navega al dashboard', () => {
    const mockTabs = [
      { title: 'Facturación', url: '/admin/sales/invoices', active: false },
      { title: 'Reparaciones', url: '/admin/repairs', active: false },
      { title: 'Pedidos', url: '/admin/orders', active: true },
    ];

    cy.window().then((win) => {
      win.sessionStorage.setItem('arecofix_admin_tabs', JSON.stringify(mockTabs));
    });

    cy.visit('/admin/orders');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.contains('button', 'Limpiar').should('be.visible').click();
    cy.url().should('include', '/admin/dashboard');
    cy.get('[role="tab"]').should('have.length', 1);
  });
});
