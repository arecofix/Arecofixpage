import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Gestión de Pedidos: Búsqueda y Filtros', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Debe filtrar pedidos por nombre del cliente o número de pedido', () => {
    cy.get('input[placeholder*="Buscar"]').type('Carlos');
    cy.contains('Carlos Gomez').should('exist');
  });

  it('Debe filtrar pedidos por pestañas de estado', () => {
    cy.contains('button', /Cobrados|Pagados/).click({ force: true });
    cy.contains('Lucía Fernández').should('exist');

    cy.contains('button', 'Enviados').click({ force: true });
    cy.contains('Marcos Rossi').should('exist');
  });

});

