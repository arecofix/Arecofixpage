import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Adversarial Testing: Intentar Romper la Factura', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
  });

  it('Inyección XSS (<script>alert(1)</script>) no se ejecuta y se sanitiza', () => {
    const xssPayload = '<script id="xss-test">window.__XSS_TRIGGERED = true;</script>';

    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}' + xssPayload);
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}1500');

    cy.window().then((win: any) => {
      expect(win.__XSS_TRIGGERED).to.be.undefined;
    });
    cy.get('#xss-test').should('not.exist');
  });

  it('Descripción con emojis y caracteres especiales (📱🛠️⚡) se maneja sin crashear', () => {
    const emojiText = 'Reparación Placa iPhone 📱🛠️⚡ ¡Excelente!';
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}' + emojiText);
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}25000');

    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().should('have.value', emojiText);
    cy.contains('Total a Facturar').should('be.visible');
  });

  it('Montos con decimales extra ($100.00001) se redondean con precisión de 2 decimales', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Producto con microdecimales');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}100.00001');

    cy.contains('Total a Facturar').parent().parent().invoke('text').should('match', /100[.,]00/);
  });

  it('Monto extremadamente grande ($999,999,999,999) no produce NaN ni overflow', () => {
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Super Proyecto');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}999999999999');

    cy.contains('Total a Facturar').parent().parent().should('not.contain', 'NaN');
  });
});
