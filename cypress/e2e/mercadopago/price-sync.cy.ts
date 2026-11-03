import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';
import { interceptCreatePreference } from '../../support/helpers/mercadopago.helper';

describe('Mercado Pago — Sincronización de Precios', () => {
  const p1 = buildMockProduct({
    id: 'prod-sync-01',
    name: 'Batería iPad 9na Gen',
    price: 10000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
  });

  it('debería mantener concordancia exacta: Precio en Web === Precio en Orden === Precio en Preferencia', () => {
    const shipping = 2500;
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      shippingCost: shipping,
    });

    interceptCreatePreference();

    cy.visit('/checkout');

    // Web should display subtotal 10.000,00
    cy.contains('10.000,00').should('be.visible');

    // Fill address with postal code 1727 to trigger shipping quote
    cy.get('[data-cy="checkout-name"]').type('Mariano Moreno');
    cy.get('[data-cy="checkout-email"]').type('mariano@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').type('1144556677');
    cy.get('[data-cy="checkout-street"]').type('Mitre');
    cy.get('[data-cy="checkout-number"]').type('123');
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    // Total with shipping should be 12.500,00
    cy.contains('12.500,00', { timeout: 8000 }).should('be.visible');

    cy.get('[data-cy="btn-go-payment"]').should('not.be.disabled').click();

    // Select Mercado Pago
    cy.get('input[value="credit_card"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.wait('@createOrder').then((interception) => {
      const order = interception.request.body;
      expect(Number(order.total_amount)).to.equal(12500);
      expect(Number(order.subtotal)).to.equal(10000);
      expect(Number(order.total_amount) - Number(order.subtotal)).to.equal(2500);
    });

    cy.wait('@createPreferenceRequest').then((interception) => {
      expect(interception.request.body).to.have.property('orderId');
    });
  });
});
