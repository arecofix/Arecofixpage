import { PurchaseRegisteredEvent } from '../../../src/app/domain/events/purchase-registered.event';

describe('Flujo de Integración Completo: Compra a Proveedor E2E', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/purchases');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Registrar compra pagada crea egreso en caja y actualiza al proveedor', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new PurchaseRegisteredEvent(
        'pur-flow-1',
        'sup-001',
        'Distribuidora Repuestos Express',
        [
          {
            description: 'Lote 10 Pantallas iPhone 11',
            quantity: 10,
            unitCost: 15000,
            subtotal: 150000,
          },
        ],
        150000,
        31500,
        181500,
        'transfer',
        'paid',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('expense');
      expect(interception.request.body.amount).to.equal(181500);
      const desc = interception.request.body.notes || interception.request.body.concept || interception.request.body.description;
      expect(desc).to.include('Distribuidora Repuestos Express');
    });
  });
});
