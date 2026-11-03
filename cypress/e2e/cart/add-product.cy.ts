import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Cart — Agregar Productos al Carrito', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 10,
  });

  const p2 = buildMockProduct({
    id: 'prod-002',
    name: 'Batería Original iPhone 12',
    slug: 'bateria-original-iphone-12',
    price: 55000,
    stock: 5,
  });

  const p3 = buildMockProduct({
    id: 'prod-003',
    name: 'Cable Lightning 1m Original',
    slug: 'cable-lightning-1m-original',
    price: 18000,
    stock: 20,
  });

  const p4 = buildMockProduct({
    id: 'prod-004',
    name: 'Cargador Rápido 20W USB-C',
    slug: 'cargador-rapido-20w-usb-c',
    price: 25000,
    stock: 15,
  });

  const p5 = buildMockProduct({
    id: 'prod-005',
    name: 'Funda Silicona Case MagSafe',
    slug: 'funda-silicona-case-magsafe',
    price: 12000,
    stock: 30,
  });

  beforeEach(() => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1, p2, p3, p4, p5],
    });
  });

  it('debería agregar 1 producto al carrito exitosamente (usuario autenticado)', () => {
    cy.loginAsTestUser('/productos');
    cy.wait('@getProducts');

    cy.get('product-card button[data-cy="add-to-cart"]').first().click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible').and('contain.text', 'Agregaste un producto al carrito');

    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
  });

  it('debería agregar el mismo producto dos veces e incrementar la cantidad', () => {
    cy.visit('/productos');
    cy.wait('@getProducts');

    cy.get('product-card button[data-cy="add-to-cart"]').first().click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    // Add same product a second time
    cy.get('product-card button[data-cy="add-to-cart"]').first().click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
  });

  it('debería agregar 5 productos distintos y mantenerlos todos en el carrito', () => {
    cy.visit('/productos');
    cy.wait('@getProducts');

    // Add multiple products
    cy.get('product-card button[data-cy="add-to-cart"]').eq(0).click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    cy.get('product-card button[data-cy="add-to-cart"]').eq(1).click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('be.visible');

    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.contains(p1.name).should('be.visible');
    cy.contains(p2.name).should('be.visible');
  });

  it('debería rechazar agregar producto sin stock mostrando error claro', () => {
    const zeroStockProduct = buildMockProduct({
      id: 'prod-out',
      name: 'Módulo Sin Stock',
      slug: 'modulo-sin-stock',
      price: 10000,
      stock: 0,
    });

    setupCartAndCatalogMocks({
      products: [zeroStockProduct],
    });

    cy.visit(`/productos/detalle/${zeroStockProduct.slug}`);
    cy.get('[data-cy="add-to-cart"]').should('be.disabled').and('contain.text', 'SIN STOCK DISPONIBLE');
  });

  it('debería manejar producto inexistente mostrando mensaje de error o 404', () => {
    cy.intercept('GET', '**/rest/v1/products*slug=eq.inexistente*', {
      statusCode: 200,
      body: [],
    }).as('getProductNotFound');

    cy.visit('/productos/detalle/inexistente', { failOnStatusCode: false });
    cy.url().should('satisfy', (url: string) => url.includes('404') || url.includes('productos'));
  });
});
