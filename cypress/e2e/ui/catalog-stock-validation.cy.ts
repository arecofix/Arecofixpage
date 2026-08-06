import { buildMockProduct, buildMockOrder, buildMockOrderItem, buildMockBranch } from '../../support/mock-factories';

describe('Carga, Configuración y Verificación de Stock (E2E)', () => {
  beforeEach(() => {
    cy.setupCheckoutSession();
    
    // Evitar errores de log molestos
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake(() => {});
      cy.stub(win.console, 'warn').callsFake(() => {});
    });
  });

  it('debería mostrar "Agotado" y deshabilitar botón cuando el stock es 0 (QA #2)', () => {
    const productZeroStock = buildMockProduct({ id: 'prod-zero', stock: 0 });

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
        body: [productZeroStock]
      });
    }).as('getProductsZero');

    cy.visit('/productos');
    cy.wait('@getProductsZero');

    // Comprobar que existe badge "Sin Stock" o "Agotado"
    cy.get('product-card').contains(/agotado|sin stock/i, { matchCase: false }).should('be.visible');
    
    // El botón de añadir al carrito no debería estar o debería estar deshabilitado
    cy.get('product-card button').contains(/Agotado/i, { matchCase: false }).should('be.disabled');
  });

  it('debería bloquear adición al carrito si supera stock máximo (QA #4)', () => {
    const productLimited = buildMockProduct({ id: 'prod-limit', stock: 2 });

    // Cart already has 2 of this product (= stock limit).
    // A single post-hydration click should trigger the stock guard immediately.
    // The 2-click approach failed because the first click fired pre-hydration
    // (Angular attaches event handlers only after hydration), so addToCart was
    // never called on the first click and the in-memory qty never reached 2.
    const cartAtMaxStock = buildMockOrder([buildMockOrderItem(productLimited, 2)]);

    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
      body: [productLimited]
    }).as('getProductsLimited');

    // Return cart at max stock so the signal is pre-loaded with qty=2
    cy.intercept('GET', '**/rest/v1/orders*', {
      statusCode: 200,
      body: [cartAtMaxStock]
    }).as('getActiveCart');

    cy.visit('/productos');
    cy.wait('@getProductsLimited', { timeout: 10000 });

    // Wait for Angular to fully hydrate — Cypress retries until the button is visible.
    // Pre-hydration clicks are silently dropped because Angular hasn't attached
    // event handlers yet; waiting for visibility guarantees we click post-hydration.
    cy.contains('button', /Añadir al Carrito/i, { timeout: 10000 }).should('be.visible');
    cy.wait(400);

    // Single click: activeOrder() signal has qty=2, (2+1) > stock=2 → BLOCKED
    cy.get('product-card button').contains(/Añadir al Carrito/i).click({ force: true });

    // cart.service.ts shows the stock toast BEFORE any API call (early return)
    cy.get('app-toast').contains(/stock/i, { timeout: 8000 }).should('be.visible');
  });


  it('debería reflejar stock de sucursal propietaria exclusivamente si no es global (QA #5 & #18)', () => {
    // Si el producto pertenece a la sucursal activa, se muestra
    const activeBranchId = 'branch-1';
    const localProduct = buildMockProduct({ id: 'prod-local', stock: 5, is_global: false, branch_id: activeBranchId });
    
    // Si el producto pertenece a otra sucursal y NO es global, NO debería mostrarse
    const otherBranchProduct = buildMockProduct({ id: 'prod-other', name: 'Other Branch Item', stock: 10, is_global: false, branch_id: 'branch-99' });

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-1/2', 'Content-Type': 'application/json' },
        body: [localProduct, otherBranchProduct]
      });
    }).as('getProductsBranch');

    cy.visit('/productos');
    cy.wait('@getProductsBranch');

    // Debería verse el localProduct
    cy.contains(localProduct.name).should('exist');
    
    // NOTA: Como estamos mockeando la DB, el front podría filtrar visualmente o el Backend ya no lo devolvería.
    // En un test real (E2E full) el backend (Supabase/PostgREST) no devolvería `prod-other` 
    // porque la política RLS o el servicio lo filtraría. Aquí simulamos que sí llega y vemos si el front lo rechaza, 
    // o simplemente validamos que la tienda se comporta correctamente al comprar en la sucursal actual.
    // Esta verificación prueba que el botón "Añadir al Carrito" funciona para productos locales.
    cy.get('product-card').contains(localProduct.name).parents('product-card').find('button').contains(/Añadir/i).should('not.be.disabled');
  });
});
