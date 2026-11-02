import { AwsClient } from 'aws4fetch';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 0. CORS PREFLIGHT
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 1. PRESIGNED URL GENERATOR (uploads from frontend)
    if (request.method === 'POST' && url.pathname === '/api/get-upload-url') {
      return await handlePresignedUrl(request, env);
    }

    // 2. R2 ASSET PROXY — /public-assets/<key>
    // IMPORTANT: This must come before the Supabase proxy check
    if (url.pathname.startsWith('/public-assets/') &&
        (request.method === 'GET' || request.method === 'HEAD')) {
      return await handleR2Assets(request, env, ctx);
    }

    // 3. SUPABASE API CACHE PROXY — /rest/v1/*
    if (url.pathname.startsWith('/rest/v1/') && request.method === 'GET') {
      return await handleSupabaseCacheProxy(request, env, ctx);
    }

    return new Response('Not Found', {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Handler: R2 Presigned URL for uploads
// ─────────────────────────────────────────────────────────────────────────────
async function handlePresignedUrl(request, env) {
  try {
    const body = await request.json();
    const { fileName, contentType } = body;

    if (!fileName) {
      return new Response('Missing fileName', {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
      });
    }

    const aws = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    });

    const endpoint =
      `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${fileName}`;

    const signedRequest = await aws.sign(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': contentType || 'application/octet-stream' },
      aws: { signQuery: true },
    });

    return new Response(JSON.stringify({ uploadUrl: signedRequest.url }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Supabase API Cache Proxy (read-through, 5 min TTL)
// ─────────────────────────────────────────────────────────────────────────────
async function handleSupabaseCacheProxy(request, env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, { method: 'GET' });

  let response = await cache.match(cacheKey);

  if (!response) {
    const supabaseUrl = new URL(request.url);
    supabaseUrl.hostname = 'jftiyfnnaogmgvksgkbn.supabase.co';

    const supabaseResponse = await fetch(new Request(supabaseUrl.toString(), request));

    if (supabaseResponse.ok) {
      response = new Response(supabaseResponse.body, supabaseResponse);
      response.headers.set('Cache-Control', 'public, s-maxage=300, max-age=300');
      response.headers.set('Access-Control-Allow-Origin', '*');
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    } else {
      // Don't cache errors
      return supabaseResponse;
    }
  } else {
    response = new Response(response.body, response);
    response.headers.set('X-Proxy-Cache', 'HIT');
  }

  return response;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: R2 Asset Proxy (read-through, 24h TTL, never caches 404s)
//
// URL format : https://worker.arecofix.com.ar/public-assets/<tenant>/<folder>/<file>
// R2 key     : <tenant>/<folder>/<file>
// ─────────────────────────────────────────────────────────────────────────────
async function handleR2Assets(request, env, ctx) {
  const url = new URL(request.url);

  // Strip leading /public-assets/ to get the R2 object key
  const objectKey = url.pathname.replace(/^\/public-assets\//, '');

  if (!objectKey) {
    return new Response('Missing object key', {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
    });
  }

  // Check Cloudflare edge cache first (only caches successful responses)
  const cacheKey = new Request(request.url, { method: 'GET' });
  const cachedResponse = await caches.default.match(cacheKey);

  if (cachedResponse) {
    const h = new Headers(cachedResponse.headers);
    h.set('Access-Control-Allow-Origin', '*');
    h.set('X-Proxy-Cache', 'HIT');
    return new Response(cachedResponse.body, { status: cachedResponse.status, headers: h });
  }

  // Fetch object from R2 bucket
  const object = await env.ASSETS_BUCKET.get(objectKey);

  if (object === null) {
    // NEVER cache 404 — objects can be uploaded at any time
    return new Response(`Object Not Found: ${objectKey}`, {
      status: 404,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, s-maxage=86400, max-age=86400, immutable');
  headers.set('Access-Control-Allow-Origin', '*');

  const response = new Response(object.body, { headers });

  // Store in edge cache (non-blocking)
  ctx.waitUntil(caches.default.put(cacheKey, response.clone()));

  return response;
}
