import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Listar', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe mostrar la lista con los pedidos cargados', () => {
    cy.contains(/Envíos|Pedidos/).should('be.visible');
    cy.contains('Lucía Fernández').should('exist');
    cy.contains('Carlos Gomez').should('exist');
    cy.contains(/ORD-2026-1001|ORD-2026-1002/).should('exist');
  });


  it('Debe mostrar badges de estado de pedido y montos', () => {
    cy.contains(/151[.,]500/).should('exist');
    cy.contains(/55[.,]000/).should('exist');
  });
});
