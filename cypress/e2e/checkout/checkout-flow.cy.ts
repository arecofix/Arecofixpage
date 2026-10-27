import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Checkout — Flujo Completo de Compra', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 10000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1500,
    });
  });

  it('debería completar el checkout exitoso con datos válidos y método en efectivo/digital', () => {
    cy.visit('/checkout');

    // Fill form
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear().type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear().type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear().type('1234');
    cy.get('[data-cy="checkout-city"]').clear().type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');

    // Continue to payment
    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();

    // Select digital transfer payment method
    cy.get('[data-cy="method-digital"]').check({ force: true });

    // Confirm order
    cy.get('[data-cy="confirm-order"]').should('not.be.disabled').click();

    // Assert order confirmation screen
    cy.get('[data-cy="order-confirmed"]', { timeout: 10000 }).should('be.visible');
    cy.contains('¡Pedido Registrado!').should('be.visible');
  });

  it('debería calcular el total correctamente (subtotal + envío)', () => {
    cy.visit('/checkout');
    cy.contains('10.000,00').should('be.visible');

    // Enter valid local 4-digit postal code (1727 Marcos Paz) to calculate shipping
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');
    cy.contains('12.500,00', { timeout: 8000 }).should('be.visible');
  });
});
