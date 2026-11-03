describe('Admin Invoices & Billing Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin('/admin/sales/invoices');
  });

  it('debería cargar la página de facturación sin errores 400', () => {
    // Verificar que el título de facturación se renderiza
    cy.contains('Facturación').should('be.visible');

    // Verificar filtros de estado
    cy.contains('Todas las facturas').should('be.visible');
    cy.get('#btn-filter-drafts').should('be.visible');
    cy.contains('Emitidas').should('be.visible');

    // Verificar que el botón de crear factura manual está presente
    cy.get('#btn-crear-factura-manual').should('be.visible');
  });

  it('debería filtrar por borradores pendientes y volver a todas las facturas', () => {
    // Click en filtro de borradores
    cy.get('#btn-filter-drafts').click();
    cy.get('#btn-filter-drafts').should('have.class', 'btn-warning');

    // Volver a todas las facturas
    cy.contains('Todas las facturas').click();
    cy.contains('Todas las facturas').should('have.class', 'btn-primary');
  });

  it('debería abrir el modal de facturación ARCA al hacer clic en crear factura manual, colapsar el menú lateral y restaurarlo al cerrar', () => {
    // Verificar que antes de abrir el modal el menú lateral está expandido (w-72)
    cy.get('aside.drawer-side > div').should('have.class', 'w-72');

    cy.get('#btn-crear-factura-manual').click();

    // El contenedor modal de facturación debe estar visible en pantalla
    cy.get('#arca-invoice-modal').should('be.visible');

    // El menú lateral debe haberse colapsado automáticamente a w-20
    cy.get('aside.drawer-side > div').should('have.class', 'w-20');

    // Debe contener el título y badge de normativa ARCA
    cy.get('#arca-invoice-modal').contains('Nueva Factura').should('be.visible');
    cy.get('#arca-invoice-modal').contains('ARCA / RG 5614').should('be.visible');

    // Cerrar modal mediante botón Cancelar
    cy.contains('button', 'Cancelar').click();
    cy.get('#arca-invoice-modal').should('not.exist');

    // El menú lateral debe haberse restaurado a w-72
    cy.get('aside.drawer-side > div').should('have.class', 'w-72');
  });
});
