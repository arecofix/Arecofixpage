import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Ver Detalle', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe abrir el modal de detalle con items, cliente y totales', () => {
    cy.get('button[title*="detalle"], button[title*="Detalle"]').first().click({ force: true });

    // Verify modal appears with Lucía Fernández (first item in list)
    cy.get('.fixed.inset-0').should('be.visible').within(() => {
      cy.contains(/Pedido #ORD|Datos del Cliente/).should('be.visible');
      cy.contains('Lucía Fernández').should('be.visible');
      cy.contains('lucia.f@test.com').should('be.visible');
      cy.contains('Mitre 450').should('be.visible');
      cy.contains(/\$?\s?55[.,]000/).should('be.visible');
    });
  });


});
