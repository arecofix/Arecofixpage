import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Errors — Validación de Datos Inválidos en Checkout', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 10,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
    });
  });

  it('debería rechazar un email con formato inválido y marcar el campo en error', () => {
    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('sin-arroba-ni-punto');
    cy.get('[data-cy="checkout-phone"]').clear().type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear().type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear().type('1234');
    cy.get('[data-cy="checkout-city"]').clear().type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.contains('Email inválido').should('be.visible');
    // Step should NOT advance to payment
    cy.get('[data-cy="method-digital"]').should('not.exist');
  });

  it('debería exigir teléfono y rechazar campo vacío', () => {
    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear().blur();
    cy.get('[data-cy="btn-go-payment"]').click();
    cy.contains('Teléfono requerido').should('be.visible');
    cy.get('[data-cy="method-digital"]').should('not.exist');
  });

  it('debería requerir calle y número obligatoriamente', () => {
    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear().type('1122334455');
    // Street and number empty
    cy.get('[data-cy="checkout-street"]').clear();
    cy.get('[data-cy="checkout-number"]').clear();
    cy.get('[data-cy="checkout-city"]').clear().type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.contains(/campos requeridos/i).should('be.visible');
    cy.get('[data-cy="method-digital"]').should('not.exist');
  });
});
