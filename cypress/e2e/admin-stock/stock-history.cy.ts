import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Stock: Histórico de Movimientos', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe abrir el modal de historial de stock al presionar el botón correspondiente', () => {
    cy.get('button:has(i.fa-history), button[data-tip="Historial Stock"]').first().click({ force: true });

    // Verify modal appears
    cy.get('.modal-open, dialog[open], .fixed.inset-0').should('be.visible');
    cy.contains(/Historial.*Stock/).should('be.visible');

    // Should list historical entries
    cy.contains('+15').should('be.visible');
  });
});
