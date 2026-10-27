import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Checkout — Validación y Descuento de Stock', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 10000,
    stock: 2,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 2 }],
      shippingCost: 0,
    });
  });

  it('debería bloquear la confirmación de la orden si el stock quedó insuficiente', () => {
    // Simulate stock suddenly dropped to 1 in backend
    const depletedProduct = { ...p1, stock: 1 };
    setupCartAndCatalogMocks({
      products: [depletedProduct],
      cartItems: [{ product: depletedProduct, quantity: 2 }],
      shippingCost: 0,
    });

    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear().type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear().type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear().type('1234');
    cy.get('[data-cy="checkout-city"]').clear().type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.get('[data-cy="method-digital"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.contains(/Stock insuficiente/i).should('be.visible');
  });
});
