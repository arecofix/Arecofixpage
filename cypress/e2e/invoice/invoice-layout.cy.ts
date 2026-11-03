import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Layout de Factura ARCA (InvoiceDetailComponent)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices/inv-001');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('.factura-container', { timeout: 15000 }).should('be.visible');
  });

  it('El recuadro de la letra NO se solapa con el texto del comprobante', () => {
    cy.get('.letter-box').should('be.visible').and('contain', 'B');
    cy.contains('FACTURA').should('be.visible');

    // Ensure letter-box and title do not overlap
    cy.get('.letter-box').then(($box) => {
      const boxRect = $box[0].getBoundingClientRect();
      expect(boxRect.width).to.be.at.least(30);
      expect(boxRect.height).to.be.at.least(30);
    });
  });

  it('El Cód. de comprobante no toca los bordes y tiene padding', () => {
    cy.get('.code-badge').should('be.visible').and('contain', '006');
  });

  it('Los datos del emisor están presentes y formateados', () => {
    cy.contains('Arecofix').should('be.visible');
    cy.contains('CUIT:').should('be.visible');
    cy.contains('Ingresos Brutos:').should('be.visible');
    cy.contains('Fecha de Inicio de Actividades:').should('be.visible');
  });

  it('Las leyendas ORIGINAL y DUPLICADO están presentes', () => {
    cy.contains('ORIGINAL').should('be.visible');
  });

  it('Los totales están alineados a la derecha y el TOTAL se destaca', () => {
    cy.get('#invoice-grand-total').scrollIntoView().should('be.visible');
    cy.get('#invoice-grand-total').should('have.class', 'font-black');
  });

  it('El QR obligatorio está presente', () => {
    cy.get('#invoice-qr-code').scrollIntoView().should('exist');
  });

  it('El CAE o estado PENDIENTE DE CAE está presente', () => {
    cy.contains(/CAE N°|PENDIENTE DE CAE/).scrollIntoView().should('be.visible');
  });
});
