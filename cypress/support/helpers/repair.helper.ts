/**
 * Repair Orders & Workshop Helper for Cypress E2E Tests
 * Clean Architecture & Type-safe Mock Builders
 */

export const REPAIR_UUID_1 = '11111111-1111-4111-a111-111111111111';
export const REPAIR_UUID_2 = '22222222-2222-4222-a222-222222222222';
export const REPAIR_UUID_3 = '33333333-3333-4333-a333-333333333333';
export const REPAIR_UUID_4 = '44444444-4444-4444-a444-444444444444';

export interface MockRepairOptions {
  id?: string;
  tracking_code?: string;
  repair_number?: number;
  current_status_id?: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_dni?: string;
  device_model?: string;
  device_type?: string;
  brand_name?: string;
  imei?: string;
  issue_description?: string;
  estimated_cost?: number;
  final_cost?: number;
  deposit_amount?: number;
  technical_labor_cost?: number;
  technical_report?: string;
  technician_notes?: string;
  parts?: any[];
  images?: string[];
  checklist?: any;
  security_pin?: string;
  security_pattern?: string;
  device_passcode?: string;
  branch_id?: string;
  tenant_id?: string;
}

export function buildMockRepair(options: MockRepairOptions = {}) {
  const id = options.id || REPAIR_UUID_1;
  const tracking_code = options.tracking_code || 'AF-101';
  const customer_name = options.customer_name || 'Juan Pérez';
  const customer_phone = options.customer_phone || '+54 11 2233-4455';
  const customer_email = options.customer_email || 'juan.perez@example.com';
  const customer_dni = options.customer_dni || '30111222';
  const device_model = options.device_model || 'Samsung Galaxy S21';
  const device_type = options.device_type || 'smartphone';
  const brand_name = options.brand_name || 'Samsung';
  const imei = options.imei || '358765432109876';
  const issue_description = options.issue_description || 'Pantalla rota sin imagen tras golpe';
  const current_status_id = options.current_status_id !== undefined ? options.current_status_id : 1;
  const estimated_cost = options.estimated_cost !== undefined ? options.estimated_cost : 45000;
  const final_cost = options.final_cost !== undefined ? options.final_cost : 45000;
  const deposit_amount = options.deposit_amount !== undefined ? options.deposit_amount : 10000;
  const technical_labor_cost = options.technical_labor_cost !== undefined ? options.technical_labor_cost : 25000;
  const technical_report = options.technical_report !== undefined ? options.technical_report : 'Diagnóstico completado. Reemplazo de módulo necesario.';
  const technician_notes = options.technician_notes !== undefined ? options.technician_notes : 'Verificado en banco de pruebas';
  const branch_id = options.branch_id || 'de967f68-7b15-44c0-bc98-952ccf06e1e5';
  const tenant_id = options.tenant_id || 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

  return {
    id,
    tracking_code,
    repair_number: options.repair_number || 101,
    current_status_id,
    issue_description,
    estimated_cost,
    final_cost,
    deposit_amount,
    technical_labor_cost,
    spare_part_cost: 20000,
    technical_report,
    technician_notes,
    received_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    created_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-10T11:00:00Z').toISOString(),
    completed_at: current_status_id >= 5 ? new Date('2026-10-12T15:00:00Z').toISOString() : null,
    deleted_at: null,
    whatsapp_notifications: true,
    glass_upsell: false,
    imei,
    security_pin: options.security_pin !== undefined ? options.security_pin : '1234',
    security_pattern: options.security_pattern || null,
    device_passcode: options.device_passcode || null,
    checklist: options.checklist || {
      charger: true,
      battery: false,
      chip: false,
      sd: false,
      case: true,
      physical_condition: 'Rayones leves en laterales'
    },
    customer_id: 'cust-mock-001',
    client_id: 'cust-mock-001',
    device_id: 'dev-mock-001',
    branch_id,
    tenant_id,
    customer_name,
    customer_phone,
    customer_email,
    customer_dni,
    device_model,
    device_type,
    brand_name,
    client: {
      id: 'cust-mock-001',
      first_name: customer_name.split(' ')[0],
      last_name: customer_name.split(' ').slice(1).join(' ') || 'Cliente',
      phone: customer_phone,
      email: customer_email,
      dni: customer_dni
    },
    device: {
      id: 'dev-mock-001',
      type: device_type,
      imei,
      passcode: null,
      model: {
        name: device_model,
        brand_id: 'brand-samsung',
        brand: { name: brand_name }
      }
    },
    status: {
      id: current_status_id,
      name: getStatusLabel(current_status_id),
      color: getStatusColor(current_status_id),
      icon: 'fas fa-tools'
    },
    parts: options.parts || [
      {
        id: 'part-001',
        repair_id: id,
        product_id: 'prod-s21-screen',
        quantity: 1,
        unit_price_at_time: 20000,
        cost_at_time: 15000,
        product: { name: 'Módulo Samsung S21 OLED' }
      }
    ],
    images: (options.images || ['https://db.arecofix.com.ar/storage/v1/object/public/repair-images/mock-evidencia-1.jpg']).map(img => 
      typeof img === 'string' ? { image_url: img } : img
    )
  };
}

export function buildMockPublicTracking(code: string, options: Partial<MockRepairOptions> = {}) {
  const current_status_id = options.current_status_id !== undefined ? options.current_status_id : 1;
  const estimated_cost = options.estimated_cost !== undefined ? options.estimated_cost : 45000;
  const final_cost = options.final_cost !== undefined ? options.final_cost : 45000;
  const deposit_amount = options.deposit_amount !== undefined ? options.deposit_amount : 10000;
  const balance = Math.max(0, final_cost - deposit_amount);

  return {
    id: options.id || REPAIR_UUID_1,
    tracking_code: code,
    repair_number: options.repair_number || 101,
    device_model: options.device_model || 'Samsung Galaxy S21',
    device_brand: options.brand_name || 'Samsung',
    device_type: options.device_type || 'smartphone',
    current_status_id,
    status_label: getStatusLabel(current_status_id),
    status_color: getStatusColor(current_status_id),
    received_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    created_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    issue_description: options.issue_description || 'Pantalla rota sin imagen tras golpe',
    estimated_cost,
    final_cost,
    deposit_amount,
    total_cost: final_cost,
    balance_to_pay: balance,
    customer_name: options.customer_name || 'Juan Pérez',
    customer_dni: options.customer_dni || '30111222',
    technical_report: options.technical_report || (current_status_id >= 4 ? 'Diagnóstico y pruebas de control de calidad finalizadas.' : null),
    technician_notes: options.technician_notes || 'Equipo recibido con cargador y funda',
    glass_upsell: false,
    imei: options.imei || '358765432109876',
    checklist: options.checklist || { charger: true, battery: false, chip: false, sd: false, case: true },
    images: options.images || ['https://db.arecofix.com.ar/storage/v1/object/public/repair-images/mock-evidencia-1.jpg'],
    security_pin: '1234',
    security_pattern: null,
    device_passcode: null,
    tenant_id: options.tenant_id || 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: options.branch_id || 'de967f68-7b15-44c0-bc98-952ccf06e1e5',
    deleted_at: null
  };
}

function getStatusLabel(statusId: number): string {
  const map: Record<number, string> = {
    1: 'PENDIENTE DE DIAGNÓSTICO',
    2: 'GESTIÓN DE REPUESTOS',
    3: 'EN REPARACIÓN',
    4: 'CONTROL DE CALIDAD',
    5: 'LISTO PARA RETIRAR',
    6: 'ENTREGADO',
    7: 'CANCELADO'
  };
  return map[statusId] || 'PENDIENTE';
}

function getStatusColor(statusId: number): string {
  const map: Record<number, string> = {
    1: 'bg-amber-100 text-amber-800 border-amber-200',
    2: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    3: 'bg-blue-100 text-blue-800 border-blue-200',
    4: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    5: 'bg-green-100 text-green-800 border-green-200',
    6: 'bg-slate-100 text-slate-800 border-slate-200',
    7: 'bg-rose-100 text-rose-800 border-rose-200'
  };
  return map[statusId] || 'bg-slate-100 text-slate-700';
}

/**
 * Sets up full mocks for the Admin Repairs Module
 */
export function setupAdminRepairsMocks(customRepairs?: any[]) {
  const repairs = customRepairs || [
    buildMockRepair({ id: REPAIR_UUID_1, tracking_code: 'AF-101', repair_number: 101, current_status_id: 1, device_model: 'Samsung Galaxy S21' }),
    buildMockRepair({ id: REPAIR_UUID_2, tracking_code: 'AF-102', repair_number: 102, current_status_id: 2, device_model: 'iPhone 13 Pro', device_type: 'smartphone' }),
    buildMockRepair({ id: REPAIR_UUID_3, tracking_code: 'AF-103', repair_number: 103, current_status_id: 5, device_model: 'Motorola G52' }),
    buildMockRepair({ id: REPAIR_UUID_4, tracking_code: 'AF-104', repair_number: 104, current_status_id: 7, device_model: 'Notebook Lenovo ThinkPad', device_type: 'notebook' }),
  ];

  // Intercept tenant and auth
  cy.intercept('GET', '**/rest/v1/tenants*', {
    statusCode: 200,
    body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', is_active: true, custom_domain: 'localhost' }]
  }).as('getTenants');

  cy.intercept('GET', '**/rest/v1/branches*', {
    statusCode: 200,
    body: [
      { id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5', name: 'Central Arecofix', slug: 'arecofix', is_active: true, tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b' }
    ]
  }).as('getBranches');

  // Intercept repairs GET
  cy.intercept('GET', '**/rest/v1/repairs*', (req) => {
    // Summary count queries
    if (req.url.includes('select=current_status_id')) {
      req.reply({
        statusCode: 200,
        body: repairs.map(r => ({ current_status_id: r.current_status_id, created_at: r.created_at }))
      });
      return;
    }

    // Summary profit queries
    if (req.url.includes('select=final_cost') || req.url.includes('spare_part_cost')) {
      req.reply({
        statusCode: 200,
        body: repairs.map(r => ({ final_cost: r.final_cost, spare_part_cost: r.spare_part_cost, completed_at: r.completed_at }))
      });
      return;
    }

    // Single repair by ID (must not match branch_id.eq)
    const idMatch = req.url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    if (idMatch) {
      const targetId = idMatch[1];
      const found = repairs.find(r => r.id === targetId) || repairs[0];
      req.reply({
        statusCode: 200,
        body: [found]
      });
      return;
    }

    // Filter by search term
    if (req.url.includes('ilike.')) {
      const match = req.url.match(/ilike\.(?:%25|%)([^%&)]+)(?:%25|%)/);
      if (match) {
        const term = decodeURIComponent(match[1]).toLowerCase();
        const filtered = repairs.filter(r => 
          r.tracking_code?.toLowerCase().includes(term) ||
          r.customer_name?.toLowerCase().includes(term) ||
          r.device_model?.toLowerCase().includes(term)
        );
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${filtered.length - 1}/${filtered.length}` },
          body: filtered
        });
        return;
      }
    }

    // List of repairs
    req.reply({
      statusCode: 200,
      headers: { 'content-range': `0-${repairs.length - 1}/${repairs.length}` },
      body: repairs
    });
  }).as('getRepairs');

  // Intercept Create (RPC save_repair_order)
  cy.intercept('POST', '**/rest/v1/rpc/save_repair_order*', (req) => {
    const payload = req.body?.p_payload || {};
    const generatedId = payload.id || '99999999-9999-4999-a999-999999999999';
    const trackingCode = payload.tracking_code || 'AF-999';
    req.reply({
      statusCode: 200,
      body: { id: generatedId, tracking_code: trackingCode }
    });
  }).as('rpcSaveRepairOrder');

  let lastUpdatedModelName = '';
  const knownModels: Record<string, string> = {
    'samsung-galaxy-s21': 'Samsung Galaxy S21',
    'iphone-13-pro': 'iPhone 13 Pro',
    'iphone-13': 'iPhone 13',
    'motorola-g52': 'Motorola G52',
    'motorola-moto-g52': 'Motorola Moto G52',
    'notebook-lenovo-thinkpad': 'Notebook Lenovo ThinkPad'
  };

  // Intercept Direct Patch on Repairs
  cy.intercept('PATCH', '**/rest/v1/repairs*', (req) => {
    const idMatch = req.url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const targetId = idMatch ? idMatch[1] : undefined;
    const patchBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (targetId) {
      const idx = repairs.findIndex(r => r.id === targetId);
      if (idx !== -1) {
        const existing = repairs[idx];
        const newDeviceId = patchBody.device_id !== undefined ? patchBody.device_id : existing.device_id;
        const newDevice = newDeviceId === null ? null : existing.device;
        const newDeviceModel = newDeviceId === null 
          ? '' 
          : (lastUpdatedModelName || existing.device?.model?.name || existing.device_model || '');

        repairs[idx] = {
          ...existing,
          ...patchBody,
          device_id: newDeviceId,
          device: newDevice ? {
            ...newDevice,
            model: {
              ...(newDevice.model || {}),
              name: newDeviceModel
            }
          } : null,
          device_model: newDeviceModel,
          customer_name: patchBody.customer_name !== undefined ? patchBody.customer_name : existing.customer_name,
          customer_phone: patchBody.customer_phone !== undefined ? patchBody.customer_phone : existing.customer_phone,
        };
        if (patchBody.customer_phone !== undefined && repairs[idx].client) {
          repairs[idx].client.phone = patchBody.customer_phone;
        }
      }
    }

    req.reply({
      statusCode: 200,
      body: patchBody
    });
  }).as('patchRepair');

  // Intercept models and devices
  cy.intercept('GET', '**/rest/v1/models*', (req) => {
    const slugMatch = req.url.match(/slug=eq\.([^&]+)/);
    const isSingle = req.headers['accept']?.includes('vnd.pgrst.object+json');
    if (slugMatch) {
      const slug = decodeURIComponent(slugMatch[1]);
      if (knownModels[slug]) {
        const matched = { id: `model-${slug}-id`, name: knownModels[slug], slug: slug, brand_id: 'brand-samsung' };
        req.reply({
          statusCode: 200,
          body: isSingle ? matched : [matched]
        });
        return;
      }
      // Return null/empty so ensureModelExists issues a POST insert
      req.reply({
        statusCode: 200,
        body: isSingle ? null : []
      });
      return;
    }
    const defaultModels = [{ id: 'model-s21-id', name: 'Samsung Galaxy S21', slug: 'samsung-galaxy-s21', brand_id: 'brand-samsung' }];
    req.reply({
      statusCode: 200,
      body: isSingle ? defaultModels[0] : defaultModels
    });
  }).as('getModels');

  cy.intercept('POST', '**/rest/v1/models*', (req) => {
    const bodyObj = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = bodyObj?.name || '';
    const slug = bodyObj?.slug || '';
    if (slug && name) knownModels[slug] = name;
    lastUpdatedModelName = name;
    const isSingle = req.headers['accept']?.includes('vnd.pgrst.object+json');
    const result = { id: `model-${slug || 'new'}-id`, name: name || 'iPhone 13', slug: slug || 'iphone-13' };
    req.reply({
      statusCode: 201,
      body: isSingle ? result : [result]
    });
  }).as('postModel');

  // Intercept profiles/clients updates
  cy.intercept('PATCH', '**/rest/v1/profiles*', (req) => {
    const idMatch = req.url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const targetId = idMatch ? idMatch[1] : undefined;
    const patchBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (patchBody.phone !== undefined) {
      repairs.forEach(r => {
        r.customer_phone = patchBody.phone;
        if (r.client) r.client.phone = patchBody.phone;
      });
    }
    if (patchBody.dni !== undefined) {
      repairs.forEach(r => {
        r.customer_dni = patchBody.dni;
        if (r.client) r.client.dni = patchBody.dni;
      });
    }
    req.reply({
      statusCode: 200,
      body: { id: targetId || 'cust-mock-001', ...patchBody }
    });
  }).as('patchProfile');

  cy.intercept('PATCH', '**/rest/v1/clients*', (req) => {
    const idMatch = req.url.match(/(?:^|[?&])id=eq\.([^&]+)/);
    const targetId = idMatch ? idMatch[1] : undefined;
    const patchBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (patchBody.phone !== undefined) {
      repairs.forEach(r => {
        r.customer_phone = patchBody.phone;
        if (r.client) r.client.phone = patchBody.phone;
      });
    }
    if (patchBody.dni !== undefined) {
      repairs.forEach(r => {
        r.customer_dni = patchBody.dni;
        if (r.client) r.client.dni = patchBody.dni;
      });
    }
    req.reply({
      statusCode: 200,
      body: { id: targetId || 'cust-mock-001', ...patchBody }
    });
  }).as('patchClient');

  cy.intercept('GET', '**/rest/v1/customer_devices*', {
    statusCode: 200,
    body: [{ id: 'dev-mock-001', user_id: 'cust-mock-001', model_id: 'model-s21-id', type: 'smartphone' }]
  }).as('getCustomerDevices');

  cy.intercept('PATCH', '**/rest/v1/customer_devices*', (req) => {
    const isSingle = req.headers['accept']?.includes('vnd.pgrst.object+json');
    const result = { id: 'dev-mock-001' };
    req.reply({
      statusCode: 200,
      body: isSingle ? result : [result]
    });
  }).as('patchCustomerDevice');

  cy.intercept('POST', '**/rest/v1/customer_devices*', (req) => {
    const isSingle = req.headers['accept']?.includes('vnd.pgrst.object+json');
    const result = { id: 'dev-mock-001' };
    req.reply({
      statusCode: 201,
      body: isSingle ? result : [result]
    });
  }).as('postCustomerDevice');

  // Intercept Delete
  cy.intercept('DELETE', '**/rest/v1/repairs*', {
    statusCode: 204,
    body: null
  }).as('deleteRepair');

  // Intercept parts
  cy.intercept('GET', '**/rest/v1/repair_parts_used*', {
    statusCode: 200,
    body: []
  }).as('getPartsUsed');

  cy.intercept('POST', '**/rest/v1/repair_parts_used*', {
    statusCode: 201,
    body: []
  }).as('postPartsUsed');

  cy.intercept('DELETE', '**/rest/v1/repair_parts_used*', {
    statusCode: 204,
    body: null
  }).as('deletePartsUsed');

  // Intercept history
  cy.intercept('POST', '**/rest/v1/repair_status_history*', {
    statusCode: 201,
    body: { id: 'rsh-001' }
  }).as('postStatusHistory');

  // Intercept status types
  cy.intercept('GET', '**/rest/v1/repair_status_types*', {
    statusCode: 200,
    body: [
      { id: 1, name: 'Pendiente - Diagnóstico', color: '#FFA500', icon: 'fas fa-clipboard-list', order_index: 1 },
      { id: 2, name: 'En Gestión y Reserva de Suministros', color: '#3498db', icon: 'fas fa-boxes', order_index: 2 },
      { id: 3, name: 'En Progreso', color: '#f1c40f', icon: 'fas fa-tools', order_index: 3 },
      { id: 4, name: 'Control de Calidad / Testing', color: '#9b59b6', icon: 'fas fa-clipboard-check', order_index: 4 },
      { id: 5, name: 'Listo para retirar', color: '#2ecc71', icon: 'fas fa-check-circle', order_index: 5 },
      { id: 6, name: 'Entregado', color: '#7f8c8d', icon: 'fas fa-handshake', order_index: 6 },
      { id: 7, name: 'Cancelado', color: '#e74c3c', icon: 'fas fa-times-circle', order_index: 7 }
    ]
  }).as('getStatusTypes');

  // Intercept brands
  cy.intercept('GET', '**/rest/v1/brands*', {
    statusCode: 200,
    body: [
      { id: 'brand-samsung', name: 'Samsung' },
      { id: 'brand-apple', name: 'Apple' },
      { id: 'brand-motorola', name: 'Motorola' }
    ]
  }).as('getBrands');

  // Intercept suppliers
  cy.intercept('GET', '**/rest/v1/suppliers*', {
    statusCode: 200,
    body: [
      { id: 'supp-01', name: 'Distribuidor Celulares BA' }
    ]
  }).as('getSuppliers');

  // Intercept profiles & clients
  cy.intercept('GET', '**/rest/v1/profiles*', {
    statusCode: 200,
    body: [
      { id: 'cust-mock-001', first_name: 'Juan', last_name: 'Pérez', phone: '+5491122334455', email: 'juan@example.com', dni: '30111222' }
    ]
  }).as('getProfiles');

  cy.intercept('POST', '**/rest/v1/profiles*', {
    statusCode: 201,
    body: { id: 'cust-mock-001' }
  }).as('postProfile');

  // Intercept products for parts selection
  cy.intercept('GET', '**/rest/v1/products*', {
    statusCode: 200,
    body: [
      {
        id: 'prod-s21-screen',
        name: 'Módulo Pantalla Samsung S21',
        price: 35000,
        cost_price: 20000,
        stock: 5,
        is_active: true
      }
    ]
  }).as('getProductsForParts');

  // Intercept finance movements & invoices
  cy.intercept('POST', '**/rest/v1/cash_movements*', { statusCode: 201, body: { id: 'cash-001' } }).as('postCashMovement');
  cy.intercept('POST', '**/rest/v1/invoices*', { statusCode: 201, body: { id: 'inv-001', status: 'draft' } }).as('postInvoice');
}

export const setupRepairMocks = setupAdminRepairsMocks;

/**
 * Sets up mocks for the Public Realtime Tracking View (/tracking/:code)
 */
export function setupPublicTrackingMocks(validCode = 'AF-101', customDto?: any) {
  const publicDto = customDto || buildMockPublicTracking(validCode);

  cy.intercept('POST', '**/rest/v1/rpc/get_repair_tracking*', (req) => {
    const requestedCode = req.body?.p_code?.trim()?.toUpperCase();
    if (requestedCode === validCode.trim().toUpperCase()) {
      req.reply({
        statusCode: 200,
        body: [publicDto]
      });
    } else {
      req.reply({
        statusCode: 200,
        body: []
      });
    }
  }).as('getRepairTrackingRpc');
}
