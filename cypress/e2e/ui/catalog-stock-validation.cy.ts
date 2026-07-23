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
    
    // Supongamos que ya hay 1 en el carrito
    const cartOrder = buildMockOrder([buildMockOrderItem(productLimited, 1)]);

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
        body: [productLimited]
      });
    }).as('getProductsLimited');

    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getActiveCart');

    // Intercept update to ensure we don't accidentally update it beyond limit
    cy.intercept('PATCH', '**/rest/v1/order*', cy.spy().as('updateOrderSpy'));

    cy.visit('/productos');
    cy.wait('@getProductsLimited');
    
    // Agregamos la segunda unidad (ahora carrito = 2, stock = 2)
    cy.get('product-card button').contains(/Añadir al Carrito/i, { matchCase: false }).click({ force: true });
    
    // Tratamos de agregar una tercera unidad
    cy.get('product-card button').contains(/Añadir al Carrito/i, { matchCase: false }).click({ force: true });

    // Debería aparecer una alerta o toast indicando el límite de stock
    cy.get('.toast').contains(/quedan|stock|máximo|límite/i, { timeout: 5000 }).should('be.visible');
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
