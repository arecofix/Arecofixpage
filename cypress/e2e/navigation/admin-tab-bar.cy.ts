describe('Navegación Móvil y Desktop - AdminTabBarComponent', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.url().should('include', '/sales/invoices');
  });

  it('Las pestañas son accesibles con role="tab" y aria-selected', () => {
    cy.get('[role="tablist"]').should('exist');
    cy.get('[role="tab"]').should('have.length.at.least', 1);
    cy.get('[role="tab"]').first().should('have.attr', 'aria-selected', 'true');
  });

  it('Click en cada pestaña navega a la ruta correcta en desktop', () => {
    cy.get('[role="tab"]').should('have.length', 1);
    cy.get('[role="tab"]').first().should('contain.text', 'Facturación');

    // Navigate by clicking sidebar link to create a second tab via client-side routing
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);
    
    // Click on invoices tab
    cy.get('[role="tab"]').first().click();
    cy.url().should('include', '/sales/invoices');
    cy.get('[role="tab"]').first().should('have.attr', 'aria-selected', 'true');
  });

  it('El estado aria-selected solo está en una pestaña a la vez', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"][aria-selected="true"]').should('have.length', 1);
    cy.get('[role="tab"][aria-selected="false"]').should('have.length', 1);
  });

  it('Al cambiar de ruta por URL, la pestaña activa se marca correctamente', () => {
    cy.visit('/admin/repairs');
    cy.get('[role="tab"]').last().should('have.attr', 'aria-selected', 'true');
  });

  it('El botón de cierre (x) cierra la pestaña sin navegar y tiene área mínima de 44x44px', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);

    // Check size of close button (>= 44x44px)
    cy.get('[role="tab"]').first().find('[aria-label^="Cerrar pestaña"]').then(($btn) => {
      const rect = $btn[0].getBoundingClientRect();
      expect(rect.width).to.be.at.least(44);
      expect(rect.height).to.be.at.least(44);
    });

    // Close the non-active first tab
    cy.get('[role="tab"]').first().find('[aria-label^="Cerrar pestaña"]').click();
    cy.get('[role="tab"]').should('have.length', 1);
    cy.url().should('include', '/dashboard');
  });

  it('Con 10+ pestañas abiertas, la barra scrollea correctamente', () => {
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
      { title: 'Categorías', url: '/admin/categories', active: false },
      { title: 'Marcas', url: '/admin/brands', active: true },
    ];

    cy.window().then((win) => {
      win.sessionStorage.setItem('arecofix_admin_tabs', JSON.stringify(mockTabs));
    });

    cy.visit('/admin/brands');
    cy.get('[role="tab"]').should('have.length.at.least', 10);
    cy.get('[role="tablist"]').then(($el) => {
      const el = $el[0];
      expect(el.scrollWidth).to.be.greaterThan(el.clientWidth);
    });
  });
});
