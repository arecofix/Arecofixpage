import { Request, Response, NextFunction } from 'express';

export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const cspDirectives = [
    "default-src 'self' https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://db.arecofix.com.ar https://api.arecofix.com.ar",
    "worker-src 'self' blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.facebook.net https://*.facebook.com https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.google.com https://apis.google.com https://sdk.mercadopago.com https://*.mercadolibre.com https://*.mercadopago.com https://http2.mlstatic.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http://127.0.0.1:*",
    "frame-src 'self' https://www.google.com https://www.youtube.com https://*.facebook.com https://*.firebaseapp.com",
    "connect-src 'self' http://137.131.131.98 https://api.arecofix.com.ar http://localhost:5000 http://ipc.localhost tauri://localhost http://127.0.0.1:* ws://127.0.0.1:* https://api.mercadopago.com https://*.mercadopago.com https://*.mercadolibre.com https://db.arecofix.com.ar wss://db.arecofix.com.ar https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.google.com https://*.google.com.ar https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebase.com https://firebaseinstallations.googleapis.com https://firebase.googleapis.com https://*.facebook.com https://*.facebook.net https://huggingface.co https://ui-avatars.com https://stats.g.doubleclick.net https://dolarapi.com https://api.github.com https://ragchat-carreras.onrender.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://*.workers.dev https://*.r2.cloudflarestorage.com https://fonts.googleapis.com https://fonts.gstatic.com https://www.transparenttextures.com https://tailwindcss.com https://images.unsplash.com"
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  next();
}
