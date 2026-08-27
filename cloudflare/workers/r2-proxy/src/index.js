import { AwsClient } from 'aws4fetch';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. GENERADOR DE PRESIGNED URLS PARA R2 (SUBIDAS DESDE FRONTEND)
    if (request.method === 'POST' && url.pathname === '/api/get-upload-url') {
      return await handlePresignedUrl(request, env);
    }

    // 2. REVERSE PROXY CACHE PARA SUPABASE API (RUTAS GET)
    if (url.pathname.startsWith('/rest/v1/') && request.method === 'GET') {
      return await handleSupabaseCacheProxy(request, env, ctx);
    }

    // 3. R2 ASSETS (RUTAS GET para imágenes)
    if (url.pathname.startsWith('/public-assets/') && request.method === 'GET') {
      return await handleR2Assets(request, env, ctx);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handlePresignedUrl(request, env) {
  try {
    const body = await request.json();
    const fileName = body.fileName;
    const contentType = body.contentType;

    if (!fileName) {
      return new Response('Missing fileName', { status: 400 });
    }

    const aws = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    });

    const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${fileName}`;
    
    const signedRequest = await aws.sign(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      },
      aws: { signQuery: true } // Esto genera una Presigned URL (Query Params)
    });

    return new Response(JSON.stringify({ uploadUrl: signedRequest.url }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

async function handleSupabaseCacheProxy(request, env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

  // Intentamos obtener de la caché primero
  let response = await cache.match(cacheKey);

  if (!response) {
    // Si no está en caché, redirigimos la petición al Supabase real
    const supabaseUrl = new URL(request.url);
    supabaseUrl.hostname = 'jftiyfnnaogmgvksgkbn.supabase.co'; // Tu proyecto

    const supabaseRequest = new Request(supabaseUrl.toString(), request);
    response = await fetch(supabaseRequest);

    // Modificamos las cabeceras para permitir caché en Cloudflare Edge por 5 minutos (300s)
    // NOTA: Ajusta el s-maxage según cuánto tiempo aceptes datos cacheados
    response = new Response(response.body, response);
    response.headers.set('Cache-Control', 'public, s-maxage=300, max-age=300');

    // Guardamos en la caché sin bloquear la respuesta al usuario
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  } else {
    // Agregar un header para depurar e identificar que vino de la caché (Opcional)
    response = new Response(response.body, response);
    response.headers.set('X-Proxy-Cache', 'HIT');
  }

  return response;
}

async function handleR2Assets(request, env, ctx) {
  const url = new URL(request.url);
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

  let response = await cache.match(cacheKey);

  if (!response) {
    // El frontend pide: /public-assets/tenant-id/products/img.webp
    // En R2 la key es: tenant-id/products/img.webp
    const objectKey = url.pathname.replace(/^\/public-assets\//, '');
    
    // Obtenemos el objeto del bucket
    const object = await env.ASSETS_BUCKET.get(objectKey);
    
    if (object === null) {
      return new Response('Object Not Found', { status: 404 });
    }
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    
    response = new Response(object.body, { headers });
    // Cache de 1 hora en Cloudflare Edge
    response.headers.set('Cache-Control', 'public, s-maxage=3600, max-age=3600');
    
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  } else {
    response = new Response(response.body, response);
    response.headers.set('X-Proxy-Cache', 'HIT');
  }
  
  return response;
}
