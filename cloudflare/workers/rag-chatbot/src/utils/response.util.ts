import { Env } from '../types';

export function getCorsHeaders(env: Env): HeadersInit {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, ngsw-bypass',
  };
}

export function handleCors(env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(env),
  });
}

export function jsonResponse(body: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(env),
    },
  });
}

export function isAuthorized(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  return token === env.CHATBOT_SECRET;
}
