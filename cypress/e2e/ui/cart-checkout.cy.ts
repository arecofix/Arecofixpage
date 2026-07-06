/**
 * Cart & Checkout E2E Test
 *
 * Root-cause fixes applied (v3):
 *  1. getActiveCart uses .maybeSingle() -> must reply with null (not []) when cart is empty
 *  2. PATCH /orders response MUST include items[].product for CartService.syncOrderState()
 *  3. Tenant interceptor: single/list distinction fixed
 *  4. Branch interceptor: fetchPaginated expects ARRAY for getWhere() queries,
 *     but singular object for direct .single()/.maybeSingle() lookups.
 *     ALWAYS return [branch] for branch queries (BranchRepository uses getWhere -> array)
 *  5. Products: interceptor must use broader glob to beat the catch-all ordering
 *  6. Wait for branch hydration before visiting /productos (race condition fix)
 */

import {
  buildMockSession,
  buildMockAuthUser,
  buildMockTenant,
  buildMockBranch,
  buildMockProfile,
  buildMockProduct,
  buildMockOrder,
  buildMockOrderItem,
  MOCK_USER_ID,
  MOCK_BRANCH_ID,
} from '../../support/mock-factories';

const session   = buildMockSession();
const authUser  = buildMockAuthUser();
const tenant    = buildMockTenant();
const branch    = buildMockBranch();
const profile   = buildMockProfile();
const product   = buildMockProduct();

const orderItem   = buildMockOrderItem(product, 1);
const emptyOrder  = buildMockOrder([]);
const filledOrder = buildMockOrder([orderItem]);

describe('Cart and Checkout Flow', () => {

  beforeEach(() => {
    // Interceptors registered LAST have highest priority in Cypress.
    // So: register catch-all FIRST, specific handlers AFTER.

    // 1. Catch-all (lowest priority — registered first)
    cy.intercept('**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAll');

    // 2. Auth endpoints
    cy.intercept('GET',  '**/auth/v1/user', { statusCode: 200, body: authUser }).as('getAuthUser');
    cy.intercept('POST', '**/auth/v1/**',   { statusCode: 200, body: session  }).as('authPost');

    // 3. Tenants
    // - slug=eq / custom_domain=eq queries use .single() or .maybeSingle() -> expect object
    // - limit=1 list query -> expects array
    cy.intercept('**/rest/v1/tenants*', (req) => {
      const isSingleLookup = req.url.includes('slug=eq') || req.url.includes('custom_domain=eq');
      req.reply({ statusCode: 200, body: isSingleLookup ? tenant : [tenant] });
    }).as('getTenants');

    // 4. Branches
    // CRITICAL: BranchService.hydrateFromStorage() calls:
    //   branchRepo.getWhere('id', 'branch-1')
    //   -> BaseRepository.fetchPaginated()
    //   -> returns ARRAY (not single object)
    // If we return a plain object instead of [branch], branches[0] is undefined
    // -> setCurrentBranch(null) -> BranchContextService.getBranchId() = null
    // -> useStrictBranchIsolation adds .eq('branch_id', null) to products query
    // -> zero products returned -> no product cards -> no "Añadir al Carrito" button
    //
    // FIX: always return [branch] (array) for branch queries.
    cy.intercept('**/rest/v1/branches*', { statusCode: 200, body: [branch] }).as('getBranches');

    // 5. Profiles
    cy.intercept('**/rest/v1/profiles*', (req) => {
      const isSingleLookup = req.url.includes(`id=eq.${MOCK_USER_ID}`);
      req.reply({ statusCode: 200, body: isSingleLookup ? profile : [profile] });
    }).as('getProfile');

    // 6. Products - MUST be registered after catch-all to take priority
    cy.intercept('GET', '**/rest/v1/products*', { statusCode: 200, body: [product] }).as('getProducts');

    // 7. Categories
    cy.intercept('**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-accesorios', name: 'Accesorios', slug: 'accesorios', deleted_at: null }],
    }).as('getCategories');

    // 8. Orders GET
    // CRITICAL: getActiveCart uses .maybeSingle() which expects:
    //   - null     -> no active cart found (NOT [] or {})
    //   - object   -> active cart found (NOT wrapped in [])
    // Returning [] causes OrderMapper.toDomain() to fail silently.
    cy.intercept('GET', '**/rest/v1/orders*', (req) => {
      const isCartQuery = req.url.includes('status=eq.cart');
      req.reply({ statusCode: 200, body: isCartQuery ? null : [] });
    }).as('getOrders');

    // 9. Order POST (create new empty cart)
    cy.intercept('POST', '**/rest/v1/orders*', { statusCode: 201, body: emptyOrder }).as('createOrder');

    // 10. Order PATCH (update cart items / change status)
    // CRITICAL: The response MUST include items[].product so that
    // CartService.syncOrderState() can rebuild the cartItems signal.
    // Without items[].product, totalItems() stays 0 and badge never shows "1".
    let patchCount = 0;
    cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
      patchCount++;
      const responseBody = patchCount === 1
        ? filledOrder  // first PATCH = addToCart -> return order with embedded items+product
        : { ...filledOrder, status: (req.body as any)?.status ?? 'pending_payment' };
      req.reply({ statusCode: 200, body: responseBody });
    }).as('updateOrder');

    // 11. Order items (insert / delete during addToCart flow)
    cy.intercept('POST',   '**/rest/v1/order_items*', { statusCode: 201, body: [orderItem] }).as('createItems');
    cy.intercept('DELETE', '**/rest/v1/order_items*', { statusCode: 204, body: null }).as('deleteItems');

    // 12. Order DELETE (clearCart after checkout)
    cy.intercept('DELETE', '**/rest/v1/orders*', { statusCode: 204, body: null }).as('deleteOrder');

    // 13. Shipping rates
    cy.intercept('GET', '**/rest/v1/shipping_rates*', {
      statusCode: 200,
      body: [{ provider: 'Correo Argentino', cost: 1500 }],
    }).as('getShipping');

    // 14. Contact message (non-fatal, created after order confirmation)
    cy.intercept('POST', '**/rest/v1/contact_messages*', {
      statusCode: 201, body: [{ id: 'msg-1' }],
    }).as('createMessage');

    // 15. Notifications
    cy.intercept('GET',  '**/rest/v1/notifications*', { statusCode: 200, body: [] }).as('getNotifications');
    cy.intercept('POST', '**/rest/v1/notifications*', { statusCode: 201, body: [] }).as('createNotification');

    // 16. Inject auth + branch into localStorage BEFORE Angular initializes.
    // Use onBeforeLoad so the token is available when Supabase reads it on bootstrap.
    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad(win) {
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('supabase-remember-me', 'true');
        win.localStorage.setItem('arecofix_current_branch_id', MOCK_BRANCH_ID);
        win.localStorage.setItem('arecofix_admin_branch_id', MOCK_BRANCH_ID);
        win.localStorage.setItem('cypress-test', 'true');
      },
    });

    // Wait for branch hydration to complete before navigating to /productos.
    // BranchService.hydrateFromStorage() is async and makes a GET /branches request.
    // If we navigate before it completes, getBranchId() returns null and products query
    // adds .eq('branch_id', null) -> zero results.
    cy.wait('@getBranches', { timeout: 8000 });
  });

  it('debería permitir agregar un producto al carrito y finalizar la compra con transferencia', () => {

    // Step 1: Products page — verify cards render
    cy.visit('/productos');
    cy.wait('@getProducts', { timeout: 8000 });
    cy.get('product-card', { timeout: 8000 }).should('have.length.greaterThan', 0);

    // Step 2: Add to cart
    // "Añadir al Carrito" only appears when ProductStrategicService.canViewPriceAndBuy()
    // returns true -> guaranteed by using a non-technical category (Accesorios).
    cy.get('product-card').first().contains('Añadir al Carrito').click({ force: true });

    // Wait for CartService.addToCart() to finish its PATCH /orders call
    cy.wait('@updateOrder', { timeout: 8000 });

    // Step 3: Verify cart badge
    // totalItems signal is rebuilt from syncOrderState(PATCH response).
    // The PATCH mock returns filledOrder which has items[].product embedded.
    cy.get('.indicator-item', { timeout: 6000 }).should('contain', '1');

    // Step 4: Open cart sidebar and go to checkout
    cy.contains('Carrito').should('be.visible');
    cy.contains('Finalizar Compra').click();

    // Step 5: Fill checkout form
    cy.url().should('include', '/checkout');
    cy.contains('Tus datos de entrega', { timeout: 6000 }).should('be.visible');

    cy.wait(800); // Angular reactive form patch + initialization

    cy.get('#checkout-name').clear().type('Cypress Test User', { delay: 30 });
    cy.get('#checkout-email').clear().type('test@cypress.dev', { delay: 30 });
    cy.get('#checkout-phone').clear().type('+541122334455', { delay: 30 });
    cy.get('#checkout-street').clear().type('Av. Siempre Viva', { delay: 30 });
    cy.get('#checkout-number').clear().type('742', { delay: 30 });
    cy.get('#checkout-city').clear().type('Springfield', { delay: 30 });
    cy.get('#checkout-cp').clear().type('1727', { delay: 30 });

    cy.wait(900); // postal-code debounce (800ms) for shipping calculation

    cy.get('#btn-go-payment').should('not.be.disabled');

    // Step 6: Payment method
    cy.get('#btn-go-payment').click();
    cy.contains('¿Cómo querés pagar?', { timeout: 6000 }).should('be.visible');

    // Transferencia Bancaria avoids the MercadoPago external redirect
    cy.contains('Transferencia Bancaria').click();
    cy.contains('Confirmar Pedido Seguro').should('not.be.disabled').click();

    // Step 7: Confirmation screen
    cy.contains('¡Pedido Registrado!', { timeout: 10000 }).should('be.visible');
    cy.contains('Datos para Transferencia').should('be.visible');
  });
});
