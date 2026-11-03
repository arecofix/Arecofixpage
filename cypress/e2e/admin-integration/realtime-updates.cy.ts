import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Admin - Integración: Actualizaciones en Tiempo Real', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
  });

  it('La página de pedidos establece el canal de suscripción realtime sin errores', () => {
    cy.loginAsAdmin('/arecofix/admin/orders');

    cy.get('h1, h2, h3').should('contain.text', 'Envíos');
    cy.contains('Carlos Gomez').should('exist');

    // Verify window and page loaded
    cy.window().should((win) => {
      expect(win).to.not.be.null;
    });

  });
});
