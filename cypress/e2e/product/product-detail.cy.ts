import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Product — Página de Detalle de Producto', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    currency: 'ARS',
    stock: 10,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
    });
  });

  it('debería mostrar el nombre, precio formateado y stock disponible', () => {
    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.contains(p1.name).should('be.visible');
    cy.contains('149.000').should('be.visible');
    cy.contains(`Stock (${p1.stock})`).should('be.visible');
  });

  it('debería tener el botón "AGREGAR AL CARRITO" visible y habilitado cuando hay stock', () => {
    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('[data-cy="add-to-cart"]').should('be.visible').and('not.be.disabled');
  });
});
