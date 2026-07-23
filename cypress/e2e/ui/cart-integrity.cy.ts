import { buildMockProduct, buildMockOrder, buildMockOrderItem } from '../../support/mock-factories';

describe('Carrito de Compras e Integridad de Datos (E2E)', () => {
  const productA = buildMockProduct({ id: 'prod-a', price: 1000, name: 'Producto A' });
  const productB = buildMockProduct({ id: 'prod-b', price: 2500, name: 'Producto B' });

  beforeEach(() => {
    cy.setupCheckoutSession();
    
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake(() => {});
      cy.stub(win.console, 'warn').callsFake(() => {});
    });

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-1/2', 'Content-Type': 'application/json' },
        body: [productA, productB]
      });
    }).as('getProducts');

    // Mocks genéricos del carrito para empezar vacío
    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: null // Vacío inicialmente
    }).as('getEmptyCart');
    
    cy.intercept('POST', '**/rest/v1/order*', {
      statusCode: 201,
      body: [buildMockOrder([buildMockOrderItem(productA, 1)])]
    }).as('createOrder');

    cy.intercept('POST', '**/rest/v1/order_items*', { statusCode: 201, body: [] }).as('saveOrderItems');
    cy.intercept('PATCH', '**/rest/v1/order*', { statusCode: 200, body: [buildMockOrder()] }).as('updateOrder');
  });

  it('debería calcular el subtotal correctamente y permitir vaciar el carrito (QA #26-36)', () => {
    cy.visit('/productos');
    cy.wait('@getProducts');
    
    // Add product A
    cy.get('product-card').contains('Producto A').parents('product-card').find('button').contains(/Añadir/i).click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('exist');
    
    // Al abrir el carrito
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    
    // Debería verse el producto A en el sidebar del carrito
    cy.get('[aria-label="Carrito de compras"]').contains('Producto A', { timeout: 5000 }).should('be.visible');
    
    // Simular que ahora el GET devuelve el carrito con 2 ítems para probar matemáticas
    const cartOrder = buildMockOrder([
      buildMockOrderItem(productA, 2),
      buildMockOrderItem(productB, 1)
    ]);

    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getPopulatedCart');

    // Recargar o ir al checkout para forzar la lectura del backend
    cy.visit('/checkout');
    cy.wait('@getPopulatedCart');

    // Subtotal esperado: (1000 * 2) + (2500 * 1) = 4500. Aceptamos coma o punto por el locale.
    cy.get('[aria-label="Carrito de compras"]').contains(/4[.,]500/i).should('exist');

    // Simular Vaciar Carrito (DELETE)
    cy.intercept('DELETE', '**/rest/v1/order*', { statusCode: 204 }).as('deleteOrder');
    
    // Suponiendo que hay un botón de volver a la tienda / carrito
    // Pero lo forzamos navegando al carrito otra vez
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('button').contains(/vaciar|limpiar/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@deleteOrder');
    
    // Debería mostrar mensaje de carrito vacío
    cy.contains(/carrito.*vacío/i, { matchCase: false }).should('exist');
  });

  it('debería rechazar un cupón inválido o expirado (QA #38)', () => {
    const cartOrder = buildMockOrder([buildMockOrderItem(productA, 1)]);
    
    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getCartForCoupon');

    cy.visit('/checkout');
    cy.wait('@getCartForCoupon');

    // Simular que existe un campo de cupón (usualmente bajo el resumen)
    cy.get('input#coupon-code').type('INVALIDO', { force: true });
    cy.get('button').contains(/aplicar/i).click({ force: true });
    
    // Como no tenemos el mock exacto de cupones, verificamos el comportamiento esperado del UI
    // (Por ejemplo, una notificación de error o el mismo campo mostrando error)
    cy.get('app-toast').contains(/inválido|vencido|no existe/i, { timeout: 5000 }).should('be.visible');
  });
});
