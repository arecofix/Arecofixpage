import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Sincronización de Productos y Stock', () => {
  const p1 = buildMockProduct({
    id: 'prod-out-stock',
    name: 'Batería iPad Pro',
    price: 45000,
    stock: 0,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
  });

  it('debería bloquear la creación si el producto está sin stock y notificar claramente', () => {
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1500,
    });

    interceptCreatePreference({
      statusCode: 400,
      bodyOverride: {
        success: false,
        error: 'El producto "Batería iPad Pro" no tiene stock disponible para completar el pedido.',
      },
    });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Rodrigo Paz');
    cy.get('[data-cy="checkout-email"]').type('rodrigo@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').type('Moreno');
    cy.get('[data-cy="checkout-number"]').type('555');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.contains('Stock insuficiente', { timeout: 8000 }).should('be.visible');
  });
});
