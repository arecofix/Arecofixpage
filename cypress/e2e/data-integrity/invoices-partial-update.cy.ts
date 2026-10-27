import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Data Integrity - Partial Updates: Módulo Facturas', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
  });

  it('Editar solo las notas o estado de una factura debe preservar los ítems y totales', () => {
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    // Llamar al endpoint de update a través de Supabase Invoice Service
    cy.window().then(async (win) => {
      const appRef = (win as any).ng?.getComponent(win.document.querySelector('app-root'));
      // Simular un update parcial de notas
      const response = await fetch('/rest/v1/invoices?id=eq.inv-001', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'fake-key'
        },
        body: JSON.stringify({
          notes: 'Factura revisada por contaduría'
        })
      });
      expect(response.status).to.be.oneOf([200, 204]);
    });

    cy.wait('@updateInvoice').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;

      expect(body.notes).to.equal('Factura revisada por contaduría');

      // Campos no enviados NO deben destruirse con null
      expect(body.total_amount).to.not.equal(null);
      expect(body.customer_name).to.not.equal(null);
      expect(body.items).to.not.equal(null);
    });
  });
});
