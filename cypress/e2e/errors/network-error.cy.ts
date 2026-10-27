import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Errors — Fallos de Red y Errores Transitorios (Network Error)', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 10,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
  });

  it('debería mostrar mensaje de error amigable si falla la red al agregar al carrito', () => {
    setupCartAndCatalogMocks({
      products: [p1],
    });

    // Intercept order creation with network failure
    cy.intercept('POST', '**/rest/v1/orders*', { forceNetworkError: true }).as('networkFailOrder');

    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('[data-cy="add-to-cart"]').click();

    cy.get('app-toast', { timeout: 8000 })
      .should('be.visible')
      .and('contain.text', 'Error');
  });

  it('debería recuperarse y permitir agregar al carrito cuando la red se restablece', () => {
    setupCartAndCatalogMocks({
      products: [p1],
    });

    // Fail first request, succeed subsequent requests
    let callCount = 0;
    cy.intercept('POST', '**/rest/v1/orders*', (req) => {
      callCount++;
      if (callCount === 1) {
        req.destroy();
      } else {
        req.reply({
          statusCode: 201,
          body: {
            id: 'ord-retry-1',
            status: 'cart',
            total: 149000,
            tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          },
        });
      }
    }).as('retryOrder');

    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('[data-cy="add-to-cart"]').click();

    // First attempt shows network error
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    // Second click after network recovers
    cy.get('[data-cy="add-to-cart"]').click();
    cy.get('app-toast', { timeout: 8000 })
      .should('be.visible')
      .and('contain.text', 'Agregaste un producto al carrito');
  });

  it('debería mostrar mensaje de error si falla la confirmación del checkout por error 500 del servidor', () => {
    setupCartAndCatalogMocks({
      products: [p1],
      cartItems: [{ product: p1, quantity: 1 }],
      failOrderCreation: true,
    });

    cy.visit('/checkout');
    cy.get('[data-cy="checkout-name"]').clear().type('Carlos Lopez');
    cy.get('[data-cy="checkout-email"]').clear().type('carlos@ejemplo.com');
    cy.get('[data-cy="checkout-phone"]').clear().type('1122334455');
    cy.get('[data-cy="checkout-street"]').clear().type('Av. San Martin');
    cy.get('[data-cy="checkout-number"]').clear().type('1234');
    cy.get('[data-cy="checkout-city"]').clear().type('Marcos Paz');
    cy.get('[data-cy="checkout-postal-code"]').clear().type('1727');

    cy.get('[data-cy="btn-go-payment"]').click();
    cy.get('[data-cy="method-digital"]').check({ force: true });
    cy.get('[data-cy="confirm-order"]').click();

    cy.contains(/Error al procesar tu reserva/i, { timeout: 8000 }).should('be.visible');
    // Button should be re-enabled so user can retry
    cy.get('[data-cy="confirm-order"]').should('not.be.disabled');
  });
});
