import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Casos Borde: Umbrales ARCA ($208.644 / $417.288)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
  });

  it('Pago en efectivo con monto $208.643 (justo debajo): sin identificación -> VÁLIDO', () => {
    // Default payment method is cash
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Reparación');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}208643');

    cy.get('#btn-confirmar-factura-arca').should('not.be.disabled');
  });

  it('Pago en efectivo con monto $208.644 (en el umbral): sin identificación -> ERROR', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Reparación');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}208644');

    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
    cy.contains('Identificación Obligatoria ARCA 2025').scrollIntoView().should('be.visible');
  });

  it('Pago electrónico con monto $417.287: sin identificación -> VÁLIDO', () => {
    // Select transfer (electronic payment)
    cy.get('#select-payment-method').select('transfer');
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}417287');

    cy.get('#btn-confirmar-factura-arca').should('not.be.disabled');
  });

  it('Pago electrónico con monto $417.288: sin identificación -> ERROR', () => {
    cy.get('#select-payment-method').select('transfer');
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}417288');

    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
    cy.contains('Identificación Obligatoria ARCA 2025').scrollIntoView().should('be.visible');
  });

  it('Factura A sin CUIT o con cliente Consumidor Final -> ERROR', () => {
    cy.get('#btn-invoice-type-A').click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item A');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}10000');

    // Without CUIT:
    cy.get('#btn-confirmar-factura-arca').should('be.disabled');

    // With Consumidor Final:
    cy.get('#select-customer-vat-condition').select('Consumidor Final');
    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
    cy.contains('No se puede emitir Factura "A" a un Consumidor Final').should('be.visible');
  });
});
