/**
 * Invoice Helper for Cypress E2E Tests
 */

export function setupInvoiceMocks() {
  cy.fixture('products.json').then((products) => {
    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${products.length - 1}/${products.length}` },
        body: products,
      });
    }).as('getProductsCatalog');
  });

  cy.fixture('invoices.json').then((invoices) => {
    cy.intercept('GET', '**/rest/v1/invoices*', (req) => {
      const wantsObject = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      const idMatch = req.url.match(/id=eq\.([^&]+)/);
      const requestedId = idMatch ? idMatch[1] : null;

      const orderIdMatch = req.url.match(/order_id=eq\.([^&]+)/);
      const repairMatch = req.url.match(/repair_id|repair_order_id/);
      if (orderIdMatch || repairMatch) {
        if (wantsObject) {
          req.reply({
            statusCode: 406,
            body: {
              code: 'PGRST116',
              details: 'The result contains 0 rows',
              message: 'JSON object requested, multiple (or no) rows returned',
            },
          });
        } else {
          req.reply({
            statusCode: 200,
            headers: { 'content-range': '*/0' },
            body: [],
          });
        }
        return;
      }

      let found = invoices[0];
      if (requestedId) {
        found = invoices.find((inv: any) => inv.id === requestedId) || invoices[0];
      }

      const normalizedFound = {
        ...found,
        type: found.type || found.voucher_letter || 'B',
        voucher_letter: found.voucher_letter || found.type || 'B',
        voucher_code: found.voucher_code || (found.voucher_letter === 'A' ? '001' : '006'),
        status: found.status || 'APPROVED',
      };

      if (wantsObject) {
        req.reply({
          statusCode: 200,
          body: normalizedFound,
        });
      } else if (requestedId) {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/1' },
          body: [normalizedFound],
        });
      } else {
        const list = invoices.map((inv: any) => ({
          ...inv,
          type: inv.type || inv.voucher_letter || 'B',
          voucher_letter: inv.voucher_letter || inv.type || 'B',
          voucher_code: inv.voucher_code || (inv.voucher_letter === 'A' ? '001' : '006'),
          status: inv.status || 'APPROVED',
        }));
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${list.length - 1}/${list.length}` },
          body: list,
        });
      }
    }).as('getInvoices');
  });

  cy.intercept('GET', '**/rest/v1/invoice_items*', (req) => {
    req.reply({
      statusCode: 200,
      body: [
        {
          id: 'item-1',
          description: 'Módulo Pantalla iPhone 13 OLED',
          item_type: 'part',
          quantity: 1,
          unit_price: 149000,
          tax_rate: 0.21,
          discount_amount: 0,
          subtotal: 149000,
          total: 149000,
        },
      ],
    });
  }).as('getInvoiceItems');

  cy.intercept('POST', '**/rest/v1/invoices*', (req) => {
    const newInvoice = {
      id: 'inv-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'APPROVED',
      ...req.body,
    };
    req.reply({
      statusCode: 201,
      body: newInvoice,
    });
  }).as('postInvoice');

  cy.intercept('POST', '**/rest/v1/invoice_items*', (req) => {
    req.reply({
      statusCode: 201,
      body: req.body,
    });
  }).as('postInvoiceItems');

  cy.intercept('GET', '**/rest/v1/tenants*', (req) => {
    req.reply({
      statusCode: 200,
      headers: { 'content-range': '0-0/1' },
      body: [
        {
          id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          name: 'Arecofix',
          cuit: '30-71649281-9',
          tax_id: '30-71649281-9',
          vat_condition: 'IVA Responsable Inscripto',
          iibb: '30-71649281-9 (Conv. Multilateral)',
          activity_start_date: '01/03/2021',
          point_of_sale: '00004',
          location: 'Av. San Martín 450, San Antonio de Areco',
          address: 'Av. San Martín 450, San Antonio de Areco',
        },
      ],
    });
  }).as('getTenants');

  cy.intercept('GET', '**/rest/v1/branches*', (req) => {
    req.reply({
      statusCode: 200,
      headers: { 'content-range': '0-0/1' },
      body: [
        {
          id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
          name: 'Casa Central',
          is_active: true,
          point_of_sale: '00004',
        },
      ],
    });
  }).as('getBranches');
}
