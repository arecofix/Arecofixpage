import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  console.log('Server Dist Folder:', serverDistFolder);
  console.log('Browser Dist Folder:', browserDistFolder);
  console.log('Index HTML:', indexHtml);

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware to detect bots and strictly ensure SSR functionality
  server.use((req, res, next) => {
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    const isBot = /googlebot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|bingbot/i.test(userAgent);
    
    if (isBot) {
        // Force no-cache for bots to ensure latest metadata
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        console.log(`Bot detected: ${userAgent} accessing ${req.url}`);
    }
    next();
  });

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }));

  // Special caching for SEO critical pages
  server.get('/celular', (req, res, next) => {
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    const isBot = /facebookexternalhit|whatsapp|twitterbot/i.test(userAgent);
    
    // For social bots, we want fresh content immediately. For users, cache is fine.
    if (!isBot) {
         res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    }
    next();
  }, (req, res, next) => {
      // Proceed to render
      next();
  });

  // All regular routes use the Angular engine
  server.get(/(.*)/, (req, res, next) => {
    const { originalUrl, baseUrl, headers } = req;
    
    // Check X-Forwarded-Proto for correct protocol behind proxies (like Firebase, Cloudflare)
    const protocol = headers['x-forwarded-proto'] || req.protocol;
    
    // Construct the full URL correctly.
    // 'headers.host' usually includes port if non-standard.
    // We want the URL that Angular sees to match the request exactly.
    const fullUrl = `${protocol}://${headers.host}${originalUrl}`;

    console.log(`SSR Rendering: ${fullUrl}`);

    console.log('Rendering request:', originalUrl);
    console.log('Bootstrap function:', bootstrap);
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: fullUrl,
        publicPath: browserDistFolder,
        providers: [
            { provide: APP_BASE_HREF, useValue: baseUrl },
            // Pass 'serverUrl' if needed by components, though Angular Router usually handles it via `url`
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
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
