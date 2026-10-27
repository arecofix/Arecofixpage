import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Checkout Pro Redirect y Retorno', () => {
  const p1 = buildMockProduct({
    id: 'prod-pro-01',
    name: 'Cargador Rápido 20W USB-C',
    price: 18000,
    stock: 20,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1500,
    });
  });

  it('debería generar init_point y permitir al usuario continuar a Mercado Pago', () => {
    interceptCreatePreference({
      initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_pro_test',
    });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Lucas Silva');
    cy.get('[data-cy="checkout-email"]').type('lucas@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1133334444');
    cy.get('[data-cy="checkout-street"]').type('Sarmiento');
    cy.get('[data-cy="checkout-number"]').type('100');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.contains('Redirigiendo a Pago Seguro...').should('be.visible');
    cy.get('a')
      .contains('Continuar a Mercado Pago')
      .should('have.attr', 'href')
      .and('include', 'mercadopago.com.ar');
  });

  it('debería procesar retorno de Mercado Pago con status=approved y mostrar pantalla de éxito', () => {
    cy.visit('/checkout/success?collection_id=123456789&collection_status=approved&payment_id=123456789&status=approved&external_reference=ord-101');

    cy.get('[data-cy="payment-approved-title"]').should('be.visible');
    cy.contains('¡Pago Aprobado!').should('be.visible');
    cy.contains('123456789').should('be.visible');
    cy.contains('Acreditado').should('be.visible');
  });

  it('debería procesar retorno de Mercado Pago con status=rejected y permitir reintentar', () => {
    cy.visit('/checkout/failure?collection_status=rejected&status=rejected&external_reference=ord-101');

    cy.get('[data-cy="payment-failure-title"]').should('be.visible');
    cy.contains('No pudimos procesar tu pago').should('be.visible');

    // Click retry button
    cy.get('[data-cy="retry-payment-btn"]').click();
    cy.contains('¿Cómo querés pagar?').should('be.visible');
  });

  it('debería procesar retorno de Mercado Pago con status=pending y mostrar aviso en revisión', () => {
    cy.visit('/checkout/pending?collection_status=pending&status=pending&external_reference=ord-101');

    cy.get('[data-cy="payment-pending-title"]').should('be.visible');
    cy.contains('Pago en Revisión').should('be.visible');
  });
});
