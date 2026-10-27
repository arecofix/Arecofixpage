import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Flujo Completo End-to-End', () => {
  const p1 = buildMockProduct({
    id: 'prod-e2e-01',
    name: 'Módulo Pantalla Moto G20',
    price: 22000,
    stock: 7,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1800,
    });
  });

  it('debería completar todo el ciclo: selección de producto, checkout, Mercado Pago y confirmación', () => {
    interceptCreatePreference({
      id: 'pref_e2e_full_success',
      initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_e2e_full_success',
    });

    cy.visit('/checkout');

    // 1. Fill shipping form
    cy.get('[data-cy="checkout-name"]').type('Valeria Rossi');
    cy.get('[data-cy="checkout-email"]').type('valeria@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').type('Avellaneda');
    cy.get('[data-cy="checkout-number"]').type('300');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();

    // 2. Select Mercado Pago
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    // 3. Verify Preference Call
    cy.wait('@createPreferenceRequest');
    cy.contains('Redirigiendo a Pago Seguro...').should('be.visible');

    // 4. Simulate user return from Mercado Pago with approved status
    cy.visit('/checkout/success?collection_id=999111222&collection_status=approved&payment_id=999111222&status=approved&external_reference=ord-e2e-01');

    // 5. Assert final state
    cy.get('[data-cy="payment-approved-title"]').should('be.visible');
    cy.contains('¡Pago Aprobado!').should('be.visible');
    cy.contains('999111222').should('be.visible');
    cy.contains('Acreditado').should('be.visible');
  });
});
