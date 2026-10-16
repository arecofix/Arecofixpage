import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Cálculo Fiscal - Factura C (Régimen Simplificado / Monotributo)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
    cy.get('#btn-invoice-type-C').click();
  });

  it('No discrimina IVA y no muestra leyenda de IVA discriminado', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio Técnico General');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}50000');

    // Total = $50.000
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /50[.,]000[.,]00/);

    // No debe mostrar IVA Discriminado
    cy.get('#arca-invoice-modal').contains('Total IVA Discriminado:').should('not.exist');
    cy.get('#arca-invoice-modal').contains('El IVA se encuentra incluido en el precio').should('not.exist');
    cy.get('#arca-invoice-modal').contains('Operación no gravada con IVA conforme a la Ley de Monotributo').should('be.visible');
  });

  it('Total = precio final - descuento', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio con descuento');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}50000');

    // Apply discount $5.000
    cy.get('#arca-invoice-modal input[placeholder="0.00"]').type('{selectall}5000');

    // Total = 45.000
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /45[.,]000[.,]00/);
    cy.contains('Descuento aplicado:').parent().invoke('text').should('match', /5[.,]000[.,]00/);
  });
});
