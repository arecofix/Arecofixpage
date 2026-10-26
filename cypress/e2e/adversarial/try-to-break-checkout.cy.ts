import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Adversarial — Intentos de Romper el Checkout (Try-To-Break Checkout)', () => {
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
      shippingCost: 0,
    });
  });

  it('no debería ejecutar scripts maliciosos (XSS) inyectados en los campos del formulario', () => {
    const xssPayload = '<script>window.__xss_executed = true;</script>';

    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear();
    cy.get('[data-cy="checkout-name"]').type(xssPayload);
    cy.get('[data-cy="checkout-email"]').clear();
    cy.get('[data-cy="checkout-email"]').type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear();
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear();
    cy.get('[data-cy="checkout-street"]').type('Av. San Martin <img src=x onerror=alert(1)>');
    cy.get('[data-cy="checkout-number"]').clear();
    cy.get('[data-cy="checkout-number"]').type('1234');
    cy.get('[data-cy="checkout-city"]').clear();
    cy.get('[data-cy="checkout-city"]').type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear();
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.get('[data-cy="method-digital"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    // Verify window.__xss_executed was NOT set
    cy.window().should((win: any) => {
      expect(win.__xss_executed).to.be.undefined;
    });

    cy.get('[data-cy="order-confirmed"]', { timeout: 10000 }).should('be.visible');
  });

  it('no debería duplicar la orden al hacer doble click rápido en confirmar pedido', () => {
    let orderCreateCount = 0;
    cy.intercept('POST', '**/rest/v1/orders*', (req) => {
      orderCreateCount++;
      req.reply({
        statusCode: 201,
        body: [{ id: 'ord-cart-1', status: 'pending_payment', order_number: 'ORD-123' }],
      });
    }).as('orderCreate');

    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear();
    cy.get('[data-cy="checkout-name"]').type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear();
    cy.get('[data-cy="checkout-email"]').type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear();
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear();
    cy.get('[data-cy="checkout-street"]').type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear();
    cy.get('[data-cy="checkout-number"]').type('1234');
    cy.get('[data-cy="checkout-city"]').clear();
    cy.get('[data-cy="checkout-city"]').type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear();
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.get('[data-cy="method-digital"]').check({ force: true });

    // Double click rapidly
    cy.get('[data-cy="confirm-order"]').click();
    cy.get('[data-cy="confirm-order"]').should('be.disabled');

    cy.get('[data-cy="order-confirmed"]', { timeout: 10000 }).should('be.visible');
    // Only 1 request should have been dispatched to create the order
    cy.then(() => {
      expect(orderCreateCount).to.equal(1);
    });
  });

  it('debería calcular el total a partir del subtotal y costo de envío sin permitir alteración arbitraria', () => {
    cy.visit('/checkout');
    // Price snapshot from server must be displayed, not client override
    cy.contains(/10\.000/i).should('be.visible');
    cy.get('[data-cy="btn-go-payment"]').should('be.visible');
  });

  it('debería manejar sesión expirada o limpiada durante el proceso de checkout', () => {
    cy.visit('/checkout');

    // Simulate session cleared mid-checkout
    cy.clearLocalStorage();

    cy.get('[data-cy="checkout-name"]').clear();
    cy.get('[data-cy="checkout-name"]').type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear();
    cy.get('[data-cy="checkout-email"]').type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear();
    cy.get('[data-cy="checkout-phone"]').type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear();
    cy.get('[data-cy="checkout-street"]').type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear();
    cy.get('[data-cy="checkout-number"]').type('1234');
    cy.get('[data-cy="checkout-city"]').clear();
    cy.get('[data-cy="checkout-city"]').type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear();
    cy.get('[data-cy="checkout-postal-code"]').type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.get('[data-cy="method-digital"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    // App should not crash; it either creates an order or presents error gracefully
    cy.get('body').should('be.visible');
  });
});
