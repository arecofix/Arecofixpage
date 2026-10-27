/**
 * Product Helper for Cypress E2E Tests
 */

export interface MockProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  min_stock_alert?: number;
  sku?: string;
  category_id?: string;
  category_name?: string;
  supplier_id?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  tenant_id?: string;
  branch_id?: string;
  item_type?: string;
  currency?: string;
  vat_rate?: number;
}

export function setupProductMocks(initialProducts?: MockProduct[]) {
  const products: MockProduct[] = initialProducts || [
    {
      id: 'prod-001',
      name: 'Módulo Pantalla iPhone 13 OLED',
      slug: 'modulo-pantalla-iphone-13-oled',
      description: 'Pantalla OLED de alta definición para iPhone 13',
      price: 149000,
      cost: 95000,
      stock: 15,
      min_stock_alert: 5,
      sku: 'MOD-IP13-OLED',
      category_id: 'cat-001',
      category_name: 'Repuestos',
      supplier_id: 'sup-001',
      is_active: true,
      created_at: '2026-10-10T12:00:00.000Z',
      updated_at: '2026-10-10T12:00:00.000Z',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1'
    },
    {
      id: 'prod-002',
      name: 'Batería Original iPhone 12',
      slug: 'bateria-original-iphone-12',
      description: 'Batería de repuesto alta calidad 2815mAh',
      price: 55000,
      cost: 32000,
      stock: 3,
      min_stock_alert: 5,
      sku: 'BAT-IP12-ORIG',
      category_id: 'cat-001',
      category_name: 'Repuestos',
      supplier_id: 'sup-001',
      is_active: true,
      created_at: '2026-10-12T10:00:00.000Z',
      updated_at: '2026-10-12T10:00:00.000Z',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1'
    },
    {
      id: 'prod-003',
      name: 'Cable Lightning 1m Original',
      slug: 'cable-lightning-1m-original',
      description: 'Cable USB a Lightning 1 metro de largo',
      price: 18000,
      cost: 9000,
      stock: 0,
      min_stock_alert: 10,
      sku: 'CAB-LGT-1M',
      category_id: 'cat-002',
      category_name: 'Accesorios',
      supplier_id: 'sup-002',
      is_active: true,
      created_at: '2026-10-14T15:00:00.000Z',
      updated_at: '2026-10-14T15:00:00.000Z',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
      branch_id: 'branch-1'
    }
  ];

  const categories = [
    { id: 'cat-001', name: 'Repuestos', slug: 'repuestos', tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', is_active: true },
    { id: 'cat-002', name: 'Accesorios', slug: 'accesorios', tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', is_active: true }
  ];

  const suppliers = [
    { id: 'sup-001', name: 'Distribuidora Tech SA', tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', is_active: true },
    { id: 'sup-002', name: 'Accesorios Global SRL', tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', is_active: true }
  ];

  const stockHistories = [
    {
      id: 'sh-001',
      product_id: 'prod-001',
      delta: 15,
      previous_stock: 0,
      new_stock: 15,
      reason: 'manual_adjustment',
      created_at: '2026-10-10T12:00:00.000Z',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
    },
    {
      id: 'sh-002',
      product_id: 'prod-002',
      delta: -2,
      previous_stock: 5,
      new_stock: 3,
      reason: 'sale',
      created_at: '2026-10-15T09:00:00.000Z',
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
    }
  ];

  // Intercept Categories
  cy.intercept('GET', '**/rest/v1/categories*', (req) => {
    req.reply({
      statusCode: 200,
      headers: {
        'content-range': `0-${Math.max(0, categories.length - 1)}/${categories.length}`
      },
      body: categories
    });
  }).as('getCategories');

  // Intercept Suppliers
  cy.intercept('GET', '**/rest/v1/suppliers*', (req) => {
    req.reply({
      statusCode: 200,
      headers: {
        'content-range': `0-${Math.max(0, suppliers.length - 1)}/${suppliers.length}`
      },
      body: suppliers
    });
  }).as('getSuppliers');

  // Intercept Products GET
  cy.intercept('GET', '**/rest/v1/products*', (req) => {
    const url = req.url;
    const match = url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const prodId = match ? match[1] : null;

    if (prodId) {
      const found = products.find((p) => p.id === prodId) || products[0];
      req.reply({
        statusCode: 200,
        headers: {
          'content-range': '0-0/1'
        },
        body: found
      });
      return;
    }

    // Filter by name/search if any
    let result = [...products];
    if (url.includes('name=ilike.')) {
      const searchMatch = url.match(/name=ilike\.\*([^&*]+)\*/);
      if (searchMatch && searchMatch[1]) {
        const query = decodeURIComponent(searchMatch[1]).toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(query));
      }
    }

    if (url.includes('category_id=eq.')) {
      const catMatch = url.match(/category_id=eq\.([^&]+)/);
      if (catMatch && catMatch[1]) {
        result = result.filter((p) => p.category_id === catMatch[1]);
      }
    }

    req.reply({
      statusCode: 200,
      headers: {
        'content-range': `0-${Math.max(0, result.length - 1)}/${result.length}`
      },
      body: result
    });
  }).as('getProducts');

  // Intercept Products POST (Create)
  cy.intercept('POST', '**/rest/v1/products*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    const newProd = {
      id: `prod-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    products.unshift(newProd);
    req.reply({
      statusCode: 201,
      body: newProd
    });
  }).as('createProduct');

  // Intercept Products PATCH (Update)
  cy.intercept('PATCH', '**/rest/v1/products*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    const url = req.url;
    const match = url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const prodId = match ? match[1] : null;
    const idx = products.findIndex((p) => p.id === prodId);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...req.body, updated_at: new Date().toISOString() };
      req.reply({ statusCode: 200, body: products[idx] });
    } else {
      req.reply({ statusCode: 200, body: req.body });
    }
  }).as('updateProduct');

  // Intercept product_stock_per_branch
  cy.intercept('GET', '**/rest/v1/product_stock_per_branch*', (req) => {
    req.reply({
      statusCode: 200,
      headers: { 'content-range': '0-0/1' },
      body: [{ id: 'pspb-1', product_id: 'prod-001', branch_id: 'branch-1', quantity: 15, min_stock_alert: 5 }]
    });
  }).as('getProductStockPerBranch');

  cy.intercept('POST', '**/rest/v1/product_stock_per_branch*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    req.reply({
      statusCode: 201,
      body: { id: `pspb-${Date.now()}`, ...req.body }
    });
  }).as('postProductStockPerBranch');

  cy.intercept('PATCH', '**/rest/v1/product_stock_per_branch*', (req) => {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    }
    req.reply({
      statusCode: 200,
      body: { id: 'pspb-1', ...req.body }
    });
  }).as('patchProductStockPerBranch');

  // Intercept Products DELETE
  cy.intercept('DELETE', '**/rest/v1/products*', (req) => {
    const url = req.url;
    const match = url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const prodId = match ? match[1] : null;
    const idx = products.findIndex((p) => p.id === prodId);
    if (idx >= 0) {
      products.splice(idx, 1);
    }
    req.reply({ statusCode: 204, body: {} });
  }).as('deleteProduct');

  // Intercept Stock History
  cy.intercept('GET', '**/rest/v1/stock_history*', (req) => {
    req.reply({
      statusCode: 200,
      headers: {
        'content-range': `0-${Math.max(0, stockHistories.length - 1)}/${stockHistories.length}`
      },
      body: stockHistories
    });
  }).as('getStockHistory');

  cy.intercept('POST', '**/rest/v1/stock_history*', (req) => {
    const record = {
      id: `sh-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString()
    };
    stockHistories.unshift(record);
    req.reply({ statusCode: 201, body: record });
  }).as('createStockHistory');

  return { products, categories, suppliers, stockHistories };
}
