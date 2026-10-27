import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupOrderMocks } from '../../support/helpers/order.helper';

describe('Data Integrity - Partial Updates: Módulo Pedidos', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupOrderMocks();
    cy.loginAsAdmin('/arecofix/admin/orders');
  });

  it('Actualizar solo el estado del pedido no debe destruir los datos del cliente, dirección ni los items', () => {
    // Localizar y hacer clic en el botón para marcar como Cobrado/Pagado en el pedido
    cy.get('button[title*="Cobrado"], button[title*="Pagado"]').first().click({ force: true });

    // Validar el payload del PATCH enviado a Supabase
    cy.wait('@updateOrder').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;

      // El status debe haberse actualizado a paid
      expect(body.status).to.equal('paid');

      // Campos ausentes en la actualización NO deben enviarse como null
      expect(body.customer_name).to.not.equal(null);
      expect(body.customer_email).to.not.equal(null);
      expect(body.shipping_address).to.not.equal(null);
      expect(body.user_id).to.not.equal(null);
    });

    // Abrir el modal de detalle del pedido para verificar que los datos siguen existiendo íntegramente
    cy.get('button[title*="detalle"], button[title*="Detalle"]').first().click({ force: true });
    cy.get('.fixed.inset-0').should('be.visible').within(() => {
      cy.contains(/Pedido #ORD|Datos del Cliente/).should('be.visible');
      cy.contains('Lucía Fernández').should('be.visible');
      cy.contains('Mitre 450').should('be.visible');
      cy.contains(/\$?\s?55[.,]000/).should('be.visible');
    });
  });
});
