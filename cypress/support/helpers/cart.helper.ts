import { buildMockProduct, buildMockOrder, buildMockOrderItem } from '../mock-factories';

export interface CartMockOptions {
  products?: Array<Record<string, unknown>>;
  cartItems?: Array<{ product: Record<string, unknown>; quantity: number }>;
  shippingCost?: number;
  failOrderCreation?: boolean;
}

export function setupCartAndCatalogMocks(options: CartMockOptions = {}) {
  const defaultProduct = buildMockProduct({
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    price: 149000,
    stock: 15,
  });

  const productsList = options.products || [
    defaultProduct,
    buildMockProduct({
      id: 'prod-002',
      name: 'Batería Original iPhone 12',
      slug: 'bateria-original-iphone-12',
      price: 55000,
      stock: 8,
    }),
    buildMockProduct({
      id: 'prod-003',
      name: 'Cable Lightning 1m Original',
      slug: 'cable-lightning-1m-original',
      price: 18000,
      stock: 25,
    }),
  ];

  const items = (options.cartItems || []).map((ci) =>
    buildMockOrderItem(ci.product, ci.quantity)
  );
  let activeOrder = buildMockOrder(items);

  // 1. Catalog Products Intercept
  cy.intercept('GET', '**/rest/v1/products*', (req) => {
    const url = req.url;
    if (url.includes('slug=eq.')) {
      const slugMatch = url.match(/slug=eq\.([^&]+)/);
      const slug = slugMatch ? decodeURIComponent(slugMatch[1]) : '';
      const prod = productsList.find((p) => p['slug'] === slug) || productsList[0];
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
        body: [prod],
      });
      return;
    }

    req.reply({
      statusCode: 200,
      headers: {
        'Content-Range': `0-${productsList.length - 1}/${productsList.length}`,
        'Content-Type': 'application/json',
      },
      body: productsList,
    });
  }).as('getProducts');

  // 2. Shipping Rates Intercept
  cy.intercept('GET', '**/rest/v1/shipping_rates*', {
    statusCode: 200,
    body: [{ provider: 'Correo Argentino', cost: options.shippingCost ?? 1500 }],
  }).as('getShippingRates');

  // 3. Exchange Rate Intercept
  cy.intercept('GET', '**/rest/v1/app_settings*', {
    statusCode: 200,
    body: [{ key: 'usd_rate', value: 1240 }],
  }).as('getAppSettings');

  // 4. Cart / Orders Intercepts
  cy.intercept('GET', '**/rest/v1/orders*', (req) => {
    req.reply({
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1', 'Content-Type': 'application/json' },
      body: activeOrder.items && activeOrder.items.length > 0 ? [activeOrder] : [],
    });
  }).as('getActiveCart');

  cy.intercept('POST', '**/rest/v1/orders*', (req) => {
    if (options.failOrderCreation) {
      req.reply({
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: { message: 'Error al procesar la orden en el servidor', code: 'P0001' },
      });
      return;
    }
    activeOrder = {
      ...activeOrder,
      ...req.body,
      id: activeOrder.id || 'order-' + Date.now(),
      order_number: req.body.order_number || 'ORD-' + Date.now(),
    };
    req.reply({
      statusCode: 201,
      body: [activeOrder],
    });
  }).as('createOrder');

  cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
    activeOrder = {
      ...activeOrder,
      ...req.body,
    };
    req.reply({
      statusCode: 200,
      body: [activeOrder],
    });
  }).as('updateOrder');

  cy.intercept('DELETE', '**/rest/v1/orders*', {
    statusCode: 204,
    body: '',
  }).as('deleteOrder');

  // 5. Order Items Intercepts
  cy.intercept('POST', '**/rest/v1/order_items*', (req) => {
    const newItems = Array.isArray(req.body) ? req.body : [req.body];
    const existing = [...(activeOrder.items || [])];
    for (const newItem of newItems) {
      const idx = existing.findIndex(
        (e: any) =>
          (newItem.cart_item_id && e.cart_item_id === newItem.cart_item_id) ||
          (newItem.product_id && e.product_id === newItem.product_id)
      );
      if (idx >= 0) {
        existing[idx] = {
          ...existing[idx],
          ...newItem,
          product: existing[idx].product || productsList.find((p) => p['id'] === newItem.product_id),
        };
      } else {
        existing.push({
          ...newItem,
          product: productsList.find((p) => p['id'] === newItem.product_id),
        });
      }
    }
    activeOrder.items = existing;
    req.reply({
      statusCode: 201,
      body: newItems,
    });
  }).as('createOrderItems');

  cy.intercept('GET', '**/rest/v1/order_items*', (req) => {
    req.reply({
      statusCode: 200,
      body: (activeOrder.items || []).map((i: any) => ({
        id: i.id || '00000000-0000-0000-0000-000000000001',
        cart_item_id: i.cart_item_id || i.id,
      })),
    });
  }).as('getOrderItems');

  cy.intercept('DELETE', '**/rest/v1/order_items*', {
    statusCode: 200,
    body: [],
  }).as('deleteOrderItems');

  // 6. Mercado Pago Preferences
  cy.intercept('POST', /(mercadopago-preferences|create-preference)/, {
    statusCode: 200,
    body: {
      id: 'mock-preference-id',
      init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-preference-id',
    },
  }).as('createPreference');
}
