/**
 * Cloudflare Pages Function — Proxy para el chatbot AI
 * Ruta: /api/generate-api
 *
 * Actúa como proxy hacia ragchat-carreras.onrender.com para:
 * 1. Evitar problemas de CORS en el browser
 * 2. Evitar bloqueos por ad-blockers (la request sale desde el propio dominio)
 * 3. Eliminar la necesidad de agregar el dominio externo al CSP del Angular
 */

const UPSTREAM_URL = 'https://ragchat-carreras.onrender.com/generate-api';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  const { request } = context;

  // Preflight CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Error al conectar con el servicio de IA', detail: String(err) }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
}
