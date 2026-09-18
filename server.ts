// --- INICIO PARCHE SUPABASE SSR ---
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class {
    CONNECTING = 0; OPEN = 1; CLOSING = 2; CLOSED = 3;
    readyState = 3;
    constructor(url: string, protocols?: string | string[]) {
      Promise.resolve().then(() => {
        if (typeof (this as any).onerror === 'function') (this as any).onerror(new Error('SSR'));
        if (typeof (this as any).onclose === 'function') (this as any).onclose({ code: 1000 });
      });
    }
    close() { }
    send() { }
    addEventListener(type: string, listener: any) {
      if (type === 'error' || type === 'close') {
        Promise.resolve().then(() => listener({ code: 1000 }));
      }
    }
    removeEventListener() { }
    dispatchEvent() { return true; }
  };
}
// --- FIN PARCHE SUPABASE SSR ---
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { securityMiddleware } from './server/middleware/security.middleware';
import { sitemapRoutes } from './server/routes/sitemap.routes';
import { feedRoutes } from './server/routes/feed.routes';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.disable('x-powered-by'); // Prevent backend stack leakage

  // Aplicar middlewares de seguridad y CSP
  server.use(securityMiddleware);

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine({
    allowedHosts: [
      'arecofix.com.ar',
      'www.arecofix.com.ar',
      '137.131.131.98',
      'localhost',
      '127.0.0.1',
      'arecofix.web.app',
      'arecofix.firebaseapp.com'
    ]
  });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Rutas modulares (Sitemap, Feeds, etc.)
  server.use('/', sitemapRoutes);
  server.use('/feed', feedRoutes);


  // Página de recuperación de emergencia para clientes trabados
  server.get('/recover', (req, res) => {
    res.setHeader('Clear-Site-Data', '"cache", "storage", "executionContexts"');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recuperando Arecofix...</title>
      </head>
      <body>
        <h1>Actualizando sistema... por favor espere.</h1>
        <script>
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
              setTimeout(() => {
                window.location.href = '/login';
              }, 1500);
            });
          } else {
            window.location.href = '/login';
          }
        </script>
      </body>
      </html>
    `);
  });

  // Serve static files from /browser AFTER dynamic routes
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }));

  // All regular routes use the Angular Engine
  server.get(/(.*)/, (req, res, next) => {
    const { originalUrl, baseUrl, headers } = req;

    // Check X-Forwarded-Proto for correct protocol behind proxies like Firebase / Cloud Functions
    const protocol = headers['x-forwarded-proto'] || req.protocol;
    const host = headers['x-forwarded-host'] || headers.host;

    const fullUrl = `${protocol}://${host}${originalUrl}`;

    const userAgent = headers['user-agent']?.toLowerCase() || '';
    const isBot = /googlebot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|bingbot|pinterest/i.test(userAgent);

    // Setting optimal Cache-Control headers natively for Firebase Hosting to read
    if (isBot) {
      // Bots: We want to cache metadata on the CDN for a shorter time or not at all
      // to ensure link previews update quickly when changed.
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    } else {
      // Regular Users: CDN cache for optimal performance (e.g., 1 hour)
      // Adjust these values as needed for your content update frequency
      res.set('Cache-Control', 'public, max-age=600, s-maxage=3600');
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: fullUrl,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
        ],
      })
      .then((html) => {
        // Detect 404: if the requested path doesn't match any known valid prefix,
        // return a real HTTP 404 so bots and crawlers see the correct status.
        const pathname = originalUrl.split('?')[0].replace(/\/$/, '') || '/';
        const validPrefixes = [
          '/', '/celular', '/servicios', '/productos', '/repuestos',
          '/categorias', '/nosotros', '/contacto', '/academy', '/blog',
          '/posts', '/portfolio', '/gsm', '/privacy', '/terms', '/sitemap',
          '/fixtecnicos', '/recursos', '/tracking', '/checkout', '/perfil',
          '/login', '/register', '/admin', '/upgrade-required', '/diagnostico',
          '/Zona-Norte',
        ];
        const isKnownRoute = validPrefixes.some(
          (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
        );
        if (!isKnownRoute) {
          res.status(404);
        }
        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000; // Default port for SSR server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

const mainModule = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (mainModule && (mainModule === modulePath || mainModule + '.mjs' === modulePath)) {
  run();
}
