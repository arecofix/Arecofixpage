import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { environment } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }));

  // Dynamic Sitemap optimized for Google Search Console
  server.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Static key routes
      const staticRoutes = [
        { path: '/', priority: '1.0', freq: 'daily' },
        { path: '/productos', priority: '0.9', freq: 'daily' },
        { path: '/nosotros', priority: '0.8', freq: 'monthly' },
        { path: '/contacto', priority: '0.8', freq: 'monthly' },
        { path: '/cursos', priority: '0.8', freq: 'weekly' }
      ];

      staticRoutes.forEach(route => {
        xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>${route.freq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
      });

      // Fetch dynamic routes from Supabase (Products)
      if (environment.supabaseUrl && environment.supabaseKey) {
        try {
          const fetchOptions = {
            headers: {
              'apikey': environment.supabaseKey,
              'Authorization': `Bearer ${environment.supabaseKey}`
            }
          };
          // Fetch products that are public / active
          const productsRes = await fetch(`${environment.supabaseUrl}/rest/v1/products?select=slug`, fetchOptions);
          if (productsRes.ok) {
            const products = await productsRes.json();
            products.forEach((p: any) => {
              if (p.slug) {
                xml += `  <url>\n    <loc>${baseUrl}/productos/detalle/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
              }
            });
          }
        } catch (e) {
          console.error('Error fetching products from Supabase for sitemap:', e);
        }
      }

      xml += `</urlset>`;
      
      res.header('Content-Type', 'application/xml');
      // Cache sitemap in CDN for 24 hours, but let browsers cache it for 1 hour
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      res.send(xml);
    } catch (e) {
      res.status(500).end();
    }
  });

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
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
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
