import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Exportación a PDF (InvoicePdfExportService)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices/inv-001');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('.factura-container', { timeout: 15000 }).should('be.visible');
  });

  it('El botón de descarga o generación PDF existe y se puede invocar', () => {
    cy.get('#btn-download-pdf, #btn-print-invoice').should('exist');
  });

  it('El comprobante tiene configurados los datos para el PDF: QR y CAE', () => {
    cy.get('#invoice-qr-code').should('exist');
    cy.contains(/CAE N°|PENDIENTE DE CAE/).should('exist');
  });
});
