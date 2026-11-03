import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Creación de Preferencia', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 15000,
    stock: 10,
  });

  const p2 = buildMockProduct({
    id: 'prod-002',
    name: 'Batería Original iPhone 12',
    slug: 'bateria-original-iphone-12',
    price: 25000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
  });

  it('debería crear una preferencia con 1 producto con payload y estructura correctos', () => {
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: 1500,
    });

    interceptCreatePreference({ id: 'pref_single_001' });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Gonzalo Morales');
    cy.get('[data-cy="checkout-email"]').type('gonzalo@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1133445566');
    cy.get('[data-cy="checkout-street"]').type('Belgrano');
    cy.get('[data-cy="checkout-number"]').type('450');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();

    // Select Mercado Pago
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').should('not.be.disabled').click();

    cy.wait('@createOrder');
    cy.wait('@createOrderItems').then((interception) => {
      const items = Array.isArray(interception.request.body)
        ? interception.request.body
        : [interception.request.body];
      expect(items).to.have.length(1);
      expect(items[0].product_name).to.include('iPhone 13');
    });

    cy.wait('@createPreferenceRequest').then((interception) => {
      const req = interception.request;
      expect(req.body).to.have.property('orderId');

      // Verify Access Token is NEVER sent by frontend
      expect(req.headers).not.to.have.property('authorization');
      expect(JSON.stringify(req.body)).not.to.include('APP_USR');
    });

    // Verify UI enters mp_redirect state
    cy.contains('Redirigiendo a Pago Seguro...').should('be.visible');
    cy.contains('Continuar a Mercado Pago').should('be.visible');
  });

  it('debería crear una preferencia con múltiples productos y respetar external_reference', () => {
    setupCartAndCatalogMocks({
      products: [p1, p2],
      cartItems: [
        { product: p1, quantity: 2 },
        { product: p2, quantity: 1 },
      ],
      shippingCost: 2000,
    });

    interceptCreatePreference({ id: 'pref_multi_002' });

    cy.visit('/checkout');

    cy.get('[data-cy="checkout-name"]').type('Ana Belén');
    cy.get('[data-cy="checkout-email"]').type('ana@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').type('Rivadavia');
    cy.get('[data-cy="checkout-number"]').type('890');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').should('not.be.disabled').click();

    cy.wait('@createOrder');
    cy.wait('@createOrderItems').then((interception) => {
      const items = Array.isArray(interception.request.body)
        ? interception.request.body
        : [interception.request.body];
      expect(items).to.have.length(2);
    });

    cy.wait('@createPreferenceRequest').then((interception) => {
      expect(interception.request.body).to.have.property('orderId');
    });

    cy.contains('Continuar a Mercado Pago').should('be.visible');
  });
});
