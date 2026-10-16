import { SupplierPaymentMadeEvent } from '../../../src/app/domain/events/supplier-payment-made.event';

describe('Event-Driven: Pago a Proveedor -> Caja (SupplierPaymentMadeEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Registrar pago a proveedor crea egreso en caja', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new SupplierPaymentMadeEvent(
        'sup-001',
        'pur-101',
        45000,
        'transfer',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('expense');
      expect(interception.request.body.amount).to.equal(45000);
      expect(interception.request.body.notes || interception.request.body.concept).to.include('Pago a proveedor');
    });
  });
});
