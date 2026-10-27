import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Cart — Persistencia del Carrito', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 15000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 2 }],
    });
  });

  it('debería mantener los items del carrito tras recargar la página', () => {
    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');

    // Reload page
    cy.reload();
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
  });

  it('debería persistir el carrito al cambiar de página en el catálogo', () => {
    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');

    // Navigate to product detail
    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
  });
});
