/**
 * Mock Factories — Cypress Test Data Builders
 *
 * Single source of truth for all test fixture data.
 * Each factory returns a complete, typed object that matches the
 * shape expected by Supabase REST responses and Angular services.
 *
 * Design principles:
 *  - Pure functions: no side effects, no shared mutable state
 *  - Sane defaults: overridable via Partial spread
 *  - Self-documenting: each factory explains WHY certain values are required
 */

// ── Shared constants ──────────────────────────────────────────────────────────
export const MOCK_USER_ID    = 'mock-user-id';
export const MOCK_BRANCH_ID  = 'branch-1';
export const MOCK_TENANT_ID  = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
export const MOCK_ORDER_ID   = 'mock-order-123';

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Builds a fake Supabase auth session.
 * The JWT payload decodes to:  { exp: 2999999999, role: "authenticated", sub: "mock-user-id" }
 * It never expires during any CI run within this decade.
 */
export function buildMockSession(overrides: Record<string, unknown> = {}) {
  return {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      '.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay11c2VyLWlkIn0' +
      '.signature',
    expires_in:    3600,
    expires_at:    Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type:    'bearer',
    user:          buildMockAuthUser(),
    ...overrides,
  };
}

export function buildMockAuthUser(overrides: Record<string, unknown> = {}) {
  return {
    id:                MOCK_USER_ID,
    aud:               'authenticated',
    role:              'authenticated',
    email:             'user@arecofix.com',
    email_confirmed_at: new Date().toISOString(),
    app_metadata:      { provider: 'email', providers: ['email'] },
    user_metadata:     { role: 'user' },
    identities:        [],
    created_at:        new Date().toISOString(),
    updated_at:        new Date().toISOString(),
    ...overrides,
  };
}

// ── Infrastructure ────────────────────────────────────────────────────────────

export function buildMockTenant(overrides: Record<string, unknown> = {}) {
  return {
    id:            MOCK_TENANT_ID,
    name:          'Arecofix',
    slug:          'arecofix',
    // Must be 'localhost' so TenantService resolves correctly in Cypress
    custom_domain: 'localhost',
    is_active:     true,
    ...overrides,
  };
}

export function buildMockBranch(overrides: Record<string, unknown> = {}) {
  return {
    id:        MOCK_BRANCH_ID,
    name:      'Sede Central',
    tenant_id: MOCK_TENANT_ID,
    ...overrides,
  };
}

export function buildMockProfile(overrides: Record<string, unknown> = {}) {
  return {
    id:        MOCK_USER_ID,
    email:     'user@arecofix.com',
    // Must NOT be a wholesale-authorized role ('gremio', 'tecnico', 'admin', 'super_admin')
    // so that non-technical products show the "Añadir al Carrito" button
    // via ProductStrategicService.canViewPriceAndBuy()
    role:      'user',
    first_name: 'Cypress',
    last_name:  'User',
    is_active:  true,
    tenant_id:  MOCK_TENANT_ID,
    ...overrides,
  };
}

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Builds a non-technical product.
 *
 * CRITICAL: category_name must NOT contain any of these keywords:
 *   'repuesto', 'módulo', 'pantalla', 'batería', 'cámara', 'pin de carga',
 *   'flex', 'tapa', 'ic ', 'microelectronica', 'herramientas', 'soldar', 'flux'
 *
 * Because ProductStrategicService.isTechnicalCategory() checks the name/category
 * and hides the "Añadir al Carrito" button for technical products unless the
 * user has a wholesale role (gremio/tecnico/admin/super_admin).
 */
export function buildMockProduct(overrides: Record<string, unknown> = {}) {
  return {
    id:            'prod-funda-1',
    name:          'Funda Silicona iPhone 13',
    slug:          'funda-silicona-iphone-13',
    price:         2500,
    currency:      'ARS',
    is_active:     true,
    is_featured:   false,
    stock:         10,
    category_id:   'cat-accesorios',
    category_name: 'Accesorios',   // ← Non-technical category
    image_url:     null,
    branch_stock:  [],
    description:   'Funda de silicona premium para iPhone 13',
    ...overrides,
  };
}

// ── Orders ────────────────────────────────────────────────────────────────────

/**
 * Builds a mock order item with an embedded `product` sub-object.
 *
 * CRITICAL: The `product` field must be present.
 * CartService.syncOrderState() does:
 *   items.filter(item => item.product).map(item => ({ product: item.product, quantity: item.quantity }))
 *
 * If `product` is missing, cartItems signal stays empty and the cart badge shows 0.
 * This is the most common cause of "badge never shows 1" in the test.
 */
export function buildMockOrderItem(
  product: ReturnType<typeof buildMockProduct>,
  quantity = 1,
  overrides: Record<string, unknown> = {}
) {
  return {
    id:               'mock-item-1',
    order_id:         MOCK_ORDER_ID,
    product_id:       product.id,
    product_name:     product.name,
    quantity,
    unit_price:       product.price,
    unit_cost_at_time: 0,
    subtotal:         product.price * quantity,
    // Embedded join: matches the SELECT shape used in getActiveCart():
    //   items:order_items(*, product:products(id, name, slug, price, currency, image_url))
    product: {
      id:        product.id,
      name:      product.name,
      slug:      product.slug,
      price:     product.price,
      currency:  product.currency,
      image_url: product.image_url,
    },
    ...overrides,
  };
}

/**
 * Builds a complete mock order ready for Supabase intercept responses.
 *
 * IMPORTANT about .maybeSingle():
 *   - SupabaseOrderRepository.getActiveCart() uses .maybeSingle()
 *   - Supabase returns: null (no row) or plain object (one row)
 *   - Cypress interceptors must reply with:
 *       null  → when cart is empty (NOT [] or {})
 *       this object → when cart has items (NOT wrapped in [])
 *
 * If you reply with [] instead of null, CartService receives an array where
 * it expects null, breaks OrderMapper.toDomain(), and the cart stays broken.
 */
export function buildMockOrder(
  items: ReturnType<typeof buildMockOrderItem>[] = [],
  overrides: Record<string, unknown> = {}
) {
  const subtotal = items.reduce((acc, i) => acc + (i.subtotal as number), 0);
  return {
    id:             MOCK_ORDER_ID,
    order_number:   'TEST-001',
    status:         'cart',
    user_id:        MOCK_USER_ID,
    tenant_id:      MOCK_TENANT_ID,
    branch_id:      MOCK_BRANCH_ID,
    customer_name:  'Cypress User',
    customer_email: 'user@arecofix.com',
    subtotal,
    tax:            0,
    discount:       0,
    total:          subtotal,
    total_amount:   subtotal,
    deleted_at:     null,
    created_at:     new Date().toISOString(),
    updated_at:     new Date().toISOString(),
    items,
    ...overrides,
  };
}
