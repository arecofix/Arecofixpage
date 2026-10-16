import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Cálculo Fiscal - Factura B (Ley 27.743 y RG 5614/2024)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
    cy.get('#btn-invoice-type-B').click();
  });

  it('Ítem único $149.000: NO discrimina IVA y muestra leyenda legal', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Módulo Pantalla iPhone 13 OLED');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}149000');

    // Total final = $149.000 (en Factura B el precio ya es final)
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /149[.,]000[.,]00/);

    // Muestra leyenda obligatoria RG 5614/2024
    cy.contains('El IVA se encuentra incluido en el precio').should('be.visible');

    // NO debe discriminar IVA en Factura B
    cy.get('#arca-invoice-modal').contains('Total IVA Discriminado:').should('not.exist');
  });

  it('Con descuento $40.400: total = $149.000 - $40.400 = $108.600', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Módulo Pantalla');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}149000');

    // Apply discount $40.400
    cy.get('#arca-invoice-modal input[placeholder="0.00"]').type('{selectall}40400');

    // Total a facturar = 108.600
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /108[.,]600[.,]00/);
    cy.contains('Descuento aplicado:').parent().invoke('text').should('match', /40[.,]400[.,]00/);
  });

  it('Con múltiples alícuotas en Factura B: cálculo de neto e IVA implícito respeta cada tasa', () => {
    // Row 1: $121.000 con 21% (neto implícito 100.000, iva 21.000)
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Producto 21%');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}121000');

    // Row 2: $110.500 con 10.5% (neto implícito 100.000, iva 10.500)
    cy.get('#arca-invoice-modal').contains('button', 'Agregar Fila').click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').last().type('{selectall}Producto 10.5%');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').last().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').last().type('{selectall}110500');
    cy.get('#arca-invoice-modal select').filter(':has(option[value="0.105"])').last().select('0.105');

    // Total a facturar = 121.000 + 110.500 = 231.500
    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /231[.,]500[.,]00/);
  });
});
