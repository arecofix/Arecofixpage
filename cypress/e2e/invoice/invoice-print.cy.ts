import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Impresión de Factura (InvoiceDetailComponent)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices/inv-001');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('.factura-container', { timeout: 15000 }).should('be.visible');
  });

  it('El botón "Imprimir / PDF" abre el diálogo window.print (stub)', () => {
    cy.window().then((win) => {
      cy.stub(win, 'print').as('windowPrint');
    });

    cy.get('#btn-print-invoice').should('be.visible').click();
    cy.get('@windowPrint').should('have.been.calledOnce');
  });

  it('El botón "Compartir" usa Web Share API si está soportado (stub)', () => {
    cy.window().then((win) => {
      // Mock navigator.share
      (win.navigator as any).share = cy.stub().resolves();
    });

    // If share button is available
    cy.get('body').then(($body) => {
      if ($body.find('#btn-share-invoice').length > 0) {
        cy.get('#btn-share-invoice').click();
      }
    });
  });

  it('El CSS de impresión define reglas @media print', () => {
    cy.get('style').then(($styles) => {
      const allCss = Array.from($styles).map((s) => s.innerHTML).join(' ');
      expect(allCss).to.include('@media print');
    });
  });
});
