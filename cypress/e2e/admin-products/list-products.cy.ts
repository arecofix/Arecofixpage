import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Gestión de Productos: Listar', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');
  });

  it('Debe mostrar la tabla con la lista de productos cargados', () => {
    cy.get('h1, h2, h3').should('contain.text', 'Productos');
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 2);
    cy.get('tbody').should('contain.text', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('tbody').should('contain.text', 'Batería Original iPhone 12');
  });

  it('Debe mostrar precios, stock y badges de estado', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('td').should('contain.text', '$');
      cy.get('.badge, span').should('be.visible');
    });
  });
});
