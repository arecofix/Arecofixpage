/**
 * Order Helper for Cypress E2E Tests
 */

export interface MockOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    id: string;
    name: string;
    sku?: string;
  };
}

export interface MockOrder {
  id: string;
  order_number?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  status: string;
  payment_status?: string;
  payment_method?: string;
  items_count?: number;
  subtotal: number;
  shipping_cost?: number;
  total: number;
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  tracking_number?: string;
  shipping_carrier?: string;
  cancellation_reason?: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  order_items?: MockOrderItem[];
}

export function setupOrderMocks(initialOrders?: MockOrder[]) {
  const orders: MockOrder[] = initialOrders || [
    {
      id: 'ord-001',
      order_number: 'ORD-2026-1001',
      customer_id: 'cust-001',
      customer_name: 'Carlos Gomez',
      customer_email: 'carlos.gomez@test.com',
      customer_phone: '+54 9 11 1234-5678',
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'mercadopago',
      items_count: 1,
      subtotal: 149000,
      shipping_cost: 2500,
      total: 151500,
      shipping_address: {
        street: 'Av. Libertador 1200',
        city: 'San Antonio de Areco',
        state: 'Buenos Aires',
        postal_code: '2760'
      },
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1',
      created_at: '2026-10-16T10:00:00.000Z',
      updated_at: '2026-10-16T10:00:00.000Z',
      order_items: [
        {
          id: 'item-001',
          order_id: 'ord-001',
          product_id: 'prod-001',
          quantity: 1,
          unit_price: 149000,
          subtotal: 149000,
          product: {
            id: 'prod-001',
            name: 'Módulo Pantalla iPhone 13 OLED',
            sku: 'MOD-IP13-OLED'
          }
        }
      ]
    },
    {
      id: 'ord-002',
      order_number: 'ORD-2026-1002',
      customer_id: 'cust-002',
      customer_name: 'Lucía Fernández',
      customer_email: 'lucia.f@test.com',
      customer_phone: '+54 9 2326 456789',
      status: 'paid',
      payment_status: 'approved',
      payment_method: 'mercadopago',
      items_count: 1,
      subtotal: 55000,
      shipping_cost: 0,
      total: 55000,
      shipping_address: {
        street: 'Mitre 450',
        city: 'San Antonio de Areco',
        state: 'Buenos Aires',
        postal_code: '2760'
      },
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1',
      created_at: '2026-10-16T11:30:00.000Z',
      updated_at: '2026-10-16T11:35:00.000Z',
      order_items: [
        {
          id: 'item-002',
          order_id: 'ord-002',
          product_id: 'prod-002',
          quantity: 1,
          unit_price: 55000,
          subtotal: 55000,
          product: {
            id: 'prod-002',
            name: 'Batería Original iPhone 12',
            sku: 'BAT-IP12-ORIG'
          }
        }
      ]
    },
    {
      id: 'ord-003',
      order_number: 'ORD-2026-1003',
      customer_id: 'cust-003',
      customer_name: 'Marcos Rossi',
      customer_email: 'marcos.rossi@test.com',
      customer_phone: '+54 9 11 9876-5432',
      status: 'shipped',
      payment_status: 'approved',
      payment_method: 'transfer',
      tracking_number: 'AR-SHIP-998877',
      shipping_carrier: 'Andreani',
      items_count: 2,
      subtotal: 36000,
      shipping_cost: 3000,
      total: 39000,
      shipping_address: {
        street: 'Belgrano 780',
        city: 'San Antonio de Areco',
        state: 'Buenos Aires',
        postal_code: '2760'
      },
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1',
      created_at: '2026-10-15T15:00:00.000Z',
      updated_at: '2026-10-16T09:00:00.000Z',
      order_items: [
        {
          id: 'item-003',
          order_id: 'ord-003',
          product_id: 'prod-003',
          quantity: 2,
          unit_price: 18000,
          subtotal: 36000,
          product: {
            id: 'prod-003',
            name: 'Cable Lightning 1m Original',
            sku: 'CAB-LGT-1M'
          }
        }
      ]
    }
  ];

  // Intercept Orders GET
  cy.intercept('GET', '**/rest/v1/orders*', (req) => {
    const url = req.url;
    const match = url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const ordId = match ? match[1] : null;

    if (ordId) {
      const found = orders.find((o) => o.id === ordId) || orders[0];
      const withItems = {
        ...found,
        items: found.order_items || []
      };
      req.reply({
        statusCode: 200,
        headers: {
          'content-range': '0-0/1'
        },
        body: withItems
      });
      return;
    }

    let result = orders.map((o) => ({
      ...o,
      items: o.order_items || []
    }));

    // Filter branch_id
    if (url.includes('branch_id=eq.')) {
      const bMatch = url.match(/branch_id=eq\.([^&]+)/);
      if (bMatch && bMatch[1]) {
        result = result.filter((o) => !o.branch_id || o.branch_id === bMatch[1]);
      }
    }

    // Filter status
    if (url.includes('status=eq.')) {
      const sMatch = url.match(/status=eq\.([^&]+)/);
      if (sMatch && sMatch[1]) {
        result = result.filter((o) => o.status === sMatch[1]);
      }
    }

    // Filter customer_name or search
    if (url.includes('customer_name=ilike.')) {
      const searchMatch = url.match(/customer_name=ilike\.\*([^&*]+)\*/);
      if (searchMatch && searchMatch[1]) {
        const query = decodeURIComponent(searchMatch[1]).toLowerCase();
        result = result.filter(
          (o) =>
            o.customer_name?.toLowerCase().includes(query) ||
            o.order_number?.toLowerCase().includes(query) ||
            o.customer_email?.toLowerCase().includes(query)
        );
      }
    }

    req.reply({
      statusCode: 200,
      headers: {
        'content-range': `0-${Math.max(0, result.length - 1)}/${result.length}`
      },
      body: result
    });
  }).as('getOrders');


  // Intercept Orders PATCH
  cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    const url = req.url;
    const match = url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const ordId = match ? match[1] : null;
    const idx = orders.findIndex((o) => o.id === ordId);

    if (idx >= 0) {
      orders[idx] = {
        ...orders[idx],
        ...req.body,
        updated_at: new Date().toISOString()
      };
      req.reply({ statusCode: 200, body: orders[idx] });
    } else {
      req.reply({ statusCode: 200, body: req.body });
    }
  }).as('updateOrder');

  // Intercept Orders POST (New Order)
  cy.intercept('POST', '**/rest/v1/orders*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    const newOrd = {
      id: `ord-${Date.now()}`,
      order_number: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.unshift(newOrd);
    req.reply({ statusCode: 201, body: newOrd });
  }).as('createOrder');

  // Intercept Order Items GET
  cy.intercept('GET', '**/rest/v1/order_items*', (req) => {
    const url = req.url;
    const match = url.match(/order_id=eq\.([^&]+)/);
    const ordId = match ? match[1] : null;

    let items: MockOrderItem[] = [];
    if (ordId) {
      const order = orders.find((o) => o.id === ordId);
      items = order?.order_items || [];
    } else {
      items = orders.flatMap((o) => o.order_items || []);
    }

    req.reply({
      statusCode: 200,
      body: items
    });
  }).as('getOrderItems');

  return { orders };
}
