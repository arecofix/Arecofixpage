import { setupCartAndCatalogMocks } from '../../support/helpers/cart.helper';
import { buildMockProduct } from '../../support/mock-factories';

describe('Errors — Manejo de Usuario Sin Sesión (Guest Flow)', () => {
  const p1 = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 10,
  });

  beforeEach(() => {
    // Clear all auth sessions
    cy.clearLocalStorage();
    cy.clearCookies();
    setupCartAndCatalogMocks({
      products: [p1],
    });
  });

  it('debería permitir a un usuario anónimo agregar al carrito generando session_id', () => {
    cy.visit(`/productos/detalle/${p1.slug}`);
    cy.get('[data-cy="add-to-cart"]').click();

    cy.get('app-toast', { timeout: 8000 })
      .should('be.visible')
      .and('contain.text', 'Agregaste un producto al carrito');

    // Should create cart_session_id in localStorage
    cy.window().then((win) => {
      const sessionId = win.localStorage.getItem('cart_session_id');
      expect(sessionId).to.be.a('string');
      expect(sessionId!.length).to.be.greaterThan(10);
    });
  });
});
