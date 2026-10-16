import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Cálculo Fiscal - Factura A (CalculateArcaTotalsUseCase)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
    cy.get('#btn-invoice-type-A').click();
  });

  it('Ítem único IVA 21%: neto $100.000 + IVA $21.000 = total $121.000', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio Servidor');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}100000');

    // Subtotal Net $100.000
    cy.contains('Neto Gravado al 21%:').parent().invoke('text').should('match', /100[.,]000[.,]00/);
    // IVA $21.000
    cy.contains('IVA Liquidado al 21%:').parent().invoke('text').should('match', /21[.,]000[.,]00/);
    // Total $121.000
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /121[.,]000[.,]00/);
  });

  it('Múltiples ítems con misma alícuota: suma correcta', () => {
    // Row 1: $100.000
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Servicio 1');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}100000');

    // Row 2: $50.000
    cy.get('#arca-invoice-modal').contains('button', 'Agregar Fila').click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').last().type('{selectall}Servicio 2');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').last().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').last().type('{selectall}50000');

    // Total Net $150.000, IVA $31.500, Grand total $181.500
    cy.contains('Neto Gravado al 21%:').parent().invoke('text').should('match', /150[.,]000[.,]00/);
    cy.contains('Total IVA Discriminado:').parent().invoke('text').should('match', /31[.,]500[.,]00/);
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /181[.,]500[.,]00/);
  });

  it('Múltiples alícuotas (21%, 10.5%, 27%): desglose correcto', () => {
    // Row 1: $100.000 al 21%
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item 21');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}100000');

    // Row 2: $100.000 al 10.5%
    cy.get('#arca-invoice-modal').contains('button', 'Agregar Fila').click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').last().type('{selectall}Item 10.5');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').last().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').last().type('{selectall}100000');
    cy.get('#arca-invoice-modal select').filter(':has(option[value="0.105"])').last().select('0.105');

    // Verify both breakdowns appear
    cy.contains('Neto Gravado al 21%:').parent().invoke('text').should('match', /100[.,]000[.,]00/);
    cy.contains('Neto Gravado al 10.5%:').parent().invoke('text').should('match', /100[.,]000[.,]00/);
    cy.contains('IVA Liquidado al 10.5%:').parent().invoke('text').should('match', /10[.,]500[.,]00/);
  });

  it('Descuento sobre subtotal: total = subtotal + IVA - descuento', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Item con descuento');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}100000');

    // Apply discount $10.000
    cy.get('#arca-invoice-modal input[placeholder="0.00"]').type('{selectall}10000');

    // Grand total = 100.000 + 21.000 - 10.000 = 111.000
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /111[.,]000[.,]00/);
  });

  it('Monto muy grande ($999.999.999): no hay overflow visual ni NaN', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Gran Proyecto');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}999999999');

    cy.contains('Total a Facturar').parent().parent().should('not.contain', 'NaN');
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /1[.,]209[.,]999[.,]998[.,]79/);
  });
});
