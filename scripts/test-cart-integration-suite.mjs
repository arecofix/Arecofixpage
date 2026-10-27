/**
 * Arecofix - E-Commerce Integration & Contract Test Suite
 * Target: Staging Supabase / PostgREST (NEVER Production)
 */

import http from 'http';
import crypto from 'crypto';

const STAGING_HOST = '127.0.0.1';
const STAGING_PORT = 3001;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg4NDUxOTI2LCJleHAiOjIxMDM4MTE5MjZ9.nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs';

// Tenant IDs for testing
const TENANT_A = '550e8400-e29b-41d4-a716-446655440000';
const TENANT_B = '00e4e8be-6e62-4713-96ab-be14d71710ac';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: STAGING_HOST,
      port: STAGING_PORT,
      ...options,
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runSuite() {
  console.log('===============================================================');
  console.log('🧪 ARECOFIX E-COMMERCE CART & CHECKOUT INTEGRATION TEST SUITE');
  console.log(`🎯 Environment: Staging PostgREST (http://${STAGING_HOST}:${STAGING_PORT})`);
  console.log(`⏰ Timestamp:   ${new Date().toISOString()}`);
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`TEST: ${name}... `);
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      console.log(`\x1b[32m✔ PASS\x1b[0m (${duration}ms)`);
      passed++;
    } catch (err) {
      const duration = Date.now() - start;
      console.log(`\x1b[31m❌ FAIL\x1b[0m (${duration}ms)`);
      console.error(`   Details: ${err.message}`);
      failed++;
    }
  }

  const runId = Date.now().toString(36);
  const guestSessionA = 'session-int-test-a-' + runId;
  const orderIdA = crypto.randomUUID();
  const orderNumberA = 'CART-A-' + runId;

  const guestSessionB = 'session-int-test-b-' + runId;
  const orderIdB = crypto.randomUUID();
  const orderNumberB = 'CART-B-' + runId;

  // 1. Anonymous createCart with guest session
  await test('1. createCart (Anonymous with guest session_id)', async () => {
    const res = await request({
      method: 'POST',
      path: '/orders',
      headers: {
        'x-guest-session': guestSessionA,
        'Prefer': 'return=representation'
      }
    }, {
      id: orderIdA,
      order_number: orderNumberA,
      status: 'cart',
      session_id: guestSessionA,
      tenant_id: TENANT_A,
      total_amount: 0
    });

    if (res.status !== 201) {
      throw new Error(`Expected HTTP 201 Created, got ${res.status}: ${JSON.stringify(res.body)}`);
    }
    if (!Array.isArray(res.body) || res.body[0]?.id !== orderIdA) {
      throw new Error(`Order ID mismatch in response: ${JSON.stringify(res.body)}`);
    }
  });

  // 2. Direct regression check: Zero 42883 errors
  await test('2. Zero 42883 (undefined function) regression check', async () => {
    const res = await request({
      method: 'GET',
      path: `/orders?session_id=eq.${guestSessionA}`,
      headers: { 'x-guest-session': guestSessionA }
    });

    if (res.status !== 200) {
      throw new Error(`GET /orders returned status ${res.status}`);
    }
    const bodyStr = JSON.stringify(res.body);
    if (bodyStr.includes('42883') || bodyStr.includes('get_current_tenant_id() does not exist')) {
      throw new Error(`Regression 42883 detected: ${bodyStr}`);
    }
  });

  // 3. Multi-tenant isolation: Tenant A session querying Tenant B order
  await test('3. Multi-tenant isolation: Tenant A cannot read Tenant B cart', async () => {
    // Create cart in Tenant B
    const createB = await request({
      method: 'POST',
      path: '/orders',
      headers: {
        'x-guest-session': guestSessionB,
        'Prefer': 'return=representation'
      }
    }, {
      id: orderIdB,
      order_number: orderNumberB,
      status: 'cart',
      session_id: guestSessionB,
      tenant_id: TENANT_B,
      total_amount: 0
    });

    if (createB.status !== 201) {
      throw new Error(`Failed to create Tenant B order: ${createB.status}`);
    }

    // Session A tries to read Tenant B's order
    const crossRead = await request({
      method: 'GET',
      path: `/orders?id=eq.${orderIdB}`,
      headers: { 'x-guest-session': guestSessionA }
    });

    if (crossRead.status !== 200) {
      throw new Error(`Expected 200 with empty list, got status ${crossRead.status}`);
    }
    if (Array.isArray(crossRead.body) && crossRead.body.length > 0) {
      throw new Error(`Tenant leak detected! Session A retrieved Tenant B order: ${JSON.stringify(crossRead.body)}`);
    }
  });

  // 4. Cart Items Upsert with correct guest session header
  await test('4. Add item to cart (order_items table insert/upsert)', async () => {
    const cartItemId = crypto.randomUUID();
    const res = await request({
      method: 'POST',
      path: '/order_items',
      headers: {
        'x-guest-session': guestSessionA,
        'Prefer': 'return=representation'
      }
    }, {
      order_id: orderIdA,
      cart_item_id: cartItemId,
      product_name: 'Pantalla OLED Test',
      quantity: 1,
      unit_price: 15000,
      subtotal: 15000,
      tenant_id: TENANT_A
    });

    if (res.status !== 201) {
      throw new Error(`Expected 201 for order_items, got ${res.status}: ${JSON.stringify(res.body)}`);
    }
  });

  // 5. Concurrency: Two parallel additions to same cart
  await test('5. Concurrency: Simultaneous additions to the same cart', async () => {
    const item1 = {
      order_id: orderIdA,
      cart_item_id: crypto.randomUUID(),
      product_name: 'Batería Paralela 1',
      quantity: 1,
      unit_price: 20000,
      subtotal: 20000,
      tenant_id: TENANT_A
    };
    const item2 = {
      order_id: orderIdA,
      cart_item_id: crypto.randomUUID(),
      product_name: 'Batería Paralela 2',
      quantity: 1,
      unit_price: 25000,
      subtotal: 25000,
      tenant_id: TENANT_A
    };

    const [res1, res2] = await Promise.all([
      request({
        method: 'POST',
        path: '/order_items',
        headers: { 'x-guest-session': guestSessionA, 'Prefer': 'return=representation' }
      }, item1),
      request({
        method: 'POST',
        path: '/order_items',
        headers: { 'x-guest-session': guestSessionA, 'Prefer': 'return=representation' }
      }, item2)
    ]);

    if (res1.status !== 201 || res2.status !== 201) {
      throw new Error(`Concurrency failed: res1=${res1.status}, res2=${res2.status}`);
    }
  });

  // 6. Idempotency of cart updates
  await test('6. Idempotency: Repeated updates to same cart preserve integrity', async () => {
    const updatePayload = { total_amount: 60000, subtotal: 60000, total: 60000 };
    const res1 = await request({
      method: 'PATCH',
      path: `/orders?id=eq.${orderIdA}`,
      headers: { 'x-guest-session': guestSessionA }
    }, updatePayload);

    const res2 = await request({
      method: 'PATCH',
      path: `/orders?id=eq.${orderIdA}`,
      headers: { 'x-guest-session': guestSessionA }
    }, updatePayload);

    if (res1.status !== 204 || res2.status !== 204) {
      throw new Error(`Expected 204 No Content for PATCH, got res1=${res1.status}, res2=${res2.status}`);
    }
  });

  // 7. PostgREST Contract Status Codes
  await test('7. Contract: PostgREST status codes (200, 400, 404)', async () => {
    // 200 OK
    const okRes = await request({ method: 'GET', path: '/orders?limit=1' });
    if (okRes.status !== 200) throw new Error(`Expected 200 on GET /orders, got ${okRes.status}`);

    // 400 Bad Request on invalid json syntax
    const badRes = await request({ method: 'POST', path: '/orders' }, '{malformed_json');
    if (badRes.status !== 400) throw new Error(`Expected 400 on malformed JSON, got ${badRes.status}`);

    // 404 Not Found on non-existent endpoint
    const notFoundRes = await request({ method: 'GET', path: '/non_existent_table_404' });
    if (notFoundRes.status !== 404) throw new Error(`Expected 404 on unknown table, got ${notFoundRes.status}`);
  });

  // Cleanup test orders
  await request({
    method: 'DELETE',
    path: `/orders?id=in.(${orderIdA})`,
    headers: { 'x-guest-session': guestSessionA }
  });
  await request({
    method: 'DELETE',
    path: `/orders?id=in.(${orderIdB})`,
    headers: { 'x-guest-session': guestSessionB }
  });

  console.log('\n===============================================================');
  console.log(`📊 SUMMARY: ${passed} PASSED | ${failed} FAILED (Total: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
