import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Adversarial — Stock Exhaustion Prevention', () => {
  const p1 = buildMockProduct({
    id: 'prod-depleted-01',
    name: 'Cámara Trasera iPhone 14 Pro Max',
    price: 85000,
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

  it('debería impedir el pago si el stock se agotó antes de crear la preferencia', () => {
    interceptCreatePreference({
      statusCode: 400,
      bodyOverride: {
        success: false,
        error: 'El producto no tiene stock disponible.',
      },
    });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Martín Bossi');
    cy.get('[data-cy="checkout-email"]').type('martin@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').type('Independencia');
    cy.get('[data-cy="checkout-number"]').type('444');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.wait('@createPreferenceRequest');
    cy.contains('Error al procesar tu reserva', { timeout: 8000 }).should('be.visible');
  });
});
