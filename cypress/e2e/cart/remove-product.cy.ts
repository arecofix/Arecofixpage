import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Cart — Eliminar Productos del Carrito', () => {
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
      cartItems: [{ product: p1, quantity: 1 }],
    });
  });

  it('debería eliminar el producto del carrito al presionar el botón de eliminar', () => {
    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');

    // Click trash / remove button
    cy.get('[data-cy="cart-remove-item"]').first().click({ force: true });

    // Should indicate empty cart or product gone
    cy.contains(/Tu carrito está vacío/i, { timeout: 8000 }).should('be.visible');
  });

  it('debería decrementar cantidad a 0 y quitar el producto del carrito', () => {
    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');

    // Click minus button
    cy.get('[data-cy="cart-decrease-qty"]').first().click({ force: true });
    cy.contains(/Tu carrito está vacío/i, { timeout: 8000 }).should('be.visible');
  });
});
