import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Cart — Actualizar Cantidades en el Carrito', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 10000,
    stock: 10,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
    });
  });

  it('debería reflejar la actualización de cantidad en el carrito', () => {
    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');

    // Click plus button or increase quantity in cart drawer
    cy.get('[data-cy="cart-increase-qty"]').first().click({ force: true });
    cy.get('[data-cy="cart-item-qty"]').should('contain.text', '2');
  });

  it('debería bloquear incremento si se intenta superar el stock máximo', () => {
    const lowStockProduct = buildMockProduct({
      id: 'prod-low',
      name: 'Batería Stock 1',
      slug: 'bateria-stock-1',
      price: 5000,
      stock: 1,
    });

    setupCartAndCatalogMocks({
      products: [lowStockProduct],
      cartItems: [{ product: lowStockProduct, quantity: 1 }],
    });

    cy.visit('/productos');
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('[data-cy="cart-increase-qty"]').first().click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible').and('contain.text', 'stock');
  });
});
