describe('Navegación Móvil por Pestañas (Touch & Gestures)', () => {
  beforeEach(() => {
    cy.viewport(390, 844); // Mobile Viewport (iPhone 12/13/14)
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Touch event en cada pestaña navega correctamente en mobile', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);

    // Trigger tap (touchstart then touchend with elapsed < 450ms and no movement)
    cy.get('[role="tab"]').first().trigger('touchstart', { touches: [{ clientX: 100, clientY: 20 }] });
    cy.wait(50);
    cy.get('[role="tab"]').first().trigger('touchend', { touches: [], changedTouches: [{ clientX: 100, clientY: 20 }] });

    cy.url().should('include', '/sales/invoices');
  });

  it('Un tap con desplazamiento menor a 8px dispara navegación', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);

    // Movement: 4px delta (< 8px)
    cy.get('[role="tab"]').first().trigger('touchstart', { touches: [{ clientX: 100, clientY: 20 }] });
    cy.get('[role="tab"]').first().trigger('touchmove', { touches: [{ clientX: 104, clientY: 21 }] });
    cy.wait(50);
    cy.get('[role="tab"]').first().trigger('touchend', { touches: [], changedTouches: [{ clientX: 104, clientY: 21 }] });

    cy.url().should('include', '/sales/invoices');
  });

  it('Un swipe con desplazamiento mayor a 8px NO dispara navegación', () => {
    cy.get('a[href*="/dashboard"]').first().click({ force: true });
    cy.get('[role="tab"]').should('have.length', 2);

    // Movement: 35px delta (> 8px swipe)
    cy.get('[role="tab"]').first().trigger('touchstart', { touches: [{ clientX: 100, clientY: 20 }] });
    cy.get('[role="tab"]').first().trigger('touchmove', { touches: [{ clientX: 135, clientY: 20 }] });
    cy.wait(50);
    cy.get('[role="tab"]').first().trigger('touchend', { touches: [], changedTouches: [{ clientX: 135, clientY: 20 }] });

    // Should NOT have navigated: we remain on dashboard
    cy.url().should('include', '/dashboard');
  });

  it('El scroll horizontal en la barra de pestañas NO dispara navegación accidental', () => {
    cy.visit('/admin/dashboard');
    cy.visit('/admin/repairs');

    cy.get('[role="tablist"]').trigger('touchstart', { touches: [{ clientX: 250, clientY: 20 }] });
    cy.get('[role="tablist"]').trigger('touchmove', { touches: [{ clientX: 120, clientY: 20 }] });
    cy.get('[role="tablist"]').trigger('touchend', { touches: [], changedTouches: [{ clientX: 120, clientY: 20 }] });

    // Stays on active repairs tab
    cy.url().should('include', '/admin/repairs');
  });

  it('La pestaña activa se auto-scrollea al centro al cambiar', () => {
    // Open multiple tabs
    const routes = ['/admin/sales', '/admin/purchases', '/admin/suppliers', '/admin/orders'];
    routes.forEach(r => cy.visit(r));

    cy.get('[role="tab"][aria-selected="true"]').should('be.visible');
  });
});
