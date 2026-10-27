import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Manejo de Errores', () => {
  const p1 = buildMockProduct({
    id: 'prod-err-01',
    name: 'Vidrio Templado iPhone 13',
    price: 5000,
    stock: 50,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1000,
    });
  });

  it('debería manejar error 500 de Mercado Pago mostrando un mensaje amigable al usuario', () => {
    interceptCreatePreference({
      statusCode: 500,
      bodyOverride: {
        success: false,
        error: 'El servicio de Mercado Pago se encuentra temporalmente no disponible.',
      },
    });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Facundo Diaz');
    cy.get('[data-cy="checkout-email"]').type('facundo@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1199887766');
    cy.get('[data-cy="checkout-street"]').type('San Juan');
    cy.get('[data-cy="checkout-number"]').type('789');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.wait('@createPreferenceRequest');
    cy.contains('Error al procesar tu reserva', { timeout: 8000 }).should('be.visible');
  });

  it('debería manejar error de red impidiendo que el cliente quede bloqueado en estado de carga', () => {
    cy.intercept('POST', '**/api/mercadopago/create-preference', { forceNetworkError: true }).as('netErr');

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Facundo Diaz');
    cy.get('[data-cy="checkout-email"]').type('facundo@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1199887766');
    cy.get('[data-cy="checkout-street"]').type('San Juan');
    cy.get('[data-cy="checkout-number"]').type('789');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.wait('@netErr');
    cy.contains('Error al procesar tu reserva', { timeout: 8000 }).should('be.visible');
    // Button re-enabled
    cy.get('[data-cy="confirm-order"]').should('not.be.disabled');
  });
});
