import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Casos Borde: Datos Inválidos en Facturación', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
  });

  it('Ítem con cantidad 0 o negativa: no permite emitir', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item Test');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}0');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}1000');

    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
  });

  it('Ítem con precio negativo: no permite emitir', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item Test Negativo');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}-500');

    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
  });

  it('CUIT con formato o longitud inválida para Factura A: no permite emitir', () => {
    cy.get('#btn-invoice-type-A').click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item A');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}10000');

    // Type invalid CUIT (e.g. 12345)
    cy.get('#input-customer-doc-number').type('{selectall}12345');
    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
    cy.contains('debe tener 11 dígitos').should('be.visible');
  });
});
