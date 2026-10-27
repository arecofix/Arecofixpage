import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Errors — Manejo Específico de Errores de Permisos / RLS', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 10,
  });

  it('debería mostrar mensaje amigable y claro si la base de datos rechaza con 42501 (RLS)', () => {
    cy.setupCheckoutSession();
    setupCartAndCatalogMocks({
      products: [p1],
    });

    // Force RLS error on orders creation
    cy.intercept('POST', '**/rest/v1/orders*', {
      statusCode: 401,
      body: {
        code: '42501',
        details: null,
        hint: null,
        message: 'new row violates row-level security policy for table "orders"',
      },
    }).as('rlsOrders');

    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('[data-cy="add-to-cart"]').click();

    cy.get('app-toast', { timeout: 8000 })
      .should('be.visible')
      .and('contain.text', 'permisos');
  });
});
