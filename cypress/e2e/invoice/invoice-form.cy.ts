import { setupInvoiceMocks } from '../../support/helpers/invoice.helper';

describe('Formulario de Facturación ARCA (InvoiceFormModalComponent)', () => {
  beforeEach(() => {
    setupInvoiceMocks();
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('#btn-crear-factura-manual').click({ force: true });
    cy.get('#arca-invoice-modal[data-catalog-ready="true"]', { timeout: 15000 }).should('be.visible');
  });

  it('Los datos del emisor se cargan automáticamente', () => {
    cy.get('#arca-invoice-modal').contains('Emisor Sincronizado').should('be.visible');
    cy.get('#arca-invoice-modal').contains(/ARECOFIX/i).should('be.visible');
    cy.get('#arca-invoice-modal').contains('30-71649281-9').should('be.visible');
  });

  it('Todos los campos obligatorios están presentes', () => {
    cy.get('#arca-invoice-modal').contains('Tipo Comprobante *').should('be.visible');
    cy.get('#arca-invoice-modal').contains('Fecha de Emisión *').should('be.visible');
    cy.get('#arca-invoice-modal').contains('Condición de Venta *').should('be.visible');
    cy.get('#arca-invoice-modal').contains(/M[eé]todo|Medio de Pago \*/).should('be.visible');
    cy.get('#arca-invoice-modal').contains('Detalle de Ítems').should('be.visible');
  });

  it('Se pueden agregar múltiples ítems y eliminarlos', () => {
    // Add 4 more items to make 5
    for (let i = 0; i < 4; i++) {
      cy.get('#arca-invoice-modal').contains('button', 'Agregar Fila').click();
    }
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').should('have.length', 5);

    // Delete one item
    cy.get('#arca-invoice-modal .fa-trash-alt').first().click();
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').should('have.length', 4);
  });

  it('Se puede buscar y seleccionar un producto del catálogo', () => {
    cy.get('#arca-invoice-modal').contains('button', 'Catálogo de Productos').click();
    cy.contains('Seleccionar del Catálogo').should('be.visible');

    // Search for iPhone
    cy.get('input[placeholder*="Buscar por nombre"]').type('iPhone');
    cy.contains('Módulo Pantalla iPhone 13 OLED').should('be.visible').click();

    // The item is now filled into the invoice items list
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]')
      .first()
      .should('have.value', 'Módulo Pantalla iPhone 13 OLED');
  });

  it('El tipo de ítem (Mano de obra, Repuesto, Producto, Servicio) se puede seleccionar', () => {
    cy.get('#arca-invoice-modal').find('select').filter(':has(option[value="part"])').first().select('part');
    cy.get('#arca-invoice-modal').contains('Tipo:').should('contain', 'part');
  });

  it('El formulario valida campos obligatorios vacíos y no permite emitir', () => {
    // Empty row with 0 price should disable the emit button
    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
  });

  it('La validación de umbral ARCA funciona para montos mayores a $208.644 sin identificar', () => {
    // Fill single item with price 250000 (> 208644)
    cy.get('#arca-invoice-modal input[placeholder="Descripción del trabajo, repuesto o producto"]').first().type('{selectall}Reparación Completa Mac');
    cy.get('#arca-invoice-modal input[placeholder="Cant."]').first().type('{selectall}1');
    cy.get('#arca-invoice-modal input[placeholder="Precio"]').first().type('{selectall}250000');

    // Customer docNumber is empty and docType is 'Sin Identificar'
    cy.get('#arca-invoice-modal').find('select').filter(':has(option[value="Sin Identificar"])').select('Sin Identificar');
    cy.get('#btn-confirmar-factura-arca').should('be.disabled');
    cy.contains(/Identificación Obligatoria ARCA|supera el límite/).scrollIntoView().should('be.visible');
  });
});
