const ADMIN_JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInN1YiI6IjlkYTEwYTNhLWUwMDAtNGE1ZS04NjcxLTRmNGM1NTI2NmRiZSIsInNlc3Npb25faWQiOiIwNTBjNzc5MC1jZTU3LTQ2MGQtOTk5Yi03OGE2MDQzNzZhYjEiLCJlbWFpbCI6ImV6ZXF1aWVsZW5yaWNvMTVAZ21haWwuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiaWF0IjoxNzkzMDU5OTQxLCJleHAiOjE3OTMxNDYzNDF9.2vwxWMaIb12j_A1UE6jUUKg6BKhGGybhFashd__y8LY';
const BASE_URL = 'https://arecofix.com.ar';

async function run() {
  console.log('Testing APIs...');

  // 1. GET /api/admin/dashboard/metrics
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/admin/dashboard/metrics`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_JWT}`
      }
    });
    const d = await res.json();
    console.log(`[GET /api/admin/dashboard/metrics] Status: ${res.status} (${Date.now() - t0}ms)`, Object.keys(d.data || {}));
  } catch (e) {
    console.error('Metrics failed:', e.message);
  }

  // 2. GET /api/admin/services
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/admin/services`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_JWT}`
      }
    });
    const d = await res.json();
    console.log(`[GET /api/admin/services] Status: ${res.status} (${Date.now() - t0}ms), count: ${(d.data || []).length}`);
  } catch (e) {
    console.error('Services failed:', e.message);
  }

  // 3. GET /api/academy/certificates
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/academy/certificates`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_JWT}`
      }
    });
    const d = await res.json();
    console.log(`[GET /api/academy/certificates] Status: ${res.status} (${Date.now() - t0}ms), success: ${d.success}, count: ${(d.data || []).length}`);
  } catch (e) {
    console.error('Certificates failed:', e.message);
  }

  // 4. POST /api/academy/subscribe
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/academy/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: '9da10a3a-e000-4a5e-8671-4f4c55266dbe',
        payerEmail: 'ezequielenrico15@gmail.com',
        payerName: 'Ezequiel Enrico'
      })
    });
    const d = await res.json();
    console.log(`[POST /api/academy/subscribe] Status: ${res.status} (${Date.now() - t0}ms), preference_id: ${d.data?.preference_id || d.preference_id || 'none'}, full response:`, d);
  } catch (e) {
    console.error('Subscribe failed:', e.message);
  }

  // 5. POST /functions/v1/create-trial-tenant (test call)
  try {
    const t0 = Date.now();
    const res = await fetch(`https://db.arecofix.com.ar/functions/v1/create-trial-tenant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: 'Test Audit SRL',
        subdomain: 'test-audit-' + Math.floor(Math.random() * 10000),
        adminEmail: 'test-audit@arecofix.com.ar',
        adminPassword: 'Password123!',
        turnstileToken: 'dummy-token'
      })
    });
    const d = await res.json();
    console.log(`[POST /functions/v1/create-trial-tenant] Status: ${res.status} (${Date.now() - t0}ms), response:`, d);
  } catch (e) {
    console.error('Trial function failed:', e.message);
  }
}

run();
