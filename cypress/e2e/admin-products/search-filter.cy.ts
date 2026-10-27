import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Búsqueda y Filtros', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe filtrar productos en la tabla según el texto buscado', () => {
    cy.get('input[placeholder*="Buscar"]').type('Batería');
    cy.get('tbody').should('contain.text', 'Batería Original iPhone 12');
  });

  it('Debe filtrar productos por categoría', () => {
    cy.get('select').first().select('Repuestos');
    cy.get('tbody').should('contain.text', 'Módulo Pantalla iPhone 13 OLED');
  });

  it('Debe filtrar por stock bajo / sin stock', () => {
    // Select Low Stock in inventory select dropdown
    cy.get('select').eq(2).select('filter_low_stock');
    cy.get('tbody tr').should('have.length.at.least', 1);

    // Select Out of Stock
    cy.get('select').eq(2).select('filter_out_of_stock');
    cy.get('tbody tr').should('have.length.at.least', 1);
  });
});
