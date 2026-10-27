#!/usr/bin/env node
/**
 * Automated CORS Preflight Healthcheck for Supabase Kong Gateway
 * Verifies that custom headers (x-guest-session) are accepted in preflight OPTIONS.
 */

const targetUrl = process.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
const origin = process.env.APP_ORIGIN || 'https://arecofix.com.ar';

async function checkCorsPreflight() {
  console.log(`[CORS Healthcheck] Verifying preflight OPTIONS for: ${targetUrl}/rest/v1/orders`);
  console.log(`[CORS Healthcheck] Origin: ${origin}`);

  try {
    const response = await fetch(`${targetUrl}/rest/v1/orders`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'x-guest-session,apikey,authorization'
      }
    });

    if (response.status !== 200) {
      console.error(`❌ [CORS Healthcheck] FAILED: Status code ${response.status} (expected 200)`);
      process.exitCode = 1;
      return;
    }

    const allowHeaders = response.headers.get('access-control-allow-headers') || '';
    console.log(`[CORS Healthcheck] Access-Control-Allow-Headers: ${allowHeaders}`);

    const hasGuestSession = allowHeaders.toLowerCase().includes('x-guest-session');
    if (!hasGuestSession) {
      console.error('❌ [CORS Healthcheck] FAILED: x-guest-session is MISSING from Access-Control-Allow-Headers!');
      process.exitCode = 1;
      return;
    }

    const allowOrigin = response.headers.get('access-control-allow-origin');
    console.log(`[CORS Healthcheck] Access-Control-Allow-Origin: ${allowOrigin}`);

    if (allowOrigin !== origin && allowOrigin !== '*') {
      console.error(`❌ [CORS Healthcheck] FAILED: Origin ${origin} not permitted (got: ${allowOrigin})`);
      process.exitCode = 1;
      return;
    }

    console.log('✅ [CORS Healthcheck] PASSED: Preflight CORS is valid and permits x-guest-session.');
  } catch (err) {
    console.error('❌ [CORS Healthcheck] Network error during preflight verification:', err.message);
    process.exitCode = 1;
  }
}

checkCorsPreflight();
