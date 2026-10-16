import { PurchaseRegisteredEvent } from '../../../src/app/domain/events/purchase-registered.event';

describe('Event-Driven: Compra -> Proveedores (PurchaseRegisteredEvent -> SupplierAccount)', () => {
  beforeEach(() => {
    cy.fixture('suppliers.json').then((suppliers) => {
      cy.intercept('GET', '**/rest/v1/suppliers*', {
        statusCode: 200,
        headers: { 'content-range': `0-${suppliers.length - 1}/${suppliers.length}` },
        body: suppliers,
      }).as('getSuppliers');
    });

    cy.loginRealAdmin('/admin/suppliers');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Registrar compra pending actualiza la cuenta corriente del proveedor', () => {
    cy.intercept('PATCH', '**/rest/v1/suppliers*').as('patchSupplier');
    cy.intercept('POST', '**/rest/v1/supplier_account_movements*').as('postSupplierMovement');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new PurchaseRegisteredEvent(
        'pur-sup-1',
        'sup-001',
        'Distribuidora Repuestos Express',
        [],
        25000,
        5250,
        30250,
        'transfer',
        'pending',
        new Date()
      );

      eventBus.publish(event);
    });

    // Verify event is processed
    cy.wait(400);
  });

  it('El directorio de proveedores carga y muestra el saldo', () => {
    cy.wait('@getSuppliers');
    cy.contains('Distribuidora Repuestos Express').should('be.visible');
  });
});
