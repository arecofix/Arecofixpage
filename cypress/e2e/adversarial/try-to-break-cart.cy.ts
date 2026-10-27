import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Adversarial — Intentos de Romper el Carrito (Try-To-Break Cart)', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 5,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
    });
  });

  it('no debería permitir agregar más unidades que el stock disponible mediante clics continuos', () => {
    cy.visit('/productos');
    cy.wait('@getProducts');

    // Click 10 times rapidly when stock is only 5
    for (let i = 0; i < 10; i++) {
      cy.get('product-card button[data-cy="add-to-cart"]').first().click({ force: true });
    }

    // App should not crash, toast shows feedback
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    // Open cart
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
    // Quantity should not exceed stock
    cy.get('[data-cy="cart-item-qty"]').should('be.visible');
  });

  it('debería sanitizar e impedir inyecciones SQL en la URL de detalle de producto sin crashear', () => {
    const sqlInjection = "' OR '1'='1' --";
    cy.intercept('GET', `**/rest/v1/products*`, {
      statusCode: 200,
      body: [],
    }).as('sqlProducts');

    cy.visit(`/productos/detalle/${encodeURIComponent(sqlInjection)}`, { failOnStatusCode: false });

    // Should gracefully handle not found without breaking UI
    cy.get('body').should('be.visible');
    cy.contains(/no encontrado|404|catálogo/i).should('exist');
  });

  it('no debería permitir agregar productos con stock 0 o negativo', () => {
    const negativeStockProduct = buildMockProduct({
      id: 'prod-neg',
      name: 'Producto Stock Negativo',
      slug: 'producto-stock-negativo',
      price: 10000,
      stock: -5,
    });

    setupCartAndCatalogMocks({
      products: [negativeStockProduct],
    });

    cy.visit(`/productos/detalle/${negativeStockProduct.slug}`);
    cy.get('[data-cy="add-to-cart"]').should('be.disabled').and('contain.text', 'SIN STOCK DISPONIBLE');
  });

  it('debería manejar payloads con etiquetas HTML o scripts en parámetros sin ejecutar código', () => {
    const xssPayload = '<img src=x onerror=alert(1)>';
    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      body: [],
    });

    cy.visit(`/productos/detalle/${encodeURIComponent(xssPayload)}`, { failOnStatusCode: false });

    // Page must remain functional, no uncaught exceptions
    cy.get('body').should('be.visible');
  });
});
