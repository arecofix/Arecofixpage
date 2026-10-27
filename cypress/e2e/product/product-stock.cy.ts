import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Product — Comportamiento y Validación de Stock', () => {
  it('debería mostrar "Sin Stock" y deshabilitar el botón si stock es 0', () => {
    cy.setupCheckoutSession();
    const outOfStock = buildMockProduct({
      id: 'prod-out',
      name: 'Módulo Sin Stock',
      slug: 'modulo-sin-stock',
      price: 50000,
      stock: 0,
    });

    setupCartAndCatalogMocks({
      products: [outOfStock],
    });

    cy.visit(`/productos/detalle/${outOfStock.slug}`);
    cy.contains('Sin Stock').should('be.visible');
    cy.get('[data-cy="add-to-cart"]').should('be.disabled').and('contain.text', 'SIN STOCK DISPONIBLE');
  });

  it('debería mostrar indicador en verde cuando hay stock', () => {
    cy.setupCheckoutSession();
    const inStock = buildMockProduct({
      id: 'prod-in',
      name: 'Módulo En Stock',
      slug: 'modulo-en-stock',
      price: 50000,
      stock: 5,
    });

    setupCartAndCatalogMocks({
      products: [inStock],
    });

    cy.visit(`/productos/detalle/${inStock.slug}`);
    cy.contains('Stock (5)').closest('div').should('have.class', 'text-green-600');
  });
});
